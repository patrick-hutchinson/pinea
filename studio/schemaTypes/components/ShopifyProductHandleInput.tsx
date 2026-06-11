import {Box, Button, Card, Flex, Select, Stack, Text} from '@sanity/ui'
import {PatchEvent, StringInputProps, set, unset} from 'sanity'
import {useCallback, useEffect, useMemo, useState} from 'react'

type ShopifyProduct = {
  id: string
  handle: string
  title: string
}

const getStudioEnv = (key: string) => {
  const env = (import.meta as unknown as {env?: Record<string, string | undefined>}).env || {}
  return env[key] || ''
}

const SHOPIFY_STORE_DOMAIN = getStudioEnv('SANITY_STUDIO_SHOPIFY_STORE_DOMAIN')
const SHOPIFY_STOREFRONT_ACCESS_TOKEN = getStudioEnv(
  'SANITY_STUDIO_SHOPIFY_STOREFRONT_ACCESS_TOKEN',
)
const SHOPIFY_API_VERSION = getStudioEnv('SANITY_STUDIO_SHOPIFY_STOREFRONT_API_VERSION') || '2026-01'

const getShopifyEndpoint = () => {
  const cleanDomain = SHOPIFY_STORE_DOMAIN.replace(/^https?:\/\//, '').replace(/\/$/, '')
  if (!cleanDomain) return ''

  return `https://${cleanDomain}/api/${SHOPIFY_API_VERSION}/graphql.json`
}

const PRODUCTS_QUERY = `
  query StudioShopifyProducts($first: Int!) {
    products(first: $first) {
      nodes {
        id
        handle
        title
      }
    }
  }
`

export default function ShopifyProductHandleInput(props: StringInputProps) {
  const {value, onChange, renderDefault} = props
  const [products, setProducts] = useState<ShopifyProduct[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const endpoint = useMemo(() => getShopifyEndpoint(), [])
  const hasConfig = Boolean(endpoint && SHOPIFY_STOREFRONT_ACCESS_TOKEN)

  const loadProducts = useCallback(async () => {
    if (!hasConfig) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_ACCESS_TOKEN,
        },
        body: JSON.stringify({
          query: PRODUCTS_QUERY,
          variables: {first: 100},
        }),
      })

      const payload = await response.json()

      if (!response.ok || Array.isArray(payload?.errors)) {
        const message = Array.isArray(payload?.errors)
          ? payload.errors.map((entry: {message?: string}) => entry.message).join('; ')
          : `Shopify request failed (${response.status})`
        throw new Error(message)
      }

      setProducts(Array.isArray(payload?.data?.products?.nodes) ? payload.data.products.nodes : [])
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Could not load Shopify products.')
    } finally {
      setIsLoading(false)
    }
  }, [endpoint, hasConfig])

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  const handleChange = useCallback(
    (nextValue: string) => {
      onChange(PatchEvent.from(nextValue ? set(nextValue) : unset()))
    },
    [onChange],
  )

  if (!hasConfig) {
    return (
      <Stack space={3}>
        {renderDefault(props)}
        <Card padding={3} radius={2} tone="caution">
          <Text size={1}>
            Add SANITY_STUDIO_SHOPIFY_STORE_DOMAIN and
            SANITY_STUDIO_SHOPIFY_STOREFRONT_ACCESS_TOKEN to enable the product picker.
          </Text>
        </Card>
      </Stack>
    )
  }

  return (
    <Stack space={3}>
      <Flex gap={2} align="center">
        <Box flex={1}>
          <Select
            value={value || ''}
            onChange={(event) => handleChange(event.currentTarget.value)}
            disabled={isLoading}
          >
            <option value="">Select a Shopify product...</option>
            {products.map((product) => (
              <option key={product.id} value={product.handle}>
                {product.title} / {product.handle}
              </option>
            ))}
          </Select>
        </Box>
        <Button
          text={isLoading ? 'Loading...' : 'Refresh'}
          mode="ghost"
          onClick={loadProducts}
          disabled={isLoading}
        />
      </Flex>

      {value ? (
        <Text size={1} muted>
          Links to /shop/{value}
        </Text>
      ) : null}

      {error ? (
        <Card padding={3} radius={2} tone="critical">
          <Text size={1}>{error}</Text>
        </Card>
      ) : null}
    </Stack>
  )
}
