import {defineType, defineField} from 'sanity'
import {SparkleIcon} from '@sanity/icons'

export const newsletterAnnouncements = defineType({
  name: 'newsletterAnnouncements',
  title: 'Announcements',
  icon: SparkleIcon,
  type: 'object',

  fields: [
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          {title: '2 schmale + 1 breites', value: '2small-1large'},
          // {title: '2 breite', value: '2large'},
          // {title: '4 schmale', value: '4small'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'items',
      title: 'Announcements',
      type: 'array',
      of: [{type: 'newsletterAnnouncement'}],
      validation: (Rule) =>
        Rule.custom((items, context) => {
          const layout = context.parent?.layout

          if (!layout || !items) return true

          if (layout === '2small-1large' && items.length !== 3)
            return 'Dieses Layout benötigt genau 3 Announcements.'

          if (layout === '2large' && items.length !== 2)
            return 'Dieses Layout benötigt genau 2 Announcements.'

          if (layout === '4small' && items.length !== 4)
            return 'Dieses Layout benötigt genau 4 Announcements.'

          return true
        }),
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
