import {defineType} from 'sanity'
import {medium} from './medium'

export const speaker = defineType({
  name: 'speaker',
  title: 'Guest',
  type: 'document',
  fields: [
    {name: 'name', title: 'Full Name', type: 'string'},
    {name: 'initials', title: 'Abbreviation / Initials', type: 'string'},
    {name: 'role', title: 'Role', type: 'internationalizedArrayString'},
    {name: 'portrait', title: 'Portrait Bild', type: 'medium'},
    {name: 'bio', title: 'Bio', type: 'internationalizedArrayInterviewText'},
    {
      name: 'socials',
      title: 'Externe Links',
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
    },
  ],
})
