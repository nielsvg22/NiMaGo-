import {currentPath,schemaGraph} from '@/lib/seo';
/** Gestructureerde gegevens (JSON-LD) voor zoekmachines en AI-antwoordmachines: organisatie, website, broodkruimels, diensten en veelgestelde vragen. */
export default async function SeoSchema(){const path=await currentPath();return <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schemaGraph(path)).replace(/</g,'\\u003c')}}/>}
