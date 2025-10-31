import {defineField, defineType} from 'sanity'
import {thumbnail} from './types/thumbnail'

export const homePage = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  fields: [
    defineField({
      name: 'feature',
      title: 'Feature',
      type: 'reference',
      to: [{type: 'feature'}],
    }),
    defineField({
      name: 'portfolios',
      title: 'Portfolios',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'portfolio'}],
        },
      ],
    }),
    defineField({
      name: 'periodical',
      title: 'Periodical',
      type: 'reference',
      to: [{type: 'periodical'}],
    }),
  ],
  preview: {
    prepare: () => ({title: 'Home Page'}),
  },
})
