import {PDFDocument,PDFFont,PDFPage,StandardFonts,rgb,LineCapStyle} from 'pdf-lib';
import {allSettings} from './db';
import {eur,fmtDate} from './money';
import {getInvoice,lineTotal,type Line,type Customer,type Totals} from './invoice';
import {getQuote} from './portal';

/* Factuur in de NiMaGo-huisstijl: logo rechtsboven, grote titel, zandkleurige tabelkop, donker totaalblok, voetregel met bedrijfsgegevens. */
const INK=rgb(0.165,0.09,0.075),COPPER=rgb(0.659,0.376,0.243),AMBER=rgb(0.886,0.627,0.416),SAND=rgb(0.945,0.878,0.8),CREAM=rgb(0.984,0.945,0.918),MUTED=rgb(0.478,0.373,0.345),LINE=rgb(0.9,0.835,0.753),WHITE=rgb(1,1,1);
const W=595.28,H=841.89,M=52;

type Doc={kind:'Factuur'|'Offerte';number:string|null;lines:Line[];customer:Customer;totals:Totals;vatReverse:boolean;notes:string;meta:[string,string][];subtitle?:string;pay?:{reference:string;due:string}};
export async function invoicePdf(id:number):Promise<Uint8Array|null>{
  const data=getInvoice(id);if(!data)return null;const {inv,lines,customer,totals}=data;
  const meta:[string,string][]=[['Factuurnummer',inv.number||'Concept'],['Factuurdatum',fmtDate(inv.issue_date)],['Vervaldatum',fmtDate(inv.due_date)]];if(inv.reference)meta.push(['Referentie',inv.reference]);
  return renderPdf({kind:'Factuur',number:inv.number,lines,customer,totals,vatReverse:!!inv.vat_reverse,notes:inv.notes,meta,pay:{reference:inv.number||'-',due:inv.due_date}});
}
export async function quotePdf(id:number):Promise<Uint8Array|null>{
  const data=getQuote(id);if(!data)return null;const {q,lines,customer,totals}=data;
  const meta:[string,string][]=[['Offertenummer',q.number||'Concept'],['Offertedatum',fmtDate(q.issue_date)],['Geldig tot',fmtDate(q.valid_until)]];
  return renderPdf({kind:'Offerte',number:q.number,lines,customer,totals,vatReverse:!!q.vat_reverse,notes:q.notes,meta,subtitle:q.title});
}
async function renderPdf(doc:Doc):Promise<Uint8Array>{
  const {lines,customer,totals}=doc;const s=allSettings();const word=doc.kind;
  const inv={number:doc.number,vat_reverse:doc.vatReverse?1:0,notes:doc.notes,due_date:doc.pay?.due||''};
  const pdf=await PDFDocument.create();
  pdf.setTitle(`${word} ${doc.number||'concept'}`);pdf.setAuthor(s.company_name||'NiMaGo');pdf.setCreator('NiMaGo admin');
  const reg=await pdf.embedFont(StandardFonts.Helvetica),bold=await pdf.embedFont(StandardFonts.HelveticaBold);
  const okChars=new Set(reg.getCharacterSet());
  const safe=(t:string)=>Array.from(String(t??'').replace(/[‘’]/g,"'").replace(/[“”]/g,'"').replace(/–|—/g,'-').replace(/ /g,' ')).map(c=>okChars.has(c.codePointAt(0)!)?c:'?').join('');
  const wrap=(text:string,font:PDFFont,size:number,maxW:number)=>{const out:string[]=[];for(const para of safe(text).split(/\r?\n/)){let line='';for(const w of para.split(/\s+/)){const t=line?line+' '+w:w;if(font.widthOfTextAtSize(t,size)<=maxW)line=t;else{if(line)out.push(line);line=w}}out.push(line)}return out};

  let page:PDFPage=pdf.addPage([W,H]);let pageNo=1;
  const text=(t:string,x:number,y:number,o:{size?:number;font?:PDFFont;color?:ReturnType<typeof rgb>;align?:'left'|'right'|'center';spacing?:number}={})=>{const size=o.size??10,font=o.font??reg;const str=safe(t);const w=font.widthOfTextAtSize(str,size)+(o.spacing?o.spacing*(str.length-1):0);const px=o.align==='right'?x-w:o.align==='center'?x-w/2:x;if(o.spacing){let cx=px;for(const ch of Array.from(str)){page.drawText(ch,{x:cx,y,size,font,color:o.color??INK});cx+=font.widthOfTextAtSize(ch,size)+o.spacing}}else page.drawText(str,{x:px,y,size,font,color:o.color??INK})};
  const rrect=(x:number,y:number,w:number,h:number,r:number,color:ReturnType<typeof rgb>)=>{page.drawSvgPath(`M ${r} 0 H ${w-r} Q ${w} 0 ${w} ${r} V ${h-r} Q ${w} ${h} ${w-r} ${h} H ${r} Q 0 ${h} 0 ${h-r} V ${r} Q 0 0 ${r} 0 Z`,{x,y:y+h,color})};

  const drawLogo=()=>{ // N-beeldmerk + woordmerk, rechtsboven
    const sc=0.3,ox=W-M-118,oy=H-M+6;
    page.drawSvgPath('M 22 96 V 25 M 22 25 L 98 96 M 98 96 V 25',{x:ox,y:oy,scale:sc,borderColor:COPPER,borderWidth:19,borderLineCap:LineCapStyle.Round,borderOpacity:1});
    text('iMaGo',ox+40,H-M-14,{font:bold,size:20,color:INK});
    text('DIGITAL SOLUTIONS',ox+41,H-M-26,{size:5.6,color:COPPER,spacing:1.9,font:bold});
  };
  const footer=()=>{
    page.drawLine({start:{x:M,y:60},end:{x:W-M,y:60},thickness:.6,color:LINE});
    const parts=[s.company_name,s.kvk&&`KvK ${s.kvk}`,s.vat_id&&`Btw-id ${s.vat_id}`,s.iban&&`IBAN ${s.iban}`].filter(Boolean).join('  |  ');
    text(parts,W/2,44,{size:7.5,color:MUTED,align:'center'});
    const contact=[s.email,s.phone,s.website].filter(Boolean).join('  |  ');if(contact)text(contact,W/2,33,{size:7.5,color:MUTED,align:'center'});
    text(`Pagina ${pageNo}`,W-M,33,{size:7,color:MUTED,align:'right'});
  };

  // ── kop
  drawLogo();
  text(word,M,H-M-22,{font:bold,size:30});
  text(inv.number?`Nummer ${inv.number}${doc.subtitle?'  -  '+doc.subtitle:''}`:`CONCEPT - nog geen ${word.toLowerCase()}nummer`,M,H-M-42,{size:10.5,color:inv.number?MUTED:COPPER,font:inv.number?reg:bold});
  page.drawRectangle({x:M,y:H-M-52,width:34,height:2.2,color:AMBER});

  // afzender (onder logo, rechts)
  let y=H-M-52;
  const sender=[s.company_name,s.legal_form,s.address,[s.postcode,s.city].filter(Boolean).join(' '),s.country].filter(Boolean);
  for(const l of sender){text(l,W-M,y,{size:8.5,color:MUTED,align:'right'});y-=11}

  // aan + metagegevens
  let top=H-210;
  text(word==='Offerte'?'OFFERTE VOOR':'FACTUUR AAN',M,top,{size:7.5,font:bold,color:COPPER,spacing:1.4});
  let ly=top-16;
  const cl=[customer.name,customer.contact&&`t.a.v. ${customer.contact}`,customer.address,[customer.postcode,customer.city].filter(Boolean).join(' '),customer.country&&customer.country!=='Nederland'?customer.country:'',customer.kvk&&`KvK ${customer.kvk}`,customer.vat_id&&`Btw-id ${customer.vat_id}`].filter(Boolean) as string[];
  cl.forEach((l,i)=>{text(l,M,ly,{size:i===0?11:9.5,font:i===0?bold:reg});ly-=i===0?15:12.5});
  const mx=W-M-190;
  let my=top;for(const [k,v] of doc.meta){text(k.toUpperCase(),mx,my,{size:7,font:bold,color:COPPER,spacing:1.2});text(v,W-M,my,{size:9.5,align:'right',font:bold});my-=19}

  // ── tabel
  const cx={desc:M+10,qty:W-M-215,price:W-M-140,vat:W-M-92,tot:W-M-10};
  let ty=Math.min(ly,my)-34;
  const header=()=>{page.drawRectangle({x:M,y:ty-8,width:W-2*M,height:24,color:SAND});
    text('Omschrijving',cx.desc,ty,{size:8.5,font:bold});text('Aantal',cx.qty,ty,{size:8.5,font:bold,align:'right'});text('Tarief',cx.price,ty,{size:8.5,font:bold,align:'right'});text('Btw',cx.vat,ty,{size:8.5,font:bold,align:'right'});text('Totaal',cx.tot,ty,{size:8.5,font:bold,align:'right'});ty-=28};
  header();
  lines.forEach((l,i)=>{
    const dl=wrap(l.description,reg,9.5,cx.qty-cx.desc-48);const h=Math.max(1,dl.length)*12+10;
    if(ty-h<150){footer();page=pdf.addPage([W,H]);pageNo++;ty=H-M-10;header()}
    if(i%2===0)page.drawRectangle({x:M,y:ty-h+10,width:W-2*M,height:h,color:CREAM});
    dl.forEach((t,k)=>text(t,cx.desc,ty-k*12,{size:9.5}));
    const q=Number.isInteger(l.quantity)?String(l.quantity):String(l.quantity).replace('.',',');
    text(q,cx.qty,ty,{size:9.5,align:'right'});text(eur(l.unit_cents),cx.price,ty,{size:9.5,align:'right'});text(inv.vat_reverse?'verlegd':`${l.vat_rate}%`,cx.vat,ty,{size:9.5,align:'right',color:MUTED});text(eur(lineTotal(l)),cx.tot,ty,{size:9.5,align:'right',font:bold});
    ty-=h;
  });
  page.drawLine({start:{x:M,y:ty+8},end:{x:W-M,y:ty+8},thickness:.6,color:LINE});

  // ── totalen
  if(ty<260){footer();page=pdf.addPage([W,H]);pageNo++;ty=H-M-10}
  ty-=14;const tx=W-M-215;
  const row=(k:string,v:string)=>{text(k,tx,ty,{size:9.5,color:MUTED});text(v,W-M-10,ty,{size:9.5,align:'right',font:bold});ty-=16};
  row('Subtotaal excl. btw',eur(totals.subtotal));
  if(inv.vat_reverse)row('Btw','verlegd (0%)');else for(const r of Object.keys(totals.vat).map(Number).sort((a,b)=>b-a))row(`Btw ${r}%`,eur(totals.vat[r]));
  ty-=14;rrect(tx-12,ty-14,227,34,9,INK);
  text(word==='Offerte'?'Totaal offerte':'Totaal te betalen',tx,ty-2,{size:10,font:bold,color:WHITE});text(eur(totals.total),W-M-10,ty-3,{size:13,font:bold,color:rgb(0.965,0.82,0.706),align:'right'});
  ty-=52;
  if(inv.vat_reverse){const n=wrap('Btw verlegd. Het btw-nummer van de afnemer is vermeld; de afnemer is verantwoordelijk voor de afdracht van btw.',reg,8.5,W-2*M);n.forEach(t=>{text(t,M,ty,{size:8.5,color:MUTED});ty-=11});ty-=4}

  // ── betaling (alleen bij facturen)
  if(doc.pay){
  if(ty<150){footer();page=pdf.addPage([W,H]);pageNo++;ty=H-M-10}
  text('BETALING',M,ty,{size:7.5,font:bold,color:COPPER,spacing:1.4});ty-=16;
  const pay:[string,string][]=[['IBAN',s.iban||'-'],['Ten name van',s.company_name||'-'],['Betalingskenmerk',doc.pay.reference],['Uiterlijk',fmtDate(doc.pay.due)]];if(s.bic)pay.splice(1,0,['BIC',s.bic]);
  for(const [k,v] of pay){text(k,M,ty,{size:9,color:MUTED});text(v,M+96,ty,{size:9.5,font:bold});ty-=14}
  ty-=6;}
  const note=[inv.notes,doc.pay?s.footer_note:'Deze offerte is vrijblijvend tot de genoemde datum. Akkoord geven kan via je klantaccount of door deze offerte ondertekend te retourneren.'].filter(Boolean).join('\n\n');
  for(const t of wrap(note,reg,8.8,W-2*M)){if(ty<80)break;text(t,M,ty,{size:8.8,color:MUTED});ty-=11.5}
  footer();
  return pdf.save();
}
