'use client';
export default function CookieSettings({en=false}:{en?:boolean}){return <button type="button" className="cookie-footer-settings" onClick={()=>window.dispatchEvent(new Event('nimago-cookie-settings'))}>{en?'Cookie settings':'Cookie-instellingen'}</button>}
