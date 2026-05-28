import {append, at, defineMigration, patch, setIfMissing} from 'sanity/migrate'

type PrintDoc = {
  _id: string
  title?: unknown
  category?: string
  releaseDate?: string
  teaser?: unknown
  author?: Array<{_type: 'reference'; _ref: string; _weak?: boolean; _key?: string}>
}

const isDraftId = (id: string) => id.startsWith('drafts.')
const baseId = (id: string) => (isDraftId(id) ? id.slice('drafts.'.length) : id)

const sanitizeAuthorRefs = (author: PrintDoc['author']) =>
  Array.isArray(author)
    ? author
        .filter((item) => item?._type === 'reference' && typeof item?._ref === 'string')
        .map((item) => ({
          _type: 'reference' as const,
          _ref: item._ref,
          ...(item._weak ? {_weak: true} : {}),
        }))
    : []

const toPrintEntry = (doc: PrintDoc) => ({
  _type: 'object',
  _key: `${baseId(doc._id)}-print-entry`,
  legacyPrintId: baseId(doc._id),
  title: doc.title ?? [],
  category: doc.category ?? '',
  releaseDate: doc.releaseDate ?? '',
  teaser: doc.teaser ?? [],
  author: sanitizeAuthorRefs(doc.author),
})

export default defineMigration({
  title: 'print-docs-to-periodical-print-entries',

  async *migrate(documents, context) {
    const printDocs: PrintDoc[] = []
    const periodicals: Array<{_id: string; _createdAt?: string; printEntries?: Array<{legacyPrintId?: string}>}> = []

    for await (const doc of documents()) {
      if (doc._type === 'print') {
        printDocs.push(doc as PrintDoc)
      }

      if (doc._type === 'periodical') {
        periodicals.push(doc as {_id: string; _createdAt?: string; printEntries?: Array<{legacyPrintId?: string}>})
      }
    }

    if (printDocs.length === 0 || periodicals.length === 0) return

    // If both draft + published versions exist for the same print doc, prefer the draft version.
    const printByBaseId = new Map<string, PrintDoc>()
    for (const doc of printDocs) {
      const key = baseId(doc._id)
      const existing = printByBaseId.get(key)
      if (!existing || isDraftId(doc._id)) {
        printByBaseId.set(key, doc)
      }
    }
    const normalizedPrintDocs = Array.from(printByBaseId.values())

    const sortedPeriodicals = [...periodicals].sort((a, b) =>
      String(a._createdAt || '').localeCompare(String(b._createdAt || '')),
    )
    const targetPeriodical = sortedPeriodicals.find((doc) => isDraftId(doc._id)) || sortedPeriodicals[0]

    if (!targetPeriodical?._id) return

    const existingLegacyIds = new Set(
      (targetPeriodical.printEntries || []).map((entry) => entry?.legacyPrintId).filter(Boolean) as string[],
    )

    const entriesToAppend = normalizedPrintDocs
      .filter((doc) => !existingLegacyIds.has(baseId(doc._id)))
      .map((doc) => toPrintEntry(doc))

    if (entriesToAppend.length === 0) return

    yield patch(targetPeriodical._id, [
      at('printEntries', setIfMissing([])),
      at('printEntries', append(entriesToAppend)),
    ])
  },
})
