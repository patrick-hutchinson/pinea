import {defineField, defineType} from 'sanity'
import {medium} from './types/medium'

export const feature = defineType({
  name: 'feature',
  title: 'Features',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string'}),
    defineField({name: 'author', title: 'Author', type: 'string'}),
    defineField({
      name: 'cover',
      title: 'Cover Media',
      type: 'medium',
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
