import { create } from "zustand";
import type { StateType, StoredImageType } from "./store.types";

const IMAGES_STORAGE_KEY = "sticker-editor-images";

const loadPersistedImages = (): StoredImageType[] => {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(IMAGES_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredImageType[]) : [];
  } catch {
    return [];
  }
};

const persistImages = (images: StoredImageType[]) => {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(IMAGES_STORAGE_KEY, JSON.stringify(images));
  } catch {
    // storage unavailable or quota exceeded
  }
};

export const useCanvasStore = create<StateType>()((set) => ({
  api: null,
  layers: [],
  activeLayerId: null,
  history: [],
  historyIndex: -1,
  canUndo: false,
  canRedo: false,
  imports: [],
  images: [],
  setApi: (api) => set({ api }),
  setLayers: (layers) => set({ layers }),
  setActiveLayerId: (activeLayerId) => set({ activeLayerId }),
  setHistory: (history, historyIndex) =>
    set({
      history,
      historyIndex,
      canUndo: historyIndex > 0,
      canRedo: historyIndex < history.length - 1,
    }),
  importFile: (file) => set((state) => ({ imports: [...state.imports, file] })),
  removeFile: (id) =>
    set((state) => ({ imports: state.imports.filter((file) => file.id !== id) })),
  addImage: (image) =>
    set((state) => {
      const images = [...state.images, image];
      persistImages(images);
      return { images };
    }),
  removeImage: (id) =>
    set((state) => {
      const images = state.images.filter((image) => image.id !== id);
      persistImages(images);
      return { images };
    }),
  loadImages: () => set({ images: loadPersistedImages() }),
}));
