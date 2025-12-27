import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contacter Champipedia.",
};

export default function ContactPage() {
  return (
    <div className="grid gap-8">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight">Contact</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
          Pour toute question, suggestion d’amélioration ou correction d’une
          fiche, vous pouvez nous écrire.
        </p>
      </div>

      <section className="grid gap-4 rounded-3xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-black">
        <h2 className="text-base font-semibold">Écrire un message</h2>
        <p className="text-sm leading-6 text-zinc-700 dark:text-zinc-300">
          Envoyez un e‑mail à{" "}
          <a
            className="font-medium text-zinc-900 underline underline-offset-4 dark:text-zinc-100"
            href="mailto:contact@champipedia.local"
          >
            contact@champipedia.local
          </a>
          .
        </p>
      </section>

      <section className="rounded-3xl border border-black/10 bg-zinc-50 p-6 dark:border-white/10 dark:bg-white/5">
        <h2 className="text-base font-semibold">Avertissement</h2>
        <p className="mt-2 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
          Champipedia ne remplace pas une expertise mycologique. En cas de
          doute, abstenez-vous et demandez une identification par un expert.
        </p>
      </section>
    </div>
  );
}

