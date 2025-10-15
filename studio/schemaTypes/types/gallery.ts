import {defineField} from 'sanity'
import {customVideo} from './customVideo'
import {customImage} from './customImage'

export const gallery = defineField({
  name: 'gallery',
  title: 'Image & Video Gallery',
  type: 'array',
  of: [{type: 'customImage'}, {type: 'customVideo'}],
  options: {
    layout: 'grid',
  },
})
