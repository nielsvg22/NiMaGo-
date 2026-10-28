import type {Metadata,Viewport} from 'next';import './globals.css';import {site} from '@/data/site';import ErrorReporter from '@/components/ErrorReporter';import {Inter,Bricolage_Grotesque} from 'next/font/google';import {indexingAllowed,currentPath,abs} from '@/lib/seo';import {pageSeo,languagePairs} from '@/lib/page-seo';
const display=Bricolage_Grotesque({subsets:['latin'],weight:['500','600','700','800'],variable:'--font-display',display:'swap'});
const body=Inter({subsets:['latin'],variable:'--font-body',display:'swap'});
const TITLE='Website, webshop & maatwerk software laten maken | NiMaGo Apeldoorn';
const DESC='NiMaGo uit Apeldoorn bouwt websites, webshops, maatwerk software en slimme koppelingen. Persoonlijk, helder en technisch sterk. Plan een vrijblijvende kennismaking.';
// Nederlandse pagina's en hun Engelse tegenhanger (hreflang)
const PAIRS=languagePairs;
export async function generateMetadata():Promise<Metadata>{
  const path=await currentPath();const info=pageSeo(path);const nl=Object.keys(PAIRS).find(k=>PAIRS[k]===path)||path;const en=PAIRS[nl];
  const alternates:Metadata['alternates']={canonical:abs(path),types:{'application/rss+xml':abs('/feed.xml')},...(en?{languages:{'nl-NL':abs(nl),'en':abs(en),'x-default':abs(nl)}}:{})};
  return{metadataBase:new URL(site.url),title:{default:TITLE,template:'%s | NiMaGo'},description:DESC,alternates,applicationName:'NiMaGo',authors:[{name:'Niels Maarten Gortel'}],creator:'NiMaGo',
    openGraph:{type:'website',locale:path.startsWith('/en')?'en_US':'nl_NL',siteName:'NiMaGo Digital',title:info.title,description:info.description,url:abs(path),images:[{url:abs('/og?p='+path),width:1200,height:630,alt:'NiMaGo'}]},twitter:{card:'summary_large_image',title:info.title,description:info.description,images:[abs('/og?p='+path)]},
    robots:indexingAllowed()?{index:true,follow:true,googleBot:{index:true,follow:true,'max-image-preview':'large','max-snippet':-1,'max-video-preview':-1}}:{index:false,follow:false},
    icons:{icon:'/favicon.svg',apple:'/apple-touch-icon.png'},
    verification:{google:process.env.GOOGLE_SITE_VERIFICATION||undefined,other:process.env.BING_SITE_VERIFICATION?{'msvalidate.01':process.env.BING_SITE_VERIFICATION}:undefined}}}
export const viewport:Viewport={themeColor:'#241310'};
export default async function RootLayout({children}:{children:React.ReactNode}){const path=await currentPath();return <html lang={path==='/en'||path.startsWith('/en/')?'en':'nl'} className={`${display.variable} ${body.variable}`}><body><ErrorReporter/>{children}</body></html>}
