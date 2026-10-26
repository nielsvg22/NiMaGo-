import Link from 'next/link';
export default function Brand({light=false}:{light?:boolean}){return <Link href="/" className={`brand ${light?'brand-light':''}`} aria-label="NiMaGo, naar de homepage"><img src={light?'/logos/03_logo_donker.svg':'/logos/01_logo_primair.svg'} width="205" height="60" alt="NiMaGo Digital Solutions" /></Link>}
