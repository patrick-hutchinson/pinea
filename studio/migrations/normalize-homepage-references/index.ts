import {at, createIfNotExists, defineMigration, patch, set} from 'sanity/migrate'

type Ref = {_type: 'reference'; _ref: string; _weak?: boolean}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === 'object' && !Array.isArray(value)

const hasRef = (value: unknown): value is {_ref: string; _weak?: boolean} =>
  isRecord(value) && typeof value._ref === 'string'

const sanitizeRef = (value: {_ref: string; _weak?: boolean}): Ref => {
  const nextRef: Ref = {_type: 'reference', _ref: value._ref}
  if (value._weak) nextRef._weak = true
  return nextRef
}

const baseId = (docId: string) => (docId.startsWith('drafts.') ? docId.slice(7) : docId)

export default defineMigration({
  title: 'normalize-homepage-references',
  documentTypes: ['homePage'],

  async *migrate(documents) {
    for await (const doc of documents()) {
      const memberValue = (doc as Record<string, unknown>).member
      const personValue = (doc as Record<string, unknown>).person
      const periodicalValue = (doc as Record<string, unknown>).periodical

      if (hasRef(memberValue) && isRecord(memberValue)) {
        const memberRef = sanitizeRef(memberValue)
        const hasExtraKeys = Object.keys(memberValue).some((key) => !['_type', '_ref', '_weak'].includes(key))
        if (hasExtraKeys) {
          yield patch(doc._id, [at('member', set(memberRef))])
        }
      }

      if (hasRef(personValue) && isRecord(personValue)) {
        const personRef = sanitizeRef(personValue)
        const hasExtraKeys = Object.keys(personValue).some((key) => !['_type', '_ref', '_weak'].includes(key))
        if (hasExtraKeys) {
          yield patch(doc._id, [at('person', set(personRef))])
        }
      }

      if (hasRef(periodicalValue) && isRecord(periodicalValue)) {
        const periodicalRef = sanitizeRef(periodicalValue)
        const hasExtraKeys = Object.keys(periodicalValue).some(
          (key) => !['_type', '_ref', '_weak'].includes(key),
        )
        if (hasExtraKeys) {
          yield patch(doc._id, [at('periodical', set(periodicalRef))])
        }
      }

      if (!isRecord(memberValue) || hasRef(memberValue)) continue

      const membershipId = `homePageMembership.${baseId(doc._id)}`
      const legacyTitle = memberValue.title
      const legacyDescription = memberValue.description ?? memberValue.text
      const legacyMedium = memberValue.medium

      yield createIfNotExists({
        _id: membershipId,
        _type: 'homePageMembership',
        ...(legacyTitle ? {title: legacyTitle} : {}),
        ...(legacyDescription ? {description: legacyDescription} : {}),
        ...(legacyMedium ? {medium: legacyMedium} : {}),
      })

      yield patch(doc._id, [at('member', set({_type: 'reference', _ref: membershipId}))])
    }
  },
})
