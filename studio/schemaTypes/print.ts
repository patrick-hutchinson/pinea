import {defineField, defineType} from 'sanity'

export const print = defineType({
  name: 'print',
  title: 'Print Releases',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'internationalizedArrayInterviewText'}),

    defineField({
      name: 'category',
      type: 'string',
      options: {
        list: [
          {title: 'Visit', value: 'interview'},
          {title: 'Spot On', value: 'spotOn'},
          {title: 'Portfolio', value: 'portolio'},
          {title: 'Review', value: 'review'},
        ],
        layout: 'radio',
      },
    }),

    defineField({
      name: 'releaseDate',
      title: 'Release Date',
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
      of: [{type: 'reference', to: [{type: 'contributor'}]}],

      description:
        'Wähle aus, wer den Spot On Text geschrieben hat. ⚠️ Dies sollte ein Contributor sein!',
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
    },
    prepare({title}) {
      let localizedTitle = 'Untitled'

      if (Array.isArray(title)) {
        const enEntry = title.find((t) => t.language === 'en') || title[0]

        if (enEntry?.value?.[0]?.children?.[0]?.text) {
          localizedTitle = enEntry.value[0].children[0].text
        }
      }

      return {
        title: localizedTitle,
      }
    },
  },
})
