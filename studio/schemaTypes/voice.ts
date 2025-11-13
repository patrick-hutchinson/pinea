import countries from 'world-countries'
import {defineField, defineType} from 'sanity'
import {thumbnail} from './types/thumbnail'
import type {ValidationContext} from 'sanity'
import {medium} from './types/medium'

export const voice = defineType({
  name: 'voice',
  title: 'Person',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string'}),
    defineField({name: 'bio', title: 'Bio', type: 'internationalizedArrayText'}),
    defineField({name: 'role', title: 'Role', type: 'string'}),
    defineField({
      name: 'socials',
      title: 'Socials',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'platform', title: 'Platform', type: 'string'},
            {name: 'link', title: 'url', type: 'string'},
          ],
        },
      ],
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
      subtitle: 'role',
    },
    prepare({title, subtitle, media}) {
      return {
        title,
        subtitle,
        media,
      }
    },
  },
})
