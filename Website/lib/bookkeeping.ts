import {db,getSetting} from './db';
import {getInvoice,type Invoice} from './invoice';
import {addDays,today} from './money';

export const CATEGORIES=['Software en abonnementen','Hosting en infrastructuur','Kantoor en materialen','Marketing','Reis- en verblijfkosten','Advies en administratie','Overige zakelijke kosten'] as const;
export type Expense={id:number;supplier:string;reference:string;issue_date:string;category:string;net_cents:number;vat_cents:number;vat_deductible:number;receipt:string;receipt_type:string;receipt_name:string;void_reason:string};
export type BankRow={id:number;account:string;external_id:string;booking_date:string;amount_cents:number;description:string;counterparty:string;invoice_id:number|null;expense_id:number|null;disposition:string};
export type Rule={id:number;customer_id:number;description:string;amount_cents:number;vat_rate:number;vat_reverse:number;months:number;anchor_day:number;next_date:string;active:number};
export function validDate(s:string){return /^\d{4}-\d{2}-\d{2}$/.test(s)&&Number(s.slice(0,4))>=2000&&Number(s.slice(0,4))<=2200&&!Number.isNaN(Date.parse(s+'T12:00:00Z'))&&new Date(s+'T12:00:00Z').toISOString().slice(0,10)===s}
/** Geld in hele centen, zonder stilzwijgend afronden of ongeldige invoer naar nul. */
export function cents(s:string):number{
  const v=s.trim().replace(/€/g,'').replace(/\s/g,'');
  if(!/^-?(?:\d+|\d{1,3}(?:\.\d{3})+)(?:,\d{1,2})?$/.test(v)&&! /^-?\d+(?:\.\d{1,2})?$/.test(v))throw new Error('Gebruik een geldig bedrag, bijvoorbeeld 125,50.');
  const normalized=v.includes(',')?v.replace(/\./g,'').replace(',','.'):/^-?\d{1,3}(?:\.\d{3})+$/.test(v)?v.replace(/\./g,''):v;
  const n=Math.round(Number(normalized)*100);
  if(!Number.isSafeInteger(n)||Math.abs(n)>10000000000)throw new Error('Het bedrag is te groot.');return n;
}
export function audit(event:string,entity:string,id:number,details:unknown){db().prepare('INSERT INTO bookkeeping_audit(event,entity,entity_id,details) VALUES(?,?,?,?)').run(event,entity,id,JSON.stringify(details))}
export function nextPeriod(date:string,months:number,anchor:number){const d=new Date(date+'T12:00:00Z');d.setUTCDate(1);d.setUTCMonth(d.getUTCMonth()+months);const last=new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth()+1,0)).getUTCDate();d.setUTCDate(Math.min(anchor,last));return d.toISOString().slice(0,10)}
/** Eén atomaire verwerking. Unieke periode + SQLite-schrijftransactie voorkomen dubbele concepten. */
export function processRecurring(asOf=today()){
  if(!validDate(asOf))throw new Error('Ongeldige verwerkingsdatum.');
  const d=db();return d.transaction(()=>{let count=0;const rules=d.prepare('SELECT * FROM bookkeeping_rules WHERE active=1 AND next_date<=? ORDER BY id').all(asOf) as Rule[];
    for(const rule of rules){let date=rule.next_date;let loops=0;while(date<=asOf&&loops++<120){
      const exists=d.prepare('SELECT 1 FROM bookkeeping_runs WHERE rule_id=? AND period_date=?').get(rule.id,date);
      if(!exists){const paymentDays=Math.max(1,Math.min(365,Number(getSetting('payment_days','14'))||14));const id=Number(d.prepare('INSERT INTO invoices(customer_id,issue_date,due_date,reference,notes,vat_reverse) VALUES(?,?,?,?,?,?)').run(rule.customer_id,date,addDays(date,paymentDays),`Abonnement ${rule.id} · ${date}`,'Automatisch aangemaakt als concept. Controleer vóór definitief maken.',rule.vat_reverse).lastInsertRowid);
        d.prepare('INSERT INTO invoice_lines(invoice_id,position,description,quantity,unit_cents,vat_rate) VALUES(?,0,?,1,?,?)').run(id,rule.description,rule.amount_cents,rule.vat_rate);
        d.prepare('INSERT INTO bookkeeping_runs(rule_id,period_date,invoice_id) VALUES(?,?,?)').run(rule.id,date,id);audit('concept_aangemaakt','abonnement',rule.id,{invoice_id:id,period:date});count++;
      }date=nextPeriod(date,rule.months,rule.anchor_day);
    }d.prepare('UPDATE bookkeeping_rules SET next_date=? WHERE id=?').run(date,rule.id)}return count;
  }).immediate();
}
/** CSV met aanhalingstekens, escaped quotes en regeleinden binnen cellen. */
export function parseCSV(input:string):string[][]{
 const text=input.replace(/^\uFEFF/,'');const first=text.split(/\r?\n/)[0]||'';const sep=first.includes(';')?';':',';const rows:string[][]=[];let row:string[]=[];let value='';let quoted=false;let closed=false;
 for(let i=0;i<text.length;i++){const c=text[i];if(quoted){if(c==='"'){if(text[i+1]==='"'){value+='"';i++}else{quoted=false;closed=true}}else value+=c;continue}
 if(c==='"'){if(value||closed)throw new Error('Ongeldige aanhalingstekens in CSV.');quoted=true;continue}
 if(c===sep||c==='\n'||c==='\r'){row.push(value.trim());value='';closed=false;if(c!==sep){if(c==='\r'&&text[i+1]==='\n')i++;if(row.some(Boolean))rows.push(row);row=[]}continue}
 if(closed&&!/\s/.test(c))throw new Error('Ongeldige CSV-cel.');if(!closed)value+=c;
 }if(quoted)throw new Error('Niet-afgesloten aanhalingstekens in CSV.');row.push(value.trim());if(row.some(Boolean))rows.push(row);return rows;
}
export type ImportRow={external_id:string;booking_date:string;amount_cents:number;description:string;counterparty:string};
export function bankCSV(text:string):ImportRow[]{const rows=parseCSV(text);const header=rows.shift();if(!header)throw new Error('Het bestand is leeg.');const expected=['transactie_id','datum','bedrag','omschrijving','tegenrekening'];if(header.length!==5||expected.some((h,i)=>h!==header[i].toLowerCase()))throw new Error('Gebruik het CSV-sjabloon met transactie_id;datum;bedrag;omschrijving;tegenrekening.');if(rows.length>5000)throw new Error('Importeer maximaal 5.000 transacties tegelijk.');if(!rows.length)throw new Error('Het bestand bevat geen transacties.');
 return rows.map((r,i)=>{if(r.length!==5||!r[0]||r[0].length>160||!validDate(r[1])||!r[3]||r[3].length>2000||r[4].length>120)throw new Error(`Controleer regel ${i+2}: ID, ISO-datum, omschrijving en tegenrekening.`);const amount=cents(r[2]);if(!amount)throw new Error(`Regel ${i+2}: bedrag mag niet nul zijn.`);return{external_id:r[0],booking_date:r[1],amount_cents:amount,description:r[3],counterparty:r[4]}});
}
export function importBank(account:string,rows:ImportRow[]){if(!/^[A-Z0-9 -]{4,50}$/.test(account))throw new Error('Vul een vaste rekeningnaam of IBAN in.');const d=db();return d.transaction(()=>{let added=0,duplicates=0;for(const r of rows){const existing=d.prepare('SELECT * FROM bookkeeping_bank WHERE account=? AND external_id=?').get(account,r.external_id) as BankRow|undefined;if(existing){if(existing.booking_date!==r.booking_date||existing.amount_cents!==r.amount_cents||existing.description!==r.description||existing.counterparty!==r.counterparty)throw new Error(`Transactie ${r.external_id} bestaat met andere gegevens. Er is niets geïmporteerd.`);duplicates++;continue}d.prepare('INSERT INTO bookkeeping_bank(account,external_id,booking_date,amount_cents,description,counterparty) VALUES(?,?,?,?,?,?)').run(account,r.external_id,r.booking_date,r.amount_cents,r.description,r.counterparty);added++}audit('bankimport','bank',0,{account,added,duplicates});return{added,duplicates}}).immediate()}
export function matchCandidates(row:BankRow){if(row.amount_cents<=0||row.invoice_id||row.expense_id||row.disposition)return[];const invoices=db().prepare("SELECT id FROM invoices WHERE status='verzonden' AND number IS NOT NULL AND issue_date<=? AND id NOT IN (SELECT invoice_id FROM bookkeeping_bank WHERE invoice_id IS NOT NULL)").all(row.booking_date) as {id:number}[];return invoices.map(({id})=>getInvoice(id)!).filter(x=>{if(!x?.inv.number||x.totals.total!==row.amount_cents)return false;const escaped=x.inv.number.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');return new RegExp('(^|[^A-Za-z0-9_/-])'+escaped+'($|[^A-Za-z0-9_/-])','i').test(row.description)})}
export function confirmMatch(bankId:number,invoiceId:number){const d=db();d.transaction(()=>{const row=d.prepare('SELECT * FROM bookkeeping_bank WHERE id=?').get(bankId) as BankRow|undefined;if(!row||!matchCandidates(row).some(x=>x.inv.id===invoiceId))throw new Error('Deze betaling past niet meer bij de factuur. Vernieuw het overzicht.');d.prepare('UPDATE bookkeeping_bank SET invoice_id=? WHERE id=?').run(invoiceId,bankId);d.prepare("UPDATE invoices SET status='betaald',paid_at=? WHERE id=? AND status='verzonden'").run(row.booking_date,invoiceId);audit('betaling_gekoppeld','bank',bankId,{invoice_id:invoiceId,amount_cents:row.amount_cents})}).immediate()}
export function report(year:number,quarter:number){const start=`${year}-${String((quarter-1)*3+1).padStart(2,'0')}-01`;const end=nextPeriod(start,3,1);const ids=db().prepare("SELECT id FROM invoices WHERE status!='concept' AND issue_date>=? AND issue_date<?").all(start,end) as {id:number}[];const sales=ids.map(({id})=>getInvoice(id)!);const expenses=db().prepare("SELECT * FROM bookkeeping_expenses WHERE void_reason='' AND issue_date>=? AND issue_date<? ORDER BY issue_date,id").all(start,end) as Expense[];let revenue=0,outputVat=0,reverse=0;const rates:Record<number,{net:number;vat:number}>={0:{net:0,vat:0},9:{net:0,vat:0},21:{net:0,vat:0}};for(const x of sales){revenue+=x.totals.subtotal;outputVat+=x.totals.vatTotal;if(x.inv.vat_reverse){reverse+=x.totals.subtotal;continue}for(const l of x.lines){const rate=rates[l.vat_rate]||(rates[l.vat_rate]={net:0,vat:0});const n=Math.round(l.quantity*l.unit_cents);rate.net+=n;rate.vat+=Math.round(n*l.vat_rate/100)}}const deductible=expenses.reduce((n,e)=>n+(e.vat_deductible?e.vat_cents:0),0);const costs=expenses.reduce((n,e)=>n+e.net_cents+(e.vat_deductible?0:e.vat_cents),0);return{start,end,sales,expenses,revenue,outputVat,reverse,rates,deductible,costs,balance:outputVat-deductible,result:revenue-costs}}
export function openInvoices(){return (db().prepare("SELECT id FROM invoices WHERE status='verzonden' ORDER BY due_date,id").all() as Pick<Invoice,'id'>[]).map(({id})=>getInvoice(id)!)}
export const csvCell=(v:unknown)=>{let s=String(v??'');if(/^[=+\-@\t\r\n]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"'};
