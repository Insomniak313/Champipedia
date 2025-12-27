import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "À propos",
  description: "Pourquoi Champipedia existe, et comment utiliser le site.",
};

export default function AboutPage() {
  return (
    <div className="grid gap-8">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight">À propos</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
          Champipedia est un petit site de démonstration pour parcourir des
          fiches de champignons à partir de critères simples (forme du chapeau,
          hyménophore, saison, habitat).
        </p>
      </div>

      <section className="grid gap-3 rounded-3xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-black">
        <h2 className="text-base font-semibold">Sécurité</h2>
        <p className="text-sm leading-6 text-zinc-700 dark:text-zinc-300">
          L’identification mycologique est difficile et les confusions peuvent
          être graves. Ne consommez jamais un champignon sans validation d’un
          expert (club mycologique, pharmacien formé, etc.).
        </p>
      </section>

      <section className="grid gap-3 rounded-3xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-black">
        <h2 className="text-base font-semibold">Fonctionnalités</h2>
        <ul className="grid gap-2 text-sm text-zinc-700 dark:text-zinc-300">
          <li>Recherche par nom, couleur, habitat…</li>
          <li>Filtrage par statut (comestible / toxique / non comestible).</li>
          <li>Fiches détaillées avec critères et avertissements.</li>
        </ul>
        <div className="pt-2">
          <Link
            href="/champignons"
            className="inline-flex h-10 items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium text-background transition-colors hover:bg-zinc-800 dark:hover:bg-zinc-200"
          >
            Aller à la liste
          </Link>
        </div>
      </section>
    </div>
  );
}

