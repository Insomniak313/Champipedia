import Link from "next/link";
import type { Metadata } from "next";
import { listMushrooms } from "@/lib/mushroomQueries";

export const metadata: Metadata = {
  title: "Champignons",
  description: "Liste de champignons avec recherche et filtrage simple.",
};

interface ChampignonsPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

function getFirstSearchParam(
  value: string | string[] | undefined,
  defaultValue: string,
) {
  if (!value) return defaultValue;
  return Array.isArray(value) ? value[0] ?? defaultValue : value;
}

function toStatusLabel(value: string) {
  if (value === "comestible") return "Comestible";
  if (value === "toxique") return "Toxique";
  if (value === "non_comestible") return "Non comestible";
  return "Inconnu";
}

function statusBadgeClasses(value: string) {
  if (value === "comestible") {
    return "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300";
  }
  if (value === "toxique") {
    return "border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-300";
  }
  if (value === "non_comestible") {
    return "border-amber-500/20 bg-amber-500/10 text-amber-800 dark:text-amber-300";
  }
  return "border-zinc-500/20 bg-zinc-500/10 text-zinc-700 dark:text-zinc-300";
}

export default async function ChampignonsPage(props: ChampignonsPageProps) {
  const resolvedSearchParams = (await props.searchParams) ?? {};
  const query = getFirstSearchParam(resolvedSearchParams.q, "");
  const status = getFirstSearchParam(resolvedSearchParams.status, "");

  const mushrooms = await listMushrooms({
    query,
    edibilityStatus: status.length > 0 ? status : null,
  });

  return (
    <div className="grid gap-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-semibold tracking-tight">Champignons</h1>
          <p className="mt-2 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
            Recherchez par nom, couleur, habitat… et filtrez par statut.
          </p>
        </div>
      </div>

      <form className="grid gap-3 rounded-2xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-black sm:grid-cols-[1fr_220px_auto] sm:items-end">
        <label className="grid gap-1">
          <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Recherche
          </span>
          <input
            name="q"
            defaultValue={query}
            placeholder="ex: amanite, brun, forêt…"
            className="h-11 w-full rounded-xl border border-black/10 bg-transparent px-3 text-sm outline-none ring-0 placeholder:text-zinc-500 focus:border-black/20 dark:border-white/10 dark:focus:border-white/20"
          />
        </label>

        <label className="grid gap-1">
          <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Statut
          </span>
          <select
            name="status"
            defaultValue={status}
            className="h-11 w-full rounded-xl border border-black/10 bg-transparent px-3 text-sm outline-none ring-0 focus:border-black/20 dark:border-white/10 dark:focus:border-white/20"
          >
            <option value="">Tous</option>
            <option value="comestible">Comestible</option>
            <option value="toxique">Toxique</option>
            <option value="non_comestible">Non comestible</option>
            <option value="inconnu">Inconnu</option>
          </select>
        </label>

        <button
          type="submit"
          className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium text-background transition-colors hover:bg-zinc-800 dark:hover:bg-zinc-200"
        >
          Filtrer
        </button>
      </form>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {mushrooms.map((mushroom) => (
          <Link
            key={mushroom.id}
            href={`/champignons/${mushroom.id}`}
            className="group rounded-2xl border border-black/10 bg-white p-5 transition-colors hover:bg-zinc-50 dark:border-white/10 dark:bg-black dark:hover:bg-white/5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-base font-semibold tracking-tight">
                  {mushroom.commonNameFr}
                </p>
                <p className="mt-1 text-sm italic text-zinc-600 dark:text-zinc-400">
                  {mushroom.scientificName}
                </p>
              </div>
              <span
                className={[
                  "shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium",
                  statusBadgeClasses(mushroom.edibilityStatus),
                ].join(" ")}
              >
                {toStatusLabel(mushroom.edibilityStatus)}
              </span>
            </div>

            <div className="mt-4 grid gap-1 text-sm text-zinc-700 dark:text-zinc-300">
              <p className="max-h-12 overflow-hidden">
                {mushroom.description ?? mushroom.warnings ?? "—"}
              </p>
            </div>

            <div className="mt-4 text-xs text-zinc-600 dark:text-zinc-400">
              {mushroom.habitat ? <span>Habitat : {mushroom.habitat}</span> : null}
              {mushroom.seasonTags ? (
                <span className="ml-3">Saison : {mushroom.seasonTags}</span>
              ) : null}
            </div>
          </Link>
        ))}
      </div>

      {mushrooms.length === 0 ? (
        <div className="rounded-2xl border border-black/10 p-6 text-sm text-zinc-700 dark:border-white/10 dark:text-zinc-300">
          Aucun résultat. Essayez un autre terme (ex : “amanite”, “forêt”).
        </div>
      ) : null}
    </div>
  );
}

