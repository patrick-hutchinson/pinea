import axios from 'axios'
import {parse} from 'node-html-parser'

// functions/newsletter-function/index.js
import {documentEventHandler} from '@sanity/functions'

const SITE_URL = process.env.SITE_URL
const LISTMONK_URL = process.env.LISTMONK_URL
const LISTMONK_USER = process.env.LISTMONK_USER
const LISTMONK_TOKEN = process.env.LISTMONK_TOKEN
const LIST_ID_GERMAN = process.env.LIST_ID_GERMAN
const LIST_ID_ENGLISH = process.env.LIST_ID_ENGLISH

if (!SITE_URL || !LISTMONK_URL || !LISTMONK_USER || !LISTMONK_TOKEN) {
  console.warn('Missing Listmonk/Site env vars in stack!')
}

async function fetchHTML(slug) {
  const url = `${SITE_URL.replace(/\/$/, '')}/newsletter/${encodeURIComponent(slug)}`
  // // console.log('Fetching newsletter HTML from:', url)

  const res = await fetch(url, {cache: 'no-store'})
  // console.log('res:', res)
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Failed to fetch newsletter HTML: ${res.status} ${res.statusText} — ${text}`)
  }
  return await res.text()
}

/**
 * Get specified campaign (or all campaigns if name is not given)
 */
async function getCampaign(id = null) {
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
    // console.log(`Successfully retrieved campaign!\nResponse:\n${JSON.stringify(response.data)}`)
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

async function checkCampaignExists(name) {
  try {
    // get current campaign to make sure only new fields are replaced
    const campaigns = await getCampaign()

    // find campaign by name
    const current = campaigns?.data?.results.find((campaign) => campaign.name === name)

    // return null if campaign doesn't exist
    if (!current) return null

    // return campaign data if exists
    return current
  } catch (error) {
    console.error(`An unexpected error occurred in checkCampaignExists :`, error.message)
  }
}

async function createCampaign(config = {}, html) {
  // The JSON payload to be sent in the request body (-d data)
  const payload = {
    name: config.name ? config.name : 'MyCampaign',
    subject: config.subject ? config.subject : 'Newsletter',
    lists: config.lists ? config.lists : [8], // default list
    type: config.type ? config.type : 'regular',
    content_type: config.content_type ? config.content_type : 'html',
    body: html,
  }

  // console.log(config, 'config of created campaign')
  console.log(payload, 'payload of created campaign')

  try {
    // Send the POST request using Axios
    const response = await axios.post(LISTMONK_URL + '/api/campaigns', payload, {
      auth: {
        username: LISTMONK_USER,
        password: LISTMONK_TOKEN,
      },
    })
    // console.log(`Successfully created campaign!\nResponse:\n${JSON.stringify(response.data)}`)
    // maby do something else with the response (like saving the campaigne id)
    return response.data?.id
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle HTTP errors (4xx, 5xx)
      console.error(`POST failed: HTTP Status ${error.response?.status || 'Unknown'}`)
      // console.error('Error Response Data while creating campaign:', error.response?.data)
      console.error('Error Response Data while creating campaign:', error)
    } else {
      // Handle other errors (like network issues)
      console.error(`An unexpected error occurred while creating campaign:`, error.message)
    }
    return null
  }
}

/**
 * Updates and existing campaigne on the listmonk instance
 */

async function updateCampaign(id, config = {}, html) {
  // get current campaign to make sure only new fields are replaced
  const current = await getCampaign(id)
  // // console.log('updateCampaign current:', current)

  // return null if campaign doesn't exist
  if (!current) return null

  // The JSON payload to be sent in the request body (-d data)
  const payload = {
    name: config.name ? config.name : current.data.name,
    subject: config.subject ? config.subject : current.data.subject,
    lists: config.lists ? config.lists : current.data.lists.map((list) => list.id),
    type: config.type ? config.type : current.data.type,
    content_type: config.content_type ? config.content_type : current.data.content_type,
    body: html ? html : current.body,
  }

  // // console.log('updateCampaign payload:', payload)

  try {
    // Send the POST request using Axios
    const response = await axios.put(LISTMONK_URL + `/api/campaigns/${current.data.id}`, payload, {
      auth: {
        username: LISTMONK_USER,
        password: LISTMONK_TOKEN,
      },
    })
    // console.log(`Successfully updated campaign!\nResponse:\n${JSON.stringify(response.data)}`)
    // maby do something else with the response (like saving the campaigne id)
    return response.data?.data.id
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

export const handler = documentEventHandler(async ({event}) => {
  try {
    // console.log('Newsletter function triggered, event:', JSON.stringify(event, null, 2))

    // event.document may contain fields depending on your projection.
    // Use slug from event.document or fetch newsletter data from Sanity API if needed.
    const doc = event?.data || event?.document || event?.result || {}
    const slug = doc?.slug?.current || doc?.slug || doc?._id
    const title = doc?.title
    const language = doc?.language
    const subject = doc?.subject

    // Determine which Listmonk list to use based on language
    const targetListId = language === 'de' ? Number(LIST_ID_GERMAN) : Number(LIST_ID_ENGLISH)

    if (!slug) {
      // console.log('No slug found on document event. Aborting.')
      return {status: 'no-slug'}
    }

    console.log('1. Fetch initiated')
    // 1. fetch rendered HTML from your site
    const html = await fetchHTML(slug)

    const root = parse(html)
    // console.log(root, 'root')
    const container = root.querySelector('.container')

    if (!container) throw new Error("Couldn't find .container in HTML")

    const mailHTML = container.toString()

    console.log(mailHTML)

    console.log('2. Checking if Campaign exists')
    // 2) Check if a campaign already exists for this newsletter (use naming convention)
    const existing = await checkCampaignExists(title)
    // console.log('existing campaign:', existing)

    if (existing) {
      // console.log('Found existing campaign id:', existing.id, ' — updating.')
      const updated = await updateCampaign(
        existing.id,
        {
          name: title,
          subject: subject,
          lists: [targetListId],
        },
        mailHTML,
      )
      // console.log('Campaign updated:', JSON.stringify(updated))
      return {status: 'updated', id: updated.id ?? existing.id}
    } else {
      console.log('No existing campaign found — creating new one.')
      const created = await createCampaign(
        {
          name: title,
          subject: subject,
          lists: [targetListId],
        },
        mailHTML,
      )
      // console.log('Campaign created:', JSON.stringify(created))
      return {status: 'created', id: created?.id ?? null}
    }
  } catch (err) {
    console.error('Error in newsletter-function:', err)
    throw err
  }
})
