// ./schemas/objects/mediaVideo.js
import {defineType, defineField} from 'sanity'

export const videoWithMetadata = defineType({
  name: 'videoWithMetadata',
  title: 'Video',
  type: 'object',
  fields: [
    defineField({
      name: 'video',
      type: 'mux.video',
      title: 'Video',
      options: {
        collapsible: false,
        collapsed: false,
      },
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
    }),
  ],
  preview: {
    select: {
      title: 'copyright',
      subtitle: 'rightsEnd',
    },
  },
})
