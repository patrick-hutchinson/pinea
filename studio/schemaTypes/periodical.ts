import {defineField, defineType} from 'sanity'
import {gallery} from './types/gallery'

export const periodical = defineType({
  name: 'periodical',
  title: 'Periodical',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    gallery,
    defineField({
      name: 'description',
      title: 'Description',
      type: 'internationalizedArrayInterviewText',
    }),
  ],
})
