import {NextRequest,NextResponse} from 'next/server';import {rateLimit} from '@/lib/auth';import {publicPath,privacyAllowed,recordEvent,recordVital} from '@/lib/marketing';
export const dynamic='force-dynamic';
const BOT=/bot|crawl|spider|slurp|headless|lighthouse|preview|monitor|curl|wget|python|node-fetch|go-http/i;
export async function POST(req:NextRequest){const no=()=>new NextResponse(null,{status:204,headers:{'Cache-Control':'no-store'}});try{
 if(!privacyAllowed(req.headers)||BOT.test(req.headers.get('user-agent')||''))return no();
 const origin=req.headers.get('origin');if(!origin||new URL(origin).host!==req.headers.get('host'))return no();
 const ip=(req.headers.get('x-forwarded-for')||'').split(',')[0].trim()||'x';if(!rateLimit('marketing:'+ip,120,10*60*1000))return no();
 const raw=await req.text();if(raw.length>700)return no();const b=JSON.parse(raw);if(!b||typeof b!=='object')return no();const path=publicPath(b.path);if(!path)return no();
 if(b.type==='vital')recordVital(path,b.metric,b.value,b.device);else if(['cta_click','phone_click','email_click'].includes(b.event))recordEvent(b.event,path,b.ref);
 }catch{}return no()}
