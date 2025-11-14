import { useRouter } from "next/navigation";

export const useFilter = () => {
  const router = useRouter();

  return (item) => {
    router.push(`/stories/${item}`);
  };
};
