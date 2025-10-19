import {defineField, defineType} from 'sanity'
import countries from 'world-countries'

export const location = defineType({
  name: 'location',
  title: 'Locations',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string'}),
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
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'city',
    },
  },
})
