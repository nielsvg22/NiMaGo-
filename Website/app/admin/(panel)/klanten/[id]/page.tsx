import {notFound} from 'next/navigation';import {db} from '@/lib/db';import type {Customer} from '@/lib/invoice';import CustomerForm from '../CustomerForm';
export const metadata={title:'Klant bewerken'};
export default async function Edit({params,searchParams}:{params:Promise<{id:string}>;searchParams:Promise<{fout?:string}>}){const {id}=await params;const {fout}=await searchParams;const c=db().prepare('SELECT * FROM customers WHERE id=?').get(Number(id)) as Customer|undefined;if(!c)notFound();
return <><div className="adm-head"><h1>{c.name}</h1></div>{fout==='heeftfacturen'&&<p className="alert err" style={{marginBottom:14}}>Deze klant heeft facturen en kan niet worden verwijderd.</p>}<CustomerForm c={c} error={fout}/></>}
