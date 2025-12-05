import {defineField, defineType} from 'sanity'

export const newsletter = defineType({
  name: 'newsletter',
  title: 'Newsletter',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titel',
      type: 'array',
      of: [{type: 'block'}],
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
      const plainTitle = Array.isArray(title)
        ? title.map((block) => block.children?.map((child) => child.text).join('') || '').join(' ')
        : ''

      return {
        title: plainTitle || 'Untitled Newsletter',
      }
    },
  },
})
