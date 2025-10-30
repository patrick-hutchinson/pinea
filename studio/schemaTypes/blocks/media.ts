import {defineField, defineType} from 'sanity'
import {thumbnail} from '../types/thumbnail'

export const media = defineType({
  name: 'media',
  type: 'object',
  fields: [
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail',
      type: 'thumbnail',
    }),
  ],
  preview: {
    select: {
      media: 'thumbnail.image.image',
    },
    prepare({media}) {
      return {
        media,
        title: 'Single Media',
      }
    },
  },
})
