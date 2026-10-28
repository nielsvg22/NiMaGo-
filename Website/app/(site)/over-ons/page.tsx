import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import CTA from "@/components/CTA";
import { company } from "@/lib/company";
import { values } from "@/data/content";
export const metadata: Metadata = {
  title: "Over NiMaGo: persoonlijke digitale studio in Apeldoorn",
  description:
    "Het verhaal achter NiMaGo, een persoonlijke digitale studio in Apeldoorn die creativiteit en techniek combineert. Ontdek wie we zijn en hoe we werken.",
};
export default function Page() {
  return (
    <>
      <section className="page-hero container">
        <span className="eyebrow">Het verhaal achter NiMaGo</span>
        <h1>
          Persoonlijk betrokken.
          <br />
          <em>Digitaal vooruit.</em>
        </h1>
        <p>
          Wij geloven dat sterke techniek begint bij een goed gesprek en eindigt
          bij een oplossing waar je op kunt bouwen.
        </p>
      </section>
      <section className="section container about-split small-top">
        <figure className="portrait">
          <img
            src="/images/team/portret-professioneel.webp"
            width="900"
            height="1125"
            alt="Portret van Niels Maarten Gortel, oprichter van NiMaGo"
            loading="eager"
          />
        </figure>
        <div className="about-copy">
          <span className="eyebrow">De naam achter NiMaGo</span>
          <h2>
            NiMaGo begint bij <em>Niels Maarten Gortel.</em>
          </h2>
          <p>
            NiMaGo staat voor Niels Maarten Gortel: Ni van Niels, Ma van
            Maarten en Go van Gortel. Als oprichter is Niels je directe
            aanspreekpunt, van de eerste kennismaking tot de oplevering.
          </p>
          <p style={{ marginTop: 14 }}>
            Wat ons drijft? Complexe digitale vragen terugbrengen tot heldere,
            goed uitgevoerde oplossingen. We combineren creativiteit met
            technische kennis, maar blijven in alles dichtbij de mensen voor wie
            we bouwen.
          </p>
          <p style={{ marginTop: 14 }}>
            We bouwen websites, webshops, portalen en platforms, en koppelen
            systemen aan elkaar. Van ontwerp tot onderhoud, zodat je één
            aanspreekpunt hebt.
          </p>
          <div style={{ marginTop: 26 }}>
            <Link href="/projecten" className="button button-dark">
              Bekijk ons werk <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
      </section>
      <section className="section container" style={{ paddingTop: 0 }}>
        <div className="section-head">
          <div>
            <span className="eyebrow">
              <i className="eyebrow-line" />
              Waar we voor staan
            </span>
            <h2>
              Onze <em>waarden.</em>
            </h2>
          </div>
          <p>Zo werken we, bij elk project en in elk gesprek.</p>
        </div>
        <div className="values">
          {values.map(([t, d]) => (
            <div className="value" key={t}>
              <h3>{t}</h3>
              <p>{d}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="container" style={{ paddingBottom: 50 }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link href="/team" className="button button-outline-dark">
            Ons team
          </Link>
          <Link href="/werkgebied" className="button button-outline-dark">
            Werkgebied
          </Link>
          <Link href="/afspraken" className="button button-outline-dark">
            Onze afspraken
          </Link>
        </div>
      </section>
      <section className="container section small-top" aria-labelledby="feiten">
        <h2 id="feiten" style={{ fontSize: 28, margin: "0 0 14px" }}>NiMaGo in het kort</h2>
        <p style={{ maxWidth: "68ch", color: "var(--muted)" }}>
          NiMaGo (handelsnaam {company().name}) is een digitale studio in {company().city || "Apeldoorn"}, opgericht door Niels Maarten Gortel. We bouwen websites, webshops, maatwerk software en koppelingen voor ondernemers en organisaties in heel Nederland, grotendeels online en op afspraak op locatie.
        </p>
        <ul className="contact-facts">
          <li><b>Oprichter</b> Niels Maarten Gortel</li>
          <li><b>Vestiging</b> {[company().city || "Apeldoorn", "Gelderland"].join(", ")}</li>
          <li><b>Diensten</b> websites, webshops, maatwerk software, koppelingen en automatisering, design en onderhoud</li>
          {company().kvk && <li><b>KvK</b> {company().kvk}</li>}
          <li><b>Contact</b> <Link className="text-link" href="/contact">formulier en gegevens</Link></li>
        </ul>
      </section>
      <CTA />
    </>
  );
}
