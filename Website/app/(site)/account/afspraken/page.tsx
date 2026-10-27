import Link from 'next/link';import {requireCustomer} from '@/lib/account';import {db} from '@/lib/db';import {fmtDate} from '@/lib/money';import {nowAms} from '@/lib/slots';
export const metadata={title:'Afspraken'};
type A={id:number;slot:string;topic:string;status:string};
export default async function Afspraken(){
  const {customer}=await requireCustomer();const now=nowAms();const key=`${now.date} ${now.time}`;
  const rows=db().prepare("SELECT id,slot,topic,status FROM appointments WHERE customer_id=? OR (?!='' AND lower(email)=lower(?)) ORDER BY slot").all(customer.id,customer.email,customer.email) as A[];
  const up=rows.filter(a=>a.slot>=key&&a.status!=='geannuleerd'),past=rows.filter(a=>a.slot<key||a.status==='geannuleerd').reverse();
  const L:Record<string,[string,string]>={aangevraagd:['Aangevraagd','warn'],bevestigd:['Bevestigd','ok'],afgerond:['Afgerond',''],geannuleerd:['Geannuleerd','bad']};
  const Row=({a}:{a:A})=><div className="prow"><div><b>{fmtDate(a.slot.slice(0,10))} om {a.slot.slice(11)}</b><div className="sub">{a.topic||'Kennismaking'}</div></div><span className={`badge ${L[a.status]?.[1]||''}`}>{L[a.status]?.[0]||a.status}</span></div>;
  return <><h1>Afspraken</h1><p className="lead">Je geplande gesprekken met NiMaGo.</p><p style={{marginBottom:26}}><Link className="button button-primary" href="/kennismaking">Nieuwe afspraak plannen</Link></p>
  <h2>Aankomend</h2>{up.length?<div className="plist" style={{marginBottom:30}}>{up.map(a=><Row key={a.id} a={a}/>)}</div>:<p className="muted" style={{marginBottom:30}}>Geen aankomende afspraken.</p>}
  {past.length>0&&<><h2>Eerder</h2><div className="plist">{past.slice(0,20).map(a=><Row key={a.id} a={a}/>)}</div></>}</>
}
