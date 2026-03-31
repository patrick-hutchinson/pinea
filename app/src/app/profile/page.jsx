import { notFound, redirect } from "next/navigation";

import { isAuthEnabled } from "@/lib/runtimeFlags";

import { getSessionFromCookies } from "@/lib/auth/session";
import ProfileClient from "./ProfileClient";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  if (!isAuthEnabled) {
    notFound();
  }
  const session = await getSessionFromCookies();

  if (!session?.email) {
    redirect("/login");
  }

  return <ProfileClient session={session} />;
}
