import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "oake97ry",
  dataset: "production",
  apiVersion: "2025-09-23",
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN, // must have write access
});

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const recId = req.body._id;
  if (!recId) return res.status(400).send("No recommendation ID");

  try {
    // Fetch the recommendation
    const rec = await client.fetch(`*[_type == "recommendation" && _id == $id]{_id, event._ref, voice._ref}[0]`, {
      id: recId,
    });

    const updates = [];

    if (rec?.event?._ref) {
      const draftEventId = `drafts.${rec.event._ref}`;
      updates.push(
        client
          .patch(draftEventId)
          .set({ recommendations: [{ _ref: rec._id, _type: "reference" }] })
          .commit({ autoGenerateArrayKeys: true })
      );
    }

    if (rec?.voice?._ref) {
      const draftVoiceId = `drafts.${rec.voice._ref}`;
      updates.push(
        client
          .patch(draftVoiceId)
          .set({ recommendations: [{ _ref: rec._id, _type: "reference" }] })
          .commit({ autoGenerateArrayKeys: true })
      );
    }

    await Promise.all(updates);
    res.status(200).send("OK");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
}
