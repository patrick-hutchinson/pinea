import React, {useEffect, useState} from 'react'
import {useClient} from 'sanity'

interface Recommendation {
  _id: string
  voiceName?: string
  comment?: {children?: {text?: string}[]}[]
}

interface RelatedRecommendationsProps {
  document: {_id: string}
}

const RelatedRecommendations: React.FC<RelatedRecommendationsProps> = ({document}) => {
  const client = useClient({apiVersion: '2025-10-13'})
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!document?._id) return

    const fetchRecommendations = async () => {
      setLoading(true)
      try {
        const query = `*[_type == "recommendation" && event._ref == $id]{
          _id,
          "voiceName": voice->name,
          "comment": comment
        }`
        const result: Recommendation[] = await client.fetch(query, {id: document._id})
        console.log('Fetched recommendations:', result)
        setRecommendations(result)
      } catch (err) {
        console.error('Error fetching recommendations:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendations()
  }, [client, document])

  if (loading) return <p>Loading recommendations…</p>
  if (!recommendations.length) return <p>No recommendations yet.</p>

  return (
    <ul style={{margin: 0, paddingLeft: '1rem'}}>
      {recommendations.map((rec) => (
        <li key={rec._id}>
          <strong>{rec.voiceName || 'Unknown Voice'}</strong>:{' '}
          {rec.comment?.[0]?.children?.[0]?.text || 'No comment'}
        </li>
      ))}
    </ul>
  )
}

export default RelatedRecommendations
