import crypto from 'node:crypto';
/** Wachtwoorden worden met scrypt gehasht (per account een eigen salt); er wordt nooit een wachtwoord opgeslagen. */
const KEYLEN=64,OPTS={N:16384,r:8,p:1,maxmem:64*1024*1024};
export function hashPassword(pw:string){const salt=crypto.randomBytes(16).toString('hex');const hash=crypto.scryptSync(pw.normalize('NFKC'),salt,KEYLEN,OPTS).toString('hex');return{salt,hash}}
export function verifyPassword(pw:string,salt:string,hash:string){try{const a=crypto.scryptSync(pw.normalize('NFKC'),salt,KEYLEN,OPTS);const b=Buffer.from(hash,'hex');return a.length===b.length&&crypto.timingSafeEqual(a,b)}catch{return false}}
/** Doet dezelfde rekenklus als een echte controle, zodat een onbekend e-mailadres niet via de snelheid te onderscheiden is. */
export function dummyVerify(pw:string){verifyPassword(pw,'00'.repeat(16),'00'.repeat(KEYLEN))}
export function passwordProblem(pw:string):string|null{if(pw.length<10)return 'Kies een wachtwoord van minimaal 10 tekens.';if(pw.length>200)return 'Dat wachtwoord is te lang.';if(!/[a-zA-Z]/.test(pw)||!/[0-9\W_]/.test(pw))return 'Gebruik letters en minimaal één cijfer of leesteken.';return null}
