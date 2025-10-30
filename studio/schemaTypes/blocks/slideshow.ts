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
    prepare({firstImage, count}) {
      return {
        title: count > 1 ? `Slideshow: (${count} images)` : 'Slideshow (1 image)',
        media: firstImage,
      }
    },
  },
})
