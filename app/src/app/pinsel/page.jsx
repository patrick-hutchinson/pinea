import { getPictureBrushTool } from "@/lib/fetch";
import PictureBrush from "@/components/PictureBrush/PictureBrush";

export default async function Page() {
  const [pictureBrush] = await Promise.all([getPictureBrushTool()]);

  return <PictureBrush images={pictureBrush.images} />;
}
