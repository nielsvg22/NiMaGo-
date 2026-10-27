import Link from 'next/link';import {ArrowUpRight} from 'lucide-react';import type {Article} from '@/data/articles';
export const fmtNl=(iso:string)=>new Date(iso+'T12:00:00Z').toLocaleDateString('nl-NL',{day:'numeric',month:'long',year:'numeric',timeZone:'Europe/Amsterdam'});
export default function ArticleCard({a}:{a:Article}){return <Link href={'/inzichten/'+a.slug} className="art-card"><span className="art-cat">{a.category}</span><h3>{a.title}</h3><p>{a.description}</p><span className="art-meta">{fmtNl(a.date)} · {a.minutes} min lezen <ArrowUpRight size={16}/></span></Link>}
