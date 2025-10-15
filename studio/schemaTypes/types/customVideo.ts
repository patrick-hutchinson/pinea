// ./schemas/objects/mediaVideo.js
import {defineType, defineField} from 'sanity'

export const customVideo = defineType({
  name: 'customVideo',
  title: 'Video',
  type: 'object',
  fields: [
    defineField({
      name: 'video',
      type: 'mux.video',
      title: 'Video',
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
    }),
  ],
  preview: {
    select: {
      title: 'copyright',
      subtitle: 'rightsEnd',
    },
  },
})
