import { NextResponse } from "next/server";

import { draftClient } from "@/lib/draftClient";
import { getSessionFromCookies } from "@/lib/auth/session";
import { isAuthEnabled, isLocalDevelopment } from "@/lib/runtimeFlags";

const fail = (message, status = 400) => NextResponse.json({ error: message }, { status });

export async function POST(request) {
  if (!isAuthEnabled && !isLocalDevelopment) {
    return new Response(null, { status: 404 });
  }

  if (!process.env.SANITY_MIGRATE_TOKEN) {
    return fail("Missing SANITY_MIGRATE_TOKEN. Upload is not configured.", 500);
  }

  const session = await getSessionFromCookies();
  if (!session?.email && !isLocalDevelopment) {
    return fail("Unauthorized", 401);
  }

  let formData;
  try {
    formData = await request.formData();
  } catch {
    return fail("Invalid upload payload.");
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return fail("No file provided.");
  }

  const allowed = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp"]);
  if (!allowed.has(file.type)) {
    return fail("Unsupported file format.");
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const asset = await draftClient.assets.upload("image", buffer, {
      filename: file.name,
      contentType: file.type,
    });

    return NextResponse.json({
      ok: true,
      assetId: asset?._id || "",
      originalFilename: file.name,
    });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Image upload failed.", 500);
  }
}
