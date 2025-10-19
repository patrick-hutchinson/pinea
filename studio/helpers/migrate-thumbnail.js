import {defineMigration} from 'sanity/migrate'

export default defineMigration({
  title: 'Wrap thumbnail.image into imageWithMetadata',
  migrate: async (doc, context) => {
    if (doc.thumbnail?.image && !doc.thumbnail.image.image) {
      return {
        ...doc,
        thumbnail: {
          _type: 'thumbnail',
          image: {
            _type: 'imageWithMetadata',
            image: doc.thumbnail.image,
          },
        },
      }
    }
    return doc
  },
})
