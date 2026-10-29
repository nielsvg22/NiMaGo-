import Link from 'next/link';import {notFound} from 'next/navigation';import {db} from '@/lib/db';import {fmtDate} from '@/lib/money';import {STAGES,KIND,MAIL_TEMPLATES,ageText,isLate,stageLabel,type Lead} from '@/lib/leads';import {setLeadStage,saveLeadMeta,replyLead,convertLead,deleteLead} from '../../actions';
export const metadata={title:'Lead'};
export default async function LeadPage({searchParams}:{searchParams:Promise<{id?:string;ok?:string;fout?:string;t?:string}>}){
  const {id,ok,fout,t}=await searchParams;const l=db().prepare('SELECT * FROM messages WHERE id=?').get(Number(id)) as Lead|undefined;if(!l)notFound();
  if(!l.is_read)db().prepare('UPDATE messages SET is_read=1 WHERE id=?').run(l.id);
  const first=l.name.split(' ')[0];const key=t&&MAIL_TEMPLATES[t]?t:'reactie';const tpl=MAIL_TEMPLATES[key];
  let payload:Record<string,string>={};try{payload=l.payload?JSON.parse(l.payload):{}}catch{}
  const customer=l.customer_id?db().prepare('SELECT id,name FROM customers WHERE id=?').get(l.customer_id) as {id:number;name:string}|undefined:undefined;
  return <><div className="adm-head"><div><h1>{l.name}</h1><p className="adm-sub">{KIND[l.kind]||'Bericht'} · {ageText(l)} · <span className={`pill ${l.stage==='gewonnen'?'betaald':'verzonden'}`}>{stageLabel(l.stage)}</span>{isLate(l)&&<> <span className="pill telaat">Te laat</span></>}</p></div><Link className="btn ghost" href="/admin/leads">← Alle leads</Link></div>
  {ok&&<p className="alert ok" style={{marginBottom:14}} role="status">{ok==='verzonden'?'E-mail verstuurd en lead op "Opgevolgd" gezet.':'Opgeslagen.'}</p>}{fout&&<p className="alert err" style={{marginBottom:14}} role="alert">{fout==='mail'?'Het versturen is niet gelukt. Controleer de e-mailinstellingen.':'Vul onderwerp en bericht in.'}</p>}
  <div className="adm-grid" style={{gridTemplateColumns:'1.5fr 1fr'}}>
   <div className="adm-grid" style={{alignContent:'start'}}>
    <div className="adm-card"><h2>Bericht</h2><p className="msg-body" style={{margin:'0 0 12px'}}>{l.message}</p>{Object.keys(payload).length>0&&<dl className="kv">{Object.entries(payload).filter(([k,v])=>v&&k!=='Omschrijving').map(([k,v])=><div key={k} style={{display:'contents'}}><dt>{k.replace(/_/g,' ')}</dt><dd>{v}</dd></div>)}</dl>}</div>
    <form key={key} action={replyLead} className="adm-card fstack"><h2>Reageren per e-mail</h2><input type="hidden" name="id" value={l.id}/>
     <div className="actions">{Object.entries(MAIL_TEMPLATES).map(([k,v])=><Link key={k} className={`btn sm ${k===key?'dark':'ghost'}`} href={`/admin/lead?id=${l.id}&t=${k}`}>{v.label}</Link>)}</div>
     <label>Onderwerp<input name="subject" defaultValue={tpl.subject} maxLength={160} required/></label>
     <label>Bericht aan {l.email}<textarea name="body" rows={10} defaultValue={tpl.body(first)} maxLength={5000} required/></label>
     <p className="hint" style={{margin:0}}>De mail gaat in je huisstijl vanaf je zakelijke adres. Beantwoorden komt bij jou terecht. De lead gaat naar “Opgevolgd”.</p>
     <div className="actions"><button className="btn" type="submit">Verstuur e-mail</button><a className="btn ghost" href={`mailto:${l.email}`}>Open in mailprogramma</a></div></form></div>
   <div className="adm-grid" style={{alignContent:'start'}}>
    <div className="adm-card"><h2>Contact</h2><dl className="kv"><dt>E-mail</dt><dd><a href={`mailto:${l.email}`}><u>{l.email}</u></a></dd>{payload['Telefoon']&&<><dt>Telefoon</dt><dd><a href={`tel:${payload['Telefoon']}`}><u>{payload['Telefoon']}</u></a></dd></>}{l.company&&<><dt>Bedrijf</dt><dd>{l.company}</dd></>}{l.service&&<><dt>Dienst</dt><dd>{l.service}</dd></>}<dt>Bron</dt><dd>{l.source||'onbekend'}</dd>{l.page&&<><dt>Pagina</dt><dd>{l.page}</dd></>}{l.contacted_at&&<><dt>Eerste reactie</dt><dd>{fmtDate(l.contacted_at.slice(0,10))}</dd></>}</dl></div>
    <div className="adm-card"><h2>Fase</h2><div className="actions">{STAGES.map(([k,lab])=><form action={setLeadStage} key={k}><input type="hidden" name="id" value={l.id}/><input type="hidden" name="stage" value={k}/><button className={`btn sm ${l.stage===k?'dark':'ghost'}`} type="submit">{lab}</button></form>)}</div></div>
    <form action={saveLeadMeta} className="adm-card fstack"><h2>Opvolging</h2><input type="hidden" name="id" value={l.id}/>
     <div className="f2"><label>Opvolgen op<input type="date" name="follow_up" defaultValue={l.follow_up}/></label><label>Geschatte waarde (€)<input name="value" inputMode="decimal" defaultValue={l.value_cents?String(l.value_cents/100).replace('.',','):''} placeholder="0"/></label></div>
     <label>Notities<textarea name="note" rows={6} defaultValue={l.note} maxLength={3000}/></label><div><button className="btn" type="submit">Opslaan</button></div></form>
    <div className="adm-card fstack"><h2>Verder</h2><div className="actions"><form action={convertLead}><input type="hidden" name="id" value={l.id}/><button className="btn dark" type="submit">{customer?`Naar klant: ${customer.name}`:'Maak klant van deze lead'}</button></form>{customer&&<><Link className="btn ghost" href={`/admin/offertes/nieuw?klant=${customer.id}`}>Nieuwe offerte</Link><Link className="btn ghost" href={`/admin/projecten/nieuw?klant=${customer.id}`}>Nieuw project</Link></>}<Link className="btn ghost" href="/admin/agenda">Afspraak plannen</Link><form action={deleteLead}><input type="hidden" name="id" value={l.id}/><button className="btn danger" type="submit">Verwijderen</button></form></div></div>
   </div></div></>
}
