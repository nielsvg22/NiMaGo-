import {NextRequest,NextResponse} from 'next/server';
const enc=new TextEncoder();
async function sig(value:string,secret:string){const key=await crypto.subtle.importKey('raw',enc.encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);const s=await crypto.subtle.sign('HMAC',key,enc.encode(value));return Array.from(new Uint8Array(s)).map(b=>b.toString(16).padStart(2,'0')).join('')}
async function sha256hex(v:string){const d=await crypto.subtle.digest('SHA-256',enc.encode(v));return Array.from(new Uint8Array(d)).map(b=>b.toString(16).padStart(2,'0')).join('')}
export async function middleware(req:NextRequest){
  const {pathname}=req.nextUrl;
  if(!pathname.startsWith('/admin')){const h=new Headers(req.headers);h.set('x-pathname',pathname);return NextResponse.next({request:{headers:h}})} // pad doorgeven aan canonical en JSON-LD
  if(pathname==='/admin/login')return NextResponse.next();
  const token=req.cookies.get('nm_admin')?.value;let ok=false;
  if(token){const [v,s]=token.split('.');const exp=parseInt(v||'',10);const pw=process.env.ADMIN_PASSWORD||'';
    const secret=process.env.SESSION_SECRET||await sha256hex('nimago-session:'+pw);
    if(v&&s&&Number.isFinite(exp)&&exp>Date.now()/1000&&pw.length>=10){ok=(await sig(v,secret))===s}}
  if(ok)return NextResponse.next();
  const url=req.nextUrl.clone();url.pathname='/admin/login';url.search='';return NextResponse.redirect(url);
}
export const config={matcher:['/((?!_next/|api/|.*\\..*).*)']};
