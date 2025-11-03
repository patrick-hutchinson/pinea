import {defineField, defineType} from 'sanity'
import {medium} from './types/medium'

export const advertisementBanner = defineType({
  name: 'advertisementBanner',
  title: 'Advertisement Banner',
  type: 'document',
  fields: [
    defineField({
      name: 'medium',
      title: 'Media',
      type: 'media',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Advert Banner',
      }
    },
  },
})
