import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-black/10 py-10 dark:border-white/10">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium">Champipedia</p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Informations indicatives — ne jamais consommer sur la base d’une
              page web.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <Link
              href="/champignons"
              className="text-zinc-700 hover:text-black dark:text-zinc-300 dark:hover:text-white"
            >
              Champignons
            </Link>
            <Link
              href="/a-propos"
              className="text-zinc-700 hover:text-black dark:text-zinc-300 dark:hover:text-white"
            >
              À propos
            </Link>
            <Link
              href="/contact"
              className="text-zinc-700 hover:text-black dark:text-zinc-300 dark:hover:text-white"
            >
              Contact
            </Link>
          </div>
        </div>

        <div className="mt-6 border-t border-black/10 pt-6 text-xs text-zinc-600 dark:border-white/10 dark:text-zinc-400">
          <p>© {new Date().getFullYear()} Champipedia. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}

