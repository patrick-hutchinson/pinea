import 'dotenv/config'
import {createClient} from '@sanity/client'

const client = createClient({
  projectId: 'oake97ry',
  dataset: 'production',
  apiVersion: '2025-09-23',
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
})

async function migrateMuseum() {
  console.log('TOKEN:', !!process.env.SANITY_WRITE_TOKEN)

  // fetch locations where museum is defined but not yet localized
  const docs = await client.fetch(
    `*[_type == "location" && defined(museum) && !defined(museum[0]._key)]`,
  )

  for (const doc of docs) {
    const newMuseum = [{_key: 'en', language: 'en', value: doc.museum}]
    await client.patch(doc._id).set({museum: newMuseum}).commit()
    console.log(`Migrated museum for: ${doc._id}`)
  }
}

migrateMuseum().catch(console.error)
