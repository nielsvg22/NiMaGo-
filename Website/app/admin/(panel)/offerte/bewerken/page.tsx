import {notFound,redirect} from 'next/navigation';import {db,getSetting} from '@/lib/db';import {getQuote} from '@/lib/portal';import InvoiceForm from '../../InvoiceForm';
export const metadata={title:'Offerte bewerken'};
export default async function Bewerken({searchParams}:{searchParams:Promise<{id?:string;fout?:string}>}){
  const {id,fout}=await searchParams;const x=getQuote(Number(id));if(!x)notFound();if(x.q.status!=='concept')redirect(`/admin/offerte?id=${id}`);
  const customers=db().prepare('SELECT id,name FROM customers ORDER BY name').all() as {id:number;name:string}[];
  return <><div className="adm-head"><div><h1>Concept bewerken</h1></div></div><InvoiceForm quote customers={customers} paymentDays={Number(getSetting('quote_days','30'))||30} error={!!fout} initial={{id:x.q.id,customer_id:x.q.customer_id,issue_date:x.q.issue_date,due_date:x.q.valid_until,reference:x.q.title,notes:x.q.notes,vat_reverse:!!x.q.vat_reverse,lines:x.lines.map(l=>({description:l.description,quantity:String(l.quantity).replace('.',','),price:(l.unit_cents/100).toFixed(2).replace('.',','),vat_rate:l.vat_rate}))}}/></>
}
