import nodemailer from 'nodemailer';import {allSettings} from './db';
/** E-mail via SMTP (bijv. de mailbox bij your-host). Zonder SMTP_HOST/SMTP_USER/SMTP_PASS gebeurt er niets; verzenden mislukt nooit hard, zodat formulieren blijven werken. */
const cfg=()=>({host:process.env.SMTP_HOST||'',port:Number(process.env.SMTP_PORT||465),user:process.env.SMTP_USER||'',pass:process.env.SMTP_PASS||''});
export const mailEnabled=()=>{const c=cfg();return !!(c.host&&c.user&&c.pass)};
const line=(s:string)=>String(s).replace(/[\r\n]+/g,' ').trim().slice(0,200);
export const siteUrl=()=>(process.env.NEXT_PUBLIC_SITE_URL||'').replace(/\/$/,'');
let tr:nodemailer.Transporter|null=null;
const transport=()=>{if(tr)return tr;const c=cfg();tr=nodemailer.createTransport({host:c.host,port:c.port,secure:c.port===465,auth:{user:c.user,pass:c.pass},connectionTimeout:10000,greetingTimeout:10000,socketTimeout:15000});return tr};
export async function sendMail(o:{to:string;subject:string;text:string;replyTo?:string}){
  if(!mailEnabled()||!/^\S+@\S+\.\S+$/.test(o.to))return false;
  try{const s=allSettings();const from=process.env.MAIL_FROM||cfg().user;
    await transport().sendMail({from:`"${line(s.company_name||'NiMaGo').replace(/"/g,'')}" <${from}>`,to:o.to,subject:line(o.subject),text:o.text+`\n\n--\n${s.company_name||'NiMaGo'}${siteUrl()?'\n'+siteUrl():''}`,...(o.replyTo&&/^\S+@\S+\.\S+$/.test(o.replyTo)?{replyTo:o.replyTo}:{})});return true}
  catch(e){console.error('Mail mislukt:',e instanceof Error?e.message:'onbekend');return false}}
/** Melding aan NiMaGo zelf (NOTIFY_TO, anders het e-mailadres uit Instellingen). */
export function notifyOwner(subject:string,text:string,replyTo?:string){const to=process.env.NOTIFY_TO||allSettings().email;if(to)void sendMail({to,subject,text,replyTo})}
