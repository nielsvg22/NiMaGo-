import {publicPath,privacyAllowed} from '@/lib/marketing';
import {NextRequest,NextResponse} from 'next/server';import {db} from '@/lib/db';import {rateLimit} from '@/lib/auth';
export const dynamic='force-dynamic';
const BOT=/bot|crawl|spider|slurp|headless|lighthouse|preview|monitor|curl|wget|python|node-fetch|go-http/i;
/** Cookieloze bezoekteller: alleen pagina, dag en verwijzende site. Geen IP-adres, geen apparaat-ID, geen cookies. */
export async function POST(req:NextRequest){
  const no=()=>new NextResponse(null,{status:204});
  try{if(!privacyAllowed(req.headers))return no();if(BOT.test(req.headers.get('user-agent')||''))return no();
    const ip=(req.headers.get('x-forwarded-for')||'').split(',')[0].trim()||'x';if(!rateLimit('hit:'+ip,120,10*60*1000))return no();
    const raw=await req.text();if(raw.length>600)return no();const b=JSON.parse(raw);let path=String(b.path||'/').split('?')[0].split('#')[0].slice(0,120);
    if(!publicPath(path))return no();path=path.replace(/\/+$/,'')||'/';
    let ref='';try{const u=new URL(String(b.ref||''));const host=req.headers.get('host')||'';if(u.hostname&&u.hostname!==host.split(':')[0])ref=u.hostname.replace(/^www\./,'').slice(0,80)}catch{}
    const day=new Date().toLocaleDateString('en-CA',{timeZone:'Europe/Amsterdam'});
    db().prepare('INSERT INTO pageviews(day,path,referrer,count) VALUES(?,?,?,1) ON CONFLICT(day,path,referrer) DO UPDATE SET count=count+1').run(day,path,ref);
  }catch{}return no()}
