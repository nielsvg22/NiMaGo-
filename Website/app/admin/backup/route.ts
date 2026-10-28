import {NextResponse} from 'next/server';import fs from 'node:fs';import os from 'node:os';import path from 'node:path';import {isAdmin} from '@/lib/auth';import {db} from '@/lib/db';
export const dynamic='force-dynamic';
/** Levert een verse, consistente kopie van de database als download (alleen voor de admin). Bevat klantgegevens en wachtwoord-hashes: veilig bewaren. */
export async function GET(){
  if(!(await isAdmin()))return new NextResponse('Niet ingelogd',{status:401});
  const tmp=path.join(os.tmpdir(),`nimago-dl-${Date.now()}.db`);
  try{await db().backup(tmp);const buf=fs.readFileSync(tmp);return new NextResponse(buf,{headers:{'Content-Type':'application/octet-stream','Content-Disposition':`attachment; filename="nimago-${new Date().toISOString().slice(0,10)}.db"`,'Cache-Control':'no-store'}})}
  finally{try{fs.unlinkSync(tmp)}catch{}}}
