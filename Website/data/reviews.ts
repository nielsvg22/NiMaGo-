export type Review={name:string;role:string;text:string;rating:number;date:string;source?:string};
/** Echte klantreviews (met toestemming van de klant). Zolang deze lijst leeg is, toont de site geen reviewsectie en staan er geen sterren in de gestructureerde gegevens. */
export const reviews:Review[]=[];
/** Alleen voor een lokale opmaaktest (PREVIEW_SAMPLE_REVIEWS=1). Verzonnen en nooit bedoeld voor de publieke site of Google. */
export const sampleReviews:Review[]=[
 {name:'Voorbeeldnaam A',role:'Voorbeeldbedrijf, dienstverlening',text:'Voorbeeldtekst: duidelijke afspraken, snel geleverd en prettig contact tijdens het hele project.',rating:5,date:'2026-01-01'},
 {name:'Voorbeeldnaam B',role:'Voorbeeldbedrijf, webshop',text:'Voorbeeldtekst: de webshop werkt precies zoals we wilden en is makkelijk te beheren.',rating:5,date:'2026-01-01'},
 {name:'Voorbeeldnaam C',role:'Voorbeeldbedrijf, techniek',text:'Voorbeeldtekst: goede communicatie en een portaal dat ons veel handwerk bespaart.',rating:4,date:'2026-01-01'}
];
