import React from 'react'
import {useDocumentStore} from 'sanity'

export default function SpeakerAnnotationInput({value, onChange}) {
  const {document} = useDocumentStore()
  const speakers = document?.speakers || []

  const currentIndex = value?.index ?? 0
  const label = speakers[currentIndex]
    ? `You are editing speaker ${currentIndex + 1}️⃣ (${speakers[currentIndex].role || 'No role'})`
    : 'Select a speaker'

  return (
    <div>
      <label>{label}</label>
      <select
        value={currentIndex}
        onChange={(e) => {
          const index = parseInt(e.target.value, 10)
          onChange({index})
        }}
      >
        {speakers.map((s, i) => (
          <option key={i} value={i}>
            {s.role || `Speaker ${i + 1}`}
          </option>
        ))}
      </select>
    </div>
  )
}
