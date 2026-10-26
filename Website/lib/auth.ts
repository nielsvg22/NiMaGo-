import crypto from 'node:crypto';import {cookies,headers} from 'next/headers';import {redirect} from 'next/navigation';
export const COOKIE='nm_admin';const TTL=60*60*12; // 12 uur
const adminPassword=()=>process.env.ADMIN_PASSWORD||'';
const secret=()=>process.env.SESSION_SECRET||crypto.createHash('sha256').update('nimago-session:'+adminPassword()).digest('hex');
export const adminEnabled=()=>adminPassword().length>=10;
const hmac=(v:string)=>crypto.createHmac('sha256',secret()).update(v).digest('hex');
export function makeToken(){const exp=Math.floor(Date.now()/1000)+TTL;const v=String(exp);return `${v}.${hmac(v)}`}
export function checkToken(t?:string|null){if(!t)return false;const [v,sig]=t.split('.');if(!v||!sig)return false;const exp=parseInt(v,10);if(!Number.isFinite(exp)||exp<Date.now()/1000)return false;const a=Buffer.from(hmac(v));const b=Buffer.from(sig);return a.length===b.length&&crypto.timingSafeEqual(a,b)}
export function checkPassword(input:string){if(!adminEnabled())return false;const a=crypto.createHash('sha256').update(input).digest();const b=crypto.createHash('sha256').update(adminPassword()).digest();return crypto.timingSafeEqual(a,b)}
export async function isAdmin(){const c=await cookies();return checkToken(c.get(COOKIE)?.value)}
export async function requireAdmin(){if(!(await isAdmin()))redirect('/admin/login')}
export async function setSession(){const c=await cookies();c.set(COOKIE,makeToken(),{httpOnly:true,sameSite:'strict',secure:process.env.NODE_ENV==='production',path:'/',maxAge:TTL})}
export async function clearSession(){const c=await cookies();c.delete(COOKIE)}
// eenvoudige rem op inlogpogingen en contactberichten (in het geheugen; voldoende voor één instantie)
const hits=new Map<string,number[]>();
export function rateLimit(key:string,max:number,windowMs:number){const now=Date.now();const arr=(hits.get(key)||[]).filter(t=>now-t<windowMs);if(arr.length>=max){hits.set(key,arr);return false}arr.push(now);hits.set(key,arr);return true}
export async function clientIp(){const h=await headers();return (h.get('x-forwarded-for')||'').split(',')[0].trim()||h.get('x-real-ip')||'onbekend'}
