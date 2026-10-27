"use client";
import Link from 'next/link';import {useEffect,useMemo,useState} from 'react';import {Search} from 'lucide-react';
export type Item={title:string;url:string;type:string;text:string};
const norm=(s:string)=>s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
export default function SiteSearch({items}:{items:Item[]}){const [q,setQ]=useState('');
  useEffect(()=>{try{const p=new URLSearchParams(location.search).get('q');if(p)setQ(p)}catch{}},[]);
  const res=useMemo(()=>{const t=norm(q).split(/\s+/).filter(x=>x.length>1);if(!t.length)return[];return items.map(i=>{const ti=norm(i.title),tx=norm(i.text);let s=0;for(const w of t){if(ti.includes(w))s+=10;if(tx.includes(w))s+=2;else if(!ti.includes(w)){s=-1000}}return{i,s}}).filter(x=>x.s>0).sort((a,b)=>b.s-a.s).slice(0,20).map(x=>x.i)},[q,items]);
  return <div><label className="searchbox"><Search size={20}/><span className="sr">Zoeken</span><input type="search" value={q} onChange={e=>setQ(e.target.value)} placeholder="Zoek op bijvoorbeeld webshop, API of onderhoud" autoFocus/></label>
  <div className="results" aria-live="polite">{q.trim().length>1&&!res.length&&<p className="hint">Geen resultaten voor “{q}”. Probeer een ander woord, of <Link href="/contact"><u>stel je vraag</u></Link>.</p>}{res.map(r=><Link key={r.url+r.title} href={r.url} className="result"><span className="art-cat">{r.type}</span><b>{r.title}</b><span>{r.text.slice(0,140)}{r.text.length>140?'…':''}</span></Link>)}</div></div>}
