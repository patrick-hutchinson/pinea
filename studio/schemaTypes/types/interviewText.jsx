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
      marks: {
        decorators: [{title: 'Emphasis', value: 'em'}],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [{name: 'href', type: 'url', title: 'URL'}],
            icon: LinkIcon,
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
                to: [{type: 'speaker'}],
              },
            ],
            icon: () => '💬',
          },
        ],
      },
    }),
  ],
})
