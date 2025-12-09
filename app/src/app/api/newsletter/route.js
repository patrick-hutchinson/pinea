import { NextResponse } from "next/server";
import { renderToStaticMarkup } from "react-dom/server";
import NewsletterPage from "@/app/newsletter/[slug]/NewsletterPage";
import { getNewsletters, getSiteData } from "@/lib/fetch";

export async function POST(request) {
  try {
    const { slug } = await request.json();

    // 1. Load Sanity data
    const newsletters = await getNewsletters();
    const site = await getSiteData();
    const newsletter = newsletters.find((n) => n.slug.current === slug);

    if (!newsletter) {
      return NextResponse.json({ error: "Newsletter not found" }, { status: 404 });
    }

    // 2. Render newsletter page into static HTML
    const html = renderToStaticMarkup(<NewsletterPage site={site} newsletter={newsletter} />);

    // 3. Push to Listmonk
    const listmonkRes = await fetch(`${process.env.LISTMONK_URL}/api/campaigns`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(process.env.LISTMONK_USER + ":" + process.env.LISTMONK_PASS).toString(
          "base64"
        )}`,
      },
      body: JSON.stringify({
        name: newsletter.title,
        type: "regular",
        subject: newsletter.subject,
        lists: [1], // your list ID
        content: html,
        from_email: "newsletter@yourdomain.com",
      }),
    });

    const data = await listmonkRes.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
