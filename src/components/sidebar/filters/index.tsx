"use client";

import { Button } from "@/components/ui/button";
import {
  Item,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { CANVAS_FILTERS } from "@/hooks/use-canvas";
import { useCanvasStore } from "@/zustand/store";
import { Wand2 } from "lucide-react";

type FiltersMenuProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const FiltersMenu = ({ open, onOpenChange }: FiltersMenuProps) => {
  const api = useCanvasStore((state) => state.api);
  const activeLayerId = useCanvasStore((state) => state.activeLayerId);
  const canApply = activeLayerId ? (api?.hasActiveImage() ?? false) : false;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side='right'>
        <SheetHeader>
          <SheetTitle>Filters / Effects</SheetTitle>
          <SheetDescription>
            {canApply
              ? "Apply a filter to the selected image"
              : "Select an image on the canvas to apply filters"}
          </SheetDescription>
        </SheetHeader>
        <div className='flex flex-col gap-2 overflow-y-auto px-6 pb-6'>
          <Button
            variant='outline'
            onClick={() => api?.clearFilters()}
            disabled={!canApply}
          >
            Reset filters
          </Button>
          {CANVAS_FILTERS.map((filter) => (
            <Item
              key={filter.name}
              variant='outline'
              size='sm'
              className={
                canApply ? "cursor-pointer" : "cursor-not-allowed opacity-50"
              }
              onClick={() => {
                if (canApply) api?.applyFilter(filter.name);
              }}
            >
              <ItemMedia variant='icon'>
                <Wand2 />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{filter.label}</ItemTitle>
              </ItemContent>
            </Item>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FiltersMenu;
