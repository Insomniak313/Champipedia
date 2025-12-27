import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accueil",
  description:
    "Parcourir des fiches de champignons et comprendre les critères d’identification.",
};

export default function HomePage() {
  return (
    <div className="grid gap-10">
      <section className="rounded-3xl border border-black/10 bg-gradient-to-b from-zinc-50 to-white p-8 dark:border-white/10 dark:from-zinc-950 dark:to-black sm:p-12">
        <div className="max-w-3xl">
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Champipedia
          </p>
          <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Découvrir et comparer des champignons, simplement.
          </h1>
          <p className="mt-4 text-pretty text-lg leading-8 text-zinc-700 dark:text-zinc-300">
            Parcourez des fiches (forme du chapeau, hyménophore, saison,
            habitat). Les informations sont indicatives : en cas de doute,
            demandez toujours l’avis d’un mycologue.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/champignons"
              className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium text-background transition-colors hover:bg-zinc-800 dark:hover:bg-zinc-200"
            >
              Explorer les champignons
            </Link>
            <Link
              href="/a-propos"
              className="inline-flex h-11 items-center justify-center rounded-full border border-black/10 px-5 text-sm font-medium text-zinc-900 transition-colors hover:bg-black/5 dark:border-white/10 dark:text-zinc-100 dark:hover:bg-white/10"
            >
              En savoir plus
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-black/10 p-6 dark:border-white/10">
          <h2 className="text-base font-semibold">Fiches structurées</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
            Critères simples (couleur, lamelles/tubes, habitat, saison).
          </p>
        </div>
        <div className="rounded-2xl border border-black/10 p-6 dark:border-white/10">
          <h2 className="text-base font-semibold">Avertissements</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
            Mise en avant des risques et confusions fréquentes.
          </p>
        </div>
        <div className="rounded-2xl border border-black/10 p-6 dark:border-white/10">
          <h2 className="text-base font-semibold">Filtrage rapide</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
            Recherche par nom et statut (comestible/toxique/etc.).
          </p>
        </div>
      </section>
    </div>
  );
}
