/* Visuals als schaalbare SVG/CSS: geen externe afbeeldingen nodig, scherp op elk scherm. Alles is decoratief/illustratief. */
export function Mark({className = '', white = false}: {className?: string; white?: boolean}) {
  const id = white ? 'mk-w' : 'mk-c';
  return (
    <svg className={className} viewBox="0 0 120 120" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={id} gradientUnits="userSpaceOnUse" x1="10" y1="10" x2="112" y2="112">
          {white ? (<><stop offset="0" stopColor="#FFFFFF"/><stop offset="1" stopColor="#F3DCC6"/></>) : (<><stop offset="0" stopColor="#F6D2B4"/><stop offset=".55" stopColor="#D08B5E"/><stop offset="1" stopColor="#A8603E"/></>)}
        </linearGradient>
      </defs>
      <path d="M22 96V25" fill="none" stroke={`url(#${id})`} strokeWidth="20" strokeLinecap="round"/>
      <path d="M22 25 98 96" fill="none" stroke={`url(#${id})`} strokeWidth="22" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M98 96V25" fill="none" stroke={`url(#${id})`} strokeWidth="20" strokeLinecap="round"/>
    </svg>
  );
}

const frame = (children: React.ReactNode, dark = false) => (
  <svg viewBox="0 0 480 300" className="mockart" role="img" aria-label="Illustratief interfaceontwerp (concept)">
    <defs>
      <filter id="sh" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="14" stdDeviation="14" floodColor="#7A2A1A" floodOpacity=".22"/></filter>
    </defs>
    <g filter="url(#sh)">
      <rect x="24" y="22" width="432" height="262" rx="20" fill={dark ? '#3A2520' : '#FFFFFF'}/>
      <circle cx="46" cy="44" r="4.5" fill="#E2A06A"/><circle cx="62" cy="44" r="4.5" fill="#F0D2B6"/><circle cx="78" cy="44" r="4.5" fill={dark ? '#5A3A33' : '#F2DDD3'}/>
    </g>
    {children}
  </svg>
);

export function ProjectArt({variant}: {variant: 'peach' | 'dark' | 'blue'}) {
  if (variant === 'peach') {
    const tiles = [['#F0D2B6','#E2A06A'],['#F8E8D8','#EBBE8F'],['#E8B88A','#C98B5E'],['#F8E8D8','#E8B88A']];
    return frame(<>
      <rect x="44" y="62" width="392" height="86" rx="14" fill="url(#hb)"/>
      <defs><linearGradient id="hb" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#F7E4D2"/><stop offset="1" stopColor="#E2A06A"/></linearGradient></defs>
      <rect x="62" y="84" width="130" height="12" rx="6" fill="#2A1713"/><rect x="62" y="104" width="86" height="8" rx="4" fill="#2A1713" opacity=".35"/>
      <rect x="62" y="122" width="64" height="16" rx="8" fill="#A8603E"/>
      <circle cx="372" cy="105" r="34" fill="#fff" opacity=".55"/><circle cx="372" cy="105" r="20" fill="#D08B5E" opacity=".85"/>
      {tiles.map((t, i) => { const x = 44 + i * 100; return (<g key={i}>
        <defs><linearGradient id={`t${i}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={t[0]}/><stop offset="1" stopColor={t[1]}/></linearGradient></defs>
        <rect x={x} y="162" width="92" height="76" rx="12" fill={`url(#t${i})`}/>
        <rect x={x} y="246" width="60" height="7" rx="3.5" fill="#2A1713" opacity=".8"/><rect x={x} y="259" width="34" height="7" rx="3.5" fill="#A8603E"/></g>); })}
    </>);
  }
  if (variant === 'dark') {
    const rows = [['#E2A06A','Aangevraagd'],['#F0D2B6','In behandeling'],['#D08B5E','Goedgekeurd'],['#F0D2B6','In behandeling']];
    return frame(<>
      <rect x="24" y="22" width="108" height="262" rx="20" fill="#2A1713"/><rect x="100" y="22" width="32" height="262" fill="#2A1713"/>
      <circle cx="46" cy="44" r="4.5" fill="#E2A06A"/><circle cx="62" cy="44" r="4.5" fill="#F0D2B6"/><circle cx="78" cy="44" r="4.5" fill="#5A3A33"/>
      {[84, 112, 140, 168].map((y, i) => <rect key={y} x="42" y={y} width={i === 0 ? 70 : 54} height="10" rx="5" fill={i === 0 ? '#D08B5E' : '#FFFFFF'} opacity={i === 0 ? 1 : .28}/>)}
      <rect x="152" y="58" width="150" height="14" rx="7" fill="#FFFFFF" opacity=".9"/><rect x="152" y="80" width="100" height="8" rx="4" fill="#FFFFFF" opacity=".35"/>
      {rows.map((r, i) => { const y = 112 + i * 44; return (<g key={i}>
        <rect x="152" y={y} width="288" height="34" rx="12" fill="#FFFFFF" opacity=".08"/>
        <circle cx="172" cy={y + 17} r="9" fill="#FFFFFF" opacity=".2"/>
        <rect x="190" y={y + 12} width="92" height="8" rx="4" fill="#FFFFFF" opacity=".7"/>
        <rect x="350" y={y + 7} width="78" height="20" rx="10" fill={r[0]}/></g>); })}
    </>, true);
  }
  const bars = [34, 52, 40, 70, 58, 88, 76];
  return frame(<>
    <rect x="44" y="62" width="120" height="58" rx="14" fill="#F7E4D2"/><rect x="58" y="76" width="50" height="8" rx="4" fill="#2A1713" opacity=".4"/><rect x="58" y="92" width="72" height="14" rx="7" fill="#2A1713"/>
    <rect x="176" y="62" width="120" height="58" rx="14" fill="#F7E4D2"/><rect x="190" y="76" width="50" height="8" rx="4" fill="#2A1713" opacity=".4"/><rect x="190" y="92" width="58" height="14" rx="7" fill="#2A1713"/>
    <rect x="308" y="62" width="128" height="58" rx="14" fill="#D08B5E"/><rect x="322" y="76" width="50" height="8" rx="4" fill="#fff" opacity=".6"/><rect x="322" y="92" width="80" height="14" rx="7" fill="#fff"/>
    <rect x="44" y="134" width="260" height="136" rx="14" fill="#FBF1EA"/>
    {bars.map((h, i) => <rect key={i} x={62 + i * 34} y={252 - h} width="20" height={h} rx="7" fill={i === 5 ? '#C98B5E' : '#F0D2B6'}/>)}
    <rect x="316" y="134" width="120" height="136" rx="14" fill="#FBF1EA"/>
    <circle cx="376" cy="188" r="30" fill="none" stroke="#F3DCC6" strokeWidth="14"/>
    <circle cx="376" cy="188" r="30" fill="none" stroke="#D08B5E" strokeWidth="14" strokeDasharray="120 200" strokeLinecap="round" transform="rotate(-90 376 188)"/>
    <rect x="334" y="236" width="84" height="8" rx="4" fill="#2A1713" opacity=".5"/>
  </>);
}

export function WaveArt() {
  return (
    <div className="waves" role="img" aria-label="Abstracte golvende vormen in zalm en koraal">
      <svg viewBox="0 0 600 640" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <linearGradient id="w0" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#F8E8D8"/><stop offset="1" stopColor="#EFC9A0"/></linearGradient>
          <linearGradient id="w1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#EBBE8F"/><stop offset="1" stopColor="#D08B5E"/></linearGradient>
          <linearGradient id="w2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#D9996A"/><stop offset="1" stopColor="#A8603E"/></linearGradient>
          <radialGradient id="w3" cx=".3" cy=".25" r=".8"><stop offset="0" stopColor="#FFFFFF" stopOpacity=".85"/><stop offset="1" stopColor="#FFFFFF" stopOpacity="0"/></radialGradient>
        </defs>
        <rect width="600" height="640" fill="url(#w0)"/>
        <circle cx="170" cy="150" r="150" fill="url(#w3)"/>
        <path d="M0 330C110 260 210 300 320 350S520 380 600 300V640H0Z" fill="url(#w1)" opacity=".85"/>
        <path d="M0 430C120 380 230 420 330 460S520 490 600 430V640H0Z" fill="url(#w2)" opacity=".92"/>
        <path d="M0 520C130 490 240 530 350 548S540 560 600 520V640H0Z" fill="#2A1713" opacity=".92"/>
        <circle cx="440" cy="190" r="62" fill="#FFFFFF" opacity=".5"/><circle cx="440" cy="190" r="34" fill="#D08B5E" opacity=".9"/>
      </svg>
    </div>
  );
}

const bgs=['#6B3A2E','#2A1713'];
function Backdrop({id}:{id:string}){return <><defs><linearGradient id={`${id}-bg`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={bgs[0]}/><stop offset="1" stopColor={bgs[1]}/></linearGradient><radialGradient id={`${id}-gl`} cx=".75" cy=".2" r=".7"><stop offset="0" stopColor="#E2A06A" stopOpacity=".7"/><stop offset="1" stopColor="#E2A06A" stopOpacity="0"/></radialGradient></defs><rect width="400" height="240" fill={`url(#${id}-bg)`}/><rect width="400" height="240" fill={`url(#${id}-gl)`}/><circle cx="60" cy="210" r="90" fill="#A8603E" opacity=".25"/></>}

export function ServiceArt({slug,src}:{slug:string;src:string|null}){
  if(src) return <img className="svc-photo" src={src} alt="" loading="lazy"/>;
  const id='sv-'+slug;
  let body:React.ReactNode=null;
  if(slug==='websites') body=<><rect x="60" y="40" width="250" height="160" rx="12" fill="#FFF8F3"/><rect x="60" y="40" width="250" height="20" rx="12" fill="#F3DED4"/><circle cx="74" cy="50" r="3" fill="#E2A06A"/><circle cx="86" cy="50" r="3" fill="#E2A06A"/><rect x="74" y="74" width="120" height="104" rx="8" fill="#A8603E"/><rect x="204" y="76" width="90" height="9" rx="4" fill="#2A1713"/><rect x="204" y="94" width="64" height="6" rx="3" fill="#2A1713" opacity=".35"/><rect x="204" y="110" width="52" height="14" rx="7" fill="#2A1713"/><rect x="204" y="138" width="90" height="40" rx="8" fill="#F3DFC9"/><rect x="290" y="78" width="70" height="130" rx="12" fill="#FFF8F3" stroke="#2A1713" strokeWidth="3"/><rect x="298" y="90" width="54" height="40" rx="6" fill="#E2A06A"/><rect x="298" y="138" width="40" height="6" rx="3" fill="#2A1713"/><rect x="298" y="150" width="30" height="6" rx="3" fill="#2A1713" opacity=".35"/></>;
  if(slug==='webshops') body=<><rect x="110" y="26" width="104" height="190" rx="16" fill="#FFF8F3" stroke="#2A1713" strokeWidth="3"/>{[0,1,2,3].map(i=><rect key={i} x={120+(i%2)*46} y={44+Math.floor(i/2)*58} width="40" height="50" rx="8" fill={['#E2A06A','#E2A06A','#C98B5E','#F3D9BF'][i]}/>)}<rect x="120" y="166" width="70" height="7" rx="3" fill="#2A1713"/><rect x="120" y="180" width="40" height="7" rx="3" fill="#A8603E"/><rect x="232" y="70" width="100" height="64" rx="12" fill="#FFF8F3"/><circle cx="256" cy="102" r="14" fill="#A8603E"/><rect x="278" y="92" width="44" height="7" rx="3" fill="#2A1713"/><rect x="278" y="106" width="30" height="7" rx="3" fill="#2A1713" opacity=".35"/></>;
  if(slug==='maatwerk-software') body=<><rect x="50" y="36" width="300" height="170" rx="14" fill="#1B0E0B"/><rect x="50" y="36" width="300" height="22" rx="14" fill="#33201A"/><circle cx="66" cy="47" r="3.5" fill="#E2A06A"/><circle cx="80" cy="47" r="3.5" fill="#E2A06A"/>{[[70,76,90,'#E2A06A'],[86,92,120,'#F6D2B4'],[86,108,70,'#A8603E'],[86,124,140,'#F6D2B4'],[70,140,60,'#E2A06A'],[86,156,100,'#C98B5E'],[70,172,50,'#E2A06A']].map(([x,y,w,c],i)=><rect key={i} x={x as number} y={y as number} width={w as number} height="7" rx="3.5" fill={c as string} opacity=".9"/>)}<rect x="250" y="70" width="84" height="110" rx="10" fill="#33201A"/><rect x="260" y="82" width="50" height="7" rx="3" fill="#F6D2B4"/><rect x="260" y="100" width="64" height="20" rx="6" fill="#A8603E"/><rect x="260" y="130" width="64" height="20" rx="6" fill="#FFFFFF" opacity=".12"/></>;
  if(slug==='koppelingen-automatisering') body=<><path d="M96 70 200 120 M96 170 200 120 M304 70 200 120 M304 170 200 120" stroke="#E2A06A" strokeWidth="3" strokeDasharray="2 7" strokeLinecap="round"/>{[[70,48],[70,148],[278,48],[278,148]].map(([x,y],i)=><rect key={i} x={x} y={y} width="52" height="52" rx="14" fill="#FFF8F3"/>)}{[[96,74,'#A8603E'],[96,174,'#E2A06A'],[304,74,'#E2A06A'],[304,174,'#C98B5E']].map(([x,y,c],i)=><circle key={i} cx={x as number} cy={y as number} r="11" fill={c as string}/>)}<circle cx="200" cy="120" r="34" fill="#A8603E"/><circle cx="200" cy="120" r="34" fill="none" stroke="#F3D9BF" strokeWidth="3" opacity=".7"/><path d="M186 121l10 10 20-22" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/></>;
  if(slug==='design-branding') body=<><rect x="64" y="52" width="130" height="150" rx="16" fill="#FFF8F3" transform="rotate(-6 129 127)"/><rect x="150" y="40" width="150" height="150" rx="16" fill="#A8603E" transform="rotate(5 225 115)"/><g transform="translate(190 75) scale(.7)"><path d="M22 96V25M22 25 98 96M98 96V25" fill="none" stroke="#FFF8F3" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round"/></g>{['#E2A06A','#E2A06A','#6B3A2E','#2A1713'].map((c,i)=><circle key={i} cx={86+i*24} cy="182" r="9" fill={c} stroke="#FFF8F3" strokeWidth="2"/>)}</>;
  if(slug==='onderhoud-doorontwikkeling') body=<><rect x="52" y="38" width="296" height="168" rx="14" fill="#FFF8F3"/>{[34,52,40,70,58,88,76].map((h,i)=><rect key={i} x={72+i*30} y={180-h} width="18" height={h} rx="6" fill={i===5?'#A8603E':'#E5C6A4'}/>)}<rect x="290" y="56" width="48" height="48" rx="12" fill="#2A1713"/><path d="M303 80l8 8 15-17" fill="none" stroke="#E2A06A" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/><rect x="72" y="56" width="90" height="8" rx="4" fill="#2A1713"/><rect x="72" y="72" width="60" height="6" rx="3" fill="#2A1713" opacity=".35"/></>;
  return <svg className="svc-art" viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Illustratieve weergave van de dienst"><Backdrop id={id}/>{body}</svg>;
}

export function Hills({src,mark=false}:{src:string|null;mark?:boolean}){
  if(src) return <img className="hills-photo" src={src} alt="" loading="lazy"/>;
  return <svg className="hills" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Abstract herfstlandschap in warme tinten"><defs><linearGradient id="hs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F6C99B"/><stop offset=".55" stopColor="#D98A55"/><stop offset="1" stopColor="#8F4F31"/></linearGradient><radialGradient id="hg" cx=".7" cy=".3" r=".5"><stop offset="0" stopColor="#FFF1D8"/><stop offset="1" stopColor="#FFF1D8" stopOpacity="0"/></radialGradient></defs><rect width="800" height="400" fill="url(#hs)"/><rect width="800" height="400" fill="url(#hg)"/><circle cx="560" cy="120" r="46" fill="#FFF1D8" opacity=".9"/><path d="M0 250C120 190 230 230 340 250S560 210 800 240V400H0Z" fill="#B96A3E"/><path d="M0 290C140 240 260 285 380 295S620 250 800 285V400H0Z" fill="#8F4F31"/><path d="M0 340C160 300 300 335 430 345S660 315 800 335V400H0Z" fill="#5A2E22"/><path d="M0 380C200 350 420 385 800 365V400H0Z" fill="#2A1713"/>{mark&&<g transform="translate(300 90) scale(1.6)"><path d="M22 96V25M22 25 98 96M98 96V25" fill="none" stroke="#FFF1D8" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" opacity=".95"/></g>}</svg>;
}
