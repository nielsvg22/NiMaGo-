# NiMaGo — website

Responsieve Next.js App Router website met React, TypeScript en losse componenten. **Geen fictieve testimonials of nep-formulier.**

## Starten

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. `npm run build` maakt een productiebuild. Node 20+ aanbevolen.

## Gereed voor ontwerpbeoordeling
- Home, diensten + zes detailpagina's, drie conceptprojecten + details, over ons, werkwijze, contact, FAQ, juridische conceptpagina's en 404.
- Realtime responsive UI, toegankelijk toetsenbordmenu, reduced-motion, semantische opmaak, sitemap en robots.
- Centrale teksten in `data/site.ts`, stijl in `app/globals.css` en vectorlogo's onder `public/logos`.
- API-contactroute heeft echte servervalidatie en verzendt via Resend **alleen** na correcte configuratie. Zonder configuratie geeft het een duidelijke foutmelding; er wordt nooit gedaan alsof mail verstuurd is.

## Voor daadwerkelijke livegang VERPLICHT
1. Controleer juridische/handelsnaam- en domeinrechten, registreer domein, voeg werkelijke bedrijfsgegevens toe.
2. Zet `NEXT_PUBLIC_SITE_URL`, `RESEND_API_KEY`, `CONTACT_TO_EMAIL` en `CONTACT_FROM_EMAIL` en verifieer het domein bij provider. Test ontvangst, reply-to, foutpad, SPF/DKIM/DMARC.
3. Voeg productiegeschikte server-side rate limiting, abuse-bescherming en monitoring toe. De honeypot is slechts een basisfilter.
4. Laat privacy, cookie en voorwaarden beoordelen en vul ze met de werkelijke verwerkingen/contracten in.
5. Pas `robots.ts` en `metadata.robots` van `noindex` naar indexeren pas ná afronding. Controleer sitemap, social OG-afbeelding, toegankelijkheid en Core Web Vitals.
6. Google Fonts wordt nu extern via CSS geladen; host ze privacybewust lokaal na verkrijging van de juiste licentie of gebruik uitsluitend het systeemfont.
7. Voeg echte klantcases uitsluitend na toestemming toe. Placeholdercontactgegevens NIET gebruiken.

## Projectmappen
`app/` routes en pagina's; `components/` hergebruik; `data/site.ts` centrale copy; `public/images/` merkvisual; `public/logos/` schaalbare SVG/PNG.

Deze starter is nog niet live gepubliceerd en is niet vooraf door een externe pentest gegaan.


## Admin (facturen, klanten, berichten)
Op `/admin` staat een beveiligde beheeromgeving.

- **Inloggen:** wachtwoord uit de omgevingsvariabele `ADMIN_PASSWORD` (minimaal 10 tekens). Zonder deze variabele is de admin uitgeschakeld. Sessies zijn 12 uur geldig (ondertekende, httpOnly-cookie) en inlogpogingen worden afgeremd.
- **Instellingen:** vul eerst je bedrijfsgegevens in (naam, adres, KvK, btw-id, IBAN). Die komen op de facturen én in de footer, de contactpagina en de juridische teksten van de site.
- **Klanten en facturen:** concept maken, definitief maken (dan krijgt de factuur een doorlopend nummer, bv. NM-2026-001, en is hij vergrendeld), als betaald markeren en als PDF downloaden in de NiMaGo-huisstijl. Btw 21%, 9%, 0% of verlegd.
- **Berichten:** het contactformulier op de site slaat berichten op in de admin. Een e-mailmelding via Resend is optioneel.
- **Opslag:** SQLite in `DATA_DIR` (op de server `/data`). Koppel hier een persistent volume aan en maak er back-ups van; zonder volume verdwijnen de gegevens bij elke nieuwe deploy.

### E-mail (SMTP)
Meldingen en klantmails gaan via de mailbox bij je hosting. Zet in Coolify: `SMTP_HOST` (bijv. `web209.your-webhost.nl`), `SMTP_PORT` (465), `SMTP_USER` (`info@nimagodigital.nl`), `SMTP_PASS`, optioneel `MAIL_FROM` en `NOTIFY_TO` (standaard het e-mailadres uit Instellingen). Zonder deze variabelen worden er geen mails verstuurd en blijft alles werken.
Naar jou: contactbericht, offerte-aanvraag, website-check, nieuwe afspraak, nieuw klantaccount, klantbericht, offerte geaccepteerd/afgewezen. Naar klanten: bevestiging van een afspraakaanvraag, account geactiveerd, offerte klaar, nieuw bericht, project-update.

### Klantportaal (`/account`)
Klanten maken zelf een account aan (`/account/registreren`). Pas als jij het account in **Admin → Klantaccounts** aan een klant koppelt, ziet de klant zijn eigen offertes, projecten, afspraken, facturen en berichten. Dat is bewust: e-mailadressen worden niet geverifieerd, dus koppelen gebeurt na jouw controle.

- **Offertes:** Admin → Offertes (zelfde opzet als facturen, nummer OF-JJJJ-NNN). Met *Verstuur naar portaal* wordt de offerte zichtbaar; de klant kan accepteren (naam + vinkje) of afwijzen. Een geaccepteerde offerte maak je met één klik een conceptfactuur.
- **Projecten:** fase (7 stappen), voortgang in %, updates (zichtbaar of intern) en berichten per project.
- **Afspraken:** plan een afspraak voor een klant in Admin → Agenda; ook kennismakingen met het e-mailadres van de klant verschijnen in het portaal.
- **Berichten:** klanten schrijven via het portaal; antwoord in Admin → Klantberichten. Acceptatie/afwijzing van een offerte komt daar ook binnen.
- **Beveiliging:** wachtwoorden met scrypt, aparte sessiecookie `nm_acct` (14 dagen), nieuw wachtwoord beëindigt alle sessies, inlog- en registratielimiet, elke vraag is gefilterd op de gekoppelde klant (geen toegang tot andermans id's), PDF's alleen voor eigen definitieve documenten. Het portaal werkt alleen als `ADMIN_PASSWORD` (of `SESSION_SECRET`) is ingesteld.
- Er worden geen e-mails verstuurd; meldingen verschijnen in de admin.

Controleer facturen, btw-regime en voorwaarden met je boekhouder voordat je ze gebruikt.
