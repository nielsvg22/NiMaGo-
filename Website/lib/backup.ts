import fs from 'node:fs';import path from 'node:path';import {db} from './db';
/** Back-ups van de SQLite-database: één per dag in DATA_DIR/backups, de laatste 14 blijven bewaard. Dit beschermt tegen fouten en corruptie; download ze ook regelmatig via Admin → Instellingen en bewaar ze elders. */
const dir=path.join(process.env.DATA_DIR||path.join(process.cwd(),'.data'),'backups');
export const backupDir=()=>dir;
export function listBackups(){try{return fs.readdirSync(dir).filter(f=>/^nimago-\d{4}-\d{2}-\d{2}\.db$/.test(f)).sort().reverse().map(f=>({name:f,size:fs.statSync(path.join(dir,f)).size}))}catch{return[]}}
export async function runBackup(){
  fs.mkdirSync(dir,{recursive:true});const day=new Date().toISOString().slice(0,10);const target=path.join(dir,`nimago-${day}.db`);const tmp=target+'.tmp';
  await db().backup(tmp);fs.renameSync(tmp,target);
  for(const f of listBackups().slice(14))try{fs.unlinkSync(path.join(dir,f.name))}catch{}
  return target}
let started=false;
export function startBackups(){
  if(started)return;started=true;
  const tick=()=>{const today=`nimago-${new Date().toISOString().slice(0,10)}.db`;if(!listBackups().some(b=>b.name===today))runBackup().catch(e=>console.error('Back-up mislukt:',e instanceof Error?e.message:'onbekend'))};
  setTimeout(tick,60_000);setInterval(tick,6*60*60*1000).unref?.()}
