/** Maakt van een eenvoudige tekst een nette HTML-mail in de NiMaGo-huisstijl (espresso, koper, crème). Alles wordt ge-escaped; links naar de eigen site worden een knop. */
const esc=(v:string)=>v.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const FACT=/^([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ\- ]{1,22}): (.+)$/;
export function renderMail(o:{subject:string;text:string;company:string;site:string;contact:string;replyTo?:string;unsubscribe?:string}){
  let body=o.text.replace(/\r/g,'').trim();let cta:{url:string;label:string}|null=null;
  if(o.site){const m=body.match(new RegExp(`\\s*:?\\s*(${o.site.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}[^\\s]*)\\s*$`,'m'));if(m){const url=m[1];const label=/\/api\/download\/file/.test(url)?'Download de PDF':/\/account\/inloggen/.test(url)?'Inloggen':/\/account\/offertes/.test(url)?'Offerte bekijken':/\/account\/berichten/.test(url)?'Bericht lezen':/\/account\/projecten/.test(url)?'Project bekijken':'Openen';cta={url,label};body=body.replace(m[0],'.').replace(/\.\.$/,'.').replace(/\n\.$/,'')}}
  if(!cta&&o.replyTo)cta={url:`mailto:${o.replyTo}`,label:'Beantwoorden'};
  const paras=body.split(/\n{2,}/).map(p=>p.trim()).filter(Boolean);
  const isFacts=(p:string)=>{const l=p.split('\n');return l.length>1&&l.every(x=>FACT.test(x))};
  const factTable=(p:string)=>{const f=p.split('\n').map(l=>l.match(FACT)!);return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FBF5EE;border-radius:14px;margin:0 0 20px">${f.map((m,i)=>`<tr><td style="padding:${i===0?'14px':'6px'} 4px ${i===f.length-1?'14px':'6px'} 18px;width:110px;font:700 11px/1.4 Arial,sans-serif;letter-spacing:1.2px;text-transform:uppercase;color:#9A5434;vertical-align:top">${esc(m[1])}</td><td style="padding:${i===0?'14px':'6px'} 18px ${i===f.length-1?'14px':'6px'} 4px;font:500 15px/1.5 Arial,sans-serif;color:#2A1713">${esc(m[2])}</td></tr>`).join('')}</table>`};
  const font="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif";
  const html=`<!doctype html><html lang="nl"><body style="margin:0;padding:0;background:#F6EEE6;${font};color:#2A1713">
<div style="display:none;max-height:0;overflow:hidden">${esc(o.subject)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F6EEE6"><tr><td align="center" style="padding:28px 14px">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;border-radius:22px;overflow:hidden;background:#FFFFFF;border:1px solid #E8D9C8">
<tr><td style="background:#2A1713;padding:26px 32px"><span style="font:800 26px/1 'Helvetica Neue',Arial,sans-serif;letter-spacing:-1px;color:#FFFFFF"><span style="color:#E2A06A">N</span>iMaGo</span><br><span style="font:600 9px/1 Arial,sans-serif;letter-spacing:3px;text-transform:uppercase;color:#E2A06A">Digital Solutions</span></td></tr>
<tr><td style="height:4px;background:#A8603E;font-size:0;line-height:0">&nbsp;</td></tr>
<tr><td style="padding:34px 32px 8px"><h1 style="margin:0 0 18px;font:800 24px/1.25 'Helvetica Neue',Arial,sans-serif;letter-spacing:-.5px;color:#2A1713">${esc(o.subject)}</h1>
${paras.map(p=>isFacts(p)?factTable(p):`<p style="margin:0 0 16px;font:400 15.5px/1.65 Arial,sans-serif;color:#3A2520">${esc(p).replace(/\n/g,'<br>')}</p>`).join('')}
${cta?`<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 22px"><tr><td style="background:#A8603E;border-radius:99px"><a href="${esc(cta.url)}" style="display:inline-block;padding:14px 28px;font:700 15px/1 Arial,sans-serif;color:#FFFFFF;text-decoration:none">${esc(cta.label)} &rarr;</a></td></tr></table>`:''}
</td></tr>
<tr><td style="padding:18px 32px 28px;border-top:1px solid #F0E4D6"><p style="margin:0;font:400 12.5px/1.6 Arial,sans-serif;color:#7A5F58"><b style="color:#2A1713">${esc(o.company)}</b> &middot; Digitale idee&euml;n. Sterk uitgevoerd.${o.contact?`<br>${esc(o.contact)}`:''}${o.unsubscribe?`<br><a href="${esc(o.unsubscribe)}" style="color:#7A5F58">Geen mails meer ontvangen? Afmelden</a>`:''}${o.site?`<br><a href="${esc(o.site)}" style="color:#9A5434">${esc(o.site.replace(/^https?:\/\//,''))}</a>`:''}</p></td></tr>
</table></td></tr></table></body></html>`;
  const plain=body.trim()+(cta?`\n\n${cta.label}: ${cta.url}`:'')+`\n\n--\n${o.company}${o.site?'\n'+o.site:''}${o.unsubscribe?'\nAfmelden: '+o.unsubscribe:''}`;
  return{html,text:plain};
}
