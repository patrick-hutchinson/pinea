import {defineType, defineArrayMember} from 'sanity'

export const singleLineRichText = defineType({
  name: 'singleLineRichText',
  title: 'Formatted Text (Single Line)',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [], // no headings
      lists: [], // no bullet/number lists
      marks: {
        decorators: [
          {title: 'Bold', value: 'strong'},
          {title: 'Italic', value: 'em'},
        ],
        annotations: [], // no links
      },
      // ❗️ Prevent multiple blocks (only one allowed)
      // Sanity doesn't directly support min/max blocks inside a block,
      // but we enforce it via validation:
    }),
  ],
  validation: (Rule) => Rule.max(1).error('This field can only contain one line of text.'),
})
