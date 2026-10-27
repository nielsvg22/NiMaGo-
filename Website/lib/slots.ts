import {db,allSettings} from './db';
const fmt=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Amsterdam',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23',weekday:'short'});
export function nowAms(d=new Date()){const p=Object.fromEntries(fmt.formatToParts(d).map(x=>[x.type,x.value]));return{date:`${p.year}-${p.month}-${p.day}`,time:`${p.hour}:${p.minute}`,dow:['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(p.weekday)}}
const dowOf=(iso:string)=>new Date(iso+'T12:00:00Z').getUTCDay();
const toMin=(t:string)=>{const [h,m]=t.split(':').map(Number);return h*60+m};
const toTime=(m:number)=>`${String(Math.floor(m/60)).padStart(2,'0')}:${String(m%60).padStart(2,'0')}`;
export function bookingConfig(){const s=allSettings();const days=Math.max(1,Math.min(60,parseInt(s.booking_days,10)||21));const step=Math.max(15,Math.min(120,parseInt(s.slot_minutes,10)||30));const weekdays=s.booking_weekdays.split(',').map(x=>parseInt(x,10)).filter(n=>n>=0&&n<=6);return{start:s.slot_start||'09:00',end:s.slot_end||'17:00',step,days,weekdays:weekdays.length?weekdays:[1,2,3,4,5]}}
export function openDates(){const c=bookingConfig();const out:string[]=[];const base=nowAms().date;for(let i=0;i<=c.days;i++){const d=new Date(base+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+i);const iso=d.toISOString().slice(0,10);if(c.weekdays.includes(dowOf(iso))&&freeSlots(iso).length)out.push(iso)}return out}
export function freeSlots(date:string):string[]{
  const c=bookingConfig();if(!/^\d{4}-\d{2}-\d{2}$/.test(date))return[];if(!c.weekdays.includes(dowOf(date)))return[];
  const now=nowAms();if(date<now.date)return[];const last=new Date(now.date+'T12:00:00Z');last.setUTCDate(last.getUTCDate()+c.days);if(date>last.toISOString().slice(0,10))return[];
  const taken=new Set((db().prepare("SELECT slot FROM appointments WHERE slot LIKE ? AND status!='geannuleerd'").all(date+' %') as {slot:string}[]).map(r=>r.slot.slice(11)));
  const minLead=date===now.date?toMin(now.time)+120:-1;const out:string[]=[];
  for(let m=toMin(c.start);m+c.step<=toMin(c.end);m+=c.step){const t=toTime(m);if(m>=minLead&&!taken.has(t))out.push(t)}return out}
