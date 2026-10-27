import {NextRequest,NextResponse} from 'next/server';import {freeSlots,openDates} from '@/lib/slots';
export const dynamic='force-dynamic';
export async function GET(req:NextRequest){const date=req.nextUrl.searchParams.get('date');const h={'Cache-Control':'no-store'};
  if(!date)return NextResponse.json({dates:openDates()},{headers:h});return NextResponse.json({date,slots:freeSlots(date)},{headers:h})}
