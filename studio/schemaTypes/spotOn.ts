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
      description:
        'Wähle aus, wer den Spot On Text geschrieben hat. ⚠️ Dies sollte ein Contributor sein!',
    }),
    defineField({
      name: 'speakers',
      title: 'Guests',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'speaker'}]}],
      description: 'Wähle aus, wer interviewed wurde. ⚠️ Dies sollte kein Contributor sein!',
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
      title: 'Cover Bild',
      type: 'array',
      description: 'Dieses Bild steht großflächig am Anfang der Seite, hinter dem Titel.',
      of: [{type: 'media'}, {type: 'slideshow'}],
      // components: {input: ArrayMaxItems},
      validation: (rule) => rule.max(1),
    }),
    defineField({
      name: 'medium',
      title: 'Showcase Bild',
      type: 'medium',
      description: 'Dieses Bild steht klein unter dem Cover Bild. ',
    }),
    defineField({
      name: 'showcase',
      title: 'Personen/Instittions Info',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'institution'}]}],
      components: {input: ArrayMaxItems},
      description: 'Dieses Info Modul wird Unterhalb des Artikels angezeigt.',
    }),
    defineField({
      name: 'teaser',
      title: 'Teaser',
      type: 'internationalizedArrayInterviewText',
      description: 'z.B als Vorschau für die Übersichtsseiten',
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
    defineField({
      name: 'selector',
      title: 'Menu Begriff',
      type: 'internationalizedArrayString',
      description: 'Dieser Begriff wird unter dem Header benutzt, um zum Artikel hinzuführen.',
    }),

    defineField({
      name: 'preview',
      title: 'Vorschau Bild',
      type: 'medium',
      description:
        'Dieses Bild zur Vorschau verwendet, zum Beispiel auf der Stories Übersichtsseite.',
    }),
    defineField({
      name: 'slug',
      title: 'URL',
      type: 'slug',
      options: {
        source: (doc) => {
          let enTitle = 'untitled'

          if (Array.isArray(doc.title)) {
            const enEntry = doc.title.find((t) => t.language === 'en') || doc.title[0]
            if (enEntry?.value?.[0]?.children?.[0]?.text) {
              enTitle = enEntry.value[0].children[0].text
            }
          }

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
      let localizedTitle = 'Untitled'

      if (Array.isArray(title)) {
        const enEntry = title.find((t) => t.language === 'en') || title[0]

        if (enEntry?.value?.[0]?.children?.[0]?.text) {
          localizedTitle = enEntry.value[0].children[0].text
        }
      }

      return {
        title: localizedTitle,
        subtitle,
        media: medium,
      }
    },
  },
})
