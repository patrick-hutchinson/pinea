import { getPictureBrush } from "@/lib/fetch";
import NotFoundPage from "@/components/NotFound/NotFoundPage";

export default async function NotFound() {
  const pictureBrush = await getPictureBrush();

  return <NotFoundPage images={pictureBrush?.images || []} />;
}
