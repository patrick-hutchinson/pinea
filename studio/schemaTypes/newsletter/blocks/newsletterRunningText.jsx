import {defineField, defineType} from 'sanity'

import {TextIcon} from '@sanity/icons'

export const newsletterRunningText = defineType({
  name: 'newsletterRunningText',
  title: 'Fließtext',
  icon: TextIcon,
  type: 'object',
  fields: [defineField({name: 'runningText', type: 'array', of: [{type: 'block'}]})],
  preview: {
    select: {
      title: 'Fließtext',
    },
    prepare({title, image}) {
      return {
        title: 'Fließtext',
        subtitle: 'Fließtext in voller Breite.',
        // media: TextIcon,
      }
    },
  },
})
