import {defineField, defineType} from 'sanity'
import {medium} from './types/medium'

export const announcement = defineType({
  name: 'announcement',
  title: 'Werbung/Announcements',
  type: 'document',
  fields: [
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          {title: 'Ad', value: 'advert'},
          {title: 'Announcement', value: 'announcement'},
        ],
        layout: 'radio',
      },
      initialValue: 'announcement',
    }),

    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),

    defineField({
      name: 'media',
      title: 'Media',
      type: 'medium',
      hidden: ({document}) => document?.type !== 'advert',
    }),

    defineField({
      name: 'linkType',
      title: 'Link Typ',
      type: 'string',
      options: {
        list: [
          {title: 'Externer Link', value: 'external'},
          {title: 'Interner Link', value: 'internal'},
          {title: 'Email', value: 'email'},
        ],
        layout: 'radio',
      },
      initialValue: 'external',
    }),
    defineField({
      name: 'externalLink',
      title: 'Externer Link',
      type: 'url',
      hidden: ({parent}) => parent?.linkType !== 'external',
    }),
    defineField({
      name: 'internalLink',
      title: 'Interne Seite',
      type: 'reference',
      to: [{type: 'spotOn'}], // 👈 adjust your document type
      hidden: ({parent}) => parent?.linkType !== 'internal',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'object',
      hidden: ({parent}) => parent?.linkType !== 'email',
      fields: [
        defineField({
          name: 'subject',
          title: 'Betreff',
          type: 'string',
        }),
        defineField({
          name: 'body',
          title: 'Inhalt',
          type: 'array',
          of: [{type: 'block'}],
        }),
      ],
    }),
  ],
  preview: {
    select: {
      type: 'type',
      title: 'title',
    },
    prepare({type, title}) {
      const displayTitle = title || 'Untitled'

      return {
        title: displayTitle,
        subtitle: type,
      }
    },
  },
})
