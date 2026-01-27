import {defineField, defineType} from 'sanity'

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
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'event',
      title: 'Event',
      type: 'reference',
      to: [{type: 'event'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'teaser',
      title: 'Teaser',
      type: 'internationalizedArrayInterviewText',
      description: 'The first sentence of the comment',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'comment',
      title: 'Comment',
      type: 'internationalizedArrayInterviewText',
      description: 'Continuation of the comment',
    }),
  ],
  preview: {
    select: {
      media: 'voice.portrait', // adjust this path
      voiceName: 'voice.name',
      eventTitle: 'event.title',
    },
    prepare({media, voiceName, eventTitle}) {
      const localizedTitle =
        Array.isArray(eventTitle) &&
        (eventTitle.find((t) => t.language === 'en')?.value || eventTitle[0]?.value || 'Untitled')
      return {
        media: media,
        title: `${voiceName || 'Unknown voice'} on ${localizedTitle || 'No event linked'}`,
      }
    },
  },
})
