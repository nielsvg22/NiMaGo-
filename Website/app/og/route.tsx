import {ImageResponse} from 'next/og';import {NextRequest} from 'next/server';import {labelFor} from '@/lib/seo';
export const dynamic='force-dynamic';
/** Deelafbeelding (1200x630) in de huisstijl. Alleen titels van bestaande pagina's, zodat hier geen willekeurige tekst mee te maken is. */
export async function GET(req:NextRequest){
  const p=(req.nextUrl.searchParams.get('p')||'/').slice(0,160);const title=p==='/'?'Digitale ideeën. Sterk uitgevoerd.':labelFor(p.replace(/\/+$/,''))||'NiMaGo';
  const fs=title.length>70?54:title.length>45?64:76;
  return new ImageResponse(<div style={{width:'100%',height:'100%',display:'flex',flexDirection:'column',justifyContent:'space-between',background:'linear-gradient(135deg,#2A1713 0%,#3A2118 100%)',padding:'64px 72px',color:'#fff',fontFamily:'sans-serif'}}>
    <div style={{display:'flex',alignItems:'baseline',gap:14}}><div style={{display:'flex',fontSize:54,fontWeight:800,letterSpacing:-2}}><span style={{color:'#E2A06A'}}>N</span><span>iMaGo</span></div><div style={{fontSize:20,letterSpacing:6,color:'#E2A06A',textTransform:'uppercase'}}>Digital Solutions</div></div>
    <div style={{display:'flex',flexDirection:'column',gap:24}}><div style={{width:88,height:8,background:'#A8603E',borderRadius:4}}/><div style={{fontSize:fs,fontWeight:800,lineHeight:1.1,letterSpacing:-2,maxWidth:1000}}>{title}</div></div>
    <div style={{display:'flex',justifyContent:'space-between',fontSize:26,color:'#EAD3C8'}}><span>nimagodigital.nl</span><span>Websites, webshops en software uit Apeldoorn</span></div></div>,{width:1200,height:630,headers:{'Cache-Control':'public, max-age=86400, s-maxage=86400'}})}
