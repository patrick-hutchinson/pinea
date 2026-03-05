import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list'

import type {StructureResolver} from 'sanity/structure'

import {CalendarIcon} from '@sanity/icons'
import {PinFilledIcon} from '@sanity/icons'
import {DashboardIcon} from '@sanity/icons'
import {MasterDetailIcon} from '@sanity/icons'

import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'

// Define singleton document IDs here
const singletons = [
  'pictureBrush',
  'site',
  'aboutPage',
  'membersPage',
  'periodicalPage',
  'page',
  'imprint',
]

// Add other types you want to hide from Desk here
const hiddenTypes = [...singletons, 'mux.videoAsset', 'story']

export const structure: StructureResolver = (S, context) =>
  S.list()
    .title('Content')
    .items([
      // Singletons
      S.listItem()
        .title('Metadaten (SEO, Kontaktdaten)')
        .icon(DashboardIcon)
        .child(S.document().schemaType('site').documentId('site')),

      S.divider(),

      // Pages
      S.listItem()
        .title('Seiten (Inhalte)')
        .icon(MasterDetailIcon)
        .child(
          S.list()
            .title('Seiten')
            .items([
              S.listItem()
                .title('Home Seite')
                .child(
                  S.list()
                    .title('Home Seite')
                    .items([
                      S.listItem()
                        .title('Bild Pinsel')
                        .child(S.document().schemaType('pictureBrush').documentId('pictureBrush')),
                      S.listItem()
                        .title('Home Seite')
                        .child(S.document().schemaType('homePage').documentId('homePage')),
                    ]),
                ),
              S.listItem()
                .title('About Seite')
                .child(S.document().schemaType('aboutPage').documentId('aboutPage')),
              S.listItem()
                .title('Periodical Seite')
                .child(S.document().schemaType('periodicalPage').documentId('periodicalPage')),
              S.listItem()
                .title('Members Seite')
                .child(S.document().schemaType('membersPage').documentId('membersPage')),
              S.listItem()
                .title('Calendar Seite')
                .child(S.document().schemaType('calendarPage').documentId('calendarPage')),
            ]),
        ),

      S.divider(),

      orderableDocumentListDeskItem({
        type: 'announcement',
        title: 'Announcements',
        S,
        context,
      }),

      S.listItem()
        .title('Stories')
        .child(
          S.list()
            .title('Stories')
            .items([
              S.listItem().title('Visits').child(S.documentTypeList('visit').title('Visits')),
              S.listItem().title('Reviews').child(S.documentTypeList('review').title('Review')),
              S.listItem().title('Spot On').child(S.documentTypeList('spotOn').title('spotOn')),
              // S.listItem().title('').child(S.documentTypeList('spotOn').title('spotOn')),
              S.listItem()
                .title('Portfolios')
                .child(S.documentTypeList('portfolio').title('portfolio')),
              S.listItem()
                .title('People')
                .child(
                  S.documentList()
                    .title('People')
                    .filter('_type == "person"')
                    .defaultOrdering([{field: 'name', direction: 'asc'}]),
                ),
              S.listItem().title('Print').child(S.documentTypeList('print').title('Print')),
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
                .title('Hosted')
                .child(
                  S.documentTypeList('event')
                    .title('Hosted')
                    .filter('_type == "event" && highlight.hosted')
                    .apiVersion('2025-01-01'),
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
                .title('Recommended')
                .child(
                  S.documentTypeList('event')
                    .title('Recommended')
                    .filter(
                      `
  _type == "event" &&
  _id in *[_type == "recommendation" && defined(event._ref)].event._ref
`,
                    )
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
            ]),
        ),

      // Everything else (exclude hidden types)
      ...S.documentTypeListItems().filter(
        (listItem) =>
          !hiddenTypes.includes(listItem.getId()!) &&
          ![
            'event',
            'print',
            'location',
            'eventType',
            'homePage',
            'calendarPage',
            // 'periodical',
            'announcement',
            'feature',
            'country',
            'artist',
            'review',
            'advertisementBanner',
            'portfolio',
            'visit',
            'spotOn',
            'speaker',
            'person',
            'institution',
            'pictureBrushTool',
            'personHomePage',
            'newsletter',
          ].includes(listItem.getId()!),
      ),

      S.divider(),

      // Definitions folder
      S.listItem()
        .title('Definitionen')
        .child(
          S.list()
            .title('Definitionen')
            .items([
              S.listItem()
                .title('Event Types')
                .schemaType('eventType')
                .child(S.documentTypeList('eventType').title('Event Types')),

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
                .title('Info Kästchen (Bio/Socials)')
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
                .title('Bild Pinsel')
                .schemaType('pictureBrushTool')
                .child(S.documentTypeList('pictureBrushTool').title('Bildpinsel')),
            ]),
        ),

      S.divider(),

      S.listItem()
        .title('Impressum')

        .child(S.document().schemaType('imprint').documentId('imprint')),

      S.divider(),

      S.listItem()
        .title('Newsletter')
        .schemaType('newsletter')
        .child(S.documentTypeList('newsletter').title('Newsletter Veröffentlichungen')),
    ])
