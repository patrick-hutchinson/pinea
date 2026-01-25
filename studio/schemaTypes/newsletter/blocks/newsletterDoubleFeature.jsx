import {InlineIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const newsletterDoubleFeature = defineType({
  name: 'newsletterDoubleFeature',
  title: 'Features (genau 2!)',
  icon: InlineIcon,
  type: 'object',

  fields: [
    defineField({
      name: 'story',
      title: 'Feature',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'featureTitle',
              title: 'Leitender Text',
              type: 'string',
            }),
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
            }),
            defineField({
              name: 'isSmall',
              title: 'Bildgröße (klein)',
              type: 'boolean',
              description:
                'Aktiviere dieses Feld, um das Bild in der Email klein anzeigen zu lassen.',
            }),
          ],
        },
      ],
      options: {
        maxLength: 2,
      },
      validation: (Rule) => Rule.required().min(2).max(2).error('Bitte genau 2 Features anlegen.'),
    }),
  ],
  preview: {
    select: {
      title: 'Features',
    },
    prepare({title, image}) {
      return {
        title: 'Features',
        subtitle: 'Zwei Features mit Bild und Text.',
      }
    },
  },
})
