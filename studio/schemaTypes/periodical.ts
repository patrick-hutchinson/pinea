import {defineField, defineType} from 'sanity'
import {gallery} from './types/gallery'

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
