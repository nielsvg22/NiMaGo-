import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  ArrowRight,
  Check,
  Users,
  Zap,
  Gem,
  MessagesSquare,
  MessageCircle,
  FileText,
  PenTool,
  Code2,
  Rocket,
} from "lucide-react";
import ServiceGrid from "@/components/ServiceGrid";
import ProjectGrid from "@/components/ProjectGrid";
import { Hills } from "@/components/Art";
import { photo } from "@/lib/photo";
import { steps, site } from "@/data/site";
import Faq from "@/components/Faq";
import ArticleCard from "@/components/ArticleCard";
import { articles } from "@/data/articles";
import { techGroups } from "@/data/pages";
import { faqs } from "@/data/content";
export const metadata: Metadata = {
  title: "Websites en software voor jouw volgende stap",
  description:
    "Je bedrijf gaat vooruit. NiMaGo bouwt websites, webshops en maatwerksoftware voor ondernemers en groeiende teams. Bespreek vrijblijvend jouw volgende stap.",
};
const trust = [
  [Users, "Direct met de makers", "Jouw vraag komt bij de mensen die bouwen"],
  [Zap, "Minder handwerk", "Meer ruimte voor klanten en je bedrijf"],
  [Gem, "Helder voorstel", "Scope, planning en kosten vooraf in beeld"],
  [
    MessagesSquare,
    "Ook na livegang",
    "Onderhoud en doorontwikkeling in overleg",
  ],
] as const;
const stepIcons = [MessageCircle, FileText, PenTool, Code2, Rocket];
const checks = [
  "Direct contact met de makers",
  "Een voorstel met duidelijke scope",
  "Regelmatig meekijken en bijsturen",
  "Onderhoud en hulp na oplevering",
];
const challenges = [
  {
    n: "01",
    audience: "Voor ondernemers en dienstverleners",
    title: "Je bedrijf is verder dan je website.",
    problem:
      "Je levert goed werk. Maar online is nog niet duidelijk waarom klanten juist jou moeten kiezen.",
    solution:
      "Een website die je verhaal scherp vertelt, vertrouwen opbouwt en de stap naar contact makkelijk maakt.",
    href: "/website-laten-maken",
    link: "Geef je bedrijf de juiste uitstraling",
  },
  {
    n: "02",
    audience: "Voor webshops en groeiende teams",
    title: "Je wilt groeien. Het handwerk groeit mee.",
    problem:
      "Bestellingen overtypen, gegevens bijwerken, lijstjes bijhouden. Het kost tijd die je liever aan je klanten besteedt.",
    solution:
      "Een webshop en koppelingen die verkoop, voorraad en administratie beter laten samenwerken.",
    href: "/processen-automatiseren",
    link: "Ontdek waar het slimmer kan",
  },
  {
    n: "03",
    audience: "Voor bedrijven met eigen processen",
    title: "Alles staat ergens. Het overzicht ontbreekt.",
    problem:
      "Je schakelt tussen spreadsheets, mailboxen en losse systemen om te weten hoe het ervoor staat.",
    solution:
      "Een portaal of maatwerkapplicatie die informatie en taken samenbrengt op één logische plek.",
    href: "/klantportaal-laten-bouwen",
    link: "Breng rust in je processen",
  },
];
export default function Home() {
  return (
    <>
      <section className="hero home-hero">
        <div className="container hero-content">
          <div className="hero-copy">
            <span className="eyebrow">
              <i className="eyebrow-dot" /> Voor ondernemers en groeiende teams
            </span>
            <h1>
              Je bedrijf gaat vooruit.
              <br />
              <em>Nu je website en software nog.</em>
            </h1>
            <p>
              Een website die laat zien wat je waard bent. Een webshop die
              prettig verkoopt. Software die het handwerk overneemt. NiMaGo
              ontwerpt en bouwt wat jouw volgende stap mogelijk maakt.
            </p>
            <div className="hero-actions">
              <Link href="/kennismaking" className="button button-primary">
                Bespreek jouw volgende stap <ArrowUpRight size={19} />
              </Link>
              <Link href="/projecten" className="button button-outline">
                Bekijk wat we bouwen <ArrowRight size={18} />
              </Link>
            </div>
            <p className="home-hero-note">
              Vrijblijvend kennismaken. Direct met de mensen die het maken.
            </p>
          </div>
          <div className="hero-visual">
            <figure className="hero-photo">
              <img
                src="/images/hero-herfst.jpg"
                width="696"
                height="714"
                fetchPriority="high"
                alt="Laptop en telefoon met een NiMaGo-websiteontwerp op een houten bureau in warm herfstlicht"
              />
              <figcaption className="home-visual-caption">
                <span>Van eerste indruk tot dagelijks gebruik</span>
                <strong>
                  Mooi om te zien.
                  <br />
                  Gemaakt om voor je te werken.
                </strong>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>
      <section
        className="container trust-wrap"
        aria-label="Waar NiMaGo voor staat"
      >
        <ul className="trust">
          {trust.map(([I, t, d]) => (
            <li key={t}>
              <span className="trust-ico">
                <I size={22} strokeWidth={1.6} />
              </span>
              <div>
                <b>{t}</b>
                <span>{d}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <section
        className="section container home-challenges"
        aria-labelledby="challenges-title"
      >
        <div className="section-head">
          <div>
            <span className="eyebrow">
              <i className="eyebrow-line" /> Herkenbaar?
            </span>
            <h2 id="challenges-title">
              Je ambitie is er.
              <br />
              <em>Wat houdt je nog tegen?</em>
            </h2>
          </div>
          <p>
            Je hoeft geen technische briefing te hebben. Vertel waar je tegenaan
            loopt. Wij denken mee over een oplossing die bij je bedrijf past.
          </p>
        </div>
        <div className="home-challenge-grid">
          {challenges.map((c) => (
            <article className="home-challenge" key={c.n}>
              <span className="home-challenge-number" aria-hidden="true">
                {c.n}
              </span>
              <span className="eyebrow">{c.audience}</span>
              <h3>{c.title}</h3>
              <p>{c.problem}</p>
              <div className="home-challenge-solution">
                <Check size={19} aria-hidden="true" />
                <p>{c.solution}</p>
              </div>
              <Link href={c.href} className="text-link">
                {c.link} <ArrowUpRight size={17} aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>
      </section>
      <section className="section section-services container">
        <div className="section-head">
          <div>
            <span className="eyebrow">
              <i className="eyebrow-line" />
              Onze diensten
            </span>
            <h2>
              Van goed idee naar iets
              <br />
              dat <em>voor je werkt.</em>
            </h2>
          </div>
          <p>
            Eén partner voor je uitstraling én de techniek erachter. We kijken
            samen wat je nu nodig hebt en wat later kan.
          </p>
          <Link href="/diensten" className="button button-dark">
            Alle diensten <ArrowUpRight size={17} />
          </Link>
        </div>
        <ServiceGrid />
      </section>
      <section className="section section-projects container">
        <div className="section-head">
          <div>
            <span className="eyebrow">
              <i className="eyebrow-line" />
              Dit bouwen we
            </span>
            <h2>
              Van losse processen naar
              <br />
              <em>werkende oplossingen.</em>
            </h2>
          </div>
          <p>
            Dossiers en facturen in één platform. Zoekopdrachten in een
            partnerportaal. Vacatures en kandidaten in een recruitmentomgeving.
            Bekijk de aanpak per project.
          </p>
          <Link href="/projecten" className="button button-dark">
            Alle projecten <ArrowUpRight size={17} />
          </Link>
        </div>
        <ProjectGrid />
        <p className="disclaimer">
          Schermafbeeldingen tonen demodata. Bij ieder project lees je wat we
          bouwen en wat de status is.
        </p>
      </section>
      <section className="container">
        <div className="process-panel">
          <div className="section-head">
            <div>
              <span className="eyebrow">
                <i className="eyebrow-line" />
                Zo werken wij
              </span>
              <h2>
                Je weet wat we doen.
                <br />
                <em>En waar je aan toe bent.</em>
              </h2>
              <p className="panel-sub">
                Eerst je vraag begrijpen. Dan een helder voorstel. Tijdens het
                bouwen kijk je mee en sturen we samen bij.
              </p>
            </div>
            <Link href="/werkwijze" className="button button-primary">
              Onze werkwijze <ArrowUpRight size={17} />
            </Link>
          </div>
          <ol className="timeline">
            {steps.map((s, i) => {
              const I = stepIcons[i];
              return (
                <li key={s.n}>
                  <span className="tl-dot">
                    <I size={20} strokeWidth={1.6} />
                  </span>
                  <h3>{s.title}</h3>
                  <p>{s.description}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>
      <section className="section container about-split">
        <div className="about-visual">
          <Hills src={photo("over-ons")} mark />
        </div>
        <div className="about-copy">
          <span className="eyebrow">
            <i className="eyebrow-line" />
            Waarom NiMaGo?
          </span>
          <h2>
            Jouw bedrijf begrijpen.
            <br />
            <em>Dán pas bouwen.</em>
          </h2>
          <p>
            Je zoekt iemand die snapt waar je naartoe wilt én het kan maken. Bij
            NiMaGo spreek je rechtstreeks met de makers. We vragen door, maken
            keuzes begrijpelijk en vertalen je vraag naar een ontwerp en
            techniek die bij je dagelijkse werk passen.
          </p>
          <ul className="checks">
            {checks.map((c) => (
              <li key={c}>
                <Check size={17} />
                {c}
              </li>
            ))}
          </ul>
          <Link href="/over-ons" className="button button-primary">
            Maak kennis met NiMaGo <ArrowUpRight size={17} />
          </Link>
        </div>
      </section>
      <section className="container tech-strip">
        <div className="tech-inner">
          <div>
            <span className="eyebrow">
              <i className="eyebrow-line" />
              Techniek
            </span>
            <h2>
              Moderne techniek, <em>zonder jargon.</em>
            </h2>
            <p>
              We bouwen met bewezen technologie en leggen je uit wat dat
              betekent.
            </p>
            <Link href="/techniek" className="text-link">
              Onze techniek <ArrowUpRight size={16} />
            </Link>
          </div>
          <p className="chips">
            {techGroups
              .flatMap((g) => g[2])
              .slice(0, 14)
              .map((t) => (
                <span key={t}>{t}</span>
              ))}
          </p>
        </div>
      </section>
      <section className="section container">
        <div className="section-head">
          <div>
            <span className="eyebrow">
              <i className="eyebrow-line" />
              Inzichten
            </span>
            <h2>
              Praktisch <em>en helder.</em>
            </h2>
          </div>
          <Link href="/inzichten" className="button button-dark">
            Alle artikelen <ArrowUpRight size={17} />
          </Link>
        </div>
        <div className="art-grid">
          {articles.slice(0, 3).map((a) => (
            <ArticleCard key={a.slug} a={a} />
          ))}
        </div>
      </section>
      <section className="container" style={{ paddingBottom: 30 }}>
        <div className="promo">
          <div>
            <span className="eyebrow">Gratis</span>
            <h2>Hoe gezond is jouw website?</h2>
            <p>
              Controleer in een paar seconden de technische basis: beveiliging,
              snelheid, mobiel en vindbaarheid.
            </p>
          </div>
          <Link href="/gratis-website-scan" className="button button-primary">
            Start de gratis check <ArrowUpRight size={17} />
          </Link>
        </div>
      </section>

      <section className="section container faq-teaser">
        <div className="section-head">
          <div>
            <span className="eyebrow">
              <i className="eyebrow-line" />
              Veelgestelde vragen
            </span>
            <h2>
              Goede vragen, <em>heldere antwoorden.</em>
            </h2>
          </div>
          <Link href="/faq" className="button button-dark">
            Alle vragen <ArrowUpRight size={17} />
          </Link>
        </div>
        <Faq items={faqs.slice(0, 4)} />
      </section>
      <section className="container cta-wrap">
        <div className="cta-panel home-final-cta">
          <div className="cta-inner">
            <div>
              <span className="eyebrow">
                Jouw volgende stap begint met een gesprek
              </span>
              <h2>Wat zou er in jouw bedrijf slimmer kunnen?</h2>
              <p>
                Laat je huidige website zien, vertel over dat terugkerende
                handwerk of leg je idee op tafel. We denken met je mee en
                bespreken wat een logische eerste stap is.
              </p>
            </div>
            <div className="cta-actions">
              <Link href="/kennismaking" className="button button-primary">
                Laten we kennismaken <ArrowUpRight size={18} />
              </Link>
              <Link href="/offerte-aanvragen" className="button button-outline">
                Ik heb al een concreet plan <ArrowRight size={17} />
              </Link>
              <span className="home-cta-note">
                Vrijblijvend. Je hoeft je idee nog niet uitgewerkt te hebben.
              </span>
            </div>
          </div>
        </div>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            name: site.name,
            description:
              "NiMaGo bouwt websites, webshops, maatwerk software en slimme koppelingen.",
            url: site.url,
            slogan: site.tagline,
            areaServed: "NL",
            knowsLanguage: "nl",
          }),
        }}
      />
    </>
  );
}
