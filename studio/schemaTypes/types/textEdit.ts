import {defineType, defineArrayMember} from 'sanity'

export const textEdit = defineType({
  name: 'textEdit',
  title: 'Body',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      marks: {
        annotations: [
          // Default link annotation
          {
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [
              {
                name: 'href',
                type: 'url',
                title: 'URL',
                validation: (Rule) =>
                  Rule.uri({
                    scheme: ['http', 'https', 'mailto', 'tel'],
                  }),
              },
            ],
            icon: () => '🔗',
          },

          // Custom footnote annotation
          {
            name: 'footnote',
            type: 'object',
            title: 'Footnote',
            fields: [
              {
                name: 'text',
                type: 'text',
                title: 'Footnote text',
              },
            ],
            icon: () => '🦶',
          },
        ],
      },
    }),
  ],
})
