'use client';
import {useEffect,useState} from 'react';import {isChunkError,report,reloadOnce} from '@/lib/clienterror';
export default function Error({error,reset}:{error:Error&{digest?:string};reset:()=>void}){
  const [reloading,setReloading]=useState(false);
  useEffect(()=>{report(error,'error-boundary');if(isChunkError(error)&&reloadOnce())setReloading(true)},[error]);
  return <main style={{minHeight:'60vh',display:'grid',placeItems:'center',padding:'96px 24px',fontFamily:'system-ui,sans-serif',color:'#2A1713',background:'#FBF1EA'}}><div style={{maxWidth:520,textAlign:'center'}}>
    <h1 style={{fontSize:28,margin:'0 0 12px'}}>{reloading?'Even geduld…':'Er ging iets mis'}</h1>
    <p style={{color:'#7A5F58',margin:'0 0 22px'}}>{reloading?'Er is een nieuwe versie van de site. De pagina wordt vernieuwd.':'De pagina kon niet goed worden geladen. Probeer het opnieuw.'}</p>
    <button onClick={()=>{reset();location.reload()}} style={{background:'#A8603E',color:'#fff',border:0,borderRadius:99,padding:'14px 26px',fontWeight:700,cursor:'pointer',fontSize:15}}>Pagina vernieuwen</button>
    <p style={{marginTop:18}}><a href="/" style={{color:'#A8603E'}}>Naar de homepage</a></p>
    {error?.digest&&<p style={{marginTop:18,fontSize:12,color:'#9a8a84'}}>Foutcode: {error.digest}</p>}
  </div></main>}
