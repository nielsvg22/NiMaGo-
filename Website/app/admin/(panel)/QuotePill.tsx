import {effectiveStatus,type Quote} from '@/lib/portal';
const L={concept:'Concept',verzonden:'Verzonden',geaccepteerd:'Geaccepteerd',afgewezen:'Afgewezen',verlopen:'Verlopen'} as const;
const C={concept:'concept',verzonden:'verzonden',geaccepteerd:'betaald',afgewezen:'telaat',verlopen:'concept'} as const;
export default function QuotePill({q}:{q:Pick<Quote,'status'|'valid_until'>}){const s=effectiveStatus(q);return <span className={`pill ${C[s]}`}>{L[s]}</span>}
