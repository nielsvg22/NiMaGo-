import type {Metadata,Viewport} from 'next';import './globals.css';import {site} from '@/data/site';import ErrorReporter from '@/components/ErrorReporter';import {Inter,Bricolage_Grotesque} from 'next/font/google';import {indexingAllowed,currentPath,abs} from '@/lib/seo';
const display=Bricolage_Grotesque({subsets:['latin'],weight:['500','600','700','800'],variable:'--font-display',display:'swap'});
const body=Inter({subsets:['latin'],variable:'--font-body',display:'swap'});
const TITLE='Website, webshop & maatwerk software laten maken | NiMaGo Apeldoorn';
const DESC='NiMaGo uit Apeldoorn bouwt websites, webshops, maatwerk software en slimme koppelingen. Persoonlijk, helder en technisch sterk. Plan een vrijblijvende kennismaking.';
// Nederlandse pagina's en hun Engelse tegenhanger (hreflang)
const PAIRS:Record<string,string>={'/':'/en','/diensten':'/en/services','/over-ons':'/en/about','/contact':'/en/contact'};
export async function generateMetadata():Promise<Metadata>{
  const path=await currentPath();const nl=Object.keys(PAIRS).find(k=>PAIRS[k]===path)||path;const en=PAIRS[nl];
  const alternates:Metadata['alternates']={canonical:abs(path),...(en?{languages:{'nl-NL':abs(nl),'en':abs(en),'x-default':abs(nl)}}:{})};
  return{metadataBase:new URL(site.url),title:{default:TITLE,template:'%s | NiMaGo'},description:DESC,alternates,applicationName:'NiMaGo',authors:[{name:'Niels Maarten Gortel'}],creator:'NiMaGo',
    openGraph:{type:'website',locale:path.startsWith('/en')?'en_US':'nl_NL',siteName:'NiMaGo',title:TITLE,description:DESC,url:abs(path)},twitter:{card:'summary_large_image',title:TITLE,description:DESC},
    robots:indexingAllowed()?{index:true,follow:true,googleBot:{index:true,follow:true,'max-image-preview':'large','max-snippet':-1,'max-video-preview':-1}}:{index:false,follow:false},
    icons:{icon:'/favicon.svg',apple:'/apple-touch-icon.png'},
    verification:{google:process.env.GOOGLE_SITE_VERIFICATION||undefined,other:process.env.BING_SITE_VERIFICATION?{'msvalidate.01':process.env.BING_SITE_VERIFICATION}:undefined}}}
export const viewport:Viewport={themeColor:'#241310'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="nl" className={`${display.variable} ${body.variable}`}><body><ErrorReporter/>{children}</body></html>}
