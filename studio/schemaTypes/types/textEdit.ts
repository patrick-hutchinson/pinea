import {defineType, defineArrayMember} from 'sanity'

export const textEdit = defineType({
  name: 'textEdit',
  title: 'Text',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
    }),
  ],
})
