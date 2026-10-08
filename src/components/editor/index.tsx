"use client";
import {
  DEFAULT_CANVAS_WIDTH,
  DEFAULT_CANVAS_HEIGHT,
  useCanvas,
} from "@/hooks/use-canvas";
import ResizeHandlers from "./resizeHandlers/resize-handlers";

const Editor = () => {
  const { canvasRef } = useCanvas();

  return (
    <div className='flex items-center justify-center'>
      {/* For resize handlers */}
      <div className='w-fit h-fit relative overflow-visible'>
        <ResizeHandlers />
        <canvas
          style={{
            width: DEFAULT_CANVAS_WIDTH,
            height: DEFAULT_CANVAS_HEIGHT,
            borderRadius: "8px",
            backgroundColor: "#222",
          }}
          ref={canvasRef}
        />
      </div>
    </div>
  );
};

export default Editor;
