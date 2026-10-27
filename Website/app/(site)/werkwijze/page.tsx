import PhotoGallery from "@/components/PhotoGallery";
import type { Metadata } from "next";
import { steps } from "@/data/site";
import { stepDetails } from "@/data/content";
import CTA from "@/components/CTA";
export const metadata: Metadata = {
  title: "Werkwijze",
  description:
    "Zo werkt NiMaGo: van kennismaking en voorstel tot ontwerp, bouw en oplevering. Duidelijk, in overleg en zonder verrassingen.",
};
export default function Page() {
  return (
    <>
      <section className="page-hero container">
        <span className="eyebrow">Zo werken we samen</span>
        <h1>
          Een helder proces.
          <br />
          <em>Een sterk eindresultaat.</em>
        </h1>
        <p>
          Je weet waar je aan toe bent, wat we maken en welke keuzes belangrijk
          zijn. Van het eerste gesprek tot daarna.
        </p>
      </section>
      <section className="container section small-top">
        <div className="process-list">
          {steps.map((s) => {
            const d = stepDetails[s.n];
            return (
              <div key={s.n} className="process-item">
                <span>{s.n}</span>
                <div>
                  <h2>{s.title}</h2>
                  <p>{s.description}</p>
                  {d && (
                    <dl className="step-split">
                      <div>
                        <dt>Wat wij doen</dt>
                        <dd>{d.we}</dd>
                      </div>
                      <div>
                        <dt>Wat jij doet</dt>
                        <dd>{d.jij}</dd>
                      </div>
                    </dl>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
      <PhotoGallery
        ids={[14, 17]}
        title="Bouwen, meekijken en bijsturen."
        eyebrow="Tijdens de ontwikkeling"
      />
      <CTA />
    </>
  );
}
