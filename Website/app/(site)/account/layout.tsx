import type {Metadata} from 'next';import Link from 'next/link';import './portal.css';import {currentAccount} from '@/lib/account';import {logoutAccount} from './actions';import {db} from '@/lib/db';
export const metadata:Metadata={title:{default:'Klantportaal',template:'%s | Klantportaal NiMaGo'},robots:{index:false,follow:false}};
const items=[['/account','Overzicht'],['/account/offertes','Offertes'],['/account/projecten','Projecten'],['/account/afspraken','Afspraken'],['/account/facturen','Facturen'],['/account/berichten','Berichten'],['/account/profiel','Profiel']] as const;
export default async function AccountLayout({children}:{children:React.ReactNode}){
  const a=await currentAccount();const active=!!a&&a.status==='actief'&&!!a.customer_id;
  const unread=active?(db().prepare("SELECT COUNT(*) c FROM portal_messages WHERE customer_id=? AND direction='nimago' AND is_read=0").get(a!.customer_id) as {c:number}).c:0;
  return <div className="portal"><div className="container">{a&&<div className="portal-bar"><span>Ingelogd als <b>{a.name}</b></span><form action={logoutAccount}><button className="portal-link" type="submit">Uitloggen</button></form></div>}
    {active&&<nav className="portal-nav" aria-label="Klantportaal">{items.map(([h,l])=><Link key={h} href={h}>{l}{h==='/account/berichten'&&unread>0&&<i>{unread}</i>}</Link>)}</nav>}
    {children}</div></div>}
