import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list'
import type {StructureResolver} from 'sanity/structure'

import {CalendarIcon} from '@sanity/icons'
import {PinFilledIcon} from '@sanity/icons'
import {DashboardIcon} from '@sanity/icons'
import {MasterDetailIcon} from '@sanity/icons'

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
        .title('Site')
        .icon(DashboardIcon)
        .child(S.document().schemaType('site').documentId('site')),

      // Pages
      S.listItem()
        .title('Pages')
        .icon(MasterDetailIcon)
        .child(
          S.list()
            .title('Pages')
            .items([
              S.listItem()
                .title('Home Page')
                .child(
                  S.list()
                    .title('Home Page')
                    .items([
                      S.listItem()
                        .title('Picture Brush')
                        .child(S.document().schemaType('pictureBrush').documentId('pictureBrush')),
                    ]),
                ),
            ]),
        ),

      S.listItem()
        .title('Portfolios')
        .child(S.document().schemaType('portfolio').documentId('portfolio')),

      S.listItem()
        .title('Events')
        .icon(CalendarIcon)
        .child(
          S.list()
            .title('Events')
            .items([
              S.listItem()
                .title('Pinned')
                .icon(PinFilledIcon)
                .child(
                  S.documentTypeList('event').title('Pinned').filter('_type == "event" && pinned'),
                ),
              S.listItem()
                .title('Current / Upcoming')
                .child(
                  S.documentTypeList('event')
                    .title('Current / Upcoming')
                    .filter('_type == "event" && (coalesce(endDate, startDate) >= now())')
                    .defaultOrdering([{field: 'startDate', direction: 'asc'}]),
                ),
              S.listItem()
                .title('Past')
                .child(
                  S.documentTypeList('event')
                    .title('Past Events')
                    .filter('_type == "event" && coalesce(endDate, startDate) < now()')
                    .defaultOrdering([{field: 'startDate', direction: 'desc'}]),
                ),
              S.listItem()
                .title('Drafts')
                .child(
                  S.documentTypeList('event')
                    .title('Drafts / Undated')
                    .filter('_type == "event" && !defined(startDate) && !defined(endDate)')
                    .defaultOrdering([{field: '_createdAt', direction: 'desc'}]),
                ),
              S.listItem()
                .title('Recommendations')
                .child(S.documentTypeList('recommendation').title('Recommentation')),
            ]),
        ),

      // Everything else (exclude hidden types)
      ...S.documentTypeListItems().filter(
        (listItem) =>
          !hiddenTypes.includes(listItem.getId()!) &&
          !['event', 'recommendation'].includes(listItem.getId()!),
      ),

      // ...S.documentTypeListItems().filter((listItem) => !hiddenTypes.includes(listItem.getId()!)),
    ])
