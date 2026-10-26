import {db,getSetting} from '@/lib/db';import {today,addDays} from '@/lib/money';import InvoiceForm from '../../InvoiceForm';
export const metadata={title:'Nieuwe factuur'};
export default async function Nieuw({searchParams}:{searchParams:Promise<{fout?:string;klant?:string}>}){
  const {fout,klant}=await searchParams;const customers=db().prepare('SELECT id,name FROM customers ORDER BY name').all() as {id:number;name:string}[];const days=Number(getSetting('payment_days','14'))||14;const t=today();
  return <><div className="adm-head"><div><h1>Nieuwe factuur</h1><p className="adm-sub">Het factuurnummer wordt toegekend zodra je de factuur definitief maakt.</p></div></div>
  {customers.length===0?<p className="alert info">Voeg eerst een <a href="/admin/klanten/nieuw?back=/admin/facturen/nieuw"><u>klant</u></a> toe.</p>:<InvoiceForm customers={customers} paymentDays={days} error={!!fout} initial={{customer_id:klant?Number(klant):undefined,issue_date:t,due_date:addDays(t,days),reference:'',notes:'',vat_reverse:false,lines:[]}}/>}</>
}
