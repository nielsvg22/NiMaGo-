import {NextRequest,NextResponse} from 'next/server';
import {isAdmin} from '@/lib/auth';
import {db} from '@/lib/db';
import fs from 'node:fs';
import path from 'node:path';
import type {Expense} from '@/lib/bookkeeping';
export const dynamic='force-dynamic';
export async function GET(req:NextRequest){
 if(!await isAdmin())return new NextResponse('Niet ingelogd',{status:401});
 const id=Number(req.nextUrl.searchParams.get('id'));if(!Number.isSafeInteger(id)||id<=0)return new NextResponse('Niet gevonden',{status:404});
 const e=db().prepare('SELECT * FROM bookkeeping_expenses WHERE id=?').get(id) as Expense|undefined;
 if(!e?.receipt||! /^[a-f0-9-]+\.(pdf|jpg|png)$/.test(e.receipt))return new NextResponse('Geen bijlage',{status:404});
 const file=path.join(process.env.DATA_DIR||path.join(process.cwd(),'.data'),'bookkeeping-receipts',e.receipt);
 try{return new NextResponse(new Uint8Array(fs.readFileSync(file)),{headers:{'Content-Type':e.receipt_type,'Content-Disposition':`attachment; filename="bon-${id}.${e.receipt.split('.').pop()}"`,'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff','Content-Security-Policy':"sandbox; default-src 'none'"}})}catch{return new NextResponse('Bijlage ontbreekt. Controleer de gegevensopslag of back-up.',{status:404})}
}
