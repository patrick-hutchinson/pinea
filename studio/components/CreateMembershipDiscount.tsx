import {useState} from 'react'
import {Button, Card, Stack, Text} from '@sanity/ui'
import {useClient} from 'sanity'
import {useRouter} from 'sanity/router'

export function CreateMembershipDiscount() {
  const client = useClient({apiVersion: '2025-09-23'})
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(false)
  const create = async () => {
    setBusy(true)
    setError(false)
    try {
      // Dotted published IDs require authentication even in the public site dataset.
      const id = `membershipDiscount.${crypto.randomUUID()}`
      await client.create({_id: `drafts.${id}`, _type: 'membershipDiscountNewsletter',
        language: 'de', membershipTier: 'member', region: 'AT', subject: 'Dein P.IN.E.A Membership-Code'})
      router.navigateIntent('edit', {id, type: 'membershipDiscountNewsletter'})
    } catch { setError(true) }
    finally { setBusy(false) }
  }
  return <Card padding={4}><Stack space={4}>
    <Text>Lege einen Membership-Rabattcode fuer eine Person an. Beim Veroeffentlichen wird ein Listmonk-Entwurf erstellt, aber keine E-Mail verschickt.</Text>
    <Button text="Neuen Rabattcode anlegen" tone="primary" onClick={create} disabled={busy} loading={busy} />
    {error && <Text>Das Dokument konnte nicht angelegt werden. Bitte erneut versuchen.</Text>}
  </Stack></Card>
}
