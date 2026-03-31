import { notFound, redirect } from "next/navigation";

import { isAuthEnabled } from "@/lib/runtimeFlags";

import { getSessionFromCookies } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function LoginPage({ searchParams }) {
  if (!isAuthEnabled) {
    notFound();
  }
  const session = await getSessionFromCookies();
  if (session?.email) {
    redirect("/profile");
  }

  const params = await searchParams;
  const errorMessage = typeof params?.error === "string" ? decodeURIComponent(params.error) : null;

  return (
    <main style={{ padding: "var(--margin)", minHeight: "var(--content-vh)", display: "grid", alignContent: "start", gap: "12px" }}>
      <h1 typo="h2">Log In</h1>
      <p typo="longcopy">Use your Shopify customer account to access your profile.</p>
      {errorMessage ? (
        <p typo="longcopy" style={{ color: "#B00020" }}>
          {errorMessage}
        </p>
      ) : null}
      <a href="/api/auth/shopify/start?returnTo=/profile" style={{ textDecoration: "underline" }}>
        Continue with Shopify
      </a>
    </main>
  );
}
