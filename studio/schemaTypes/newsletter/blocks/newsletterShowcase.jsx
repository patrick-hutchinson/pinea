import {defineField, defineType} from 'sanity'

import {ImageIcon} from '@sanity/icons'

export const newsletterShowcase = defineType({
  name: 'newsletterShowcase',
  title: 'Showcase',
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
    defineField({
      name: 'displaySmallImage',
      title: 'Kleines Bild anzeigen',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({name: 'copyright', title: 'Copyright Text', type: 'string'}),
    defineField({name: 'text', title: 'Email: Fließtext', type: 'newsletterPortableText'}),
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
