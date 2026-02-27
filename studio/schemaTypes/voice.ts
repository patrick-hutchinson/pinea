import countries from 'world-countries'
import {defineField, defineType} from 'sanity'
import type {ValidationContext} from 'sanity'
import {medium} from './types/medium'
import {media} from './blocks/media'

export const voice = defineType({
  name: 'voice',
  title: 'Person',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string'}),
    defineField({name: 'bio', title: 'Bio', type: 'internationalizedArrayInterviewText'}),
    defineField({name: 'role', title: 'Role', type: 'internationalizedArrayString'}),
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
    defineField({
      name: 'releaseDate',
      title: 'Release Date',
      type: 'date',
      options: {
        dateFormat: 'DD.MM.YYYY',
      },
    }),
    defineField({
      name: 'archiveTitle',
      title: 'Recommendations Überschrift',
      type: 'internationalizedArrayString',
      description: 'Diese Überschrift wird z.B auf der Index Seite angezeigt.',
    }),
    defineField({
      name: 'portrait',
      title: 'Portrait',
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
      media: 'portrait.0.image',
    },
    prepare({title, media}) {
      return {
        title,

        media,
      }
    },
  },
})
