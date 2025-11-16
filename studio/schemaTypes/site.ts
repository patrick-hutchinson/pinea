import {defineField, defineType} from 'sanity'
import {textEdit} from './types/textEdit'
import {interviewText} from './types/interviewText'
import {gallery} from './types/gallery'
import {medium} from './types/medium'
import {thumbnail} from './types/thumbnail'
import {media} from './blocks/media'

export const site = defineType({
  name: 'site',
  title: 'Site',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),

    defineField({
      name: 'description',
      title: 'Description',
      type: 'internationalizedArrayText',
    }),

    defineField({
      name: 'address',
      title: 'Address',
      type: 'array',
      of: [{type: 'block'}],
    }),

    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
    }),

    defineField({
      name: 'socials',
      title: 'Socials',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'platform', title: 'Platform', type: 'string'},
            {name: 'link', title: 'url', type: 'string'},
          ],
        },
      ],
    }),

    gallery,
    defineField({name: 'medium', title: 'medium', type: 'media'}),
  ],
  preview: {
    prepare: () => ({title: 'Site'}),
  },
})
