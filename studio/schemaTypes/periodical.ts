import {defineField, defineType} from 'sanity'
import {gallery} from './types/gallery'
import ArrayMaxItems from './components/ArrayMaxItems'

export const periodical = defineType({
  name: 'periodical',
  title: 'Periodical',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'internationalizedArrayInterviewText',
    }),
    gallery,
    defineField({
      name: 'description',
      title: 'Description',
      type: 'internationalizedArrayInterviewText',
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
