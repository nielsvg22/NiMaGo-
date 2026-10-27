import { businessPhotos } from "@/data/photos";

type Props = { ids: number[]; title: string; eyebrow?: string; intro?: string };

export default function PhotoGallery({
  ids,
  title,
  eyebrow = "In beeld",
  intro,
}: Props) {
  const photos = ids
    .map((id) => businessPhotos[id])
    .filter((photo) => photo !== undefined);
  if (!photos.length) return null;
  return (
    <section className="container section business-gallery" aria-label={title}>
      <div className="section-head">
        <div>
          <span className="eyebrow">
            <i className="eyebrow-line" />
            {eyebrow}
          </span>
          <h2>{title}</h2>
        </div>
        {intro && <p>{intro}</p>}
      </div>
      <div className="business-gallery-grid">
        {photos.map((photo) => (
          <figure className="business-photo" key={photo.src}>
            <img
              src={photo.src}
              srcSet={`${photo.src.replace(".webp", "-720.webp")} 720w, ${photo.src} ${photo.width}w`}
              sizes="(max-width: 740px) calc(100vw - 32px), (max-width: 1296px) calc((100vw - 78px) / 2), 609px"
              width={photo.width}
              height={photo.height}
              alt={photo.alt}
              loading="lazy"
              decoding="async"
            />
            <figcaption>{photo.caption}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
