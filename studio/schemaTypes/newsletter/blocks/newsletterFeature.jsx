// import {InlineIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const newsletterFeature = defineType({
  name: 'newsletterFeature',
  title: 'Newsletter: Feature',
  type: 'object',

  fields: [
    defineField({
      name: 'featureTitle',
      type: 'internationalizedArrayString',
      title: 'Leitender Text',
    }),
    defineField({name: 'image', title: 'Image', type: 'image'}),
    defineField({name: 'link', title: 'Link', type: 'string'}),
    defineField({
      name: 'isSmall',
      title: 'Auswahl: Bildgröße',
      type: 'boolean',
      description: 'Aktiviere dieses Feld, um das Bild in der Email klein anzeigen zu lassen.',
    }),
  ],
})
