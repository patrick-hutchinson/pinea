import {defineField, defineType} from 'sanity'
import {thumbnail} from './types/thumbnail'
import {gallery} from './types/gallery'

export const portfolio = defineType({
  name: 'portfolio',
  title: 'Portfolios',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Artist Name', type: 'string'}),
    defineField({name: 'tag', title: 'Tag', type: 'string'}),
    defineField({name: 'bio', title: 'Artist Bio', type: 'array', of: [{type: 'block'}]}),
    defineField({name: 'teaser', title: 'Teaser Text', type: 'array', of: [{type: 'block'}]}),
    defineField({name: 'cover', title: 'Cover Media', type: 'thumbnail'}),
    defineField({name: 'article', title: 'Article', type: 'array', of: [{type: 'block'}]}),
    defineField({name: 'articleImage', title: 'Article Image', type: 'thumbnail'}),
    defineField({
      name: 'doubleFeature',
      title: 'Double Feature',
      type: 'array',
      of: [{type: 'imageWithMetadata'}, {type: 'videoWithMetadata'}],
      validation: (Rule) => Rule.max(2),
      options: {
        layout: 'grid', // or 'tags' / 'list'
      },
    }),
    gallery,
    defineField({
      name: 'slug',
      title: 'url',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'name',
    },
  },
})
