import {defineField, defineType} from 'sanity'

import {ImageIcon} from '@sanity/icons'

export const newsletterAnnouncement = defineType({
  name: 'newsletterAnnouncement',
  title: 'Newsletter Announcement',
  icon: ImageIcon,
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Titel',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Bild',
      type: 'image',
    }),
    defineField({
      name: 'link',
      title: 'Link',
      type: 'url',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'Announcement',
    },
    prepare({title, image}) {
      return {
        title: 'Newsletter Announcement',
        subtitle: 'z.B "Follow us on Instagram", oder ein Werbebanner. ',
        // media: TextIcon,
      }
    },
  },
})
