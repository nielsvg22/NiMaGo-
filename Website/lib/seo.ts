import {headers} from 'next/headers';import {site,services,projects} from '@/data/site';import {articles} from '@/data/articles';import {landings,branches} from '@/data/pages';import {cities} from '@/data/samples';import {faqs,serviceExtra} from '@/data/content';import {company} from './company';
/** Zoekmachines mogen alleen indexeren als ALLOW_INDEXING=1 in de omgeving staat (zet dat pas bij de echte lancering). */
export const indexingAllowed=()=>process.env.ALLOW_INDEXING==='1';
export const abs=(p:string)=>new URL(p,site.url).toString();
export async function currentPath(){const h=await headers();const p=h.get('x-pathname')||'/';return p.length>1?p.replace(/\/+$/,''):p}
const STATIC:Record<string,string>={'/diensten':'Diensten','/projecten':'Projecten','/inzichten':'Inzichten','/techniek':'Techniek','/over-ons':'Over ons','/werkwijze':'Werkwijze','/prijzen':'Prijzen','/afspraken':'Onze afspraken','/team':'Team','/werkgebied':'Werkgebied','/woordenlijst':'Woordenlijst','/faq':'Veelgestelde vragen','/contact':'Contact','/kennismaking':'Kennismaking plannen','/offerte-aanvragen':'Offerte aanvragen','/gratis-website-scan':'Gratis website-check','/zoeken':'Zoeken','/privacyverklaring':'Privacyverklaring','/cookiebeleid':'Cookiebeleid','/algemene-voorwaarden':'Algemene voorwaarden','/en':'English','/en/services':'Services','/en/about':'About','/en/contact':'Contact'};
export function labelFor(path:string):string|undefined{
  if(STATIC[path])return STATIC[path];const [,a,b]=path.split('/');
  if(a==='diensten')return services.find(s=>s.slug===b)?.title;if(a==='projecten')return projects.find(s=>s.slug===b)?.title;if(a==='inzichten')return articles.find(s=>s.slug===b)?.title;
  if(a==='werkgebied')return cities.find(s=>s.slug===b)?.name;if(a==='branches')return (branches as any[]).find(s=>s.slug===b)?.title;
  const l=(landings as any[]).find(s=>'/'+s.slug===path);return l?.title||l?.h1;}
export function breadcrumbs(path:string){
  if(path==='/'||path==='/en')return null;const parts=path.split('/').filter(Boolean);const isEn=parts[0]==='en';const items:{name:string;url:string}[]=[{name:isEn?'Home':'Home',url:abs(isEn?'/en':'/')}];let acc='';
  parts.forEach((seg,i)=>{acc+='/'+seg;if(isEn&&i===0)return;const parent=acc==='/branches'?null:acc;const name=labelFor(acc)||(acc==='/branches'?'Branches':undefined);if(!name&&i<parts.length-1)return;items.push({name:name||seg,url:abs(parent||acc)})});
  return items.length>1?{'@type':'BreadcrumbList',itemListElement:items.map((it,i)=>({'@type':'ListItem',position:i+1,name:it.name,item:it.url}))}:null}
export function organization(){
  const c=company();const same=[site.instagram,site.linkedin].filter(Boolean);
  return{'@type':['ProfessionalService','LocalBusiness'],'@id':abs('/#organization'),name:'NiMaGo',alternateName:['Nimago Digital','NiMaGo Digital Solutions'],legalName:c.name,url:abs('/'),slogan:site.tagline,
    description:'NiMaGo bouwt websites, webshops, maatwerk software en slimme koppelingen voor ondernemers en organisaties. Persoonlijk, creatief en technisch sterk, gevestigd in Apeldoorn.',
    logo:{'@type':'ImageObject',url:abs('/logos/08_beeldmerk.png'),width:360,height:360},image:abs('/og-default.png'),
    ...(c.email?{email:c.email}:{}),...(c.phone?{telephone:c.phone}:{}),
    address:{'@type':'PostalAddress',...(c.address?{streetAddress:c.address}:{}),...(c.postcode?{postalCode:c.postcode}:{}),addressLocality:c.city||'Apeldoorn',addressRegion:'Gelderland',addressCountry:'NL'},
    areaServed:[{'@type':'City',name:'Apeldoorn'},{'@type':'AdministrativeArea',name:'Gelderland'},{'@type':'Country',name:'Nederland'}],
    knowsLanguage:['nl','en'],foundingDate:'2026-10-28',founder:{'@type':'Person','@id':abs('/#founder'),name:'Niels Maarten Gortel',jobTitle:'Oprichter',worksFor:{'@id':abs('/#organization')}},
    ...(c.kvk?{identifier:{'@type':'PropertyValue',propertyID:'KvK-nummer',value:c.kvk}}:{}),...(c.vat_id?{vatID:c.vat_id}:{}),
    knowsAbout:['Website laten maken','Webshop laten maken','Maatwerk software','Automatisering en koppelingen','Webdesign','Zoekmachine-optimalisatie'],
    hasOfferCatalog:{'@type':'OfferCatalog',name:'Diensten',itemListElement:services.map(s=>({'@type':'Offer',itemOffered:{'@type':'Service',name:s.title,description:s.lead,url:abs('/diensten/'+s.slug)}}))},
    ...(same.length?{sameAs:same}:{})}}
export function schemaGraph(path:string){
  const g:any[]=[organization(),{'@type':'WebSite','@id':abs('/#website'),url:abs('/'),name:'NiMaGo',inLanguage:'nl-NL',publisher:{'@id':abs('/#organization')},potentialAction:{'@type':'SearchAction',target:{'@type':'EntryPoint',urlTemplate:abs('/zoeken')+'?q={search_term_string}'},'query-input':'required name=search_term_string'}}];
  const bc=breadcrumbs(path);if(bc)g.push(bc);
  const [,a,b]=path.split('/');const faq=(items:[string,string][])=>({'@type':'FAQPage',mainEntity:items.map(([q,ans])=>({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:ans}}))});
  if(a==='diensten'&&b){const s=services.find(x=>x.slug===b);if(s){g.push({'@type':'Service',name:s.title,description:s.lead+' '+s.approach,url:abs(path),serviceType:s.title,provider:{'@id':abs('/#organization')},areaServed:{'@type':'Country',name:'Nederland'}});const f=serviceExtra[b]?.faqs;if(f?.length)g.push(faq(f))}}
  if(path==='/faq')g.push(faq(faqs));
  const person={'@type':'Person','@id':abs('/#founder'),name:'Niels Maarten Gortel',jobTitle:'Oprichter',url:abs('/team'),worksFor:{'@id':abs('/#organization')},knowsAbout:['Webdevelopment','Next.js','Webshops','Maatwerk software','Automatisering']};
  if(path==='/team')g.push({'@type':'ProfilePage',url:abs(path),name:'Team',mainEntity:person,isPartOf:{'@id':abs('/#website')}});
  if(path==='/over-ons')g.push({'@type':'AboutPage',url:abs(path),name:'Over NiMaGo',about:{'@id':abs('/#organization')},isPartOf:{'@id':abs('/#website')}});
  if(path==='/contact')g.push({'@type':'ContactPage',url:abs(path),name:'Contact',about:{'@id':abs('/#organization')},isPartOf:{'@id':abs('/#website')}});
  return{'@context':'https://schema.org','@graph':g}}
