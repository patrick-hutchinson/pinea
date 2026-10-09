import {defineField, defineType} from 'sanity'

export const menu = defineType({
  name: 'menu',
  title: 'Menu',
  type: 'document',
  fields: [
    defineField({
      name: 'menu_teaser',
      title: 'Menu Teaser Text',
      type: 'internationalizedArrayInterviewText',
      description: 'Dieser Text läuft im Menu durch.',
    }),
    defineField({
      name: 'mediaAsset',
      title: 'Media Assets',
      type: 'array',
      of: [{type: 'imageWithMetadata'}, {type: 'videoWithMetadata'}],
      description:
        'Diese Medien ersetzen das zufällige Cover aus der Site-Gallery im Menü. Beim Öffnen des Menüs wird zufällig eines ausgewählt.',
    }),
  ],
  preview: {
    prepare: () => ({title: 'Menu'}),
  },
})
