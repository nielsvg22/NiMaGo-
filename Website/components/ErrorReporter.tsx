'use client';
import {useEffect} from 'react';import {report,isChunkError,reloadOnce} from '@/lib/clienterror';
/** Stuurt onverwachte clientfouten naar de serverlog en herlaadt de pagina bij een verouderde scriptversie. */
export default function ErrorReporter(){useEffect(()=>{
  const onErr=(ev:ErrorEvent)=>{report(ev.error||ev.message,'window.onerror');if(isChunkError(ev.error||ev.message))reloadOnce()};
  const onRej=(ev:PromiseRejectionEvent)=>{report(ev.reason,'unhandledrejection');if(isChunkError(ev.reason))reloadOnce()};
  window.addEventListener('error',onErr);window.addEventListener('unhandledrejection',onRej);
  return ()=>{window.removeEventListener('error',onErr);window.removeEventListener('unhandledrejection',onRej)}},[]);return null}
