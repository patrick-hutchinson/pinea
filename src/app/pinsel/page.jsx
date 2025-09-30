import { getPictureBrush } from "@/lib/fetch";
import PictureBrush from "@/components/PictureBrush/PictureBrush";

export default async function Page() {
  const [pictureBrush] = await Promise.all([getPictureBrush()]);

  return <PictureBrush images={pictureBrush.images} />;
}
