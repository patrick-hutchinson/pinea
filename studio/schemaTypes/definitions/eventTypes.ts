import {defineType, Rule} from 'sanity'
import {TagIcon} from '@sanity/icons'

export const eventType = defineType({
  name: 'eventType',
  title: 'Event Type',
  icon: TagIcon,
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
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
})
