export interface Mushroom {
  id: string;
  commonNameFr: string;
  scientificName: string;
  family?: string | null;
  edibilityStatus: string;
  capShape?: string | null;
  capColor?: string | null;
  hymenophoreType?: string | null;
  sporePrintColor?: string | null;
  hasRing: boolean;
  hasVolva: boolean;
  bruisingColor?: string | null;
  habitat?: string | null;
  seasonTags?: string | null;
  description?: string | null;
  warnings?: string | null;
  imageUrl?: string | null;
}

function toId(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const fallbackMushrooms: Mushroom[] = [
  {
    id: toId("Boletus edulis"),
    commonNameFr: "Cèpe de Bordeaux",
    scientificName: "Boletus edulis",
    family: "Boletaceae",
    edibilityStatus: "comestible",
    capShape: "convexe",
    capColor: "brun",
    hymenophoreType: "tubes",
    sporePrintColor: "olive",
    bruisingColor: "aucun",
    habitat: "forêt",
    seasonTags: "été,automne",
    description: "Bolet robuste, tubes blancs puis jaunâtres, pied trapu.",
    hasRing: false,
    hasVolva: false,
  },
  {
    id: toId("Cantharellus cibarius"),
    commonNameFr: "Girolle",
    scientificName: "Cantharellus cibarius",
    family: "Cantharellaceae",
    edibilityStatus: "comestible",
    capShape: "entonnoir",
    capColor: "jaune",
    hymenophoreType: "plis",
    sporePrintColor: "jaune_pâle",
    habitat: "forêt",
    seasonTags: "été,automne",
    description: "Plis décurrents, odeur fruitée.",
    hasRing: false,
    hasVolva: false,
  },
  {
    id: toId("Amanita phalloides"),
    commonNameFr: "Amanite phalloïde",
    scientificName: "Amanita phalloides",
    family: "Amanitaceae",
    edibilityStatus: "toxique",
    capShape: "convexe",
    capColor: "vert_olive",
    hymenophoreType: "lamelles",
    sporePrintColor: "blanc",
    hasRing: true,
    hasVolva: true,
    habitat: "forêt",
    seasonTags: "été,automne",
    warnings: "Mortelle. Volve + anneau + lamelles blanches.",
  },
];

export function matchesQuery(mushroom: Mushroom, query: string) {
  const normalizedQuery = query.trim().toLowerCase();
  if (normalizedQuery.length === 0) return true;

  const haystack = [
    mushroom.commonNameFr,
    mushroom.scientificName,
    mushroom.family ?? "",
    mushroom.capColor ?? "",
    mushroom.hymenophoreType ?? "",
    mushroom.habitat ?? "",
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(normalizedQuery);
}

export function normalizeEdibilityStatus(value: string | undefined) {
  const raw = (value ?? "").trim().toLowerCase();
  if (!raw) return null;
  if (raw === "comestible") return "comestible";
  if (raw === "toxique") return "toxique";
  if (raw === "non_comestible") return "non_comestible";
  if (raw === "inconnu") return "inconnu";
  return null;
}

