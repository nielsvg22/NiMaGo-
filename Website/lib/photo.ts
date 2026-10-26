import fs from 'node:fs';import path from 'node:path';
/** Geeft het pad van een eigen foto terug als die in public/images/foto/ staat (jpg, jpeg, webp of png), anders null. */
export function photo(name:string):string|null{for(const ext of ['jpg','jpeg','webp','png']){if(fs.existsSync(path.join(process.cwd(),'public/images/foto',`${name}.${ext}`)))return `/images/foto/${name}.${ext}`}return null}
/** Afbeeldingen van een project in public/images/projecten/, bv. aigwise-1.jpg, aigwise-2.jpg (gesorteerd). */
export function projectImages(slug:string):string[]{const dir=path.join(process.cwd(),'public/images/projecten');if(!fs.existsSync(dir))return [];return fs.readdirSync(dir).filter(f=>f.startsWith(slug+'-')&&/\.(jpe?g|png|webp)$/i.test(f)).sort().map(f=>`/images/projecten/${f}`)}
