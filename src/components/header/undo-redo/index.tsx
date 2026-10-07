"use client";
import { Button } from "@/components/ui/button";
import { Redo, Undo } from "lucide-react";
import { useCanvasStore } from "@/zustand/store";

const UndoRedo = () => {
  const api = useCanvasStore((state) => state.api);
  const canUndo = useCanvasStore((state) => state.canUndo);
  const canRedo = useCanvasStore((state) => state.canRedo);

  return (
    <div className='flex items-center justify-center gap-2'>
      <Button
        variant='ghost'
        onClick={() => api?.undo()}
        disabled={!canUndo}
      >
        <Undo data-icon='inline-end' />
        Undo
      </Button>
      <Button
        variant='ghost'
        onClick={() => api?.redo()}
        disabled={!canRedo}
      >
        <Redo data-icon='inline-start' />
        Redo
      </Button>
    </div>
  );
};

export default UndoRedo;
