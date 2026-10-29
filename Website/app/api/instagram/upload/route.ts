import {NextRequest,NextResponse} from 'next/server';
import {isAdmin,rateLimit} from '@/lib/auth';
import {saveUpload,MediaError} from '@/lib/instagram/media';
export const runtime='nodejs';
export async function POST(req:NextRequest){
 if(!await isAdmin())return NextResponse.json({error:'Log in als beheerder.'},{status:401});
 const origin=req.headers.get('origin');if(!origin||new URL(origin).host!==req.headers.get('host'))return NextResponse.json({error:'Ongeldige oorsprong.'},{status:403});
 if(!rateLimit('instagram-upload',30,600000))return NextResponse.json({error:'Te veel uploads. Probeer later opnieuw.'},{status:429});
 try{const result=await saveUpload(req.body,req.headers.get('content-type')?.split(';')[0]||'',Number(req.headers.get('content-length')||0));return NextResponse.json(result,{headers:{'Cache-Control':'no-store'}})}catch(e){return NextResponse.json({error:e instanceof MediaError?e.message:'Upload mislukt.'},{status:400,headers:{'Cache-Control':'no-store'}})}
}
