import {defineField, defineType} from 'sanity'
import {medium} from './types/medium'
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
      name: 'portrait',
      title: 'Team Image',
      type: 'medium',
    }),
  ],
  preview: {
    prepare: () => ({title: 'About Page'}),
  },
})
