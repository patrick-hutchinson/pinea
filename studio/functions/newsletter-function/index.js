// import { documentEventHandler } from '@sanity/functions'

// export const handler = documentEventHandler(async ({ context, event }) => {
//   const time = new Date().toLocaleTimeString()
//   console.log(`👋 Your Sanity Function was called at ${time}`)
// })
import axios from 'axios'

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

async function getCampign(id = null) {
  // build url
  let api_url = LISTMONK_URL + '/api/campaigns'
  if (id != null) api_url += `/${id}`

  try {
    // Send the Get request using Axios
    const response = await axios.get(api_url, {
      auth: {
        username: LISTMONK_USER,
        password: LISTMONK_TOKEN,
      },
    })
    console.log(`Successfully retrieved campaign!\nResponse:\n${JSON.stringify(response.data)}`)
    // maby do something else with the response (like saving the campaigne id)
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle HTTP errors (4xx, 5xx)
      console.error(`GET failed: HTTP Status ${error.response?.status || 'Unknown'}`)
      console.error('Error Response Data:', error.response?.data)
    } else {
      // Handle other errors (like network issues)
      console.error(`An unexpected error occurred:`, error.message)
    }
    return null
  }
}

async function createCampaign(config = {}, html) {
  // The JSON payload to be sent in the request body (-d data)
  const payload = {
    name: config.name ? config.name : 'MyCampaign',
    subject: config.subject ? config.subject : 'Newsletter',
    lists: config.lists ? config.lists : [1], // default list
    type: config.type ? config.type : 'regular',
    content_type: config.content_type ? config.content_type : 'html',
    body:
      html ||
      `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>My Website</title>
  <link rel="stylesheet" href="styles.css"> <!-- Optional external CSS -->
</head>
<body>

  <header>
    <h1>Welcome to My Website</h1>
  </header>

  <main>
    <p>This is a simple HTML boilerplate.</p>
  </main>

  <footer>
    <p>&copy; 2025 My Website</p>
  </footer>
</body>
</html>`,
  }

  try {
    // Send the POST request using Axios
    const response = await axios.post(LISTMONK_URL + '/api/campaigns', payload, {
      auth: {
        username: LISTMONK_USER,
        password: LISTMONK_TOKEN,
      },
    })
    console.log(`Successfully created campaign!\nResponse:\n${JSON.stringify(response.data)}`)
    // maby do something else with the response (like saving the campaigne id)
    return response.data?.id
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle HTTP errors (4xx, 5xx)
      console.error(`POST failed: HTTP Status ${error.response?.status || 'Unknown'}`)
      console.error('Error Response Data:', error.response?.data)
    } else {
      // Handle other errors (like network issues)
      console.error(`An unexpected error occurred:`, error.message)
    }
    return null
  }
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
    const existing = await getCampign(slug)

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
