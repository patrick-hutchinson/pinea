import { createClient } from "@sanity/client";

export const draftClient = createClient({
  projectId: "oake97ry",
  dataset: "production",
  apiVersion: "2025-09-23", // today’s date or the version you want
  useCdn: false, // set to false if you want fresh data
  perspective: "raw",
  token: process.env.SANITY_MIGRATE_TOKEN,
});
