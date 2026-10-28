import type {MetadataRoute} from 'next';import {indexingAllowed} from '@/lib/seo';import {site} from '@/data/site';
export const dynamic='force-dynamic';
// Zonder ALLOW_INDEXING=1 blijft alles dicht. /admin, /account en /api zijn altijd uitgesloten.
export default function robots():MetadataRoute.Robots{
  if(!indexingAllowed())return{rules:{userAgent:'*',disallow:'/'}};
  const disallow=['/admin','/account','/api'];
  return{rules:[{userAgent:'*',allow:'/',disallow},
    // AI-zoekmachines en assistenten mogen de openbare pagina's lezen en citeren
    {userAgent:['GPTBot','OAI-SearchBot','ChatGPT-User','ClaudeBot','Claude-SearchBot','Claude-User','PerplexityBot','Perplexity-User','Google-Extended','Applebot-Extended','CCBot'],allow:'/',disallow}],
    sitemap:new URL('/sitemap.xml',site.url).toString(),host:site.url}}
