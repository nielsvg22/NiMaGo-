import Link from 'next/link';import {requireAdmin} from '@/lib/auth';import {db} from '@/lib/db';import {logout} from '../actions';import {Mark} from '@/components/Art';import AdminNav from './AdminNav';
export const dynamic='force-dynamic';
export default async function PanelLayout({children}:{children:React.ReactNode}){
  await requireAdmin();
  const unread=(db().prepare('SELECT COUNT(*) c FROM messages WHERE is_read=0').get() as {c:number}).c;
  return <div className="adm"><aside className="adm-side"><Link href="/admin" className="adm-brand"><Mark className="brand-mark"/><span><b>iMaGo</b><small>Admin</small></span></Link><AdminNav unread={unread}/><form action={logout}><button className="out" type="submit">Uitloggen</button></form></aside><main className="adm-main">{children}</main></div>
}
