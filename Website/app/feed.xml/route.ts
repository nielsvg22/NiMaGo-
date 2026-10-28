import {articles,answers} from '@/data/articles';import {abs} from '@/lib/seo';
export const dynamic='force-dynamic';
const x=(s:string)=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
/** RSS-feed van de artikelen onder Inzichten (helpt ontdekking door zoekmachines, AI-assistenten en lezers). */
export function GET(){
  const items=[...articles].sort((a,b)=>b.date.localeCompare(a.date)).map(a=>`<item><title>${x(a.title)}</title><link>${abs('/inzichten/'+a.slug)}</link><guid isPermaLink="true">${abs('/inzichten/'+a.slug)}</guid><pubDate>${new Date(a.date+'T08:00:00Z').toUTCString()}</pubDate><category>${x(a.category)}</category><description>${x(answers[a.slug]||a.description)}</description></item>`).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>NiMaGo Inzichten</title><link>${abs('/inzichten')}</link><description>Praktische artikelen over websites, webshops, automatisering en vindbaarheid, van NiMaGo uit Apeldoorn.</description><language>nl-nl</language><atom:link href="${abs('/feed.xml')}" rel="self" type="application/rss+xml"/>${items}</channel></rss>`,{headers:{'Content-Type':'application/rss+xml; charset=utf-8','Cache-Control':'public, max-age=3600'}})}
