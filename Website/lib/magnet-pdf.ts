import {PDFDocument,PDFFont,PDFPage,StandardFonts,rgb} from 'pdf-lib';import {allSettings} from './db';import {magnets} from '@/data/magnets';
/** Gratis checklists als PDF in de NiMaGo-huisstijl: kop, secties met aanvinkvakjes en een voetregel met contactgegevens. */
const INK=rgb(.165,.09,.075),COPPER=rgb(.659,.376,.243),AMBER=rgb(.886,.627,.416),SAND=rgb(.945,.878,.8),MUTED=rgb(.478,.373,.345),WHITE=rgb(1,1,1);
const W=595.28,H=841.89,M=54;
export async function magnetPdf(slug:string):Promise<Uint8Array|null>{
  const m=magnets.find(x=>x.slug===slug);if(!m)return null;const s=allSettings();
  const pdf=await PDFDocument.create();pdf.setTitle(m.title);pdf.setAuthor(s.company_name||'NiMaGo');
  const reg=await pdf.embedFont(StandardFonts.Helvetica),bold=await pdf.embedFont(StandardFonts.HelveticaBold);const ok=new Set(reg.getCharacterSet());
  const safe=(t:string)=>Array.from(t.replace(/[‘’]/g,"'").replace(/[“”]/g,'"').replace(/–|—/g,'-')).map(c=>ok.has(c.codePointAt(0)!)?c:'?').join('');
  const wrap=(t:string,f:PDFFont,size:number,max:number)=>{const out:string[]=[];let line='';for(const w of safe(t).split(/\s+/)){const x=line?line+' '+w:w;if(f.widthOfTextAtSize(x,size)<=max)line=x;else{if(line)out.push(line);line=w}}if(line)out.push(line);return out};
  let page:PDFPage=pdf.addPage([W,H]);let y=H-M;let n=1;
  const foot=()=>{page.drawLine({start:{x:M,y:58},end:{x:W-M,y:58},thickness:.6,color:SAND});const parts=[s.company_name,s.website||'nimagodigital.nl',s.email,s.phone].filter(Boolean).join('  |  ');page.drawText(safe(parts),{x:M,y:40,size:8,font:reg,color:MUTED});page.drawText(`Pagina ${n}`,{x:W-M-40,y:40,size:8,font:reg,color:MUTED})};
  const brk=(need:number)=>{if(y-need<80){foot();page=pdf.addPage([W,H]);n++;y=H-M}};
  // kop
  page.drawRectangle({x:0,y:H-150,width:W,height:150,color:INK});page.drawRectangle({x:0,y:H-154,width:W,height:4,color:COPPER});
  page.drawText('N',{x:M,y:H-70,size:30,font:bold,color:AMBER});page.drawText('iMaGo',{x:M+22,y:H-70,size:30,font:bold,color:WHITE});page.drawText('DIGITAL SOLUTIONS',{x:M+1,y:H-85,size:7,font:bold,color:AMBER});
  let ty=H-112;for(const l of wrap(m.title,bold,20,W-2*M)){page.drawText(l,{x:M,y:ty,size:20,font:bold,color:WHITE});ty-=24}
  y=H-190;for(const l of wrap(m.intro,reg,11,W-2*M)){page.drawText(l,{x:M,y,size:11,font:reg,color:INK});y-=16}y-=8;
  for(const sec of m.sections){brk(60);page.drawText(safe(sec.h).toUpperCase(),{x:M,y,size:9,font:bold,color:COPPER});y-=6;page.drawRectangle({x:M,y,width:34,height:2,color:AMBER});y-=20;
    for(const it of sec.items){const ls=wrap(it,reg,10.5,W-2*M-30);brk(ls.length*14+8);page.drawRectangle({x:M,y:y-3,width:12,height:12,borderColor:COPPER,borderWidth:1.2,color:WHITE});ls.forEach((l,i)=>page.drawText(l,{x:M+24,y:y-i*14,size:10.5,font:reg,color:INK}));y-=ls.length*14+8}y-=10}
  brk(90);page.drawRectangle({x:M,y:y-60,width:W-2*M,height:66,color:SAND});let oy=y-18;for(const l of wrap(m.outro,reg,10.5,W-2*M-28)){page.drawText(l,{x:M+14,y:oy,size:10.5,font:reg,color:INK});oy-=14}y-=84;
  brk(70);for(const l of wrap(m.follow+' Mail info@nimagodigital.nl of kijk op nimagodigital.nl.',bold,10,W-2*M)){page.drawText(l,{x:M,y,size:10,font:bold,color:COPPER});y-=14}
  foot();return pdf.save()}
