import {NextRequest,NextResponse} from 'next/server';
const json=(body:object,status=200)=>NextResponse.json(body,{status,headers:{'Cache-Control':'no-store'}});
export async function POST(req:NextRequest){
 try{
  const raw=await req.text();if(raw.length>15000)return json({error:'Je bericht is te lang.'},413);
  const body=JSON.parse(raw);if(typeof body!=='object'||!body)return json({error:'Ongeldig bericht.'},400);
  if(body.website)return json({ok:true}); // honeypot
  const{name,email,message,company='',service=''}=body;
  if(typeof name!=='string'||name.trim().length<2||name.length>100||typeof email!=='string'||!/^\S+@\S+\.\S+$/.test(email)||email.length>150||typeof message!=='string'||message.trim().length<10||message.length>5000||typeof company!=='string'||company.length>150||typeof service!=='string'||service.length>120)return json({error:'Controleer de ingevulde velden.'},400);
  const key=process.env.RESEND_API_KEY,to=process.env.CONTACT_TO_EMAIL,from=process.env.CONTACT_FROM_EMAIL;
  if(!key||!to||!from)return json({error:'Het contactformulier is nog niet gekoppeld. Configureer eerst de zakelijke mailprovider in .env.local.'},503);
  const sanitize=(v:string)=>v.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
  const html=`<h2>Nieuwe aanvraag via NiMaGo</h2><p><b>Naam:</b> ${sanitize(name)}</p><p><b>E-mail:</b> ${sanitize(email)}</p><p><b>Bedrijf:</b> ${sanitize(company)}</p><p><b>Dienst:</b> ${sanitize(service)}</p><p><b>Bericht:</b><br>${sanitize(message).replaceAll('\n','<br>')}</p>`;
  const r=await fetch('https://api.resend.com/emails',{method:'POST',headers:{'Authorization':`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify({from,to:[to],reply_to:email,subject:`NiMaGo aanvraag van ${name.slice(0,80)}`,html})});
  if(!r.ok){console.error('Mailprovider error',r.status);return json({error:'Verzenden lukt momenteel niet. Probeer het later opnieuw.'},502)}
  return json({ok:true});
 }catch{return json({error:'Ongeldig verzoek. Probeer opnieuw.'},400)}
}
