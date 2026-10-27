import {db} from '@/lib/db';import ProjectFields from '../../ProjectFields';
export const metadata={title:'Nieuw project'};
export default async function Nieuw({searchParams}:{searchParams:Promise<{fout?:string;klant?:string}>}){
  const {fout,klant}=await searchParams;const customers=db().prepare('SELECT id,name FROM customers ORDER BY name').all() as {id:number;name:string}[];
  return <><div className="adm-head"><h1>Nieuw project</h1></div>{fout&&<p className="alert err" style={{marginBottom:14}}>Kies een klant en vul een titel in.</p>}{customers.length?<ProjectFields customers={customers} klant={klant?Number(klant):undefined}/>:<p className="alert info">Voeg eerst een <a href="/admin/klanten/nieuw?back=/admin/projecten/nieuw"><u>klant</u></a> toe.</p>}</>
}
