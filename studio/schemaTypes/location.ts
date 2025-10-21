import {defineField, defineType} from 'sanity'

export const location = defineType({
  name: 'location',
  title: 'Locations',
  type: 'document',
  fields: [
    defineField({name: 'museum', title: 'Museum', type: 'internationalizedArrayString'}),
    defineField({
      name: 'country',
      title: 'Country',
      type: 'reference',
      to: [{type: 'country'}],
    }),
    defineField({name: 'city', title: 'City', type: 'internationalizedArrayString'}),
    defineField({name: 'url', title: 'Link to the Organization Website', type: 'string'}),
  ],
  preview: {
    select: {
      title: 'museum',
      city: 'city',
      country: 'country',
    },
    prepare({title, city}) {
      const localizedTitle =
        Array.isArray(title) &&
        (title.find((t) => t.language === 'en')?.value || title[0]?.value || 'Untitled')

      const localizedSubtitle =
        Array.isArray(city) &&
        (city.find((t) => t.language === 'en')?.value || city[0]?.value || 'Untitled')

      return {
        title: localizedTitle,
        subtitle: localizedSubtitle,
      }
    },
  },
})
