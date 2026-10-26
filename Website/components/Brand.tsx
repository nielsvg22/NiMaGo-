import Link from 'next/link';import {Mark} from './Art';
export default function Brand({light=false}:{light?:boolean}){return <Link href="/" className={`brand ${light?'brand-light':''}`} aria-label="NiMaGo Digital Solutions, naar de homepage"><Mark className="brand-mark"/><span className="brand-text"><b>iMaGo</b><small>Digital Solutions</small></span></Link>}
