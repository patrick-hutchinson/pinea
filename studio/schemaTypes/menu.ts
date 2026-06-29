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
      title: 'Media Asset',
      type: 'medium',
      description: 'Dieses Medium ersetzt das zufällige Cover aus der Site-Gallery im Menü.',
    }),
  ],
  preview: {
    prepare: () => ({title: 'Menu'}),
  },
})
