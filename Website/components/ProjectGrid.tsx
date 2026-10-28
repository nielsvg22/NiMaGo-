import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/data/site";
import { ProjectArt } from "./Art";
import { projectImages } from "@/lib/photo";
export default function ProjectGrid() {
  return (
    <div className="project-grid">
      {projects.map((p) => {
        const img = projectImages(p.slug)[0];
        return (
          <Link
            className="project-card"
            href={"/projecten/" + p.slug}
            key={p.slug}
          >
            <div
              className={`project-visual project-${p.color}${img ? " has-shot" : ""}`}
            >
              <span className="project-label">{p.sector}</span>
              {img ? (
                <div className="shot-frame">
                  <img
                    src={img}
                    alt={`Schermafbeelding van ${p.title}`}
                    loading="lazy"
                  />
                </div>
              ) : (
                <ProjectArt variant={p.color as "peach" | "dark" | "blue"} />
              )}
            </div>
            <div className="project-body">
              <div>
                <span className="eyebrow">{p.type}</span>
                <h3>{p.title}</h3>
                <p>{p.subtitle}</p>
              </div>
              <span className="circle-arrow">
                <ArrowUpRight size={20} />
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
