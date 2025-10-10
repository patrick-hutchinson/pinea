import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {muxInput} from 'sanity-plugin-mux-input'

import {structure} from './structure'
import {schema} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'pinea-studio',

  projectId: 'oake97ry',
  dataset: 'production',

  schema,

  plugins: [structureTool({structure}), visionTool(), muxInput()],
})
