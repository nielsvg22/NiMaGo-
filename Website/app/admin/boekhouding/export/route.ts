import {NextRequest,NextResponse} from 'next/server';
import {isAdmin} from '@/lib/auth';
import {db} from '@/lib/db';
import {report,csvCell,type Expense,type BankRow} from '@/lib/bookkeeping';
export const dynamic='force-dynamic';
export async function GET(req:NextRequest){
 if(!await isAdmin())return new NextResponse('Niet ingelogd',{status:401});
 const type=req.nextUrl.searchParams.get('type')||'',year=Number(req.nextUrl.searchParams.get('jaar')),quarter=Number(req.nextUrl.searchParams.get('kwartaal'));
 const csv=(rows:unknown[][],name:string)=>new NextResponse('\uFEFF'+rows.map(row=>row.map(csvCell).join(';')).join('\r\n')+'\r\n',{headers:{'Content-Type':'text/csv; charset=utf-8','Content-Disposition':`attachment; filename="${name}.csv"`,'Cache-Control':'private, no-store'}});
 if(type==='sjabloon')return csv([['transactie_id','datum','bedrag','omschrijving','tegenrekening']],'bankimport-sjabloon');
 if(!['btw','facturen','uitgaven','bank','logboek'].includes(type)||!Number.isInteger(year)||year<2000||year>2200||![1,2,3,4].includes(quarter))return new NextResponse('Ongeldige selectie',{status:400});
 const r=report(year,quarter);const money=(n:number)=>(n/100).toFixed(2).replace('.',',');let rows:unknown[][]=[];
 if(type==='btw')rows=[['Post','Grondslag EUR','Btw EUR'],...[21,9,0].map(rate=>[`Verkoop ${rate}%`,money(r.rates[rate].net),money(r.rates[rate].vat)]),['Verlegde verkoop (controleer rubriek)',money(r.reverse),''],['Aftrekbare voorbelasting','',money(r.deductible)],['Indicatief btw-saldo','',money(r.balance)],['Administratief overzicht; geen ingediende aangifte','','']];
 if(type==='facturen')rows=[['Factuurnummer','Datum','Klant','Status','Excl btw EUR','Btw EUR','Totaal EUR','Btw verlegd','Betaaldatum'],...r.sales.map(x=>[x.inv.number,x.inv.issue_date,x.customer.name,x.inv.status,money(x.totals.subtotal),money(x.totals.vatTotal),money(x.totals.total),x.inv.vat_reverse?'ja':'nee',x.inv.paid_at||''])];
 if(type==='uitgaven'){const all=db().prepare('SELECT * FROM bookkeeping_expenses WHERE issue_date>=? AND issue_date<? ORDER BY issue_date,id').all(r.start,r.end) as Expense[];rows=[['ID','Datum','Leverancier','Referentie','Categorie','Excl btw EUR','Btw EUR','Btw aftrekbaar','Correctiereden','Bijlage'],...all.map(e=>[e.id,e.issue_date,e.supplier,e.reference,e.category,money(e.net_cents),money(e.vat_cents),e.vat_deductible?'ja':'nee',e.void_reason,e.receipt_name])];}
 if(type==='bank'){const all=db().prepare('SELECT * FROM bookkeeping_bank WHERE booking_date>=? AND booking_date<? ORDER BY booking_date,id').all(r.start,r.end) as BankRow[];rows=[['ID','Rekening','Transactie-ID','Datum','Bedrag EUR','Omschrijving','Tegenrekening','Factuur-ID','Uitgave-ID','Classificatie'],...all.map(b=>[b.id,b.account,b.external_id,b.booking_date,money(b.amount_cents),b.description,b.counterparty,b.invoice_id||'',b.expense_id||'',b.disposition])];}
 if(type==='logboek'){const all=db().prepare('SELECT * FROM bookkeeping_audit WHERE created_at>=? AND created_at<? ORDER BY id').all(r.start,r.end) as {id:number;created_at:string;event:string;entity:string;entity_id:number;details:string}[];rows=[['ID','Moment UTC','Gebeurtenis','Entiteit','Entiteit-ID','Gegevens'],...all.map(e=>[e.id,e.created_at,e.event,e.entity,e.entity_id,e.details])];}
 return csv(rows,`nimago-${type}-${year}-Q${quarter}`);
}
