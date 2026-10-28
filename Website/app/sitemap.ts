import type {MetadataRoute} from 'next';
import {site} from '@/data/site';import {articles} from '@/data/articles';
import {publicPaths,languagePairs} from '@/lib/page-seo';
export const dynamic='force-dynamic';
export default function sitemap():MetadataRoute.Sitemap{
 const dates=new Map(articles.map(a=>['/inzichten/'+a.slug,a.date]));
 return publicPaths().filter(p=>p!=='/zoeken'&&(!p.startsWith('/werkgebied/')||p==='/werkgebied/apeldoorn')).map(p=>{
  const nl=Object.keys(languagePairs).find(k=>languagePairs[k]===p)||p,en=languagePairs[nl];
  return{url:new URL(p,site.url).toString(),...(dates.has(p)?{lastModified:dates.get(p)}:{}),...(en?{alternates:{languages:{'nl-NL':new URL(nl,site.url).toString(),en:new URL(en,site.url).toString()}}}:{})};
 });
}
