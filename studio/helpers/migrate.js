import 'dotenv/config'
import {createClient} from '@sanity/client'

const client = createClient({
  projectId: 'oake97ry',
  dataset: 'production',
  apiVersion: '2025-09-23',
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
})

async function renameCountryRef() {
  // Fetch all documents that still have countryRef
  const locations = await client.fetch(
    `*[_type == "location" && defined(countryRef)]{_id, countryRef}`,
  )

  for (const loc of locations) {
    await client
      .patch(loc._id)
      .set({country: loc.countryRef}) // copy to new field
      .unset(['countryRef']) // optional: remove old field
      .commit()

    console.log(`Migrated location ${loc._id}`)
  }

  console.log('Done!')
}

renameCountryRef().catch(console.error)
