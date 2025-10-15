import {defineType, defineField} from 'sanity'

export const customImage = defineType({
  name: 'customImage',
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
      name: 'copyright',
      type: 'array',
      of: [{type: 'block'}],
      title: 'Copyright',
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
      media: 'customImage',
      title: 'copyright',
      subtitle: 'rightsEnd',
    },
  },
})
