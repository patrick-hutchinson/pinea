import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list'

import type {StructureResolver} from 'sanity/structure'

import {CalendarIcon} from '@sanity/icons'
import {PinFilledIcon} from '@sanity/icons'
import {DashboardIcon} from '@sanity/icons'
import {MasterDetailIcon} from '@sanity/icons'

import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'

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
              S.listItem()
                .title('Calendar Page')
                .child(S.document().schemaType('calendarPage').documentId('calendarPage')),
            ]),
        ),

      S.divider(),

      orderableDocumentListDeskItem({
        type: 'announcement',
        title: 'Werbung/Announcements',
        S,
        context,
      }),

      S.listItem()
        .title('Stories')
        .child(
          S.list()
            .title('Stories')
            .items([
              S.listItem().title('Visits').child(S.documentTypeList('interview').title('Visits')),
              S.listItem().title('Reviews').child(S.documentTypeList('review').title('Review')),
              S.listItem().title('Spot On').child(S.documentTypeList('spotOn').title('spotOn')),
              // S.listItem().title('').child(S.documentTypeList('spotOn').title('spotOn')),
              S.listItem()
                .title('Portfolios')
                .child(S.documentTypeList('portfolio').title('portfolio')),
              S.listItem().title('People').child(S.documentTypeList('voice').title('voice')),
            ]),
        ),

      S.listItem()
        .title('Calendar')
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
                    .apiVersion('2025-01-01'),
                ),
              S.listItem()
                .title('Hosted')
                .child(
                  S.documentTypeList('event')
                    .title('Hosted')
                    .filter('_type == "event" && highlight.hosted')
                    .apiVersion('2025-01-01'),
                ),
              S.listItem()
                .title('Recommended')
                .child(
                  S.documentTypeList('event')
                    .title('Recommended')
                    .filter('_type == "event" && highlight.recommended')
                    .apiVersion('2025-01-01'),
                ),
              S.listItem()
                .title('Current / Upcoming')
                .child(
                  S.documentTypeList('event')
                    .title('Current / Upcoming')
                    .filter(
                      `_type == "event" && (coalesce(duration.endDate, duration.startDate) >= "${new Date().toISOString().split('T')[0]}")`,
                    )
                    .apiVersion('2025-01-01')
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
                    .apiVersion('2025-01-01')
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
                    .apiVersion('2025-01-01')
                    .defaultOrdering([{field: '_createdAt', direction: 'desc'}]),
                ),
            ]),
        ),
      // S.listItem()
      //   .title('Locations')
      //   .child(
      //     S.documentTypeList('location')
      //       .title('Locations')
      //       .defaultOrdering([{field: '_createdAt', direction: 'desc'}]),
      //   ),
      // S.listItem().title('Voices').child(S.document().schemaType('voice').documentId('voice')),

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
            'homePage',
            'calendarPage',
            'periodical',
            'announcement',
            'feature',
            'country',
            'artist',
            'review',
            'advertisementBanner',
            'portfolio',
            'interview',
            'spotOn',
            'speaker',
            'voice',
            'institution',
            'pictureBrushTool',
            'personHomePage',
            'newsletterSettings',
            'newsletter',
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
              S.listItem()
                .title('Artists')
                .schemaType('artist')
                .child(S.documentTypeList('artist').title('Artist')),
              S.listItem()
                .title('Guests')
                .schemaType('speaker')
                .child(S.documentTypeList('speaker').title('Guest')),
              S.listItem()
                .title('Locations')
                .schemaType('location')
                .child(S.documentTypeList('location').title('Location')),
              S.listItem()
                .title('Institutions')
                .schemaType('institution')
                .child(S.documentTypeList('institution').title('Institutions')),
            ]),
        ),

      S.listItem()
        .title('Tools')
        .child(
          S.list()
            .title('Tools')
            .items([
              S.listItem()
                .title('Picture Brush')
                .schemaType('pictureBrushTool')
                .child(S.documentTypeList('pictureBrushTool').title('Bildpinsel')),
            ]),
        ),

      S.listItem()
        .title('Newsletter')
        .child(
          S.list()
            .title('Newsletter')
            .items([
              S.listItem()
                .title('Newsletter Einstellungen')
                .schemaType('newsletterSettings')
                .child(S.documentTypeList('newsletterSettings').title('Newsletter Einstellungen')),
              S.listItem()
                .title('Newsletter Veröffentlichungen')
                .schemaType('newsletter')
                .child(S.documentTypeList('newsletter').title('Newsletter Veröffentlichungen')),
            ]),
        ),

      // ...S.documentTypeListItems().filter((listItem) => !hiddenTypes.includes(listItem.getId()!)),
    ])
