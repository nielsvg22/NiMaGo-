import Link from 'next/link';import {redirect} from 'next/navigation';import {currentAccount} from '@/lib/account';import {registerAccount} from '../actions';
export const metadata={title:'Account aanmaken'};
const ERR:Record<string,string>={gegevens:'Vul je naam en een geldig e-mailadres in.',privacy:'Ga akkoord met de privacyverklaring om een account aan te maken.',gelijk:'De twee wachtwoorden zijn niet gelijk.',wachtwoord:'Kies een wachtwoord van minimaal 10 tekens met letters en minimaal één cijfer of leesteken.',bestaat:'Er bestaat al een account met dit e-mailadres. Log in of neem contact op als je je wachtwoord kwijt bent.',limiet:'Te veel pogingen. Probeer het later opnieuw.',uit:'Het klantportaal is nog niet beschikbaar.'};
export default async function Registreren({searchParams}:{searchParams:Promise<{fout?:string;naam?:string;email?:string}>}){
  const {fout,naam,email}=await searchParams;if(await currentAccount())redirect('/account');
  return <div className="auth-wrap"><div><span className="eyebrow">Klantportaal</span><h1 style={{marginTop:16}}>Account aanmaken</h1><p className="lead">Maak een account aan om je offertes, projecten en afspraken bij NiMaGo te volgen.</p><ul><li>Gebruik het e-mailadres waarmee je met ons contact hebt.</li><li>Wij koppelen je account aan je gegevens, meestal binnen één werkdag. Tot die tijd zie je nog niets.</li><li>Zo weten we zeker dat je alleen je eigen gegevens ziet.</li></ul></div>
  <form className="pform" action={registerAccount}><h2 style={{margin:0}}>Nieuw account</h2>
    {fout&&<p className="pmsg err" role="alert" style={{margin:0}}>{ERR[fout]||ERR.gegevens}</p>}
    <label>Naam<input name="name" required minLength={2} maxLength={100} autoComplete="name" defaultValue={naam}/></label>
    <label>E-mailadres<input type="email" name="email" required maxLength={150} autoComplete="email" defaultValue={email}/></label>
    <label>Wachtwoord<input type="password" name="password" required minLength={10} maxLength={200} autoComplete="new-password"/></label>
    <label>Herhaal wachtwoord<input type="password" name="password2" required minLength={10} maxLength={200} autoComplete="new-password"/></label>
    <label className="honeypot" aria-hidden="true">Niet invullen<input name="website" tabIndex={-1} autoComplete="off"/></label>
    <label className="check"><input type="checkbox" name="consent" required/> <span>Ik ga akkoord met de <Link href="/privacyverklaring"><u>privacyverklaring</u></Link>.</span></label>
    <button className="button button-primary" type="submit">Account aanmaken</button>
    <small>Minimaal 10 tekens, met letters en een cijfer of leesteken. Al een account? <Link href="/account/inloggen"><u>Inloggen</u></Link>.</small></form></div>
}
