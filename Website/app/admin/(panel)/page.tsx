import Link from 'next/link';import {db} from '@/lib/db';import {eur,fmtDate,today} from '@/lib/money';import {getInvoice,type Invoice,isOverdue} from '@/lib/invoice';import StatusPill from './StatusPill';
export const metadata={title:'Overzicht'};
export default function Dashboard(){
  const d=db();const all=d.prepare("SELECT id FROM invoices WHERE status!='concept'").all() as {id:number}[];
  let open=0,overdue=0,overdueN=0,yearPaid=0,openN=0;const year=String(new Date().getFullYear());
  for(const {id} of all){const x=getInvoice(id)!;if(x.inv.status==='verzonden'){open+=x.totals.total;openN++;if(isOverdue(x.inv)){overdue+=x.totals.total;overdueN++}}if(x.inv.status==='betaald'&&(x.inv.paid_at||'').startsWith(year))yearPaid+=x.totals.subtotal}
  const concepts=(d.prepare("SELECT COUNT(*) c FROM invoices WHERE status='concept'").get() as {c:number}).c;
  const recent=d.prepare('SELECT i.*,c.name cname FROM invoices i JOIN customers c ON c.id=i.customer_id ORDER BY i.id DESC LIMIT 6').all() as (Invoice&{cname:string})[];
  const msgs=d.prepare('SELECT * FROM messages ORDER BY id DESC LIMIT 4').all() as {id:number;name:string;message:string;created_at:string;is_read:number}[];
  const nAppt=(d.prepare("SELECT COUNT(*) c FROM appointments WHERE status='aangevraagd'").get() as {c:number}).c;const nCust=(d.prepare('SELECT COUNT(*) c FROM customers').get() as {c:number}).c;
  return <><div className="adm-head"><div><h1>Overzicht</h1><p className="adm-sub">{fmtDate(today())}</p></div><div className="actions">{nAppt>0&&<Link className="btn dark" href="/admin/agenda">{nAppt} nieuwe {nAppt===1?'afspraak':'afspraken'}</Link>}<Link className="btn" href="/admin/facturen/nieuw">Nieuwe factuur</Link><Link className="btn ghost" href="/admin/klanten/nieuw">Nieuwe klant</Link></div></div>
  {nCust===0&&<p className="alert info" style={{marginBottom:16}}>Begin met <Link href="/admin/instellingen"><u>je bedrijfsgegevens</u></Link> en voeg daarna een <Link href="/admin/klanten/nieuw"><u>klant</u></Link> toe. Daarna maak je je eerste factuur.</p>}
  <div className="adm-grid g4" style={{marginBottom:16}}>
    <div className="adm-card stat"><span>Openstaand</span><b>{eur(open)}</b><small>{openN} {openN===1?'factuur':'facturen'} incl. btw</small></div>
    <div className={`adm-card stat${overdueN?' warn':''}`}><span>Te laat</span><b>{eur(overdue)}</b><small>{overdueN} {overdueN===1?'factuur':'facturen'} voorbij vervaldatum</small></div>
    <div className="adm-card stat"><span>Betaald {year}</span><b>{eur(yearPaid)}</b><small>excl. btw</small></div>
    <div className="adm-card stat"><span>Concepten</span><b>{concepts}</b><small>nog niet verzonden</small></div>
  </div>
  <div className="adm-grid g2" style={{gridTemplateColumns:'1.5fr 1fr'}}>
    <div className="adm-card"><h2>Recente facturen</h2>{recent.length?<div className="tw"><table className="adm-table"><tbody>{recent.map(i=>{const x=getInvoice(i.id)!;return <tr className="row" key={i.id}><td><Link href={`/admin/factuur?id=${i.id}`}><b>{i.number||'Concept'}</b></Link><br/><span className="hint">{i.cname}</span></td><td><StatusPill inv={i}/></td><td className="num">{eur(x.totals.total)}</td></tr>})}</tbody></table></div>:<p className="adm-empty">Nog geen facturen.</p>}</div>
    <div className="adm-card"><h2>Berichten via de website</h2>{msgs.length?msgs.map(m=><p key={m.id} style={{margin:'0 0 12px'}}><b>{m.name}</b>{!m.is_read&&<span className="adm-badge" style={{marginLeft:8}}>nieuw</span>}<br/><span className="hint">{m.message.slice(0,90)}{m.message.length>90?'…':''}</span></p>):<p className="adm-empty">Nog geen berichten.</p>}<Link className="btn ghost sm" href="/admin/berichten">Alle berichten</Link></div>
  </div></>
}
