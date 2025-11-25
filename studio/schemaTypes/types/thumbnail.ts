import {defineType, defineField} from 'sanity'
import {imageWithMetadata} from './imageWithMetadata'
import {videoWithMetadata} from './videoWithMetadata'

export const thumbnail = defineType({
  name: 'thumbnail',
  title: 'Thumbnail',
  type: 'object',
  fields: [
    defineField({
      name: 'mediaType',
      title: 'Thumbnail Type',

      type: 'string',
      options: {
        list: [
          {title: 'Image', value: 'image'},
          {title: 'Video', value: 'video'},
          {title: 'None', value: 'none'},
        ],
        layout: 'radio', // shows as radio buttons instead of dropdown
        direction: 'horizontal',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      type: 'imageWithMetadata',

      title: 'Image',
      hidden: ({parent}) => parent?.mediaType !== 'image',
    }),

    defineField({
      name: 'video',
      type: 'videoWithMetadata',

      title: 'Video',
      hidden: ({parent}) => parent?.mediaType !== 'video',
    }),
  ],

  preview: {
    select: {
      image: 'image.image',
      video: 'video.video',
      mediaType: 'mediaType',
      copyright: 'image.copyright.0.children.0.text',
      rightsEnd: 'image.rightsEnd',
    },
    prepare({image, video, mediaType, copyright, rightsEnd}) {
      return {
        title: mediaType === 'video' ? 'Video Thumbnail' : 'Image Thumbnail',
        subtitle: rightsEnd ? `Rights until ${rightsEnd}` : copyright || '',
        media: image || video,
      }
    },
  },
})
