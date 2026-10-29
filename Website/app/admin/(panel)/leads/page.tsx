import Link from 'next/link';import {db} from '@/lib/db';import {fmtDate} from '@/lib/money';import {STAGES,KIND,ageText,isLate,leadCounts,stageLabel,type Lead} from '@/lib/leads';
export const metadata={title:'Leads'};
const today=()=>new Date().toLocaleDateString('en-CA',{timeZone:'Europe/Amsterdam'});
export default async function Leads({searchParams}:{searchParams:Promise<{fase?:string;q?:string}>}){
  const {fase,q}=await searchParams;const c=leadCounts();const all=Object.values(c).reduce((a,b)=>a+b,0);
  const open=(c.nieuw||0)+(c.opgevolgd||0)+(c.gesprek||0);
  const where:string[]=[];const args:string[]=[];
  if(fase==='open')where.push("stage IN ('nieuw','opgevolgd','gesprek')");else if(fase&&STAGES.some(s=>s[0]===fase)){where.push('stage=?');args.push(fase)}
  if(q){where.push("(name LIKE ? OR email LIKE ? OR company LIKE ? OR message LIKE ?)");const l=`%${q.slice(0,60)}%`;args.push(l,l,l,l)}
  const rows=db().prepare(`SELECT * FROM messages ${where.length?'WHERE '+where.join(' AND '):''} ORDER BY (stage='nieuw') DESC,CASE WHEN follow_up!='' AND follow_up<=? THEN 0 ELSE 1 END,id DESC LIMIT 300`).all(...args,today()) as Lead[];
  const tabs:[string,string,number][]=[['','Alles',all],['open','Open',open],...STAGES.map(s=>[s[0],s[1],c[s[0]]||0] as [string,string,number])];
  return <><div className="adm-head"><div><h1>Leads</h1><p className="adm-sub">Aanvragen via het contactformulier, offerte-aanvragen, website-checks en afspraken. Reageer snel: wie binnen een paar uur antwoord krijgt, kiest vaker voor jou.</p></div></div>
  <div className="actions" style={{marginBottom:14}}>{tabs.map(([k,l,n])=><Link key={k||'alles'} className={`btn sm ${(fase||'')===k?'dark':'ghost'}`} href={k?`/admin/leads?fase=${k}`:'/admin/leads'}>{l} ({n})</Link>)}</div>
  <form className="actions" style={{marginBottom:14}}><input name="q" defaultValue={q} placeholder="Zoek op naam, e-mail, bedrijf of bericht" style={{maxWidth:380}}/>{fase&&<input type="hidden" name="fase" value={fase}/>}<button className="btn ghost sm" type="submit">Zoeken</button></form>
  <div className="adm-card tw">{rows.length?<table className="adm-table"><thead><tr><th>Lead</th><th>Type</th><th>Herkomst</th><th>Ontvangen</th><th>Fase</th><th>Opvolgen</th><th className="num">Waarde</th></tr></thead><tbody>{rows.map(l=>{const late=isLate(l);const due=l.follow_up&&l.follow_up<=today()&&['nieuw','opgevolgd','gesprek'].includes(l.stage);return <tr className="row" key={l.id}>
    <td><Link href={`/admin/lead?id=${l.id}`}><b>{l.name}</b></Link>{!l.is_read&&<span className="adm-badge" style={{marginLeft:8}}>nieuw</span>}<br/><span className="hint">{l.company||l.email}</span></td>
    <td>{KIND[l.kind]||'Bericht'}{l.service&&<><br/><span className="hint">{l.service}</span></>}</td>
    <td><span className="hint">{l.source||'-'}{l.page?<><br/>{l.page}</>:null}</span></td>
    <td>{ageText(l)}{late&&<><br/><span className="pill telaat">Te laat</span></>}</td>
    <td><span className={`pill ${l.stage==='gewonnen'?'betaald':l.stage==='verloren'?'concept':l.stage==='nieuw'?'verzonden':'concept'}`}>{stageLabel(l.stage)}</span></td>
    <td>{l.follow_up?<span className={due?'pill telaat':''}>{fmtDate(l.follow_up)}</span>:'-'}</td>
    <td className="num">{l.value_cents?`€ ${(l.value_cents/100).toLocaleString('nl-NL')}`:'-'}</td></tr>})}</tbody></table>:<p className="adm-empty">Geen leads gevonden.</p>}</div></>
}
