import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list'
import type {StructureResolver} from 'sanity/structure'

import {CalendarIcon} from '@sanity/icons'
import {PinFilledIcon} from '@sanity/icons'
import {DashboardIcon} from '@sanity/icons'
import {MasterDetailIcon} from '@sanity/icons'

// Define singleton document IDs here
const singletons = ['pictureBrush', 'site', 'aboutPage', 'membersPage']

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
                      S.listItem()
                        .title('Home Page')
                        .child(S.document().schemaType('homePage').documentId('homePage')),
                    ]),
                ),
              S.listItem()
                .title('About Page')
                .child(S.document().schemaType('aboutPage').documentId('aboutPage')),
              S.listItem()
                .title('Members Page')
                .child(S.document().schemaType('membersPage').documentId('membersPage')),
            ]),
        ),

      S.divider(),

      S.listItem()
        .title('Stories')
        .child(
          S.list()
            .title('Stories')
            .items([
              S.listItem()
                .title('Interviews')
                .child(S.documentTypeList('interview').title('Interviews')),
              S.listItem().title('Reviews').child(S.documentTypeList('review').title('Review')),
              S.listItem()
                .title('Portfolios')
                .child(S.documentTypeList('portfolio').title('portfolio')),
              S.listItem().title('People').child(S.documentTypeList('voice').title('voice')),
            ]),
        ),

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
                    .filter('_type == "event" && highlight.pinned')
                    .apiVersion('2023-10-01'),
                ),
              S.listItem()
                .title('Hosted')
                .child(
                  S.documentTypeList('event')
                    .title('Hosted')
                    .filter('_type == "event" && highlight.hosted')
                    .apiVersion('2023-10-01'),
                ),
              S.listItem()
                .title('Recommended')
                .child(
                  S.documentTypeList('event')
                    .title('Recommended')
                    .filter('_type == "event" && highlight.recommended')
                    .apiVersion('2023-10-01'),
                ),
              S.listItem()
                .title('Current / Upcoming')
                .child(
                  S.documentTypeList('event')
                    .title('Current / Upcoming')
                    .filter(
                      `_type == "event" && (coalesce(duration.endDate, duration.startDate) >= "${new Date().toISOString().split('T')[0]}")`,
                    )
                    .apiVersion('2023-10-01')
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
                    .apiVersion('2023-10-01')
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
                    .apiVersion('2023-10-01')
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
          ![
            'event',
            'voice',
            'location',
            'eventType',
            'artistLabel',
            'country',
            'review',
            'portfolio',
            'interview',
            'voice',
          ].includes(listItem.getId()!),
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
