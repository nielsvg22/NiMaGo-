import {NextRequest,NextResponse} from 'next/server';import {db} from '@/lib/db';import {rateLimit} from '@/lib/auth';
export const dynamic='force-dynamic';
const j=(b:object,s=200)=>NextResponse.json(b,{status:s,headers:{'Cache-Control':'no-store'}});
export async function POST(req:NextRequest){try{
  const ip=(req.headers.get('x-forwarded-for')||'').split(',')[0].trim()||'onbekend';if(!rateLimit('nl:'+ip,5,60*60*1000))return j({error:'Probeer het later opnieuw.'},429);
  const raw=await req.text();if(raw.length>1000)return j({error:'Ongeldig verzoek.'},400);const b=JSON.parse(raw);if(b.website)return j({ok:true});
  const email=String(b.email||'').trim().toLowerCase();if(!/^\S+@\S+\.\S+$/.test(email)||email.length>150)return j({error:'Vul een geldig e-mailadres in.'},400);if(!b.consent)return j({error:'Geef toestemming om je aan te melden.'},400);
  db().prepare('INSERT OR IGNORE INTO subscribers(email,source) VALUES(?,?)').run(email,String(b.source||'').slice(0,60));return j({ok:true});
}catch{return j({error:'Ongeldig verzoek.'},400)}}
