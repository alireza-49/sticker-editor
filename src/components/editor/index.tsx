"use client";
import { useCanvas } from "@/hooks/use-canvas";

const createSampleImage = () => {
  const canvas = document.createElement("canvas");
  canvas.width = 240;
  canvas.height = 160;
  const context = canvas.getContext("2d");
  if (!context) return "";
  const gradient = context.createLinearGradient(0, 0, 240, 160);
  gradient.addColorStop(0, "#f472b6");
  gradient.addColorStop(0.5, "#a78bfa");
  gradient.addColorStop(1, "#38bdf8");
  context.fillStyle = gradient;
  context.fillRect(0, 0, 240, 160);
  context.fillStyle = "rgba(255, 255, 255, 0.9)";
  context.font = "bold 28px sans-serif";
  context.fillText("sticker", 52, 92);
  return canvas.toDataURL("image/png");
};

const Editor = () => {
  const { canvasRef, api } = useCanvas({ width: 600, height: 400 });

  const addRectangle = () => {
    api.addRect({
      left: 0,
      top: 0,
      fill: "#fff",
      width: 600,
      height: 400,
      rx: 8,
      ry: 8,
    });
  };

  const addCircle = () => {
    api.addCircle({ left: 250, top: 120, fill: "#ef4444", radius: 40 });
  };

  const addImage = () => {
    api.addImage(createSampleImage());
  };

  const deleteSelected = () => {
    api.deleteSelected();
  };

  return (
    <>
      <div className='flex gap-2 ml-128'>
        <button onClick={addRectangle}>add rect</button>
        <button onClick={addCircle}>add circle</button>
        <button onClick={addImage}>add image</button>
        <button onClick={deleteSelected}>delete</button>
      </div>
      <div className='w-full h-full flex justify-center items-center'>
        <canvas ref={canvasRef} />
      </div>
    </>
  );
};

export default Editor;
