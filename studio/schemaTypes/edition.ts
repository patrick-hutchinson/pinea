import {defineType, defineField} from 'sanity'
import {medium} from './types/medium'
import {gallery} from './types/gallery'
import ShopifyProductHandleInput from './components/ShopifyProductHandleInput'

export const edition = defineType({
  name: 'edition',
  title: 'Edition',
  type: 'document',
  fields: [
    {name: 'title', title: 'Titel', type: 'internationalizedArrayString'},
    defineField({
      name: 'shopifyProductHandle',
      title: 'Shopify Product',
      type: 'string',
      description: '🔗 Wähle aus, auf welches Shopify Produkt der Order Button verlinken soll.',
      components: {input: ShopifyProductHandleInput},
    }),
    defineField({name: 'cover', title: 'Cover', type: 'medium'}),
    gallery,
    defineField({
      name: 'selector',
      title: 'Menu Begriff',
      type: 'internationalizedArrayString',
      description: 'Dieser Begriff wird unter dem Header benutzt, um zum Artikel hinzuführen.',
      validation: (Rule) => Rule.required().error('Bitte gebe einen Menu Begriff an.'),
    }),

    // defineField({name: 'teaser', type: 'internationalizedArrayPortableText'}),
    defineField({
      name: 'info',
      title: 'Edition Info',
      type: 'array',
      of: [
        {
          type: 'object',
          title: 'Info Block',
          fields: [
            {name: 'title', title: 'Titel', type: 'internationalizedArrayString'},
            {name: 'text', title: 'text', type: 'internationalizedArrayPortableText'},
          ],
          preview: {
            select: {
              title: 'title', // points to your array
            },
            prepare(selection) {
              const {title} = selection
              let localizedTitle = 'Untitled'
              // title is an array like [{_key, en: 'English title', de: 'Deutscher Titel'}, ...]
              if (Array.isArray(title)) {
                const enEntry = title.find((t) => t.language === 'en') || title[0]
                localizedTitle = enEntry?.value || 'Untitled'
              }

              return {
                title: localizedTitle,
                subtitle: title?.length > 1 ? `${title.length} entries` : '',
              }
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title', // now this is an array
      media: 'cover.0.image',
    },
    prepare({title, media}) {
      // pick English version or fallback
      const localizedTitle =
        Array.isArray(title) &&
        (title.find((t) => t.language === 'en')?.value || title[0]?.value || 'Untitled')

      return {
        title: localizedTitle,
        media,
      }
    },
  },
})
