import fs from 'node:fs';import path from 'node:path';import os from 'node:os';import {execFile} from 'node:child_process';import {promisify} from 'node:util';import {db} from './db';
const dataDir=process.env.DATA_DIR||path.join(process.cwd(),'.data');
const dir=path.join(dataDir,'backups');
export const backupDir=()=>dir;
export function listBackups(){try{return fs.readdirSync(dir).filter(f=>/^nimago-\d{4}-\d{2}-\d{2}\.db$/.test(f)).sort().reverse().map(f=>({name:f,size:fs.statSync(path.join(dir,f)).size}))}catch{return[]}}
function copyReceipts(target:string){fs.mkdirSync(target,{recursive:true});const source=path.join(dataDir,'bookkeeping-receipts');if(fs.existsSync(source))fs.cpSync(source,target,{recursive:true})}
function copyInstagram(target:string){fs.mkdirSync(target,{recursive:true});const source=path.join(dataDir,'instagram-media');if(fs.existsSync(source))fs.cpSync(source,target,{recursive:true})}
let inFlight:Promise<string>|null=null;
export async function runBackup(){
 if(inFlight)return inFlight;
 inFlight=(async()=>{fs.mkdirSync(dir,{recursive:true});const day=new Date().toISOString().slice(0,10),target=path.join(dir,`nimago-${day}.db`),tmp=target+'.tmp';
  try{await db().backup(tmp);copyReceipts(path.join(dir,`nimago-${day}-receipts`));copyInstagram(path.join(dir,`nimago-${day}-instagram`));fs.renameSync(tmp,target);
   for(const f of listBackups().slice(14)){try{fs.unlinkSync(path.join(dir,f.name));fs.rmSync(path.join(dir,f.name.replace('.db','-receipts')),{recursive:true,force:true});fs.rmSync(path.join(dir,f.name.replace('.db','-instagram')),{recursive:true,force:true})}catch{}}
   return target;
  }finally{try{fs.unlinkSync(tmp)}catch{}}
 })();try{return await inFlight}finally{inFlight=null}
}
/** Verse consistente database, daarna alle onveranderlijke bonbestanden. Geen shell of gebruikerspaden. */
export async function createBackupBundle(){
 const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'nimago-full-'));try{await db().backup(path.join(tmp,'nimago.db'));copyReceipts(path.join(tmp,'bookkeeping-receipts'));copyInstagram(path.join(tmp,'instagram-media'));const file=path.join(tmp,'nimago-backup.tar.gz');await promisify(execFile)('tar',['-czf',file,'-C',tmp,'nimago.db','bookkeeping-receipts','instagram-media'],{timeout:120000});return{file,dir:tmp}}catch(e){fs.rmSync(tmp,{recursive:true,force:true});throw e}
}
let started=false;
export function startBackups(){
 if(started||process.env.NODE_ENV!=='production'||process.env.NEXT_PHASE==='phase-production-build')return;started=true;
 const tick=()=>{const day=new Date().toISOString().slice(0,10),name=`nimago-${day}.db`;if(!listBackups().some(b=>b.name===name)||!fs.existsSync(path.join(dir,`nimago-${day}-receipts`))||!fs.existsSync(path.join(dir,`nimago-${day}-instagram`)))runBackup().catch(e=>console.error('Back-up mislukt:',e instanceof Error?e.message:'onbekend'))};
 const initial=setTimeout(tick,60_000);initial.unref();setInterval(tick,6*60*60*1000).unref();
}
