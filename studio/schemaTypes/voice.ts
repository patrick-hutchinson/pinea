import countries from 'world-countries'
import {defineField, defineType} from 'sanity'
import {thumbnail} from './types/thumbnail'
import type {ValidationContext} from 'sanity'

export const voice = defineType({
  name: 'voice',
  title: 'Person',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string'}),
    defineField({name: 'bio', title: 'bio', type: 'array', of: [{type: 'block'}]}),
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
      name: 'thumbnail',
      title: 'Portrait',
      type: 'thumbnail',
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
      media: 'thumbnail.image.image',
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
