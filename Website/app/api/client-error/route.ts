import {NextRequest,NextResponse} from 'next/server';import {rateLimit} from '@/lib/auth';
export const dynamic='force-dynamic';
/** Ontvangt clientfouten uit de browser en schrijft ze naar de serverlog (bekijk via Coolify > Logs). */
export async function POST(req:NextRequest){
  const ip=(req.headers.get('x-forwarded-for')||'').split(',')[0].trim()||'onbekend';
  if(!rateLimit('cerr:'+ip,20,10*60*1000))return new NextResponse(null,{status:204});
  try{const raw=await req.text();if(raw.length>6000)return new NextResponse(null,{status:204});const b=JSON.parse(raw);
    const clean=(v:unknown,n:number)=>String(v??'').replace(/[\r\n]+/g,' ').slice(0,n);
    console.error('[client-error]',JSON.stringify({where:clean(b.where,40),url:clean(b.url,200),message:clean(b.message,300),digest:clean(b.digest,40),ua:clean(b.ua,160),stack:clean(b.stack,700)}))}catch{}
  return new NextResponse(null,{status:204});
}
