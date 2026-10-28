import {NextRequest,NextResponse} from 'next/server';
import {db} from '@/lib/db';import {visitorHash,privacyAllowed} from '@/lib/marketing';
export async function POST(req:NextRequest){
 const origin=req.headers.get('origin');if(!origin||new URL(origin).host!==req.headers.get('host'))return new NextResponse(null,{status:403});
 let accepted=false;try{const raw=await req.text();if(raw.length>100)return new NextResponse(null,{status:400});const body=JSON.parse(raw);if(typeof body.accepted!=='boolean')return new NextResponse(null,{status:400});accepted=body.accepted&&privacyAllowed(req.headers)}catch{return new NextResponse(null,{status:400})}
 const res=NextResponse.json({accepted},{headers:{'Cache-Control':'no-store'}});const options={secure:req.nextUrl.protocol==='https:',sameSite:'lax' as const,path:'/'};
 res.cookies.set('nm_consent',accepted?'v1-accepted':'v1-rejected',{...options,maxAge:180*86400});
 if(!accepted){const id=req.cookies.get('nm_visitor')?.value;if(id&&/^[a-f0-9]{64}$/.test(id))db().prepare('DELETE FROM marketing_visitors WHERE id_hash=?').run(visitorHash(id));res.cookies.set('nm_visitor','',{...options,httpOnly:true,maxAge:0})}return res;
}
