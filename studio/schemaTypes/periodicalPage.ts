import {defineField, defineType} from 'sanity'
import {gallery} from './types/gallery'

import {medium} from './types/medium'

export const periodicalPage = defineType({
  name: 'periodicalPage',
  title: 'Periodical Page',
  type: 'document',
  fields: [
    defineField({
      name: 'gallery',
      title: 'Image & Video Gallery',
      type: 'array',
      of: [{type: 'imageWithMetadata'}, {type: 'videoWithMetadata'}],
      options: {
        layout: 'default',
      },
    }),
    defineField({name: 'doubleFeature', title: 'Double Feature', type: 'mediaPair'}),
    defineField({
      name: 'announcements',
      title: 'Announcements',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'announcement'}],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'cover.0.image',
    },
  },
})
