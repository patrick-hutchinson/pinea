import {defineField, defineType} from 'sanity'
import {thumbnail} from './types/thumbnail'
import {gallery} from './types/gallery'
import {recommendation} from './recommendation'

// import {IncomingRefIndicator} from './components/RelatedRecommendations'

export const event = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  // components: {
  //   input: IncomingRefIndicator,
  // },
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
      type: 'string',
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
    gallery,
    defineField({
      name: 'hostedText',
      title: 'Hosted Text',
      type: 'array',
      of: [{type: 'block'}],
      hidden: ({parent}) => !parent?.highlight?.hosted,
    }),
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
    // defineField({
    //   name: 'recommendation',
    //   title: 'Recommendation',
    //   type: 'object',
    //   hidden: ({parent}) => !parent?.highlight?.recommended,
    //   fields: [
    //     {
    //       name: 'voice',
    //       title: 'Voice',
    //       type: 'reference',
    //       to: [{type: 'voice'}],
    //     },
    //     {
    //       name: 'teaser',
    //       title: 'Teaser',
    //       type: 'array',
    //       of: [{type: 'block'}],
    //       description: 'The first sentence of the comment',
    //     },
    //     {
    //       name: 'comment',
    //       title: 'Comment',
    //       type: 'array',
    //       of: [{type: 'block'}],
    //       description: 'Continuation of the comment',
    //     },
    //     {
    //       name: 'thumbnail',
    //       title: 'Thumbnail',
    //       type: 'thumbnail',
    //     },
    //   ],
    // }),
  ],

  preview: {
    select: {
      title: 'title',
      media: 'thumbnail.image.image', // adjust this path to match your thumbnail type
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
