import {defineType, defineField} from 'sanity'

import {LinkIcon} from '@sanity/icons'

export const newsletterAdBanner = defineType({
  name: 'newsletterAdBanner',
  type: 'object',
  icon: LinkIcon,
  title: 'Werbebanner',
  fields: [defineField({name: 'adBanner', type: 'reference', to: [{type: 'adBanner'}]})],
  preview: {
    select: {
      title: 'Werbe Banner',
    },
    prepare({title, image}) {
      return {
        title: title || 'Werbe Banner',
        subtitle: 'Wähle ein Werbebanner aus.',
      }
    },
  },
})
