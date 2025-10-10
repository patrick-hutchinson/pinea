import {defineType, defineField} from 'sanity'

export const thumbnail = defineType({
  name: 'thumbnail',
  title: 'Thumbnail',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      type: 'image',
      title: 'Image',
      hidden: ({parent}) => !!parent?.video, // hide if video is set
    }),
    defineField({
      name: 'video',
      type: 'mux.video',
      title: 'Video',
      options: {accept: 'video/*'},
      hidden: ({parent}) => !!parent?.image, // hide if image is set
    }),
  ],
  preview: {
    select: {image: 'image', video: 'video'},
    prepare({image, video}) {
      return {
        title: video ? 'Video Thumbnail' : 'Image Thumbnail',
        media: image || video,
      }
    },
  },
})
