import {notFound} from 'next/navigation';import {requireCustomer} from '@/lib/account';import {db} from '@/lib/db';import {STAGES,fmtDateTime,type Project,type Update,type PMessage} from '@/lib/portal';import {fmtDate} from '@/lib/money';import {sendPortalMessage} from '../actions';
export const metadata={title:'Project'};
export default async function ProjectPage({searchParams}:{searchParams:Promise<{id?:string;ok?:string;fout?:string}>}){
  const {id,ok,fout}=await searchParams;const {customer}=await requireCustomer();
  const p=db().prepare('SELECT * FROM projects WHERE id=? AND customer_id=? AND visible=1').get(Number(id),customer.id) as Project|undefined;if(!p)notFound();
  const ups=db().prepare('SELECT * FROM project_updates WHERE project_id=? AND visible=1 ORDER BY id DESC').all(p.id) as Update[];
  const msgs=db().prepare('SELECT * FROM portal_messages WHERE customer_id=? AND project_id=? ORDER BY id').all(customer.id,p.id) as PMessage[];
  db().prepare("UPDATE portal_messages SET is_read=1 WHERE customer_id=? AND project_id=? AND direction='nimago'").run(customer.id,p.id);
  return <><p className="muted small"><a href="/account/projecten"><u>← Alle projecten</u></a></p><h1>{p.title}</h1>
  {p.description&&<p className="lead">{p.description}</p>}
  <div className="pcard" style={{marginBottom:20}}><ol className="stages" aria-label="Projectfasen">{STAGES.map((s,i)=><li key={s} className={i<p.stage?'done':i===p.stage?'now':''} aria-current={i===p.stage?'step':undefined}>{s}</li>)}</ol>
    <div style={{display:'flex',justifyContent:'space-between',gap:12,flexWrap:'wrap'}}><b>Voortgang</b><span>{p.progress}%</span></div><div className="pbar" role="progressbar" aria-valuenow={p.progress} aria-valuemin={0} aria-valuemax={100} aria-label="Voortgang"><i style={{width:`${p.progress}%`}}/></div>
    {(p.start_date||p.deadline)&&<p className="muted small" style={{margin:'8px 0 0'}}>{p.start_date&&<>Start: {fmtDate(p.start_date)}</>}{p.start_date&&p.deadline&&' · '}{p.deadline&&<>Streefdatum oplevering: {fmtDate(p.deadline)}</>}</p>}</div>
  <div className="psplit"><div className="pcard"><h2 style={{margin:0}}>Updates</h2>{ups.length?<ul className="ptimeline" style={{marginTop:14}}>{ups.map(u=><li key={u.id}><h3>{u.title}</h3><span className="muted small">{fmtDateTime(u.created_at)}</span>{u.body&&<p>{u.body}</p>}</li>)}</ul>:<p className="muted">Nog geen updates. Zodra er nieuws is, lees je het hier.</p>}</div>
  <div className="pcard"><h2 style={{margin:0}}>Bericht over dit project</h2>{msgs.length>0&&<div className="chat">{msgs.map(m=><div key={m.id} className={`bubble${m.direction==='klant'?' me':''}`}><small>{m.direction==='klant'?'Jij':'NiMaGo'} · {fmtDateTime(m.created_at)}</small>{m.body}</div>)}</div>}
    {ok&&<p className="pmsg" role="status">Bericht verstuurd.</p>}{fout&&<p className="pmsg err" role="alert">Schrijf eerst een bericht.</p>}
    <form className="pform wide" style={{padding:0,border:0,boxShadow:'none',background:'none'}} action={sendPortalMessage}><input type="hidden" name="project_id" value={p.id}/><label>Je bericht<textarea name="body" rows={4} required maxLength={3000}/></label><button className="button button-primary" type="submit">Versturen</button></form></div></div></>
}
