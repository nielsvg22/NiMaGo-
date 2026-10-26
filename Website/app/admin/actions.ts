'use server';
import {redirect} from 'next/navigation';import {revalidatePath} from 'next/cache';
import {db,setSetting,SETTING_KEYS,getSetting} from '@/lib/db';
import {requireAdmin,checkPassword,setSession,clearSession,rateLimit,clientIp,adminEnabled} from '@/lib/auth';
import {parseEuro,today,addDays} from '@/lib/money';
import {nextNumber,type Invoice} from '@/lib/invoice';

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
  const n=(db().prepare('SELECT COUNT(*) c FROM invoices WHERE customer_id=?').get(id) as {c:number}).c;
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
    d.prepare("UPDATE invoices SET number=?,status='verzonden' WHERE id=?").run(nextNumber(year),id)})();
  revalidatePath('/admin/facturen');redirect(`/admin/factuur?id=${id}`);
}
export async function markPaid(fd:FormData){await requireAdmin();const id=Number(fd.get('id'));db().prepare("UPDATE invoices SET status='betaald',paid_at=? WHERE id=? AND status='verzonden'").run(str(fd.get('paid_at'),10)||today(),id);revalidatePath('/admin');redirect(`/admin/factuur?id=${id}`)}
export async function markUnpaid(fd:FormData){await requireAdmin();const id=Number(fd.get('id'));db().prepare("UPDATE invoices SET status='verzonden',paid_at=NULL WHERE id=? AND status='betaald'").run(id);revalidatePath('/admin');redirect(`/admin/factuur?id=${id}`)}
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
  for(const k of SETTING_KEYS){let v=str(fd.get(k),k==='footer_note'?800:200);if(k==='payment_days')v=String(Math.max(1,Math.min(120,parseInt(v,10)||14)));if(k==='iban')v=v.replace(/\s+/g,' ').toUpperCase();setSetting(k,v)}
  revalidatePath('/admin','layout');redirect('/admin/instellingen?opgeslagen=1');
}
export async function toggleMessage(fd:FormData){await requireAdmin();const id=Number(fd.get('id'));db().prepare('UPDATE messages SET is_read=1-is_read WHERE id=?').run(id);revalidatePath('/admin','layout')}
export async function deleteMessage(fd:FormData){await requireAdmin();db().prepare('DELETE FROM messages WHERE id=?').run(Number(fd.get('id')));revalidatePath('/admin','layout')}

/** Wist klanten, facturen en berichten (niet de instellingen). Bedoeld om te testen voordat je live gaat; vraagt om de tekst WISSEN. */
export async function resetData(fd:FormData){
  await requireAdmin();
  if(String(fd.get('confirm')||'').trim()!=='WISSEN')redirect('/admin/instellingen?wisfout=1');
  const d=db();
  d.transaction(()=>{d.exec("DELETE FROM invoice_lines; DELETE FROM invoices; DELETE FROM customers; DELETE FROM messages; DELETE FROM sqlite_sequence WHERE name IN ('invoice_lines','invoices','customers','messages');")})();
  revalidatePath('/admin','layout');redirect('/admin/instellingen?gewist=1');
}
