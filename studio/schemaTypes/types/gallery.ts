import {defineField} from 'sanity'
import {imageWithMetadata} from './imageWithMetadata'
import {videoWithMetadata} from './videoWithMetadata'

export const gallery = defineField({
  name: 'gallery',
  title: 'Image & Video Gallery',
  type: 'array',
  of: [{type: 'imageWithMetadata'}, {type: 'videoWithMetadata'}],
  options: {
    layout: 'default',
  },
})
