import {defineType, Rule} from 'sanity'
import {TagIcon} from '@sanity/icons'

export const artistLabel = defineType({
  name: 'artistLabel',
  title: 'Artist Label',
  icon: TagIcon,
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'internationalizedArrayString',
      validation: (Rule: Rule) =>
        Rule.required()
          .min(1)
          .custom(async (title: string, context) => {
            const {document, getClient} = context
            if (!title) return true

            const client = getClient({apiVersion: '2025-01-01'})

            const existing = await client.fetch(
              `*[_type == "eventType" && title == $title${document?._id ? ' && _id != $id' : ''}]`,
              {title, id: document?._id ?? ''},
            )

            return existing.length === 0 ? true : 'This event type already exists'
          }),
    },
  ],
  preview: {
    select: {
      title: 'title', // now this is an array
    },
    prepare({title}) {
      // pick English version or fallback
      const localizedTitle =
        Array.isArray(title) &&
        (title.find((t) => t.language === 'en')?.value || title[0]?.value || 'Untitled')

      return {
        title: localizedTitle,
      }
    },
  },
})
