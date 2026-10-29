import Link from 'next/link';import {notFound} from 'next/navigation';import {Check} from 'lucide-react';import {magnets} from '@/data/magnets';import MagnetForm from './MagnetForm';
export default function MagnetPage({slug}:{slug:string}){
  const m=magnets.find(x=>x.slug===slug);if(!m)notFound();const count=m.sections.reduce((n,s)=>n+s.items.length,0);const others=magnets.filter(x=>x.slug!==slug).slice(0,3);
  return <><section className="contact-layout"><div><span className="eyebrow">Gratis download · PDF</span><h1>{m.title}</h1><p>{m.desc}</p>
    <ul className="checks" style={{marginTop:22}}>{m.sections.map(s=><li key={s.h}><Check size={17}/> {s.h} ({s.items.length} punten)</li>)}</ul>
    <p style={{marginTop:18,color:'var(--muted)'}}>{count} punten om af te vinken. Opgesteld door NiMaGo, een digitale studio uit Apeldoorn. Zonder verplichtingen.</p></div>
    <MagnetForm slug={m.slug} title={m.short}/></section>
  <section className="container" style={{paddingBottom:80}}><div className="section-head"><div><span className="eyebrow"><i className="eyebrow-line"/>Meer gratis downloads</span></div><Link href="/downloads" className="text-link">Alle downloads</Link></div><div className="values">{others.map(o=><Link key={o.slug} className="value" href={'/downloads/'+o.slug}><h3>{o.short}</h3><p>{o.desc}</p></Link>)}</div></section></>}
