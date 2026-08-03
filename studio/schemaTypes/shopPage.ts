import {defineField, defineType} from 'sanity'

export const shopPage = defineType({
  name: 'shopPage',
  title: 'Shop Page',
  type: 'document',
  fields: [
    defineField({
      name: 'showHolidayNotice',
      title: 'Show Banner',
      type: 'boolean',
      initialValue: true,
      description: 'Aktiviert den laufenden Hinweis unter dem FilterHeader im Shop.',
    }),
    defineField({
      name: 'holidayNotice',
      title: 'Holiday Notice Marquee',
      type: 'internationalizedArrayText',
      description: 'Dieser Text wird als laufender Hinweis unter dem FilterHeader im Shop angezeigt.',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Shop Page',
      }
    },
  },
})
