import {at, createIfNotExists, defineMigration, patch, set} from 'sanity/migrate'

const toPersonId = (voiceId: string) => `person.${voiceId}`

export default defineMigration({
  title: 'voice-to-person',
  documentTypes: ['voice'],

  async *migrate(documents, context) {
    const migratedVoiceDocs: Array<{oldId: string; newId: string}> = []

    for await (const doc of documents()) {
      const {_createdAt, _id, _rev, _system, _type, _updatedAt, ...rest} = doc
      const newId = toPersonId(doc._id)

      migratedVoiceDocs.push({oldId: doc._id, newId})

      // _type is immutable in Sanity, so we create a new person document instead.
      yield createIfNotExists({
        ...rest,
        _id: newId,
        _type: 'person',
      })
    }

    // Re-point known references from legacy voice docs to new person docs.
    for (const {oldId, newId} of migratedVoiceDocs) {
      const recommendations = await context.client.fetch<
        Array<{_id: string; voice?: {_weak?: boolean}; person?: {_weak?: boolean}}>
      >(
        `*[
          _type == "recommendation" &&
          (
            (defined(person._ref) && person._ref == $oldId) ||
            (defined(voice._ref) && voice._ref == $oldId)
          )
        ]{
          _id,
          voice,
          person
        }`,
        {oldId},
      )

      for (const recommendation of recommendations) {
        const nextRef: {_type: 'reference'; _ref: string; _weak?: boolean} = {
          _type: 'reference',
          _ref: newId,
        }

        if (recommendation.person?._weak || recommendation.voice?._weak) nextRef._weak = true
        yield patch(recommendation._id, [at('voice', set(nextRef))])
      }

      const personHomePages = await context.client.fetch<
        Array<{_id: string; reference?: {_weak?: boolean}}>
      >(
        `*[_type == "personHomePage" && defined(reference._ref) && reference._ref == $oldId]{
          _id,
          reference
        }`,
        {oldId},
      )

      for (const personHomePage of personHomePages) {
        const nextRef: {_type: 'reference'; _ref: string; _weak?: boolean} = {
          _type: 'reference',
          _ref: newId,
        }

        if (personHomePage.reference?._weak) nextRef._weak = true
        yield patch(personHomePage._id, [at('reference', set(nextRef))])
      }
    }
  },
})
