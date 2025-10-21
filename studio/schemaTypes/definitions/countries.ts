import {defineField, defineType} from 'sanity'

export const country = defineType({
  name: 'country',
  title: 'Country',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Name', type: 'internationalizedArrayString'}),
    defineField({name: 'cca2', title: 'CCA2', type: 'string'}),
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
