import {defineMigration, patch, at, unset} from 'sanity/migrate'

export default defineMigration({
  title: 'clear-voice-bio',
  documentTypes: ['voice'],
  filter: 'defined(bio)',

  async *migrate(documents) {
    for await (const doc of documents()) {
      yield patch(doc._id, [at('bio', unset())])
    }
  },
})
