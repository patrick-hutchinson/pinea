import {defineField, defineType} from 'sanity'
import {thumbnail} from './types/thumbnail'
import {interviewText} from './types/interviewText'

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  fields: [
    defineField({
      name: 'about',
      title: 'About Text',
      type: 'internationalizedArrayInterviewText',
    }),
    defineField({
      name: 'contact',
      title: 'Contact',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'name', title: 'Name', type: 'string'},
            {name: 'role', title: 'Role', type: 'internationalizedArrayString'},
            {name: 'phone', title: 'Phone Number', type: 'string'},
            {name: 'email', title: 'Email', type: 'string'},
          ],
        },
      ],
    }),
    defineField({
      name: 'thumbnail',
      title: 'Team Image',
      type: 'thumbnail',
    }),
  ],
  preview: {
    prepare: () => ({title: 'About Page'}),
  },
})
