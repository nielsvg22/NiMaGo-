import fs from 'node:fs';import path from 'node:path';
/** Geeft het pad van een eigen foto terug als die in public/images/foto/ staat (jpg, jpeg, webp of png), anders null. */
export function photo(name:string):string|null{for(const ext of ['jpg','jpeg','webp','png']){if(fs.existsSync(path.join(process.cwd(),'public/images/foto',`${name}.${ext}`)))return `/images/foto/${name}.${ext}`}return null}
