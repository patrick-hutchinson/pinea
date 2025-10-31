import {defineField, defineType} from 'sanity'
import {gallery} from '../types/gallery'

export const slideshow = defineType({
  name: 'slideshow',
  type: 'object',
  fields: [gallery],
  preview: {
    select: {
      firstImage: 'gallery.0.image',
      count: 'gallery.length',
    },
    prepare({firstImage}) {
      return {
        title: 'Slideshow',
        media: firstImage,
      }
    },
  },
})
