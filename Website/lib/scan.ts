import http from 'node:http';import https from 'node:https';import dns from 'node:dns';import net from 'node:net';
/** Snelle technische website-check. Haalt één pagina op met bescherming tegen SSRF: geen privé-adressen, geen vreemde poorten, controle op elk verbindingsmoment. */
const isPrivate=(ip:string):boolean=>{
  if(net.isIPv6(ip)){const l=ip.toLowerCase();if(l==='::1'||l==='::'||l.startsWith('fe80')||l.startsWith('fc')||l.startsWith('fd')||l.startsWith('::ffff:'))return l.startsWith('::ffff:')?isPrivate(l.slice(7)):true;return false}
  const p=ip.split('.').map(Number);if(p.length!==4||p.some(n=>Number.isNaN(n)))return true;
  const [a,b]=p;return a===0||a===10||a===127||(a===169&&b===254)||(a===172&&b>=16&&b<=31)||(a===192&&b===168)||(a===100&&b>=64&&b<=127)||(a===192&&b===0)||(a===198&&(b===18||b===19))||a>=224};
const safeLookup:any=(host:string,opts:any,cb:any)=>{dns.lookup(host,{...opts,all:true},(err,addrs:any)=>{if(err)return cb(err);const list=Array.isArray(addrs)?addrs:[addrs];if(!list.length||list.some((a:any)=>isPrivate(a.address)))return cb(new Error('Adres niet toegestaan'));if(opts?.all)return cb(null,list);cb(null,list[0].address,list[0].family)})};
export function normalizeUrl(input:string):URL|null{let s=String(input||'').trim();if(!s||s.length>300)return null;if(!/^https?:\/\//i.test(s))s='https://'+s;let u:URL;try{u=new URL(s)}catch{return null}
  if(!['http:','https:'].includes(u.protocol)||u.username||u.password)return null;if(u.port&&!['80','443'].includes(u.port))return null;
  const h=u.hostname;if(!h.includes('.')&&!net.isIP(h))return null;if(net.isIP(h)&&isPrivate(h))return null;if(/\.(local|internal|localhost|lan)$/i.test(h))return null;return u}
type Got={status:number;headers:http.IncomingHttpHeaders;body:string;bytes:number;ms:number;finalUrl:URL};
function get(u:URL,hops=0):Promise<Got>{return new Promise((resolve,reject)=>{
  const t0=Date.now();const lib=u.protocol==='https:'?https:http;
  const req=lib.request(u,{method:'GET',lookup:safeLookup,timeout:8000,headers:{'User-Agent':'NiMaGo-WebsiteCheck/1.0 (+https://nimago)','Accept':'text/html,application/xhtml+xml','Accept-Encoding':'identity'}},res=>{
    const ttfb=Date.now()-t0;const st=res.statusCode||0;
    if(st>=300&&st<400&&res.headers.location){res.resume();if(hops>=4)return reject(new Error('Te veel doorverwijzingen'));let n:URL;try{n=new URL(res.headers.location,u)}catch{return reject(new Error('Ongeldige doorverwijzing'))}
      const ok=normalizeUrl(n.toString());if(!ok)return reject(new Error('Doorverwijzing niet toegestaan'));return get(ok,hops+1).then(r=>resolve({...r,ms:ttfb})).catch(reject)}
    const chunks:Buffer[]=[];let bytes=0;res.on('data',(c:Buffer)=>{bytes+=c.length;if(bytes>1_500_000){req.destroy(new Error('Pagina te groot'));return}chunks.push(c)});
    res.on('end',()=>resolve({status:st,headers:res.headers,body:Buffer.concat(chunks).toString('utf8'),bytes,ms:ttfb,finalUrl:u}));res.on('error',reject)});
  req.on('timeout',()=>req.destroy(new Error('Time-out')));req.on('error',reject);req.end()})}
export type Check={id:string;label:string;status:'goed'|'let-op'|'slecht';detail:string;weight:number};
export type ScanResult={url:string;finalUrl:string;ms:number;bytes:number;score:number;checks:Check[]};
export async function scan(u:URL):Promise<ScanResult>{
  const r=await get(u);const h=r.body;const lc=h.toLowerCase();const hd=r.headers;const checks:Check[]=[];
  const add=(id:string,label:string,status:Check['status'],detail:string,weight=1)=>checks.push({id,label,status,detail,weight});
  if(r.status>=400)throw new Error(`De website gaf een foutmelding (${r.status}).`);
  const https=r.finalUrl.protocol==='https:';add('https','Beveiligde verbinding (HTTPS)',https?'goed':'slecht',https?'De site is bereikbaar via een versleutelde verbinding.':'De site gebruikt geen HTTPS. Bezoekers en Google zien dit als onveilig.',3);
  add('speed','Reactietijd van de server',r.ms<600?'goed':r.ms<1500?'let-op':'slecht',`De server reageerde in ${r.ms} ms. ${r.ms<600?'Dat is snel.':r.ms<1500?'Dat kan sneller.':'Dat is traag.'}`,2);
  const kb=Math.round(r.bytes/1024);add('size','Grootte van de pagina (alleen HTML)',kb<300?'goed':kb<800?'let-op':'slecht',`De HTML is ${kb} kB.`,1);
  const title=(h.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]||'').replace(/\s+/g,' ').trim();
  add('title','Paginatitel',!title?'slecht':title.length>=15&&title.length<=65?'goed':'let-op',!title?'Er is geen titel gevonden.':`“${title.slice(0,80)}” (${title.length} tekens). Ideaal is ongeveer 30 tot 60 tekens.`,2);
  const desc=(h.match(/<meta[^>]+name=["']description["'][^>]*>/i)?.[0]||'').match(/content=["']([^"']*)["']/i)?.[1]||'';
  add('desc','Metabeschrijving',!desc?'slecht':desc.length>=70&&desc.length<=170?'goed':'let-op',!desc?'Er is geen beschrijving voor zoekresultaten gevonden.':`${desc.length} tekens. Ideaal is ongeveer 70 tot 160 tekens.`,2);
  const h1=(h.match(/<h1[\s>]/gi)||[]).length;add('h1','Hoofdkop (H1)',h1===1?'goed':h1===0?'slecht':'let-op',h1===1?'Er is precies één hoofdkop.':h1===0?'Er is geen hoofdkop gevonden.':`Er zijn ${h1} hoofdkoppen. Eén is meestal beter.`,2);
  const lang=/<html[^>]+lang=["'][a-z-]+["']/i.test(h);add('lang','Taal van de pagina',lang?'goed':'let-op',lang?'De taal is aangegeven.':'De taal staat niet in de pagina. Dat helpt zoekmachines en schermlezers.',1);
  const vp=/<meta[^>]+name=["']viewport["']/i.test(h);add('viewport','Geschikt voor mobiel',vp?'goed':'slecht',vp?'De pagina past zich aan kleine schermen aan.':'De viewport-instelling ontbreekt. Op een telefoon wordt de site waarschijnlijk te klein getoond.',3);
  const imgs=h.match(/<img\b[^>]*>/gi)||[];const withAlt=imgs.filter(i=>/\balt=["'][^"']+["']/i.test(i)).length;
  add('alt','Beschrijvingen bij afbeeldingen',!imgs.length?'goed':withAlt/imgs.length>=0.9?'goed':withAlt/imgs.length>=0.5?'let-op':'slecht',!imgs.length?'Geen afbeeldingen gevonden op deze pagina.':`${withAlt} van ${imgs.length} afbeeldingen heeft een beschrijving.`,1);
  const canon=/<link[^>]+rel=["']canonical["']/i.test(h);add('canonical','Canonical-link',canon?'goed':'let-op',canon?'Aanwezig.':'Niet gevonden. Dit helpt dubbele pagina’s voorkomen.',1);
  const og=/<meta[^>]+property=["']og:title["']/i.test(h)&&/<meta[^>]+property=["']og:image["']/i.test(h);add('og','Deelafbeelding en -titel',og?'goed':'let-op',og?'Aanwezig, zodat links er mooi uitzien op social media.':'Open Graph-gegevens ontbreken of zijn onvolledig.',1);
  const noindex=/<meta[^>]+name=["']robots["'][^>]*noindex/i.test(h)||/noindex/i.test(String(hd['x-robots-tag']||''));add('noindex','Vindbaar voor zoekmachines',noindex?'slecht':'goed',noindex?'De pagina staat op noindex en wordt niet door Google getoond.':'Geen blokkade voor zoekmachines gevonden.',3);
  const ld=/application\/ld\+json/i.test(lc);add('ld','Gestructureerde gegevens',ld?'goed':'let-op',ld?'Aanwezig, wat zoekmachines helpt de inhoud te begrijpen.':'Niet gevonden. Dit is optioneel, maar kan helpen bij zoekresultaten.',1);
  const sec=[['strict-transport-security','HSTS'],['x-content-type-options','nosniff'],['content-security-policy','CSP']].filter(([k])=>hd[k]).length;
  add('headers','Beveiligingsheaders',sec>=2?'goed':sec===1?'let-op':'slecht',`${sec} van 3 gangbare beveiligingsheaders aanwezig (HSTS, nosniff, CSP).`,1);
  const fav=/<link[^>]+rel=["'][^"']*icon[^"']*["']/i.test(h);add('favicon','Favicon',fav?'goed':'let-op',fav?'Aanwezig.':'Niet gevonden in de pagina.',1);
  const total=checks.reduce((a,c)=>a+c.weight,0);const got=checks.reduce((a,c)=>a+c.weight*(c.status==='goed'?1:c.status==='let-op'?0.5:0),0);
  return{url:u.toString(),finalUrl:r.finalUrl.toString(),ms:r.ms,bytes:r.bytes,score:Math.round(got/total*100),checks}}
