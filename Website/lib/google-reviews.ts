/** Google-reviews live ophalen via de Places API (New). Vereist GOOGLE_PLACES_API_KEY en GOOGLE_PLACE_ID.
 *  Er wordt niets in de database opgeslagen; alleen een korte cache in het geheugen (standaard 60 minuten) om kosten en wachttijd te beperken. */
export type GReview={author:string;authorUrl:string;rating:number;text:string;when:string};
export type GReviews={rating:number;count:number;url:string;reviews:GReview[]};
let cache:{at:number;data:GReviews|null}|null=null;let inflight:Promise<GReviews|null>|null=null;
const ttl=()=>Math.max(5,Math.min(1440,Number(process.env.PLACES_CACHE_MINUTES)||60))*60_000;
export const googleReviewsEnabled=()=>!!(process.env.GOOGLE_PLACES_API_KEY&&process.env.GOOGLE_PLACE_ID);
async function load():Promise<GReviews|null>{
  const key=process.env.GOOGLE_PLACES_API_KEY,id=process.env.GOOGLE_PLACE_ID;if(!key||!id||!/^[A-Za-z0-9_-]{10,200}$/.test(id))return null;
  const base=process.env.GOOGLE_PLACES_BASE||'https://places.googleapis.com';
  try{const r=await fetch(`${base}/v1/places/${id}?languageCode=nl`,{headers:{'X-Goog-Api-Key':key,'X-Goog-FieldMask':'rating,userRatingCount,reviews,googleMapsUri'},signal:AbortSignal.timeout(6000),cache:'no-store'});
    if(!r.ok){console.error('Google Places fout',r.status);return null}
    const j=await r.json() as {rating?:number;userRatingCount?:number;googleMapsUri?:string;reviews?:{rating?:number;relativePublishTimeDescription?:string;text?:{text?:string};originalText?:{text?:string};authorAttribution?:{displayName?:string;uri?:string}}[]};
    const reviews:GReview[]=(j.reviews||[]).map(v=>({author:String(v.authorAttribution?.displayName||'Google-gebruiker').slice(0,80),authorUrl:String(v.authorAttribution?.uri||''),rating:Math.max(1,Math.min(5,Math.round(v.rating||5))),text:String(v.text?.text||v.originalText?.text||'').trim().slice(0,1500),when:String(v.relativePublishTimeDescription||'').slice(0,40)})).filter(v=>v.text);
    return{rating:Number(j.rating)||0,count:Number(j.userRatingCount)||reviews.length,url:String(j.googleMapsUri||''),reviews}
  }catch(e){console.error('Google Places mislukt:',e instanceof Error?e.message:'onbekend');return null}}
export async function getGoogleReviews():Promise<GReviews|null>{
  if(!googleReviewsEnabled())return null;
  if(cache&&Date.now()-cache.at<ttl())return cache.data;
  if(!inflight)inflight=load().then(d=>{cache={at:Date.now(),data:d};return d}).finally(()=>{inflight=null});
  return inflight}
