import {db,getSetting} from './db';import {totals,type Line} from './invoice';
export const STAGES=['Kennismaking','Voorstel','Ontwerp','Bouw','Testen','Live','Onderhoud'] as const;
export type Quote={id:number;number:string|null;customer_id:number;title:string;status:'concept'|'verzonden'|'geaccepteerd'|'afgewezen'|'verlopen';issue_date:string;valid_until:string;notes:string;vat_reverse:number;accepted_at:string|null;accepted_name:string;decline_reason:string;created_at:string};
export type Project={id:number;customer_id:number;title:string;description:string;stage:number;progress:number;start_date:string;deadline:string;visible:number;created_at:string};
export type Update={id:number;project_id:number;title:string;body:string;visible:number;created_at:string};
export type PMessage={id:number;customer_id:number;project_id:number|null;direction:'klant'|'nimago';body:string;author:string;is_read:number;created_at:string};
export const todayIso=()=>new Date().toISOString().slice(0,10);
/** Een verzonden offerte die voorbij de geldigheidsdatum is, geldt als verlopen (de rij wordt niet aangepast, zodat de admin hem nog kan heropenen via een nieuwe offerte). */
export const effectiveStatus=(q:Pick<Quote,'status'|'valid_until'>)=>q.status==='verzonden'&&q.valid_until<todayIso()?'verlopen':q.status;
export function getQuote(id:number){const q=db().prepare('SELECT * FROM quotes WHERE id=?').get(id) as Quote|undefined;if(!q)return null;const lines=db().prepare('SELECT * FROM quote_lines WHERE quote_id=? ORDER BY position,id').all(id) as Line[];const customer=db().prepare('SELECT * FROM customers WHERE id=?').get(q.customer_id) as import('./invoice').Customer;return{q,lines,customer,totals:totals(lines,!!q.vat_reverse)}}
export function nextQuoteNumber(year:number):string{const prefix=getSetting('quote_prefix','OF-')||'OF-';const rows=db().prepare('SELECT number FROM quotes WHERE number LIKE ?').all(`${prefix}${year}-%`) as {number:string}[];let max=0;for(const r of rows){const n=parseInt(r.number.split('-').pop()||'0',10);if(n>max)max=n}return `${prefix}${year}-${String(max+1).padStart(3,'0')}`}
export const stageLabel=(n:number)=>STAGES[Math.max(0,Math.min(STAGES.length-1,n))];
export const fmtDateTime=(s:string)=>{const d=new Date(s.replace(' ','T')+'Z');return new Intl.DateTimeFormat('nl-NL',{timeZone:'Europe/Amsterdam',day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'}).format(d)};
export const unreadFromCustomers=()=>(db().prepare("SELECT COUNT(*) c FROM portal_messages WHERE direction='klant' AND is_read=0").get() as {c:number}).c;
export const pendingAccounts=()=>(db().prepare("SELECT COUNT(*) c FROM accounts WHERE status='wachtend'").get() as {c:number}).c;
