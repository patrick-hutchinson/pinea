import {defineField, defineType} from 'sanity'

import {ImageIcon} from '@sanity/icons'

export const newsletterShowcase = defineType({
  name: 'newsletterShowcase',
  title: 'Showcase',
  icon: ImageIcon,
  type: 'object',

  fields: [
    defineField({name: 'image', title: 'Image', type: 'image'}),
    defineField({name: 'text', title: 'Email: Fließtext', type: 'array', of: [{type: 'block'}]}),
  ],
  preview: {
    select: {
      title: 'Showcase',
    },
    prepare({title, image}) {
      return {
        title: 'Showcase',
        subtitle: 'Ein promimentes Cover Bild mit Text darunter. ',
        // media: TextIcon,
      }
    },
  },
})
