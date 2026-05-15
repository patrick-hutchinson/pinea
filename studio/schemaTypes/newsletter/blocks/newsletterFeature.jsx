import {ImageIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const newsletterFeature = defineType({
  name: 'newsletterFeature',
  title: 'Feature (Small Image)',
  icon: ImageIcon,
  type: 'object',

  fields: [
    defineField({name: 'label', title: 'Label (z.B. Promotion)', type: 'string'}),
    defineField({name: 'image', title: 'Image', type: 'image'}),
    defineField({
      name: 'imageLink',
      title: 'Image Link',
      type: 'string',
      validation: (Rule) => Rule.uri({allowRelative: false, scheme: ['http', 'https']}),
    }),
    defineField({name: 'copyright', title: 'Copyright Text', type: 'string'}),
    defineField({name: 'text', title: 'Email: Fließtext', type: 'array', of: [{type: 'block'}]}),
  ],
  preview: {
    select: {
      title: 'Feature',
    },
    prepare() {
      return {
        title: 'Feature (Small Image)',
        subtitle: 'Schwarzer Hintergrund mit zentriertem Bild und Text darunter.',
      }
    },
  },
})
