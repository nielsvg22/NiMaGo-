'use client';
import {useEffect,useRef,useState} from 'react';import {usePathname} from 'next/navigation';
import {marketingEnabled,marketingContext,marketingBeacon} from '@/lib/marketing-client';
/** Alleen met toestemming; geen IP-opslag, formulierinhoud of queryparameters. */
export default function Analytics(){const [consentRevision,setConsentRevision]=useState(0);useEffect(()=>{const change=()=>setConsentRevision(v=>v+1);window.addEventListener('nimago-consent',change);return()=>window.removeEventListener('nimago-consent',change)},[]);const path=usePathname(),first=useRef(true),vitalsStarted=useRef(false);
 useEffect(()=>{if(!marketingEnabled())return;const context=marketingContext();try{const body=JSON.stringify({path,ref:first.current&&context?.ref?'https://'+context.ref:''});first.current=false;if(navigator.sendBeacon)navigator.sendBeacon('/api/hit',new Blob([body],{type:'application/json'}));else void fetch('/api/hit',{method:'POST',body,keepalive:true,headers:{'Content-Type':'application/json'}}).catch(()=>{})}catch{}
 const click=(e:MouseEvent)=>{const target=e.target instanceof Element?e.target.closest('a'):null;if(!target)return;const href=target.getAttribute('href')||'';const event=href.startsWith('tel:')?'phone_click':href.startsWith('mailto:')?'email_click':/^\/(offerte-aanvragen|kennismaking|contact)([?#]|$)/.test(href)?'cta_click':null;if(event)marketingBeacon({event,...context,path})};document.addEventListener('click',click);
 if(!vitalsStarted.current){vitalsStarted.current=true;const initialPath=path;void import('web-vitals').then(({onLCP,onINP,onCLS})=>{const report=(metric:{name:string;value:number})=>marketingBeacon({type:'vital',path:initialPath,metric:metric.name,value:metric.value,device:window.innerWidth<=740?'mobile':'desktop'});onLCP(report);onINP(report);onCLS(report)}).catch(()=>{})}
 return()=>document.removeEventListener('click',click);
 },[path,consentRevision]);return null;
}
