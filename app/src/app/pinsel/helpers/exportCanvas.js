export function exportCanvas(canvasRef, width = 3000, height = 4000) {
  if (!canvasRef.current) return;

  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = width;
  tempCanvas.height = height;

  const ctx = tempCanvas.getContext("2d");
  ctx.imageSmoothingEnabled = true;

  ctx.drawImage(canvasRef.current, 0, 0, width, height);

  const dataURL = tempCanvas.toDataURL("image/png");

  const link = document.createElement("a");
  link.href = dataURL;
  link.download = "highres-export.png";
  link.click();
}
