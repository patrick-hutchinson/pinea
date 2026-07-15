import ShopPage from "@/views/shop/ShopPage";
import { getPeriodicalPage } from "@/lib/fetch";
import { isShopEnabled } from "@/lib/runtimeFlags";
import { getShopifyProducts } from "@/lib/shopify";
import { withPagesShellProps } from "@/lib/pages/shellData";

export default function Shop({ error, periodicalEmailTemplate, products }) {
  return <ShopPage error={error} periodicalEmailTemplate={periodicalEmailTemplate} products={products} />;
}

export const getServerSideProps = withPagesShellProps(async () => {
  if (!isShopEnabled) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  let products = [];
  let error = null;
  let periodicalPage = null;

  try {
    [products, periodicalPage] = await Promise.all([getShopifyProducts(12), getPeriodicalPage()]);
  } catch (err) {
    console.error("Failed to load Shopify products:", err);
    error = err instanceof Error ? err.message : "Unable to load products.";
  }

  return {
    props: {
      error,
      periodicalEmailTemplate: periodicalPage?.email || null,
      products,
    },
  };
});
