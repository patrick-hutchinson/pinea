import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {internationalizedArray} from 'sanity-plugin-internationalized-array'

import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list'

import {visionTool} from '@sanity/vision'
import {muxInput} from 'sanity-plugin-mux-input'

import {structure} from './structure'
import {schema} from './schemaTypes'

import {interviewText} from './schemaTypes/types/interviewText'
import {singleLineRichText} from './schemaTypes/types/singleLineRichText'
import {medium} from './schemaTypes/types/medium'
import {SyncMembershipDiscount} from './components/SyncMembershipDiscount'

export default defineConfig({
  name: 'default',
  title: 'pinea-studio',

  projectId: 'oake97ry',
  dataset: 'production',

  schema,
  document: {
    newDocumentOptions: (prev) => prev.filter((option) => option.templateId !== 'membershipDiscountNewsletter'),
    actions: (prev, context) => context.schemaType === 'membershipDiscountNewsletter'
      ? [...prev.filter((action) => action.action !== 'duplicate'), SyncMembershipDiscount]
      : prev,
  },

  plugins: [
    structureTool({structure}),
    visionTool(),
    muxInput(),

    internationalizedArray({
      languages: [
        {id: 'en', title: 'English'},
        {id: 'de', title: 'German'},
      ],
      defaultLanguages: ['en'],
      fieldTypes: ['string', 'text', 'interviewText', 'singleLineRichText', 'portableText'],
    }),
  ],
})
