import {defineField, defineType} from 'sanity'

export const membershipGift = defineType({
  name: 'membershipGift',
  title: 'Membership Gift',
  type: 'document',
  hidden: true,
  fields: [
    defineField({name: 'shop', type: 'string', readOnly: true}),
    defineField({name: 'orderId', type: 'string', readOnly: true}),
    defineField({name: 'orderName', type: 'string', readOnly: true}),
    defineField({name: 'lineItemId', type: 'string', readOnly: true}),
    defineField({name: 'variantId', type: 'string', readOnly: true}),
    defineField({name: 'tier', type: 'string', readOnly: true}),
    defineField({name: 'durationMonths', type: 'number', readOnly: true}),
    defineField({name: 'recipientEmail', type: 'string', readOnly: true}),
    defineField({name: 'message', type: 'text', readOnly: true}),
    defineField({name: 'reference', type: 'string', readOnly: true}),
    defineField({name: 'status', type: 'string', readOnly: true}),
    defineField({name: 'claimTokenHash', type: 'string', readOnly: true}),
    defineField({name: 'claimEmailSentAt', type: 'datetime', readOnly: true}),
    defineField({name: 'claimedAt', type: 'datetime', readOnly: true}),
    defineField({name: 'claimedByEmail', type: 'string', readOnly: true}),
    defineField({name: 'claimedByShopifyCustomerId', type: 'string', readOnly: true}),
    defineField({name: 'entitlementId', type: 'string', readOnly: true}),
    defineField({name: 'deliveryAddress', type: 'object', readOnly: true, fields: [
      defineField({name: 'firstName', type: 'string'}),
      defineField({name: 'lastName', type: 'string'}),
      defineField({name: 'company', type: 'string'}),
      defineField({name: 'address1', type: 'string'}),
      defineField({name: 'address2', type: 'string'}),
      defineField({name: 'zip', type: 'string'}),
      defineField({name: 'city', type: 'string'}),
      defineField({name: 'country', type: 'string'}),
    ]}),
    defineField({name: 'rawOrderId', type: 'string', readOnly: true}),
  ],
  preview: {
    select: {
      title: 'recipientEmail',
      status: 'status',
      tier: 'tier',
      orderName: 'orderName',
    },
    prepare({title, status, tier, orderName}) {
      return {
        title: title || 'Membership Gift',
        subtitle: [status, tier, orderName].filter(Boolean).join(' · '),
      }
    },
  },
})
