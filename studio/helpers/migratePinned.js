import 'dotenv/config' // automatically loads .env
import {createClient} from '@sanity/client'

const client = createClient({
  projectId: 'oake97ry',
  dataset: 'production',
  apiVersion: '2025-01-01',
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN, // make sure this env var exists
})

async function migratePinnedText() {
  const events = await client.fetch(`*[_type == "event" && defined(pinnedText)]{
    _id,
    pinnedText
  }`)

  for (const event of events) {
    await client
      .patch(event._id)
      .set({hostedText: event.pinnedText}) // copy old data
      .unset(['pinnedText']) // optionally remove old field
      .commit()
    console.log(`Migrated ${event._id}`)
  }
}

migratePinnedText().catch(console.error)
