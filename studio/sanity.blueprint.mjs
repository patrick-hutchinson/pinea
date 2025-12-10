import {defineBlueprint, defineDocumentFunction} from '@sanity/blueprints'

export default defineBlueprint({
  resources: [
    defineDocumentFunction({
      name: 'newsletter-function',
      event: {
        on: ['create', 'update'],
        filter: "_type=='newsletter'",
        projection: '{_id}',
      },
    }),
  ],
})
