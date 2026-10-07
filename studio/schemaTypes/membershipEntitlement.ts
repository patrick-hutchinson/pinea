import {defineField, defineType} from 'sanity'

export const membershipEntitlement = defineType({
  name: 'membershipEntitlement',
  title: 'Membership Entitlement',
  type: 'document',
  hidden: true,
  fields: [
    defineField({name: 'source', type: 'string', readOnly: true}),
    defineField({name: 'sourceGiftId', type: 'string', readOnly: true}),
    defineField({name: 'shopifyCustomerId', type: 'string', readOnly: true}),
    defineField({name: 'email', type: 'string', readOnly: true}),
    defineField({name: 'tier', type: 'string', readOnly: true}),
    defineField({name: 'status', type: 'string', readOnly: true}),
    defineField({name: 'startsAt', type: 'datetime', readOnly: true}),
    defineField({name: 'endsAt', type: 'datetime', readOnly: true}),
    defineField({name: 'createdFromOrderId', type: 'string', readOnly: true}),
    defineField({name: 'createdFromLineItemId', type: 'string', readOnly: true}),
  ],
  preview: {
    select: {
      title: 'email',
      status: 'status',
      tier: 'tier',
      endsAt: 'endsAt',
    },
    prepare({title, status, tier, endsAt}) {
      return {
        title: title || 'Membership Entitlement',
        subtitle: [status, tier, endsAt].filter(Boolean).join(' · '),
      }
    },
  },
})
