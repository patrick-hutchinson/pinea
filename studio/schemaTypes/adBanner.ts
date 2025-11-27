import {defineField, defineType} from 'sanity'
import {medium} from './types/medium'

export const adBanner = defineType({
  name: 'adBanner',
  title: 'Werbebanner',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Banner Titel',
      type: 'string',
    }),
    defineField({
      name: 'mediumDesktop',
      title: 'Desktop Banner',
      type: 'medium',
    }),
    defineField({
      name: 'mediumMobile',
      title: 'Mobile Banner',
      type: 'medium',
    }),
    defineField({
      name: 'link',
      title: 'Link',
      type: 'string',
    }),
  ],
  preview: {
    select: {
      title: 'title', // <- field name in your document
    },
    prepare({title}) {
      return {
        title, // whatever is in the 'title' field becomes the preview title
      }
    },
  },
})
