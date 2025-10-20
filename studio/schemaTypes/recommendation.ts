import {defineField, defineType} from 'sanity'
import {thumbnail} from './types/thumbnail'

export const recommendation = defineType({
  name: 'recommendation',
  title: 'Recommendations',
  type: 'document',
  fields: [
    defineField({
      name: 'voice',
      title: 'Voice',
      type: 'reference',
      to: [{type: 'voice'}],
    }),
    defineField({
      name: 'event',
      title: 'Event',
      type: 'reference',
      to: [{type: 'event'}],
    }),
    defineField({
      name: 'teaser',
      title: 'Teaser',
      type: 'array',
      of: [{type: 'block'}],
      description: 'The first sentence of the comment',
    }),
    defineField({
      name: 'comment',
      title: 'Comment',
      type: 'array',
      of: [{type: 'block'}],
      description: 'Continuation of the comment',
    }),
    defineField({name: 'thumbnail', title: 'Thumbnail', type: 'thumbnail'}),
  ],
  preview: {
    select: {
      media: 'voice.thumbnail.image', // adjust this path to match your thumbnail type
      voiceName: 'voice.name',
      eventTitle: 'event.title',
    },
    prepare({media, voiceName, eventTitle}) {
      return {
        media: media,
        title: `${voiceName || 'Unknown voice'} on ${eventTitle || 'No event linked'}`,
      }
    },
  },
})
