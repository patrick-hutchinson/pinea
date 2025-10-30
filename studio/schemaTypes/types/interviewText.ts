import {defineType, defineArrayMember} from 'sanity'

export const interviewText = defineType({
  name: 'interviewText',
  title: 'Body',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      marks: {
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [{name: 'href', type: 'url', title: 'URL'}],
            icon: () => '🔗',
          },
          {
            name: 'footnote',
            type: 'object',
            title: 'Footnote',
            fields: [{name: 'text', type: 'text', title: 'Footnote text'}],
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
