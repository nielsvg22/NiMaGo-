import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import CTA from "@/components/CTA";
import { values } from "@/data/content";
export const metadata: Metadata = {
  title: "Over ons",
  description:
    "Het verhaal achter NiMaGo: een persoonlijk digitaal bureau dat creativiteit en techniek combineert. Ontdek wie we zijn en hoe we werken.",
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
      <CTA />
    </>
  );
}
