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
      title: 'Alt Text (Wichtig für SEO and Barrierefreiheit)',
      name: 'altText',
      type: 'string',
    }),
    defineField({
      title: 'Caption / Copyright',
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
      video: 'video',
    },
    prepare({video}) {
      return {
        media: video,
        title: 'Video',
      }
    },
  },
})
