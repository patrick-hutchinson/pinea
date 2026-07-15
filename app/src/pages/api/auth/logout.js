import { SESSION_COOKIE_NAME, SESSION_COOKIE_OPTIONS } from "@/lib/auth/sessionCore";
import { getAbsoluteRequestUrl, setResponseCookie } from "@/lib/pages/api";
import { isAuthEnabled } from "@/lib/runtimeFlags";

export default function handler(req, res) {
  if (!isAuthEnabled) {
    res.status(404).end();
    return;
  }

  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ error: "Method not allowed." });
    return;
  }

  const url = getAbsoluteRequestUrl(req);
  const returnTo = url.searchParams.get("returnTo");
  const destination = returnTo && returnTo.startsWith("/") ? returnTo : "/";

  setResponseCookie(res, SESSION_COOKIE_NAME, "", {
    ...SESSION_COOKIE_OPTIONS,
    maxAge: 0,
  });

  res.redirect(307, new URL(destination, url.origin).toString());
}
