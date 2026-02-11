import { getPictureBrushTool } from "@/lib/fetch";
import PictureBrushTool from "./PictureBrushTool";

export default async function Page() {
  const [pictureBrush] = await Promise.all([getPictureBrushTool()]);

  return <PictureBrushTool imageSets={pictureBrush.imageSets} />;
}
