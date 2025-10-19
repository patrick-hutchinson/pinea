import {defineField, defineType} from 'sanity'
import {thumbnail} from './types/thumbnail'
import {gallery} from './types/gallery'

export const event = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string'}),
    defineField({
      name: 'artist',
      title: 'Artist/s',
      type: 'array', // wrap in an array
      of: [{type: 'reference', to: [{type: 'artist'}]}],
    }),
    defineField({
      name: 'type',
      title: 'Type',
      type: 'reference',
      to: [{type: 'eventType'}],
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'reference',
      to: [{type: 'location'}],
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
    gallery,
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
  ],
  preview: {
    select: {
      title: 'title',
      media: 'thumbnail.image', // adjust this path to match your thumbnail type
      subtitle: 'artist.0.name',
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
