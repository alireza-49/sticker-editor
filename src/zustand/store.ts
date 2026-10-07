import { create } from "zustand";
import type { StateType } from "./store.types";

export const useCanvasStore = create<StateType>()((set) => ({
  api: null,
  layers: [],
  activeLayerId: null,
  history: [],
  historyIndex: -1,
  canUndo: false,
  canRedo: false,
  imports: [],
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
}));
