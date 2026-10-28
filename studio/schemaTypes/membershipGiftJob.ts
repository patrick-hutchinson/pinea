import {defineField, defineType} from 'sanity'

export const membershipGiftJob = defineType({
  name: 'membershipGiftJob',
  title: 'Gift Membership Maintenance',
  type: 'document',
  hidden: true,
  fields: [
    defineField({name: 'lockToken', type: 'string', readOnly: true}),
    defineField({name: 'lockedUntil', type: 'datetime', readOnly: true}),
    defineField({name: 'lastStartedAt', type: 'datetime', readOnly: true}),
    defineField({name: 'lastCompletedAt', type: 'datetime', readOnly: true}),
    defineField({name: 'lastStatus', type: 'string', readOnly: true}),
    defineField({name: 'customersChecked', type: 'number', readOnly: true}),
    defineField({name: 'failures', type: 'number', readOnly: true}),
  ],
})
