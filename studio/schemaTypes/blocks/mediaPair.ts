import {defineField, defineType} from 'sanity'

import {media} from './media'
import {medium} from '../types/medium'
import {slideshow} from './slideshow'

import ArrayMaxItems from '../components/ArrayMaxItems'

export const mediaPair = defineType({
  name: 'mediaPair',
  type: 'object',
  title: 'Media Pair',
  fields: [
    {
      name: 'left',
      type: 'array',
      of: [{type: 'media'}, {type: 'slideshow'}],
      components: {input: ArrayMaxItems},
      validation: (rule) => rule.max(1),
    },
    {
      name: 'right',
      type: 'array',
      of: [{type: 'media'}, {type: 'slideshow'}],
      components: {input: ArrayMaxItems},
      validation: (rule) => rule.max(1),
    },
  ],
  options: {
    columns: 2, // will show them side by side
  },
  preview: {
    select: {
      leftType: 'left._type',
      rightType: 'right._type',
    },
    prepare({leftType, rightType}) {
      return {
        title: `${leftType} left / ${rightType} right`,
      }
    },
  },
})
