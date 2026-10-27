import crypto from 'node:crypto';import {cookies} from 'next/headers';import {redirect} from 'next/navigation';
import {db} from './db';import type {Customer} from './invoice';
/** Klantportaal: aparte sessie (cookie nm_acct) los van de admin. De handtekening hangt aan het wachtwoord-hash, dus een nieuw wachtwoord beëindigt alle sessies. */
export const ACCT_COOKIE='nm_acct';const TTL=60*60*24*14;
export type Account={id:number;email:string;name:string;pw_hash:string;salt:string;customer_id:number|null;status:'wachtend'|'actief'|'geblokkeerd';created_at:string;last_login:string|null};
const material=()=>process.env.SESSION_SECRET||((process.env.ADMIN_PASSWORD||'').length>=10?'nimago-acct:'+process.env.ADMIN_PASSWORD:'');
/** Zonder geheime sleutel (geen SESSION_SECRET en geen admin-wachtwoord) staat het portaal uit: een voorspelbare sleutel zou sessies vervalsbaar maken. */
export const portalEnabled=()=>material().length>0;
const sign=(v:string)=>crypto.createHmac('sha256',crypto.createHash('sha256').update(material()).digest('hex')).update(v).digest('hex');
export function makeAcctToken(a:Pick<Account,'id'|'pw_hash'>){const exp=Math.floor(Date.now()/1000)+TTL;const v=`${a.id}.${exp}.${a.pw_hash.slice(0,16)}`;return `${a.id}.${exp}.${sign(v)}`}
export async function currentAccount():Promise<Account|null>{
  if(!portalEnabled())return null;
  const t=(await cookies()).get(ACCT_COOKIE)?.value;if(!t)return null;
  const [idS,expS,sig]=t.split('.');const id=parseInt(idS,10),exp=parseInt(expS,10);if(!id||!Number.isFinite(exp)||exp<Date.now()/1000||!sig)return null;
  const a=db().prepare('SELECT * FROM accounts WHERE id=?').get(id) as Account|undefined;if(!a||a.status==='geblokkeerd')return null;
  const want=sign(`${a.id}.${exp}.${a.pw_hash.slice(0,16)}`);const x=Buffer.from(want),y=Buffer.from(sig);
  return x.length===y.length&&crypto.timingSafeEqual(x,y)?a:null}
export async function setAcctSession(a:Pick<Account,'id'|'pw_hash'>){(await cookies()).set(ACCT_COOKIE,makeAcctToken(a),{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',path:'/',maxAge:TTL})}
export async function clearAcctSession(){(await cookies()).delete(ACCT_COOKIE)}
export async function requireAccount(){const a=await currentAccount();if(!a)redirect('/account/inloggen');return a}
/** Geeft alleen een account terug dat door NiMaGo aan een klant is gekoppeld. Alle klantgegevens worden uitsluitend via deze klant opgehaald. */
export async function requireCustomer(){
  const a=await requireAccount();if(a.status!=='actief'||!a.customer_id)redirect('/account');
  const c=db().prepare('SELECT * FROM customers WHERE id=?').get(a.customer_id) as Customer|undefined;if(!c)redirect('/account');
  return{account:a,customer:c}}
