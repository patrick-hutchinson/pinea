import {defineField, defineType} from 'sanity'
import {medium} from './types/medium'
import {media} from './blocks/media'

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
      name: 'review',
      title: 'Review',
      type: 'reference',
      to: [{type: 'review'}],
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
    defineField({
      name: 'member',
      title: 'Become a Member: Call to Action',
      type: 'object',
      fields: [
        defineField({
          name: 'title',
          title: 'Title',
          type: 'internationalizedArrayString',
        }),
        defineField({
          name: 'description',
          title: 'Description',
          type: 'internationalizedArrayText',
        }),
        defineField({
          name: 'medium',
          title: 'Media',
          type: 'medium',
        }),
        defineField({
          name: 'media',
          title: 'Media',
          type: 'media',
        }),
      ],
    }),

    defineField({
      name: 'voice',
      title: 'Voice',
      type: 'reference',
      to: [{type: 'voice'}],
    }),
    defineField({
      name: 'edition',
      title: 'Edition: Call to Action',
      type: 'object',
      fields: [
        defineField({
          name: 'title',
          title: 'Title',
          type: 'internationalizedArrayString',
        }),
        defineField({
          name: 'description',
          title: 'Description',
          type: 'internationalizedArrayText',
        }),
        defineField({
          name: 'medium',
          title: 'Media',
          type: 'medium',
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({title: 'Home Page'}),
  },
})
