import 'dotenv/config' // automatically loads .env
import {createClient} from '@sanity/client'

const client = createClient({
  projectId: 'oake97ry',
  dataset: 'production',
  apiVersion: '2025-09-23',
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN, // make sure this env var exists
})

async function populateEventRecommendations() {
  const recommendations = await client.fetch(
    `*[_type == "recommendation"]{
      _id,
      event->{_id}
    }`,
  )

  const byEvent = {} // no TS type
  recommendations.forEach((rec) => {
    if (!rec.event?._id) return
    if (!byEvent[rec.event._id]) byEvent[rec.event._id] = []
    byEvent[rec.event._id].push({_ref: rec._id, _type: 'reference'})
  })

  for (const eventId in byEvent) {
    const draftId = eventId.startsWith('drafts.') ? eventId : `drafts.${eventId}`
    await client
      .patch(draftId)
      .set({recommendations: byEvent[eventId]})
      .commit({autoGenerateArrayKeys: true})
    console.log(`Updated event ${draftId} with ${byEvent[eventId].length} recommendations`)
  }

  console.log('Done!')
}

populateEventRecommendations().catch(console.error)
