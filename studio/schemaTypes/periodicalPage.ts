import {defineField, defineType} from 'sanity'
import {gallery} from './types/gallery'

import {medium} from './types/medium'
import {interviewText} from './types/interviewText'

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
    defineField({name: 'isbn', title: 'ISBN', type: 'string'}),
    defineField({
      name: 'callout',
      title: 'Callout',
      type: 'internationalizedArrayInterviewText',
      description: 'Dieser Text steht im Modul unterhalb des Covers.',
    }),
    defineField({
      name: 'periodicalInfo',
      title: 'Periodical Info',
      type: 'array',
      of: [
        {
          type: 'object',
          title: 'Info Block',
          fields: [
            {name: 'title', title: 'Titel', type: 'internationalizedArrayString'},
            {name: 'text', title: 'text', type: 'internationalizedArrayInterviewText'},
          ],
          preview: {
            select: {
              title: 'title', // points to your array
            },
            prepare(selection) {
              const {title} = selection
              let localizedTitle = 'Untitled'
              // title is an array like [{_key, en: 'English title', de: 'Deutscher Titel'}, ...]
              if (Array.isArray(title)) {
                const enEntry = title.find((t) => t.language === 'en') || title[0]
                localizedTitle = enEntry?.value || 'Untitled'
              }

              return {
                title: localizedTitle,
                subtitle: title?.length > 1 ? `${title.length} entries` : '',
              }
            },
          },
        },
      ],
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
  ],
  preview: {
    prepare: () => ({title: 'Periodical Page'}),
  },
})
