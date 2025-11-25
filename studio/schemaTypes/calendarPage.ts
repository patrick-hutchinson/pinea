import {defineField, defineType} from 'sanity'
import {medium} from './types/medium'
import {media} from './blocks/media'
import {gallery} from './types/gallery'
import ArrayMaxItems from './components/ArrayMaxItems'
import {imageWithMetadata} from './types/imageWithMetadata'
import {videoWithMetadata} from './types/videoWithMetadata'

export const calendarPage = defineType({
  name: 'calendarPage',
  title: 'Calendar Page',
  type: 'document',
  fields: [
    defineField({
      name: 'gallery',
      title: 'Werbebanner',
      type: 'array',
      of: [{type: 'imageWithMetadata'}, {type: 'videoWithMetadata'}],
      options: {
        layout: 'default',
      },
    }),
  ],
  preview: {
    prepare: () => ({title: 'Calendar Page'}),
  },
})
