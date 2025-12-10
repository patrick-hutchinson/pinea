// import { documentEventHandler } from '@sanity/functions'

// export const handler = documentEventHandler(async ({ context, event }) => {
//   const time = new Date().toLocaleTimeString()
//   console.log(`👋 Your Sanity Function was called at ${time}`)
// })

// functions/newsletter-function/index.js
import {documentEventHandler} from '@sanity/functions'

const SITE_URL = process.env.SITE_URL
const LISTMONK_URL = process.env.LISTMONK_URL
const LISTMONK_USER = process.env.LISTMONK_USER
const LISTMONK_TOKEN = process.env.LISTMONK_TOKEN
const LIST_ID = process.env.LIST_ID || 1 // default list id

if (!SITE_URL || !LISTMONK_URL || !LISTMONK_USER || !LISTMONK_TOKEN) {
  console.warn('Missing Listmonk/Site env vars in stack!')
}

function basicAuthHeader(user, token) {
  // Create Basic Auth header value
  return 'Basic ' + Buffer.from(`${user}:${token}`).toString('base64')
}

async function fetchNewsletterHtml(slug) {
  const url = `${SITE_URL.replace(/\/$/, '')}/newsletter/${encodeURIComponent(slug)}?mail=1`
  console.log('Fetching newsletter HTML from:', url)

  const res = await fetch(url, {cache: 'no-store'})
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Failed to fetch newsletter HTML: ${res.status} ${res.statusText} — ${text}`)
  }
  return await res.text()
}

async function findExistingCampaignBySlug(slug) {
  // Listmonk does not have a strong "search by custom field" in all installs,
  // so we fetch campaigns and find by our naming convention.
  // Adjust if your Listmonk supports filtering.
  const url = `${LISTMONK_URL.replace(/\/$/, '')}/api/campaigns`
  const res = await fetch(url, {
    headers: {Authorization: basicAuthHeader(LISTMONK_USER, LISTMONK_TOKEN)},
  })
  if (!res.ok) {
    throw new Error(`Failed to fetch campaigns: ${res.status}`)
  }
  const data = await res.json()
  // data may be an array or object depending on listmonk version — handle common shapes:
  const all = Array.isArray(data) ? data : (data?.data ?? data?.results ?? [])
  return all.find((c) => c?.name === `newsletter-${slug}` || c?.name?.includes(slug))
}

async function createCampaign(config = {}, html) {
  const payload = {
    name: config.name ?? `newsletter-${config.slug ?? 'unknown'}`,
    subject: config.subject ?? config.name ?? 'Newsletter',
    lists: config.lists ?? [Number(LIST_ID)],
    type: config.type ?? 'regular',
    content_type: config.content_type ?? 'html',
    body: html,
    from_email: config.from_email ?? `newsletter@${new URL(SITE_URL).hostname}`,
  }

  const res = await fetch(`${LISTMONK_URL.replace(/\/$/, '')}/api/campaigns`, {
    method: 'POST',
    headers: {
      Authorization: basicAuthHeader(LISTMONK_USER, LISTMONK_TOKEN),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const txt = await res.text().catch(() => '')
    throw new Error(`Create campaign failed: ${res.status} ${txt}`)
  }
  return await res.json()
}

async function updateCampaign(id, config = {}, html) {
  const payload = {
    name: config.name ?? `newsletter-${config.slug ?? id}`,
    subject: config.subject ?? 'Newsletter (updated)',
    lists: config.lists ?? [Number(LIST_ID)],
    type: config.type ?? 'regular',
    content_type: config.content_type ?? 'html',
    body: html,
  }

  const res = await fetch(`${LISTMONK_URL.replace(/\/$/, '')}/api/campaigns/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: basicAuthHeader(LISTMONK_USER, LISTMONK_TOKEN),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const txt = await res.text().catch(() => '')
    throw new Error(`Update campaign failed: ${res.status} ${txt}`)
  }
  return await res.json()
}

export const handler = documentEventHandler(async ({event}) => {
  try {
    console.log('Newsletter function triggered, event:', JSON.stringify(event, null, 2))

    // event.document may contain fields depending on your projection.
    // Use slug from event.document or fetch newsletter data from Sanity API if needed.
    const doc = event?.data || event?.document || event?.result || {}
    const slug = doc?.slug?.current || doc?.slug || doc?._id

    if (!slug) {
      console.log('No slug found on document event. Aborting.')
      return {status: 'no-slug'}
    }

    // 1) fetch rendered HTML from your site
    const html = await fetchNewsletterHtml(slug)

    // Optionally inject Listmonk merge tags into the footer if you want:
    const htmlWithFooter =
      html +
      `
      <p style="font-size:12px;color:#777;text-align:center;">
        <a href="{{unsubscribe_url}}">Unsubscribe</a> · <a href="{{preferences_url}}">Manage preferences</a>
      </p>`

    // 2) Check if a campaign already exists for this newsletter (use naming convention)
    const existing = await findExistingCampaignBySlug(slug)

    if (existing) {
      console.log('Found existing campaign id:', existing.id, ' — updating.')
      const updated = await updateCampaign(existing.id, {slug}, htmlWithFooter)
      console.log('Campaign updated:', JSON.stringify(updated))
      return {status: 'updated', id: updated.id ?? existing.id}
    } else {
      console.log('No existing campaign found — creating new one.')
      const created = await createCampaign({slug, name: `newsletter-${slug}`}, htmlWithFooter)
      console.log('Campaign created:', JSON.stringify(created))
      return {status: 'created', id: created?.id ?? null}
    }
  } catch (err) {
    console.error('Error in newsletter-function:', err)
    throw err
  }
})
