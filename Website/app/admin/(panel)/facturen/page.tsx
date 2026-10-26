import Link from 'next/link';import {db} from '@/lib/db';import {eur,fmtDate} from '@/lib/money';import {getInvoice,type Invoice,isOverdue} from '@/lib/invoice';import StatusPill from '../StatusPill';
export const metadata={title:'Facturen'};
export default async function Facturen({searchParams}:{searchParams:Promise<{status?:string;fout?:string}>}){
  const {status,fout}=await searchParams;
  const rows=db().prepare('SELECT i.*,c.name cname FROM invoices i JOIN customers c ON c.id=i.customer_id ORDER BY i.id DESC').all() as (Invoice&{cname:string})[];
  const f=rows.filter(r=>!status||(status==='telaat'?isOverdue(r):r.status===status));
  const tabs=[['','Alle'],['concept','Concepten'],['verzonden','Verzonden'],['telaat','Te laat'],['betaald','Betaald']];
  return <><div className="adm-head"><div><h1>Facturen</h1><p className="adm-sub">{rows.length} in totaal</p></div><Link className="btn" href="/admin/facturen/nieuw">Nieuwe factuur</Link></div>
  {fout==='vergrendeld'&&<p className="alert err" style={{marginBottom:14}}>Een verzonden factuur kan niet meer worden aangepast.</p>}
  <div className="actions" style={{marginBottom:14}}>{tabs.map(([k,l])=><Link key={k} className={`btn sm ${(status||'')===k?'dark':'ghost'}`} href={k?`/admin/facturen?status=${k}`:'/admin/facturen'}>{l}</Link>)}</div>
  <div className="adm-card tw">{f.length?<table className="adm-table"><thead><tr><th>Nummer</th><th>Klant</th><th>Datum</th><th>Vervalt</th><th>Status</th><th className="num">Totaal</th></tr></thead><tbody>{f.map(i=>{const x=getInvoice(i.id)!;return <tr className="row" key={i.id}><td><Link href={`/admin/factuur?id=${i.id}`}><b>{i.number||'Concept'}</b></Link></td><td>{i.cname}</td><td>{fmtDate(i.issue_date)}</td><td>{fmtDate(i.due_date)}</td><td><StatusPill inv={i}/></td><td className="num">{eur(x.totals.total)}</td></tr>})}</tbody></table>:<p className="adm-empty">Geen facturen gevonden.</p>}</div></>
}
