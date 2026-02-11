export function exportCanvas(
  canvasRef,
  width = 3000,
  height = 4000,
  scale = 3, // 👈 increase this for more resolution (2–5 is realistic)
) {
  if (!canvasRef.current) return;

  const sourceCanvas = canvasRef.current;

  // Create high-resolution export canvas
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = width * scale;
  tempCanvas.height = height * scale;

  const ctx = tempCanvas.getContext("2d");

  // Scale drawing operations down to visual size
  ctx.scale(scale, scale);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // Aspect ratios
  const sourceAspect = sourceCanvas.width / sourceCanvas.height;
  const targetAspect = width / height;

  let drawWidth = width;
  let drawHeight = height;

  if (sourceAspect > targetAspect) {
    drawHeight = width / sourceAspect;
  } else {
    drawWidth = height * sourceAspect;
  }

  const offsetX = (width - drawWidth) / 2;
  const offsetY = (height - drawHeight) / 2;

  // Draw source canvas into high-res buffer
  ctx.drawImage(sourceCanvas, 0, 0, sourceCanvas.width, sourceCanvas.height, offsetX, offsetY, drawWidth, drawHeight);

  // Export
  const dataURL = tempCanvas.toDataURL("image/png");

  const link = document.createElement("a");
  link.href = dataURL;
  link.download = "highres-export.png";
  link.click();
}
