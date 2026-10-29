'use client';
import Link from 'next/link';import {usePathname} from 'next/navigation';import {Phone,MessageCircle,FileText} from 'lucide-react';
/** Vaste contactbalk onderaan op telefoons: bellen, WhatsApp of een offerte aanvragen. */
export default function ContactBarView({tel,wa}:{tel:string;wa:string}){
  const p=usePathname()||'';if(p.startsWith('/account')||p.startsWith('/admin')||p==='/offerte-aanvragen'||p==='/kennismaking')return null;
  return <nav className="contact-bar" aria-label="Snel contact">{tel&&<a href={`tel:${tel}`}><Phone size={18}/>Bel</a>}{wa&&<a href={wa} target="_blank" rel="noopener"><MessageCircle size={18}/>WhatsApp</a>}<Link href="/offerte-aanvragen" className="primary"><FileText size={18}/>Offerte</Link></nav>}
