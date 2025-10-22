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
      title: 'Alt Text (short description (e.g for blind people and when images do not load)',
      name: 'altText',
      type: 'string',
    }),
    defineField({
      title: 'Caption',
      name: 'copyright',
      type: 'string',
    }),
    defineField({
      title: 'Copyright',
      name: 'copyrightText',
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
