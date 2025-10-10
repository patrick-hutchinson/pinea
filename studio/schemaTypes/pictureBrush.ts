import {defineField, defineType} from 'sanity'

export const pictureBrush = defineType({
  name: 'pictureBrush',
  title: 'Picture Brush',
  type: 'document',
  fields: [
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [{type: 'image'}],
    }),
  ],
  preview: {
    prepare: () => ({title: 'Picture Brush'}),
  },
})
