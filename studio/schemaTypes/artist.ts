import {defineField, defineType} from 'sanity'

export const artist = defineType({
  name: 'artist',
  title: 'Artist',
  type: 'document',
  fields: [defineField({name: 'name', title: 'Name', type: 'string'})],
  preview: {
    select: {
      title: 'name',
    },
  },
})
