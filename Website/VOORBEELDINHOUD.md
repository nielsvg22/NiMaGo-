# Voorbeeldinhoud: wat is verzonnen en waar pas je het aan

Alles hieronder is **verzonnen voorbeeldinhoud** om de site compleet te laten ogen. Vervang het door je eigen gegevens voordat je de site echt live zet en op indexeren zet. Bezoekers zien een klein label "Voorbeeld" bij deze onderdelen; zet dat uit in de admin bij Instellingen > Voorbeeldinhoud zodra je klaar bent.

| Onderdeel | Waar | Bestand |
|---|---|---|
| Klantreviews (namen, bedrijven, teksten) | Home, Over ons | `data/samples.ts` (`reviews`) |
| Teamleden (rollen en bio's) | /team | `data/samples.ts` (`team`) |
| Pakketten en onderhoudsprijzen | /prijzen | `data/samples.ts` (`packages`, `care`) |
| Rekenhulp (bedragen en toeslagen) | /prijzen | `components/PriceCalculator.tsx` |
| Werkgebied en stadspagina's | /werkgebied | `data/samples.ts` (`cities`) |

Let op:
- Echte klantreviews mag je alleen tonen met toestemming van de klant. Verzonnen reviews presenteren als echt is misleidend en in Nederland niet toegestaan.
- De bedragen komen uit `Strategie/02_Diensten_pakketten_en_prijzen.md` en zijn aannames.
- Contactgegevens, KvK, btw-id en IBAN zijn **niet** verzonnen. Vul ze in bij Instellingen in de admin.
