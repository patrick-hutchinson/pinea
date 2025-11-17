import 'dotenv/config'
import {createClient} from '@sanity/client'

const client = createClient({
  projectId: 'oake97ry',
  dataset: 'production',
  apiVersion: '2025-01-01',
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
})

async function migrateToMedium() {
  // Fetch all events that have a thumbnail
  const events = await client.fetch(`*[_type == "event" && defined(thumbnail)][0..2]{
    _id,
    thumbnail{
      mediaType,
      image{
        image,
        altText,
        copyright,
        subtitle,
        rightsEnd
      },
      video{
        video,
        altText,
        copyright,
        subtitle,
        rightsEnd
      }
    }
  }`)

  if (!events || !Array.isArray(events)) {
    console.log('No events returned from GROQ query!')
    return
  }

  console.log(`Found ${events.length} events with thumbnails`)

  for (const event of events) {
    const {_id, thumbnail} = event
    let mediumItem = null

    if (thumbnail.mediaType === 'image' && thumbnail.image) {
      // Copy all metadata into medium
      mediumItem = {...thumbnail.image}
    } else if (thumbnail.mediaType === 'video' && thumbnail.video) {
      mediumItem = {...thumbnail.video}
    }

    if (mediumItem) {
      await client
        .patch(_id)
        .set({cover: [mediumItem]}) // set medium as array with one item
        .commit({autoGenerateArrayKeys: true})

      console.log(`✅ Migrated thumbnail to medium for event ${_id}`)
    }
  }

  console.log('Migration complete!')
}

migrateToMedium().catch((err) => console.error(err))
