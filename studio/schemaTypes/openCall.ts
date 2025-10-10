import {defineField, defineType} from 'sanity'
import {thumbnail} from './types/thumbnail'

export const openCall = defineType({
  name: 'openCall',
  title: 'Open Call',
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
      name: 'thumbnail',
      title: 'Thumbnail',
      type: 'thumbnail',
    }),
  ],
})
