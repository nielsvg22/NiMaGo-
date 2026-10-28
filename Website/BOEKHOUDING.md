# NiMaGo Boekhouding

Zelfgebouwde administratie in `/admin/boekhouding`, onder de bestaande admin-authenticatie. De bestaande klant- en factuurtabellen blijven behouden; de migratie voegt alleen tabellen toe.

## Wat werkt

- Kwartaaloverzicht op factuurdatum, inclusief definitieve openstaande facturen. Concepten tellen niet mee. Omzet, kosten, resultaatindicatie, btw per verkooppercentage, verlegde omzet en expliciet aangevinkte aftrekbare voorbelasting.
- Uitgaven met leverancier, bonnummer, categorie, nettobedrag en btw. Bonnen als PDF/JPG/PNG tot 8 MB staan onder `DATA_DIR/bookkeeping-receipts`, nooit in `public`. Downloads vereisen een adminsessie. Bestandsnamen worden willekeurig gegenereerd; bestandstype wordt op inhoud gecontroleerd.
- Correctie van uitgaven met verplichte reden. Het oorspronkelijke record en de auditregistratie blijven behouden. Een gekoppelde bankafschrijving gaat terug naar de controlelijst.
- Bankimport via een vast CSV-formaat; unieke combinatie van eigen rekening en banktransactie-ID. Exacte herimport wordt overgeslagen. Eenzelfde ID met gewijzigde gegevens weigert de gehele import. Datums, geldbedragen en aantallen worden gecontroleerd vóór er wordt geschreven.
- Betalingsvoorstellen vereisen een exact factuurnummer als afzonderlijk token, het volledige factuurbedrag, een factuurdatum uiterlijk op de bankdatum en een nog openstaande factuur. Bevestigen koppelt bank en factuur in één SQLite-transactie; betaaldata komen uit de bank. Geen automatische verwerking van onzekere matches, deelbetalingen of gecombineerde factuurbetalingen.
- Afschrijvingen kunnen op exact totaalbedrag aan een geboekte uitgave worden gekoppeld. Privé en interne overboekingen tellen niet als omzet of kosten. Koppelingen kunnen met reden ongedaan worden gemaakt.
- Maand-, kwartaal- en jaarabonnementen genereren conceptfacturen, inclusief achterstallige periodes (maximaal 120 per abonnement per verwerking). De gekozen kalenderdag blijft behouden rond maandultimo en schrikkeljaren. Pauzeren stopt verwerking; hervatten haalt ook achterstanden in. Verwijderde concepten worden niet opnieuw aangemaakt voor dezelfde periode.
- CSV-exports voor facturen, alle uitgaven inclusief correcties, btw-overzicht, bank en wijzigingslogboek. Spreadsheetformules worden geneutraliseerd.
- Reset van testgegevens is geblokkeerd zodra definitieve facturen of boekhoudregistraties bestaan.

## Automatisering

`instrumentation.ts` start in de Node-productieruntime een timer: eerste verwerking na 10 seconden, daarna elke 15 minuten. Verwerking gebruikt een onmiddellijke SQLite-schrijftransactie en een unieke sleutel per abonnement/periode; dubbele timers, meerdere processen en herstarten produceren geen dubbele concepten. Bij downtime worden gemiste periodes na hervatten ingehaald. In de admin kan verwerking ook handmatig gestart worden. De timer stuurt geen e-mails en maakt facturen niet definitief.

De scheduler draait bij `next start` en in de bestaande standalone Docker-container. Hij draait niet in ontwikkelmodus of tijdens de productiebuild. Er is geen externe cron of bank-API nodig.

## Bankbestand

Download het lege sjabloon in de admin. UTF-8, eventueel met BOM, puntkomma als scheidingsteken:

```csv
transactie_id;datum;bedrag;omschrijving;tegenrekening
BANK-UNIEKE-ID;2026-10-28;121,00;Betaling NM-2026-001;NL00VOORBEELD
```

Deze regel is uitsluitend een documentatievoorbeeld, geen echte banktransactie. Negatieve bedragen zijn afschrijvingen. Gebruik een vaste eigen rekeningnaam/IBAN en de oorspronkelijke unieke bank-ID. Banken hebben verschillende exportformaten: zet deze om naar het sjabloon; er wordt geen universele bankkoppeling geclaimd. Maximaal 5.000 regels en 2 MB per import.

## Afbakening

Dit is een operationele administratie met controle en exports. Het is geen grootboek met dubbel boekhouden of een fiscale jaarrekening. Geen OCR, live bankverbinding, automatische e-mails of indiening bij de Belastingdienst. Investeringen/afschrijvingen, loonadministratie, buitenlandse inkoop, KOR, margeregelingen, kasstelsel en andere bijzondere btw-situaties worden niet automatisch geboekt. Verlegde verkopen staan apart, zonder automatisch de aangifterubriek te bepalen. De resultaatindicatie omvat alleen definitieve verkoopfacturen en geboekte zakelijke uitgaven.

## Opslag en verificatie

Productie gebruikt het bestaande persistente volume `/data` via `DATA_DIR`. De bestaande dagelijkse back-up neemt ook de bonbestanden mee (14 dagen retentie). Via Instellingen kan een verse, volledige `.tar.gz`-back-up met consistente SQLite-kopie en alle bonnen worden gedownload. Bewaar die ook buiten de server; een persistent volume op zichzelf is geen back-up. Er zijn geen productiegegevens nodig voor tests.

- `node --test scripts/bookkeeping.test.cjs`: geldbedragen, CSV, herimport/conflicten, factuurmatches, kalenderlogica, idempotente concepten, btw en database-integriteit in een tijdelijke database.
- Productiebouw: `npm run build`.
- Browsercontrole met afzonderlijke `DATA_DIR`, lokaal testwachtwoord en lokale sessies: upload >2 MB, afgeschermde bijlagen, import/herimport, bevestigen/terugzetten, uitgavenmatch, classificatie, abonnementen, exports, desktop en mobiel. Gebruik nooit de productiedatabase of echte e-mailadressen voor deze controle.
