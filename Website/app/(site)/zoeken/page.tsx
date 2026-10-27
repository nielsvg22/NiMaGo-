import type {Metadata} from 'next';import SiteSearch,{type Item} from '@/components/SiteSearch';import {services,projects} from '@/data/site';import {articles} from '@/data/articles';import {landings,branches,glossary} from '@/data/pages';import {faqs} from '@/data/content';
export const metadata:Metadata={title:'Zoeken',description:'Zoek in de diensten, artikelen, projecten en woordenlijst van NiMaGo.'};
export default function Page(){
  const items:Item[]=[
   ...services.map(s=>({title:s.title,url:'/diensten/'+s.slug,type:'Dienst',text:[s.lead,s.approach,...s.bullets,...s.tags].join(' ')})),
   ...landings.map(l=>({title:l.title,url:'/'+l.slug,type:'Dienst',text:[l.lead,...l.intro].join(' ')})),
   ...branches.map(b=>({title:b.title,url:'/branches/'+b.slug,type:'Branche',text:[b.lead,...b.points.map(p=>p.join(' '))].join(' ')})),
   ...articles.map(a=>({title:a.title,url:'/inzichten/'+a.slug,type:'Artikel',text:[a.description,...a.blocks.flatMap(b=>[b.h||'',...(b.p||[]),...(b.ul||[]),...(b.ol||[])])].join(' ')})),
   ...projects.map(p=>({title:p.title,url:'/projecten/'+p.slug,type:'Project',text:[p.subtitle,p.description,...p.tags].join(' ')})),
   ...glossary.map(([t,d])=>({title:t,url:'/woordenlijst#'+t[0].toUpperCase(),type:'Woordenlijst',text:d})),
   ...faqs.map(([q,a])=>({title:q,url:'/faq',type:'Vraag',text:a})),
   ...[['Prijzen en pakketten','/prijzen','Indicatieve prijzen, onderhoud en een rekenhulp.'],['Team','/team','De mensen achter NiMaGo.'],['Werkgebied','/werkgebied','Websites en software in heel Nederland.'],['Onze afspraken','/afspraken','Waar je op kunt rekenen.'],['Techniek','/techniek','Next.js, React, TypeScript, PostgreSQL, Shopify.'],['Werkwijze','/werkwijze','Van kennismaking tot oplevering.'],['Over ons','/over-ons','Het verhaal achter NiMaGo.'],['Contact','/contact','Neem contact met ons op.'],['Kennismaking plannen','/kennismaking','Plan een gesprek van 30 minuten.'],['Offerte aanvragen','/offerte-aanvragen','Vraag in vier stappen een offerte aan.'],['Gratis website-check','/gratis-website-scan','Controleer de technische basis van je website.']].map(([title,url,text])=>({title,url,type:'Pagina',text}))];
  return <><section className="page-hero container"><span className="eyebrow">Zoeken</span><h1>Waar ben je <em>naar op zoek?</em></h1></section><section className="container section small-top" style={{maxWidth:860}}><SiteSearch items={items}/></section></>}
