import {defineField, defineType} from 'sanity'
import {thumbnail} from './types/thumbnail'

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About Page',
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
      title: 'Portfilios',
      type: 'reference',
      to: [{type: 'feature'}],
    }),
  ],
  preview: {
    prepare: () => ({title: 'About Page'}),
  },
})
