import Link from 'next/link';import {requireCustomer} from '@/lib/account';import {db} from '@/lib/db';import {eur,fmtDate} from '@/lib/money';import {getInvoice,isOverdue,type Invoice} from '@/lib/invoice';
export const metadata={title:'Facturen'};
export default async function Facturen(){
  const {customer}=await requireCustomer();const rows=db().prepare("SELECT * FROM invoices WHERE customer_id=? AND status!='concept' ORDER BY id DESC").all(customer.id) as Invoice[];
  return <><h1>Facturen</h1><p className="lead">Je facturen met betaalstatus. Download ze als PDF.</p>
  {rows.length?<div className="plist">{rows.map(i=>{const x=getInvoice(i.id)!;const late=isOverdue(i);return <Link className="prow" href={`/account/factuur?id=${i.id}`} key={i.id}><div><b>{i.number}</b><div className="sub">{i.reference||'Factuur'} &middot; vervalt {fmtDate(i.due_date)}</div></div><div style={{display:'flex',gap:14,alignItems:'center'}}><b>{eur(x.totals.total)}</b><span className={`badge ${i.status==='betaald'?'ok':late?'bad':'warn'}`}>{i.status==='betaald'?'Betaald':late?'Te laat':'Open'}</span></div></Link>})}</div>:<p className="muted">Er zijn nog geen facturen.</p>}</>
}
