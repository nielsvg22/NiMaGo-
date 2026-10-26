'use client';
import {useEffect} from 'react';import {isChunkError,report,reloadOnce} from '@/lib/clienterror';
export default function GlobalError({error}:{error:Error&{digest?:string}}){
  useEffect(()=>{report(error,'global-error');if(isChunkError(error))reloadOnce()},[error]);
  return <html lang="nl"><body style={{margin:0,fontFamily:'system-ui,sans-serif',background:'#FBF1EA',color:'#2A1713'}}><main style={{minHeight:'100vh',display:'grid',placeItems:'center',padding:24,textAlign:'center'}}><div><h1>Er ging iets mis</h1><p>De pagina kon niet worden geladen.</p><button onClick={()=>location.reload()} style={{background:'#A8603E',color:'#fff',border:0,borderRadius:99,padding:'14px 26px',fontWeight:700,fontSize:15}}>Pagina vernieuwen</button></div></main></body></html>}
