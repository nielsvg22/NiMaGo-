import {NextRequest,NextResponse} from 'next/server';import {db} from '@/lib/db';import {rateLimit} from '@/lib/auth';import {notifyOwner,sendMail} from '@/lib/mail';
export const dynamic='force-dynamic';
const json=(body:object,status=200)=>NextResponse.json(body,{status,headers:{'Cache-Control':'no-store'}});
/** Berichten worden altijd opgeslagen in de admin (Berichten). Een mailmelding via Resend is optioneel en mislukt zonder het formulier te breken. */
export async function POST(req:NextRequest){
 try{
  const ip=(req.headers.get('x-forwarded-for')||'').split(',')[0].trim()||'onbekend';
  if(!rateLimit('contact:'+ip,5,60*60*1000))return json({error:'Je hebt net al meerdere berichten gestuurd. Probeer het later opnieuw.'},429);
  const raw=await req.text();if(raw.length>15000)return json({error:'Je bericht is te lang.'},413);
  const body=JSON.parse(raw);if(typeof body!=='object'||!body)return json({error:'Ongeldig bericht.'},400);
  if(body.website)return json({ok:true}); // honeypot
  const{name,email,message,company='',service=''}=body;
  if(typeof name!=='string'||name.trim().length<2||name.length>100||typeof email!=='string'||!/^\S+@\S+\.\S+$/.test(email)||email.length>150||typeof message!=='string'||message.trim().length<10||message.length>5000||typeof company!=='string'||company.length>150||typeof service!=='string'||service.length>120)return json({error:'Controleer de ingevulde velden.'},400);
  db().prepare('INSERT INTO messages(name,email,company,service,message) VALUES(?,?,?,?,?)').run(name.trim(),email.trim(),company.trim(),service.trim(),message.trim());
  notifyOwner(`Nieuw bericht van ${name.trim()}`,`Naam: ${name.trim()}\nE-mail: ${email.trim()}\nBedrijf: ${company.trim()}\nDienst: ${service.trim()}\n\n${message.trim()}`,email.trim());
  void sendMail({to:email.trim(),subject:'Bedankt voor je bericht',text:`Hoi ${name.trim().split(' ')[0]},\n\nBedankt voor je bericht. We hebben het ontvangen en reageren meestal binnen één werkdag.\n\nJe bericht:\n${message.trim().slice(0,1500)}`});
  const key=process.env.RESEND_API_KEY,to=process.env.CONTACT_TO_EMAIL,from=process.env.CONTACT_FROM_EMAIL;
  if(key&&to&&from){try{
    const sanitize=(v:string)=>v.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
    const html=`<h2>Nieuwe aanvraag via NiMaGo</h2><p><b>Naam:</b> ${sanitize(name)}</p><p><b>E-mail:</b> ${sanitize(email)}</p><p><b>Bedrijf:</b> ${sanitize(company)}</p><p><b>Dienst:</b> ${sanitize(service)}</p><p><b>Bericht:</b><br>${sanitize(message).replaceAll('\n','<br>')}</p>`;
    const r=await fetch('https://api.resend.com/emails',{method:'POST',headers:{'Authorization':`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify({from,to:[to],reply_to:email,subject:`NiMaGo aanvraag van ${name.slice(0,80)}`,html})});
    if(!r.ok)console.error('Mailprovider error',r.status)}catch(e){console.error('Mailprovider fout')}}
  return json({ok:true});
 }catch{return json({error:'Ongeldig verzoek. Probeer opnieuw.'},400)}
}
