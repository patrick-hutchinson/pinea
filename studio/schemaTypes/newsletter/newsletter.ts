import {defineField, defineType} from 'sanity'

export const newsletter = defineType({
  name: 'newsletter',
  title: 'Newsletter',
  type: 'document',
  fields: [
    defineField({
      name: 'language',
      title: 'Sprache',
      type: 'string',
      options: {
        list: [
          {title: 'Englisch', value: 'en'},
          {title: 'Deutsch', value: 'de'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required().error('Bitte eine Sprache auswählen.'),
    }),
    defineField({
      name: 'title',
      title: 'Titel',
      type: 'string',
      validation: (Rule) => Rule.required().error('Bitte gebe einen Titel an.'),
    }),
    defineField({
      name: 'release',
      title: 'Release',
      type: 'string',
    }),
    defineField({
      name: 'subject',
      title: 'Email: Betreff',
      type: 'string',
      validation: (Rule) => Rule.required().error('Bitte gebe einen Email Betreff an.'),
    }),

    defineField({
      name: 'cover',
      title: 'Cover Bild',
      type: 'image',
    }),
    defineField({
      name: 'text',
      title: 'Email: Fließtext',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'slug',
      title: 'URL-Teil',
      type: 'slug',
      options: {
        maxLength: 96,
        source: (doc) => {
          if (!Array.isArray(doc.title)) return ''

          return doc.title
            .map((block) => block.children?.map((child) => child.text).join('') || '')
            .join(' ')
            .trim()
        },
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare({title}) {
      return {
        title: title,
      }
    },
  },
})
