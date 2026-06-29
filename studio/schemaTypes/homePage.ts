import {defineField, defineType} from 'sanity'
import {medium} from './types/medium'
import {gallery} from './types/gallery'
import ShopifyProductHandleInput from './components/ShopifyProductHandleInput'

export const homePage = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  fields: [
    defineField({
      name: 'featuredArticle',
      title: 'Feature',
      type: 'object',
      description: '➡️ Dieser Artikel wird in voller Breite am Anfang der Website gezeigt.',
      fields: [
        defineField({
          name: 'reference',
          title: 'Referenzierer Artikel',
          type: 'reference',
          to: [{type: 'visit'}, {type: 'spotOn'}, {type: 'portfolio'}, {type: 'review'}],
          description: '🔗 Wähle aus, zu welchem Artikel verlinkt werden soll.',
        }),
        defineField({
          name: 'cover',
          title: 'Cover Media',
          type: 'medium',
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'portfolios',
      title: 'Portfolios',
      type: 'array',
      description: "➡️ Diese Portfolios werden in unserer 'Satelliten 🛰️' Gallerie angezeigt. ",
      of: [
        {
          type: 'reference',
          to: [{type: 'portfolio'}],
        },
      ],
    }),

    // defineField({name: 'membership', type: 'string'}),
    defineField({
      name: 'membership',
      description: '➡️ Hier legst du ein beliebigen Call to Action an.',
      type: 'array',
      validation: (Rule) => Rule.max(1),
      of: [
        {
          type: 'object',
          options: {modal: {type: 'dialog'}},
          fields: [
            {
              name: 'reference',
              title: 'Link',
              description: '🔗 Gebe an, auf welche Seite dieses Modul verlinken soll.',
              type: 'reference',
              to: [{type: 'page'}, {type: 'periodical'}],
            },
            {name: 'medium', title: 'Cover Bild', type: 'medium'},
            {name: 'title', type: 'internationalizedArrayString'},
            {name: 'description', type: 'internationalizedArrayText'},
          ],
          preview: {
            prepare() {
              return {
                title: 'Inhalte: Membership Call to Action',
              }
            },
          },
        },
      ],
    }),

    defineField({
      name: 'visit',
      type: 'array',
      validation: (Rule) => Rule.max(1),
      description: '➡️ Dieses Modul wird neben dem Membership Modul angezeigt.',
      of: [
        {
          type: 'object',
          options: {modal: {type: 'dialog'}},
          fields: [
            {
              name: 'reference',
              title: 'Artikel',
              type: 'reference',
              to: [{type: 'visit'}, {type: 'spotOn'}, {type: 'portfolio'}, {type: 'review'}],
              description: 'Wähle aus, zu welchem Artikel verlinkt werden soll.',
            },
            gallery,
            {
              name: 'description',
              title: 'Beschreibung',
              type: 'internationalizedArrayInterviewText',
              description: 'Gebe wahlweise einen Hinleitings-Text ein.',
            },
          ],
          preview: {
            select: {
              title: 'reference.title',
            },
            prepare({title}) {
              let localizedTitle = 'Untitled'

              if (Array.isArray(title)) {
                const enEntry = title.find((t) => t.language === 'en') || title[0]

                if (enEntry?.value?.[0]?.children?.[0]?.text) {
                  localizedTitle = enEntry.value[0].children[0].text
                }
              }

              return {
                title: localizedTitle,
              }
            },
          },
        },
      ],
    }),

    defineField({
      name: 'announcements',
      title: 'Announcements',
      type: 'array',
      description: '➡️ Wähle aus, welche Announcements auf der Home Seite angezeigt werden sollen.',
      of: [
        {
          type: 'reference',
          to: [{type: 'announcement'}],
        },
      ],
    }),

    defineField({
      name: 'person',
      title: 'Person: Home Page Anzeige',
      type: 'array',
      description:
        '➡️ Wähle aus, welche Person auf der Home Seite angezeigt werden soll, und füge zusätzliche Inhalte hinzu.',
      validation: (Rule) => Rule.max(1),
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'reference',
              title: 'Verknüpfung',
              type: 'reference',
              to: [{type: 'person'}],
              description: 'Bitte lege fest, auf welche Seite verlinkt werden soll.',
            }),
            defineField({name: 'text', title: 'Text', type: 'internationalizedArrayText'}),
          ],
          preview: {
            select: {
              title: 'reference.name',
              media: 'reference.portrait.0.image',
            },
            prepare({title, media}) {
              return {
                title,
                media,
              }
            },
          },
        },
      ],
    }),
    // defineField({
    //   name: 'homepagePeriodical',
    //   title: 'Periodical',
    //   validation: (Rule) => Rule.max(1),
    //   type: 'array',
    //   of: [
    //     {
    //       type: 'object',
    //       fields: [
    //         defineField({
    //           name: 'reference',
    //           title: 'Verknüpfung',
    //           type: 'reference',
    //           to: [{type: 'periodical'}],
    //           description: 'Bitte lege fest, auf welche Seite verlinkt werden soll.',
    //         }),
    //         defineField({
    //           name: 'title',
    //           title: 'Title',
    //           type: 'internationalizedArrayText',
    //           description: 'Wähle hier eine beliebige Überschrift',
    //         }),
    //         defineField({
    //           name: 'text',
    //           title: 'Text',
    //           type: 'internationalizedArrayText',
    //           description: 'Wähle hier einen beliebigen Freitext',
    //         }),
    //       ],
    //       preview: {
    //         select: {
    //           title: 'reference.title',
    //         },
    //         prepare({title}) {
    //           return {
    //             title: `ℹ️ Verlinktes Periodical: ${title} `,
    //           }
    //         },
    //       },
    //     },
    //   ],
    // }),

    defineField({
      name: 'edition',
      title: 'Editions: Call to Action',
      type: 'array',
      validation: (Rule) => Rule.max(1),
      of: [
        {
          type: 'object',
          options: {modal: {type: 'dialog'}},
          fields: [
            {name: 'title', type: 'internationalizedArrayString'},
            {name: 'description', type: 'internationalizedArrayText'},
            {name: 'medium', title: 'Cover Bild', type: 'medium'},
            defineField({
              name: 'shopifyProductHandle',
              title: 'Shopify Product',
              type: 'string',
              description: '🔗 Wähle aus, auf welches Shopify Produkt diese CTA verlinken soll.',
              components: {input: ShopifyProductHandleInput},
            }),
          ],
          preview: {
            prepare() {
              return {
                title: 'Inhalte: Editions: Call to Action',
              }
            },
          },
        },
      ],
    }),
  ],
  preview: {
    prepare: () => ({title: 'Home Page'}),
  },
})
