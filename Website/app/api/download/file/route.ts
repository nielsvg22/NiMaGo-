import {NextRequest,NextResponse} from 'next/server';import {checkDownload} from '@/lib/magnet-token';import {magnetPdf} from '@/lib/magnet-pdf';
export const dynamic='force-dynamic';
export async function GET(req:NextRequest){
  const slug=req.nextUrl.searchParams.get('slug')||'',t=req.nextUrl.searchParams.get('t')||'';const nf=()=>new NextResponse('Link ongeldig of verlopen. Vraag de download opnieuw aan op nimagodigital.nl/downloads.',{status:403,headers:{'Cache-Control':'no-store'}});
  if(!checkDownload(slug,t))return nf();const bytes=await magnetPdf(slug);if(!bytes)return nf();
  return new NextResponse(Buffer.from(bytes),{headers:{'Content-Type':'application/pdf','Content-Disposition':`attachment; filename="NiMaGo-${slug}.pdf"`,'Cache-Control':'private, no-store','X-Robots-Tag':'noindex'}})}
