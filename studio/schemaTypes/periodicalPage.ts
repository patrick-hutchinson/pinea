import {defineField, defineType} from 'sanity'
import {gallery} from './types/gallery'

import {medium} from './types/medium'
import {interviewText} from './types/interviewText'

export const periodicalPage = defineType({
  name: 'periodicalPage',
  title: 'Periodical Page',
  type: 'document',
  fields: [
    // defineField({
    //   name: 'gallery',
    //   title: 'Image & Video Gallerie 🛰️',
    //   type: 'array',
    //   of: [{type: 'imageWithMetadata'}, {type: 'videoWithMetadata'}],
    //   options: {
    //     layout: 'default',
    //   },
    // }),
    defineField({
      name: 'feature',
      title: 'Gefeaturetes Periodical',
      type: 'reference',
      to: [{type: 'periodical'}],
      description: '➡️ Wähle aus, welches Periodical ausgestellt werden soll.',
    }),
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
    defineField({name: 'email', title: 'Email Text', type: 'array', of: [{type: 'block'}]}),
  ],
  preview: {
    prepare: () => ({title: 'Periodical Page'}),
  },
})
