/* VOORBEELDINHOUD: alles in dit bestand is verzonnen en bedoeld om later te vervangen door echte gegevens. */
export const team:{name:string;role:string;bio:string;initials:string}[]=[
 {name:'Niels van Gortel',role:'Oprichter, development en techniek',initials:'N',bio:'Bouwt websites, portalen en koppelingen. Houdt van heldere code en software die je jaren kunt blijven gebruiken.'},
 {name:'Matthijs van Gortel',role:'Oprichter, ontwerp en strategie',initials:'M',bio:'Vertaalt wensen naar een duidelijk ontwerp en een plan. Zorgt dat techniek en uitstraling bij elkaar passen.'}];
export const packages:{name:string;forWho:string;price:string;items:string[];highlight?:boolean}[]=[
 {name:'Start',forWho:'Zelfstandigen en kleine ondernemers',price:'€ 1.800 – € 3.500',items:['Website tot ca. 5 pagina’s','Responsive ontwerp','Basis zoekmachineoptimalisatie','Contactformulier','1 feedbackronde']},
 {name:'Groei',forWho:'Ambitieuze mkb-bedrijven',price:'€ 4.500 – € 9.000',items:['8 tot 15 pagina’s of kleine webshop','Ontwerp op maat','Beheeromgeving voor teksten','Statistieken en koppelingen','2 feedbackrondes'],highlight:true},
 {name:'Maatwerk',forWho:'Bedrijven met een eigen proces',price:'Vanaf € 8.000',items:['Portaal, dashboard of koppeling','Analyse, ontwerp en bouw','Rollen, rechten en veilig inloggen','Documentatie en overdracht','Planning per fase']},
 {name:'Design',forWho:'Teams met eigen developers',price:'€ 1.500 – € 6.000',items:['Digitale huisstijl','UI-ontwerp voor web en app','Componentenbibliotheek','Bestanden voor je team','Uitleg bij overdracht']}];
export const care:{name:string;price:string;items:string[]}[]=[
 {name:'Basis',price:'€ 49 – € 89 per maand',items:['Updates en beveiliging','Bewaking en back-ups','1 uur aanpassingen']},
 {name:'Plus',price:'€ 149 – € 229 per maand',items:['Alles van Basis','3 uur aanpassingen','Maandrapport','Reactie binnen 1 werkdag']},
 {name:'Partner',price:'€ 449 – € 749 per maand',items:['Alles van Plus','8 uur ontwikkeling','Prioriteit bij storingen','Overleg per kwartaal']}];
export type City={slug:string;name:string;region:string;lead:string;angle:string};
export const cities:City[]=[
 {slug:'amsterdam',name:'Amsterdam',region:'Noord-Holland',lead:'Websites, webshops en software voor bedrijven in en rond Amsterdam.',angle:'Veel bedrijven in de regio Amsterdam draaien snel en internationaal. Wij bouwen digitale oplossingen die meegroeien en ook in het Engels goed werken.'},
 {slug:'utrecht',name:'Utrecht',region:'Utrecht',lead:'Digitale oplossingen voor ondernemers en teams in Utrecht en omgeving.',angle:'Utrecht is het centrum van het land: makkelijk bereikbaar voor een kennismaking op locatie, en een regio met veel diensten- en techbedrijven.'},
 {slug:'rotterdam',name:'Rotterdam',region:'Zuid-Holland',lead:'Maatwerk software, webshops en websites voor Rotterdamse bedrijven.',angle:'In en rond Rotterdam zitten veel handels-, logistiek- en productiebedrijven. Daar helpen koppelingen en automatisering vaak het meest.'},
 {slug:'apeldoorn',name:'Apeldoorn',region:'Gelderland',lead:'Persoonlijk digitaal werk voor bedrijven in Apeldoorn en de Veluwe.',angle:'We denken graag mee met lokale ondernemers. Een kort gesprek op locatie of online, en korte lijnen tijdens het hele project.'},
 {slug:'zwolle',name:'Zwolle',region:'Overijssel',lead:'Websites en software voor ondernemers in Zwolle en Overijssel.',angle:'Een regio met een sterke mix van mkb, zorg en industrie. We vertalen jouw proces naar praktische, onderhoudbare software.'}];
