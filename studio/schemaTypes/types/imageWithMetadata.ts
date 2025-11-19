import {defineType, defineField} from 'sanity'

export const imageWithMetadata = defineType({
  name: 'imageWithMetadata',
  title: 'Image',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      type: 'image',
      title: 'Image',
      options: {hotspot: true},
    }),
    defineField({
      title: 'Alt Text (Wichtig für SEO and Barrierefreiheit)',
      name: 'altText',
      type: 'string',
    }),
    defineField({
      title: 'Copyright',
      description: 'Copyright text hier einfügen',
      name: 'copyright',
      type: 'string',
      hidden: true,
    }),
    defineField({
      name: 'copyrightIntl',
      title: 'Copyright',
      type: 'internationalizedArrayString',
      hidden: true,
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
      hidden: true,
    }),
    defineField({
      name: 'rightsEnd',
      type: 'date',
      title: 'Rights valid until',
      description: 'Date until which the client has usage rights',
    }),
  ],
  preview: {
    select: {
      image: 'image',
      rightsEnd: 'rightsEnd',
    },
    prepare({image, rightsEnd}) {
      let subtitle

      if (rightsEnd) {
        const today = new Date()
        const endDate = new Date(rightsEnd)
        const diffMs = endDate - today
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

        if (diffDays > 7) {
          subtitle = `✅ Your rights expire in ${diffDays} day${diffDays !== 1 ? 's' : ''}.`
        } else if (diffDays > 0 && diffDays <= 7) {
          subtitle = `⚠️ Your rights expire in ${diffDays} day${diffDays !== 1 ? 's' : ''}!`
        } else {
          subtitle = '❌ Rights have expired!'
        }
      } else {
        subtitle = 'You have not configured any copyright date.'
      }

      return {
        media: image,
        title: 'Image',
        subtitle,
      }
    },
  },
})
