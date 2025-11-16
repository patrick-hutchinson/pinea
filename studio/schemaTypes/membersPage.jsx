import {defineField, defineType} from 'sanity'

export const membersPage = defineType({
  name: 'membersPage',
  title: 'Members Page',
  type: 'document',
  fields: [
    defineField({
      name: 'text',
      title: 'Text',
      type: 'internationalizedArrayInterviewText',
    }),
  ],
  preview: {
    select: {
      title: 'Members Page',
    },
  },
})
