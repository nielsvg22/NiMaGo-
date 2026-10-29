import {services,projects} from '@/data/site';import {magnets} from '@/data/magnets';
import {articles} from '@/data/articles';
import {landings,branches} from '@/data/pages';
import {cities} from '@/data/samples';
export const languagePairs:Record<string,string>={'/':'/en','/diensten':'/en/services','/over-ons':'/en/about','/contact':'/en/contact'};
const pages:Record<string,[string,string]>={
 '/':['NiMaGo Digital | Websites, webshops & software uit Apeldoorn','NiMaGo Digital bouwt websites, webshops en maatwerksoftware voor ondernemers. Vanuit Apeldoorn, voor heel Nederland. Bespreek je plannen rechtstreeks met de maker.'],
 '/diensten':['Websites, webshops en software op maat','Van een bedrijfswebsite tot een klantportaal of API-koppeling: ontdek hoe NiMaGo Digital je helpt met ontwerp, ontwikkeling en beheer.'],
 '/projecten':['Projecten: websites, portalen en software','Bekijk hoe NiMaGo Digital websites, klantportalen en software ontwikkelt. Met uitleg over functies, keuzes en de status van ieder project.'],
 '/inzichten':['Praktische inzichten over websites en software','Antwoorden voor ondernemers over websites, webshops, software en automatisering. Ontdek wat past bij je bedrijf en hoe je een goede keuze maakt.'],
 '/techniek':['Onze techniek en ontwikkelaanpak','Ontdek met welke technologie NiMaGo Digital websites, webshops en software bouwt, en wat dat betekent voor beheer, veiligheid en doorontwikkeling.'],
 '/over-ons':['Over NiMaGo Digital: Niels Maarten Gortel','Maak kennis met Niels Maarten Gortel, oprichter van NiMaGo Digital in Apeldoorn. Persoonlijk contact, heldere afspraken en praktische digitale oplossingen.'],
 '/team':['Niels Maarten Gortel, oprichter van NiMaGo','Leer Niels Maarten Gortel kennen: de oprichter en je directe aanspreekpunt bij NiMaGo Digital voor websites, webshops en maatwerksoftware.'],
 '/werkwijze':['Van kennismaking tot werkende website of software','Zo werkt NiMaGo Digital: eerst je doelen begrijpen, dan een helder voorstel, ontwerp, bouw en testen. Met direct contact en afspraken over beheer.'],
 '/contact':['Contact met NiMaGo Digital in Apeldoorn','Een nieuwe website, webshop of softwarevraag? Neem contact op met NiMaGo Digital in Apeldoorn. Vertel wat je wilt bereiken, dan denken we met je mee.'],
 '/kennismaking':['Plan een vrijblijvende kennismaking','Plan een gesprek met NiMaGo Digital over je website, webshop of software. Kies een beschikbaar moment voor een online of telefonische kennismaking.'],
 '/offerte-aanvragen':['Offerte aanvragen voor website, webshop of software','Vertel NiMaGo Digital in vier korte stappen wat je nodig hebt. Je aanvraag is vrijblijvend; budget en startdatum mogen nog openstaan.'],
 '/gratis-website-scan':['Gratis website-check: techniek en verbeterpunten','Bekijk technische aandachtspunten van je website en vraag NiMaGo Digital om persoonlijk mee te kijken. Een eerste check voor ondernemers.'],
 '/werkgebied':['Digitale partner vanuit Apeldoorn, voor heel Nederland','NiMaGo Digital werkt vanuit Apeldoorn voor ondernemers in heel Nederland. Kennismaken kan online of op afspraak in Apeldoorn en omgeving.'],
 '/faq':['Veelgestelde vragen over websites en software','Lees antwoorden op vragen over samenwerking, websites, webshops, software, eigendom, onderhoud en oplevering bij NiMaGo Digital.'],
 '/en':['NiMaGo Digital | Websites, ecommerce & custom software','Websites, ecommerce and custom software for growing businesses. Based in Apeldoorn, working across the Netherlands. Talk directly to the person building it.'],
 '/en/services':['Websites, ecommerce and custom software services','Explore NiMaGo Digital’s web development, ecommerce, custom software and integration services. Clear scope, direct contact and maintainable solutions.'],
 '/en/about':['About NiMaGo Digital and Niels Maarten Gortel','Meet Niels Maarten Gortel, founder of NiMaGo Digital in Apeldoorn. Personal contact and practical expertise in websites, ecommerce and custom software.'],
 '/en/contact':['Contact NiMaGo Digital in Apeldoorn','Discuss your website, ecommerce or software project with NiMaGo Digital. Based in Apeldoorn and working with businesses across the Netherlands.'],
};
export function pageSeo(path:string):{title:string;description:string}{
 if(pages[path])return{title:pages[path][0],description:pages[path][1]};
 const landing=landings.find(l=>'/'+l.slug===path);if(landing)return{title:landing.title,description:landing.description};
 const service=services.find(s=>'/diensten/'+s.slug===path);if(service)return{title:service.title+' op maat',description:service.lead+' '+service.approach};
 const project=projects.find(p=>'/projecten/'+p.slug===path);if(project)return{title:project.title+' — '+project.sector,description:project.description};
 if(path==='/downloads')return{title:'Gratis downloads: checklists voor website en software',description:'Praktische checklists en keuzegidsen voor ondernemers: website-check, voorbereiding, maatwerk software en lokaal vindbaar worden. Gratis PDF.'};
 const magnet=magnets.find(x=>'/downloads/'+x.slug===path);if(magnet)return{title:magnet.title,description:magnet.desc};
 const article=articles.find(a=>'/inzichten/'+a.slug===path);if(article)return{title:article.title,description:article.description};
 const branch=branches.find(b=>'/branches/'+b.slug===path);if(branch)return{title:branch.h1,description:branch.description};
 const city=cities.find(c=>'/werkgebied/'+c.slug===path);if(city)return{title:'Digitale oplossingen in '+city.name,description:city.lead};
 const titles:Record<string,string>={'/afspraken':'Onze afspraken','/woordenlijst':'Woordenlijst voor digitale projecten','/privacyverklaring':'Privacyverklaring','/cookiebeleid':'Cookiebeleid','/algemene-voorwaarden':'Algemene voorwaarden','/zoeken':'Zoeken op de website'};
 const title=titles[path]||'NiMaGo Digital';return{title,description:title+' van NiMaGo Digital. Informatie voor bezoekers en opdrachtgevers over onze dienstverlening.'};
}
export function publicPaths(){return [...new Set([...Object.keys(pages),'/downloads',...magnets.map(x=>'/downloads/'+x.slug),'/afspraken','/woordenlijst','/privacyverklaring','/cookiebeleid','/algemene-voorwaarden','/zoeken',...services.map(s=>'/diensten/'+s.slug),...projects.map(p=>'/projecten/'+p.slug),...articles.map(a=>'/inzichten/'+a.slug),...landings.map(l=>'/'+l.slug),...branches.map(b=>'/branches/'+b.slug),...cities.map(c=>'/werkgebied/'+c.slug)])]}
