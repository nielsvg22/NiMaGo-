'use client';
import {FormEvent,useState} from 'react';import {Download} from 'lucide-react';import {marketingContext} from '@/lib/marketing-client';
export default function MagnetForm({slug,title}:{slug:string;title:string}){
  const [s,setS]=useState<'idle'|'busy'|'ok'|'err'>('idle');const [m,setM]=useState('');const [url,setUrl]=useState('');
  async function go(e:FormEvent<HTMLFormElement>){e.preventDefault();setS('busy');setM('');const fd=new FormData(e.currentTarget);
    try{const r=await fetch('/api/download',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({slug,name:fd.get('name'),email:fd.get('email'),consent:fd.get('consent')==='on',tips:fd.get('tips')==='on',website:fd.get('website'),marketing:marketingContext()})});const d=await r.json();if(!r.ok)throw new Error(d.error||'Aanvragen lukt niet.');setUrl(d.url);setS('ok')}catch(x){setS('err');setM(x instanceof Error?x.message:'Aanvragen lukt niet.')}}
  if(s==='ok')return <div className="contact-form done" role="status"><h2>Je download staat klaar</h2><p>We hebben de link ook per e-mail gestuurd, voor als je hem later nog nodig hebt.</p><a className="button button-primary" href={url}><Download size={18}/> Download de PDF</a></div>;
  return <form className="contact-form" onSubmit={go}><h2>Gratis downloaden</h2><p>{title}</p>
    <label>Naam<input name="name" required minLength={2} maxLength={100} autoComplete="name"/></label>
    <label>E-mailadres<input type="email" name="email" required maxLength={150} autoComplete="email"/></label>
    <label className="honeypot" aria-hidden="true">Niet invullen<input name="website" tabIndex={-1} autoComplete="off"/></label>
    <label className="check-row"><input type="checkbox" name="consent" required/> <span>Ik ga akkoord met de <a href="/privacyverklaring">privacyverklaring</a>. We sturen je de download per e-mail.</span></label>
    <label className="check-row"><input type="checkbox" name="tips"/> <span>Ja, stuur me ook twee korte tips per e-mail en af en toe nieuws. Afmelden kan altijd.</span></label>
    <button className="button button-primary" type="submit" disabled={s==='busy'}>{s==='busy'?'Even geduld…':'Download de checklist'}</button>{m&&<p className="form-message form-error" role="alert">{m}</p>}</form>}
