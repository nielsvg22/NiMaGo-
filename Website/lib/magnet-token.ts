import crypto from 'node:crypto';
/** Ondertekende links voor downloads en afmelden. Zonder geheime sleutel (SESSION_SECRET of admin-wachtwoord) werken ze niet. */
const material=()=>process.env.SESSION_SECRET||((process.env.ADMIN_PASSWORD||'').length>=10?'nimago-links:'+process.env.ADMIN_PASSWORD:'');
const sign=(v:string)=>crypto.createHmac('sha256',crypto.createHash('sha256').update(material()).digest('hex')).update(v).digest('hex').slice(0,32);
export const linksEnabled=()=>material().length>0;
export function downloadToken(slug:string,days=14){const exp=Math.floor(Date.now()/1000)+days*86400;return `${exp}.${sign(`dl:${slug}:${exp}`)}`}
export function checkDownload(slug:string,t:string){const [e,s]=String(t).split('.');const exp=parseInt(e,10);if(!exp||!s||exp<Date.now()/1000||!linksEnabled())return false;const a=Buffer.from(sign(`dl:${slug}:${exp}`)),b=Buffer.from(s);return a.length===b.length&&crypto.timingSafeEqual(a,b)}
export const unsubToken=(email:string)=>sign('unsub:'+email.toLowerCase());
export function checkUnsub(email:string,t:string){if(!linksEnabled())return false;const a=Buffer.from(unsubToken(email)),b=Buffer.from(String(t));return a.length===b.length&&crypto.timingSafeEqual(a,b)}
