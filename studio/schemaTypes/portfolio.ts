import {defineField, defineType} from 'sanity'
import {gallery} from './types/gallery'

import {medium} from './types/medium'

export const portfolio = defineType({
  name: 'portfolio',
  title: 'Portfolios',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Artist Name', type: 'string'}),
    defineField({name: 'author', title: 'Author Name', type: 'string'}),
    defineField({
      name: 'releaseDate',
      title: 'Release Date',
      type: 'date',
      options: {
        dateFormat: 'DD.MM.YYYY',
      },
    }),
    defineField({
      name: 'teaser',
      title: 'Teaser Text',
      type: 'internationalizedArrayInterviewText',
    }),

    defineField({
      name: 'caption',
      title: 'Bildunterschrift (Genutzt auf der Übersichtsseite)',
      type: 'internationalizedArrayInterviewText',
    }),
    defineField({name: 'bio', title: 'Artist Bio', type: 'internationalizedArrayInterviewText'}),
    defineField({
      name: 'socials',
      title: 'Externe Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'platform', title: 'Platform', type: 'internationalizedArrayString'},
            {name: 'link', title: 'url', type: 'string'},
          ],
        },
      ],
    }),
    defineField({name: 'cover', title: 'Cover Media', type: 'medium'}),
    defineField({
      name: 'satelliteImage',
      title: 'Satellite Image',
      description:
        'Dieses Bild wird auf der Home Page gezeigt und dient als Link zum jeweiligen Portfolio.',
      type: 'medium',
    }),
    defineField({
      name: 'article',
      title: 'Article',
      type: 'internationalizedArrayInterviewText',
    }),
    defineField({name: 'articleImage', title: 'Article Image', type: 'medium'}),

    gallery,
    defineField({name: 'doubleFeature', title: 'Double Feature', type: 'mediaPair'}),
    defineField({
      name: 'darkmode',
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
