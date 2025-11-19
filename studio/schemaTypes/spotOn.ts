import {defineField, defineType} from 'sanity'
import {gallery} from './types/gallery'

import {medium} from './types/medium'
import {interviewText} from './types/interviewText'
import {speaker} from './types/speaker'

import {media} from './blocks/media'
import {slideshow} from './blocks/slideshow'
import ArrayMaxItems from './components/ArrayMaxItems'

export const spotOn = defineType({
  name: 'spotOn',
  title: 'Spot On',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'internationalizedArrayInterviewText'}),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'contributor'}]}],
      description: 'Wähle aus, wer den Spot On Text geschrieben hat.',
    }),
    defineField({
      name: 'releaseDate',
      title: 'Release Date',
      type: 'date',
      options: {
        dateFormat: 'DD.MM.YYYY',
      },
    }),
    defineField({
      name: 'teaser',
      title: 'Teaser',
      type: 'internationalizedArrayInterviewText',
      description: 'z.B als Vorschau für die Übersichtsseiten',
    }),
    defineField({
      name: 'cover',
      title: 'Cover Media',
      type: 'array',
      description: 'Dieses Bild steht am Anfang neben dem Titel des Reviews.',
      of: [{type: 'media'}, {type: 'slideshow'}],
      components: {input: ArrayMaxItems},
      validation: (rule) => rule.max(1),
    }),

    defineField({
      name: 'text',
      title: 'Fließtext',
      type: 'internationalizedArrayInterviewText',
    }),

    defineField({
      name: 'quote',
      title: 'Quote/Zitat',
      type: 'internationalizedArrayInterviewText',
    }),

    defineField({name: 'doubleFeature', title: 'Double Feature', type: 'mediaPair'}),

    // gallery,

    // defineField({
    //   name: 'bios',
    //   title: 'Bios',
    //   type: 'array',
    //   of: [{type: 'reference', to: [{type: 'speaker'}]}],
    //   description: 'Wähle aus, von wem eine Bio angezeigt werden soll.',
    // }),

    defineField({
      name: 'slug',
      title: 'URL',
      type: 'slug',
      options: {
        source: (doc) => {
          // Find the English title (or fallback to first available)
          const enTitle =
            Array.isArray(doc.title) &&
            (doc.title.find((t) => t.language === 'en')?.value || doc.title[0]?.value || 'untitled')
          return enTitle
        },
        slugify: (input) =>
          input
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '') // remove special chars
            .replace(/\s+/g, '-')
            .slice(0, 96),
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'speakers.0.name',
      medium: 'cover.0.image',
    },
    prepare({title, subtitle, medium}) {
      const localizedTitle =
        Array.isArray(title) &&
        (title.find((t) => t.language === 'en')?.value || title[0]?.value || 'Untitled')

      return {
        title: localizedTitle,
        subtitle: subtitle,
        media: medium,
      }
    },
  },
})
