import {recordSubmission} from '@/lib/marketing';
import {NextRequest,NextResponse} from 'next/server';import {db} from '@/lib/db';import {rateLimit} from '@/lib/auth';import {freeSlots} from '@/lib/slots';import {notifyOwner,sendMail} from '@/lib/mail';import {fmtDate} from '@/lib/money';
export const dynamic='force-dynamic';
const j=(b:object,s=200)=>NextResponse.json(b,{status:s,headers:{'Cache-Control':'no-store'}});
export async function POST(req:NextRequest){try{
  const ip=(req.headers.get('x-forwarded-for')||'').split(',')[0].trim()||'onbekend';if(!rateLimit('book:'+ip,5,60*60*1000))return j({error:'Je hebt net al meerdere afspraken aangevraagd. Probeer het later opnieuw.'},429);
  const raw=await req.text();if(raw.length>5000)return j({error:'Te veel tekst.'},413);const b=JSON.parse(raw);if(b.website)return j({ok:true});
  const {name,email,phone='',topic='',date,time}=b;
  if(typeof name!=='string'||name.trim().length<2||name.length>100||typeof email!=='string'||!/^\S+@\S+\.\S+$/.test(email)||email.length>150||typeof phone!=='string'||phone.length>40||typeof topic!=='string'||topic.length>600||typeof date!=='string'||typeof time!=='string')return j({error:'Controleer de ingevulde velden.'},400);
  if(!freeSlots(date).includes(time))return j({error:'Dit moment is helaas niet meer beschikbaar. Kies een ander moment.'},409);
  try{db().prepare('INSERT INTO appointments(name,email,phone,topic,slot) VALUES(?,?,?,?,?)').run(name.trim(),email.trim(),phone.trim(),topic.trim(),`${date} ${time}`)}catch{return j({error:'Dit moment is zojuist door iemand anders gekozen. Kies een ander moment.'},409)}
  recordSubmission(req,'booking_submit',b.marketing);
  notifyOwner(`Nieuwe afspraak: ${fmtDate(date)} ${time}`,`${name.trim()} (${email.trim()}${phone.trim()?', '+phone.trim():''}) wil een kennismaking op ${fmtDate(date)} om ${time}.\n\nOnderwerp: ${topic.trim()||'-'}\n\nBevestig in Admin > Agenda.`,email.trim());
  void sendMail({to:email.trim(),subject:'We hebben je aanvraag ontvangen',text:`Hoi ${name.trim().split(' ')[0]},\n\nBedankt voor je aanvraag voor een kennismaking op ${fmtDate(date)} om ${time}. We bevestigen deze zo snel mogelijk per e-mail. Past het moment toch niet? Reageer dan gewoon op deze mail.`});
  return j({ok:true,date,time});
}catch{return j({error:'Ongeldig verzoek.'},400)}}
