'use server';
import {redirect} from 'next/navigation';import {revalidatePath} from 'next/cache';
import {db,setSetting,SETTING_KEYS,getSetting} from '@/lib/db';
import {requireAdmin,checkPassword,setSession,clearSession,rateLimit,clientIp,adminEnabled} from '@/lib/auth';
import {parseEuro,today,addDays} from '@/lib/money';
import {nextNumber,type Invoice} from '@/lib/invoice';
import {audit} from '@/lib/bookkeeping';
import {nextQuoteNumber,STAGES,type Quote} from '@/lib/portal';
import {hashPassword,passwordProblem} from '@/lib/pass';import {sendMail,siteUrl} from '@/lib/mail';

const str=(v:FormDataEntryValue|null,max=500)=>String(v??'').trim().slice(0,max);

export async function login(_prev:{error?:string}|undefined,fd:FormData):Promise<{error?:string}>{
  if(!adminEnabled())return{error:'De admin is nog niet ingesteld. Zet ADMIN_PASSWORD (minimaal 10 tekens) in de omgevingsvariabelen.'};
  const ip=await clientIp();
  if(!rateLimit('login:'+ip,6,15*60*1000))return{error:'Te veel pogingen. Probeer het over een kwartier opnieuw.'};
  if(!checkPassword(String(fd.get('password')??'')))return{error:'Dat wachtwoord klopt niet.'};
  await setSession();redirect('/admin');
}
export async function logout(){await clearSession();redirect('/admin/login')}

export async function saveCustomer(fd:FormData){
  await requireAdmin();
  const id=Number(fd.get('id')||0);const name=str(fd.get('name'),160);if(!name)redirect(id?`/admin/klant?id=${id}&fout=naam`:'/admin/klanten/nieuw?fout=naam');
  const v=[name,str(fd.get('contact'),120),str(fd.get('email'),160),str(fd.get('address'),200),str(fd.get('postcode'),20),str(fd.get('city'),100),str(fd.get('country'),80)||'Nederland',str(fd.get('kvk'),30),str(fd.get('vat_id'),30),str(fd.get('note'),1000)];
  if(id)db().prepare('UPDATE customers SET name=?,contact=?,email=?,address=?,postcode=?,city=?,country=?,kvk=?,vat_id=?,note=? WHERE id=?').run(...v,id);
  else db().prepare('INSERT INTO customers(name,contact,email,address,postcode,city,country,kvk,vat_id,note) VALUES(?,?,?,?,?,?,?,?,?,?)').run(...v);
  revalidatePath('/admin/klanten');
  const back=str(fd.get('back'),200);redirect(back.startsWith('/admin/')?back:'/admin/klanten');
}
export async function deleteCustomer(fd:FormData){
  await requireAdmin();const id=Number(fd.get('id'));
  const n=['invoices','quotes','projects','bookkeeping_rules'].reduce((t,tb)=>t+(db().prepare(`SELECT COUNT(*) c FROM ${tb} WHERE customer_id=?`).get(id) as {c:number}).c,0);
  if(n>0)redirect(`/admin/klant?id=${id}&fout=heeftfacturen`);
  db().prepare('DELETE FROM customers WHERE id=?').run(id);revalidatePath('/admin/klanten');redirect('/admin/klanten');
}

type LineIn={description:string;quantity:number;unit_cents:number;vat_rate:number};
function parseLines(raw:string):LineIn[]{
  let arr:unknown;try{arr=JSON.parse(raw)}catch{return[]}
  if(!Array.isArray(arr))return[];
  return arr.slice(0,100).map((l:any)=>({description:String(l?.description??'').trim().slice(0,600),quantity:Math.max(0,Math.min(100000,Number(String(l?.quantity??'1').replace(',','.'))||0)),unit_cents:parseEuro(String(l?.price??'0')),vat_rate:[0,9,21].includes(Number(l?.vat_rate))?Number(l.vat_rate):21})).filter(l=>l.description&&l.quantity>0);
}
export async function saveInvoice(fd:FormData){
  await requireAdmin();
  const id=Number(fd.get('id')||0);const customer=Number(fd.get('customer_id')||0);
  const lines=parseLines(String(fd.get('lines')||'[]'));
  const issue=str(fd.get('issue_date'),10)||today();const due=str(fd.get('due_date'),10)||addDays(issue,Number(getSetting('payment_days','14'))||14);
  const bad=!customer||!lines.length||!/^\d{4}-\d{2}-\d{2}$/.test(issue)||!/^\d{4}-\d{2}-\d{2}$/.test(due);
  if(bad)redirect(id?`/admin/factuur/bewerken?id=${id}&fout=1`:'/admin/facturen/nieuw?fout=1');
  const reference=str(fd.get('reference'),120),notes=str(fd.get('notes'),2000),rev=fd.get('vat_reverse')?1:0;
  const d=db();
  const tx=d.transaction(()=>{
    let invId=id;
    if(id){const cur=d.prepare('SELECT status FROM invoices WHERE id=?').get(id) as {status:string}|undefined;if(!cur||cur.status!=='concept')throw new Error('locked');
      d.prepare('UPDATE invoices SET customer_id=?,issue_date=?,due_date=?,reference=?,notes=?,vat_reverse=? WHERE id=?').run(customer,issue,due,reference,notes,rev,id);d.prepare('DELETE FROM invoice_lines WHERE invoice_id=?').run(id)}
    else invId=Number(d.prepare('INSERT INTO invoices(customer_id,issue_date,due_date,reference,notes,vat_reverse) VALUES(?,?,?,?,?,?)').run(customer,issue,due,reference,notes,rev).lastInsertRowid);
    const ins=d.prepare('INSERT INTO invoice_lines(invoice_id,position,description,quantity,unit_cents,vat_rate) VALUES(?,?,?,?,?,?)');
    lines.forEach((l,i)=>ins.run(invId,i,l.description,l.quantity,l.unit_cents,l.vat_rate));
    return invId;
  });
  let invId:number;try{invId=tx()}catch{redirect('/admin/facturen?fout=vergrendeld')}
  revalidatePath('/admin/facturen');redirect(`/admin/factuur?id=${invId}`);
}
export async function finalizeInvoice(fd:FormData){
  await requireAdmin();const id=Number(fd.get('id'));const d=db();
  d.transaction(()=>{const inv=d.prepare('SELECT * FROM invoices WHERE id=?').get(id) as Invoice|undefined;if(!inv||inv.status!=='concept')return;
    const n=(d.prepare('SELECT COUNT(*) c FROM invoice_lines WHERE invoice_id=?').get(id) as {c:number}).c;if(!n)return;
    const year=Number(inv.issue_date.slice(0,4))||new Date().getFullYear();
    d.prepare("UPDATE invoices SET number=?,status='verzonden' WHERE id=?").run(nextNumber(year),id);audit('factuur_definitief','factuur',id,{})})();
  revalidatePath('/admin/facturen');redirect(`/admin/factuur?id=${id}`);
}
export async function markPaid(fd:FormData){await requireAdmin();const id=Number(fd.get('id')),paidAt=str(fd.get('paid_at'),10)||today();db().transaction(()=>{const result=db().prepare("UPDATE invoices SET status='betaald',paid_at=? WHERE id=? AND status='verzonden'").run(paidAt,id);if(result.changes)audit('betaling_handmatig','factuur',id,{paid_at:paidAt})}).immediate();revalidatePath('/admin','layout');redirect(`/admin/factuur?id=${id}`)}
export async function markUnpaid(fd:FormData){await requireAdmin();const id=Number(fd.get('id'));db().transaction(()=>{db().prepare('UPDATE bookkeeping_bank SET invoice_id=NULL WHERE invoice_id=?').run(id);const result=db().prepare("UPDATE invoices SET status='verzonden',paid_at=NULL WHERE id=? AND status='betaald'").run(id);if(result.changes)audit('betaling_handmatig_teruggezet','factuur',id,{})}).immediate();revalidatePath('/admin','layout');redirect(`/admin/factuur?id=${id}`)}
export async function deleteInvoice(fd:FormData){await requireAdmin();const id=Number(fd.get('id'));db().prepare("DELETE FROM invoices WHERE id=? AND status='concept'").run(id);revalidatePath('/admin/facturen');redirect('/admin/facturen')}
export async function duplicateInvoice(fd:FormData){
  await requireAdmin();const id=Number(fd.get('id'));const d=db();
  const newId=d.transaction(()=>{const inv=d.prepare('SELECT * FROM invoices WHERE id=?').get(id) as Invoice|undefined;if(!inv)return 0;
    const issue=today();const days=Number(getSetting('payment_days','14'))||14;
    const nid=Number(d.prepare('INSERT INTO invoices(customer_id,issue_date,due_date,reference,notes,vat_reverse) VALUES(?,?,?,?,?,?)').run(inv.customer_id,issue,addDays(issue,days),inv.reference,inv.notes,inv.vat_reverse).lastInsertRowid);
    d.prepare('INSERT INTO invoice_lines(invoice_id,position,description,quantity,unit_cents,vat_rate) SELECT ?,position,description,quantity,unit_cents,vat_rate FROM invoice_lines WHERE invoice_id=?').run(nid,id);return nid})();
  revalidatePath('/admin/facturen');redirect(newId?`/admin/factuur/bewerken?id=${newId}`:'/admin/facturen');
}

export async function saveSettings(fd:FormData){
  await requireAdmin();
  for(const k of SETTING_KEYS){let v=str(fd.get(k),k==='footer_note'?800:200);if(k==='quote_days')v=String(Math.max(1,Math.min(365,parseInt(v,10)||30)));if(k==='payment_days')v=String(Math.max(1,Math.min(120,parseInt(v,10)||14)));if(k==='iban')v=v.replace(/\s+/g,' ').toUpperCase();setSetting(k,v)}
  revalidatePath('/admin','layout');redirect('/admin/instellingen?opgeslagen=1');
}
export async function toggleMessage(fd:FormData){await requireAdmin();const id=Number(fd.get('id'));db().prepare('UPDATE messages SET is_read=1-is_read WHERE id=?').run(id);revalidatePath('/admin','layout')}
export async function deleteMessage(fd:FormData){await requireAdmin();db().prepare('DELETE FROM messages WHERE id=?').run(Number(fd.get('id')));revalidatePath('/admin','layout')}

/** Wist klanten, facturen en berichten (niet de instellingen). Bedoeld om te testen voordat je live gaat; vraagt om de tekst WISSEN. */
export async function resetData(fd:FormData){
  await requireAdmin();
  if(String(fd.get('confirm')||'').trim()!=='WISSEN')redirect('/admin/instellingen?wisfout=1');
  const d=db();
  const locked=d.prepare("SELECT (SELECT COUNT(*) FROM bookkeeping_audit)+(SELECT COUNT(*) FROM invoices WHERE status!='concept') n").get() as {n:number};
  if(locked.n)redirect('/admin/instellingen?boekhouding=1');
  d.transaction(()=>{d.exec("DELETE FROM invoice_lines; DELETE FROM invoices; DELETE FROM customers; DELETE FROM messages; DELETE FROM portal_messages; DELETE FROM project_updates; DELETE FROM projects; DELETE FROM quote_lines; DELETE FROM quotes; DELETE FROM appointments WHERE customer_id IS NOT NULL; UPDATE accounts SET customer_id=NULL,status='wachtend' WHERE status='actief'; DELETE FROM sqlite_sequence WHERE name IN ('invoice_lines','invoices','customers','messages','portal_messages','project_updates','projects','quote_lines','quotes');")})();
  revalidatePath('/admin','layout');redirect('/admin/instellingen?gewist=1');
}

export async function setAppointmentStatus(fd:FormData){
  await requireAdmin();const id=Number(fd.get('id'));const st=String(fd.get('status'));if(!['aangevraagd','bevestigd','geannuleerd','afgerond'].includes(st))return;
  const ap=db().prepare('SELECT name,email,slot FROM appointments WHERE id=?').get(id) as {name:string;email:string;slot:string}|undefined;
  db().prepare('UPDATE appointments SET status=? WHERE id=?').run(st,id);
  if(ap&&st==='bevestigd')void sendMail({to:ap.email,subject:'Je afspraak is bevestigd',text:`Hoi ${ap.name.split(' ')[0]},\n\nJe kennismaking met NiMaGo is bevestigd.\n\nDatum: ${ap.slot.slice(8,10)}-${ap.slot.slice(5,7)}-${ap.slot.slice(0,4)}\nTijd: ${ap.slot.slice(11)}\n\nVerhinderd? Reageer dan gewoon op deze mail, dan plannen we een ander moment.`});
  if(ap&&st==='geannuleerd')void sendMail({to:ap.email,subject:'Je afspraak is geannuleerd',text:`Hoi ${ap.name.split(' ')[0]},\n\nDe afspraak op ${ap.slot.slice(8,10)}-${ap.slot.slice(5,7)}-${ap.slot.slice(0,4)} om ${ap.slot.slice(11)} is geannuleerd. Wil je een nieuw moment kiezen? Dat kan op onze website of door te reageren op deze mail.`});revalidatePath('/admin','layout');
}
export async function deleteSubscriber(fd:FormData){await requireAdmin();db().prepare('DELETE FROM subscribers WHERE id=?').run(Number(fd.get('id')));revalidatePath('/admin/nieuwsbrief')}

/* ───── Offertes ───── */
export async function saveQuote(fd:FormData){
  await requireAdmin();
  const id=Number(fd.get('id')||0);const customer=Number(fd.get('customer_id')||0);const lines=parseLines(String(fd.get('lines')||'[]'));
  const issue=str(fd.get('issue_date'),10)||today();const valid=str(fd.get('due_date'),10)||addDays(issue,Number(getSetting('quote_days','30'))||30);
  const bad=!customer||!lines.length||!/^\d{4}-\d{2}-\d{2}$/.test(issue)||!/^\d{4}-\d{2}-\d{2}$/.test(valid);
  if(bad)redirect(id?`/admin/offerte/bewerken?id=${id}&fout=1`:'/admin/offertes/nieuw?fout=1');
  const title=str(fd.get('reference'),160),notes=str(fd.get('notes'),2000),rev=fd.get('vat_reverse')?1:0;const d=db();
  const tx=d.transaction(()=>{let qid=id;
    if(id){const cur=d.prepare('SELECT status FROM quotes WHERE id=?').get(id) as {status:string}|undefined;if(!cur||cur.status!=='concept')throw new Error('locked');
      d.prepare('UPDATE quotes SET customer_id=?,issue_date=?,valid_until=?,title=?,notes=?,vat_reverse=? WHERE id=?').run(customer,issue,valid,title,notes,rev,id);d.prepare('DELETE FROM quote_lines WHERE quote_id=?').run(id)}
    else qid=Number(d.prepare('INSERT INTO quotes(customer_id,issue_date,valid_until,title,notes,vat_reverse) VALUES(?,?,?,?,?,?)').run(customer,issue,valid,title,notes,rev).lastInsertRowid);
    const ins=d.prepare('INSERT INTO quote_lines(quote_id,position,description,quantity,unit_cents,vat_rate) VALUES(?,?,?,?,?,?)');lines.forEach((l,i)=>ins.run(qid,i,l.description,l.quantity,l.unit_cents,l.vat_rate));return qid});
  let qid:number;try{qid=tx()}catch{redirect('/admin/offertes?fout=vergrendeld')}
  revalidatePath('/admin/offertes');redirect(`/admin/offerte?id=${qid}`);
}
export async function sendQuote(fd:FormData){
  await requireAdmin();const id=Number(fd.get('id'));const d=db();
  d.transaction(()=>{const q=d.prepare('SELECT * FROM quotes WHERE id=?').get(id) as Quote|undefined;if(!q||q.status!=='concept')return;
    const em=(d.prepare('SELECT email FROM customers WHERE id=?').get(q.customer_id) as {email:string}|undefined)?.email;if(em)setTimeout(()=>void sendMail({to:em,subject:'Je offerte staat klaar',text:`Er staat een nieuwe offerte voor je klaar${q.title?': '+q.title:''}. Bekijk en accepteer hem in je klantportaal: ${siteUrl()}/account/offertes`}),0);
    if(!(d.prepare('SELECT COUNT(*) c FROM quote_lines WHERE quote_id=?').get(id) as {c:number}).c)return;
    d.prepare("UPDATE quotes SET number=?,status='verzonden' WHERE id=?").run(nextQuoteNumber(Number(q.issue_date.slice(0,4))||new Date().getFullYear()),id)})();
  revalidatePath('/admin/offertes');redirect(`/admin/offerte?id=${id}`);
}
export async function setQuoteStatus(fd:FormData){
  await requireAdmin();const id=Number(fd.get('id'));const st=String(fd.get('status'));if(!['geaccepteerd','afgewezen','verzonden'].includes(st))return;
  if(st==='geaccepteerd')db().prepare("UPDATE quotes SET status='geaccepteerd',accepted_at=datetime('now'),accepted_name=CASE WHEN accepted_name='' THEN 'Buiten het portaal bevestigd' ELSE accepted_name END WHERE id=? AND status IN ('verzonden','afgewezen')").run(id);
  else if(st==='afgewezen')db().prepare("UPDATE quotes SET status='afgewezen' WHERE id=? AND status='verzonden'").run(id);
  else db().prepare("UPDATE quotes SET status='verzonden',accepted_at=NULL WHERE id=? AND status IN ('afgewezen','geaccepteerd')").run(id);
  revalidatePath('/admin/offertes');redirect(`/admin/offerte?id=${id}`);
}
export async function deleteQuote(fd:FormData){await requireAdmin();db().prepare("DELETE FROM quotes WHERE id=? AND status='concept'").run(Number(fd.get('id')));revalidatePath('/admin/offertes');redirect('/admin/offertes')}
export async function duplicateQuote(fd:FormData){
  await requireAdmin();const id=Number(fd.get('id'));const d=db();
  const nid=d.transaction(()=>{const q=d.prepare('SELECT * FROM quotes WHERE id=?').get(id) as Quote|undefined;if(!q)return 0;const t=today();
    const n=Number(d.prepare('INSERT INTO quotes(customer_id,issue_date,valid_until,title,notes,vat_reverse) VALUES(?,?,?,?,?,?)').run(q.customer_id,t,addDays(t,Number(getSetting('quote_days','30'))||30),q.title,q.notes,q.vat_reverse).lastInsertRowid);
    d.prepare('INSERT INTO quote_lines(quote_id,position,description,quantity,unit_cents,vat_rate) SELECT ?,position,description,quantity,unit_cents,vat_rate FROM quote_lines WHERE quote_id=?').run(n,id);return n})();
  revalidatePath('/admin/offertes');redirect(nid?`/admin/offerte/bewerken?id=${nid}`:'/admin/offertes');
}
/** Maakt van een geaccepteerde offerte een conceptfactuur met dezelfde regels. */
export async function quoteToInvoice(fd:FormData){
  await requireAdmin();const id=Number(fd.get('id'));const d=db();
  const nid=d.transaction(()=>{const q=d.prepare("SELECT * FROM quotes WHERE id=? AND status='geaccepteerd'").get(id) as Quote|undefined;if(!q)return 0;const t=today();
    const n=Number(d.prepare('INSERT INTO invoices(customer_id,issue_date,due_date,reference,notes,vat_reverse) VALUES(?,?,?,?,?,?)').run(q.customer_id,t,addDays(t,Number(getSetting('payment_days','14'))||14),q.number?`Offerte ${q.number}${q.title?' - '+q.title:''}`.slice(0,120):q.title,'',q.vat_reverse).lastInsertRowid);
    d.prepare('INSERT INTO invoice_lines(invoice_id,position,description,quantity,unit_cents,vat_rate) SELECT ?,position,description,quantity,unit_cents,vat_rate FROM quote_lines WHERE quote_id=?').run(n,id);return n})();
  revalidatePath('/admin/facturen');redirect(nid?`/admin/factuur?id=${nid}`:`/admin/offerte?id=${id}`);
}

/* ───── Projecten ───── */
const dateOrEmpty=(v:FormDataEntryValue|null)=>{const s=str(v,10);return /^\d{4}-\d{2}-\d{2}$/.test(s)?s:''};
export async function saveProject(fd:FormData){
  await requireAdmin();const id=Number(fd.get('id')||0);const customer=Number(fd.get('customer_id')||0);const title=str(fd.get('title'),160);
  if(!customer||!title)redirect(id?`/admin/project?id=${id}&fout=1`:'/admin/projecten/nieuw?fout=1');
  const stage=Math.max(0,Math.min(STAGES.length-1,parseInt(String(fd.get('stage')),10)||0)),progress=Math.max(0,Math.min(100,parseInt(String(fd.get('progress')),10)||0));
  const v=[customer,title,str(fd.get('description'),3000),stage,progress,dateOrEmpty(fd.get('start_date')),dateOrEmpty(fd.get('deadline')),fd.get('visible')?1:0];
  let pid=id;if(id)db().prepare('UPDATE projects SET customer_id=?,title=?,description=?,stage=?,progress=?,start_date=?,deadline=?,visible=? WHERE id=?').run(...v,id);
  else pid=Number(db().prepare('INSERT INTO projects(customer_id,title,description,stage,progress,start_date,deadline,visible) VALUES(?,?,?,?,?,?,?,?)').run(...v).lastInsertRowid);
  revalidatePath('/admin/projecten');redirect(`/admin/project?id=${pid}&ok=1`);
}
export async function deleteProject(fd:FormData){await requireAdmin();db().prepare('DELETE FROM projects WHERE id=?').run(Number(fd.get('id')));revalidatePath('/admin/projecten');redirect('/admin/projecten')}
export async function addProjectUpdate(fd:FormData){
  await requireAdmin();const pid=Number(fd.get('project_id'));const title=str(fd.get('title'),160);const body=str(fd.get('body'),3000);
  if(!title||!db().prepare('SELECT 1 FROM projects WHERE id=?').get(pid))redirect(`/admin/project?id=${pid}&fout=update`);
  db().prepare('INSERT INTO project_updates(project_id,title,body,visible) VALUES(?,?,?,?)').run(pid,title,body,fd.get('visible')?1:0);
  const p=Math.max(0,Math.min(100,parseInt(String(fd.get('progress')),10)));if(Number.isFinite(p)&&String(fd.get('progress')??'')!=='')db().prepare('UPDATE projects SET progress=? WHERE id=?').run(p,pid);
  if(fd.get('visible')){const em=(db().prepare('SELECT c.email FROM projects p JOIN customers c ON c.id=p.customer_id WHERE p.id=? AND p.visible=1').get(pid) as {email:string}|undefined)?.email;if(em)void sendMail({to:em,subject:`Update: ${title}`,text:`Er is een nieuwe update over je project: ${title}\n\nLees het in je klantportaal: ${siteUrl()}/account/projecten`})}
  redirect(`/admin/project?id=${pid}&ok=update`);
}
export async function deleteProjectUpdate(fd:FormData){await requireAdmin();const pid=Number(fd.get('project_id'));db().prepare('DELETE FROM project_updates WHERE id=? AND project_id=?').run(Number(fd.get('id')),pid);redirect(`/admin/project?id=${pid}`)}

/* ───── Klantaccounts en berichten ───── */
export async function activateAccount(fd:FormData){
  await requireAdmin();const id=Number(fd.get('id'));const d=db();
  const a=d.prepare('SELECT * FROM accounts WHERE id=?').get(id) as {id:number;name:string;email:string}|undefined;if(!a)redirect('/admin/accounts');
  let cid=Number(fd.get('customer_id')||0);
  if(!cid){const name=str(fd.get('new_name'),160)||a.name;cid=Number(d.prepare('INSERT INTO customers(name,contact,email) VALUES(?,?,?)').run(name,a.name,a.email).lastInsertRowid)}
  else if(!d.prepare('SELECT 1 FROM customers WHERE id=?').get(cid))redirect('/admin/accounts?fout=klant');
  d.prepare("UPDATE accounts SET customer_id=?,status='actief' WHERE id=?").run(cid,id);
  void sendMail({to:a.email,subject:'Je klantaccount is geactiveerd',text:`Hoi ${a.name.split(' ')[0]},\n\nJe account is gekoppeld. Je kunt nu inloggen op ${siteUrl()}/account/inloggen om je offertes, projecten, afspraken en facturen te bekijken.`});revalidatePath('/admin','layout');redirect('/admin/accounts?ok=actief');
}
export async function setAccountStatus(fd:FormData){
  await requireAdmin();const id=Number(fd.get('id'));const st=String(fd.get('status'));
  if(st==='geblokkeerd')db().prepare("UPDATE accounts SET status='geblokkeerd' WHERE id=?").run(id);
  else if(st==='actief')db().prepare("UPDATE accounts SET status=CASE WHEN customer_id IS NULL THEN 'wachtend' ELSE 'actief' END WHERE id=?").run(id);
  else if(st==='wachtend')db().prepare("UPDATE accounts SET status='wachtend',customer_id=NULL WHERE id=?").run(id); // ontkoppelen
  revalidatePath('/admin','layout');redirect('/admin/accounts');
}
export async function setAccountPassword(fd:FormData){
  await requireAdmin();const id=Number(fd.get('id'));const pw=String(fd.get('password')??'');const bad=passwordProblem(pw);if(bad)redirect('/admin/accounts?fout=wachtwoord');
  const {salt,hash}=hashPassword(pw);db().prepare('UPDATE accounts SET pw_hash=?,salt=? WHERE id=?').run(hash,salt,id);redirect('/admin/accounts?ok=wachtwoord');
}
export async function deleteAccount(fd:FormData){await requireAdmin();db().prepare('DELETE FROM accounts WHERE id=?').run(Number(fd.get('id')));revalidatePath('/admin','layout');redirect('/admin/accounts')}
export async function replyPortal(fd:FormData){
  await requireAdmin();const cid=Number(fd.get('customer_id'));const body=str(fd.get('body'),3000);const pid=Number(fd.get('project_id')||0)||null;
  if(body&&db().prepare('SELECT 1 FROM customers WHERE id=?').get(cid))db().prepare("INSERT INTO portal_messages(customer_id,project_id,direction,body,author,is_read) VALUES(?,?,'nimago',?,?,0)").run(cid,pid,body,'NiMaGo');
  const em=(db().prepare('SELECT email FROM customers WHERE id=?').get(cid) as {email:string}|undefined)?.email;if(body&&em)void sendMail({to:em,subject:'Nieuw bericht van NiMaGo',text:`Je hebt een nieuw bericht in je klantportaal: ${siteUrl()}/account/berichten`});
  revalidatePath('/admin','layout');redirect(`/admin/klantberichten#k${cid}`);
}
export async function markPortalRead(fd:FormData){await requireAdmin();db().prepare("UPDATE portal_messages SET is_read=1 WHERE customer_id=? AND direction='klant'").run(Number(fd.get('customer_id')));revalidatePath('/admin','layout')}
export async function planAppointment(fd:FormData){
  await requireAdmin();const cid=Number(fd.get('customer_id'));const date=str(fd.get('date'),10),time=str(fd.get('time'),5);const topic=str(fd.get('topic'),300);
  const c=db().prepare('SELECT name,email FROM customers WHERE id=?').get(cid) as {name:string;email:string}|undefined;
  if(!c||!/^\d{4}-\d{2}-\d{2}$/.test(date)||!/^\d{2}:\d{2}$/.test(time))redirect('/admin/agenda?fout=gegevens');
  try{db().prepare("INSERT INTO appointments(name,email,topic,slot,status,customer_id) VALUES(?,?,?,?,'bevestigd',?)").run(c.name,c.email||'-',topic,`${date} ${time}`,cid)}catch{redirect('/admin/agenda?fout=bezet')}
  revalidatePath('/admin/agenda');redirect('/admin/agenda?ok=gepland');
}
