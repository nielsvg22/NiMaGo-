import Link from 'next/link';import {requireCustomer} from '@/lib/account';import {db} from '@/lib/db';import {stageLabel,type Project} from '@/lib/portal';
export const metadata={title:'Projecten'};
export default async function Projecten(){
  const {customer}=await requireCustomer();const rows=db().prepare('SELECT * FROM projects WHERE customer_id=? AND visible=1 ORDER BY (stage>=5),id DESC').all(customer.id) as Project[];
  return <><h1>Projecten</h1><p className="lead">De status van alles waar we voor je aan werken.</p>
  {rows.length?<div className="plist">{rows.map(p=><Link className="prow" href={`/account/project?id=${p.id}`} key={p.id}><div><b>{p.title}</b><div className="sub">Fase: {stageLabel(p.stage)} &middot; {p.progress}% klaar</div></div><div style={{width:220,maxWidth:'100%'}}><div className="pbar" role="progressbar" aria-valuenow={p.progress} aria-valuemin={0} aria-valuemax={100} aria-label={`Voortgang ${p.title}`}><i style={{width:`${p.progress}%`}}/></div></div></Link>)}</div>:<p className="muted">Er zijn nog geen projecten zichtbaar. Zodra we starten, volg je de voortgang hier.</p>}</>
}
