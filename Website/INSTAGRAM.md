# Instagram op eigen hosting — Windsor.ai

Deze module gebruikt de officieel gedocumenteerde Windsor MCP-server op `https://mcp.windsor.ai/` met een server-side Bearer API-key. Windsor beheert de Meta/Instagram OAuth-tokens. De eigen Next.js-server beheert media, concepten, goedkeuring, kalender, wachtrij en verzending. Een eigen Meta-app is voor deze route niet nodig. De directe Instagram Login-route is niet geactiveerd; de gebruiker koos na de Meta-setupproblemen voor Windsor.

## Inrichten

1. Koppel het echte professionele Instagram-account bij Windsor. De module accepteert uitsluitend het door de eigenaar gekoppelde `@nimagodigital` (account-ID vastgezet in `lib/instagram/store.ts`).
2. Open `/admin/marketing/instagram` en sla de Windsor API-key in het wachtwoordveld op. Een alternatief is de servervariabele `WINDSOR_API_KEY`; de omgeving gaat dan voor. Deel sleutels niet via frontendcode of git.
3. Klik **Test zonder publicatie**. Dit leest accounts en actiedefinities via Windsor en controleert de accountidentiteit. Het maakt geen mediacontainer en plaatst geen bericht. Een geslaagde leestest bewijst niet dat schrijven bij Windsor aan staat of dat een bepaalde post zal worden geaccepteerd.
4. Voor openbaar schrijven moeten Write actions in het Windsor-account toegestaan zijn. Dat wordt niet automatisch ingeschakeld door deze app. Account- en Meta-goedkeuringen worden door de Windsor-koppeling afgehandeld; eventuele blokkades blijven van toepassing.
5. Upload eigen media, schrijf caption/hashtags en kies desgewenst een publicatietijd. De editor gebruikt expliciet **Europe/Amsterdam**, ook als de browser een andere tijdzone heeft. Niet-bestaande en dubbele DST-tijden worden geweigerd.
6. Bekijk het volledige voorbeeld met alle beelden in volgorde en keur dat bericht goed.

## Veilige standaard en eenmalige test

- Nieuwe installatie: automatisch publiceren **uit**, openbaar publiceren **geblokkeerd**, goedkeuring per bericht **aan**.
- Opslaan en de verbindingstest publiceren niets. Vervangen van de sleutel pauzeert automatisch publiceren en maakt de verbindingstest ongeldig.
- De eigenaar kan in het volledige voorbeeld één exact bericht onmiddellijk publiceren na checkbox en het woord `PUBLICEREN`. Dit verandert geen globale kalenderinstelling en verwerkt geen andere berichten.
- Voor automatische publicatie zijn de globale openbare toestemming, automatische schakelaar, geldige serververbinding en (standaard) goedkeuring per bericht nodig. De toestemmingsdatum wordt vastgelegd. Bij uitschakelen van goedkeuring mogen alle ingeplande berichten volgens de expliciete globale toestemming worden verwerkt; dit staat bij de schakelaar uitgelegd.
- Bewerkingen veranderen de revisie en laten de goedkeuring vervallen. Oude geopende formulieren kunnen geen nieuwere inhoud overschrijven of goedkeuren. Herhaald indienen van hetzelfde nieuwe formulier maakt één concept.
- Concepten zonder datum worden nooit automatisch gepubliceerd. Berichten die meer dan zes uur te laat zijn worden geblokkeerd voor handmatige herplanning.

## Achtergrondverwerking

`instrumentation.ts` start in productie één timer per Node-proces: eerste controle na 15 seconden, daarna elke minuut. Dit werkt zolang het hostingproces draait en vereist geen Codex- of browsersessie. In Next-builds wordt de timer niet gestart. De bestaande boekhoud- en back-uptimers blijven behouden.

De wachtrij staat in SQLite onder het persistente `DATA_DIR`. Een databaselease voorkomt gelijktijdige verwerking tussen processen. Vlak vóór verzending worden toestemming, account, sleutel, revisie en lease opnieuw gecontroleerd; een atomaire statusovergang geeft één lokale verzendclaim. Er is geen door Windsor gedocumenteerde idempotency-key voor deze acties: precies-eenmaal afleveren bij de externe dienst kan daarom niet worden gegarandeerd.

Voorcontroles kunnen veilig opnieuw worden geprobeerd met oplopende wachttijd, maximaal vijf mislukkingen. **Na het versturen van een schrijfactie wordt een onzekere uitkomst nooit automatisch herhaald.** Na een crash tijdens verzending wordt het bericht onzeker. De beheerder controleert Instagram/Windsor en bevestigt met een directe Instagram-postlink, of sluit het bericht zonder nieuwe verzending af. Pauzeren kan een al verzonden externe opdracht niet terughalen.

## Media

- Uploads alleen voor ingelogde admin, met origincontrole en limiet; geen willekeurige externe URL-fetch en geen gebruikerspaden.
- JPG/PNG/WebP tot 12 MB input: Sharp decodeert, verwijdert metadata en maakt JPG, maximaal 1080 px breed. Minimaal 320 px breed, verhouding 4:5–1,91:1, maximaal 8 MB output.
- Carrousel: 2–10 unieke JPG’s in expliciet gekozen volgorde. De huidige Windsor-actie ondersteunt geen videocarrousels.
- Reels: MP4/MOV tot **100 MB app-limiet**, 3–900 seconden, H.264/HEVC, eventuele audio AAC, 23–60 fps, maximaal 1920 px breed/3840 px hoog. 9:16 aanbevolen. Dit is een bewust kleinere uploadlimiet dan Windsors maximum; er wordt niet automatisch getranscodeerd. Docker installeert ffmpeg/ffprobe. Metadata wordt met ffprobe op lokale bestanden en zonder netwerkprotocollen gecontroleerd.
- Streaming upload voorkomt dat een hele video eerst in het Node-geheugen geladen wordt. Private bestanden staan in `/data/instagram-media` met willekeurige namen en bestandsrechten 0600. Zonder adminsessie zijn ze alleen bereikbaar met een HMAC-ondertekende URL die bij verzending wordt aangemaakt en 72 uur geldig is. De mediaroute ondersteunt byte ranges voor video en geeft noindex/no-store terug.
- Caption maximaal 2.200 Unicode-tekens, maximaal 30 hashtags. Meta/Windsor blijven de definitieve technische en beleidsmatige acceptatie uitvoeren. De server voegt geen muziek, commerciële rechten of AI-content toe.

## Statussen en logging

Concept, ingepland, wordt verstuurd, gepubliceerd, controleer publicatie, onzeker, voorcontrole mislukt, geannuleerd en opnieuw plannen. Een generiek Windsor-antwoord wordt niet als bewezen openbare publicatie gepresenteerd: zonder expliciete media-uitkomst/link blijft handmatige verificatie nodig. Logs bevatten statusgebeurtenissen, geen sleutels, tokens of onbewerkte providerfoutresponsen. De recente kalender toont maximaal 250 aangemaakte berichten; het dashboard vermeldt deze grens.

## Versleuteling, back-up en herstel

- Windsor-key versleuteld met AES-256-GCM, unieke nonce en aanvullende authenticatie. Geen plaintext in database, React-props, URLs of foutlogs.
- Optioneel `INSTAGRAM_TOKEN_ENCRYPTION_KEY`: exact 32 willekeurige bytes als base64. Zonder deze omgeving wordt eenmaal `/data/instagram-encryption.key` aangemaakt met rechten 0600. Deze sleutel blijft op het persistente volume en wordt niet uit het databasebestand afgeleid.
- De bestaande dagelijkse databaseback-ups en volledige downloadbundel bevatten nu ook de onveranderlijke Instagram-media. De decryptiesleutel wordt **niet** in dezelfde downloadbundel gestopt. Bewaar deze bij serverbeheer apart, of bewaar de ingestelde omgevingssleutel veilig. Zonder oorspronkelijke sleutel moet bij herstel de Windsor-key opnieuw ingevoerd worden. Een gestolen databaseback-up alleen bevat dus niet direct de ontcijferingssleutel.
- `INSTAGRAM_PUBLIC_URL` optioneel: vaste publieke HTTPS-origin; standaard `https://nimagodigital.nl`. Geen willekeurige host uit een inkomend verzoek.
- Verwijderen van de lokale koppeling verwijdert de lokale Windsor-key, pauzeert verwerking en verwijdert lokale accountstatus. Het trekt de externe Windsor/Meta-toestemming niet in; daarvoor gebruikt de eigenaar het externe account. Sleutels uit `WINDSOR_API_KEY` worden via de hostingomgeving beheerd.

## Verificatie

`node --test scripts/instagram.test.cjs scripts/marketing.test.cjs scripts/bookkeeping.test.cjs` gebruikt afzonderlijke tijdelijke databases. Publicatie-adapters worden alleen binnen deze automatische tests vervangen. De productiecode gebruikt uitsluitend de echte Windsor-adapter. Tests dekken versleuteling/tampering, DST, captions/media, revisies, toestemming, gelijktijdigheid, stop tijdens voorcontrole, onzekerheid, crash, backoff, eenmalige publicatie, accountbinding en echte image/video-validatie. Production build en browsercontrole aanvullend uitvoeren.

Geen AI-generatie, TikTok, bereik-/engagementdashboard of volledige campagne toegevoegd in deze eerste module. Deze onderdelen uit de bredere masterprompt volgen afzonderlijk; er worden geen statistieken of gegenereerde media gesimuleerd.

## Officiële bronnen, gecontroleerd 29 oktober 2026

- https://mcp.windsor.ai/docs — MCP-transport, Bearer API-key, connectoren en acties.
- https://windsor.ai/api-documentation/ — eigen software mag acties aanroepen; schrijfbevoegdheid vereist.
- https://windsor.ai/documentation/windsor-mcp/write-actions/ — beeld-, carrousel- en Reel-voorwaarden.
- Live `get_connectors` en `list_actions` voor de gekoppelde Instagram-connector — daadwerkelijke account-ID, actienamen, velden en JSON-schema’s. De server leest die opnieuw bij iedere voorcontrole.
- https://www.postman.com/meta/instagram/folder/1z5vxzu/instagram-api-with-instagram-login — officiële Meta-collectie, professionele accounts en scopeverschillen. Rechtstreekse developers.facebook.com-pagina’s gaven tijdens eerder onderzoek 429; geen definitieve appreviewgoedkeuring voor een eigen Meta-app geclaimd.

## Oplevering 29 oktober 2026

Productiecommit `95bdc42`. Echte serververbinding getest. Eén door de eigenaar exact goedgekeurde afbeeldingspost vanuit deze backend gepubliceerd en via Instagram-media-uitvoer geverifieerd: https://www.instagram.com/p/DfE5pKcjUR0/. Het aanvankelijke generieke schrijfantwoord kreeg veilig de status 'controleer publicatie'; na bevestiging van media-ID, caption en permalink is de link in de admin vastgelegd.

Op verzoek een eerste kalender ingevuld: 2–15 november, zeven berichten (vijf afbeeldingen, twee carrousels), allemaal met echte media en captions, zonder goedkeuring en zonder ingeschakelde automatische/openbare publicatie. 38 tests, productiebuild en browsercontroles geslaagd. Reels en carrousels zijn niet publiek als aanvullende tests geplaatst.

## Eenmalige geplande toestemming

Naast direct publiceren kan een beheerder één exact bericht voor één gepland tijdstip autoriseren. De databasegrant is gebonden aan bericht-ID, inhoudsrevisie en tijdstip. De eigen scheduler verwerkt dat bericht ook als de brede automatische kalenderstand uit staat. Wijzigen van inhoud/planning maakt de grant ongeldig; vervangen/verwijderen van de serversleutel verwijdert alle grants. De admin vermeldt actieve grants expliciet. **Alles pauzeren** trekt zowel brede automatische toestemming als afzonderlijke grants in. Al verzonden opdrachten kunnen nog afronden. Andere ongekeurde kalenderberichten worden hierdoor niet vrijgegeven.
