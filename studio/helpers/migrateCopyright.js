import 'dotenv/config'
import {createClient} from '@sanity/client'

const client = createClient({
  projectId: 'oake97ry',
  dataset: 'production',
  apiVersion: '2025-09-23',
  token: process.env.SANITY_MIGRATE_TOKEN,
  useCdn: false,
})

async function migrate() {
  // fetch ONE event whose thumbnail image has copyright but no copyrightIntl
  const doc = await client.fetch(`
    *[
      _type == "event" &&
      defined(thumbnail.image.copyright) &&
      !defined(thumbnail.image.copyrightIntl)
    ][0]
  {
    _id,
    "copyright": thumbnail.image.copyright
  }
  `)

  if (!doc) {
    console.log('No documents found.')
    return
  }

  console.log('Migrating event:', doc._id)

  const intlValue = [
    {
      _key: 'en',
      language: 'en',
      value: doc.copyright,
    },
  ]

  await client
    .patch(doc._id)
    .set({
      'thumbnail.image.copyrightIntl': intlValue,
    })
    .commit()

  console.log('Done.')
}

migrate().catch(console.error)
