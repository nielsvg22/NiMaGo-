import {allSettings} from '@/lib/db';import {saveSettings} from '../../actions';
export const metadata={title:'Instellingen'};
export default async function Instellingen({searchParams}:{searchParams:Promise<{opgeslagen?:string}>}){const {opgeslagen}=await searchParams;const s=allSettings();
const F=({k,l,hint,ph}:{k:keyof typeof s;l:string;hint?:string;ph?:string})=><label>{l}<input name={k} defaultValue={s[k]} placeholder={ph} maxLength={200}/>{hint&&<span className="hint">{hint}</span>}</label>;
return <><div className="adm-head"><div><h1>Instellingen</h1><p className="adm-sub">Deze gegevens komen op elke factuur. Controleer ze bij je boekhouder of de KvK voordat je de eerste factuur verstuurt.</p></div></div>
{opgeslagen&&<p className="alert ok" style={{marginBottom:14}} role="status">Opgeslagen.</p>}
<form action={saveSettings} className="fstack">
<div className="adm-card fstack"><h2>Bedrijf</h2><div className="f2"><F k="company_name" l="Bedrijfsnaam"/><F k="legal_form" l="Rechtsvorm (optioneel)" ph="Bijv. Eenmanszaak"/></div><F k="address" l="Adres" ph="Straat en huisnummer"/><div className="f3"><F k="postcode" l="Postcode"/><F k="city" l="Plaats"/><F k="country" l="Land"/></div><div className="f3"><F k="email" l="E-mail"/><F k="phone" l="Telefoon"/><F k="website" l="Website"/></div></div>
<div className="adm-card fstack"><h2>Fiscaal en betaling</h2><div className="f2"><F k="kvk" l="KvK-nummer"/><F k="vat_id" l="Btw-identificatienummer" hint="Laat leeg als je geen btw-nummer hebt (bijv. bij KOR); laat dit controleren."/></div><div className="f2"><F k="iban" l="IBAN" ph="NL00 BANK 0000 0000 00"/><F k="bic" l="BIC (optioneel)"/></div></div>
<div className="adm-card fstack"><h2>Facturen</h2><div className="f2"><F k="payment_days" l="Betaaltermijn (dagen)"/><F k="invoice_prefix" l="Voorvoegsel factuurnummer" hint="Nummers worden bijv. NM-2026-001."/></div><label>Standaardtekst onder de factuur<textarea name="footer_note" defaultValue={s.footer_note} maxLength={800}/></label></div>
<div className="actions"><button className="btn" type="submit">Opslaan</button></div></form></>}
