import {defineField, defineType} from 'sanity'

export const recommendation = defineType({
  name: 'recommendation',
  title: 'Recommendation',
  type: 'document',
  fields: [
    defineField({
      name: 'person',
      title: 'Person',
      type: 'reference',
      to: [{type: 'person'}],
      weak: true,
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
      // pick the image out of the medium array
      media: 'person.portrait.0.image', // <-- this is the Sanity image field
      name: 'person.name',
      eventTitle: 'event.title',
    },
    prepare({media, name, eventTitle}) {
      const localizedTitle =
        Array.isArray(eventTitle) &&
        (eventTitle.find((t) => t.language === 'en')?.value || eventTitle[0]?.value || 'Untitled')

      return {
        media, // this will render the portrait image in the list
        title: `${name || 'Unknown person'} on ${localizedTitle || 'No event linked'}`,
      }
    },
  },
})
