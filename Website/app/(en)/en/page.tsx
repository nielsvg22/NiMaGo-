import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
export const metadata: Metadata = {
  title: "NiMaGo | Digital ideas. Strongly executed.",
  description:
    "NiMaGo builds websites, web shops, custom software and smart integrations for businesses in the Netherlands and beyond. Personal, creative and technically strong.",
  alternates: { languages: { nl: "/", en: "/en" } },
};
const services: [string, string][] = [
  ["Websites", "A site that tells your story and works well on every screen."],
  [
    "Web shops",
    "A shopping experience where design and conversion come together.",
  ],
  ["Custom software", "Tools that fit how your organisation really works."],
  [
    "Integrations & automation",
    "Less double work. Systems that talk to each other.",
  ],
  ["Design & branding", "A clear digital identity that fits your ambition."],
  ["Maintenance & growth", "Technology keeps moving. We stay involved."],
];
const steps: [string, string][] = [
  [
    "Get to know each other",
    "We listen, ask questions and make your ambitions concrete.",
  ],
  ["Proposal", "A clear plan with scope, approach and agreements."],
  ["Design", "We make structure and experience tangible."],
  ["Build", "We develop, test and align with you regularly."],
  ["Live & beyond", "We deliver carefully and keep thinking along."],
];
export default function Page() {
  return (
    <>
      <section className="hero">
        <div className="container hero-content">
          <div className="hero-copy">
            <span className="eyebrow">
              <i className="eyebrow-dot" /> Digital solutions with care
            </span>
            <h1>
              Digital ideas.
              <br />
              <em>Strongly executed.</em>
            </h1>
            <p>
              We build websites, web shops and smart software that are not just
              beautiful, but above all work well. Personal, creative and
              technically strong.
            </p>
            <div className="hero-actions">
              <Link href="/en/contact" className="button button-primary">
                Get in touch <ArrowUpRight size={19} />
              </Link>
              <Link href="/en/services" className="button button-outline">
                Our services
              </Link>
            </div>
          </div>
          <div className="hero-visual">
            <figure className="hero-photo">
              <img
                src="/images/bedrijfsbeelden/03-the-move-maker-op-laptop.webp"
                width="1440"
                height="1080"
                alt="Laptop displaying The Move Maker recruitment website, a NiMaGo project"
              />
            </figure>
          </div>
        </div>
      </section>
      <section className="section container">
        <div className="section-head">
          <div>
            <span className="eyebrow">
              <i className="eyebrow-line" />
              What we do
            </span>
            <h2>
              A great solution that <em>truly works.</em>
            </h2>
          </div>
          <p>
            From your first online business card to a platform that saves time
            every day.
          </p>
        </div>
        <div className="values">
          {services.map(([t, d]) => (
            <div className="value" key={t}>
              <h3>{t}</h3>
              <p>{d}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="container" style={{ paddingBottom: 80 }}>
        <div className="section-head">
          <div>
            <span className="eyebrow">
              <i className="eyebrow-line" />
              How we work
            </span>
            <h2>
              From first conversation to <em>strong launch.</em>
            </h2>
          </div>
        </div>
        <ol
          className="timeline dark-on-light"
          style={{ gridTemplateColumns: "repeat(5,1fr)" }}
        >
          {steps.map(([t, d], i) => (
            <li key={t}>
              <span className="tl-dot">{i + 1}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </li>
          ))}
        </ol>
      </section>
      <section className="container cta-wrap" style={{ paddingTop: 0 }}>
        <div className="process-panel" style={{ textAlign: "center" }}>
          <span className="eyebrow">Let’s build something good</span>
          <h2 style={{ margin: "12px auto 14px", maxWidth: "20ch" }}>
            Got an idea? <em>We’ll think along.</em>
          </h2>
          <p
            style={{
              color: "#E9D2CA",
              margin: "0 auto 26px",
              maxWidth: "52ch",
            }}
          >
            Tell us what you’re running into or what you want to achieve. No
            obligation, no sales pitch.
          </p>
          <Link href="/en/contact" className="button button-primary">
            Contact us <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}
