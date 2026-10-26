import {db,getSetting} from './db';
export type Line={id?:number;description:string;quantity:number;unit_cents:number;vat_rate:number};
export type Invoice={id:number;number:string|null;customer_id:number;status:'concept'|'verzonden'|'betaald';issue_date:string;due_date:string;reference:string;notes:string;vat_reverse:number;paid_at:string|null;created_at:string};
export type Totals={subtotal:number;vat:Record<number,number>;vatTotal:number;total:number};
export const lineTotal=(l:Line)=>Math.round(l.quantity*l.unit_cents);
export function totals(lines:Line[],vatReverse=false):Totals{const vat:Record<number,number>={};let subtotal=0;for(const l of lines){const t=lineTotal(l);subtotal+=t;if(!vatReverse)vat[l.vat_rate]=(vat[l.vat_rate]||0)+Math.round(t*l.vat_rate/100)}const vatTotal=Object.values(vat).reduce((a,b)=>a+b,0);return{subtotal,vat,vatTotal,total:subtotal+vatTotal}}
export function getInvoice(id:number){const inv=db().prepare('SELECT * FROM invoices WHERE id=?').get(id) as Invoice|undefined;if(!inv)return null;const lines=db().prepare('SELECT * FROM invoice_lines WHERE invoice_id=? ORDER BY position,id').all(id) as Line[];const customer=db().prepare('SELECT * FROM customers WHERE id=?').get(inv.customer_id) as Customer;return{inv,lines,customer,totals:totals(lines,!!inv.vat_reverse)}}
export type Customer={id:number;name:string;contact:string;email:string;address:string;postcode:string;city:string;country:string;kvk:string;vat_id:string;note:string;created_at:string};
export const isOverdue=(inv:Pick<Invoice,'status'|'due_date'>)=>inv.status==='verzonden'&&inv.due_date<new Date().toISOString().slice(0,10);
/** Wijst het eerstvolgende, aaneensluitende factuurnummer toe (bv. NM-2026-001). Gebeurt pas bij verzenden, zodat er geen gaten ontstaan. */
export function nextNumber(year:number):string{const prefix=getSetting('invoice_prefix','NM-')||'NM-';const like=`${prefix}${year}-%`;const rows=db().prepare('SELECT number FROM invoices WHERE number LIKE ?').all(like) as {number:string}[];let max=0;for(const r of rows){const n=parseInt(r.number.split('-').pop()||'0',10);if(n>max)max=n}return `${prefix}${year}-${String(max+1).padStart(3,'0')}`}
