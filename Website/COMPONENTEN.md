# NiMaGo website — componenten en routes

## Componenten
- `components/Brand.tsx` — schaalbaar NiMaGo-logo met correcte lichte/donkere variant.
- `components/Header.tsx` — responsive hoofdnavigatie met mobiele menuknop.
- `components/Footer.tsx` — secundaire navigatie en juridische links.
- `components/ServiceGrid.tsx` — zes dienstencards, gekoppeld aan `data/site.ts`.
- `components/ProjectGrid.tsx` — duidelijk gemarkeerde fictieve conceptprojecten.
- `components/CTA.tsx` — herbruikbare contactsectie.
- `components/ContactForm.tsx` — interactieve invoer, validatie en duidelijke feedback.
- `app/api/contact/route.ts` — server-side controle en verzenden via Resend na configuratie.

## Ontwerpregels
- Primaire knop: #93584D met wit; zachte radius en hover.
- Lichte basis: #FAF7F3, roze accenten #F2B5A7 en #F8DDD5.
- Formulieren: labels, required-attributen, focusstijlen, statusfeedback.
- Cards: 23–32px radius, subtiele lijnen en zachte schaduw.
- Alle mediaqueries in `app/globals.css`; ondersteunt `prefers-reduced-motion`.

## Routes
- `/`, `/diensten`, `/diensten/[slug]`, `/projecten`, `/projecten/[slug]`
- `/over-ons`, `/werkwijze`, `/contact`, `/faq`
- `/privacyverklaring`, `/cookiebeleid`, `/algemene-voorwaarden`
- `/api/contact` (POST, pas echt verzendend na Resend-configuratie)

## Belangrijk
`preview/index.html` is een *statische* homepagepresentatie. De echte site gebruikt Next.js; publiceer die uitsluitend na installatie, testen, privacy/juridische controle en configuratie van het formulier.
