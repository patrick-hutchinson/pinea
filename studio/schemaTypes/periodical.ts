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
    defineField({
      name: 'printEntries',
      title: 'Print Entries',
      description: 'Alle Print-Einträge für diese Ausgabe.',
      type: 'array',
      of: [
        {
          type: 'object',
          title: 'Print Entry',
          fields: [
            defineField({
              name: 'legacyPrintId',
              title: 'Legacy Print ID',
              type: 'string',
              readOnly: true,
              hidden: true,
            }),
            defineField({name: 'title', title: 'Title', type: 'internationalizedArrayInterviewText'}),
            defineField({
              name: 'category',
              type: 'string',
              options: {
                list: [
                  {title: 'Visits', value: 'visits'},
                  {title: 'Spot On', value: 'spotOn'},
                  {title: 'Portfolios', value: 'portolios'},
                  {title: 'Reviews', value: 'reviews'},
                  {title: 'Insight', value: 'insight'},
                  {title: 'Features', value: 'features'},
                  {title: 'Context', value: 'context'},
                  {title: 'Carte Blanche', value: 'carteBlanche'},
                  {title: 'Reading Room', value: 'readingRoom'},
                ],
                layout: 'radio',
              },
            }),
            defineField({
              name: 'releaseDate',
              title: 'Erscheinungsdatum',
              type: 'date',
              options: {
                dateFormat: 'DD.MM.YYYY',
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'author',
              title: 'Author',
              type: 'array',
              of: [{type: 'reference', to: [{type: 'contributor'}], weak: true}],
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'teaser',
              title: 'Teaser',
              type: 'internationalizedArrayInterviewText',
              description: 'z.B als Vorschau für die Übersichtsseiten',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'title',
              category: 'category',
            },
            prepare({title, category}) {
              let localizedTitle = 'Untitled'

              if (Array.isArray(title)) {
                const enEntry = title.find((t) => t.language === 'en') || title[0]
                if (enEntry?.value?.[0]?.children?.[0]?.text) {
                  localizedTitle = enEntry.value[0].children[0].text
                }
              }

              return {
                title: localizedTitle,
                subtitle: category || '',
              }
            },
          },
        },
      ],
    }),
  ],
})
