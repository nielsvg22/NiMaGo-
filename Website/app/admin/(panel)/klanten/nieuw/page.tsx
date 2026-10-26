import CustomerForm from '../CustomerForm';
export const metadata={title:'Nieuwe klant'};
export default async function Nieuw({searchParams}:{searchParams:Promise<{fout?:string;back?:string}>}){const {fout,back}=await searchParams;return <><div className="adm-head"><h1>Nieuwe klant</h1></div><CustomerForm error={fout} back={back}/></>}
