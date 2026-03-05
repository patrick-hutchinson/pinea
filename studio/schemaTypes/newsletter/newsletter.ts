import {defineArrayMember, defineField, defineType} from 'sanity'

export const newsletter = defineType({
  name: 'newsletter',
  title: 'Newsletter',
  type: 'document',
  fields: [
    defineField({
      name: 'language',
      title: 'Sprache',
      type: 'string',
      options: {
        list: [
          {title: 'Englisch', value: 'en'},
          {title: 'Deutsch', value: 'de'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required().error('Bitte eine Sprache auswählen.'),
    }),
    defineField({
      name: 'list',
      title: 'Empfänger Liste',
      type: 'string',
      options: {
        list: [
          {title: 'P.IN.E.A Periodical (DE)', value: 'pinea_de'},
          {title: 'P.IN.E.A Periodical (EN)', value: 'pinea_en'},
          {title: 'P.IN.E.A Members / Early Bird (DE)', value: 'pinea_earlybird_de'},
          {title: 'P.IN.E.A Members / Early Bird (EN)', value: 'pinea_earlybird_en'},
          {title: 'P.IN.E.A Anzeigenkunden (DE)', value: 'pinea_anzeigekunden_de'},
          {title: 'P.IN.E.A Anzeigenkunden (EN)', value: 'pinea_anzeigekunden_en'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required().error('Bitte eine Sprache auswählen.'),
    }),
    defineField({
      name: 'title',
      title: 'Titel',
      type: 'string',
      validation: (Rule) => Rule.required().error('Bitte gebe einen Titel an.'),
    }),
    defineField({
      name: 'release',
      title: 'Release',
      type: 'string',
    }),
    defineField({
      name: 'subject',
      title: 'Email: Betreff',
      type: 'string',
      validation: (Rule) => Rule.required().error('Bitte gebe einen Email Betreff an.'),
    }),
    defineField({
      name: 'pageBuilder',
      type: 'array',
      title: 'Email Inhalt ',
      of: [
        defineArrayMember({name: 'newsletterRunningText', type: 'newsletterRunningText'}),
        defineArrayMember({name: 'newsletterShowcase', type: 'newsletterShowcase'}),
        defineArrayMember({name: 'newsletterBulletins', type: 'newsletterBulletins'}),
        defineArrayMember({name: 'newsletterDoubleFeature', type: 'newsletterDoubleFeature'}),
        defineArrayMember({name: 'newsletterAnnouncements', type: 'newsletterAnnouncements'}),
        defineArrayMember({name: 'newsletterAdBanner', type: 'newsletterAdBanner'}),
      ],
    }),

    defineField({
      name: 'slug',
      title: 'URL-Teil',
      type: 'slug',
      options: {
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare({title}) {
      return {
        title: title,
      }
    },
  },
})
