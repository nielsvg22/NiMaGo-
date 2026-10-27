import {NextRequest,NextResponse} from 'next/server';import {currentAccount} from '@/lib/account';import {db} from '@/lib/db';import {invoicePdf,quotePdf} from '@/lib/pdf';
export const dynamic='force-dynamic';
/** PDF's voor de klant: alleen definitieve documenten van de klant waaraan dit account gekoppeld is. */
export async function GET(req:NextRequest){
  const a=await currentAccount();const nf=()=>new NextResponse('Niet gevonden',{status:404,headers:{'Cache-Control':'no-store'}});
  if(!a)return new NextResponse('Niet ingelogd',{status:401,headers:{'Cache-Control':'no-store'}});
  if(a.status!=='actief'||!a.customer_id)return nf();
  const id=Number(req.nextUrl.searchParams.get('id'));if(!Number.isInteger(id))return nf();
  const quote=req.nextUrl.searchParams.get('type')==='offerte';
  const row=db().prepare(`SELECT number FROM ${quote?'quotes':'invoices'} WHERE id=? AND customer_id=? AND status!='concept' AND number IS NOT NULL`).get(id,a.customer_id) as {number:string}|undefined;
  if(!row)return nf();
  const bytes=quote?await quotePdf(id):await invoicePdf(id);if(!bytes)return nf();
  return new NextResponse(Buffer.from(bytes),{headers:{'Content-Type':'application/pdf','Content-Disposition':`inline; filename="${quote?'Offerte':'Factuur'}-${row.number.replace(/[^A-Za-z0-9_-]/g,'_')}.pdf"`,'Cache-Control':'private, no-store'}});
}
