import { createClient } from "@sanity/client";

export const production = createClient({
  projectId: "oake97ry",
  dataset: "production",
  apiVersion: "2025-09-23", // today’s date or the version you want
  fetch: {
    cache: "no-store",
  },
  useCdn: false, // set to false if you want fresh data
  token: process.env.SANITY_READ_TOKEN,
  perspective: "published",
});
