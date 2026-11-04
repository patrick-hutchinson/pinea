import {defineBlueprint, defineDocumentFunction} from '@sanity/blueprints'

export default defineBlueprint({
  resources: [
    defineDocumentFunction({
      name: 'newsletter-function',
      timeout: 300,
      event: {
        on: ['create', 'update'],
        filter: `_type == 'newsletter' || (
          _type == 'membershipDiscountNewsletter' && _id in path('membershipDiscount.*') &&
          (delta::operation() == 'create' || delta::changedAny((title, recipientEmail, recipientName, couponCode, membershipTier, region, language, subject, syncRequestedAt)))
        )`,
        projection: '{_id, _type, slug, title, language, list, subject}',
      },
    }),
  ],
})
