import Link from 'next/link';import {redirect} from 'next/navigation';import {currentAccount,portalEnabled} from '@/lib/account';import {loginAccount} from '../actions';
export const metadata={title:'Inloggen'};
const ERR:Record<string,string>={'1':'E-mailadres of wachtwoord klopt niet.',limiet:'Te veel pogingen. Probeer het over een kwartier opnieuw.',geblokkeerd:'Dit account is geblokkeerd. Neem contact met ons op.',uit:'Het klantportaal is nog niet beschikbaar.'};
export default async function Inloggen({searchParams}:{searchParams:Promise<{fout?:string}>}){
  const {fout}=await searchParams;if(await currentAccount())redirect('/account');
  return <div className="auth-wrap"><div><span className="eyebrow">Klantportaal</span><h1 style={{marginTop:16}}>Inloggen</h1><p className="lead">Volg je projecten, bekijk je offertes en afspraken en stuur ons een bericht, op elk moment.</p><ul><li>Offertes inzien en direct akkoord geven</li><li>De status en voortgang van je project volgen</li><li>Afspraken en facturen op één plek</li></ul></div>
  <form className="pform" action={loginAccount}><h2 style={{margin:0}}>Welkom terug</h2>
    {fout&&<p className="pmsg err" role="alert" style={{margin:0}}>{ERR[fout]||ERR['1']}</p>}{!portalEnabled()&&<p className="pmsg info" style={{margin:0}}>{ERR.uit}</p>}
    <label>E-mailadres<input type="email" name="email" required autoComplete="email" maxLength={150}/></label>
    <label>Wachtwoord<input type="password" name="password" required autoComplete="current-password" maxLength={200}/></label>
    <button className="button button-primary" type="submit">Inloggen</button>
    <small>Nog geen account? <Link href="/account/registreren"><u>Maak er een aan</u></Link>. Wachtwoord kwijt? <Link href="/contact"><u>Neem contact op</u></Link> en we stellen een nieuw wachtwoord in.</small></form></div>
}
