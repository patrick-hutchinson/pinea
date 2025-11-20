import {defineField, defineType} from 'sanity'
import {medium} from './types/medium'
import ArrayMaxItems from './components/ArrayMaxItems'

export const feature = defineType({
  name: 'feature',
  title: 'Features',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'internationalizedArrayInterviewText'}),
    defineField({name: 'author', title: 'Author', type: 'string'}),
    defineField({
      name: 'cover',
      title: 'Cover Media',
      type: 'medium',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'reference',
      title: 'Verknüpfung',
      type: 'reference',
      to: [{type: 'spotOn'}, {type: 'review'}, {type: 'interview'}],
      components: {input: ArrayMaxItems},
      description: 'Bitte lege fest, auf welche Seite verlinkt werden soll.',
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
