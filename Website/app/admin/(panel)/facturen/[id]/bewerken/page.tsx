import {notFound,redirect} from 'next/navigation';import {db,getSetting} from '@/lib/db';import {getInvoice} from '@/lib/invoice';import InvoiceForm from '../../../InvoiceForm';
export const metadata={title:'Factuur bewerken'};
export default async function Bewerken({params,searchParams}:{params:Promise<{id:string}>;searchParams:Promise<{fout?:string}>}){
  const {id}=await params;const {fout}=await searchParams;const x=getInvoice(Number(id));if(!x)notFound();if(x.inv.status!=='concept')redirect(`/admin/facturen/${id}`);
  const customers=db().prepare('SELECT id,name FROM customers ORDER BY name').all() as {id:number;name:string}[];
  return <><div className="adm-head"><div><h1>Concept bewerken</h1></div></div><InvoiceForm customers={customers} paymentDays={Number(getSetting('payment_days','14'))||14} error={!!fout} initial={{id:x.inv.id,customer_id:x.inv.customer_id,issue_date:x.inv.issue_date,due_date:x.inv.due_date,reference:x.inv.reference,notes:x.inv.notes,vat_reverse:!!x.inv.vat_reverse,lines:x.lines.map(l=>({description:l.description,quantity:String(l.quantity).replace('.',','),price:(l.unit_cents/100).toFixed(2).replace('.',','),vat_rate:l.vat_rate}))}}/></>
}
