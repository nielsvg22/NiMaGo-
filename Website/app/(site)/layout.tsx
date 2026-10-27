import Header from '@/components/Header';import Footer from '@/components/Footer';import Analytics from '@/components/Analytics';
export const dynamic='force-dynamic'; // bedrijfsgegevens komen uit de admin
export default function SiteLayout({children}:{children:React.ReactNode}){return <><a className="skip" href="#main">Naar de inhoud</a><Header/><main id="main">{children}</main><Footer/><Analytics/></>}
