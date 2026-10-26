/* Visuals als schaalbare SVG/CSS: geen externe afbeeldingen nodig, scherp op elk scherm. Alles is decoratief/illustratief. */
export function Mark({className = '', white = false}: {className?: string; white?: boolean}) {
  const id = white ? 'mk-w' : 'mk-c';
  return (
    <svg className={className} viewBox="0 0 120 120" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={id} gradientUnits="userSpaceOnUse" x1="10" y1="10" x2="112" y2="112">
          {white ? (<><stop offset="0" stopColor="#FFFFFF"/><stop offset="1" stopColor="#FFE0D6"/></>) : (<><stop offset="0" stopColor="#FFB7A3"/><stop offset=".55" stopColor="#F26A55"/><stop offset="1" stopColor="#C93D28"/></>)}
        </linearGradient>
      </defs>
      <path d="M22 96V25" fill="none" stroke={`url(#${id})`} strokeWidth="20" strokeLinecap="round"/>
      <path d="M22 25 98 96" fill="none" stroke={`url(#${id})`} strokeWidth="22" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M98 96V25" fill="none" stroke={`url(#${id})`} strokeWidth="20" strokeLinecap="round"/>
    </svg>
  );
}

export function HeroScene() {
  return (
    <div className="scene" role="img" aria-label="Abstracte compositie: een koraalkleurige bol met het NiMaGo-beeldmerk, omringd door interfacekaarten voor een webshop, dashboard en automatisering">
      <div className="scene-glow"/>
      <svg className="ring ring-back" viewBox="0 0 100 100" aria-hidden="true">
        <defs><linearGradient id="rg" x1="0" x2="1"><stop offset="0" stopColor="#FFFFFF" stopOpacity=".1"/><stop offset=".5" stopColor="#FFFFFF" stopOpacity=".9"/><stop offset="1" stopColor="#FFD3C4" stopOpacity=".3"/></linearGradient></defs>
        <g transform="rotate(-18 50 50)"><path d="M1 50A49 15 0 0 1 99 50" fill="none" stroke="url(#rg)" strokeWidth=".7"/><path d="M5 50A45 12 0 0 1 95 50" fill="none" stroke="url(#rg)" strokeWidth=".3"/></g>
      </svg>
      <div className="orb"><div className="orb-shine"/><Mark white className="orb-mark"/></div>
      <svg className="ring ring-front" viewBox="0 0 100 100" aria-hidden="true">
        <g transform="rotate(-18 50 50)"><path d="M1 50A49 15 0 0 0 99 50" fill="none" stroke="url(#rg)" strokeWidth=".7"/><path d="M5 50A45 12 0 0 0 95 50" fill="none" stroke="url(#rg)" strokeWidth=".3"/></g>
      </svg>
      <div className="orb-shadow"/>

      <div className="gcard gc-shop" aria-hidden="true">
        <div className="gc-dots"><i/><i/><i/></div>
        <div className="gc-tiles"><span style={{background:'linear-gradient(135deg,#FFD6C8,#FA9A85)'}}/><span style={{background:'linear-gradient(135deg,#FFE9E0,#FFB9A5)'}}/><span style={{background:'linear-gradient(135deg,#F9B9A6,#E8553F)'}}/><span style={{background:'linear-gradient(135deg,#FFE3D8,#F7A08E)'}}/></div>
        <div className="gc-line w60"/><div className="gc-line w35 hot"/>
      </div>

      <div className="gcard gc-dash" aria-hidden="true">
        <div className="gc-title">Overzicht</div>
        <svg viewBox="0 0 120 56" className="gc-chart">
          <defs><linearGradient id="ar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F26A55" stopOpacity=".35"/><stop offset="1" stopColor="#F26A55" stopOpacity="0"/></linearGradient></defs>
          <path d="M0 44C14 40 20 30 34 32S54 46 68 30 92 10 120 8V56H0Z" fill="url(#ar)"/>
          <path d="M0 44C14 40 20 30 34 32S54 46 68 30 92 10 120 8" fill="none" stroke="#E8503A" strokeWidth="2.2" strokeLinecap="round"/>
          <circle cx="120" cy="8" r="3.6" fill="#fff" stroke="#E8503A" strokeWidth="2"/>
        </svg>
      </div>

      <div className="gcard gc-flow" aria-hidden="true">
        <div className="gc-nodes"><b/><u/><b/><u/><b className="on"/></div>
        <div className="gc-pill"><i/>Koppeling actief</div>
      </div>
    </div>
  );
}

const frame = (children: React.ReactNode, dark = false) => (
  <svg viewBox="0 0 480 300" className="mockart" role="img" aria-label="Illustratief interfaceontwerp (concept)">
    <defs>
      <filter id="sh" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="14" stdDeviation="14" floodColor="#7A2A1A" floodOpacity=".22"/></filter>
    </defs>
    <g filter="url(#sh)">
      <rect x="24" y="22" width="432" height="262" rx="20" fill={dark ? '#3A2520' : '#FFFFFF'}/>
      <circle cx="46" cy="44" r="4.5" fill="#FA9A85"/><circle cx="62" cy="44" r="4.5" fill="#FFCDBB"/><circle cx="78" cy="44" r="4.5" fill={dark ? '#5A3A33' : '#F2DDD3'}/>
    </g>
    {children}
  </svg>
);

export function ProjectArt({variant}: {variant: 'peach' | 'dark' | 'blue'}) {
  if (variant === 'peach') {
    const tiles = [['#FFD6C8','#FA9A85'],['#FFE9E0','#FFB9A5'],['#F9B9A6','#E8553F'],['#FFE3D8','#F7A08E']];
    return frame(<>
      <rect x="44" y="62" width="392" height="86" rx="14" fill="url(#hb)"/>
      <defs><linearGradient id="hb" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFE6DD"/><stop offset="1" stopColor="#FA9A85"/></linearGradient></defs>
      <rect x="62" y="84" width="130" height="12" rx="6" fill="#2A1713"/><rect x="62" y="104" width="86" height="8" rx="4" fill="#2A1713" opacity=".35"/>
      <rect x="62" y="122" width="64" height="16" rx="8" fill="#D2432D"/>
      <circle cx="372" cy="105" r="34" fill="#fff" opacity=".55"/><circle cx="372" cy="105" r="20" fill="#F26A55" opacity=".85"/>
      {tiles.map((t, i) => { const x = 44 + i * 100; return (<g key={i}>
        <defs><linearGradient id={`t${i}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={t[0]}/><stop offset="1" stopColor={t[1]}/></linearGradient></defs>
        <rect x={x} y="162" width="92" height="76" rx="12" fill={`url(#t${i})`}/>
        <rect x={x} y="246" width="60" height="7" rx="3.5" fill="#2A1713" opacity=".8"/><rect x={x} y="259" width="34" height="7" rx="3.5" fill="#D2432D"/></g>); })}
    </>);
  }
  if (variant === 'dark') {
    const rows = [['#FA9A85','Aangevraagd'],['#FFCDBB','In behandeling'],['#F26A55','Goedgekeurd'],['#FFCDBB','In behandeling']];
    return frame(<>
      <rect x="24" y="22" width="108" height="262" rx="20" fill="#2A1713"/><rect x="100" y="22" width="32" height="262" fill="#2A1713"/>
      <circle cx="46" cy="44" r="4.5" fill="#FA9A85"/><circle cx="62" cy="44" r="4.5" fill="#FFCDBB"/><circle cx="78" cy="44" r="4.5" fill="#5A3A33"/>
      {[84, 112, 140, 168].map((y, i) => <rect key={y} x="42" y={y} width={i === 0 ? 70 : 54} height="10" rx="5" fill={i === 0 ? '#F26A55' : '#FFFFFF'} opacity={i === 0 ? 1 : .28}/>)}
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
    <rect x="44" y="62" width="120" height="58" rx="14" fill="#FFE6DD"/><rect x="58" y="76" width="50" height="8" rx="4" fill="#2A1713" opacity=".4"/><rect x="58" y="92" width="72" height="14" rx="7" fill="#2A1713"/>
    <rect x="176" y="62" width="120" height="58" rx="14" fill="#FFE6DD"/><rect x="190" y="76" width="50" height="8" rx="4" fill="#2A1713" opacity=".4"/><rect x="190" y="92" width="58" height="14" rx="7" fill="#2A1713"/>
    <rect x="308" y="62" width="128" height="58" rx="14" fill="#F26A55"/><rect x="322" y="76" width="50" height="8" rx="4" fill="#fff" opacity=".6"/><rect x="322" y="92" width="80" height="14" rx="7" fill="#fff"/>
    <rect x="44" y="134" width="260" height="136" rx="14" fill="#FFF8F4"/>
    {bars.map((h, i) => <rect key={i} x={62 + i * 34} y={252 - h} width="20" height={h} rx="7" fill={i === 5 ? '#E8503A' : '#FFCDBB'}/>)}
    <rect x="316" y="134" width="120" height="136" rx="14" fill="#FFF8F4"/>
    <circle cx="376" cy="188" r="30" fill="none" stroke="#FFE0D6" strokeWidth="14"/>
    <circle cx="376" cy="188" r="30" fill="none" stroke="#F26A55" strokeWidth="14" strokeDasharray="120 200" strokeLinecap="round" transform="rotate(-90 376 188)"/>
    <rect x="334" y="236" width="84" height="8" rx="4" fill="#2A1713" opacity=".5"/>
  </>);
}

export function WaveArt() {
  return (
    <div className="waves" role="img" aria-label="Abstracte golvende vormen in zalm en koraal">
      <svg viewBox="0 0 600 640" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <linearGradient id="w0" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFE8DF"/><stop offset="1" stopColor="#FFC3B0"/></linearGradient>
          <linearGradient id="w1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFB9A4"/><stop offset="1" stopColor="#F4745F"/></linearGradient>
          <linearGradient id="w2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#F9876F"/><stop offset="1" stopColor="#D2432D"/></linearGradient>
          <radialGradient id="w3" cx=".3" cy=".25" r=".8"><stop offset="0" stopColor="#FFFFFF" stopOpacity=".85"/><stop offset="1" stopColor="#FFFFFF" stopOpacity="0"/></radialGradient>
        </defs>
        <rect width="600" height="640" fill="url(#w0)"/>
        <circle cx="170" cy="150" r="150" fill="url(#w3)"/>
        <path d="M0 330C110 260 210 300 320 350S520 380 600 300V640H0Z" fill="url(#w1)" opacity=".85"/>
        <path d="M0 430C120 380 230 420 330 460S520 490 600 430V640H0Z" fill="url(#w2)" opacity=".92"/>
        <path d="M0 520C130 490 240 530 350 548S540 560 600 520V640H0Z" fill="#2A1713" opacity=".92"/>
        <circle cx="440" cy="190" r="62" fill="#FFFFFF" opacity=".5"/><circle cx="440" cy="190" r="34" fill="#F26A55" opacity=".9"/>
      </svg>
    </div>
  );
}
