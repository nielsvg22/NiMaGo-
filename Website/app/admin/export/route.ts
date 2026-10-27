import {NextRequest,NextResponse} from 'next/server';import {isAdmin} from '@/lib/auth';import {db} from '@/lib/db';
export const dynamic='force-dynamic';
const esc=(v:string)=>{let s=String(v??'');if(/^[=+\-@\t\r]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"'};
export async function GET(req:NextRequest){
  if(!(await isAdmin()))return new NextResponse('Niet ingelogd',{status:401});
  if(req.nextUrl.searchParams.get('type')!=='subscribers')return new NextResponse('Onbekend',{status:404});
  const rows=db().prepare('SELECT email,source,created_at FROM subscribers ORDER BY id').all() as {email:string;source:string;created_at:string}[];
  const csv='email,bron,aangemeld\n'+rows.map(r=>[r.email,r.source,r.created_at].map(esc).join(',')).join('\n')+'\n';
  return new NextResponse(csv,{headers:{'Content-Type':'text/csv; charset=utf-8','Content-Disposition':'attachment; filename="nieuwsbrief-aanmeldingen.csv"','Cache-Control':'no-store'}});
}
