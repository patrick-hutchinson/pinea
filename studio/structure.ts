import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list'
import type {StructureResolver} from 'sanity/structure'

// Define singleton document IDs here
const singletons = ['pictureBrush', 'portfolio', 'site']

// Add other types you want to hide from Desk here
const hiddenTypes = [...singletons, 'mux.videoAsset']

export const structure: StructureResolver = (S, context) =>
  S.list()
    .title('Content')
    .items([
      // Singletons
      S.listItem()
        .title('Picture Brush')
        .child(S.document().schemaType('pictureBrush').documentId('pictureBrush')),

      S.listItem()
        .title('Portfolio')
        .child(S.document().schemaType('portfolio').documentId('portfolio')),

      S.listItem().title('Site').child(S.document().schemaType('site').documentId('site')),

      // Everything else (exclude hidden types)
      ...S.documentTypeListItems().filter((listItem) => !hiddenTypes.includes(listItem.getId()!)),
    ])
