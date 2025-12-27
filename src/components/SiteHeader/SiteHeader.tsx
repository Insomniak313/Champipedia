import Link from "next/link";

const navItems = [
  { href: "/", label: "Accueil" },
  { href: "/champignons", label: "Champignons" },
  { href: "/a-propos", label: "À propos" },
  { href: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-background/80 backdrop-blur dark:border-white/10">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-base font-semibold tracking-tight">
            Champipedia
          </span>
          <span className="hidden text-xs text-zinc-600 dark:text-zinc-400 sm:inline">
            guide de champignons
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm sm:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-zinc-700 transition-colors hover:text-black dark:text-zinc-300 dark:hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="sm:hidden">
          <Link
            href="/champignons"
            className="inline-flex h-9 items-center justify-center rounded-full border border-black/10 px-4 text-sm font-medium text-zinc-900 transition-colors hover:bg-black/5 dark:border-white/10 dark:text-zinc-100 dark:hover:bg-white/10"
          >
            Explorer
          </Link>
        </div>
      </div>
    </header>
  );
}

