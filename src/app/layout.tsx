import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Champipedia",
    template: "%s · Champipedia",
  },
  description:
    "Un guide simple pour découvrir des champignons (critères, saisons, avertissements).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-dvh bg-background text-foreground">
          <SiteHeader />
          <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
            {children}
          </main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
