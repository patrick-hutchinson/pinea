import {defineField, defineType} from 'sanity'
import {medium} from './types/medium'
import {gallery} from './types/gallery'

export const memberships = defineType({
  name: 'memberships',
  title: 'Memberships',
  type: 'document',
  fields: [
    // defineField({
    //   name: 'text',
    //   title: 'Text',
    //   type: 'internationalizedArrayInterviewText',
    // }),
    defineField({name: 'name', title: 'Name', type: 'internationalizedArrayString'}),
    defineField({
      name: 'description',
      title: 'Beschreibung',
      type: 'internationalizedArrayInterviewText',
    }),
    defineField({name: 'cover', title: 'Cover', type: 'medium'}),

    defineField({name: 'pricing', title: 'Preis', type: 'internationalizedArrayInterviewText'}),
  ],
  preview: {
    select: {
      title: 'name',
    },
    prepare({title}) {
      const localizedTitle =
        Array.isArray(title) &&
        (title.find((t) => t.language === 'en')?.value || title[0]?.value || 'Untitled')

      return {
        title: localizedTitle,
      }
    },
  },
})
