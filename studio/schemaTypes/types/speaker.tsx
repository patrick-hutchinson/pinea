import {defineType} from 'sanity'
import {medium} from './medium'

export const speaker = defineType({
  name: 'speaker',
  title: 'Speaker',
  type: 'document',
  fields: [
    {name: 'name', title: 'Full Name', type: 'string'},
    {name: 'initials', title: 'Abbreviation / Initials', type: 'string'},
    {name: 'role', title: 'Role', type: 'internationalizedArrayString'},
    {name: 'portrait', title: 'Portrait Bild', type: 'medium'},
    {name: 'bio', title: 'Bio', type: 'internationalizedArrayInterviewText'},
  ],
})
