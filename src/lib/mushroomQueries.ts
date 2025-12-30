import type { Mushroom } from "@/lib/mushrooms";
import { fallbackMushrooms, matchesQuery, normalizeEdibilityStatus } from "@/lib/mushrooms";
import { getDatabaseUrlOptional, getIsSqliteUrl, getPrismaOptional } from "@/lib/prisma";

function sortByCommonNameFr(a: Mushroom, b: Mushroom) {
  return a.commonNameFr.localeCompare(b.commonNameFr, "fr");
}

function getIsSqliteDatabaseUrl() {
  const databaseUrl = getDatabaseUrlOptional();
  if (!databaseUrl) return true;
  return getIsSqliteUrl(databaseUrl);
}

function getContainsFilter(query: string) {
  const isSqlite = getIsSqliteDatabaseUrl();
  return isSqlite
    ? { contains: query }
    : { contains: query, mode: "insensitive" as const };
}

export interface MushroomFilters {
  query?: string;
  edibilityStatus?: string | null;
}

export async function listMushrooms(filters: MushroomFilters) {
  const prisma = await getPrismaOptional();
  const query = (filters.query ?? "").trim();
  const edibilityStatus = normalizeEdibilityStatus(filters.edibilityStatus ?? undefined);

  if (!prisma) {
    return fallbackMushrooms
      .filter((m) => (edibilityStatus ? m.edibilityStatus === edibilityStatus : true))
      .filter((m) => matchesQuery(m, query))
      .slice()
      .sort(sortByCommonNameFr);
  }

  try {
    const items = await prisma.mushroom.findMany({
      where: {
        ...(edibilityStatus ? { edibilityStatus } : {}),
        ...(query
          ? {
              OR: [
                { commonNameFr: getContainsFilter(query) },
                { scientificName: getContainsFilter(query) },
                { family: getContainsFilter(query) },
                { capColor: getContainsFilter(query) },
                { hymenophoreType: getContainsFilter(query) },
                { habitat: getContainsFilter(query) },
              ],
            }
          : {}),
      },
      orderBy: { commonNameFr: "asc" },
    });

    return items as unknown as Mushroom[];
  } catch {
    return fallbackMushrooms
      .filter((m) => (edibilityStatus ? m.edibilityStatus === edibilityStatus : true))
      .filter((m) => matchesQuery(m, query))
      .slice()
      .sort(sortByCommonNameFr);
  }
}

export async function getMushroomById(id: string) {
  const prisma = await getPrismaOptional();
  if (!prisma) {
    return fallbackMushrooms.find((m) => m.id === id) ?? null;
  }

  try {
    const item = await prisma.mushroom.findUnique({ where: { id } });
    return (item as unknown as Mushroom | null) ?? null;
  } catch {
    return fallbackMushrooms.find((m) => m.id === id) ?? null;
  }
}

