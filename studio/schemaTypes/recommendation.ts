import {defineField, defineType} from 'sanity'
import {thumbnail} from './types/thumbnail'

export const recommendation = defineType({
  name: 'recommendation',
  title: 'Recommendation',
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
      voiceName: 'voice.name',
      eventTitle: 'event.title',
    },
    prepare({voiceName, eventTitle}) {
      return {
        title: `${voiceName || 'Unknown voice'} on ${eventTitle || 'No event linked'}`,
      }
    },
  },
})
