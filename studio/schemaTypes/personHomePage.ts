import {defineField, defineType} from 'sanity'
import {medium} from './types/medium'

export const personHomePage = defineType({
  name: 'personHomePage',
  title: 'Person',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string'}),
    defineField({name: 'text', title: 'Text', type: 'internationalizedArrayText'}),
    defineField({
      name: 'portrait',
      title: 'Portrait',
      type: 'medium',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'portrait.0.image',
    },
    prepare({title, media}) {
      return {
        title,
        media,
      }
    },
  },
})
