import Link from 'next/link';import {Mark} from './Art';
export default function Brand({light=false,href='/'}:{light?:boolean;href?:string}){return <Link href={href} className={`brand ${light?'brand-light':''}`} aria-label="NiMaGo Digital Solutions, naar de homepage"><Mark className="brand-mark"/><span className="brand-text"><b>iMaGo</b><small>Digital Solutions</small></span></Link>}
