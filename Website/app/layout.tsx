import type {Metadata,Viewport} from 'next';import './globals.css';import Header from '@/components/Header';import Footer from '@/components/Footer';import {site} from '@/data/site';
export const metadata:Metadata={title:{default:'NiMaGo | Digitale ideeën. Sterk uitgevoerd.',template:'%s | NiMaGo'},description:'NiMaGo bouwt onderscheidende websites, webshops, maatwerksoftware en slimme automatiseringen. Persoonlijk, helder en technisch sterk.',robots:{index:false,follow:false},icons:{icon:'/favicon.svg'}};
export const viewport:Viewport={themeColor:'#241310'};
// Robots staat bewust op noindex totdat domein, contactgegevens en juridische teksten zijn afgerond.
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="nl"><body><Header/><main id="main">{children}</main><Footer/></body></html>}
