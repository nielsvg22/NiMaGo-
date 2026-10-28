# NiMaGo Digital — marketing- en SEO-roadmap

Sessie: 28 oktober 2026. Eigenaar: Niels Maarten Gortel. Website: https://nimagodigital.nl. Werkgebied: Nederland, met Apeldoorn als thuisbasis.

Lees dit bestand bij iedere volgende marketing-/SEO-sessie. Vul steeds datum, uitgangssituatie, bewijs, wijzigingen, verificatie en uitkomsten aan. Bewaar historische nulmetingen; overschrijf ze niet met nieuwe scores. Een plan is geen al uitgevoerd resultaat.

## 1. Uitgangspunt en bewijs

De bestaande warme huisstijl, banner, goedgekeurde portretfoto, dienstenbeelden, projecten, admin, boekhouding en formulieren blijven behouden. Geen betaalde campagnes, externe publicaties, acquisitiemails, nieuwe contracten of bedrijfsprofielwijzigingen uitgevoerd.

Bronbestanden:

- [Nulmeting](docs/marketing/NULMETING-2026-10-28.json): gecontroleerde productieconfiguratie, echte tellerstanden en mobiele Lighthouse-labmeting.
- [Audit per pagina](docs/marketing/AUDIT-PAGINAS-2026-10-28.csv): 63 openbare pagina’s, titels, H1, canonicals, robots, social metadata en redactionele aandachtspunten.
- [Redirectcontrole](docs/marketing/REDIRECTS-2026-10-28.json): www, oude host en oude software-URL sturen met één 308 door; HTTP naar HTTPS gebruikt nu één 302. Een permanente HTTPS-redirect is een latere infrastructuurverbetering, geen blokkade voor de huidige canonicals.
- [Zoekwoordsuggesties](docs/marketing/ZOEKWOORDSUGGESTIES-2026-10-28.json): werkelijk ontvangen Google-autocomplete-suggesties; dit zijn geen zoekvolumes.

### Nulmeting, vóór deze wijzigingen

| Onderdeel | Gemeten toestand | Interpretatie |
|---|---|---|
| Openbare HTML-pagina’s | 63 gecrawld; alle 63 HTTP 200 | Sitemap plus bereikbare interne openbare links; admin/account/API uitgesloten |
| H1 | 63/63 precies één H1 | Enkele overzichtspagina’s sloegen H2 over; geen claim dat dit op zichzelf rankingverlies veroorzaakt |
| Titels / descriptions | 63 unieke titels, 63 unieke descriptions | Metadata aanwezig in volledige HTML; streaming plaatste tags bij gewone user agents deels buiten de initiële head |
| Interne paginalinks en ankers | Geen gebroken links of fragmenten in de openbare crawl gevonden | Geen uitspraak over privé-routes, externe websites of toekomstige pagina’s |
| Canonicals | Aanwezig en op eigen productiehost | Geen aantoonbare verkeerde canonical gevonden; queryparameters niet als afzonderlijke doelpagina |
| Bewust noindex | Zoeken; Amsterdam, Rotterdam, Utrecht en Zwolle | Bestaande generieke regio’s krijgen geen lokale SEO-prioriteit; Apeldoorn wel |
| robots.txt / sitemap.xml | Beide HTTP 200; publieke crawl toegestaan | Technisch indexeerbaar betekent niet dat Google pagina’s al heeft geïndexeerd |
| Indexeerschakelaar | `ALLOW_INDEXING=1` in productie | Gecontroleerd zonder geheimen in dit rapport op te nemen |
| Social previews | Veel pagina’s erfden dezelfde algemene titel/beschrijving | Duidelijk verbeterpunt voor delen en herkenning |
| Bedrijfsmarkup | LocalBusiness/ProfessionalService, founder, services; vaste oprichtingsdatum | Die datum was niet onderbouwd; lokaal bedrijf vereist correcte adresgegevens |
| Mobiele Lighthouse, één labrun | Performance 97; toegankelijkheid 96; SEO 92 | Lighthouse 13.6.0 op live homepage; geen rankingmeting |
| LCP / CLS / TBT | 1.422 ms / 0 / 120 ms | Mobiele labsimulatie. TBT is géén INP. Geen CrUX-veldgegevens of INP-nulmeting beschikbaar |
| Eigen paginaweergaven | Vandaag 151; laatste 7 dagen 219; laatste 30 dagen 219 | Momentopname 17:43:39 UTC. Geen unieke bezoekers, organisch verkeer of zuiver acquisitieverkeer; eigen bezoeken kunnen meetellen |
| GSC / Bing verificatiecode | Geen codes ingesteld in de productieomgeving | DNS-verificatie kan buiten de website bestaan; eigendom/toegang onbekend |
| GA4 | Geen actieve integratie of measurement-ID gevonden | Geen sessies, bezoekersconversie of GA4-organische nulmeting beschikbaar |
| Google Bedrijfsprofiel | Geen beheertoegang beschikbaar | Geen categorieën, openingstijden, reviews of profielprestaties geverifieerd |
| Zoekvolumes / rankings / omzet uit SEO | Niet beschikbaar | Niet geschat of verzonnen. Een openbare zoekopdracht is geen volledige Google-indexcontrole |

## 2. Audit, prioriteit en uitvoering

P1 = eerst, P2 = daarna, P3 = op basis van gegevens. Impact is een kwalitatieve verwachting, geen berekende omzetwinst.

| Probleem / kans | Prioriteit | Verwachte impact | Inspanning / risico | Uitvoering |
|---|---|---|---|---|
| Onvoldoende echte conversiemeting | P1 | Weten welke acties en aanvragen binnenkomen | Middel / privacy en teldefinities | Eigen dashboard en geaggregeerde meting gebouwd; alleen succesvol opgeslagen aanvragen tellen als formulierresultaat |
| Eén algemene OG-/Twittertekst voor veel routes | P1 | Relevantere previews en consistente positionering | Laag / laag | Centrale routegebonden metadata ingevoerd; metadata direct in head, met behoud van canonicals/hreflang |
| Onbevestigde oprichtingsdatum en lokaal bedrijf zonder volledige adrescontrole | P1 | Feitelijke, betrouwbare entiteitsinformatie | Laag / laag | Datum verwijderd; Organization altijd, ProfessionalService alleen met ingevuld straatadres, postcode en plaats |
| Homepage en lokale websitepagina richten zich op dezelfde exacte term | P1 | Duidelijkere pagina-eigenaarschap | Laag / laag | Homepage naar merk + breed aanbod; lokale commerciële pagina blijft primaire Apeldoorn-target |
| Sitemap statisch terwijl artikelen gepland verschijnen | P1 | Nieuwe inhoud wordt op publicatiedatum vindbaar in sitemap | Laag / laag | Dynamische sitemap, alleen actuele openbare doelpagina’s, hreflang en echte artikeldatums; geen verzonnen algemene lastmod |
| Te grote bestanden op kleine schermen | P2 | Minder downloadverkeer, betere mobiele ervaring | Middel / visueel controleren | Varianten op 480/800/1200 px voor 14 bronbeelden; srcset/sizes en afmetingen. Geen andere fotografie of banner gekozen |
| Onvoldoende contrast artikelbadge / merklinklabel | P2 | Leesbaarheid en toegankelijkheid | Laag / laag | Donkerdere bestaande bruine tint; toegankelijke merknaam zonder zichtbaar ontwerp te wijzigen |
| Nationale landingspagina’s met vage hoofdheading | P2 | Zoekintentie en aanbod duidelijker | Laag / laag | Hoofdteksten van website, webshop, software, automatisering en API-koppelingen aangescherpt |
| Diensten, landingspagina’s en cases sluiten onvoldoende aan | P2 | Kortere route van uitleg naar bewijs en aanvraag | Laag / laag | Dienstdiepte linkt naar primaire landingspagina; relevante landingspagina’s naar bestaande demo-/ontwikkelcases |
| Wisselende reactiebelofte bij offertebevestiging | P2 | Eenduidige verwachting | Laag / laag | Tegenstrijdige één-/twee-dagenbelofte op het offertetraject vervangen door een persoonlijke vervolgstap |
| Algemene automatiseringsuitleg mist beslisgereedschap | P2 | Bruikbaardere expertisecontent | Laag / laag | Bestaand artikel uitgebreid met eigen nulmeting, tijdwinstformule, foutafhandeling en onderhoud |
| Veel vrijwel gelijke regiopagina’s als uitbreiding | P2 | Voorkomen van inhoud zonder eigen waarde | Laag / laag | Geen nieuwe regiopagina’s gemaakt. Regionale context op bestaand werkgebied toegevoegd |
| Overige H2-sprongen / deels generieke dienstkoppen | P3 | Betere structuur en duidelijkheid | Laag / laag | H2-structuur diensten-, project- en artikelenoverzicht verbeterd; overige detailreview in volgende ronde |
| Klantresultaten ontbreken of zijn niet onderbouwd | P2 | Sterker vertrouwen bij commerciële bezoekers | Afhankelijk van eigenaar | Alleen na toestemming echte probleem/aanpak/resultaatinformatie verzamelen; geen cijfers of namen toegevoegd |

Niet geforceerd opgelost: er zijn geen defecte pagina’s geclaimd of onnodige redirects toegevoegd. Bestaande dienstenpagina’s en landingspagina’s blijven functioneel; een primaire zoekwoordtarget is geen bewijs dat alle ondersteunende pagina’s weg moeten.

## 3. Zoekwoordstrategie

Onderzoek: zoekresultaten voor websitebouw/maatwerk in Apeldoorn, officiële SEO-documentatie en zes werkelijk uitgevraagde Nederlandse Google-autocomplete-seeds. Geen Keyword Planner-, Ahrefs-, Semrush- of GSC-volumes beschikbaar. Alle onderstaande commerciële prioriteiten en haalbaarheidsinschattingen zijn redactionele hypotheses. Zoekvolume en numerieke keyword difficulty: **onbekend**.

Belangrijkste kansen: lokale dienstverlening met persoonlijk aanspreekpunt; concrete klantportalen; procesautomatisering en koppelingen met duidelijke afbakening. Brede termen hebben veel concurrerende bureaus. Eerst bestaande pagina’s verbeteren en op echte aanvragen/GSC-inzichten sturen, niet tientallen nieuwe pagina’s publiceren.

| Cluster | Voorbeelden / long-tail | Intentie | Primaire pagina | Prioriteit / haalbaarheidshypothese |
|---|---|---|---|---|
| Merk | NiMaGo, NiMaGo Digital, Niels Maarten Gortel | Navigatie / vertrouwen | `/` | P1; eigen merk consistent maken |
| Website lokaal | website laten maken Apeldoorn, webdesigner Apeldoorn, professionele website Apeldoorn | Commercieel lokaal | `/website-laten-maken-apeldoorn` | P1; lokale relevantie, competitieve markt |
| Website nationaal | professionele website laten maken, website laten bouwen voor bedrijf, bedrijfswebsite op maat | Commercieel | `/website-laten-maken` | P1; breder en competitiever |
| Webshop | webshop laten maken, webshop ontwikkelaar, professionele webshop ontwikkelen | Commercieel | `/webshop-laten-maken` | P1; focus op proces + platformkeuze |
| Shopify | Shopify webshop laten maken, Shopify webshop laten maken kosten, webshop laten maken Shopify | Commercieel / vergelijking | `/webshop-laten-maken` | P1/P2; eigen sectie binnen bestaande pagina, nog geen extra vergelijkbare URL |
| Webshop lokaal | webshop laten maken Apeldoorn | Commercieel lokaal | `/webshop-laten-maken-apeldoorn` | P2; bestaande pagina behouden |
| Software lokaal | softwarebedrijf Apeldoorn, software ontwikkelaar Apeldoorn, maatwerk software Apeldoorn | Commercieel lokaal | `/softwarebedrijf-apeldoorn` | P1; bestaand aanbod sluit aan |
| Software nationaal | maatwerk software laten ontwikkelen, bedrijfssoftware op maat, maatwerk software ontwikkeling | Commercieel | `/maatwerk-software-laten-ontwikkelen` | P1; specifieker maken per echte toepassing |
| Automatiseren | bedrijfsprocessen automatiseren, handmatig werk automatiseren, bedrijfsprocessen automatiseren met AI | Probleem / commercieel | `/processen-automatiseren` | P1; eerst proces, niet AI als belofte |
| API-koppelingen | API koppeling laten maken, systemen koppelen, webshop en boekhouding koppelen | Commercieel | `/api-koppelingen-laten-maken` | P1; concrete scope en beheer onderscheiden |
| Portalen | klantportaal laten bouwen, partnerportaal ontwikkelen, dashboard op maat | Commercieel | `/klantportaal-laten-bouwen` | P1/P2; bestaande demo’s als functioneel bewijs |
| Onderhoud | website onderhoud, website verbeteren, bestaande website laten optimaliseren | Commercieel | `/website-onderhoud-afspreken` | P2; voorkom nieuwe overlappende onderhoudspagina |
| Websitekosten | wat kost een website, website offerte vergelijken | Informatief / koopvoorbereiding | `/inzichten/wat-kost-een-website` | P2; prijsfactoren en scope, geen fictieve tarieven |
| Platformkeuze | Shopify of maatwerk webshop; later Shopify versus WooCommerce | Vergelijkend | `/inzichten/shopify-of-maatwerk-webshop` | P2; WooCommerce alleen bij echte toegevoegde vergelijking |
| API-betekenis | API koppeling betekenis, wat is een API koppeling, API koppeling maken | Informatief | `/inzichten/api-koppelingen-uitgelegd` | P2; doorlink naar API-landingspagina |
| Automatisering afwegen | wanneer automatiseren loont, kosten automatiseren berekenen | Informatief / advies | `/inzichten/wanneer-loont-automatiseren` | P2; rekenmethode toegevoegd |
| Bureaukeuze | websitebureau kiezen Apeldoorn | Vergelijkend lokaal | `/inzichten/website-laten-maken-apeldoorn-bureau-kiezen` | P2; onafhankelijk bruikbare keuzecriteria |
| Softwarepartner kiezen | softwarebedrijf kiezen Apeldoorn | Vergelijkend lokaal | `/inzichten/softwarebedrijf-kiezen-in-apeldoorn` | P2; eigendom, beveiliging en onderhoud |
| Recruitment | recruitmentwebsite, ATS op maat | Niche commercieel | `/branches/recruitment` | P3; uitsluitend koppelen aan bestaande ontwikkelcase |
| E-commercekoppelingen | voorraad koppelen webshop, bestellingen synchroniseren | Niche commercieel | `/branches/e-commerce` | P3; eerst aantonen welke platformen echt worden ondersteund |

Ondersteunende dienstenpagina’s verdiepen ontwerp, bouw en beheer en verwijzen naar deze primaire commerciële pagina’s. Geen identieke tekst tussen nationale en lokale pagina kopiëren. Kijk na 28/56/84 dagen in GSC of twee URL’s voor hetzelfde cluster elkaar afwisselen; pas dan inhoud, interne links of samenvoeging onderbouwd aan.

Bewust niet zonder bewijs targeten: alle Exact/SnelStart/RDW/Nmbrs-koppelingen uit autocomplete, iedere stad uit suggesties, Magento-specifieke expertiseclaims of verzonnen sectorervaring. Een suggestie bewijst geen eigen leveringscapaciteit.

## 4. Lokale SEO en Google Bedrijfsprofiel — concreet voorstel

Nog niet extern aangepast: er is geen profielbeheer beschikbaar.

- Gebruik de echte bedrijfsnaam zoals geregistreerd en gebruikt in de praktijk; voeg geen zoekwoorden/stadsnamen toe aan de profielnaam alleen voor ranking.
- Kandidaat-hoofdcategorie: webdesigner óf softwarebedrijf, afhankelijk van hoofdactiviteit en de daadwerkelijk beschikbare Google-categorie. Secundaire categorieën alleen voor echte diensten. Controleer in het profiel, niet op basis van een verzonnen categorie-ID.
- Apeldoorn is de thuisbasis. Dienstengebied: Apeldoorn, Deventer, Zutphen, Epe, Vaassen, Twello, Arnhem waar dienstverlening praktisch mogelijk is. Geen fictieve nevenvestigingen.
- Als klanten niet aan het bedrijfsadres worden ontvangen: passend dienstengebiedprofiel en adres niet presenteren als bezoeklocatie. Publiceer geen privé-adres om markup te vullen.
- Telefoon, website, juridische naam, KvK en adres moeten overeenkomen met gecontroleerde admin-/bedrijfsgegevens. Openingstijden en bezoekmogelijkheden nog door eigenaar bevestigen.
- Profielwebsite met meetbare maar privacyvriendelijke bronherkenning voorbereiden zodra profieltoegang beschikbaar is; huidige herkomstmeting herkent alleen verwijzende hosts, geen volledig UTM-sessiemodel.
- Foto’s voor profiel: echte werkplek/portret/projectmateriaal waarvan rechten en toestemming vaststaan. De gegenereerde website-sfeerbeelden zijn geen bewijs van een fysieke vestiging.

Voorstel bedrijfsbeschrijving (pas na controle publiceren):

> NiMaGo Digital is een digitale partner uit Apeldoorn voor ondernemers en organisaties. We ontwikkelen websites, webshops en maatwerksoftware en verbinden bestaande systemen met API-koppelingen. Van een bedrijfswebsite tot een klantportaal of een slimmer werkproces: we beginnen bij wat je wilt bereiken. Je hebt rechtstreeks contact met de maker en krijgt duidelijke afspraken over ontwerp, ontwikkeling en beheer. We werken voor bedrijven in heel Nederland; kennismaken kan online of op afspraak in Apeldoorn en omgeving.

Echte reviewaanpak: vraag na een afgeronde opdracht neutraal naar de ervaring, zonder beloning of selectie op tevredenheid. Eigenaar keurt verzoek en ontvanger eerst goed. Gebruik pas de echte reviewlink van het geverifieerde profiel. Voor plaatsing op de website toestemming voor naam/tekst vragen; oorspronkelijke bron bewaren. Geen sterren of AggregateRating voor eigen, niet-geverifieerde verhalen.

Lokale autoriteit: controleer eerst bestaande vermeldingen bij relevante ondernemersverenigingen en lokale netwerken, bespreek echte samenwerkingen en vraag projectvermelding alleen na toestemming. Geen gekochte linkpakketten of massale bedrijvengidsinschrijvingen. Eén werkgebiedpagina is voorlopig zinvoller dan zeven vrijwel identieke plaatsnamenpagina’s.

## 5. Concurrentieonderzoek

Openbare zoekresultaten en pagina’s bekeken op 28 oktober 2026. Dit is geen stabiele Google-ranglijst, marktaandeelmeting of volledige technische audit van concurrenten.

| Bron | Waargenomen positionering / structuur | Kans voor NiMaGo |
|---|---|---|
| [Avancé — website Apeldoorn](https://www.avancecommunicatie.nl/werkgebied/apeldoorn/website-laten-maken/) | Lokale dienstenpagina met proces, keuzecriteria, contact en verwijzingen naar bewijs | Eigen directe aanspreekpunt en concrete scope laten zien; geen certificeringen of reviewcijfers overnemen |
| [IDAS — softwareontwikkeling](https://idas.nl/software-ontwikkeling) | Procesgerichte software, portalen en backofficekoppelingen; duidelijke demo/contactstap | Vertaal eigen portaalfunctionaliteit naar een herkenbaar ondernemersprobleem; beschrijf beheer en eigendom |
| [appiQue](https://appique.nl/) | Heldere softwarepositionering, eigen producten en focus op e-commerce/logistiek | Specialisatie onderbouwen met eigen werk; geen brede lijst technologieën als vervanging van bewijs |
| [Chuck’s — website Apeldoorn](https://www.chuckswebdesign.nl/website-laten-maken-apeldoorn/) | Sterke prijsgerichte propositie, pakketten en aanvraagroute | Concurreer met passende oplossing en transparante scope, niet met een verzonnen laagste prijs |

Technische observatie: de geopende concurrentpagina’s bieden hun kernboodschap en commerciële structuur als leesbare tekst. Hun Google-posities, volledige Core Web Vitals en werkelijke conversies zijn niet beschikbaar. Geen teksten, reviews, klantnamen, prijzen of ontwerpen gekopieerd.

## 6. Content en 90-dagenkalender

Begin met bestaande twaalf gepubliceerde artikelen en vijf reeds geplande artikelen. Geen extra URL maken als een bestaande pagina dezelfde vraag goed kan beantwoorden. Een publicatiedatum is een planning, geen bewijs van expertise. Voor een case zijn goedkeuring, probleem, eigen bijdrage, status en verifieerbare uitkomst nodig.

| Week / datum | Werk / onderwerp | Cluster / vervolgstap | Status / succescriterium |
|---|---|---|---|
| 28 okt–3 nov | Techniek, meting, copy en bestaande automatiseringsuitleg verbeteren | Kernlandingspagina’s → kennismaking/offerte | Deze sessie uitgevoerd; crawl/build/tests beoordelen |
| 4 nov | Webshop starten: bestaande checklist | Webshop → webshoplandingspagina | Al gepland; inhoud/links vóór publicatie controleren |
| 11 nov | Hosting kiezen: bestaande uitleg | Websites / onderhoud | Al gepland; geen onbewezen uptimebeloften |
| 18 nov | Next.js of WordPress | Websiteplatformkeuze | Al gepland; huidige platformmogelijkheden verifiëren |
| 25 nov | AVG en website | Vertrouwen / formulieren | Al gepland; actueel laten toetsen, geen juridisch advies als zekerheid |
| 2 dec | Website-teksten die klanten overtuigen | CRO / website | Al gepland; eigen concrete voorbeeldbriefing toevoegen |
| 9 dec | Bestaand artikel websitekosten verdiepen | Kosten / offerte vergelijken | Redactioneel gepland; scopechecklist in bestaande URL |
| 16 dec | Klantportaal: rollen, eigendom, toegang en beheer | Portalen | Bestaand artikel verdiepen; link naar goedgekeurde demo |
| 23 dec | API-koppeling: storingen, herproberen en monitoring | API | Bestaande uitleg verdiepen; geen extra generiek artikel |
| 30 dec | Resultatenreview en beperkte feestdagenplanning | Alle clusters | Geen automatische campagne; vergelijk alleen beschikbare data |
| 6 jan | Shopify/WooCommerce/maatwerk-keuze | Webshop | Eerst vakinhoudelijke ervaring en actuele platformdocumentatie controleren |
| 13 jan | Eén goedgekeurde projectuitwerking | Software / portalen | Alleen bij toestemming; anders technische eigen demonstratie duidelijk als demo labelen |
| 20–25 jan | Best presterende inhoud bijwerken, nieuwe roadmap | Vraagclusters uit GSC/aanvragen | Geen nieuw artikel zonder zoekintentie en echte inhoudelijke meerwaarde |

Redactionele standaard: direct antwoord, afwegingen, eigen kennis, duidelijke beperkingen, logische headings, relevante interne links, auteur en datum, bron bij veranderlijke technische claims. Geen zoekwoorden stapelen; geen verzonnen ervaringsjaren, klanten, prijzen of procentuele verbeteringen.

## 7. CRO en klantreis

| Stap | Concrete aanpak | Meting |
|---|---|---|
| Binnenkomst uit zoekmachine | Primaire pagina sluit aan op één intentie; title, H1 en intro benoemen de oplossing | Later GSC per query/pagina, nu alleen algemene paginaweergaven |
| Begrijpen | Website, webshop, software en koppelingen in ondernemerstaal; nationale/lokale rol duidelijk | CTA-klikken; inhoudelijke feedback uit echte aanvragen |
| Vertrouwen | Niels als echte oprichter, bestaande demo’s/status, heldere scope en beheer | Casegebruik en aanvraagkwaliteit; geen verzonnen reviewconversie |
| Keuze | Verwijs vanuit dienst/artikel naar passende landingspagina, dan contact/offerte | Klik op commerciële vervolgstap, gescheiden van formulierresultaat |
| Aanvraag | Budget onbekend mag; geen technische kennis nodig; consistente bevestiging | Alleen geslaagde serveropslag telt, geen honeypots/fouten |
| Contact opvolgen | Eigenaar beoordeelt relevantie, dienst en vervolgstap | Kwalificatie nog handmatig; aantal aanvragen is geen aantal nieuwe klanten |

Formulieren behouden bestaande werking en beveiliging. Geen pop-ups, nieuwe marketingcookies of ongevraagde externe berichten. Een algemene bedankmelding is geen bewijs dat er al een voorstel gemaakt is.

## 8. Kanalen en uitvoering

Kosten hieronder zijn planning: eigen tijd, geen gemaakte externe uitgaven of prijsopgaven. Uren zijn inspanningsschattingen.

| Kanaal | Doelgroep / voordeel | Inspanning | Kosten / prioriteit | Echte meetmethode |
|---|---|---|---|---|
| Organische website | Ondernemers met concrete website-/softwarevraag | 2–4 uur per week inhoud en analyse | Eigen tijd; P1 | GSC zodra beschikbaar, daadwerkelijke aanvragen |
| Google Bedrijfsprofiel | Lokale ondernemers met directe intentie | 1–2 uur inrichting, daarna circa 30 min/week | Eigen tijd; P1 na toegang | Profielprestaties en echte contactaanvragen |
| LinkedIn | Mkb-eigenaren, operations, commerciële teams | 1 inhoudelijke conceptpost per week, 1–2 uur | Eigen tijd; P2, externe publicatie pas na akkoord | Werkelijke verwijzingen, gesprekken en relevante aanvragen |
| Cases / portfolio | Oriënterende beslissers | 2–4 uur per goedgekeurde uitwerking | Eigen tijd; P1/P2 | Bereikbare case, relevante vervolgaanvragen |
| Lokaal netwerk / partners | Ondernemers, designers, accountants, IT-partners | 1 passend gesprek/activiteit per maand | Eigen tijd; kosten apart goedkeuren; P2 | Herkomst in intake vastleggen, echte aanbevelingen |
| Referral | Bestaande klanten | Persoonlijk na echt afgerond werk | Geen beloning toegezegd; P2 | Door klant bevestigde verwijzing |
| Instagram | Visuele herkenning en proces | Hergebruik goedgekeurde case, circa 1 uur/week | Eigen tijd; P3 | Relevante websiteverwijzingen en gesprekken, niet alleen likes |
| E-mail | Bestaande relaties / expliciet aangemelde lezers | Eerst consent/inhoud toetsen | Geen acquisitiemails verstuurd; P3 | Echte aanmeldingen/aanvragen, uitschrijven werkend houden |
| Google Ads | Actieve koopintentie | Pas na werkende conversiemeting en goedgekeurde economie | Budget onbekend; P3, niet gestart | Werkelijke kosten per gekwalificeerde aanvraag en gewonnen opdracht |

Concepten voor externe publicatie: (1) een probleem/aanpak/afweging uit een goedgekeurde portal-demo; (2) drie vragen vóór een webshopofferte; (3) de nulmeting waarmee je automatisering afweegt. Geen posts gepubliceerd of berichten verstuurd.

## 9. Meetplan, dashboard en toegang

Nieuw: `/admin/marketing`. De bestaande `/admin/statistieken` blijft beschikbaar.

- Echte paginaweergaven, ontvangen adminaanvragen en offerteaanvragen; geen verzonnen bezoekersaantallen.
- CTA-/telefoon-/e-mailklikken los van formulierresultaten.
- Formulierresultaten pas na serveropslag; DNT/GPC en ontbrekende meetcontext worden gerespecteerd. De administratieve aantallen kunnen daarom afwijken van analytics.
- Herkomstcategorieën op basis van verwijzende host: onvolledige attributie, geen bewijs van organische sessies of AI-vermeldingen.
- Eigen LCP/INP/CLS-metingen met `web-vitals`, geaggregeerd per dag, openbare pagina, meetwaarde en schermcategorie. Geen cookies, IP-opslag, bezoekers-ID of formulierinhoud in marketingtabellen. Queryparameters worden verwijderd. Kleine steekproeven en ontbrekende metingen staan expliciet vermeld.
- P75 uit ontvangen eigen meetwaarden, geen Google CrUX-score. TBT uit Lighthouse is geen INP.
- Geen echte bezoekersconversieratio: de eigen teller identificeert geen bezoekers of sessies. Geen verkeerde deling van aanvragen door paginaweergaven als bezoekersconversie.
- Google-klikken, impressies, gemiddelde posities en GA4-organische sessies blijven “geen gegevens” tot echte koppeling/export beschikbaar is.

Benodigd voor vervolgstap: toegang tot de juiste GSC-property (liefst domeinproperty), gecontroleerde verificatiemethode, GSC-prestatie-export/API-toegang; beheertoegang tot het bestaande Google Bedrijfsprofiel; bij gewenste GA4-integratie een echte property/measurement-ID en een uitgewerkte keuze voor toestemming/consent. Een GA4-ID alleen maakt geen conforme of werkende integratie. De bestaande metadata ondersteunt verificatiecodes, maar codes worden niet verzonnen.

## 10. 90-dagenuitvoering en realistische doelen

Nog geen numeriek groeidoel voor verkeer, posities of leads: daarvoor ontbreekt een zuivere organische nulmeting. Wel harde oplevercriteria voor de techniek en het meten; na de eerste bruikbare 28 dagen een groeidoel onderbouwen met zoekimpressies, klikken, relevante aanvragen en capaciteit/marge van NiMaGo.

| Periode | Actie en prioriteit | Meetbaar resultaat |
|---|---|---|
| Dag 1–7, 28 okt–3 nov | P1 audit, technische fouten, metadata, schema, primaire pagina’s, eigen dashboard | Alle gecontroleerde openbare routes werken; één H1; correcte canonical; geen fictieve markup; geregistreerde geslaagde testaanvragen in geïsoleerde omgeving |
| Dag 8–14, 4–10 nov | P1 GSC/GBP-toegang organiseren; sitemapcontrole; NAP verifiëren | Eigendom/status gedocumenteerd, uitsluitend geverifieerde gegevens gepubliceerd; geen “0 klikken” claim zonder data |
| Dag 15–30, 11–26 nov | P2 inhoud verbeteren, geplande artikelen controleren, eerste echte aanvraagkwaliteit beoordelen | Elk gepubliceerd artikel heeft één passend commerciële vervolglink; geen dubbele primaire zoekwoordtarget; analyse van alle werkelijk ontvangen aanvragen |
| Dag 31–45, 27 nov–11 dec | P2 lokale autoriteit en goedgekeurde case-inhoud | Minimaal één inhoudelijk gecontroleerde case- of demonstratie-uitwerking; geen nieuwe klantclaim zonder toestemming |
| Dag 46–60, 12–26 dec | P2 GSC/aanvragenreview, interne links, mobiele frictie | Vergelijkbare periode en segmenten vastgelegd; verbeteringen gekozen uit echte gegevens, niet alleen rankings in één zoekopdracht |
| Dag 61–75, 27 dec–10 jan | P2 kansrijke clusters uitbreiden; één goedgekeurde organische kanaaltest | Per wijziging eigenaar, hypothese, bron, meting en besluit; geen kosten of externe publicatie zonder akkoord |
| Dag 76–90, 11–25 jan | P1 evaluatie, content bijwerken, volgende 90 dagen | Rapport over indexeerbaarheid, GSC waar beschikbaar, eigen CWV met sampleaantallen, aanvragen en kwalificatie; nieuw onderbouwd groeidoel |

Technische streefwaarden: geen onbedoelde indexblokkade of interne 4xx op primaire pagina’s; LCP ≤2,5 s, INP ≤200 ms en CLS ≤0,1 als veldambitie. Dit zijn geen al gemeten veldresultaten. Behoud huidige premium uitstraling en bestaande functionaliteit.

## 11. Bronnen en grenzen van AI-zichtbaarheid

Geraadpleegd op 28 oktober 2026:

- [Google Search Essentials](https://developers.google.com/search/docs/essentials): nuttige inhoud, crawlbare links en technische basis.
- [Google: AI features and your website](https://developers.google.com/search/docs/appearance/ai-features): gewone SEO en indexeerbare, behulpzame inhoud blijven belangrijk; geen speciale AI-bestanden of gegarandeerde vermelding nodig.
- [Google: sitemap bouwen](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap): canonieke URL’s en waarheidsgetrouwe wijzigingsinformatie.
- [Google: LocalBusiness](https://developers.google.com/search/docs/appearance/structured-data/local-business): passende bedrijfsgegevens en geen verzonnen eigenschappen.
- [Google: lokale vindbaarheid](https://support.google.com/business/answer/7091): relevantie, afstand en bekendheid; geen manier om een positie te kopen of te garanderen.
- [Google: bedrijfsprofielrichtlijnen](https://support.google.com/business/answer/3038177): echte locatie, juiste naam en passend dienstengebied.
- [Google: reviews](https://support.google.com/business/answer/3474122): echte ervaringen, geen beloningen of misleidende beoordelingen.
- [Google: Search Console](https://developers.google.com/search/docs/monitor-debug/search-console-start): verifieer eigendom en controleer echte index-/prestatiegegevens.
- [Next.js: metadata-streaming](https://nextjs.org/docs/app/api-reference/functions/generate-metadata): streaming is niet automatisch fout voor Google; blokkerende metadata helpt eenvoudige head-only parsers maar moet op responstijd gecontroleerd worden.
- [web.dev: Web Vitals](https://web.dev/articles/vitals): veldmetingen onderscheiden van labtests.
- [OpenAI: crawlers](https://developers.openai.com/api/docs/bots): zoekcrawler en trainingscrawler hebben verschillende doelen.

`llms.txt` en bestaande AI-crawlerregels blijven behouden als technische informatievoorziening, niet als bewezen groeimotor. Geen gegarandeerde ChatGPT-, Gemini-, Bing- of AI Overview-vermeldingen. Bestaande FAQ-markup impliceert geen recht op rich results; ondersteunende content moet vooral zichtbaar en inhoudelijk nuttig zijn. Geen extra speciale schema’s of massale AI-artikelen toegevoegd.

## 12. Verificatie en sessielog

28 oktober 2026 — eerste marketinguitvoering:

- Productiecrawl van 63 openbare pagina’s en handmatige beoordeling van architectuur, commerciële templates, formulieren, cases, artikelen en meetketen.
- Zoekwoorden, concurrentie, lokale SEO, kanalen en kalender hierboven vastgelegd; werkelijke suggesties en baseline bewaard.
- Metadata, sitemap, bedrijfsmarkup, commerciële copy, interne links, responsive beeldbestanden en toegankelijkheid aangepast.
- Eigen marketingdashboard, privacyvriendelijke events en eigen Core Web Vitals gebouwd; privacy-/cookiebeleid verduidelijkt. Geen GA4 of externe tracking aangezet.
- Productiebuild en acht nieuwe marketingtests plus tien bestaande boekhoudtests geslaagd in een afzonderlijke testdatabase.
- Mobiele browsercontrole: primaire pagina’s, metadata in de head, Engelse HTML-taal, JSON-LD, dienstbeelden, oorspronkelijke banner, projectgalerij en dashboard gecontroleerd.
- Lokale Lighthouse-controle na wijzigingen: toegankelijkheid 100 en SEO 100. Lokale performance is niet rechtstreeks vergelijkbaar met de live nulmeting.
- Meting end-to-end getest met lokale e-mailpreviews: afgewezen formulieren en honeypots tellen niet, geslaagde contact-/offerte-/afspraakopslag wel; geen formulierconversie via los klikendpoint, geen privé/querydata en correcte DNT/GPC- en origincontrole.
- Gepubliceerd en live gecontroleerd: applicatiecommit `cfbc71f`. Productiebouw geslaagd; alle 63 gecrawlde openbare pagina’s HTTP 200 en precies één H1. Geen defecte interne fragmenten gevonden; 63 unieke socialtitels. Verborgen prijzenpagina, toekomstig artikel en onbekende URL geven correct HTTP 404.
- Live mobiel/desktop: hoofdlandingspagina’s, metadata in head, alle zes dienstbeelden (800px-varianten op mobiel met 2× pixeldichtheid), oorspronkelijke banner en afgeschermd marketingdashboard gecontroleerd. Geen productieformulieren verstuurd.
- [Nameting](docs/marketing/NAMETING-2026-10-28.json): mobiele Lighthouse-labrun performance **98**, toegankelijkheid **100**, SEO **100**, LCP **1.496 ms**, CLS **0**, TBT **49 ms**. De baseline was 97/96/92, LCP 1.422 ms en TBT 120 ms. LCP bleef binnen de labstreefwaarde maar werd niet sneller in deze ene vergelijking; verschillen bewijzen geen structurele verkeers- of conversiegroei.
- Dezelfde nameting registreerde 1.432 ms documentresponstijd; drie latere warme HTML-verzoeken inclusief verbinding/proxy duurden 853, 803 en 387 ms. Dit is geen gecontroleerde TTFB-reeks. Blokkerende metadata blijft een bewuste afweging voor head-only parsers; serverresponstijd in de volgende veldmetingen bewaken.
- [Echte adminmomentopname](docs/marketing/ADMIN-METING-2026-10-28.json): 221 paginaweergaven, 2 ontvangen administratieve aanvragen, 0 offerteaanvragen in de laatste 28 dagen. Herkomst en kwalificatie hiervan zijn niet bewezen; dit zijn geen aan deze SEO-ronde toegeschreven resultaten.
- GSC/GA4/Google Bedrijfsprofiel blijven zonder echte gekoppelde gegevens. De concrete profieltekst, toegangsbehoefte en meetdefinities staan hierboven. Er is geen betaalde campagne gestart en geen extern marketingbericht verstuurd.

Volgende sessie: lees eerst deze roadmap en de actuele bronbestanden; vergelijk met echte GSC/aanvraagdata zodra beschikbaar. Werk alleen verder aan aantoonbare kansen. Publicatie-/toegangsblokkades expliciet vermelden in plaats van resultaten te veronderstellen.


### Aanvulling 28 oktober 2026 — unieke bezoekers en cookiekeuze

- Op verzoek toegevoegd: eigen statistiekcookie met voorafgaande toestemming; de eerdere cookieloze meting hierboven beschrijft de oude situatie. Nieuwe pagina-, klik-, aanvraag- en CWV-metingen vereisen toestemming. Administratieve aanvragen blijven functioneel opgeslagen zonder toestemming.
- Cookievenster in warme huisstijl op Nederlandse en Engelse pagina’s, met gelijkwaardige keuzes, blijvende knop Cookie-instellingen en foutmelding bij mislukte opslag. Geen advertentie- of externe marketingscripts toegevoegd.
- `nm_consent` bewaart de keuze 180 dagen; `nm_visitor` is een willekeurige HttpOnly-code met vaste levensduur van 90 dagen. Server bewaart uitsluitend SHA-256-hash plus eerste/laatste bezoekdag, geen IP of fingerprint. Inactieve records ouder dan 90 dagen worden bij de volgende meting opgeruimd. Intrekken verwijdert cookie en bijbehorend record. DNT/GPC blijven leidend.
- Admin → Marketing toont unieke toestemmende browsers over 28 dagen, startdatum en meetbeperkingen. Geen exacte telling van personen: meerdere apparaten/cookies kunnen dubbeltellen en weigeringen ontbreken. Historische unieke bezoekers zijn niet te reconstrueren. Geen conversieratio met verschillende meetbasissen berekend.
- Cookiebeleid/privacyverklaring aangepast. Geen nieuwe externe kosten of Google-koppeling.
- Verificatie: 19 tests (marketing + boekhouding), productiebuild; lokale mobiele browsertest controleert geen tracking vóór toestemming, weigeren en onthouden, accepteren zonder reload, stabiele cookie bij navigatie, intrekken, DNT en afwijzen van externe origins. Testdata uitsluitend in aparte lokale database.
- Live afgerond: applicatiecommit `c7f002a`, Coolify-deployment `f7hlcyu3zi8l587iipecqnck` geslaagd. Cookievenster en weigering live gecontroleerd: Secure voorkeurcookie, geen statistiekverzoeken vóór/na weigering. Afgeschermd `/admin/marketing` HTTP 200 met unieke-browserkaart, 28-dagenperiode, startdatum en meetbeperkingen. Geen productieformulieren verstuurd en geen kunstmatige toestemmende bezoekers toegevoegd.
