import type {Metadata,Viewport} from 'next';import './globals.css';import {site} from '@/data/site';import ErrorReporter from '@/components/ErrorReporter';import {Inter,Bricolage_Grotesque} from 'next/font/google';
const display=Bricolage_Grotesque({subsets:['latin'],weight:['500','600','700','800'],variable:'--font-display',display:'swap'});
const body=Inter({subsets:['latin'],variable:'--font-body',display:'swap'});
export const metadata:Metadata={metadataBase:new URL(site.url),openGraph:{type:'website',locale:'nl_NL',siteName:'NiMaGo',title:'NiMaGo | Digitale ideeën. Sterk uitgevoerd.',description:'Websites, webshops, maatwerk software en slimme koppelingen. Persoonlijk, creatief en technisch sterk.'},title:{default:'NiMaGo | Digitale ideeën. Sterk uitgevoerd.',template:'%s | NiMaGo'},description:'NiMaGo bouwt onderscheidende websites, webshops, maatwerksoftware en slimme automatiseringen. Persoonlijk, helder en technisch sterk.',robots:{index:false,follow:false},icons:{icon:'/favicon.svg'}};
export const viewport:Viewport={themeColor:'#241310'};
// Robots staat bewust op noindex totdat domein, contactgegevens en juridische teksten zijn afgerond.
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="nl" className={`${display.variable} ${body.variable}`}><body><ErrorReporter/>{children}</body></html>}
