import {InlineIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const newsletterDoubleFeature = defineType({
  name: 'newsletterDoubleFeature',
  title: 'Features (genau 2!)',
  icon: InlineIcon,
  type: 'object',

  fields: [
    defineField({name: 'sectionHeader', title: 'Modul Überschrift', type: 'string'}),
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
              name: 'title',
              title: 'Leitender Text',
              type: 'text',
            }),
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
            }),
            defineField({
              name: 'linkType',
              title: 'Link Typ',
              type: 'string',
              options: {
                list: [
                  {title: 'Link', value: 'link'},
                  {title: 'Email', value: 'email'},
                  {title: 'File', value: 'file'},
                ],
                layout: 'radio',
              },
              initialValue: 'link',
            }),
            defineField({
              name: 'linkUrl',
              title: 'Link',
              type: 'url',
              hidden: ({parent}) => parent?.linkType !== 'link',
              validation: (Rule) =>
                Rule.uri({
                  allowRelative: false,
                  scheme: ['http', 'https'],
                }),
            }),
            defineField({
              name: 'email',
              title: 'Email',
              type: 'string',
              hidden: ({parent}) => parent?.linkType !== 'email',
              validation: (Rule) => Rule.email(),
            }),
            defineField({
              name: 'file',
              title: 'File',
              type: 'file',
              hidden: ({parent}) => parent?.linkType !== 'file',
            }),
            defineField({
              name: 'link',
              title: 'Legacy Link',
              type: 'string',
              hidden: true,
            }),
            defineField({
              name: 'isSmall',
              title: 'Bildgröße (klein)',
              type: 'boolean',
              description:
                'Aktiviere dieses Feld, um das Bild in der Email klein anzeigen zu lassen.',
            }),
            defineField({
              name: 'textColor',
              title: 'Textfarbe',
              type: 'string',
              options: {
                list: [
                  {title: 'Weiss', value: 'white'},
                  {title: 'Schwarz', value: 'black'},
                ],
                layout: 'radio',
              },
              initialValue: 'white',
            }),
            defineField({name: 'copyright', title: 'Copyright', type: 'string'}),
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
