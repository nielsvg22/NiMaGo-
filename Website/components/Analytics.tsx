'use client';
import {useEffect,useRef} from 'react';import {usePathname} from 'next/navigation';
/** Cookieloze bezoekteller. Respecteert Do Not Track en Global Privacy Control; stuurt alleen pad en verwijzende site. */
export default function Analytics(){const p=usePathname();const first=useRef(true);
  useEffect(()=>{try{const nav=navigator as any;if(nav.doNotTrack==='1'||(window as any).doNotTrack==='1'||nav.globalPrivacyControl)return;
    const body=JSON.stringify({path:p,ref:first.current?document.referrer:''});first.current=false;
    if(navigator.sendBeacon)navigator.sendBeacon('/api/hit',new Blob([body],{type:'application/json'}));else fetch('/api/hit',{method:'POST',body,keepalive:true,headers:{'Content-Type':'application/json'}})}catch{}},[p]);return null}
