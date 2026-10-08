import {
  Canvas,
  Circle,
  Ellipse,
  FabricObject,
  FabricText,
  Image,
  Line,
  Rect,
  Triangle,
  filters,
} from "fabric";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useCanvasStore } from "@/zustand/store";
import type { Layer, LayerType } from "@/zustand/store.types";

export interface CanvasFilterDefinition {
  name: string;
  label: string;
  Filter: new (options?: Record<string, unknown>) => filters.BaseFilter<string>;
  defaults?: Record<string, unknown>;
}

export const CANVAS_FILTERS: CanvasFilterDefinition[] = [
  { name: "grayscale", label: "Grayscale", Filter: filters.Grayscale },
  { name: "sepia", label: "Sepia", Filter: filters.Sepia },
  { name: "invert", label: "Invert", Filter: filters.Invert },
  { name: "blackwhite", label: "Black & White", Filter: filters.BlackWhite },
  { name: "brownie", label: "Brownie", Filter: filters.Brownie },
  { name: "vintage", label: "Vintage", Filter: filters.Vintage },
  { name: "polaroid", label: "Polaroid", Filter: filters.Polaroid },
  { name: "kodachrome", label: "Kodachrome", Filter: filters.Kodachrome },
  { name: "technicolor", label: "Technicolor", Filter: filters.Technicolor },
  {
    name: "vibrance",
    label: "Vibrance",
    Filter: filters.Vibrance,
    defaults: { vibrance: 0.3 },
  },
  {
    name: "brightness",
    label: "Brightness",
    Filter: filters.Brightness,
    defaults: { brightness: 0.15 },
  },
  {
    name: "contrast",
    label: "Contrast",
    Filter: filters.Contrast,
    defaults: { contrast: 0.2 },
  },
  {
    name: "saturation",
    label: "Saturation",
    Filter: filters.Saturation,
    defaults: { saturation: 0.25 },
  },
  {
    name: "hueRotation",
    label: "Hue Rotate",
    Filter: filters.HueRotation,
    defaults: { rotation: 0.5 },
  },
  {
    name: "blur",
    label: "Blur",
    Filter: filters.Blur,
    defaults: { blur: 0.4 },
  },
  {
    name: "noise",
    label: "Noise",
    Filter: filters.Noise,
    defaults: { noise: 40 },
  },
  {
    name: "pixelate",
    label: "Pixelate",
    Filter: filters.Pixelate,
    defaults: { blocksize: 8 },
  },
];

export interface CanvasAPI {
  addRect: (options?: Record<string, unknown>) => void;
  addCircle: (options?: Record<string, unknown>) => void;
  addTriangle: (options?: Record<string, unknown>) => void;
  addLine: (options?: Record<string, unknown>) => void;
  addEllipse: (options?: Record<string, unknown>) => void;
  addText: (text: string, options?: Record<string, unknown>) => void;
  addImage: (url: string, options?: Record<string, unknown>) => void;
  deleteSelected: () => void;
  bringForward: () => void;
  sendBackward: () => void;
  bringToFront: () => void;
  sendToBack: () => void;
  setBackgroundColor: (color: string) => void;
  clearCanvas: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  zoomReset: () => void;
  exportJSON: () => string;
  importJSON: (json: string) => void;
  saveState: () => string;
  undo: () => void;
  redo: () => void;
  deselectAll: () => void;
  getActiveObject: () => FabricObject | null;
  getActiveObjects: () => FabricObject[];
  getCanvas: () => Canvas | null;
  applyFilter: (name: string, options?: Record<string, unknown>) => void;
  clearFilters: () => void;
  getActiveFilters: () => string[];
  hasActiveImage: () => boolean;
  selectObject: (id: string) => void;
  removeObject: (id: string) => void;
  setLayerVisibility: (id: string, visible: boolean) => void;
}

export interface UseCanvasOptions {
  width?: number;
  height?: number;
  backgroundColor?: string;
}

export interface UseCanvasReturn {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  fabricCanvas: Canvas | null;
  api: CanvasAPI;
}

export const DEFAULT_CANVAS_WIDTH = 800;
export const DEFAULT_CANVAS_HEIGHT = 600;
const DEFAULT_BG_COLOR = "#ffffff";
const ZOOM_STEP = 0.15;
const MAX_ZOOM = 5;
const MIN_ZOOM = 0.1;
const MAX_HISTORY = 50;

const LAYER_TYPE_LABELS: Record<LayerType, string> = {
  image: "Image",
  text: "Text",
  shape: "Shape",
};

export function useCanvas(options: UseCanvasOptions = {}): UseCanvasReturn {
  const {
    width = DEFAULT_CANVAS_WIDTH,
    height = DEFAULT_CANVAS_HEIGHT,
    backgroundColor = DEFAULT_BG_COLOR,
  } = options;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [fabricCanvas, setFabricCanvas] = useState<Canvas | null>(null);
  const historyRef = useRef<string[]>([]);
  const historyIndexRef = useRef<number>(-1);
  const isRestoringRef = useRef(false);
  const objectIdsRef = useRef(new WeakMap<FabricObject, string>());

  const getObjectId = useCallback((obj: FabricObject): string => {
    const ids = objectIdsRef.current;
    let id = ids.get(obj);
    if (!id) {
      id = crypto.randomUUID();
      ids.set(obj, id);
    }
    return id;
  }, []);

  const getLayerType = useCallback((obj: FabricObject): LayerType => {
    if (obj instanceof Image) return "image";
    if (obj instanceof FabricText) return "text";
    return "shape";
  }, []);

  const pushStateToHistory = useCallback((canvas: Canvas) => {
    const serialized = JSON.stringify(canvas.toJSON());
    historyRef.current = historyRef.current.slice(
      0,
      historyIndexRef.current + 1,
    );
    historyRef.current.push(serialized);
    historyIndexRef.current += 1;
    if (historyRef.current.length > MAX_HISTORY) {
      historyRef.current.shift();
      historyIndexRef.current -= 1;
    }
    useCanvasStore
      .getState()
      .setHistory([...historyRef.current], historyIndexRef.current);
  }, []);

  const syncLayersToStore = useCallback(
    (canvas: Canvas) => {
      const objects = canvas.getObjects();
      const counts: Record<LayerType, number> = { image: 0, text: 0, shape: 0 };
      const active = canvas.getActiveObject();
      const layers: Layer[] = objects.map((obj) => {
        const type = getLayerType(obj);
        counts[type] += 1;
        return {
          id: getObjectId(obj),
          name: `${LAYER_TYPE_LABELS[type]} ${counts[type]}`,
          type,
          visible: obj.visible !== false,
          active: obj === active,
        };
      });
      const store = useCanvasStore.getState();
      store.setLayers(layers);
      store.setActiveLayerId(active ? getObjectId(active) : null);
    },
    [getObjectId, getLayerType],
  );

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = new Canvas(canvasRef.current, {
      width,
      height,
      backgroundColor,
      preserveObjectStacking: true,
    });

    const onObjectChange = () => {
      if (!isRestoringRef.current) pushStateToHistory(canvas);
    };
    const onStructureChange = () => {
      if (!isRestoringRef.current) syncLayersToStore(canvas);
    };
    const onSelectionChange = () => {
      syncLayersToStore(canvas);
    };

    canvas.on("object:added", onObjectChange);
    canvas.on("object:removed", onObjectChange);
    canvas.on("object:modified", onObjectChange);
    canvas.on("object:added", onStructureChange);
    canvas.on("object:removed", onStructureChange);
    canvas.on("object:modified", onStructureChange);
    canvas.on("selection:created", onSelectionChange);
    canvas.on("selection:updated", onSelectionChange);
    canvas.on("selection:cleared", onSelectionChange);

    setFabricCanvas(canvas);
    pushStateToHistory(canvas);
    syncLayersToStore(canvas);

    return () => {
      canvas.off("object:added", onObjectChange);
      canvas.off("object:removed", onObjectChange);
      canvas.off("object:modified", onObjectChange);
      canvas.off("object:added", onStructureChange);
      canvas.off("object:removed", onStructureChange);
      canvas.off("object:modified", onStructureChange);
      canvas.off("selection:created", onSelectionChange);
      canvas.off("selection:updated", onSelectionChange);
      canvas.off("selection:cleared", onSelectionChange);
      canvas.dispose();
      setFabricCanvas(null);
      const store = useCanvasStore.getState();
      store.setLayers([]);
      store.setActiveLayerId(null);
      store.setHistory([], -1);
    };
  }, [width, height, backgroundColor, pushStateToHistory, syncLayersToStore]);

  const api: CanvasAPI = useMemo(
    () => ({
      addRect: (options = {}) => {
        if (!fabricCanvas) return;
        const rect = new Rect({
          left: 50,
          top: 50,
          width: 100,
          height: 80,
          fill: "#3b82f6",
          ...options,
        });
        fabricCanvas.add(rect);
        fabricCanvas.setActiveObject(rect);
        fabricCanvas.requestRenderAll();
      },

      addCircle: (options = {}) => {
        if (!fabricCanvas) return;
        const circle = new Circle({
          left: 100,
          top: 100,
          radius: 50,
          fill: "#ef4444",
          ...options,
        });
        fabricCanvas.add(circle);
        fabricCanvas.setActiveObject(circle);
        fabricCanvas.requestRenderAll();
      },

      addTriangle: (options = {}) => {
        if (!fabricCanvas) return;
        const triangle = new Triangle({
          left: 80,
          top: 80,
          width: 100,
          height: 100,
          fill: "#10b981",
          ...options,
        });
        fabricCanvas.add(triangle);
        fabricCanvas.setActiveObject(triangle);
        fabricCanvas.requestRenderAll();
      },

      addLine: (options = {}) => {
        if (!fabricCanvas) return;
        const line = new Line([0, 0, 150, 150], {
          stroke: "#6b7280",
          strokeWidth: 3,
          ...options,
        });
        fabricCanvas.add(line);
        fabricCanvas.setActiveObject(line);
        fabricCanvas.requestRenderAll();
      },

      addEllipse: (options = {}) => {
        if (!fabricCanvas) return;
        const ellipse = new Ellipse({
          left: 80,
          top: 60,
          rx: 60,
          ry: 40,
          fill: "#f59e0b",
          ...options,
        });
        fabricCanvas.add(ellipse);
        fabricCanvas.setActiveObject(ellipse);
        fabricCanvas.requestRenderAll();
      },

      addText: (text, options = {}) => {
        if (!fabricCanvas) return;
        const fabricText = new FabricText(text, {
          left: 100,
          top: 100,
          fontSize: 24,
          fill: "#000000",
          ...options,
        });
        fabricCanvas.add(fabricText);
        fabricCanvas.setActiveObject(fabricText);
        fabricCanvas.requestRenderAll();
      },

      addImage: (url, options = {}) => {
        if (!fabricCanvas) return;
        Image.fromURL(url, {}, options)
          .then((img) => {
            img.set({ left: 100, top: 100, ...options });
            fabricCanvas.add(img);
            fabricCanvas.setActiveObject(img);
            fabricCanvas.requestRenderAll();
          })
          .catch(() => undefined);
      },

      deleteSelected: () => {
        if (!fabricCanvas) return;
        const activeObjects = fabricCanvas.getActiveObjects();
        if (activeObjects.length === 0) return;
        isRestoringRef.current = true;
        fabricCanvas.remove(...activeObjects);
        fabricCanvas.discardActiveObject();
        isRestoringRef.current = false;
        fabricCanvas.requestRenderAll();
        pushStateToHistory(fabricCanvas);
        syncLayersToStore(fabricCanvas);
      },

      bringForward: () => {
        if (!fabricCanvas) return;
        const activeObject = fabricCanvas.getActiveObject();
        if (!activeObject) return;
        fabricCanvas.bringObjectForward(activeObject);
        fabricCanvas.requestRenderAll();
        pushStateToHistory(fabricCanvas);
        syncLayersToStore(fabricCanvas);
      },

      sendBackward: () => {
        if (!fabricCanvas) return;
        const activeObject = fabricCanvas.getActiveObject();
        if (!activeObject) return;
        fabricCanvas.sendObjectBackwards(activeObject);
        fabricCanvas.requestRenderAll();
        pushStateToHistory(fabricCanvas);
        syncLayersToStore(fabricCanvas);
      },

      bringToFront: () => {
        if (!fabricCanvas) return;
        const activeObject = fabricCanvas.getActiveObject();
        if (!activeObject) return;
        fabricCanvas.moveObjectTo(
          activeObject,
          fabricCanvas.getObjects().length - 1,
        );
        fabricCanvas.requestRenderAll();
        pushStateToHistory(fabricCanvas);
        syncLayersToStore(fabricCanvas);
      },

      sendToBack: () => {
        if (!fabricCanvas) return;
        const activeObject = fabricCanvas.getActiveObject();
        if (!activeObject) return;
        fabricCanvas.moveObjectTo(activeObject, 0);
        fabricCanvas.requestRenderAll();
        pushStateToHistory(fabricCanvas);
        syncLayersToStore(fabricCanvas);
      },

      setBackgroundColor: (color) => {
        if (!fabricCanvas) return;
        fabricCanvas.set({ backgroundColor: color });
        fabricCanvas.requestRenderAll();
        pushStateToHistory(fabricCanvas);
      },

      clearCanvas: () => {
        if (!fabricCanvas) return;
        isRestoringRef.current = true;
        fabricCanvas.clear();
        isRestoringRef.current = false;
        fabricCanvas.set({ backgroundColor });
        fabricCanvas.requestRenderAll();
        historyRef.current = [];
        historyIndexRef.current = -1;
        pushStateToHistory(fabricCanvas);
        syncLayersToStore(fabricCanvas);
      },

      zoomIn: () => {
        if (!fabricCanvas) return;
        const zoom = fabricCanvas.getZoom();
        fabricCanvas.setZoom(Math.min(zoom * (1 + ZOOM_STEP), MAX_ZOOM));
        fabricCanvas.requestRenderAll();
      },

      zoomOut: () => {
        if (!fabricCanvas) return;
        const zoom = fabricCanvas.getZoom();
        fabricCanvas.setZoom(Math.max(zoom / (1 + ZOOM_STEP), MIN_ZOOM));
        fabricCanvas.requestRenderAll();
      },

      zoomReset: () => {
        if (!fabricCanvas) return;
        fabricCanvas.setZoom(1);
        fabricCanvas.requestRenderAll();
      },

      exportJSON: () => {
        if (!fabricCanvas) return "";
        return JSON.stringify(fabricCanvas.toJSON());
      },

      importJSON: (json) => {
        if (!fabricCanvas) return;
        isRestoringRef.current = true;
        fabricCanvas.loadFromJSON(json, () => {
          isRestoringRef.current = false;
          fabricCanvas.requestRenderAll();
          pushStateToHistory(fabricCanvas);
          syncLayersToStore(fabricCanvas);
        });
      },

      saveState: () => {
        if (!fabricCanvas) return "";
        return JSON.stringify(fabricCanvas.toJSON());
      },

      undo: () => {
        if (historyIndexRef.current <= 0) return;
        historyIndexRef.current -= 1;
        const prevState = historyRef.current[historyIndexRef.current];
        if (!fabricCanvas || !prevState) return;
        isRestoringRef.current = true;
        fabricCanvas.loadFromJSON(JSON.parse(prevState), () => {
          isRestoringRef.current = false;
          fabricCanvas.requestRenderAll();
          syncLayersToStore(fabricCanvas);
          useCanvasStore
            .getState()
            .setHistory([...historyRef.current], historyIndexRef.current);
        });
      },

      redo: () => {
        if (historyIndexRef.current >= historyRef.current.length - 1) return;
        historyIndexRef.current += 1;
        const nextState = historyRef.current[historyIndexRef.current];
        if (!fabricCanvas || !nextState) return;
        isRestoringRef.current = true;
        fabricCanvas.loadFromJSON(JSON.parse(nextState), () => {
          isRestoringRef.current = false;
          fabricCanvas.requestRenderAll();
          syncLayersToStore(fabricCanvas);
          useCanvasStore
            .getState()
            .setHistory([...historyRef.current], historyIndexRef.current);
        });
      },

      deselectAll: () => {
        if (!fabricCanvas) return;
        fabricCanvas.discardActiveObject();
        fabricCanvas.requestRenderAll();
      },

      getActiveObject: () => fabricCanvas?.getActiveObject() ?? null,
      getActiveObjects: () => fabricCanvas?.getActiveObjects() ?? [],
      getCanvas: () => fabricCanvas,

      applyFilter: (name, options = {}) => {
        if (!fabricCanvas) return;
        const definition = CANVAS_FILTERS.find(
          (filter) => filter.name === name,
        );
        if (!definition) return;
        const activeObject = fabricCanvas.getActiveObject();
        if (!(activeObject instanceof Image)) return;
        const filter = new definition.Filter({
          ...definition.defaults,
          ...options,
        });
        const filters = [...activeObject.filters];
        const existingIndex = filters.findIndex(
          (existing) => existing instanceof definition.Filter,
        );
        if (existingIndex >= 0) {
          filters[existingIndex] = filter;
        } else {
          filters.push(filter);
        }
        activeObject.set({ filters });
        activeObject.applyFilters();
        activeObject.setCoords();
        fabricCanvas.requestRenderAll();
        pushStateToHistory(fabricCanvas);
      },

      clearFilters: () => {
        if (!fabricCanvas) return;
        const activeObject = fabricCanvas.getActiveObject();
        if (!(activeObject instanceof Image)) return;
        activeObject.set({ filters: [] });
        activeObject.applyFilters();
        activeObject.setCoords();
        fabricCanvas.requestRenderAll();
        pushStateToHistory(fabricCanvas);
      },

      getActiveFilters: () => {
        const activeObject = fabricCanvas?.getActiveObject();
        if (!(activeObject instanceof Image)) return [];
        return activeObject.filters.map((filter) => filter.type);
      },

      hasActiveImage: () => {
        const activeObject = fabricCanvas?.getActiveObject();
        return activeObject instanceof Image;
      },

      selectObject: (id) => {
        if (!fabricCanvas) return;
        const target = fabricCanvas
          .getObjects()
          .find((obj) => getObjectId(obj) === id);
        if (!target) return;
        fabricCanvas.setActiveObject(target);
        fabricCanvas.requestRenderAll();
      },

      removeObject: (id) => {
        if (!fabricCanvas) return;
        const target = fabricCanvas
          .getObjects()
          .find((obj) => getObjectId(obj) === id);
        if (!target) return;
        fabricCanvas.remove(target);
        fabricCanvas.requestRenderAll();
      },

      setLayerVisibility: (id, visible) => {
        if (!fabricCanvas) return;
        const target = fabricCanvas
          .getObjects()
          .find((obj) => getObjectId(obj) === id);
        if (!target) return;
        target.set({ visible });
        fabricCanvas.requestRenderAll();
        pushStateToHistory(fabricCanvas);
        syncLayersToStore(fabricCanvas);
      },
    }),
    [
      fabricCanvas,
      backgroundColor,
      pushStateToHistory,
      syncLayersToStore,
      getObjectId,
    ],
  );

  useEffect(() => {
    useCanvasStore.getState().setApi(api);
    return () => {
      useCanvasStore.getState().setApi(null);
    };
  }, [api]);

  return { canvasRef, fabricCanvas, api };
}
