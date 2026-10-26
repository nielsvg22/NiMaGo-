export const site = {
  name: 'NiMaGo', subtitle: 'Digital Solutions',
  tagline: 'Digitale ideeën. Sterk uitgevoerd.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  // Voer pas echte contactgegevens in na controle/registratie van domein en e-mail.
  email: '', phone: '', kvk: '', vat: '', postalAddress: '',
  instagram: '', linkedin: '',
};
export const services = [
  {slug:'websites',eyebrow:'01 / Websites',title:'Websites',lead:'Een website die je verhaal overtuigend vertelt én prettig werkt.',icon:'Monitor',tags:['Webdesign','Next.js','SEO'],bullets:['Een onderscheidend ontwerp op maat','Snel, toegankelijk en mobielvriendelijk','Technisch voorbereid op groei'],approach:'Van strategie en structuur tot design, development en een zorgvuldige lancering.'},
  {slug:'webshops',eyebrow:'02 / Commerce',title:'Webshops',lead:'Een winkelervaring waarin uitstraling en conversie samenkomen.',icon:'ShoppingBag',tags:['Shopify','E-commerce','UX'],bullets:['Logische product- en collectiestructuur','Slimme koppelingen en automatisering','Overzichtelijk beheer voor je team'],approach:'We denken na over het koopproces, richten het platform zorgvuldig in en zorgen dat je kunt doorontwikkelen.'},
  {slug:'maatwerk-software',eyebrow:'03 / Maatwerk',title:'Maatwerk software',lead:'Digitale tools die aansluiten op hoe jouw organisatie écht werkt.',icon:'Layers3',tags:['Portalen','Dashboards','Applicaties'],bullets:['Workflows vanuit je dagelijkse praktijk','Veilig beheer en heldere rollen','Schaalbare technische opzet'],approach:'Geen oplossing omdat het kan, maar omdat het een concreet probleem oplost.'},
  {slug:'koppelingen-automatisering',eyebrow:'04 / Integratie',title:'Koppelingen & automatisering',lead:'Minder dubbel werk. Meer rust in je processen.',icon:'Workflow',tags:['API','Integraties','AI'],bullets:['Gegevens slim laten samenwerken','Repetitieve taken vereenvoudigen','Transparantie over wat geautomatiseerd wordt'],approach:'We starten bij het werkproces en selecteren de techniek die aantoonbaar iets toevoegt.'},
  {slug:'design-branding',eyebrow:'05 / Creatief',title:'Design & branding',lead:'Een helder digitaal gezicht dat bij je ambitie past.',icon:'PenTool',tags:['UX/UI','Identiteit','Designsystemen'],bullets:['Digitale merkidentiteit','Gebruiksvriendelijke interfaces','Consistente componenten'],approach:'We ontwerpen vanuit je merk, je gebruikers en je doelen - nooit vanuit een willekeurig template.'},
  {slug:'onderhoud-doorontwikkeling',eyebrow:'06 / Continuïteit',title:'Onderhoud & groei',lead:'Techniek blijft bewegen. Wij blijven betrokken.',icon:'LifeBuoy',tags:['Monitoring','Updates','Support'],bullets:['Doorlopende verbeteringen','Technisch onderhoud en bewaking','Ondersteuning bij nieuwe wensen'],approach:'Na livegang blijft er ruimte voor groei, begeleiding en kleine of grote verbeteringen.'}
] as const;
export const projects = [
 {slug:'commerce-flow',type:'Conceptproject',sector:'E-commerce',title:'Commerce Flow',subtitle:'Een rustige webshop die voor je verkoopt.',description:'Een fictief webwinkelconcept waarin productontdekking en heldere informatie centraal staan.',color:'peach',tags:['Shopify','Design','Automatisering']},
 {slug:'partner-portal',type:'Conceptproject',sector:'Portaal',title:'Partner Portal',subtitle:'Alles geregeld in één digitale omgeving.',description:'Een concept voor een beveiligd samenwerkingsportaal met aanvragen en overzichtelijke statussen.',color:'dark',tags:['Maatwerk','UX','API']},
 {slug:'insight-dashboard',type:'Conceptproject',sector:'Dashboard',title:'Insight Dashboard',subtitle:'Inzichten waar je wat aan hebt.',description:'Een conceptdashboard met de belangrijkste informatie direct zichtbaar.',color:'blue',tags:['Data','UI','Maatwerk']}
] as const;
export const steps = [
 {n:'01',title:'Kennismaken',description:'We luisteren, stellen vragen en maken je ambities concreet.'},
 {n:'02',title:'Voorstel',description:'Je krijgt een duidelijk plan met scope, aanpak en heldere afspraken.'},
 {n:'03',title:'Ontwerpen',description:'We maken de structuur, uitstraling en ervaring tastbaar.'},
 {n:'04',title:'Bouwen',description:'We ontwikkelen, testen en stemmen regelmatig met je af.'},
 {n:'05',title:'Live & verder',description:'We leveren zorgvuldig op en denken mee over je volgende stap.'}
];
