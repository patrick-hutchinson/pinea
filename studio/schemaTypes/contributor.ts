import {defineType, defineField} from 'sanity'
import {medium} from './types/medium'

export const contributor = defineType({
  name: 'contributor',
  title: 'Contributor',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Full Name', type: 'string'}),
    defineField({name: 'initials', title: 'Abbreviation / Initials', type: 'string'}),
    defineField({name: 'role', title: 'Role', type: 'internationalizedArrayString'}),
    defineField({name: 'portrait', title: 'Portrait Bild', type: 'medium'}),
    defineField({name: 'bio', title: 'Bio', type: 'internationalizedArrayInterviewText'}),
    defineField({
      name: 'socials',
      title: 'Socials',
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
