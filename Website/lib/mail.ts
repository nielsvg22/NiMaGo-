import nodemailer from 'nodemailer';import {allSettings} from './db';import {renderMail} from './mailtemplate';
/** E-mail via SMTP (bijv. de mailbox bij your-host). Zonder SMTP_HOST/SMTP_USER/SMTP_PASS gebeurt er niets; verzenden mislukt nooit hard, zodat formulieren blijven werken. */
const cfg=()=>({host:process.env.SMTP_HOST||'',port:Number(process.env.SMTP_PORT||465),user:process.env.SMTP_USER||'',pass:process.env.SMTP_PASS||''});
export const mailEnabled=()=>{const c=cfg();return !!(process.env.MAIL_PREVIEW_DIR||(c.host&&c.user&&c.pass))};
const line=(s:string)=>String(s).replace(/[\r\n]+/g,' ').trim().slice(0,200);
export const siteUrl=()=>(process.env.NEXT_PUBLIC_SITE_URL||'').replace(/\/$/,'');
let tr:ReturnType<typeof nodemailer.createTransport>|null=null;
const transport=()=>{if(tr)return tr;const c=cfg();tr=nodemailer.createTransport({host:c.host,port:c.port,secure:c.port===465,auth:{user:c.user,pass:c.pass},connectionTimeout:10000,greetingTimeout:10000,socketTimeout:15000});return tr};
export async function sendMail(o:{to:string;subject:string;text:string;replyTo?:string;unsubscribe?:string}){
  if(!mailEnabled()||!/^\S+@\S+\.\S+$/.test(o.to))return false;
  try{const s=allSettings();const from=process.env.MAIL_FROM||cfg().user;
    const m=renderMail({subject:line(o.subject),text:o.text,company:s.company_name||'NiMaGo',site:siteUrl(),contact:[s.email,s.phone].filter(Boolean).join(' · '),replyTo:o.replyTo&&/^\S+@\S+\.\S+$/.test(o.replyTo)?o.replyTo:undefined,unsubscribe:o.unsubscribe});
    if(process.env.MAIL_PREVIEW_DIR){const fs=await import('node:fs');fs.mkdirSync(process.env.MAIL_PREVIEW_DIR,{recursive:true});fs.writeFileSync(`${process.env.MAIL_PREVIEW_DIR}/${Date.now()}-${Math.random().toString(36).slice(2,6)}.json`,JSON.stringify({to:o.to,subject:line(o.subject),html:m.html}));return true}
    await transport().sendMail({from:`"${line(s.company_name||'NiMaGo').replace(/"/g,'')}" <${from}>`,to:o.to,subject:line(o.subject),text:m.text,html:m.html,...(o.unsubscribe?{headers:{'List-Unsubscribe':`<${o.unsubscribe}>`}}:{}),...(o.replyTo&&/^\S+@\S+\.\S+$/.test(o.replyTo)?{replyTo:o.replyTo}:{})});return true}
  catch(e){console.error('Mail mislukt:',e instanceof Error?e.message:'onbekend');return false}}
/** Melding aan NiMaGo zelf (NOTIFY_TO, anders het e-mailadres uit Instellingen). */
export function notifyOwner(subject:string,text:string,replyTo?:string){const to=process.env.NOTIFY_TO||allSettings().email;if(to)void sendMail({to,subject,text,replyTo})}
