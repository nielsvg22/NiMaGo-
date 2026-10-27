import Link from 'next/link';import {redirect} from 'next/navigation';import {currentAccount} from '@/lib/account';import {db} from '@/lib/db';import {eur,fmtDate} from '@/lib/money';import {getInvoice} from '@/lib/invoice';import {effectiveStatus,stageLabel,type Quote,type Project} from '@/lib/portal';import {nowAms} from '@/lib/slots';
export const metadata={title:'Overzicht'};
export default async function Account(){
  const a=await currentAccount();if(!a)redirect('/account/inloggen');
  if(a.status!=='actief'||!a.customer_id)return <><h1>Welkom, {a.name.split(' ')[0]}</h1><p className="lead">Je account is aangemaakt. Zodra wij je account hebben gekoppeld aan je gegevens, zie je hier je offertes, projecten, afspraken en facturen.</p>
    <div className="pcard" style={{maxWidth:640}}><h2>Wat gebeurt er nu?</h2><p className="muted" style={{margin:0}}>We controleren je aanmelding en koppelen je account. Dat gebeurt meestal binnen één werkdag. Je hoeft verder niets te doen. Heb je haast? <Link className="text-link" href="/contact">Neem contact met ons op</Link> en noem het e-mailadres <b>{a.email}</b>.</p></div></>;
  const cid=a.customer_id;const d=db();const cust=d.prepare('SELECT * FROM customers WHERE id=?').get(cid) as {name:string};
  const quotes=(d.prepare("SELECT * FROM quotes WHERE customer_id=? AND status!='concept' ORDER BY id DESC").all(cid) as Quote[]);const openQ=quotes.filter(q=>effectiveStatus(q)==='verzonden');
  const projects=d.prepare('SELECT * FROM projects WHERE customer_id=? AND visible=1 ORDER BY (stage>=5),id DESC').all(cid) as Project[];
  const invs=(d.prepare("SELECT id FROM invoices WHERE customer_id=? AND status='verzonden'").all(cid) as {id:number}[]).map(r=>getInvoice(r.id)!);const openSum=invs.reduce((t,x)=>t+x.totals.total,0);
  const now=nowAms();const appt=d.prepare("SELECT * FROM appointments WHERE (customer_id=? OR (lower(email)=lower(?) AND ?!='')) AND status IN ('aangevraagd','bevestigd') AND slot>=? ORDER BY slot LIMIT 1").get(cid,(d.prepare('SELECT email FROM customers WHERE id=?').get(cid) as {email:string}).email,(d.prepare('SELECT email FROM customers WHERE id=?').get(cid) as {email:string}).email,`${now.date} ${now.time}`) as {slot:string;topic:string;status:string}|undefined;
  const unread=(d.prepare("SELECT COUNT(*) c FROM portal_messages WHERE customer_id=? AND direction='nimago' AND is_read=0").get(cid) as {c:number}).c;
  return <><h1>Hoi {a.name.split(' ')[0]}</h1><p className="lead">Dit is jouw overzicht bij {cust.name}. Hier volg je de status van je projecten en vind je alle afspraken, offertes en facturen.</p>
  <div className="pgrid">
    <Link href="/account/offertes" className="pcard"><span className="muted small">Offertes</span><span className="big">{openQ.length}</span><span className="muted small">{openQ.length?`${openQ.length===1?'offerte wacht':'offertes wachten'} op jouw reactie`:'Geen openstaande offertes'}</span></Link>
    <Link href="/account/projecten" className="pcard"><span className="muted small">Projecten</span><span className="big">{projects.filter(p=>p.stage<5).length}</span><span className="muted small">in uitvoering</span></Link>
    <Link href="/account/afspraken" className="pcard"><span className="muted small">Volgende afspraak</span><span className="big" style={{fontSize:appt?22:34}}>{appt?`${fmtDate(appt.slot.slice(0,10))} ${appt.slot.slice(11)}`:'-'}</span><span className="muted small">{appt?(appt.topic||'Kennismaking'):'Niets gepland'}</span></Link>
    <Link href="/account/facturen" className="pcard"><span className="muted small">Openstaand</span><span className="big">{eur(openSum)}</span><span className="muted small">{invs.length} {invs.length===1?'factuur':'facturen'} incl. btw</span></Link>
  </div>
  {unread>0&&<p className="pmsg info"><Link href="/account/berichten"><u>Je hebt {unread} nieuw {unread===1?'bericht':'berichten'} van NiMaGo.</u></Link></p>}
  <h2>Projecten</h2>{projects.length?<div className="plist" style={{marginBottom:30}}>{projects.map(p=><Link className="prow" href={`/account/project?id=${p.id}`} key={p.id}><div><b>{p.title}</b><div className="sub">Fase: {stageLabel(p.stage)} &middot; {p.progress}% klaar</div></div><div style={{width:200,maxWidth:'100%'}}><div className="pbar" role="progressbar" aria-valuenow={p.progress} aria-valuemin={0} aria-valuemax={100} aria-label={`Voortgang ${p.title}`}><i style={{width:`${p.progress}%`}}/></div></div></Link>)}</div>:<p className="muted" style={{marginBottom:30}}>Er zijn nog geen projecten zichtbaar. Zodra we starten, volg je de voortgang hier.</p>}
  </>
}
