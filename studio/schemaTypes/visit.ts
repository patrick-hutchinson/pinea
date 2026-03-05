import {defineField, defineType} from 'sanity'
import ArrayMaxItems from './components/ArrayMaxItems'

const visitFields = () => [
  defineField({
    name: 'layout',
    title: 'Layout',
    type: 'string',
    options: {
      list: [
        {title: 'SpotOn Layout', value: 'layoutA'},
        {title: 'Visit Layout', value: 'layoutB'},
        {title: 'Review Layout', value: 'layoutC'},
      ],
    },
  }),

  defineField({name: 'title', title: 'Title', type: 'internationalizedArrayInterviewText'}),

  defineField({
    name: 'releaseInfo',
    title: 'Author & Erscheinungsdatum',
    type: 'object',
    options: {columns: 2},
    fields: [
      {
        name: 'contributor',
        title: 'Contributor',
        type: 'array',
        of: [{type: 'reference', to: [{type: 'contributor'}], weak: true}],
        validation: (Rule) => Rule.required().error('Bitte gebe einen Contributor an.'),
      },
      {
        name: 'releaseDate',
        title: 'Erscheinungsdatum',
        type: 'date',
        options: {
          dateFormat: 'DD.MM.YYYY',
        },
        validation: (Rule) => Rule.required().error('Bitte gebe ein Erscheinungsdatum an.'),
      },
    ],
  }),

  defineField({
    name: 'cover',
    title: 'Cover Bild',
    type: 'array',
    description: 'Dieses Bild steht großflächig am Anfang der Seite, hinter dem Titel.',
    of: [{type: 'media'}, {type: 'slideshow'}],
    validation: (Rule) => Rule.min(1).max(1).error('Bitte gebe ein Cover Bild aus.'),
  }),

  defineField({
    name: 'speakers',
    title: 'Guests',
    type: 'array',
    of: [{type: 'reference', to: [{type: 'speaker'}]}],
    description: 'Falls jemand interviewed wurde, kannst du diese Person/en hier angeben.',
  }),

  defineField({
    name: 'showcase',
    title: 'Personen/Institutions Info',
    type: 'array',
    of: [{type: 'reference', to: [{type: 'institution'}]}],
    components: {input: ArrayMaxItems},
    description: 'Dieses Info Modul wird Unterhalb des Artikels angezeigt.',
  }),

  defineField({
    name: 'text',
    title: 'Fließtext',
    type: 'internationalizedArrayInterviewText',
    description: 'Trage hier den Artikel Inhalt ein!',
    validation: (Rule) => Rule.required().error('Bitte trage den Artikelinhalt (Text) ein.'),
  }),

  defineField({
    name: 'fullscreenMedia',
    title: 'Vollbild Bildmaterial',
    type: 'array',
    description: 'Wähle Bildmaterial aus, das unter dem Satelliten angezeigt wird.',
    of: [{type: 'media'}, {type: 'slideshow'}],
    // components: {input: ArrayMaxItems},
    validation: (rule) => rule.max(1),
  }),

  defineField({
    name: 'gallery',
    title: 'Image & Video Gallerie 🛰️',
    type: 'array',
    of: [{type: 'imageWithMetadata'}, {type: 'videoWithMetadata'}],
    options: {
      layout: 'default',
    },
  }),

  defineField({
    name: 'articleImage',
    title: 'Artikel Bild',
    type: 'medium',
    description: 'Dieses Bild steht (klein) neben der zweiten Hälfte des Artikels.',
  }),

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
]

const visitPreview = {
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
}

export const visit = defineType({
  name: 'visit',
  title: 'Visit',
  type: 'document',
  fields: visitFields(),
  preview: visitPreview,
})
