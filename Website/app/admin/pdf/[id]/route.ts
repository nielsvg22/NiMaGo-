import {NextRequest,NextResponse} from 'next/server';import {isAdmin} from '@/lib/auth';import {invoicePdf} from '@/lib/pdf';import {getInvoice} from '@/lib/invoice';
export const dynamic='force-dynamic';
export async function GET(_req:NextRequest,{params}:{params:Promise<{id:string}>}){
  if(!(await isAdmin()))return new NextResponse('Niet ingelogd',{status:401});
  const {id}=await params;const n=Number(id);if(!Number.isInteger(n))return new NextResponse('Niet gevonden',{status:404});
  const x=getInvoice(n);if(!x)return new NextResponse('Niet gevonden',{status:404});
  const bytes=await invoicePdf(n);if(!bytes)return new NextResponse('Niet gevonden',{status:404});
  const name=(x.inv.number||`concept-${x.inv.id}`).replace(/[^A-Za-z0-9_-]/g,'_');
  return new NextResponse(Buffer.from(bytes),{headers:{'Content-Type':'application/pdf','Content-Disposition':`inline; filename="Factuur-${name}.pdf"`,'Cache-Control':'no-store'}});
}
