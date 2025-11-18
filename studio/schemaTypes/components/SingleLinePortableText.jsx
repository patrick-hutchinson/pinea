import {PortableTextInput} from 'sanity'
import {useCallback} from 'react'

export function SingleLinePortableText(props) {
  const {renderDefault, onChange} = props

  // Block "Enter" so users can't add new lines / new blocks:
  const handleKeyDown = useCallback((event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
    }
  }, [])

  return (
    <div
      onKeyDown={handleKeyDown}
      style={{
        lineHeight: '1',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        maxHeight: '80px', // 👈 makes it as small as a normal input
      }}
    >
      {renderDefault(props)}
    </div>
  )
}
