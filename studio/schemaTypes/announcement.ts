import {defineField, defineType} from 'sanity'
import {medium} from './types/medium'

export const announcement = defineType({
  name: 'announcement',
  title: 'Announcements',
  type: 'document',
  fields: [
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          {title: 'Ad', value: 'advert'},
          {title: 'Advertorial', value: 'advertorial'},
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
      hidden: ({document}) => document?.type !== 'advert' && document?.type !== 'advertorial',
    }),

    defineField({
      name: 'link',
      title: 'Link zum Werbepartner',
      type: 'string',
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
