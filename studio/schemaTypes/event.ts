import countries from 'world-countries'
import {defineField, defineType} from 'sanity'
import {thumbnail} from './types/thumbnail'
import {gallery} from './types/gallery'
import type {ValidationContext} from 'sanity'
import RelatedRecommendations from './components/RelatedRecommendations'

export const event = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string'}),
    defineField({name: 'artist', title: 'Artist', type: 'string'}),
    defineField({
      name: 'type',
      title: 'Type',
      type: 'reference',
      to: [{type: 'eventType'}],
    }),
    defineField({
      name: 'pinned',
      title: 'Selected by PINEA',
      type: 'boolean',
    }),
    defineField({
      name: 'pinnedText',
      title: 'Pinned Text',
      type: 'array',
      of: [{type: 'block'}],
      hidden: ({parent}) => !parent?.pinned, // 👈 only show if pinned is true
    }),
    defineField({
      name: 'openingDate',
      title: 'Opening Date',
      type: 'datetime',
    }),
    defineField({
      name: 'startDate',
      title: 'Start Date',
      type: 'datetime',
    }),
    defineField({
      name: 'endDate',
      title: 'End Date',
      type: 'datetime',
      validation: (Rule) =>
        Rule.custom((endDate, context: ValidationContext) => {
          const startDate = (context.parent as {startDate?: string})?.startDate
          if (endDate && startDate && endDate < startDate) {
            return 'End date must be after start date'
          }
          return true
        }),
    }),
    defineField({
      name: 'country',
      title: 'Country',
      type: 'string',
      options: {
        list: countries.map((c) => ({
          title: c.name.common,
          value: c.cca2, // store ISO code
        })),
      },
    }),
    defineField({name: 'city', title: 'City', type: 'string'}),
    defineField({name: 'museum', title: 'Museum', type: 'string'}),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail',
      type: 'thumbnail',
    }),
    gallery,
    defineField({
      name: 'recommendations',
      title: 'Recommendations',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'recommendation'}]}],
      readOnly: true,
      components: {
        field: RelatedRecommendations, // ← correct way
      },
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'thumbnail.image', // adjust this path to match your thumbnail type
      subtitle: 'artist',
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
