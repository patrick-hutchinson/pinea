import { notFound, redirect } from "next/navigation";

import { isAuthEnabled } from "@/lib/runtimeFlags";

import { getSessionFromCookies } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  if (!isAuthEnabled) {
    notFound();
  }
  const session = await getSessionFromCookies();

  if (!session?.email) {
    redirect("/login");
  }

  return (
    <main style={{ padding: "var(--margin)", minHeight: "var(--content-vh)", display: "grid", alignContent: "start", gap: "10px" }}>
      <h1 typo="h2">Profile</h1>
      <div typo="longcopy">
        <strong>Name:</strong> {session.name || "—"}
      </div>
      <div typo="longcopy">
        <strong>Email:</strong> {session.email}
      </div>
      <a href="/api/auth/logout?returnTo=/">Log out</a>
    </main>
  );
}
