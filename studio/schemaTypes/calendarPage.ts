import {defineField, defineType} from 'sanity'
import {medium} from './types/medium'
import {media} from './blocks/media'
import ArrayMaxItems from './components/ArrayMaxItems'

export const calendarPage = defineType({
  name: 'calendarPage',
  title: 'Calendar Page',
  type: 'document',
  fields: [
    defineField({
      name: 'medium',
      title: 'Werbe Banner',
      type: 'medium',
    }),
  ],
  preview: {
    prepare: () => ({title: 'Home Page'}),
  },
})
