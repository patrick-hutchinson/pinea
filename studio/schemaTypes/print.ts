import {defineField, defineType} from 'sanity'

export const print = defineType({
  name: 'print',
  title: 'Print Releases',
  type: 'document',
  fields: [
    // 🧡💙❤️💚 ALL
    defineField({name: 'title', title: 'Title', type: 'internationalizedArrayInterviewText'}),

    defineField({
      name: 'type',
      title: 'Category',
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
      validation: (Rule) => Rule.required(),
    }),

    // 🧡💙❤️💚 ALL
    defineField({
      name: 'releaseDate',
      title: 'Release Date',
      type: 'date',
      options: {
        dateFormat: 'DD.MM.YYYY',
      },
      validation: (Rule) => Rule.required(),
    }),

    // 🧡💙❤️💚 ALL
    defineField({
      name: 'author',
      title: 'Author',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'contributor'}]}],

      description:
        'Wähle aus, wer den Spot On Text geschrieben hat. ⚠️ Dies sollte ein Contributor sein!',
      validation: (Rule) => Rule.required(),
    }),

    // 🧡💙❤️💚 ALL
    defineField({
      name: 'teaser',
      title: 'Teaser',
      type: 'internationalizedArrayInterviewText',
      description: 'z.B als Vorschau für die Übersichtsseiten',
      validation: (Rule) => Rule.required(),
    }),

    // 🧡💙❤️💚 ALL
    defineField({
      name: 'slug',
      title: 'URL',
      type: 'slug',
      options: {
        source: (doc) => {
          let enTitle = 'untitled'

          if (Array.isArray(doc.title)) {
            const enEntry = doc.title.find((t) => t.language === 'en') || doc.title[0]
            if (enEntry?.value?.[0]?.children?.[0]?.text) {
              enTitle = enEntry.value[0].children[0].text
            }
          }

          return enTitle
        },
        slugify: (input) =>
          input
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '') // remove special chars
            .replace(/\s+/g, '-')
            .slice(0, 96),
      },
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
