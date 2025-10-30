import {defineField, defineType} from 'sanity'
import {thumbnail} from './types/thumbnail'
import {gallery} from './types/gallery'

import {medium} from './types/medium'
import {interviewText} from './types/interviewText'
import {speaker} from './types/speaker'

export const interview = defineType({
  name: 'interview',
  title: 'Interview',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string'}),
    defineField({
      name: 'releaseDate',
      title: 'Release Date',
      type: 'date',
      options: {
        dateFormat: 'DD.MM.YYYY',
      },
    }),
    defineField({name: 'cover', title: 'Cover Media', type: 'medium'}),
    defineField({
      name: 'speakers',
      title: 'Speakers',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'speaker'}]}],
      description: 'List of speakers participating in this interview.',
    }),

    // Portable Text field (includes your custom footnotes etc.)
    defineField({
      name: 'interview',
      title: 'Interview',
      type: 'interviewText',
    }),

    gallery,

    defineField({
      name: 'slug',
      title: 'url',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'cover.0.image',
    },
  },
})
