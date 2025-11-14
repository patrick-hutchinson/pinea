import {defineField, defineType} from 'sanity'
import {thumbnail} from './types/thumbnail'
import {gallery} from './types/gallery'
import {medium} from './types/medium'
// import {recommendation} from './recommendation'

export const event = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    defineField({
      name: 'highlight',
      title: 'Highlight',
      type: 'object',
      description:
        'Only one of Pinned, Hosted, or Recommended can be true—you may also select neither.',
      options: {columns: 3},
      fields: [
        {
          name: 'pinned',
          title: 'P.IN.N.ED',
          type: 'boolean',
        },
        {
          name: 'hosted',
          title: 'HOSTED',
          type: 'boolean',
        },
        {
          name: 'recommended',
          title: 'RECOMMENDED',
          type: 'boolean',
        },
      ],
      validation: (Rule) =>
        Rule.custom((value) => {
          if (!value) return true
          const {pinned, hosted, recommended} = value
          const trueCount = [pinned, hosted, recommended].filter(Boolean).length
          if (trueCount > 1) return 'Only one of Pinned, Hosted, or Recommended can be true.'
          return true
        }),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'internationalizedArrayString',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'artist',
      title: 'Artist/s',
      type: 'array', // wrap in an array
      of: [{type: 'reference', to: [{type: 'artist'}]}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'type',
      title: 'Type',
      type: 'reference',
      to: [{type: 'eventType'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'reference',
      to: [{type: 'location'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'opening',
      title: 'Opening',
      type: 'object',
      options: {
        columns: 2, // display children in two columns
      },
      fields: [
        {
          name: 'date',
          title: 'Date',
          type: 'date',
          options: {dateFormat: 'DD.MM.YYYY'},
        },
        {
          name: 'time',
          title: 'Time',
          type: 'string',
          placeholder: 'e.g. 18:00',
          validation: (Rule) =>
            (Rule as any).regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
              name: 'time',
              invert: false,
              message: 'Use 24-hour format, e.g. 14:30',
            }),
        },
      ],
    }),
    defineField({
      name: 'duration',
      title: 'Duration',
      type: 'object',
      options: {
        columns: 2, // display children in two columns
      },
      fields: [
        {
          name: 'startDate',
          title: 'Start Date',
          type: 'date',
          options: {
            dateFormat: 'DD.MM.YYYY',
          },
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'endDate',
          title: 'End Date',
          type: 'date',
          options: {
            dateFormat: 'DD.MM.YYYY', // display format only
          },
        },
      ],
    }),

    defineField({
      name: 'thumbnail',
      title: 'Thumbnail',
      type: 'thumbnail',
    }),
    defineField({name: 'cover', title: 'Cover Image', type: 'medium'}),
    defineField({
      name: 'hostedText',
      title: 'Description',
      type: 'array',
      description:
        'Dieser Text wird nur angezeigt, wenn auch ein Bild oder Video as Thumbnail hochgeladen wurde.',
      of: [{type: 'block'}],
    }),
    gallery,
    defineField({
      name: 'recommendations',
      title: 'Recommendation',
      type: 'array',
      hidden: ({parent}) => !parent?.highlight?.recommended,
      of: [
        {
          type: 'reference',

          to: [{type: 'recommendation'}],
        },
      ],
      validation: (Rule) => Rule.max(1),
    }),
  ],

  preview: {
    select: {
      title: 'title', // now this is an array
      media: 'thumbnail.image.image',
      subtitle: 'artist.0.name',
    },
    prepare({title, subtitle, media}) {
      // pick English version or fallback
      const localizedTitle =
        Array.isArray(title) &&
        (title.find((t) => t.language === 'en')?.value || title[0]?.value || 'Untitled')

      return {
        title: localizedTitle,
        subtitle,
        media,
      }
    },
  },
})
