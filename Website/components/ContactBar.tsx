import {company} from '@/lib/company';import ContactBarView from './ContactBarView';
const intl=(p:string)=>{const d=p.replace(/[^\d+]/g,'');return d.startsWith('+')?d.slice(1):d.startsWith('00')?d.slice(2):d.startsWith('0')?'31'+d.slice(1):d};
export default function ContactBar(){const c=company();const tel=c.phone.replace(/[^+\d]/g,'');const n=c.phone?intl(c.phone):'';
  return <ContactBarView tel={tel} wa={n?`https://wa.me/${n}?text=${encodeURIComponent('Hoi NiMaGo, ik heb een vraag over een website of software.')}`:''}/>}
