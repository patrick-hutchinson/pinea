import {defineField, defineType} from 'sanity'

export const portfolio = defineType({
  name: 'portfolio',
  title: 'Portfolio',
  type: 'document',
  fields: [
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'image', title: 'Image', type: 'image'},
            {name: 'artist', title: 'Artist', type: 'string'},
            {name: 'title', title: 'Artist', type: 'string'},
          ],
        },
      ],
    }),
  ],
  preview: {
    prepare: () => ({title: 'Portfolio Gallery'}),
  },
})
