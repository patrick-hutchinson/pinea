export function exportCanvas(canvasRef, width = 3000, height = 4000) {
  if (!canvasRef.current) return;

  const sourceCanvas = canvasRef.current;
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = width;
  tempCanvas.height = height;

  const ctx = tempCanvas.getContext("2d");
  ctx.imageSmoothingEnabled = true;

  // Calculate aspect ratios
  const sourceAspect = sourceCanvas.width / sourceCanvas.height;
  const targetAspect = width / height;

  let drawWidth = width;
  let drawHeight = height;

  // Fit proportionally
  if (sourceAspect > targetAspect) {
    // source is wider → fit width
    drawHeight = width / sourceAspect;
  } else {
    // source is taller → fit height
    drawWidth = height * sourceAspect;
  }

  const offsetX = (width - drawWidth) / 2;
  const offsetY = (height - drawHeight) / 2;

  // Draw the canvas scaled proportionally
  ctx.drawImage(sourceCanvas, 0, 0, sourceCanvas.width, sourceCanvas.height, offsetX, offsetY, drawWidth, drawHeight);

  const dataURL = tempCanvas.toDataURL("image/png");

  const link = document.createElement("a");
  link.href = dataURL;
  link.download = "highres-export.png";
  link.click();
}
