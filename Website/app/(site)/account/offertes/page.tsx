import Link from 'next/link';import {requireCustomer} from '@/lib/account';import {db} from '@/lib/db';import {eur,fmtDate} from '@/lib/money';import {getQuote,effectiveStatus,type Quote} from '@/lib/portal';
export const metadata={title:'Offertes'};
const QL={verzonden:['Wacht op jouw reactie','warn'],geaccepteerd:['Geaccepteerd','ok'],afgewezen:['Afgewezen','bad'],verlopen:['Verlopen','']} as Record<string,[string,string]>;
export default async function Offertes(){
  const {customer}=await requireCustomer();
  const rows=db().prepare("SELECT * FROM quotes WHERE customer_id=? AND status!='concept' ORDER BY id DESC").all(customer.id) as Quote[];
  return <><h1>Offertes</h1><p className="lead">Al onze voorstellen voor jou. Open een offerte om hem te bekijken en akkoord te geven.</p>
  {rows.length?<div className="plist">{rows.map(q=>{const st=effectiveStatus(q);const x=getQuote(q.id)!;return <Link className="prow" href={`/account/offerte?id=${q.id}`} key={q.id}><div><b>{q.title||q.number}</b><div className="sub">{q.number} &middot; geldig tot {fmtDate(q.valid_until)}</div></div><div style={{display:'flex',gap:14,alignItems:'center'}}><b>{eur(x.totals.total)}</b><span className={`badge ${QL[st][1]}`}>{QL[st][0]}</span></div></Link>})}</div>:<p className="muted">Er zijn nog geen offertes voor je. Zodra we er een sturen, vind je hem hier.</p>}</>
}
