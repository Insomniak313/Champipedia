import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid gap-6 rounded-3xl border border-black/10 bg-white p-8 dark:border-white/10 dark:bg-black">
      <div className="grid gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          Page introuvable
        </h1>
        <p className="text-sm leading-6 text-zinc-700 dark:text-zinc-300">
          La page demandée n’existe pas (ou a été déplacée).
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium text-background transition-colors hover:bg-zinc-800 dark:hover:bg-zinc-200"
        >
          Retour à l’accueil
        </Link>
        <Link
          href="/champignons"
          className="inline-flex h-11 items-center justify-center rounded-full border border-black/10 px-5 text-sm font-medium text-zinc-900 transition-colors hover:bg-black/5 dark:border-white/10 dark:text-zinc-100 dark:hover:bg-white/10"
        >
          Voir les champignons
        </Link>
      </div>
    </div>
  );
}

