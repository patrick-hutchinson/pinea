import {defineField, defineType} from 'sanity'
import {thumbnail} from './types/thumbnail'
import {gallery} from './types/gallery'

import {medium} from './types/medium'
import {interviewText} from './types/interviewText'
import {speaker} from './types/speaker'

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
    defineField({name: 'cover', title: 'Cover Media', type: 'medium'}),
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
      title: 'Vollbild Bild/Video',
      type: 'medium',
    }),

    defineField({
      name: 'slug',
      title: 'url',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
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
