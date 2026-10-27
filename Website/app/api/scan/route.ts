import {NextRequest,NextResponse} from 'next/server';import {rateLimit} from '@/lib/auth';import {normalizeUrl,scan} from '@/lib/scan';
export const dynamic='force-dynamic';export const maxDuration=30;
const j=(b:object,s=200)=>NextResponse.json(b,{status:s,headers:{'Cache-Control':'no-store'}});
export async function POST(req:NextRequest){try{
  const ip=(req.headers.get('x-forwarded-for')||'').split(',')[0].trim()||'onbekend';
  if(!rateLimit('scan:'+ip,6,60*60*1000)||!rateLimit('scan:all',120,60*60*1000))return j({error:'Er zijn net veel checks uitgevoerd. Probeer het over een uur opnieuw.'},429);
  const raw=await req.text();if(raw.length>1000)return j({error:'Ongeldig verzoek.'},400);const b=JSON.parse(raw);
  const u=normalizeUrl(String(b.url||''));if(!u)return j({error:'Vul een geldig websiteadres in, bijvoorbeeld www.jouwbedrijf.nl.'},400);
  try{return j(await scan(u))}catch(e){const m=e instanceof Error?e.message:'';return j({error:m&&!/ENOTFOUND|ECONN|EAI_AGAIN/i.test(m)?m:'We konden deze website niet bereiken. Controleer het adres.'},422)}
}catch{return j({error:'Ongeldig verzoek.'},400)}}
