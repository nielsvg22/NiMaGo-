import {requireCustomer} from '@/lib/account';import {db} from '@/lib/db';import {fmtDateTime,type PMessage} from '@/lib/portal';import {sendPortalMessage} from '../actions';
export const metadata={title:'Berichten'};
export default async function Berichten({searchParams}:{searchParams:Promise<{ok?:string;fout?:string}>}){
  const {ok,fout}=await searchParams;const {customer}=await requireCustomer();
  const msgs=db().prepare('SELECT m.*,p.title ptitle FROM portal_messages m LEFT JOIN projects p ON p.id=m.project_id WHERE m.customer_id=? ORDER BY m.id').all(customer.id) as (PMessage&{ptitle:string|null})[];
  db().prepare("UPDATE portal_messages SET is_read=1 WHERE customer_id=? AND direction='nimago'").run(customer.id);
  return <><h1>Berichten</h1><p className="lead">Stel een vraag of laat iets weten. We reageren meestal binnen één werkdag.</p>
  {msgs.length>0&&<div className="chat">{msgs.map(m=><div key={m.id} className={`bubble${m.direction==='klant'?' me':''}`}><small>{m.direction==='klant'?'Jij':'NiMaGo'} · {fmtDateTime(m.created_at)}{m.ptitle?` · ${m.ptitle}`:''}</small>{m.body}</div>)}</div>}
  {ok&&<p className="pmsg" role="status">Bericht verstuurd. We reageren zo snel mogelijk.</p>}{fout&&<p className="pmsg err" role="alert">{fout==='limiet'?'Je hebt veel berichten verstuurd. Probeer het later opnieuw.':'Schrijf eerst een bericht.'}</p>}
  <form className="pform" action={sendPortalMessage}><label>Je bericht<textarea name="body" rows={5} required maxLength={3000}/></label><button className="button button-primary" type="submit">Versturen</button></form></>
}
