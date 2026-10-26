export const eur=(cents:number)=>new Intl.NumberFormat('nl-NL',{style:'currency',currency:'EUR'}).format(cents/100);
export const parseEuro=(v:string):number=>{const s=String(v).trim().replace(/[€\s]/g,'').replace(/\.(?=\d{3}(\D|$))/g,'').replace(',','.');const n=Number(s);return Number.isFinite(n)?Math.round(n*100):0};
export const fmtDate=(iso:string)=>{if(!iso)return '';const [y,m,d]=iso.slice(0,10).split('-');return `${d}-${m}-${y}`};
export const today=()=>new Date().toISOString().slice(0,10);
export const addDays=(iso:string,days:number)=>{const d=new Date(iso+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+days);return d.toISOString().slice(0,10)};
