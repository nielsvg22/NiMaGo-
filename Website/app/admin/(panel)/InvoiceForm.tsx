'use client';
import {useMemo,useState} from 'react';import {saveInvoice,saveQuote} from '../actions';
type Cust={id:number;name:string};type L={description:string;quantity:string;price:string;vat_rate:number};
const euroToCents=(v:string)=>{const s=v.trim().replace(/[€\s]/g,'').replace(/\.(?=\d{3}(\D|$))/g,'').replace(',','.');const n=Number(s);return Number.isFinite(n)?Math.round(n*100):0};
const eur=(c:number)=>new Intl.NumberFormat('nl-NL',{style:'currency',currency:'EUR'}).format(c/100);
const addDays=(iso:string,d:number)=>{const x=new Date(iso+'T12:00:00Z');x.setUTCDate(x.getUTCDate()+d);return x.toISOString().slice(0,10)};
export default function InvoiceForm({customers,initial,paymentDays,error,quote}:{customers:Cust[];initial:{id?:number;customer_id?:number;issue_date:string;due_date:string;reference:string;notes:string;vat_reverse:boolean;lines:L[]};paymentDays:number;error?:boolean;quote?:boolean}){
  const [lines,setLines]=useState<L[]>(initial.lines.length?initial.lines:[{description:'',quantity:'1',price:'',vat_rate:21}]);
  const [issue,setIssue]=useState(initial.issue_date);const [due,setDue]=useState(initial.due_date);const [rev,setRev]=useState(initial.vat_reverse);
  const upd=(i:number,p:Partial<L>)=>setLines(ls=>ls.map((l,k)=>k===i?{...l,...p}:l));
  const t=useMemo(()=>{let sub=0;const vat:Record<number,number>={};for(const l of lines){const q=Number(String(l.quantity).replace(',','.'))||0;const tot=Math.round(q*euroToCents(l.price));sub+=tot;if(!rev)vat[l.vat_rate]=(vat[l.vat_rate]||0)+Math.round(tot*l.vat_rate/100)}const vt=Object.values(vat).reduce((a,b)=>a+b,0);return{sub,vat,total:sub+vt}},[lines,rev]);
  return <form action={quote?saveQuote:saveInvoice} className="fstack">
    {initial.id?<input type="hidden" name="id" value={initial.id}/>:null}
    <input type="hidden" name="lines" value={JSON.stringify(lines)}/>
    {error&&<p className="alert err" role="alert">Kies een klant en vul minimaal één regel met omschrijving en aantal in.</p>}
    <div className="adm-card fstack"><h2>Klant en data</h2>
      <div className="f2"><label>Klant<select name="customer_id" required defaultValue={initial.customer_id||''}><option value="" disabled>Kies een klant…</option>{customers.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select><span className="hint">Staat de klant er niet bij? <a href={`/admin/klanten/nieuw?back=/admin/${quote?'offertes':'facturen'}/nieuw`}><u>Voeg een klant toe</u></a>.</span></label>
      <label>{quote?'Titel van de offerte':'Referentie (optioneel)'}<input name="reference" defaultValue={initial.reference} maxLength={160} required={!!quote} placeholder={quote?'Bijv. Nieuwe website voor Bakkerij Jansen':'Bijv. projectnaam of PO-nummer'}/></label></div>
      <div className="f2"><label>{quote?'Offertedatum':'Factuurdatum'}<input type="date" name="issue_date" value={issue} onChange={e=>{setIssue(e.target.value);if(e.target.value)setDue(addDays(e.target.value,paymentDays))}} required/></label><label>{quote?'Geldig tot':'Vervaldatum'}<input type="date" name="due_date" value={due} onChange={e=>setDue(e.target.value)} required/></label></div></div>
    <div className="adm-card fstack"><h2>Regels</h2>
      <div className="lines"><div className="line-head"><span>Omschrijving</span><span>Aantal</span><span>Prijs (excl.)</span><span>Btw</span><span style={{textAlign:'right'}}>Totaal</span><span/></div>
      {lines.map((l,i)=>{const q=Number(String(l.quantity).replace(',','.'))||0;return <div className="line-row" key={i}>
        <label className="desc"><span className="hint" style={{display:i?'none':undefined}}></span><textarea aria-label={`Omschrijving regel ${i+1}`} rows={2} value={l.description} onChange={e=>upd(i,{description:e.target.value})} placeholder="Bijv. Webdesign en ontwikkeling"/></label>
        <input aria-label="Aantal" inputMode="decimal" value={l.quantity} onChange={e=>upd(i,{quantity:e.target.value})}/>
        <input aria-label="Prijs per eenheid" inputMode="decimal" placeholder="0,00" value={l.price} onChange={e=>upd(i,{price:e.target.value})}/>
        <select aria-label="Btw-tarief" value={rev?0:l.vat_rate} disabled={rev} onChange={e=>upd(i,{vat_rate:Number(e.target.value)})}><option value={21}>21%</option><option value={9}>9%</option><option value={0}>0%</option></select>
        <div className="lt">{eur(Math.round(q*euroToCents(l.price)))}</div>
        <button type="button" className="xbtn" aria-label={`Verwijder regel ${i+1}`} disabled={lines.length===1} onClick={()=>setLines(ls=>ls.filter((_,k)=>k!==i))}>×</button></div>})}</div>
      <div><button type="button" className="btn ghost sm" onClick={()=>setLines(ls=>[...ls,{description:'',quantity:'1',price:'',vat_rate:21}])}>+ Regel toevoegen</button></div>
      <div className="totals"><div><span>Subtotaal excl. btw</span><b>{eur(t.sub)}</b></div>{rev?<div><span>Btw</span><b>verlegd</b></div>:Object.keys(t.vat).map(Number).sort((a,b)=>b-a).map(r=><div key={r}><span>Btw {r}%</span><b>{eur(t.vat[r])}</b></div>)}<div className="grand"><span>Totaal</span><span>{eur(t.total)}</span></div></div></div>
    <div className="adm-card fstack"><h2>Opmerkingen</h2><label>{quote?'Tekst onder de offerte (optioneel)':'Tekst onder de factuur (optioneel)'}<textarea name="notes" defaultValue={initial.notes} maxLength={2000} placeholder="Bijv. bedankt voor je opdracht."/></label>
      <label style={{display:'flex',alignItems:'center',gap:10,fontWeight:500}}><input type="checkbox" name="vat_reverse" checked={rev} onChange={e=>setRev(e.target.checked)}/> Btw verlegd (alleen na controle van je fiscale situatie)</label></div>
    <div className="actions"><button className="btn" type="submit">{initial.id?'Opslaan':'Concept opslaan'}</button><a className="btn ghost" href={quote?'/admin/offertes':'/admin/facturen'}>Annuleren</a></div>
  </form>}
