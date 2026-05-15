import {defineArrayMember, defineType} from 'sanity'
import {LinkIcon} from '@sanity/icons'

export const newsletterPortableText = defineType({
  name: 'newsletterPortableText',
  title: 'Newsletter Portable Text',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        {title: 'Linksbündig', value: 'normal'},
        {title: 'Zentriert', value: 'center'},
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
        ],
      },
    }),
  ],
})
