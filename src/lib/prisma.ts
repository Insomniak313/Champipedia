import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import path from "node:path";

interface PrismaLikeClient {
  mushroom: {
    findMany: (args: unknown) => Promise<unknown[]>;
    findUnique: (args: unknown) => Promise<unknown | null>;
  };
}

function getDatabaseUrl() {
  const databaseUrl = process.env["DATABASE_URL"];
  return databaseUrl && databaseUrl.trim().length > 0 ? databaseUrl : null;
}

function getIsSqliteUrl(databaseUrl: string) {
  return databaseUrl === ":memory:" || databaseUrl.startsWith("file:");
}

function createPrismaClient(PrismaClientConstructor: new (args: unknown) => PrismaLikeClient, databaseUrl: string) {
  const isSqliteUrl = getIsSqliteUrl(databaseUrl);

  return new PrismaClientConstructor({
    adapter: isSqliteUrl
      ? new PrismaBetterSqlite3({
          url:
            databaseUrl === ":memory:"
              ? ":memory:"
              : path.resolve(process.cwd(), databaseUrl.replace(/^file:/, "")),
        })
      : new PrismaPg(new pg.Pool({ connectionString: databaseUrl }), {
          disposeExternalPool: true,
        }),
  });
}

declare global {
  var __prismaOptionalPromise: Promise<PrismaLikeClient | null> | undefined;
}

export async function getPrismaOptional() {
  const databaseUrl = getDatabaseUrl();
  if (!databaseUrl) return null;

  const cached = globalThis.__prismaOptionalPromise;
  if (cached) return cached;

  globalThis.__prismaOptionalPromise = (async () => {
    const prismaModule = (await import("@prisma/client")) as unknown;
    const PrismaClientConstructor = (prismaModule as { PrismaClient?: unknown })
      .PrismaClient;

    if (!PrismaClientConstructor) return null;

    return createPrismaClient(
      PrismaClientConstructor as new (args: unknown) => PrismaLikeClient,
      databaseUrl,
    );
  })();

  return globalThis.__prismaOptionalPromise;
}

