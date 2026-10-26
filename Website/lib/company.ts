import {allSettings} from './db';
/** Bedrijfsgegevens uit de admin (Instellingen); worden op de site gebruikt voor footer, contact en juridische teksten. */
export function company(){const s=allSettings();const addr=[s.address,[s.postcode,s.city].filter(Boolean).join(' ')].filter(Boolean).join(', ');return {...s,name:s.company_name||'NiMaGo',fullName:[s.company_name||'NiMaGo',s.legal_form].filter(Boolean).join(' '),addr}}
