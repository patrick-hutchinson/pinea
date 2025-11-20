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
      name: 'menu_teaser',
      title: 'Menu Teaser Text',
      type: 'internationalizedArrayInterviewText',
      description: 'Dieser Text läuft im Menu durch.',
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
      title: 'Footer Socials',
      type: 'array',

      of: [
        {
          type: 'object',
          fields: [
            {name: 'platform', title: 'Platform', type: 'internationalizedArrayString'},
            {name: 'link', title: 'url', type: 'string'},
          ],
        },
      ],
      description: 'Diese Links werden im Footer angezeigt.',
    }),

    defineField({
      name: 'vorstand',
      title: 'Vorstand',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'name', title: 'Name', type: 'string'},
            {name: 'role', title: 'Role', type: 'string'},
          ],
        },
      ],
    }),

    gallery,

    defineField({
      name: 'imprint',
      title: 'Imprint',
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
