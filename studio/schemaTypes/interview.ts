import {defineField, defineType} from 'sanity'
import {thumbnail} from './types/thumbnail'
import {gallery} from './types/gallery'

import {medium} from './types/medium'
import {interviewText} from './types/interviewText'
import {speaker} from './types/speaker'

import {media} from './blocks/media'
import {slideshow} from './blocks/slideshow'
import ArrayMaxItems from './components/ArrayMaxItems'

export const interview = defineType({
  name: 'interview',
  title: 'Interview',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'internationalizedArrayString'}),
    defineField({
      name: 'teaser',
      title: 'Teaser',
      type: 'internationalizedArrayInterviewText',
      description: 'z.B als Vorschau für die Übersichtsseiten',
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
      name: 'cover',
      title: 'Cover Media',
      type: 'array',
      description: 'Dieses Bild steht am Anfang neben dem Titel des Interviews.',
      of: [{type: 'media'}, {type: 'slideshow'}],
      components: {input: ArrayMaxItems},
      validation: (rule) => rule.max(1),
    }),
    defineField({
      name: 'interviewers',
      title: 'Interviewer/s',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'speaker'}]}],
      description: 'Wähle aus, wer das Interview geleitet hat.',
    }),
    defineField({
      name: 'speakers',
      title: 'Speakers',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'speaker'}]}],
      description: 'Wähle aus, wer interviewed wurde.',
    }),

    defineField({
      name: 'interview',
      title: 'Interview',
      type: 'internationalizedArrayInterviewText',
    }),

    defineField({
      name: 'bios',
      title: 'Bios',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'speaker'}]}],
      description: 'Wähle aus, von wem eine Bio angezeigt werden soll.',
    }),

    gallery,

    defineField({
      name: 'fullscreenMedia',
      title: 'Vollbild Bildmaterial',
      type: 'array',
      description: 'Wähle Bildmaterial aus, das unter dem Satelliten angezeigt wird.',
      of: [{type: 'media'}, {type: 'slideshow'}],
      components: {input: ArrayMaxItems},
      validation: (rule) => rule.max(1),
    }),

    defineField({
      name: 'articleImage',
      title: 'Article Image',
      type: 'medium',
      description: 'Dieses Bild steht (klein) neben der zweiten Hälfte des Artikels.',
    }),

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
