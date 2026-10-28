'use server';
import {redirect} from 'next/navigation';import {revalidatePath} from 'next/cache';
import {db} from '@/lib/db';import {rateLimit,clientIp} from '@/lib/auth';
import {hashPassword,verifyPassword,dummyVerify,passwordProblem} from '@/lib/pass';
import {requireCustomer,requireAccount,setAcctSession,clearAcctSession,portalEnabled,type Account} from '@/lib/account';
import {getQuote,effectiveStatus} from '@/lib/portal';import {notifyOwner,sendMail,siteUrl} from '@/lib/mail';

const str=(v:FormDataEntryValue|null,max=500)=>String(v??'').trim().slice(0,max);
const EMAIL=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function registerAccount(fd:FormData){
  if(!portalEnabled())redirect('/account/registreren?fout=uit');
  if(str(fd.get('website')))redirect('/account'); // honeypot
  const ip=await clientIp();if(!rateLimit('reg:'+ip,5,60*60*1000))redirect('/account/registreren?fout=limiet');
  const name=str(fd.get('name'),100),email=str(fd.get('email'),150).toLowerCase(),pw=String(fd.get('password')??''),pw2=String(fd.get('password2')??'');
  const keep=`&naam=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`;
  if(name.length<2||!EMAIL.test(email))redirect('/account/registreren?fout=gegevens'+keep);
  if(!fd.get('consent'))redirect('/account/registreren?fout=privacy'+keep);
  if(pw!==pw2)redirect('/account/registreren?fout=gelijk'+keep);
  if(passwordProblem(pw))redirect('/account/registreren?fout=wachtwoord'+keep);
  const d=db();if(d.prepare('SELECT 1 FROM accounts WHERE email=?').get(email))redirect('/account/registreren?fout=bestaat'+keep);
  const {salt,hash}=hashPassword(pw);
  const id=Number(d.prepare("INSERT INTO accounts(email,name,pw_hash,salt) VALUES(?,?,?,?)").run(email,name,hash,salt).lastInsertRowid);
  void sendMail({to:email,subject:'Je account is aangemaakt',text:`Hoi ${name.split(' ')[0]},\n\nWelkom bij het NiMaGo-klantportaal. Je account is aangemaakt. We koppelen het zo snel mogelijk aan je gegevens, meestal binnen één werkdag. Zodra dat is gebeurd, ontvang je een e-mail en zie je je offertes, projecten, afspraken en facturen.\n\nJe hoeft verder niets te doen.`});
  notifyOwner(`Nieuw klantaccount: ${name}`,`${name} <${email}> heeft een account aangemaakt. Koppel het aan een klant in Admin > Klantaccounts.`);
  await setAcctSession({id,pw_hash:hash});revalidatePath('/admin','layout');redirect('/account');
}
export async function loginAccount(fd:FormData){
  if(!portalEnabled())redirect('/account/inloggen?fout=uit');
  const ip=await clientIp();const email=str(fd.get('email'),150).toLowerCase(),pw=String(fd.get('password')??'');
  if(!rateLimit('acct-ip:'+ip,15,15*60*1000)||!rateLimit('acct:'+email,6,15*60*1000))redirect('/account/inloggen?fout=limiet');
  const a=db().prepare('SELECT * FROM accounts WHERE email=?').get(email) as Account|undefined;
  if(!a){dummyVerify(pw);redirect('/account/inloggen?fout=1')}
  if(!verifyPassword(pw,a.salt,a.pw_hash))redirect('/account/inloggen?fout=1');
  if(a.status==='geblokkeerd')redirect('/account/inloggen?fout=geblokkeerd');
  db().prepare("UPDATE accounts SET last_login=datetime('now') WHERE id=?").run(a.id);
  await setAcctSession(a);redirect('/account');
}
export async function logoutAccount(){await clearAcctSession();redirect('/account/inloggen')}

export async function changeProfile(fd:FormData){
  const a=await requireAccount();const name=str(fd.get('name'),100);if(name.length<2)redirect('/account/profiel?fout=naam');
  db().prepare('UPDATE accounts SET name=? WHERE id=?').run(name,a.id);redirect('/account/profiel?ok=profiel');
}
export async function changePassword(fd:FormData){
  const a=await requireAccount();if(!rateLimit('pw:'+a.id,6,15*60*1000))redirect('/account/profiel?fout=limiet');
  const cur=String(fd.get('current')??''),pw=String(fd.get('password')??''),pw2=String(fd.get('password2')??'');
  if(!verifyPassword(cur,a.salt,a.pw_hash))redirect('/account/profiel?fout=huidig');
  if(pw!==pw2)redirect('/account/profiel?fout=gelijk');if(passwordProblem(pw))redirect('/account/profiel?fout=wachtwoord');
  const {salt,hash}=hashPassword(pw);db().prepare('UPDATE accounts SET pw_hash=?,salt=? WHERE id=?').run(hash,salt,a.id);
  await setAcctSession({id:a.id,pw_hash:hash}); // andere sessies vervallen doordat het hash verandert
  redirect('/account/profiel?ok=wachtwoord');
}

/** Een bericht van de klant aan NiMaGo; verschijnt in de admin onder Klantberichten. */
function notifyAdmin(customerId:number,body:string,author:string,projectId:number|null=null,subject?:string){
  db().prepare("INSERT INTO portal_messages(customer_id,project_id,direction,body,author) VALUES(?,?,'klant',?,?)").run(customerId,projectId,body,author);
  notifyOwner(subject||`Klantbericht van ${author}`,`${body}\n\nAntwoord in Admin > Klantberichten.`);
}
export async function sendPortalMessage(fd:FormData){
  const {account,customer}=await requireCustomer();
  if(!rateLimit('pmsg:'+account.id,20,60*60*1000))redirect('/account/berichten?fout=limiet');
  const body=str(fd.get('body'),3000);
  let pid:number|null=null;const raw=Number(fd.get('project_id')||0);
  if(raw){const p=db().prepare('SELECT id FROM projects WHERE id=? AND customer_id=? AND visible=1').get(raw,customer.id) as {id:number}|undefined;if(!p)redirect('/account/projecten');pid=p.id}
  const to=pid?`/account/project?id=${pid}`:'/account/berichten';
  if(body.length<2)redirect(`${to}${to.includes('?')?'&':'?'}fout=leeg`);
  notifyAdmin(customer.id,body,account.name,pid);revalidatePath('/admin','layout');redirect(`${to}${to.includes('?')?'&':'?'}ok=1`);
}
export async function acceptQuote(fd:FormData){
  const {account,customer}=await requireCustomer();const id=Number(fd.get('id'));
  const x=getQuote(id);if(!x||x.q.customer_id!==customer.id||x.q.status==='concept')redirect('/account/offertes');
  const to=`/account/offerte?id=${id}`;
  if(effectiveStatus(x.q)!=='verzonden')redirect(`${to}&fout=status`);
  const name=str(fd.get('name'),100);if(name.length<2||!fd.get('agree'))redirect(`${to}&fout=akkoord`);
  const r=db().prepare("UPDATE quotes SET status='geaccepteerd',accepted_at=datetime('now'),accepted_name=? WHERE id=? AND customer_id=? AND status='verzonden'").run(name,id,customer.id);
  if(r.changes){notifyAdmin(customer.id,`Offerte ${x.q.number} is geaccepteerd door ${name}.`,account.name,null,`Offerte ${x.q.number} geaccepteerd`);void sendMail({to:account.email,subject:`Bedankt voor je akkoord op offerte ${x.q.number}`,text:`Hoi ${name.split(' ')[0]},\n\nBedankt voor je akkoord op offerte ${x.q.number}${x.q.title?' ('+x.q.title+')':''}. We nemen binnenkort contact met je op over de start van het project.\n\nJe volgt de voortgang in je klantportaal: ${siteUrl()}/account/projecten`})}
  revalidatePath('/admin','layout');redirect(`${to}&ok=geaccepteerd`);
}
export async function declineQuote(fd:FormData){
  const {account,customer}=await requireCustomer();const id=Number(fd.get('id'));
  const x=getQuote(id);if(!x||x.q.customer_id!==customer.id||x.q.status==='concept')redirect('/account/offertes');
  const to=`/account/offerte?id=${id}`;if(effectiveStatus(x.q)!=='verzonden')redirect(`${to}&fout=status`);
  const reason=str(fd.get('reason'),1000);
  const r=db().prepare("UPDATE quotes SET status='afgewezen',decline_reason=? WHERE id=? AND customer_id=? AND status='verzonden'").run(reason,id,customer.id);
  if(r.changes)notifyAdmin(customer.id,`Offerte ${x.q.number} is afgewezen door ${account.name}.${reason?`\nReden: ${reason}`:''}`,account.name,null,`Offerte ${x.q.number} afgewezen`);
  revalidatePath('/admin','layout');redirect(`${to}&ok=afgewezen`);
}
