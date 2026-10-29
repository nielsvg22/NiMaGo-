import fs from 'node:fs';
import path from 'node:path';
import {randomBytes,createCipheriv,createDecipheriv,createHash,createHmac,timingSafeEqual} from 'node:crypto';
export const dataDir=()=>process.env.DATA_DIR||path.join(process.cwd(),'.data');
export const digest=(s:string)=>createHash('sha256').update(s).digest('hex');
/** Eigen sleutel, nooit uit de database afgeleid. Bewaar sleutel en databaseback-up apart. */
export function encryptionKey(){
 const env=process.env.INSTAGRAM_TOKEN_ENCRYPTION_KEY;
 if(env){const key=Buffer.from(env,'base64');if(key.length!==32||key.toString('base64')!==env)throw Error('Ongeldige Instagram-versleutelingssleutel.');return key}
 const dir=dataDir(),file=path.join(dir,'instagram-encryption.key');fs.mkdirSync(dir,{recursive:true});
 try{fs.writeFileSync(file,randomBytes(32),{mode:0o600,flag:'wx'})}catch(e){if((e as NodeJS.ErrnoException).code!=='EEXIST')throw e}
 const key=fs.readFileSync(file);if(key.length!==32)throw Error('Ongeldige Instagram-versleutelingssleutel.');fs.chmodSync(file,0o600);return key;
}
export function seal(token:string){const iv=randomBytes(12),cipher=createCipheriv('aes-256-gcm',encryptionKey(),iv);cipher.setAAD(Buffer.from('nimago-instagram-v1'));return Buffer.concat([iv,cipher.update(token,'utf8'),cipher.final(),cipher.getAuthTag()]).toString('base64')}
export function unseal(value:string){try{const data=Buffer.from(value,'base64'),decipher=createDecipheriv('aes-256-gcm',encryptionKey(),data.subarray(0,12));decipher.setAAD(Buffer.from('nimago-instagram-v1'));decipher.setAuthTag(data.subarray(-16));return Buffer.concat([decipher.update(data.subarray(12,-16)),decipher.final()]).toString('utf8')}catch{throw Error('De Windsor-sleutel kan niet worden ontsleuteld. Controleer de serversleutel.')}}
export function mediaSignature(id:string,expires:string){return createHmac('sha256',encryptionKey()).update(`instagram-media-v1:${id}:${expires}`).digest('hex')}
export function validMediaSignature(id:string,expires:string,signature:string){if(!/^\d+$/.test(expires)||Number(expires)<Date.now()/1000||Number(expires)>Date.now()/1000+4*86400||!/^[a-f0-9]{64}$/.test(signature))return false;try{return timingSafeEqual(Buffer.from(signature),Buffer.from(mediaSignature(id,expires)))}catch{return false}}
export function publicBase(){const url=new URL(process.env.INSTAGRAM_PUBLIC_URL||'https://nimagodigital.nl');if(url.protocol!=='https:'||url.username||url.password||url.search||url.hash||url.pathname!=='/')throw Error('INSTAGRAM_PUBLIC_URL moet een vaste HTTPS-origin zijn.');return url.origin}
export function mediaUrl(id:string){const expires=String(Math.floor(Date.now()/1000)+3*86400);return `${publicBase()}/api/instagram/media/${id}?expires=${expires}&signature=${mediaSignature(id,expires)}`}
