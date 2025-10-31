import {defineType} from 'sanity'

export const speaker = defineType({
  name: 'speaker',
  title: 'Speaker',
  type: 'document',
  fields: [
    {name: 'name', title: 'Full Name', type: 'string'},
    {name: 'initials', title: 'Abbreviation / Initials', type: 'string'},
  ],
})
