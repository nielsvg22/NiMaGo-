import {db,allSettings} from './db';import {magnets} from '@/data/magnets';import {sendMail,siteUrl} from './mail';import {unsubToken} from './magnet-token';
/** Opvolgmails na een download, alleen voor wie daar uitdrukkelijk toestemming voor gaf. Elke mail heeft een afmeldlink. */
export const unsubUrl=(email:string)=>`${siteUrl()}/afmelden?e=${encodeURIComponent(email)}&t=${unsubToken(email)}`;
export function scheduleNurture(email:string,name:string,magnet:string){
  const d=db();if(d.prepare('SELECT 1 FROM nurture WHERE email=? AND magnet=?').get(email,magnet))return;
  const at=(days:number)=>new Date(Date.now()+days*86400000).toISOString().replace('T',' ').slice(0,19);
  const ins=d.prepare('INSERT INTO nurture(email,name,magnet,step,send_at) VALUES(?,?,?,?,?)');ins.run(email,name,magnet,1,at(2));ins.run(email,name,magnet,2,at(6));
}
export function cancelNurture(email:string){db().prepare('UPDATE nurture SET cancelled=1 WHERE lower(email)=lower(?) AND sent_at=\'\'').run(email);db().prepare('DELETE FROM subscribers WHERE lower(email)=lower(?)').run(email)}
export async function processNurture(){
  const d=db();const due=d.prepare("SELECT * FROM nurture WHERE sent_at='' AND cancelled=0 AND send_at<=datetime('now') ORDER BY id LIMIT 10").all() as {id:number;email:string;name:string;magnet:string;step:number}[];
  for(const r of due){
    d.prepare("UPDATE nurture SET sent_at=datetime('now') WHERE id=? AND sent_at=''").run(r.id); // eerst markeren: nooit dubbel versturen
    const m=magnets.find(x=>x.slug===r.magnet);if(!m)continue;const first=(r.name||'').split(' ')[0]||'';const hi=first?`Hoi ${first}`:'Hoi';
    const subject=r.step===1?'Een snelle tip bij je checklist':'Hulp bij je volgende stap';
    const text=r.step===1?`${hi},\n\nEen paar dagen geleden download je "${m.short}". Een tip om mee te beginnen:\n\n${m.tip}\n\nHeb je een vraag bij de checklist? Reageer gerust op deze mail, dan denk ik met je mee.`:`${hi},\n\n${m.follow}\n\nEen kennismaking is vrijblijvend en kan online of bij jou in de buurt van Apeldoorn: ${siteUrl()}/kennismaking`;
    await sendMail({to:r.email,subject,text,replyTo:allSettings().email||undefined,unsubscribe:unsubUrl(r.email)});
  }
}
export function startNurture(){
  const g=globalThis as typeof globalThis&{nimagoNurture?:ReturnType<typeof setInterval>};if(g.nimagoNurture||process.env.NODE_ENV!=='production'||process.env.NEXT_PHASE==='phase-production-build')return;
  const run=()=>void processNurture().catch(e=>console.error('Nurture mislukt:',e instanceof Error?e.message:'onbekend'));setTimeout(run,45_000);g.nimagoNurture=setInterval(run,10*60_000);g.nimagoNurture.unref?.();
}
