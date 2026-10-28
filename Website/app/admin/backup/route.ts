import {NextRequest,NextResponse} from 'next/server';import fs from 'node:fs';import os from 'node:os';import path from 'node:path';import {Readable} from 'node:stream';import {isAdmin} from '@/lib/auth';import {db} from '@/lib/db';import {createBackupBundle} from '@/lib/backup';
export const dynamic='force-dynamic';
export async function GET(req:NextRequest){
 if(!(await isAdmin()))return new NextResponse('Niet ingelogd',{status:401});
 if(req.nextUrl.searchParams.get('bundel')==='1'){
  try{const bundle=await createBackupBundle();const stream=fs.createReadStream(bundle.file);stream.on('close',()=>{fs.rmSync(bundle.dir,{recursive:true,force:true})});return new NextResponse(Readable.toWeb(stream) as ReadableStream<Uint8Array>,{headers:{'Content-Type':'application/gzip','Content-Disposition':`attachment; filename="nimago-volledig-${new Date().toISOString().slice(0,10)}.tar.gz"`,'Cache-Control':'private, no-store'}})}catch(e){console.error('Volledige back-up mislukt',e);return new NextResponse('Back-up maken mislukt. Probeer opnieuw.',{status:500})}
 }
 const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'nimago-db-')),file=path.join(tmp,'nimago.db');
 try{await db().backup(file);return new NextResponse(new Uint8Array(fs.readFileSync(file)),{headers:{'Content-Type':'application/octet-stream','Content-Disposition':`attachment; filename="nimago-${new Date().toISOString().slice(0,10)}.db"`,'Cache-Control':'private, no-store'}})}finally{fs.rmSync(tmp,{recursive:true,force:true})}
}
