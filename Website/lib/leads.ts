import {db,allSettings} from './db';import {sendMail,siteUrl} from './mail';
/** Leadbeheer: elke aanvraag (contactbericht, offerte, website-check, afspraak) is een lead met een pijplijnfase. */
export const STAGES=[['nieuw','Nieuw'],['opgevolgd','Opgevolgd'],['gesprek','In gesprek'],['gewonnen','Gewonnen'],['verloren','Verloren']] as const;
export type Stage=typeof STAGES[number][0];
export const stageLabel=(s:string)=>STAGES.find(x=>x[0]===s)?.[1]||s;
export const KIND:Record<string,string>={contact:'Bericht',offerte:'Offerte-aanvraag',scan:'Website-check',afspraak:'Afspraakverzoek'};
export type Lead={id:number;name:string;email:string;company:string;service:string;message:string;is_read:number;created_at:string;kind:string;payload:string;stage:Stage;note:string;follow_up:string;value_cents:number;source:string;page:string;contacted_at:string;customer_id:number|null};
const ams=()=>new Date().toLocaleDateString('en-CA',{timeZone:'Europe/Amsterdam'});
export const ageHours=(l:Pick<Lead,'created_at'>)=>(Date.now()-Date.parse(l.created_at.replace(' ','T')+'Z'))/3600000;
/** Een nieuwe lead die al ruim een dag wacht geldt als te laat: snel reageren is de grootste winst. */
export const isLate=(l:Pick<Lead,'stage'|'created_at'>)=>l.stage==='nieuw'&&ageHours(l)>24;
export const ageText=(l:Pick<Lead,'created_at'>)=>{const h=ageHours(l);return h<1?'zojuist':h<24?`${Math.floor(h)} uur geleden`:`${Math.floor(h/24)} dag${Math.floor(h/24)===1?'':'en'} geleden`};
/** Herkomst en pagina bij een lead. De pagina komt uit de Referer van het formulier; de bron alleen met toestemming voor statistieken. */
export function tagLead(id:number|bigint,req:{headers:Headers},marketing:unknown){
  let page='';try{const r=req.headers.get('referer');if(r){const u=new URL(r);page=u.pathname.slice(0,120)}}catch{}
  let source='';if(marketing&&typeof marketing==='object'){const ref=(marketing as {ref?:unknown}).ref;if(typeof ref==='string'&&/^[a-z0-9.-]{1,80}$/i.test(ref))source=ref.toLowerCase().replace(/^www\./,'')}
  if(page||source)db().prepare('UPDATE messages SET page=?,source=? WHERE id=?').run(page,source,Number(id));
}
export function leadCounts(){const rows=db().prepare('SELECT stage,COUNT(*) c FROM messages GROUP BY stage').all() as {stage:string;c:number}[];const m:Record<string,number>={};for(const r of rows)m[r.stage]=r.c;return m}
export function leadSummary(){
  const d=db();const today=ams();
  const nieuw=(d.prepare("SELECT COUNT(*) c FROM messages WHERE stage='nieuw'").get() as {c:number}).c;
  const late=(d.prepare("SELECT COUNT(*) c FROM messages WHERE stage='nieuw' AND created_at<datetime('now','-24 hours')").get() as {c:number}).c;
  const follow=(d.prepare("SELECT COUNT(*) c FROM messages WHERE follow_up!='' AND follow_up<=? AND stage IN ('nieuw','opgevolgd','gesprek')").get(today) as {c:number}).c;
  const pipe=(d.prepare("SELECT COALESCE(SUM(value_cents),0) s FROM messages WHERE stage IN ('opgevolgd','gesprek')").get() as {s:number}).s;
  const won30=(d.prepare("SELECT COUNT(*) c FROM messages WHERE stage='gewonnen' AND created_at>datetime('now','-30 days')").get() as {c:number}).c;
  const total30=(d.prepare("SELECT COUNT(*) c FROM messages WHERE created_at>datetime('now','-30 days')").get() as {c:number}).c;
  return{nieuw,late,follow,pipe,won30,total30}}
export const MAIL_TEMPLATES:Record<string,{label:string;subject:string;body:(n:string)=>string}>={
 reactie:{label:'Eerste reactie',subject:'Je aanvraag bij NiMaGo',body:n=>`Hoi ${n},\n\nBedankt voor je bericht. Ik kijk graag met je mee. Om goed te begrijpen wat je nodig hebt, heb ik nog een paar vragen:\n\n- Wat wil je met de oplossing bereiken?\n- Wie gaat ermee werken?\n- Is er een datum waarop het klaar moet zijn?\n\nWe kunnen ook even bellen of kennismaken. Je kunt een moment kiezen via nimagodigital.nl/kennismaking, of mij bellen op 06 25 23 92 26.\n\nGroet,\nNiels`},
 kennismaking:{label:'Kennismaking voorstellen',subject:'Zullen we kennismaken?',body:n=>`Hoi ${n},\n\nFijn dat je contact hebt opgenomen. Ik stel een vrijblijvende kennismaking voor, bij jou op locatie in de regio Apeldoorn of online. Kies een moment dat jou uitkomt: nimagodigital.nl/kennismaking\n\nDan bespreken we wat je wilt bereiken en wat een logische eerste stap is.\n\nGroet,\nNiels`},
 offerte:{label:'Offerte volgt',subject:'Je offerte van NiMaGo',body:n=>`Hoi ${n},\n\nBedankt voor het gesprek. Ik werk een voorstel uit met scope, planning en prijs en stuur het je binnen twee werkdagen. Heb je tot die tijd nog vragen, laat het me weten.\n\nGroet,\nNiels`},
 nafase:{label:'Opvolging na offerte',subject:'Even terugkomen op mijn voorstel',body:n=>`Hoi ${n},\n\nIk wilde even terugkomen op het voorstel dat ik je stuurde. Zijn er vragen, of past er iets niet? Ik denk graag mee over aanpassingen.\n\nGroet,\nNiels`}};
/** Dagelijkse leadsamenvatting per e-mail (07:30 Nederlandse tijd), alleen als er iets openstaat. */
export function startLeadDigest(){
  const g=globalThis as typeof globalThis&{nimagoLeadDigest?:ReturnType<typeof setInterval>};if(g.nimagoLeadDigest||process.env.NODE_ENV!=='production'||process.env.NEXT_PHASE==='phase-production-build')return;
  const tick=async()=>{try{
    const now=new Date();const hm=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Amsterdam',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(now);if(hm<'07:30')return;
    const today=ams();const d=db();if((d.prepare("SELECT value FROM settings WHERE key='lead_digest_day'").get() as {value:string}|undefined)?.value===today)return;
    d.prepare("INSERT INTO settings(key,value) VALUES('lead_digest_day',?) ON CONFLICT(key) DO UPDATE SET value=excluded.value").run(today);
    const open=d.prepare("SELECT * FROM messages WHERE stage IN ('nieuw','opgevolgd','gesprek') AND (stage='nieuw' OR (follow_up!='' AND follow_up<=?)) ORDER BY id").all(today) as Lead[];
    const appts=d.prepare("SELECT name,slot,topic FROM appointments WHERE slot LIKE ? AND status!='geannuleerd' ORDER BY slot").all(today+' %') as {name:string;slot:string;topic:string}[];
    if(!open.length&&!appts.length)return;
    const to=process.env.NOTIFY_TO||allSettings().email;if(!to)return;
    const lines=[`Goedemorgen! Dit staat vandaag open.`,'',open.length?`Leads om op te volgen (${open.length}):\n`+open.map(l=>`- ${l.name}${l.company?' ('+l.company+')':''}: ${KIND[l.kind]||'Bericht'}, ${stageLabel(l.stage)}, ${ageText(l)}${l.follow_up?', opvolgen '+l.follow_up:''}`).join('\n'):'Geen leads die opvolging vragen.','',appts.length?`Afspraken vandaag:\n`+appts.map(a=>`- ${a.slot.slice(11)} ${a.name}${a.topic?': '+a.topic:''}`).join('\n'):'Geen afspraken vandaag.','',`Open de leads: ${siteUrl()}/admin/leads`];
    await sendMail({to,subject:`${open.length} lead${open.length===1?'':'s'} en ${appts.length} afspra${appts.length===1?'ak':'ken'} vandaag`,text:lines.join('\n')})}catch(e){console.error('Leaddigest mislukt:',e instanceof Error?e.message:'onbekend')}};
  setTimeout(()=>void tick(),30_000);g.nimagoLeadDigest=setInterval(()=>void tick(),10*60_000);g.nimagoLeadDigest.unref?.();
}
