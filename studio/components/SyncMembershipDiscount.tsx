import {useState} from 'react'
import {useClient, type DocumentActionComponent} from 'sanity'
import {useToast} from '@sanity/ui'

export const SyncMembershipDiscount: DocumentActionComponent = (props) => {
  const client = useClient({apiVersion: '2025-09-23'})
  const [busy, setBusy] = useState(false)
  const toast = useToast()
  return {
    label: busy ? 'Wird angefordert...' : 'Listmonk erneut synchronisieren',
    disabled: busy || !props.published || Boolean(props.draft),
    onHandle: async () => {
      setBusy(true)
      try { await client.patch(props.id).set({syncRequestedAt: new Date().toISOString()}).commit() }
      catch { toast.push({status: 'error', title: 'Synchronisierung konnte nicht angefordert werden.'}) }
      finally { setBusy(false); props.onComplete() }
    },
  }
}
