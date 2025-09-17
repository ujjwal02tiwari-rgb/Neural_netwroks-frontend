"use client";

import { useRef, useState, useEffect } from "react";

export default function InferencePage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [prediction, setPrediction] = useState<string>("—");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 15;
    ctx.strokeStyle = "black";

    ctxRef.current = ctx;
  }, []);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const { offsetX, offsetY } = getCoords(e);
    ctxRef.current?.beginPath();
    ctxRef.current?.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const { offsetX, offsetY } = getCoords(e);
    ctxRef.current?.lineTo(offsetX, offsetY);
    ctxRef.current?.stroke();
  };

  const stopDrawing = () => {
    ctxRef.current?.closePath();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas && ctxRef.current) {
      ctxRef.current.clearRect(0, 0, canvas.width, canvas.height);
      setPrediction("—");
    }
  };

  const getCoords = (e: any) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    if (e.touches) {
      clientX = e.touches[0].clientX - rect.left;
      clientY = e.touches[0].clientY - rect.top;
    } else {
      clientX = e.nativeEvent.offsetX;
      clientY = e.nativeEvent.offsetY;
    }
    return { offsetX: clientX, offsetY: clientY };
  };

  const predict = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const blob: Blob = await new Promise((resolve) =>
      canvas.toBlob((b) => resolve(b!), "image/png")
    );

    const formData = new FormData();
    formData.append("file", blob, "digit.png");

    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_API_URL
          ? `${process.env.NEXT_PUBLIC_API_URL}/predict`
          : "http://localhost:8080/predict",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) {
        throw new Error(`Prediction failed: ${res.status}`);
      }

      const data = await res.json();
      setPrediction(`${data.label} (score: ${data.score.toFixed(2)})`);
    } catch (err) {
      console.error("Prediction error:", err);
      setPrediction("Error");
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-xl font-bold mb-2">Draw a digit</h1>
      <canvas
        ref={canvasRef}
        width={280}
        height={280}
        className="border bg-white"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />
      <div className="flex gap-2">
        <button
          onClick={predict}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Predict
        </button>
        <button
          onClick={clearCanvas}
          className="bg-gray-700 text-white px-4 py-2 rounded"
        >
          Clear
        </button>
      </div>
      <p>
        Prediction: <span className="font-bold">{prediction}</span>
      </p>
    </div>
  );
}
