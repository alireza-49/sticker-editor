"use client";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import {
  Eye,
  EyeOff,
  ImageIcon,
  LucideIcon,
  Shapes,
  TextIcon,
  Trash2,
} from "lucide-react";
import { useCanvasStore } from "@/zustand/store";
import type { LayerType } from "@/zustand/store.types";

const TYPE_ICONS: Record<LayerType, LucideIcon> = {
  image: ImageIcon,
  text: TextIcon,
  shape: Shapes,
};

const Layers = () => {
  const layers = useCanvasStore((state) => state.layers);
  const activeLayerId = useCanvasStore((state) => state.activeLayerId);
  const api = useCanvasStore((state) => state.api);

  const activeLayer = layers.find((layer) => layer.id === activeLayerId) ?? null;
  const orderedLayers = [...layers].reverse();

  return (
    <div className='flex w-full flex-col gap-1'>
      <div className='px-2 pb-1 text-xs font-medium text-muted-foreground'>
        {activeLayer ? `Active: ${activeLayer.name}` : "No active layer"}
      </div>
      {orderedLayers.map((layer) => {
        const Icon = TYPE_ICONS[layer.type];
        const isActive = layer.id === activeLayerId;
        return (
          <Item
            key={layer.id}
            variant={isActive ? "muted" : "default"}
            size='sm'
            className='cursor-pointer'
            onClick={() => api?.selectObject(layer.id)}
          >
            <ItemMedia variant='icon'>
              <Icon />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{layer.name}</ItemTitle>
              <ItemDescription>{layer.type} layer</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button
                variant='ghost'
                size='icon-sm'
                aria-label='Toggle visibility'
                onClick={(event) => {
                  event.stopPropagation();
                  api?.setLayerVisibility(layer.id, !layer.visible);
                }}
              >
                {layer.visible ? <Eye /> : <EyeOff />}
              </Button>
              <Button
                variant='destructive'
                size='icon-sm'
                aria-label='Delete layer'
                onClick={(event) => {
                  event.stopPropagation();
                  api?.removeObject(layer.id);
                }}
              >
                <Trash2 />
              </Button>
            </ItemActions>
          </Item>
        );
      })}
      {layers.length === 0 && (
        <div className='px-2 py-2 text-sm text-muted-foreground'>
          No layers yet. Add shapes, text or images to the canvas.
        </div>
      )}
    </div>
  );
};

export default Layers;
