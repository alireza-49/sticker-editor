import type { CanvasAPI } from "@/hooks/use-canvas";

export type LayerType = "image" | "text" | "shape";

export type Layer = {
  id: string;
  name: string;
  type: LayerType;
  visible: boolean;
  active: boolean;
};

export type ImportedImageType = {
  name: string;
  file: Blob;
  id: string;
};

export type ImportedSvgType = {
  name: string;
  code: string;
  id: string;
};

export type ImportedFileType = ImportedImageType | ImportedSvgType;

export type StoredImageType = {
  id: string;
  name: string;
  src: string;
  type: "base64" | "url";
};

export type StateType = {
  api: CanvasAPI | null;
  layers: Layer[];
  activeLayerId: string | null;
  history: string[];
  historyIndex: number;
  canUndo: boolean;
  canRedo: boolean;
  imports: ImportedFileType[];
  images: StoredImageType[];
  setApi: (api: CanvasAPI | null) => void;
  setLayers: (layers: Layer[]) => void;
  setActiveLayerId: (id: string | null) => void;
  setHistory: (history: string[], historyIndex: number) => void;
  importFile: (file: ImportedFileType) => void;
  removeFile: (id: string) => void;
  addImage: (image: StoredImageType) => void;
  removeImage: (id: string) => void;
  loadImages: () => void;
};
