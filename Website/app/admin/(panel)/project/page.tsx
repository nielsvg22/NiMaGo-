import {notFound} from 'next/navigation';import {db} from '@/lib/db';import {fmtDateTime,type Project,type Update} from '@/lib/portal';import ProjectFields from '../ProjectFields';import {deleteProject,addProjectUpdate,deleteProjectUpdate} from '../../actions';
export const metadata={title:'Project'};
export default async function Detail({searchParams}:{searchParams:Promise<{id?:string;ok?:string;fout?:string}>}){
  const {id,ok,fout}=await searchParams;const p=db().prepare('SELECT * FROM projects WHERE id=?').get(Number(id)) as Project|undefined;if(!p)notFound();
  const customers=db().prepare('SELECT id,name FROM customers ORDER BY name').all() as {id:number;name:string}[];
  const ups=db().prepare('SELECT * FROM project_updates WHERE project_id=? ORDER BY id DESC').all(p.id) as Update[];
  return <><div className="adm-head"><div><h1>{p.title}</h1><p className="adm-sub">{customers.find(c=>c.id===p.customer_id)?.name}</p></div><form action={deleteProject}><input type="hidden" name="id" value={p.id}/><button className="btn danger" type="submit">Project verwijderen</button></form></div>
  {ok&&<p className="alert ok" style={{marginBottom:14}} role="status">Opgeslagen.</p>}{fout&&<p className="alert err" style={{marginBottom:14}}>Geef de update een titel.</p>}
  <ProjectFields customers={customers} p={p}/>
  <h2 style={{marginTop:28}}>Update plaatsen</h2>
  <form action={addProjectUpdate} className="adm-card fstack"><input type="hidden" name="project_id" value={p.id}/>
    <label>Titel<input name="title" required maxLength={160} placeholder="Bijv. Eerste ontwerp staat klaar"/></label>
    <label>Toelichting<textarea name="body" maxLength={3000} placeholder="Wat is er gedaan en wat is de volgende stap?"/></label>
    <div className="f2"><label>Voortgang bijwerken naar (%) <span className="hint">leeg laten = ongewijzigd</span><input type="number" name="progress" min={0} max={100}/></label><label>Zichtbaar voor klant<select name="visible" defaultValue="1"><option value="1">Ja</option><option value="">Nee (alleen intern)</option></select></label></div>
    <div><button className="btn dark" type="submit">Update plaatsen</button></div></form>
  <h2 style={{marginTop:28}}>Updates ({ups.length})</h2><div className="adm-grid">{ups.length?ups.map(u=><article className="adm-card msg-card" key={u.id}><div className="msg-meta"><b style={{color:'var(--a-ink)'}}>{u.title}</b><span>{fmtDateTime(u.created_at)}</span><span className={`pill ${u.visible?'betaald':'concept'}`}>{u.visible?'Zichtbaar':'Intern'}</span></div>{u.body&&<p className="msg-body" style={{margin:0}}>{u.body}</p>}<form action={deleteProjectUpdate}><input type="hidden" name="id" value={u.id}/><input type="hidden" name="project_id" value={p.id}/><button className="btn danger sm" type="submit">Verwijderen</button></form></article>):<p className="adm-card adm-empty">Nog geen updates.</p>}</div></>
}
