import {defineField, defineType} from 'sanity'
import {gallery} from './types/gallery'

import {medium} from './types/medium'
import ArrayMaxItems from './components/ArrayMaxItems'

export const portfolio = defineType({
  name: 'portfolio',
  title: 'Portfolios',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Name des Künstlers', type: 'string'}),
    defineField({
      name: 'releaseInfo',
      title: 'Author & Erscheinungsdatum',
      type: 'object',
      options: {columns: 2},
      fields: [
        {
          name: 'contributor',
          title: 'Contributor',
          type: 'array',
          of: [{type: 'reference', to: [{type: 'contributor'}]}],
        },
        {
          name: 'releaseDate',
          title: 'Erscheinungsdatum',
          type: 'date',
          options: {
            dateFormat: 'DD.MM.YYYY',
          },
        },
      ],
    }),
    defineField({
      name: 'cover',
      title: 'Cover Bild',
      type: 'medium',
      description:
        'Dieses Bild steht am Anfang des Artikels im fullscreen hinter der Portfolio Info.',
    }),
    defineField({
      name: 'teaser',
      title: 'Teaser Text',
      type: 'internationalizedArrayInterviewText',
    }),

    defineField({
      name: 'article',
      title: 'Artikel',
      type: 'internationalizedArrayInterviewText',
    }),
    defineField({
      name: 'articleImage',
      title: 'Artikel Bild',
      description: 'Dieses Bild wird neben dem Fließtext des Artikels angezeigt.',
      type: 'medium',
    }),
    gallery,
    defineField({name: 'doubleFeature', title: 'Double Feature', type: 'mediaPair'}),

    defineField({
      name: 'showcase',
      title: 'Personen/Institutions Info',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'institution'}]}],
      components: {input: ArrayMaxItems},
      description: 'Dieses Info Modul wird Unterhalb des Artikels angezeigt.',
    }),
    defineField({
      name: 'satelliteImage',
      title: 'Satellit Bild',
      description:
        'Dieses Bild wird auf der Home Page gezeigt und dient als Link zum jeweiligen Portfolio.',
      type: 'medium',
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
