import {defineField, defineType} from 'sanity'

export const pictureBrushTool = defineType({
  name: 'pictureBrushTool',
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
