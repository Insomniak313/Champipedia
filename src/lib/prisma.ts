import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import path from "node:path";

interface PrismaLikeClient {
  mushroom: {
    findMany: (args: unknown) => Promise<unknown[]>;
    findUnique: (args: unknown) => Promise<unknown | null>;
    update: (args: unknown) => Promise<unknown>;
  };
}

const DEFAULT_DEV_DATABASE_URL = "file:./prisma/dev.db";

const DATABASE_URL_ENV_KEYS = ["PRISMA_DB_URL", "POSTGRES_URL", "DATABASE_URL"] as const;

function getEnvDatabaseUrl() {
  for (const key of DATABASE_URL_ENV_KEYS) {
    const raw = process.env[key];
    const value = raw?.trim();
    if (value) return value;
  }
  return null;
}

export function getDatabaseUrlOptional() {
  const databaseUrl = getEnvDatabaseUrl();
  if (databaseUrl) return databaseUrl;
  if (process.env["NODE_ENV"] === "production") return null;
  return DEFAULT_DEV_DATABASE_URL;
}

export function getIsSqliteUrl(databaseUrl: string) {
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
  const databaseUrl = getDatabaseUrlOptional();
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

