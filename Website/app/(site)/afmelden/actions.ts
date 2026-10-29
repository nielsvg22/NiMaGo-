'use server';
import {redirect} from 'next/navigation';import {checkUnsub} from '@/lib/magnet-token';import {cancelNurture} from '@/lib/nurture';
export async function unsubscribe(fd:FormData){const email=String(fd.get('e')||'').toLowerCase().slice(0,150),t=String(fd.get('t')||'');if(!checkUnsub(email,t))redirect('/afmelden?fout=1');cancelNurture(email);redirect('/afmelden?klaar=1')}
