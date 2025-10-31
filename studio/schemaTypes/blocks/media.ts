import {defineField, defineType} from 'sanity'
import {thumbnail} from '../types/thumbnail'
import {medium} from '../types/medium'

export const media = defineType({
  name: 'media',
  type: 'object',
  fields: [
    defineField({
      name: 'medium',
      title: 'Media',
      type: 'medium',
    }),
  ],
  preview: {
    select: {
      media: 'medium.0.image',
    },
    prepare({media}) {
      return {
        media,
        title: 'Single Media',
      }
    },
  },
})
