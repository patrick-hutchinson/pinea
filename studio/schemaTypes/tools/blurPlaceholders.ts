import {defineType} from 'sanity'
import {gallery} from '../types/gallery'
import BlurPlaceholderGalleryInput from '../components/BlurPlaceholderGalleryInput'

export const blurPlaceholders = defineType({
  name: 'blurPlaceholders',
  title: 'Blur Event Bilder (Random)',
  type: 'document',
  fields: [
    {
      ...gallery,
      components: {
        input: BlurPlaceholderGalleryInput,
      },
    },
  ],
  preview: {
    prepare: () => ({title: 'Blur Event Bilder (Random)'}),
  },
})
