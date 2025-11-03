import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {internationalizedArray} from 'sanity-plugin-internationalized-array'

import {visionTool} from '@sanity/vision'
import {muxInput} from 'sanity-plugin-mux-input'

import {structure} from './structure'
import {schema} from './schemaTypes'

import {interviewText} from './schemaTypes/types/interviewText'
import {medium} from './schemaTypes/types/medium'

export default defineConfig({
  name: 'default',
  title: 'pinea-studio',

  projectId: 'oake97ry',
  dataset: 'production',

  schema,

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
      fieldTypes: ['string', 'text', 'interviewText', 'medium'],
    }),
  ],
})
