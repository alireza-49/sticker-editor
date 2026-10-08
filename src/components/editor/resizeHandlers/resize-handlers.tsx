import { useCanvasStore } from "@/zustand/store";
import { cn } from "@/lib/utils"; // or "cn"
import React, { useRef } from "react";

type Props = {
  position: "top" | "left" | "right" | "bottom";
};

const MIN_SIZE = 50;

const ResizeHandler = ({ position }: Props) => {
  const api = useCanvasStore((state) => state.api);
  const isMoving = useRef(false);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    // 1. Lock all cursor movement to this handle until released
    e.currentTarget.setPointerCapture(e.pointerId);
    isMoving.current = true;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isMoving.current) return;
    const canvas = api?.getCanvas();
    if (!canvas) return;

    const currentWidth = canvas.getWidth();
    const currentHeight = canvas.getHeight();

    // 2. Correct delta calculations per direction
    if (position === "bottom") {
      const newHeight = Math.max(MIN_SIZE, currentHeight + e.movementY);
      canvas.setDimensions({ height: newHeight });
    } else if (position === "top") {
      const newHeight = Math.max(MIN_SIZE, currentHeight - e.movementY);
      canvas.setDimensions({ height: newHeight });
    } else if (position === "right") {
      const newWidth = Math.max(MIN_SIZE, currentWidth + e.movementX);
      canvas.setDimensions({ width: newWidth });
    } else if (position === "left") {
      const newWidth = Math.max(MIN_SIZE, currentWidth - e.movementX);
      canvas.setDimensions({ width: newWidth });
    }

    canvas.renderAll();
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    isMoving.current = false;
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={cn(
        "absolute z-10 touch-none flex items-center justify-center group",
        // Give the hit area slightly more padding so it's easier to grab
        {
          "w-full h-3 cursor-ns-resize left-0":
            position === "top" || position === "bottom",
          "h-full w-3 cursor-ew-resize top-0":
            position === "left" || position === "right",
        },
        {
          "top-0 -translate-y-1/2": position === "top",
          "bottom-0 translate-y-1/2": position === "bottom",
          "left-0 -translate-x-1/2": position === "left",
          "right-0 translate-x-1/2": position === "right",
        },
      )}
    >
      {/* Pill Handle Indicator */}
      <div
        className={cn(
          "rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow-sm",
          {
            "w-12 h-1.5": position === "top" || position === "bottom",
            "w-1.5 h-12": position === "left" || position === "right",
          },
        )}
      />
    </div>
  );
};

export const ResizeHandlers = () => {
  return (
    <>
      <ResizeHandler position='bottom' />
      <ResizeHandler position='left' />
      <ResizeHandler position='right' />
      <ResizeHandler position='top' />
    </>
  );
};

export default ResizeHandlers;
