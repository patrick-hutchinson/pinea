import {defineField, defineType} from 'sanity'
import {medium} from './types/medium'
import {gallery} from './types/gallery'

export const openCall = defineType({
  name: 'openCall',
  title: 'Open Call',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'teaser',
      title: 'Teaser',
      type: 'internationalizedArrayInterviewText',
    }),
    defineField({
      name: 'deadline',
      title: 'Deadline',
      type: 'date',
      options: {dateFormat: 'DD.MM.YYYY'},
    }),
    defineField({
      name: 'text',
      title: 'Fließtext',
      type: 'internationalizedArrayInterviewText',
    }),
    defineField({
      name: 'link',
      title: 'Link',
      type: 'string',
      description: 'Verlinkt dieser Beitrag auf eine externe Seite? Dann füge hier den Link ein.',
    }),
    defineField({
      name: 'slug',
      title: 'URL-Teil',
      type: 'slug',
      description:
        'Ein Beispiel: 👉 www.neverathome.com/mein-artikel ("mein-artikel" ist URL-Teil)',
      options: {
        source: (doc) => {
          const titles = doc.title

          if (!Array.isArray(titles)) return ''

          return titles.find((t) => t.language === 'en')?.value || titles[0]?.value || ''
        },
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'deadline',
    },
    prepare({title, subtitle}) {
      const localizedTitle =
        Array.isArray(title) &&
        (title.find((t) => t.language === 'en')?.value || title[0]?.value || 'Untitled')

      return {
        title: localizedTitle,
        subtitle: subtitle,
      }
    },
  },
})
