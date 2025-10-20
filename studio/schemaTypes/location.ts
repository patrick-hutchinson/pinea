import {defineField, defineType} from 'sanity'
import countries from 'world-countries'

const countryMap = Object.fromEntries(countries.map((c) => [c.cca2, c.name.common]))

export const location = defineType({
  name: 'location',
  title: 'Locations',
  type: 'document',
  fields: [
    defineField({name: 'museum', title: 'Museum', type: 'internationalizedArrayString'}),
    defineField({
      name: 'country',
      title: 'Country',
      type: 'string',
      options: {
        list: countries.map((c) => ({
          title: c.name.common,
          value: c.cca2, // store ISO code
        })),
      },
    }),
    defineField({name: 'city', title: 'City', type: 'string'}),
    defineField({name: 'url', title: 'Link to the Organization Website', type: 'string'}),
  ],
  preview: {
    select: {
      title: 'museum',
      city: 'city',
      country: 'country',
    },
    prepare({title, city, country}) {
      const localizedTitle =
        Array.isArray(title) &&
        (title.find((t) => t.language === 'en')?.value || title[0]?.value || 'Untitled')

      const countryName = countryMap[country] || country || ''
      const subtitle = [city, countryName].filter(Boolean).join(', ')
      return {
        title: localizedTitle,
        subtitle,
      }
    },
  },
})
