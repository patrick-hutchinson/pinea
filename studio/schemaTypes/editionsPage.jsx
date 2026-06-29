import {defineField, defineType} from 'sanity'

export const editionsPage = defineType({
  name: 'editionsPage',
  title: 'Editions Page',
  type: 'document',
  fields: [
    defineField({
      name: 'text',
      title: 'Text',
      type: 'internationalizedArrayInterviewText',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Editions Page',
      }
    },
  },
})
