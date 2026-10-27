import {NextRequest,NextResponse} from 'next/server';import {isAdmin} from '@/lib/auth';import {invoicePdf,quotePdf} from '@/lib/pdf';import {getInvoice} from '@/lib/invoice';import {getQuote} from '@/lib/portal';
export const dynamic='force-dynamic';
export async function GET(req:NextRequest){
  if(!(await isAdmin()))return new NextResponse('Niet ingelogd',{status:401});
  const n=Number(req.nextUrl.searchParams.get('id'));if(!Number.isInteger(n))return new NextResponse('Niet gevonden',{status:404});
  const quote=req.nextUrl.searchParams.get('type')==='offerte';
  const number=quote?getQuote(n)?.q.number:getInvoice(n)?.inv.number;const exists=quote?!!getQuote(n):!!getInvoice(n);if(!exists)return new NextResponse('Niet gevonden',{status:404});
  const bytes=quote?await quotePdf(n):await invoicePdf(n);if(!bytes)return new NextResponse('Niet gevonden',{status:404});
  const name=(number||`concept-${n}`).replace(/[^A-Za-z0-9_-]/g,'_');
  return new NextResponse(Buffer.from(bytes),{headers:{'Content-Type':'application/pdf','Content-Disposition':`inline; filename="${quote?'Offerte':'Factuur'}-${name}.pdf"`,'Cache-Control':'no-store'}});
}
