import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: "oake97ry",
  dataset: "production",
  apiVersion: "2025-09-23", // today’s date or the version you want
  useCdn: true, // set to false if you want fresh data
});
