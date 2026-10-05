// enum LayerTypes {
//   IMAGE = "image",
//   SVG = "svg",
//   TEXT = "text",
//   SHAPE = "shape",
//   PATH = "path",
// }

import { create } from "zustand";

// type ImageLayer = {
//   type: LayerTypes.IMAGE;
//   file: Blob;
//   crop: [number, number, number, number];
//   rotaition: number;
//   filter: string;
//   opacity: number;
// };

// type SvgLayer = {
//   type: LayerTypes.SVG;
//   code : string;
//   crop: [number, number, number, number];
//   rotaition: number;
//   filter: string;
//   opacity: number;
// };

// type PathLayer = {
//   type: LayerTypes.PATH;
//   code: string;
//   crop: [number, number, number, number];
//   rotaition: number;
//   filter: string;
//   opacity: number;
// };

type LayersType = {
  fabricState: string;
};

type ImportedImageType = {
  name: string;
  file: Blob;
  id: string;
};

type ImportedSvgType = {
  name: string;
  code: string;
  id: string;
};
type ImportedFileType = ImportedImageType | ImportedSvgType;

type StateType = {
  layers: Layers;
  imports: ImportedFileType[];
};

export {
  ImportedImageType,
  ImportedSvgType,
  LayersType,
  StateType,
  ImportedFileType,
};
