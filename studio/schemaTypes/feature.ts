import {defineField, defineType} from 'sanity'
import {thumbnail} from './types/thumbnail'

export const feature = defineType({
  name: 'feature',
  title: 'Features',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string'}),
    defineField({name: 'author', title: 'Author', type: 'string'}),
    defineField({name: 'nationality', title: 'Nationality', type: 'string'}),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail',
      type: 'thumbnail',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{type: 'block'}],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'author',
    },
  },
})
