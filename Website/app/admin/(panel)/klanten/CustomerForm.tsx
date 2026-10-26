import {saveCustomer,deleteCustomer} from '../../actions';import type {Customer} from '@/lib/invoice';
export default function CustomerForm({c,back,error}:{c?:Customer;back?:string;error?:string}){
  return <><form action={saveCustomer} className="adm-card fstack">
    {c&&<input type="hidden" name="id" value={c.id}/>}{back&&<input type="hidden" name="back" value={back}/>}
    {error==='naam'&&<p className="alert err">Vul een naam in.</p>}
    <label>Naam bedrijf of persoon<input name="name" required maxLength={160} defaultValue={c?.name}/></label>
    <div className="f2"><label>Contactpersoon<input name="contact" maxLength={120} defaultValue={c?.contact}/></label><label>E-mail<input type="email" name="email" maxLength={160} defaultValue={c?.email}/></label></div>
    <label>Adres<input name="address" maxLength={200} defaultValue={c?.address} autoComplete="off"/></label>
    <div className="f3"><label>Postcode<input name="postcode" maxLength={20} defaultValue={c?.postcode}/></label><label>Plaats<input name="city" maxLength={100} defaultValue={c?.city}/></label><label>Land<input name="country" maxLength={80} defaultValue={c?.country||'Nederland'}/></label></div>
    <div className="f2"><label>KvK-nummer<input name="kvk" maxLength={30} defaultValue={c?.kvk}/></label><label>Btw-nummer<input name="vat_id" maxLength={30} defaultValue={c?.vat_id}/></label></div>
    <label>Notitie (alleen voor jezelf)<textarea name="note" maxLength={1000} defaultValue={c?.note}/></label>
    <div className="actions"><button className="btn" type="submit">Opslaan</button><a className="btn ghost" href="/admin/klanten">Annuleren</a></div></form>
  {c&&<form action={deleteCustomer} style={{marginTop:14}}><input type="hidden" name="id" value={c.id}/><button className="btn danger sm" type="submit">Klant verwijderen</button><span className="hint"> Alleen mogelijk zonder facturen.</span></form>}</>}
