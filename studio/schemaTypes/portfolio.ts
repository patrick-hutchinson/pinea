import {defineField, defineType} from 'sanity'
import {gallery} from './types/gallery'

import {medium} from './types/medium'

export const portfolio = defineType({
  name: 'portfolio',
  title: 'Portfolios',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Artist Name', type: 'string'}),
    defineField({
      name: 'label',
      title: 'Artist Label',
      type: 'reference',
      to: [{type: 'artistLabel'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'teaser', title: 'Teaser Text', type: 'array', of: [{type: 'block'}]}),
    defineField({name: 'bio', title: 'Artist Bio', type: 'array', of: [{type: 'block'}]}),
    defineField({name: 'cover', title: 'Cover Media', type: 'medium'}),
    defineField({
      name: 'satelliteImage',
      title: 'Satellite Image',
      description: 'This image will be used on the Home Page',
      type: 'medium',
    }),
    defineField({name: 'article', title: 'Article', type: 'array', of: [{type: 'block'}]}),
    defineField({name: 'articleImage', title: 'Article Image', type: 'medium'}),

    gallery,
    defineField({name: 'doubleFeature', title: 'Double Feature', type: 'mediaPair'}),
    defineField({
      name: 'darmode',
      title: 'Darkmode',
      description:
        'Sollte das Hintergrundbild (Cover) dunkel sein, kannst du hiermit den Text dieser Seite weiß anzeigen lassen.',
      type: 'boolean',
    }),
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
      media: 'cover.0.image',
    },
  },
})
