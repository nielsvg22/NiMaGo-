import manifest from '@/data/image-sizes.json';
type ImageInfo={width:number;height:number;variants:{src:string;width:number}[]};
/** Bestaande beeldkeuze behouden; de browser kiest alleen een passende bestandsgrootte. */
export function imageProps(src:string,sizes='(max-width: 740px) 100vw, (max-width: 1020px) 50vw, 33vw'){
 const info=(manifest as Record<string,ImageInfo>)[src];
 return info?{src,width:info.width,height:info.height,srcSet:info.variants.map(v=>`${v.src} ${v.width}w`).join(', '),sizes,decoding:'async' as const}:{src,decoding:'async' as const};
}
