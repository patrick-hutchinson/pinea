import {defineField, defineType} from 'sanity'
import {textEdit} from './types/textEdit'
import {interviewText} from './types/interviewText'
import {gallery} from './types/gallery'
import {medium} from './types/medium'
import {thumbnail} from './types/thumbnail'
import {media} from './blocks/media'

export const imprint = defineType({
  name: 'imprint',
  title: 'Imprint',
  type: 'document',

  fields: [
    defineField({
      name: 'media_kit_de',
      title: 'Media Kit DE',
      type: 'file',
    }),
    defineField({
      name: 'media_kit_en',
      title: 'Media Kit EN',
      type: 'file',
    }),

    defineField({
      name: 'footerLogosGerman',
      title: 'Supporter Logos Deutsch',
      type: 'array',
      of: [{type: 'file'}],
    }),
    defineField({
      name: 'footerLogosEnglish',
      title: 'Supporter Logos Englisch',
      type: 'array',
      of: [{type: 'file'}],
    }),
    defineField({
      name: 'supporterLogosGerman',
      title: 'Förder:innen Logos Deutsch',
      type: 'array',
      of: [{type: 'file'}],
    }),
    defineField({
      name: 'supporterLogosEnglish',
      title: 'Förder:innen Logos Englisch',
      type: 'array',
      of: [{type: 'file'}],
    }),

    defineField({
      name: 'imprint',
      title: 'Imprint',
      type: 'internationalizedArrayInterviewText',
    }),
    defineField({
      name: 'legal',
      title: 'AGBs',
      type: 'internationalizedArrayInterviewText',
    }),
    defineField({
      name: 'copyright',
      title: 'Copyright',
      type: 'internationalizedArrayInterviewText',
    }),
    defineField({
      name: 'privacy',
      title: 'Privacy Policy',
      type: 'internationalizedArrayInterviewText',
    }),
  ],
  preview: {
    prepare: () => ({title: 'Site'}),
  },
})
