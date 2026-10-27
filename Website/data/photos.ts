export type BusinessPhoto = {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
};

/** Door de opdrachtgever geselecteerde sfeerbeelden met eigen projectschermen. */
export const businessPhotos: Record<number, BusinessPhoto> = {
  1: {
    src: "/images/bedrijfsbeelden/01-aigwise-op-de-werkplek.webp",
    width: 1440,
    height: 1080,
    alt: "Laptop met het AIGWise-administratiedashboard op een houten bureau",
    caption: "AIGWise op de werkplek",
  },
  2: {
    src: "/images/bedrijfsbeelden/02-ome-partnerportaal-in-beeld.webp",
    width: 1440,
    height: 1080,
    alt: "Beeldscherm met het OME Partnerportaal en het overzicht van zoekopdrachten",
    caption: "OME Partnerportaal",
  },
  3: {
    src: "/images/bedrijfsbeelden/03-the-move-maker-op-laptop.webp",
    width: 1440,
    height: 1080,
    alt: "Laptop met de recruitmentwebsite van The Move Maker",
    caption: "The Move Maker op laptop",
  },
  6: {
    src: "/images/bedrijfsbeelden/06-aigwise-calculatietool.webp",
    width: 1440,
    height: 1080,
    alt: "Laptop met de calculatietool van AIGWise",
    caption: "Inzicht in leasekosten",
  },
  7: {
    src: "/images/bedrijfsbeelden/07-recruitmentoverzicht-op-groot-scherm.webp",
    width: 1440,
    height: 1080,
    alt: "Beeldscherm met het sollicitatiebord van The Move Maker",
    caption: "Grip op sollicitaties",
  },
  8: {
    src: "/images/bedrijfsbeelden/08-portaal-in-dagelijks-gebruik.webp",
    width: 1440,
    height: 1080,
    alt: "Het OME Partnerportaal in gebruik op een laptop",
    caption: "Alles op één plek",
  },
  9: {
    src: "/images/bedrijfsbeelden/09-website-testen-op-tablet.webp",
    width: 1440,
    height: 1080,
    alt: "The Move Maker-website op een tablet",
    caption: "Ook op een kleiner scherm",
  },
  11: {
    src: "/images/bedrijfsbeelden/11-programmeren-in-een-donkerblauw-t-shirt.webp",
    width: 1440,
    height: 1080,
    alt: "Programmeren in een donkerblauw T-shirt, met code en AIGWise op de schermen",
    caption: "Van idee naar code",
  },
  12: {
    src: "/images/bedrijfsbeelden/12-ome-op-een-overlegtafel.webp",
    width: 1440,
    height: 1080,
    alt: "Laptop met het OME Partnerportaal op een overlegtafel",
    caption: "Een project bespreken",
  },
  13: {
    src: "/images/bedrijfsbeelden/13-recruitmentwebsite-en-werkomgeving.webp",
    width: 1440,
    height: 1080,
    alt: "De recruitmentwebsite en de beheeromgeving van The Move Maker naast elkaar",
    caption: "Website en beheer samen",
  },
  14: {
    src: "/images/bedrijfsbeelden/14-aan-de-code-werken-van-opzij.webp",
    width: 1440,
    height: 1080,
    alt: "Programmeren in een antracietkleurige trui, met de websitecode op het scherm",
    caption: "Aandacht voor de techniek",
  },
  15: {
    src: "/images/bedrijfsbeelden/15-geconcentreerd-programmeren-in-een-trui.webp",
    width: 1440,
    height: 1080,
    alt: "Werken aan code op een laptop met de AIGWise-calculatietool op het tweede scherm",
    caption: "Bouwen en controleren",
  },
  16: {
    src: "/images/bedrijfsbeelden/16-van-administratie-naar-overzicht.webp",
    width: 1440,
    height: 1080,
    alt: "Het AIGWise-dashboard en de calculatietool op twee schermen",
    caption: "Van administratie naar overzicht",
  },
  17: {
    src: "/images/bedrijfsbeelden/17-over-je-schouder-code-en-recruitmentplatform.webp",
    width: 1440,
    height: 1080,
    alt: "Programmeren in een T-shirt met het recruitmentplatform op het tweede scherm",
    caption: "Code en resultaat",
  },
  19: {
    src: "/images/bedrijfsbeelden/19-the-move-maker-van-dichtbij.webp",
    width: 1440,
    height: 1080,
    alt: "Detail van een laptop met de The Move Maker-website",
    caption: "Een sterke eerste indruk",
  },
  20: {
    src: "/images/bedrijfsbeelden/20-nimago-aan-het-werk-casual-achter-de-schermen.webp",
    width: 1440,
    height: 1080,
    alt: "Werken aan de websitecode in een casual T-shirt, met het OME-portaal op de laptop",
    caption: "Achter de schermen bij NiMaGo",
  },
};

export const projectPhotoIds: Record<string, number[]> = {
  aigwise: [1, 6, 16],
  "ome-partnerportaal": [2, 8, 12],
  "the-move-maker": [3, 7, 9, 13, 19],
};

export const projectCover = (slug: string): string | undefined => {
  const id = projectPhotoIds[slug]?.[0];
  return id === undefined ? undefined : businessPhotos[id]?.src;
};
