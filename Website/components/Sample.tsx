import {getSetting} from '@/lib/db';
/** Klein label bij voorbeeldinhoud (prijzen, team). Uit te zetten in admin > Instellingen > Voorbeeldlabels. */
export default function Sample({text='Voorbeeld'}:{text?:string}){return getSetting('show_samples','1')==='1'?<span className="sample-tag" title="Voorbeeldinhoud: vervang dit door je eigen gegevens">{text}</span>:null}
