import {defineField, defineType} from 'sanity'
import {medium} from './types/medium'

export const openCall = defineType({
  name: 'openCall',
  title: 'News',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({name: 'date', title: 'Date', type: 'datetime'}),
    defineField({
      name: 'media',
      title: 'Media',
      type: 'medium',
    }),
  ],
})
