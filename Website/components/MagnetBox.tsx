import Link from 'next/link';import {Download} from 'lucide-react';import {magnets,magnetFor} from '@/data/magnets';
/** Compacte uitnodiging voor een passende gratis download, bijvoorbeeld onder een artikel. */
export default function MagnetBox({category,slug}:{category?:string;slug?:string}){
  const m=magnets.find(x=>x.slug===(slug||(category&&magnetFor[category])));if(!m)return null;
  return <aside className="magnet-box" aria-label="Gratis download"><span className="magnet-ico"><Download size={22}/></span><div><b>Gratis download: {m.short}</b><p>{m.desc}</p></div><Link className="button button-primary" href={'/downloads/'+m.slug}>Bekijk de download</Link></aside>}
