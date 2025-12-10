import {defineBlueprint, defineDocumentFunction} from '@sanity/blueprints'

import {documentEventHandler} from '@sanity/functions'

export const handler = documentEventHandler(async ({context, event}) => {
  console.log('📝 Newsletter function fired!')
  console.log('Event object:', JSON.stringify(event, null, 2))
})

export default defineBlueprint({
  resources: [
    defineDocumentFunction({
      name: 'newsletter-function',
      event: {
        on: ['create', 'update'],
        filter: 'defined(_id)',
        projection: '{_id}', // ← FIXED
      },
    }),
  ],
})
