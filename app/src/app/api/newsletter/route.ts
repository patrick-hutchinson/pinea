export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  const htmlRes = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/newsletter/${slug}?mail=1`, { cache: "no-store" });

  const html = await htmlRes.text();

  return new Response(html, {
    headers: { "Content-Type": "text/html" },
  });
}
