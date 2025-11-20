import {defineType, defineField} from 'sanity'
import {medium} from './types/medium'

export const institution = defineType({
  name: 'institution',
  title: 'Institution',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Full Name', type: 'string'}),
    defineField({name: 'portrait', title: 'Portrait Bild', type: 'medium'}),
    defineField({name: 'bio', title: 'Description', type: 'internationalizedArrayInterviewText'}),
    defineField({
      name: 'socials',
      title: 'External Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'platform', title: 'Platform', type: 'internationalizedArrayString'},
            {name: 'link', title: 'url', type: 'string'},
          ],
        },
      ],
    }),
  ],
})
