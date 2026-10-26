import {isOverdue,type Invoice} from '@/lib/invoice';
export default function StatusPill({inv}:{inv:Pick<Invoice,'status'|'due_date'>}){if(isOverdue(inv))return <span className="pill telaat">Te laat</span>;const l={concept:'Concept',verzonden:'Verzonden',betaald:'Betaald'}[inv.status];return <span className={`pill ${inv.status}`}>{l}</span>}
