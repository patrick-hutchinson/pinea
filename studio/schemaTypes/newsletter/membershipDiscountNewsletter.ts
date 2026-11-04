import {defineField, defineType} from 'sanity'

export const membershipDiscountNewsletter = defineType({
  name: 'membershipDiscountNewsletter',
  title: 'Membership Rabattcode',
  type: 'document',
  initialValue: {language: 'de', membershipTier: 'member', region: 'AT', subject: 'Dein P.IN.E.A Membership-Code'},
  validation: (Rule) => Rule.custom((document) =>
    /^drafts\.membershipDiscount\.|^membershipDiscount\./.test(String(document?._id || ''))
      ? true : 'Bitte unter Newsletter > Membership Rabattcodes > Neuer Rabattcode anlegen.',
  ),
  fields: [
    defineField({name: 'title', title: 'Interner Titel', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'recipientEmail', title: 'E-Mail-Adresse', type: 'string', validation: (Rule) => Rule.required().email()}),
    defineField({name: 'recipientName', title: 'Name (optional)', type: 'string'}),
    defineField({name: 'couponCode', title: 'Shopify Rabattcode', type: 'string',
      description: 'Den 100%-Code vorher in Shopify erstellen, auf die richtige Membership begrenzen und die rabattierten Zyklen festlegen. Hier wird kein Rabatt angelegt.',
      validation: (Rule) => Rule.required().regex(/^[A-Za-z0-9][A-Za-z0-9_-]{0,99}$/).error('Bitte einen Code mit bis zu 100 Buchstaben, Zahlen, Bindestrichen oder Unterstrichen eingeben.')}),
    defineField({name: 'membershipTier', title: 'Membership', type: 'string', options: {list: [
      {title: 'P.IN.E.A Member', value: 'member'}, {title: 'P.IN.E.A Member (Student)', value: 'student'},
      {title: 'P.IN.E.A Member Plus', value: 'plus'},
    ], layout: 'radio'}, validation: (Rule) => Rule.required()}),
    defineField({name: 'region', title: 'Region', type: 'string',
      hidden: ({document}) => document?.membershipTier === 'plus',
      options: {list: [{title: 'AT', value: 'AT'}, {title: 'EU', value: 'EU'}, {title: 'WORLD', value: 'WORLD'}], layout: 'radio'},
      validation: (Rule) => Rule.custom((value, context) => {
        if (context.document?.membershipTier === 'plus') return true
        if (!value) return 'Bitte eine Region auswaehlen.'
        return context.document?.membershipTier === 'student' && value === 'WORLD' ? 'Student ist nur fuer AT und EU verfuegbar.' : true
      })}),
    defineField({name: 'language', title: 'Sprache', type: 'string', options: {list: [
      {title: 'Deutsch', value: 'de'}, {title: 'English', value: 'en'},
    ], layout: 'radio'}, validation: (Rule) => Rule.required()}),
    defineField({name: 'subject', title: 'E-Mail-Betreff', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'syncStatus', title: 'Listmonk Status', type: 'string', readOnly: true,
      description: 'Veroeffentlichen erstellt oder aktualisiert einen Entwurf fuer genau eine Person. Versand erfolgt in Listmonk.'}),
    defineField({name: 'syncError', title: 'Hinweis', type: 'text', readOnly: true}),
    defineField({name: 'listmonkCampaignUrl', title: 'Entwurf in Listmonk', type: 'url', readOnly: true}),
    defineField({name: 'checkoutUrl', title: 'Generierter Checkout-Link', type: 'url', readOnly: true}),
    defineField({name: 'lastSyncedAt', title: 'Zuletzt synchronisiert', type: 'datetime', readOnly: true}),
    ...['syncFingerprint', 'syncLeaseToken', 'syncLeaseUntil', 'syncRequestedAt'].map((name) =>
      defineField({name, type: 'string', hidden: true, readOnly: true})),
  ],
  preview: {select: {title: 'title', email: 'recipientEmail', status: 'syncStatus'},
    prepare({title, email, status}) { return {title: title || 'Membership Rabattcode', subtitle: [email, status].filter(Boolean).join(' / ')} }},
})
