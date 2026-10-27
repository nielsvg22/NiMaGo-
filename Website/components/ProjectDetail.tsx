import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";
import type { Metadata } from "next";
import { projects } from "@/data/site";
import { projectExtra } from "@/data/content";
import CTA from "@/components/CTA";
import { ProjectArt } from "@/components/Art";
import { projectImages } from "@/lib/photo";
export function projectMetadata(slug: string): Metadata {
  const p = projects.find((x) => x.slug === slug);
  return { title: p?.title, description: p?.description };
}
export default function ProjectDetail({ slug }: { slug: string }) {
  const p = projects.find((x) => x.slug === slug);
  if (!p) notFound();
  const ex = projectExtra[p.slug];
  const imgs = projectImages(p.slug);
  const others = projects.filter((x) => x.slug !== p.slug);
  return (
    <>
      <section className="page-hero container">
        <span className="eyebrow">
          {p.type} · {p.sector}
        </span>
        <h1>
          {p.title}
          <span className="accent-dot">.</span>
        </h1>
        <p>{p.subtitle}</p>
        <div className="tags">
          {p.tags.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
      </section>
      <section className="container small-top">
        {imgs.length ? (
          <div className="shots">
            {imgs.map((src, i) => (
              <figure
                className={`shot-frame big${i === 0 ? " first" : ""}`}
                key={src}
              >
                <img
                  src={src}
                  alt={`Schermafbeelding ${i + 1} van ${p.title}`}
                  loading={i === 0 ? "eager" : "lazy"}
                />
              </figure>
            ))}
          </div>
        ) : (
          <div className={`project-visual project-${p.color} project-big`}>
            <ProjectArt variant={p.color as "peach" | "dark" | "blue"} />
          </div>
        )}
        <p className="disclaimer">
          {imgs.length ? p.note : "Illustratie. " + p.note}
        </p>
      </section>
      <section className="section container detail-grid">
        <article className="detail-main">
          <span className="eyebrow">Het project</span>
          <h2>
            Wat we <em>bouwden.</em>
          </h2>
          <p>{p.description}</p>
          {ex && (
            <>
              <h3 className="mini-h">De uitdaging</h3>
              <p>{ex.challenge}</p>
              <h3 className="mini-h">Onze aanpak</h3>
              <p>{ex.approach}</p>
            </>
          )}
        </article>
        <aside className="detail-aside">
          <h3>Onderdelen</h3>
          {p.built.map((b) => (
            <p key={b}>
              <Check size={18} />
              {b}
            </p>
          ))}
          {ex && (
            <>
              <h3 style={{ marginTop: 22 }}>Techniek</h3>
              <div className="tags">
                {ex.stack.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            </>
          )}
        </aside>
      </section>
      <section className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow">Meer werk</span>
            <h2>
              Andere <em>projecten.</em>
            </h2>
          </div>
          <Link href="/projecten" className="text-link">
            <ArrowLeft size={18} /> Alle projecten
          </Link>
        </div>
        <div className="project-grid three">
          {others.map((o) => {
            const img = projectImages(o.slug)[0];
            return (
              <Link
                className="project-card"
                href={"/projecten/" + o.slug}
                key={o.slug}
              >
                <div
                  className={`project-visual project-${o.color}${img ? " has-shot" : ""}`}
                >
                  <span className="project-label">{o.sector}</span>
                  {img ? (
                    <div className="shot-frame">
                      <img src={img} alt="" loading="lazy" />
                    </div>
                  ) : (
                    <ProjectArt
                      variant={o.color as "peach" | "dark" | "blue"}
                    />
                  )}
                </div>
                <div className="project-body">
                  <div>
                    <span className="eyebrow">{o.type}</span>
                    <h3>{o.title}</h3>
                    <p>{o.subtitle}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
      <CTA />
    </>
  );
}
