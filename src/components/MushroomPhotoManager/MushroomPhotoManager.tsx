"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";

interface MushroomPhotoManagerProps {
  mushroomId: string;
  mushroomName: string;
  initialImageUrl: string | null;
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return "Une erreur est survenue.";
}

export function MushroomPhotoManager(props: MushroomPhotoManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(props.initialImageUrl);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const previewUrl = useMemo(() => {
    if (!selectedFile) return null;
    return URL.createObjectURL(selectedFile);
  }, [selectedFile]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  async function uploadSelectedFile() {
    if (!selectedFile) {
      setErrorMessage("Sélectionnez une image avant d’enregistrer.");
      return;
    }

    setErrorMessage(null);
    const formData = new FormData();
    formData.set("file", selectedFile);

    const response = await fetch(`/api/champignons/${props.mushroomId}/photo`, {
      method: "POST",
      body: formData,
    });

    const payload = (await response.json()) as { imageUrl?: string | null; error?: string };
    if (!response.ok) {
      throw new Error(payload.error ?? "Impossible d’enregistrer la photo.");
    }

    setSelectedFile(null);
    setImageUrl(payload.imageUrl ?? null);
    router.refresh();
  }

  async function deletePhoto() {
    setErrorMessage(null);
    const response = await fetch(`/api/champignons/${props.mushroomId}/photo`, {
      method: "DELETE",
    });

    const payload = (await response.json()) as { imageUrl?: string | null; error?: string };
    if (!response.ok) {
      throw new Error(payload.error ?? "Impossible de supprimer la photo.");
    }

    setSelectedFile(null);
    setImageUrl(null);
    router.refresh();
  }

  return (
    <div className="grid gap-3">
      <p className="text-xs text-zinc-600 dark:text-zinc-400">
        Formats supportés : jpg, png, webp, gif, avif (max 5 Mo).
      </p>

      <div className="grid gap-3 rounded-2xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-black">
        <label className="grid gap-1">
          <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Choisir une image
          </span>
          <input
            type="file"
            accept="image/*"
            disabled={isPending}
            onChange={(event) => {
              const file = event.currentTarget.files?.[0] ?? null;
              setSelectedFile(file);
              setErrorMessage(null);
            }}
            className="block w-full text-sm file:mr-4 file:rounded-full file:border-0 file:bg-black/5 file:px-4 file:py-2 file:text-sm file:font-medium file:text-zinc-900 hover:file:bg-black/10 dark:file:bg-white/10 dark:file:text-zinc-100 dark:hover:file:bg-white/15"
          />
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            disabled={isPending || !selectedFile}
            onClick={() => {
              startTransition(async () => {
                try {
                  await uploadSelectedFile();
                } catch (error) {
                  setErrorMessage(getErrorMessage(error));
                }
              });
            }}
            className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium text-background transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-zinc-200"
          >
            Enregistrer
          </button>

          <button
            type="button"
            disabled={isPending || !imageUrl}
            onClick={() => {
              startTransition(async () => {
                try {
                  await deletePhoto();
                } catch (error) {
                  setErrorMessage(getErrorMessage(error));
                }
              });
            }}
            className="inline-flex h-11 items-center justify-center rounded-full border border-black/10 px-5 text-sm font-medium text-zinc-900 transition-colors hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:text-zinc-100 dark:hover:bg-white/10"
          >
            Supprimer
          </button>
        </div>

        {errorMessage ? (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-800 dark:text-red-200">
            {errorMessage}
          </div>
        ) : null}
      </div>

      <div className="grid gap-2">
        <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
          Aperçu
        </p>
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-black/10 bg-zinc-50 dark:border-white/10 dark:bg-white/5">
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt={`Aperçu — ${props.mushroomName}`}
              fill
              sizes="(max-width: 640px) 100vw, 420px"
              className="object-cover"
            />
          ) : imageUrl ? (
            <Image
              src={imageUrl}
              alt={`Photo — ${props.mushroomName}`}
              fill
              sizes="(max-width: 640px) 100vw, 420px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center p-6 text-sm text-zinc-600 dark:text-zinc-400">
              Aucune photo pour le moment.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

