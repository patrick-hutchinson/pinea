import {defineField, defineType} from 'sanity'
import {medium} from './types/medium'

export const personHomePage = defineType({
  name: 'personHomePage',
  title: 'Person',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string'}),
    defineField({name: 'role', title: 'Institution', type: 'internationalizedArrayText'}),
    defineField({name: 'text', title: 'Text', type: 'internationalizedArrayText'}),
    defineField({
      name: 'portrait',
      title: 'Portrait',
      type: 'medium',
    }),
    defineField({
      name: 'reference',
      title: 'Verknüpfung',
      type: 'reference',
      to: {type: 'voice'},
      description: 'Bitte lege fest, auf welche Seite verlinkt werden soll.',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'portrait.0.image',
    },
    prepare({title, media}) {
      return {
        title,
        media,
      }
    },
  },
})
