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
