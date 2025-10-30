import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list'
import type {StructureResolver} from 'sanity/structure'

import {CalendarIcon} from '@sanity/icons'
import {PinFilledIcon} from '@sanity/icons'
import {DashboardIcon} from '@sanity/icons'
import {MasterDetailIcon} from '@sanity/icons'

// Define singleton document IDs here
const singletons = ['pictureBrush', 'site', 'aboutPage']

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

      S.divider(),

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
              S.listItem()
                .title('About Page')
                .child(S.document().schemaType('aboutPage').documentId('aboutPage')),
            ]),
        ),

      S.divider(),

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
      S.listItem()
        .title('People')
        .child(
          S.documentTypeList('voice')
            .title('People')
            .defaultOrdering([{field: '_createdAt', direction: 'desc'}]),
        ),
      S.listItem()
        .title('Locations')
        .child(
          S.documentTypeList('location')
            .title('Locations')
            .defaultOrdering([{field: '_createdAt', direction: 'desc'}]),
        ),
      // S.listItem().title('Voices').child(S.document().schemaType('voice').documentId('voice')),

      S.divider(),

      // Everything else (exclude hidden types)
      ...S.documentTypeListItems().filter(
        (listItem) =>
          !hiddenTypes.includes(listItem.getId()!) &&
          !['event', 'voice', 'location', 'eventType', 'artistLabel', 'country'].includes(
            listItem.getId()!,
          ),
      ),

      S.divider(),

      // Definitions folder
      S.listItem()
        .title('Definitions')
        .child(
          S.list()
            .title('Definitions')
            .items([
              S.listItem()
                .title('Event Types')
                .schemaType('eventType')
                .child(S.documentTypeList('eventType').title('Event Types')),
              S.listItem()
                .title('Artist Labels')
                .schemaType('artistLabel')
                .child(S.documentTypeList('artistLabel').title('Artist Labels')),
              S.listItem()
                .title('Countries')
                .schemaType('country')
                .child(S.documentTypeList('country').title('Country')),
            ]),
        ),

      // ...S.documentTypeListItems().filter((listItem) => !hiddenTypes.includes(listItem.getId()!)),
    ])
