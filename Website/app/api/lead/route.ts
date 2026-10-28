import {recordSubmission} from '@/lib/marketing';
import {NextRequest,NextResponse} from 'next/server';import {db} from '@/lib/db';import {rateLimit} from '@/lib/auth';import {notifyOwner,sendMail} from '@/lib/mail';
export const dynamic='force-dynamic';
const j=(b:object,s=200)=>NextResponse.json(b,{status:s,headers:{'Cache-Control':'no-store'}});
const str=(v:unknown,n:number)=>String(v??'').replace(/\u0000/g,'').trim().slice(0,n);
/** Aanvragen met extra velden (offerte, website-scan). Komen in de admin bij Berichten. */
export async function POST(req:NextRequest){try{
  const ip=(req.headers.get('x-forwarded-for')||'').split(',')[0].trim()||'onbekend';if(!rateLimit('lead:'+ip,5,60*60*1000))return j({error:'Je hebt net al meerdere aanvragen gedaan. Probeer het later opnieuw.'},429);
  const raw=await req.text();if(raw.length>12000)return j({error:'Te veel tekst.'},413);const b=JSON.parse(raw);if(b.website)return j({ok:true});
  const kind=b.kind==='scan'?'scan':'offerte';const name=str(b.name,100),email=str(b.email,150),company=str(b.company,150);
  if((kind==='offerte'&&name.length<2)||!/^\S+@\S+\.\S+$/.test(email))return j({error:'Controleer je naam en e-mailadres.'},400);
  if(kind==='scan'&&!b.consent)return j({error:'Geef toestemming om contact met je op te nemen.'},400);
  const payload=b.payload&&typeof b.payload==='object'?b.payload as Record<string,unknown>:{};const clean:Record<string,string>={};for(const [k,v] of Object.entries(payload).slice(0,20))clean[str(k,40)]=Array.isArray(v)?v.map(x=>str(x,100)).join(', '):str(v,1500);
  const message=kind==='offerte'?str(clean['Omschrijving']||'Offerte-aanvraag',1500):`Website-check voor ${str(clean['Website'],200)} (score ${str(clean['Score'],10)}). Wil graag meer uitleg.`;
  db().prepare('INSERT INTO messages(name,email,company,service,message,kind,payload) VALUES(?,?,?,?,?,?,?)').run(name||'Website-check',email,company,str(clean['Dienst']||'',120),message,kind,JSON.stringify(clean));
  recordSubmission(req,kind==='offerte'?'quote_submit':'scan_submit',b.marketing);
  notifyOwner(kind==='offerte'?`Nieuwe offerte-aanvraag van ${name}`:'Nieuwe website-check aanvraag',`${name||'-'} <${email}> ${company?'('+company+')':''}\n\n${message}\n\n${Object.entries(clean).map(([k,v])=>k+': '+v).join('\n')}`,email);
  void sendMail({to:email,subject:kind==='offerte'?'We hebben je offerte-aanvraag ontvangen':'We hebben je aanvraag voor de website-check ontvangen',text:`Hoi${name?' '+name.split(' ')[0]:''},\n\n${kind==='offerte'?'Bedankt voor je offerte-aanvraag. We bekijken je wensen en nemen contact op om de volgende stap te bespreken.':'Bedankt voor je interesse in de website-check. We nemen contact met je op om de uitkomst toe te lichten.'}`});
  return j({ok:true});
}catch{return j({error:'Ongeldig verzoek.'},400)}}
