import {defineArrayMember, defineField, defineType} from 'sanity'

const footerLogoArray = (name: string, title: string) =>
  defineField({
    name,
    title,
    description: 'Die Logos werden in dieser Reihenfolge rechts im Newsletter-Footer angezeigt.',
    type: 'array',
    of: [
      defineArrayMember({
        name: 'footerLogo',
        title: 'Footer Logo',
        type: 'object',
        fields: [
          defineField({
            name: 'name',
            title: 'Name',
            type: 'string',
            validation: (Rule) => Rule.required(),
          }),
          defineField({
            name: 'image',
            title: 'Logo',
            type: 'image',
            options: {hotspot: false},
            description: 'Bevorzugt: das Logo direkt in Sanity hochladen.',
          }),
          defineField({name: 'alt', title: 'Alternativtext', type: 'string'}),
          defineField({name: 'link', title: 'Link', type: 'url'}),
          defineField({
            name: 'desktopWidth',
            title: 'Breite Desktop (px)',
            type: 'number',
            initialValue: 80,
            validation: (Rule) => Rule.integer().positive().max(180),
          }),
          defineField({
            name: 'mobileWidth',
            title: 'Breite Mobile (px)',
            type: 'number',
            initialValue: 60,
            validation: (Rule) => Rule.integer().positive().max(120),
          }),
        ],
        preview: {
          select: {title: 'name', media: 'image'},
          prepare({title, media}) {
            return {title: title || 'Footer Logo', media}
          },
        },
      }),
    ],
  })

export const newsletterSettings = defineType({
  name: 'newsletterSettings',
  title: 'Newsletter Einstellungen',
  type: 'document',
  fields: [
    footerLogoArray('footerLogosDe', 'Footer Logos Deutsch'),
    footerLogoArray('footerLogosEn', 'Footer Logos Englisch'),
  ],
})
