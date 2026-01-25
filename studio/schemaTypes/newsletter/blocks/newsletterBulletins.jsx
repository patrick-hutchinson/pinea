import {CalendarIcon} from '@sanity/icons'
import {defineType, defineField} from 'sanity'

export const newsletterBulletins = defineType({
  name: 'newsletterBulletins',
  type: 'object',
  icon: CalendarIcon,
  title: 'News/Open Calls',
  fields: [
    defineField({
      name: 'bulletin',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'news'}, {type: 'openCall'}],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'News/Open Call',
    },
    prepare({title, image}) {
      return {
        title: title || 'News/Open Call',
        subtitle: 'Wähle News Anzeigen/Open Calls aus',
        // media: image || DocumentTextIcon,
      }
    },
  },
})
