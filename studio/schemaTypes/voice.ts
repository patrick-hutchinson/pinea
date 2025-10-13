import countries from 'world-countries'
import {defineField, defineType} from 'sanity'
import {thumbnail} from './types/thumbnail'
import type {ValidationContext} from 'sanity'

export const voice = defineType({
  name: 'voice',
  title: 'Voice',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string'}),
    defineField({name: 'bio', title: 'bio', type: 'array', of: [{type: 'block'}]}),
    defineField({
      name: 'nationality',
      title: 'Nationality',
      type: 'string',
      options: {
        list: countries.map((c) => ({
          title: c.name.common,
          value: c.cca2, // store ISO code
        })),
      },
    }),
    defineField({name: 'role', title: 'Role', type: 'string'}),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail',
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
      media: 'thumbnail.image', // adjust this path to match your thumbnail type
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
