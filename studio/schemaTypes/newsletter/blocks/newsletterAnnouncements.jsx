import {defineType, defineField} from 'sanity'
import {SparkleIcon} from '@sanity/icons'

export const newsletterAnnouncements = defineType({
  name: 'newsletterAnnouncements',
  title: 'Announcements',
  icon: SparkleIcon,
  type: 'object',

  fields: [
    defineField({name: 'sectionHeader', title: 'Modul Überschrift', type: 'string'}),
    defineField({
      name: 'items',
      title: 'Announcements',
      type: 'array',
      of: [{type: 'newsletterAnnouncement'}],
    }),
  ],
  preview: {
    select: {
      title: 'Announcement',
    },
    prepare({title, image}) {
      return {
        title: 'Newsletter Announcements',
        subtitle: 'z.B "Follow us on Instagram", oder ein Werbebanner. ',
        // media: TextIcon,
      }
    },
  },
})
