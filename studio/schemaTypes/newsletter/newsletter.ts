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
    }),
    defineField({
      name: 'title',
      title: 'Titel',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'release',
      title: 'Release',
      type: 'string',
    }),
    defineField({
      name: 'subject',
      title: 'Email: Betreff',
      type: 'array',
      of: [{type: 'block'}],
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
      if (!Array.isArray(title)) return {title: 'Untitled'}

      const en = title.find((t) => t._key === 'en' || t.language === 'en')
      const first = title[0]

      return {
        title: en?.value || en?.text || first?.value || first?.text || 'Untitled',
      }
    },
  },
})
