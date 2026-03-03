import {at, createIfNotExists, defineMigration, patch, set} from 'sanity/migrate'

type RefValue = {_key?: string; _type: 'reference'; _ref: string; _weak?: boolean}

const toVisitId = (interviewId: string) => {
  const isDraft = interviewId.startsWith('drafts.')
  const baseId = isDraft ? interviewId.slice('drafts.'.length) : interviewId

  const visitBaseId = baseId.startsWith('interview.')
    ? `visit.${baseId.slice('interview.'.length)}`
    : `visit.${baseId}`

  return isDraft ? `drafts.${visitBaseId}` : visitBaseId
}

export default defineMigration({
  title: 'interview-to-visit',
  documentTypes: ['interview'],

  async *migrate(documents, context) {
    const migratedDocs: Array<{oldId: string; newId: string}> = []

    for await (const doc of documents()) {
      const {_createdAt, _id, _originalId, _rev, _system, _type, _updatedAt, ...rest} = doc
      const newId = toVisitId(doc._id)

      migratedDocs.push({oldId: doc._id, newId})

      // _type is immutable in Sanity; create visit docs with new IDs.
      yield createIfNotExists({
        ...rest,
        _id: newId,
        _type: 'visit',
      })
    }

    for (const {oldId, newId} of migratedDocs) {
      const contributors = await context.client.fetch<Array<{_id: string; articles?: RefValue[]}>>(
        `*[_type == "contributor" && defined(articles) && count(articles[_ref == $oldId]) > 0]{
          _id,
          articles
        }`,
        {oldId},
      )

      for (const contributor of contributors) {
        const nextArticles = (contributor.articles ?? []).map((entry) =>
          entry?._ref === oldId ? {...entry, _ref: newId} : entry,
        )
        yield patch(contributor._id, [at('articles', set(nextArticles))])
      }

      const features = await context.client.fetch<Array<{_id: string; reference?: RefValue[]}>>(
        `*[_type == "feature" && defined(reference) && count(reference[_ref == $oldId]) > 0]{
          _id,
          reference
        }`,
        {oldId},
      )

      for (const feature of features) {
        const nextReferences = (feature.reference ?? []).map((entry) =>
          entry?._ref === oldId ? {...entry, _ref: newId} : entry,
        )
        yield patch(feature._id, [at('reference', set(nextReferences))])
      }

      const periodicals = await context.client.fetch<
        Array<{_id: string; reference?: {_type: 'reference'; _ref: string; _weak?: boolean}}>
      >(
        `*[_type == "periodical" && defined(reference._ref) && reference._ref == $oldId]{
          _id,
          reference
        }`,
        {oldId},
      )

      for (const periodical of periodicals) {
        const nextReference: {_type: 'reference'; _ref: string; _weak?: boolean} = {
          _type: 'reference',
          _ref: newId,
        }
        if (periodical.reference?._weak) nextReference._weak = true
        yield patch(periodical._id, [at('reference', set(nextReference))])
      }
    }
  },
})
