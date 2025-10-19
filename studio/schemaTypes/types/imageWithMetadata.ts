import {defineType, defineField} from 'sanity'

export const imageWithMetadata = defineType({
  name: 'imageWithMetadata',
  title: 'Image',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      type: 'image',
      title: 'Image',
      options: {hotspot: true},
    }),
    defineField({
      title: 'Alt Text',
      name: 'altText',
      type: 'string',
    }),
    defineField({
      title: 'Copyright',
      name: 'copyright',
      type: 'string',
    }),
    defineField({
      name: 'rightsEnd',
      type: 'date',
      title: 'Rights valid until',
      description: 'Date until which the client has usage rights',
    }),
  ],
  preview: {
    select: {
      media: 'image',
    },
  },
})
