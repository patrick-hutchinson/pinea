import { draftClient } from "@/lib/draftClient";
import { getSessionFromRequest, parseMultipartFormData, sendMethodNotAllowed } from "@/lib/pages/api";
import { isAuthEnabled, isLocalDevelopment } from "@/lib/runtimeFlags";

const fail = (res, message, status = 400) => res.status(status).json({ error: message });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (!isAuthEnabled && !isLocalDevelopment) {
    res.status(404).end();
    return;
  }

  if (req.method !== "POST") {
    sendMethodNotAllowed(res, ["POST"]);
    return;
  }

  if (!process.env.SANITY_MIGRATE_TOKEN) {
    fail(res, "Missing SANITY_MIGRATE_TOKEN. Upload is not configured.", 500);
    return;
  }

  const session = getSessionFromRequest(req);
  if (!session?.email && !isLocalDevelopment) {
    fail(res, "Unauthorized", 401);
    return;
  }

  let formData;
  try {
    formData = await parseMultipartFormData(req);
  } catch {
    fail(res, "Invalid upload payload.");
    return;
  }

  const file = formData.get("file");
  if (!file?.buffer?.length || !file.filename) {
    fail(res, "No file provided.");
    return;
  }

  const allowed = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp"]);
  if (!allowed.has(file.type)) {
    fail(res, "Unsupported file format.");
    return;
  }

  try {
    const asset = await draftClient.assets.upload("image", file.buffer, {
      filename: file.filename,
      contentType: file.type,
    });

    res.status(200).json({
      ok: true,
      assetId: asset?._id || "",
      originalFilename: file.filename,
    });
  } catch (error) {
    fail(res, error instanceof Error ? error.message : "Image upload failed.", 500);
  }
}
