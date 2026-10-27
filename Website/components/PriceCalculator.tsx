"use client";
import Link from 'next/link';import {useMemo,useState} from 'react';import {ArrowUpRight} from 'lucide-react';
const TYPES:{id:string;label:string;min:number;max:number;hint:string}[]=[
 {id:'website',label:'Website',min:1800,max:3500,hint:'Basis: tot 5 pagina’s'},
 {id:'webshop',label:'Webshop',min:4500,max:9000,hint:'Basis: kleine webshop'},
 {id:'portaal',label:'Portaal of software',min:8000,max:16000,hint:'Basis: één kernproces'},
 {id:'koppeling',label:'Koppeling of automatisering',min:1500,max:5000,hint:'Per koppeling of workflow'},
 {id:'design',label:'Design en huisstijl',min:1500,max:6000,hint:'Huisstijl of UI-ontwerp'}];
const eur=(n:number)=>new Intl.NumberFormat('nl-NL',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(n);
const round=(n:number)=>Math.round(n/50)*50;
export default function PriceCalculator(){
  const [type,setType]=useState('website');const [pages,setPages]=useState(5);const [multi,setMulti]=useState(false);const [seo,setSeo]=useState(false);const [cms,setCms]=useState(false);const [custom,setCustom]=useState(false);const [n,setN]=useState(1);
  const r=useMemo(()=>{const t=TYPES.find(x=>x.id===type)!;let lo=t.min,hi=t.max;
    if(type==='website'||type==='webshop'){const extra=Math.max(0,pages-(type==='website'?5:10));lo+=extra*250;hi+=extra*450}
    if(type==='koppeling'){lo*=n;hi*=n}
    if(cms&&(type==='website'||type==='webshop')){lo+=300;hi+=600}
    if(seo){lo+=400;hi+=800}
    if(custom&&type!=='design'){lo*=1.25;hi*=1.25}
    if(multi){lo*=1.2;hi*=1.3}
    return{lo:round(lo),hi:round(hi)}},[type,pages,multi,seo,cms,custom,n]);
  const showPages=type==='website'||type==='webshop';
  return <div className="calc"><div className="calc-form"><fieldset className="pick"><legend>Wat wil je laten maken?</legend><div className="opts">{TYPES.map(t=><label key={t.id} className={`opt${type===t.id?' on':''}`}><input type="radio" name="t" checked={type===t.id} onChange={()=>setType(t.id)}/>{t.label}</label>)}</div></fieldset>
   {showPages&&<label>Aantal pagina’s of productgroepen: <b>{pages}</b><input type="range" min={1} max={40} value={pages} onChange={e=>setPages(Number(e.target.value))}/></label>}
   {type==='koppeling'&&<label>Aantal koppelingen of workflows: <b>{n}</b><input type="range" min={1} max={8} value={n} onChange={e=>setN(Number(e.target.value))}/></label>}
   <fieldset className="pick"><legend>Extra’s</legend><div className="opts">{showPages&&<label className={`opt${cms?' on':''}`}><input type="checkbox" checked={cms} onChange={e=>setCms(e.target.checked)}/>Teksten zelf beheren</label>}<label className={`opt${seo?' on':''}`}><input type="checkbox" checked={seo} onChange={e=>setSeo(e.target.checked)}/>Uitgebreide vindbaarheid (SEO)</label>{type!=='design'&&<label className={`opt${custom?' on':''}`}><input type="checkbox" checked={custom} onChange={e=>setCustom(e.target.checked)}/>Ontwerp volledig op maat</label>}<label className={`opt${multi?' on':''}`}><input type="checkbox" checked={multi} onChange={e=>setMulti(e.target.checked)}/>Meerdere talen</label></div></fieldset></div>
   <div className="calc-res" aria-live="polite"><span className="eyebrow">Indicatie</span><b>{eur(r.lo)} – {eur(r.hi)}</b><p>excl. btw, eenmalig. Een indicatie op basis van gemiddelde projecten, geen offerte. De echte prijs hangt af van je wensen.</p><Link className="button button-primary" href="/offerte-aanvragen">Vraag een offerte aan <ArrowUpRight size={17}/></Link></div></div>}
