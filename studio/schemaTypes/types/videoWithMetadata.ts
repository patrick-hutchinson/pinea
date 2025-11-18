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
      name: 'copyrightIntl',
      title: 'Copyright',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'copyrightInternational',
      title: 'Copyright',
      type: 'internationalizedArraySingleLineRichText',
    }),
    defineField({
      title: 'Bildunterschrift',
      description: 'Nur für die Startseite relevant.',
      name: 'subtitle',
      type: 'internationalizedArrayString',
    }),
  ],
  preview: {
    select: {
      video: 'video',
      rightsEnd: 'rightsEnd',
    },
    prepare({video, rightsEnd}) {
      // let subtitle

      // if (rightsEnd) {
      //   const today = new Date()
      //   const endDate = new Date(rightsEnd)
      //   const diffMs = endDate - today
      //   const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

      //   if (diffDays > 7) {
      //     subtitle = `✅ Your rights expire in ${diffDays} day${diffDays !== 1 ? 's' : ''}.`
      //   } else if (diffDays > 0 && diffDays <= 7) {
      //     subtitle = `⚠️ Your rights expire in ${diffDays} day${diffDays !== 1 ? 's' : ''}!`
      //   } else {
      //     subtitle = '❌ Rights have expired!'
      //   }
      // } else {
      //   subtitle = 'You have not configured any copyright date.'
      // }

      return {
        media: video,
        title: 'Video',
        // subtitle,
      }
    },
  },
})
