import {defineField, defineType} from 'sanity'
import {thumbnail} from './types/thumbnail'

export const announcement = defineType({
  name: 'announcement',
  title: 'Announcement',
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
          {title: 'Picked', value: 'picked'},
        ],
        layout: 'radio',
      },
      initialValue: 'announcement',
    }),

    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      hidden: ({document}) => document?.type !== 'advertorial' && document?.type !== 'announcement',
    }),

    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      hidden: ({document}) => document?.type !== 'announcement',
    }),

    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      hidden: ({document}) => document?.type !== 'advertorial',
    }),

    defineField({
      name: 'thumbnail',
      title: 'Thumbnail',
      type: 'thumbnail',
      hidden: ({document}) => document?.type !== 'advert' && document?.type !== 'advertorial',
    }),
  ],
})
