import 'dotenv/config'
import {createClient} from '@sanity/client'

const client = createClient({
  projectId: 'oake97ry',
  dataset: 'production',
  apiVersion: '2025-09-23',
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
})

async function migrateCoverToMedium() {
  const portfolios = await client.fetch(`
    *[_type == "portfolio" && defined(cover)]{
      _id,
      cover
    }
  `)

  console.log(`Found ${portfolios.length} portfolios with cover`)

  for (const doc of portfolios) {
    const {_id, cover} = doc
    if (!cover) continue

    let newMedia = null

    if (cover.mediaType === 'image' && cover.image) {
      newMedia = {
        _type: 'imageWithMetadata',
        ...cover.image, // copy all nested image data
      }
    } else if (cover.mediaType === 'video' && cover.video) {
      newMedia = {
        _type: 'videoWithMetadata',
        ...cover.video, // copy all nested video data
      }
    }

    if (!newMedia) continue

    // Update portfolio document
    await client
      .patch(_id)
      .set({
        medium: [newMedia],
      })
      .commit({autoGenerateArrayKeys: true})

    console.log(`Updated portfolio ${_id}`)
  }

  console.log('Migration complete!')
}

migrateCoverToMedium().catch((err) => {
  console.error(err)
  process.exit(1)
})
