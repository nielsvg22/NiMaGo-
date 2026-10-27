import Link from 'next/link';import {db} from '@/lib/db';import {fmtDate} from '@/lib/money';import {stageLabel,type Project} from '@/lib/portal';
export const metadata={title:'Projecten'};
export default function Projecten(){
  const rows=db().prepare('SELECT p.*,c.name cname FROM projects p JOIN customers c ON c.id=p.customer_id ORDER BY (p.stage>=5) ASC,p.id DESC').all() as (Project&{cname:string})[];
  return <><div className="adm-head"><div><h1>Projecten</h1><p className="adm-sub">De fase, voortgang en updates van een project zien klanten in hun portaal.</p></div><Link className="btn" href="/admin/projecten/nieuw">Nieuw project</Link></div>
  <div className="adm-card tw">{rows.length?<table className="adm-table"><thead><tr><th>Project</th><th>Klant</th><th>Fase</th><th>Voortgang</th><th>Deadline</th><th>Zichtbaar</th></tr></thead><tbody>{rows.map(p=><tr className="row" key={p.id}><td><Link href={`/admin/project?id=${p.id}`}><b>{p.title}</b></Link></td><td>{p.cname}</td><td>{stageLabel(p.stage)}</td><td>{p.progress}%</td><td>{p.deadline?fmtDate(p.deadline):'-'}</td><td>{p.visible?'Ja':'Nee'}</td></tr>)}</tbody></table>:<p className="adm-empty">Nog geen projecten.</p>}</div></>
}
