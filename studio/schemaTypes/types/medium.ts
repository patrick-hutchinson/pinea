import {defineField, defineType} from 'sanity'
import {imageWithMetadata} from './imageWithMetadata'
import {videoWithMetadata} from './videoWithMetadata'
import ArrayMaxItems from '../components/ArrayMaxItems'

export const medium = defineType({
  name: 'medium',
  title: 'Media',
  type: 'array',
  of: [{type: 'imageWithMetadata'}, {type: 'videoWithMetadata'}],
  components: {input: ArrayMaxItems},
  validation: (rule) => rule.max(1),
})

// import {defineField, defineType} from 'sanity'
// import {imageWithMetadata} from './imageWithMetadata'
// import {videoWithMetadata} from './videoWithMetadata'

// import ArrayMaxItems from '../components/ArrayMaxItems'

// export const medium = defineType({
//   name: 'medium',
//   type: 'object',
//   fields: [
//     defineField({
//       name: 'medium',
//       title: 'Medium',
//       type: 'array',
//       of: [{type: 'imageWithMetadata'}, {type: 'videoWithMetadata'}],
//       components: {input: ArrayMaxItems},
//       validation: (rule) => rule.max(1),
//     }),
//   ],
//   preview: {
//     select: {
//       media: 'medium.0.image',
//     },
//     prepare({media}) {
//       return {
//         media,
//         title: 'Single Media',
//       }
//     },
//   },
// })
