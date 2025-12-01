import {defineField, defineType} from 'sanity'

export const newsletterSettings = defineType({
  name: 'newsletterSettings',
  title: 'Newsletter Einstellungen',
  type: 'document',
  fields: [
    defineField({
      name: 'email',
      title: 'Email Anmeldung: Fülltext',
      type: 'array',
      of: [{type: 'block'}],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Newsletter Einstellungen',
      }
    },
  },
})
