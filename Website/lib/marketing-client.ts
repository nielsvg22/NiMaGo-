export function statisticsConsent(){return typeof document!=='undefined'&&document.cookie.split('; ').includes('nm_consent=v1-accepted')}
/** Alleen na toestemming; payload bevat alleen pad en verwijzende host. */
export function marketingEnabled(){return typeof window!=='undefined'&&statisticsConsent()&&navigator.doNotTrack!=='1'&&(window as Window&{doNotTrack?:string}).doNotTrack!=='1'&&!(navigator as Navigator&{globalPrivacyControl?:boolean}).globalPrivacyControl}
export function marketingContext(){if(!marketingEnabled())return null;let ref='';try{ref=new URL(document.referrer).hostname}catch{}return{path:location.pathname,ref}}
export function marketingBeacon(payload:object){if(!marketingEnabled())return;const body=JSON.stringify(payload);try{if(navigator.sendBeacon)navigator.sendBeacon('/api/marketing',new Blob([body],{type:'application/json'}));else void fetch('/api/marketing',{method:'POST',headers:{'Content-Type':'application/json'},body,keepalive:true}).catch(()=>{})}catch{}}
