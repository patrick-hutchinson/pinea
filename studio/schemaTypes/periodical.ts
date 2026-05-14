import {defineType, defineField} from 'sanity'
import {medium} from './types/medium'
import {gallery} from './types/gallery'

export const periodical = defineType({
  name: 'periodical',
  title: 'Periodical',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Titel', type: 'string'}),
    defineField({name: 'cover', title: 'Cover', type: 'medium'}),
    gallery,
    defineField({
      name: 'selector',
      title: 'Menu Begriff',
      type: 'internationalizedArrayString',
      description: 'Dieser Begriff wird unter dem Header benutzt, um zum Artikel hinzuführen.',
      validation: (Rule) => Rule.required().error('Bitte gebe einen Menu Begriff an.'),
    }),
    defineField({
      name: 'isbn',
      title: 'Oberer Text (z.B ISBN)',
      type: 'internationalizedArrayInterviewText',
    }),
    defineField({name: 'teaser', type: 'internationalizedArrayInterviewText'}),
    defineField({
      name: 'info',
      title: 'Periodical Info',
      type: 'array',
      of: [
        {
          type: 'object',
          title: 'Info Block',
          fields: [
            {name: 'title', title: 'Titel', type: 'internationalizedArrayString'},
            {name: 'text', title: 'text', type: 'internationalizedArrayInterviewText'},
          ],
          preview: {
            select: {
              title: 'title', // points to your array
            },
            prepare(selection) {
              const {title} = selection
              let localizedTitle = 'Untitled'
              // title is an array like [{_key, en: 'English title', de: 'Deutscher Titel'}, ...]
              if (Array.isArray(title)) {
                const enEntry = title.find((t) => t.language === 'en') || title[0]
                localizedTitle = enEntry?.value || 'Untitled'
              }

              return {
                title: localizedTitle,
                subtitle: title?.length > 1 ? `${title.length} entries` : '',
              }
            },
          },
        },
      ],
    }),
  ],
})
