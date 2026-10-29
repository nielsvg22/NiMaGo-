import {NextRequest,NextResponse} from 'next/server';import {db} from '@/lib/db';import {rateLimit} from '@/lib/auth';import {magnets} from '@/data/magnets';import {downloadToken,linksEnabled} from '@/lib/magnet-token';import {tagLead} from '@/lib/leads';import {recordSubmission} from '@/lib/marketing';import {notifyOwner,sendMail,siteUrl} from '@/lib/mail';import {scheduleNurture,unsubUrl} from '@/lib/nurture';
export const dynamic='force-dynamic';
const j=(b:object,s=200)=>NextResponse.json(b,{status:s,headers:{'Cache-Control':'no-store'}});
/** Gratis download in ruil voor naam en e-mailadres. De aanvraag wordt een lead; opvolgmails alleen met uitdrukkelijke toestemming. */
export async function POST(req:NextRequest){try{
  const ip=(req.headers.get('x-forwarded-for')||'').split(',')[0].trim()||'onbekend';if(!rateLimit('dl:'+ip,8,60*60*1000))return j({error:'Je hebt net meerdere downloads aangevraagd. Probeer het later opnieuw.'},429);
  const raw=await req.text();if(raw.length>3000)return j({error:'Ongeldig verzoek.'},413);const b=JSON.parse(raw);if(b.website)return j({ok:true});
  const origin=req.headers.get('origin');if(!origin||new URL(origin).host!==req.headers.get('host'))return j({error:'Ongeldig verzoek.'},403);
  const m=magnets.find(x=>x.slug===b.slug);const name=String(b.name||'').trim().slice(0,100),email=String(b.email||'').trim().toLowerCase().slice(0,150);
  if(!m||!linksEnabled())return j({error:'Deze download is nu niet beschikbaar.'},404);
  if(name.length<2||!/^\S+@\S+\.\S+$/.test(email))return j({error:'Vul je naam en een geldig e-mailadres in.'},400);if(!b.consent)return j({error:'Ga akkoord met de privacyverklaring om door te gaan.'},400);
  const tips=!!b.tips;const d=db();
  const ins=d.prepare("INSERT INTO messages(name,email,service,message,kind,payload) VALUES(?,?,?,?,'download',?)").run(name,email,m.short,`Download aangevraagd: ${m.title}`,JSON.stringify({Download:m.title,Opvolgmails:tips?'ja (toestemming)':'nee'}));tagLead(ins.lastInsertRowid,req,b.marketing);
  recordSubmission(req,'download_submit',b.marketing);
  if(tips){d.prepare('INSERT OR IGNORE INTO subscribers(email,source) VALUES(?,?)').run(email,'download:'+m.slug);scheduleNurture(email,name,m.slug)}
  const link=`${siteUrl()}/api/download/file?slug=${m.slug}&t=${downloadToken(m.slug,14)}`;
  void sendMail({to:email,subject:`Je download: ${m.short}`,text:`Hoi ${name.split(' ')[0]},\n\nHier is je gratis download: ${m.title}. Je kunt hem altijd opnieuw openen via de knop hieronder.\n\nVragen of hulp nodig? Reageer gerust op deze mail.\n\nDownload: ${link}`,unsubscribe:tips?unsubUrl(email):undefined});
  notifyOwner(`Nieuwe download: ${m.short}`,`Naam: ${name}\nE-mail: ${email}\nDownload: ${m.title}\nOpvolgmails: ${tips?'ja':'nee'}\n\nBekijk in Admin > Leads.`,email);
  return j({ok:true,url:`/api/download/file?slug=${m.slug}&t=${downloadToken(m.slug,1)}`});
}catch{return j({error:'Ongeldig verzoek. Probeer opnieuw.'},400)}}
