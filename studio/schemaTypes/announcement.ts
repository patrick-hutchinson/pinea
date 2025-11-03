import {defineField, defineType} from 'sanity'
import {thumbnail} from './types/thumbnail'

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
          {title: 'Advert', value: 'advert'},
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
      name: 'thumbnail',
      title: 'Thumbnail',
      type: 'thumbnail',
      hidden: ({document}) => document?.type !== 'advert' && document?.type !== 'advertorial',
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
