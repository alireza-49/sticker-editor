"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Download,
  ImagePlus,
  Images,
  Link,
  Trash2,
  Upload,
} from "lucide-react";
import { useCanvasStore } from "@/zustand/store";
import type { StoredImageType } from "@/zustand/store.types";

type AddMode = "url" | "file";

const readFileAsDataURL = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

const Assests = () => {
  const images = useCanvasStore((state) => state.images);
  const api = useCanvasStore((state) => state.api);
  const addImage = useCanvasStore((state) => state.addImage);
  const removeImage = useCanvasStore((state) => state.removeImage);
  const loadImages = useCanvasStore((state) => state.loadImages);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [mode, setMode] = useState<AddMode>("url");
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    loadImages();
  }, [loadImages]);

  const resetForm = () => {
    setMode("url");
    setUrl("");
    setName("");
    setFile(null);
  };

  const handleAdd = async () => {
    if (mode === "url") {
      const trimmed = url.trim();
      if (!trimmed) return;
      addImage({
        id: crypto.randomUUID(),
        name: name.trim() || trimmed.split("/").pop()?.split("?")[0] || "Image",
        src: trimmed,
        type: "url",
      });
    } else {
      if (!file) return;
      const src = await readFileAsDataURL(file);
      addImage({
        id: crypto.randomUUID(),
        name: name.trim() || file.name,
        src,
        type: "base64",
      });
    }
    resetForm();
    setDialogOpen(false);
  };

  const handleDownload = async (image: StoredImageType) => {
    if (image.type === "base64") {
      const anchor = document.createElement("a");
      anchor.href = image.src;
      anchor.download = image.name;
      anchor.click();
      return;
    }
    try {
      const response = await fetch(image.src);
      if (!response.ok) throw new Error("Failed to fetch image");
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = image.name;
      anchor.click();
      URL.revokeObjectURL(objectUrl);
    } catch {
      window.open(image.src, "_blank");
    }
  };

  const handleAddToCanvas = (image: StoredImageType) => {
    api?.addImage(image.src);
  };

  const canAdd = mode === "url" ? url.trim().length > 0 : file !== null;

  return (
    <div className='flex flex-col gap-3 overflow-hidden'>
      <div className='flex items-center justify-between'>
        <span className='text-xs font-medium text-muted-foreground'>
          {images.length} image{images.length === 1 ? "" : "s"}
        </span>
        <Button size='sm' onClick={() => setDialogOpen(true)}>
          <ImagePlus />
          Add
        </Button>
      </div>

      {images.length === 0 ? (
        <div className='flex flex-col items-center gap-2 rounded-lg border border-dashed border-border py-8 text-center'>
          <Images className='size-6 text-muted-foreground' />
          <p className='text-sm text-muted-foreground'>
            No images yet. Add one to get started.
          </p>
        </div>
      ) : (
        <div className='grid grid-cols-2 gap-2'>
          {images.map((image) => (
            <div
              key={image.id}
              className='group relative overflow-hidden rounded-lg border border-border'
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- user-provided URLs and base64 data URLs are not compatible with next/image */}
              <img
                src={image.src}
                alt={image.name}
                className='aspect-square w-full cursor-pointer object-cover'
                onClick={() => handleAddToCanvas(image)}
                title='Click to add to canvas'
              />
              <div className='absolute inset-0 flex items-center justify-center gap-1 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100'>
                <Button
                  size='icon-sm'
                  variant='secondary'
                  onClick={() => handleAddToCanvas(image)}
                  aria-label='Add to canvas'
                >
                  <ImagePlus />
                </Button>
                <Button
                  size='icon-sm'
                  variant='secondary'
                  onClick={() => handleDownload(image)}
                  aria-label='Download image'
                >
                  <Download />
                </Button>
                <Button
                  size='icon-sm'
                  variant='destructive'
                  onClick={() => removeImage(image.id)}
                  aria-label='Delete image'
                >
                  <Trash2 />
                </Button>
              </div>
              <span className='absolute bottom-1 left-1 max-w-[calc(100%-0.5rem)] truncate rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-white'>
                {image.name}
              </span>
            </div>
          ))}
        </div>
      )}

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add image</DialogTitle>
            <DialogDescription>
              Add an image from a URL or upload one from your computer.
            </DialogDescription>
          </DialogHeader>

          <div className='flex gap-1 rounded-lg bg-muted p-1'>
            <Button
              size='sm'
              variant={mode === "url" ? "secondary" : "ghost"}
              className='flex-1'
              onClick={() => setMode("url")}
            >
              <Link />
              URL
            </Button>
            <Button
              size='sm'
              variant={mode === "file" ? "secondary" : "ghost"}
              className='flex-1'
              onClick={() => setMode("file")}
            >
              <Upload />
              Upload
            </Button>
          </div>

          {mode === "url" ? (
            <Input
              placeholder='https://example.com/image.png'
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") handleAdd();
              }}
            />
          ) : (
            <div className='flex flex-col gap-2'>
              <Input
                type='file'
                accept='image/*'
                onChange={(event) => {
                  setFile(event.target.files?.[0] ?? null);
                  event.target.value = "";
                }}
              />
              {file && (
                <p className='text-xs text-muted-foreground'>
                  Selected: {file.name}
                </p>
              )}
            </div>
          )}

          <Input
            placeholder='Name (optional)'
            value={name}
            onChange={(event) => setName(event.target.value)}
          />

          <DialogFooter>
            <Button variant='outline' onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdd} disabled={!canAdd}>
              Add image
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Assests;
