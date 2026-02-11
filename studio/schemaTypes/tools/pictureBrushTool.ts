import {defineField, defineType} from 'sanity'

export const pictureBrushTool = defineType({
  name: 'pictureBrushTool',
  title: 'Picture Brush',
  type: 'document',
  fields: [
    // defineField({
    //   name: 'images',
    //   title: 'Images',
    //   type: 'array',
    //   of: [{type: 'image'}],
    // }),
    defineField({
      name: 'imageSets',
      title: 'Image Sets',
      type: 'array',
      of: [
        {
          name: 'imageSet',
          title: 'Image Set',
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Title',
              type: 'string',
            },
            {
              name: 'images',
              title: 'Images',
              type: 'array',
              of: [{type: 'image'}],
            },
          ],
        },
      ],
    }),
  ],
  preview: {
    prepare: () => ({title: 'Picture Brush'}),
  },
})
