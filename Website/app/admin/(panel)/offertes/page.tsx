import Link from 'next/link';import {db} from '@/lib/db';import {eur,fmtDate} from '@/lib/money';import {getQuote,effectiveStatus,type Quote} from '@/lib/portal';import QuotePill from '../QuotePill';
export const metadata={title:'Offertes'};
export default async function Offertes({searchParams}:{searchParams:Promise<{status?:string;fout?:string}>}){
  const {status,fout}=await searchParams;
  const rows=db().prepare('SELECT q.*,c.name cname FROM quotes q JOIN customers c ON c.id=q.customer_id ORDER BY q.id DESC').all() as (Quote&{cname:string})[];
  const f=rows.filter(r=>!status||effectiveStatus(r)===status);
  const tabs=[['','Alle'],['concept','Concepten'],['verzonden','Verzonden'],['geaccepteerd','Geaccepteerd'],['afgewezen','Afgewezen'],['verlopen','Verlopen']];
  return <><div className="adm-head"><div><h1>Offertes</h1><p className="adm-sub">Verzonden offertes zijn direct zichtbaar in het klantportaal van de klant.</p></div><Link className="btn" href="/admin/offertes/nieuw">Nieuwe offerte</Link></div>
  {fout==='vergrendeld'&&<p className="alert err" style={{marginBottom:14}}>Een verzonden offerte kan niet meer worden aangepast. Dupliceer hem voor een nieuwe versie.</p>}
  <div className="actions" style={{marginBottom:14}}>{tabs.map(([k,l])=><Link key={k} className={`btn sm ${(status||'')===k?'dark':'ghost'}`} href={k?`/admin/offertes?status=${k}`:'/admin/offertes'}>{l}</Link>)}</div>
  <div className="adm-card tw">{f.length?<table className="adm-table"><thead><tr><th>Nummer</th><th>Klant</th><th>Titel</th><th>Geldig tot</th><th>Status</th><th className="num">Totaal</th></tr></thead><tbody>{f.map(q=>{const x=getQuote(q.id)!;return <tr className="row" key={q.id}><td><Link href={`/admin/offerte?id=${q.id}`}><b>{q.number||'Concept'}</b></Link></td><td>{q.cname}</td><td>{q.title}</td><td>{fmtDate(q.valid_until)}</td><td><QuotePill q={q}/></td><td className="num">{eur(x.totals.total)}</td></tr>})}</tbody></table>:<p className="adm-empty">Geen offertes gevonden.</p>}</div></>
}
