import {services,projects} from '@/data/site';import {articles} from '@/data/articles';import {faqs,serviceExtra} from '@/data/content';import {landings,glossary} from '@/data/pages';import {company} from '@/lib/company';import {abs,indexingAllowed} from '@/lib/seo';
export const dynamic='force-dynamic';
/** llms-full.txt: de belangrijkste inhoud van de site als doorlopende tekst, om door AI-assistenten te laten citeren. */
export function GET(){
  const c=company();const L:string[]=[];
  L.push(`# NiMaGo (Nimago Digital): volledige inhoud`,'',`NiMaGo is een digitale studio in ${c.city||'Apeldoorn'}${c.kvk?` (KvK ${c.kvk})`:''}, opgericht door Niels Maarten Gortel. Website: ${abs('/')}`,'');
  L.push('## Diensten','');for(const s of services){L.push(`### ${s.title}`,s.lead,s.approach,...s.bullets.map(b=>`- ${b}`),`Meer: ${abs('/diensten/'+s.slug)}`,'');const e=serviceExtra[s.slug];if(e)for(const [q,a] of e.faqs)L.push(`V: ${q}`,`A: ${a}`,'')}
  L.push('## Projecten','');for(const p of projects)L.push(`### ${p.title}`,p.subtitle,p.description,`Meer: ${abs('/projecten/'+p.slug)}`,'');
  L.push('## Veelgestelde vragen','');for(const [q,a] of faqs)L.push(`V: ${q}`,`A: ${a}`,'');
  L.push('## Onderwerpen','');for(const l of landings as any[]){L.push(`### ${l.title}`,l.lead,...l.intro,...l.faqs.map(([q,a]:[string,string])=>`V: ${q}\nA: ${a}`),`Meer: ${abs('/'+l.slug)}`,'')}
  L.push('## Artikelen','');for(const a of articles){L.push(`### ${a.title}`,`Gepubliceerd ${a.date}. ${a.description}`);for(const b of a.blocks){if(b.h)L.push('',`#### ${b.h}`);for(const p of b.p||[])L.push(p);for(const x of b.ul||[])L.push(`- ${x}`);(b.ol||[]).forEach((x,i)=>L.push(`${i+1}. ${x}`))}L.push(`Bron: ${abs('/inzichten/'+a.slug)}`,'')}
  L.push('## Woordenlijst','');for(const [t,d] of glossary as [string,string][])L.push(`- ${t}: ${d}`);
  return new Response(L.join('\n')+'\n',{headers:{'Content-Type':'text/plain; charset=utf-8','Cache-Control':'public, max-age=3600',...(indexingAllowed()?{}:{'X-Robots-Tag':'noindex'})}})}
