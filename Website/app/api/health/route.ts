import {NextResponse} from 'next/server';import {db} from '@/lib/db';
export const dynamic='force-dynamic';
/** Voor uptime-monitoring: 200 als de site en de database werken. */
export function GET(){try{db().prepare('SELECT 1').get();return NextResponse.json({ok:true},{headers:{'Cache-Control':'no-store'}})}catch{return NextResponse.json({ok:false},{status:503,headers:{'Cache-Control':'no-store'}})}}
