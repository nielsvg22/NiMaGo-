import type {MetadataRoute} from 'next';import {services,projects,site} from '@/data/site';import {articles} from '@/data/articles';import {landings,branches} from '@/data/pages';
export default function sitemap():MetadataRoute.Sitemap{
  const paths=['/','/diensten','/projecten','/inzichten','/techniek','/over-ons','/werkwijze','/prijzen','/afspraken','/woordenlijst','/faq','/contact','/kennismaking','/offerte-aanvragen','/gratis-website-scan','/zoeken','/privacyverklaring','/cookiebeleid','/algemene-voorwaarden','/en','/en/services','/en/about','/en/contact',
   ...services.map(s=>'/diensten/'+s.slug),...projects.map(p=>'/projecten/'+p.slug),...articles.map(a=>'/inzichten/'+a.slug),...landings.map(l=>'/'+l.slug),...branches.map(b=>'/branches/'+b.slug)];
  return paths.map(p=>({url:new URL(p,site.url).toString(),changeFrequency:'monthly',priority:p==='/'?1:p.startsWith('/inzichten')||landings.some(l=>'/'+l.slug===p)?.7:.6}))}
