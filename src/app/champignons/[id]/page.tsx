import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getMushroomById } from "@/lib/mushroomQueries";
import { MushroomPhotoManager } from "@/components/MushroomPhotoManager";

interface MushroomPageProps {
  params: Promise<{ id: string }>;
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

export async function generateMetadata(
  props: MushroomPageProps,
): Promise<Metadata> {
  const { id } = await props.params;
  const mushroom = await getMushroomById(id);
  if (!mushroom) return { title: "Champignon introuvable" };

  return {
    title: mushroom.commonNameFr,
    description: `${mushroom.commonNameFr} (${mushroom.scientificName}) — fiche Champipedia.`,
  };
}

export default async function MushroomPage(props: MushroomPageProps) {
  const { id } = await props.params;
  const mushroom = await getMushroomById(id);
  if (!mushroom) notFound();

  const details: Array<{ label: string; value: string | null }> = [
    { label: "Nom scientifique", value: mushroom.scientificName },
    { label: "Famille", value: mushroom.family ?? null },
    { label: "Statut", value: toStatusLabel(mushroom.edibilityStatus) },
    { label: "Forme du chapeau", value: mushroom.capShape ?? null },
    { label: "Couleur du chapeau", value: mushroom.capColor ?? null },
    { label: "Hyménophore", value: mushroom.hymenophoreType ?? null },
    { label: "Couleur de sporée", value: mushroom.sporePrintColor ?? null },
    { label: "Habitat", value: mushroom.habitat ?? null },
    { label: "Saison", value: mushroom.seasonTags ?? null },
    { label: "Anneau", value: mushroom.hasRing ? "oui" : "non" },
    { label: "Volve", value: mushroom.hasVolva ? "oui" : "non" },
    { label: "Bleuissure / changement", value: mushroom.bruisingColor ?? null },
  ];

  return (
    <div className="grid gap-8">
      <div className="flex flex-col gap-3">
        <Link
          href="/champignons"
          className="text-sm text-zinc-700 hover:text-black dark:text-zinc-300 dark:hover:text-white"
        >
          ← Retour à la liste
        </Link>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              {mushroom.commonNameFr}
            </h1>
            <p className="mt-2 text-sm italic text-zinc-600 dark:text-zinc-400">
              {mushroom.scientificName}
            </p>
          </div>

          <span
            className={[
              "mt-2 inline-flex w-fit rounded-full border px-2.5 py-1 text-xs font-medium sm:mt-0",
              statusBadgeClasses(mushroom.edibilityStatus),
            ].join(" ")}
          >
            {toStatusLabel(mushroom.edibilityStatus)}
          </span>
        </div>
      </div>

      <section className="rounded-3xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-black">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-base font-semibold">Photo</h2>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            Ajoutez ou remplacez la photo de ce champignon.
          </p>
        </div>

        <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-black/10 bg-zinc-50 dark:border-white/10 dark:bg-white/5">
            {mushroom.imageUrl ? (
              <Image
                src={mushroom.imageUrl}
                alt={`Photo — ${mushroom.commonNameFr}`}
                fill
                sizes="(max-width: 1024px) 100vw, 720px"
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center p-6 text-sm text-zinc-600 dark:text-zinc-400">
                Aucune photo pour le moment.
              </div>
            )}
          </div>

          <MushroomPhotoManager
            mushroomId={mushroom.id}
            mushroomName={mushroom.commonNameFr}
            initialImageUrl={mushroom.imageUrl ?? null}
          />
        </div>
      </section>

      <section className="grid gap-3 rounded-3xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-black">
        <h2 className="text-base font-semibold">Résumé</h2>
        <p className="text-sm leading-6 text-zinc-700 dark:text-zinc-300">
          {mushroom.description ?? "—"}
        </p>
        {mushroom.warnings ? (
          <div className="mt-2 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-800 dark:text-red-200">
            <p className="font-medium">Avertissement</p>
            <p className="mt-1 leading-6">{mushroom.warnings}</p>
          </div>
        ) : null}
      </section>

      <section className="rounded-3xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-black">
        <h2 className="text-base font-semibold">Critères</h2>
        <dl className="mt-4 grid gap-x-6 gap-y-4 sm:grid-cols-2">
          {details
            .filter((item) => item.value && item.value.trim().length > 0)
            .map((item) => (
              <div key={item.label} className="grid gap-1">
                <dt className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  {item.label}
                </dt>
                <dd className="text-sm text-zinc-900 dark:text-zinc-100">
                  {item.value}
                </dd>
              </div>
            ))}
        </dl>
      </section>

      <section className="rounded-3xl border border-black/10 bg-zinc-50 p-6 dark:border-white/10 dark:bg-white/5">
        <h2 className="text-base font-semibold">Important</h2>
        <p className="mt-2 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
          L’identification de champignons est complexe. Ne consommez jamais un
          champignon sans validation d’un expert (club mycologique, pharmacien
          formé, etc.).
        </p>
      </section>
    </div>
  );
}

