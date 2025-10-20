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
                .title('All')
                .icon(CalendarIcon)
                .child(
                  S.documentTypeList('event')
                    .title('All Events')
                    .defaultOrdering([{field: 'duration.startDate', direction: 'desc'}]),
                ),
              S.listItem()
                .title('Pinned')
                .icon(PinFilledIcon)
                .child(
                  S.documentTypeList('event')
                    .title('Pinned')
                    .filter('_type == "event" && highlight.pinned'),
                ),
              S.listItem()
                .title('Hosted')
                .child(
                  S.documentTypeList('event')
                    .title('Hosted')
                    .filter('_type == "event" && highlight.hosted'),
                ),
              S.listItem()
                .title('Recommended')
                .child(
                  S.documentTypeList('event')
                    .title('Recommended')
                    .filter('_type == "event" && highlight.recommended'),
                ),
              S.listItem()
                .title('Current / Upcoming')
                .child(
                  S.documentTypeList('event')
                    .title('Current / Upcoming')
                    .filter(
                      `_type == "event" && (coalesce(duration.endDate, duration.startDate) >= "${new Date().toISOString().split('T')[0]}")`,
                    )
                    .defaultOrdering([{field: 'duration.startDate', direction: 'asc'}]),
                ),
              S.listItem()
                .title('Past')
                .child(
                  S.documentTypeList('event')
                    .title('Past Events')
                    .filter(
                      '_type == "event" && coalesce(duration.endDate, duration.startDate) < now()',
                    )
                    .defaultOrdering([{field: 'duration.startDate', direction: 'desc'}]),
                ),
              S.listItem()
                .title('Drafts')
                .child(
                  S.documentTypeList('event')
                    .title('Drafts / Undated')
                    .filter(
                      '_type == "event" && !defined(duration.startDate) && !defined(duration.endDate)',
                    )
                    .defaultOrdering([{field: '_createdAt', direction: 'desc'}]),
                ),
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
