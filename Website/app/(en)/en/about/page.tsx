import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
export const metadata: Metadata = {
  title: "About NiMaGo: a personal digital studio",
  description:
    "The story behind NiMaGo: a personal digital agency that combines creativity and technology.",
};
const V: [string, string][] = [
  ["Personal", "You talk to the people who also build. No layers in between."],
  [
    "Reliable",
    "Clear agreements, honest planning and no surprises afterwards.",
  ],
  ["Creative", "We think along about the solution, not just the assignment."],
  [
    "Accessible",
    "Technology explained in plain language, even when it is complicated.",
  ],
  ["High quality", "Care for detail, in design and in code."],
  ["Future-proof", "We build maintainable, so it grows with your business."],
];
export default function Page() {
  return (
    <>
      <section className="page-hero container">
        <span className="eyebrow">The story behind NiMaGo</span>
        <h1>
          Personally involved. <em>Digitally ahead.</em>
        </h1>
        <p>
          We believe strong technology starts with a good conversation and ends
          with a solution you can build on.
        </p>
      </section>
      <section className="section container about-split small-top">
        <figure className="portrait">
          <img
            src="/images/team/portret-professioneel.webp"
            width="900"
            height="1125"
            alt="Portrait of Niels Maarten Gortel, founder of NiMaGo"
            loading="eager"
          />
        </figure>
        <div className="about-copy">
          <span className="eyebrow">The name behind NiMaGo</span>
          <h2>
            NiMaGo starts with <em>Niels Maarten Gortel.</em>
          </h2>
          <p>
            NiMaGo stands for Niels Maarten Gortel: Ni from Niels, Ma from
            Maarten and Go from Gortel. As the founder, Niels is your direct
            contact from the first conversation through to delivery.
          </p>
          <p style={{ marginTop: 14 }}>
            What drives us is turning complex digital questions into clear, well
            executed solutions. We combine creativity with technical knowledge,
            but stay close to the people we build for.
          </p>
          <div style={{ marginTop: 26 }}>
            <Link href="/en/contact" className="button button-dark">
              Get in touch <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
      </section>
      <section className="container" style={{ paddingBottom: 90 }}>
        <div className="section-head">
          <div>
            <span className="eyebrow">
              <i className="eyebrow-line" />
              What we stand for
            </span>
            <h2>
              Our <em>values.</em>
            </h2>
          </div>
        </div>
        <div className="values">
          {V.map(([t, d]) => (
            <div className="value" key={t}>
              <h3>{t}</h3>
              <p>{d}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
