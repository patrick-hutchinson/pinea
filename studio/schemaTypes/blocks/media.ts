import {defineField, defineType} from 'sanity'
import {medium} from '../types/medium'

export const media = defineType({
  name: 'media',
  type: 'object',
  fields: [
    defineField({
      name: 'medium',
      title: 'Single Media',
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

// Media Exists because it wraps the medium array into an object, making it usable for the mediaPair component
