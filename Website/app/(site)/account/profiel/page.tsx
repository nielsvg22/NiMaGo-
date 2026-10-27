import {requireAccount} from '@/lib/account';import {changeProfile,changePassword} from '../actions';
export const metadata={title:'Profiel'};
const ERR:Record<string,string>={naam:'Vul een naam in.',huidig:'Je huidige wachtwoord klopt niet.',gelijk:'De twee nieuwe wachtwoorden zijn niet gelijk.',wachtwoord:'Kies een wachtwoord van minimaal 10 tekens met letters en minimaal één cijfer of leesteken.',limiet:'Te veel pogingen. Probeer het later opnieuw.'};
export default async function Profiel({searchParams}:{searchParams:Promise<{ok?:string;fout?:string}>}){
  const {ok,fout}=await searchParams;const a=await requireAccount();
  return <><h1>Profiel</h1><p className="lead">Je accountgegevens. Wil je je e-mailadres wijzigen of je account laten verwijderen? <a href="/contact"><u>Neem contact op</u></a>.</p>
  {ok&&<p className="pmsg" role="status">{ok==='wachtwoord'?'Je wachtwoord is gewijzigd.':'Opgeslagen.'}</p>}{fout&&<p className="pmsg err" role="alert">{ERR[fout]||ERR.naam}</p>}
  <div className="pgrid" style={{alignItems:'start'}}><form className="pform wide" action={changeProfile}><h2 style={{margin:0}}>Gegevens</h2><label>E-mailadres<input value={a.email} readOnly disabled/></label><label>Naam<input name="name" required minLength={2} maxLength={100} defaultValue={a.name}/></label><button className="button button-primary" type="submit">Opslaan</button></form>
  <form className="pform wide" action={changePassword}><h2 style={{margin:0}}>Wachtwoord wijzigen</h2><label>Huidig wachtwoord<input type="password" name="current" required autoComplete="current-password"/></label><label>Nieuw wachtwoord<input type="password" name="password" required minLength={10} autoComplete="new-password"/></label><label>Herhaal nieuw wachtwoord<input type="password" name="password2" required minLength={10} autoComplete="new-password"/></label><button className="button button-primary" type="submit">Wachtwoord wijzigen</button></form></div></>
}
