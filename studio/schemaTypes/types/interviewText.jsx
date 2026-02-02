import {defineType, defineArrayMember} from 'sanity'
import {Text} from '@sanity/ui'

import {LinkIcon} from '@sanity/icons'

export const interviewText = defineType({
  name: 'interviewText',
  title: 'Interview Editor',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        {title: 'Normal', value: 'normal'},
        {title: 'Center', value: 'center'}, // <-- added
        {title: 'Zwischenheadline', value: 'separator'}, // <-- new
      ],
      marks: {
        decorators: [{title: 'Emphasis', value: 'em'}],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'Link',
            icon: LinkIcon,
            fields: [
              {
                name: 'href',
                type: 'url',
                title: 'URL',
                validation: (Rule) =>
                  Rule.uri({
                    allowRelative: true,
                    scheme: ['http', 'https', 'mailto', 'tel'],
                  }),
              },
            ],
          },
          {
            name: 'footnote',
            type: 'object',
            title: 'Footnote',
            fields: [
              {
                name: 'text',
                title: 'Footnote text',
                type: 'array',
                of: [{type: 'block'}], // Portable Text inside the footnote
              },
            ],
            icon: () => '🦶',
          },
          {
            name: 'speaker',
            type: 'object',
            title: 'Speaker',
            fields: [
              {
                name: 'ref',
                title: 'Speaker',
                type: 'reference',
                to: [{type: 'speaker'}, {type: 'contributor'}],
              },
            ],
            icon: () => '💬',
          },
        ],
      },
    }),
  ],
})
