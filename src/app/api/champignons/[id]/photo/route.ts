import fs from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { getPrismaOptional } from "@/lib/prisma";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const UPLOADS_PUBLIC_DIR = "/uploads/mushrooms";

function getSafeImageExtension(file: File) {
  const mimeToExt: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/avif": "avif",
  };

  const byMime = mimeToExt[file.type];
  if (byMime) return byMime;

  const rawExt = path.extname(file.name).replace(".", "").toLowerCase();
  const allowed = new Set(Object.values(mimeToExt));
  return allowed.has(rawExt) ? rawExt : null;
}

function getUploadsAbsoluteDir() {
  return path.join(process.cwd(), "public", UPLOADS_PUBLIC_DIR);
}

function isManagedUploadUrl(value: string) {
  return value.startsWith(`${UPLOADS_PUBLIC_DIR}/`);
}

async function deleteIfManagedUpload(imageUrl: string | null | undefined) {
  if (!imageUrl) return;
  if (!isManagedUploadUrl(imageUrl)) return;
  const absolutePath = path.join(process.cwd(), "public", imageUrl);
  try {
    await fs.unlink(absolutePath);
  } catch {
    // ignore: file may not exist / already removed
  }
}

interface RouteContext {
  params: { id: string } | Promise<{ id: string }>;
}

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const prisma = await getPrismaOptional();
  if (!prisma) {
    return NextResponse.json(
      { error: "La base de données n’est pas configurée (PRISMA_DB_URL/POSTGRES_URL manquant)." },
      { status: 503 },
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Fichier manquant (champ 'file')." }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Le fichier doit être une image." }, { status: 415 });
  }

  if (file.size > MAX_IMAGE_BYTES) {
    return NextResponse.json(
      { error: "Image trop lourde (max 5 Mo)." },
      { status: 413 },
    );
  }

  const ext = getSafeImageExtension(file);
  if (!ext) {
    return NextResponse.json(
      { error: "Format non supporté (jpg, png, webp, gif, avif)." },
      { status: 415 },
    );
  }

  try {
    const existing = (await prisma.mushroom.findUnique({ where: { id } })) as
      | { imageUrl?: string | null }
      | null;
    if (!existing) {
      return NextResponse.json(
        {
          error:
            "Champignon introuvable. Si vous venez d'installer le projet, exécutez: npm run db:push && npm run db:seed",
        },
        { status: 404 },
      );
    }

    await fs.mkdir(getUploadsAbsoluteDir(), { recursive: true });
    const fileName = `${id}-${Date.now()}.${ext}`;
    const publicPath = `${UPLOADS_PUBLIC_DIR}/${fileName}`;
    const absolutePath = path.join(process.cwd(), "public", publicPath);

    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(absolutePath, buffer);

    try {
      // On remplace : suppression de l'ancienne image si elle était gérée par l'app.
      await deleteIfManagedUpload(existing.imageUrl ?? null);

      const updated = (await prisma.mushroom.update({
        where: { id },
        data: { imageUrl: publicPath },
      })) as { imageUrl?: string | null };

      return NextResponse.json({ imageUrl: updated.imageUrl ?? null });
    } catch {
      await fs.unlink(absolutePath).catch(() => undefined);
      return NextResponse.json(
        {
          error:
            "La base de données n'est pas initialisée. Lancez: npm run db:push && npm run db:seed (ou configurez PRISMA_DB_URL/POSTGRES_URL).",
        },
        { status: 503 },
      );
    }
  } catch {
    return NextResponse.json(
      {
        error:
          "La base de données n'est pas initialisée. Lancez: npm run db:push && npm run db:seed (ou configurez PRISMA_DB_URL/POSTGRES_URL).",
      },
      { status: 503 },
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const prisma = await getPrismaOptional();
  if (!prisma) {
    return NextResponse.json(
      { error: "La base de données n’est pas configurée (PRISMA_DB_URL/POSTGRES_URL manquant)." },
      { status: 503 },
    );
  }

  try {
    const existing = (await prisma.mushroom.findUnique({ where: { id } })) as
      | { imageUrl?: string | null }
      | null;
    if (!existing) {
      return NextResponse.json(
        {
          error:
            "Champignon introuvable. Si vous venez d'installer le projet, exécutez: npm run db:push && npm run db:seed",
        },
        { status: 404 },
      );
    }

    await deleteIfManagedUpload(existing.imageUrl ?? null);

    const updated = (await prisma.mushroom.update({
      where: { id },
      data: { imageUrl: null },
    })) as { imageUrl?: string | null };

    return NextResponse.json({ imageUrl: updated.imageUrl ?? null });
  } catch {
    return NextResponse.json(
      {
        error:
          "La base de données n'est pas initialisée. Lancez: npm run db:push && npm run db:seed (ou configurez PRISMA_DB_URL/POSTGRES_URL).",
      },
      { status: 503 },
    );
  }
}

