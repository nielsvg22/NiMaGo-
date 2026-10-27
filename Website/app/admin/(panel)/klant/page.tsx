import {notFound} from 'next/navigation';import {db} from '@/lib/db';import type {Customer} from '@/lib/invoice';import CustomerForm from '../klanten/CustomerForm';
export const metadata={title:'Klant bewerken'};
export default async function Edit({searchParams}:{searchParams:Promise<{id?:string;fout?:string}>}){const {id,fout}=await searchParams;const c=db().prepare('SELECT * FROM customers WHERE id=?').get(Number(id)) as Customer|undefined;if(!c)notFound();
return <><div className="adm-head"><h1>{c.name}</h1></div>{fout==='heeftfacturen'&&<p className="alert err" style={{marginBottom:14}}>Deze klant heeft facturen, offertes of projecten en kan niet worden verwijderd.</p>}<CustomerForm c={c} error={fout}/></>}
