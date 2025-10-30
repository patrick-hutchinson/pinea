import {useFormValue} from 'sanity'
import {Select} from '@sanity/ui'

export function SelectSpeaker(props) {
  const interviewSpeakers = useFormValue(['speakers']) || []
  const {onChange, value} = props

  return (
    <Select
      value={value?.ref?._ref || ''}
      onChange={(e) =>
        onChange({
          _type: 'speaker',
          ref: {_type: 'reference', _ref: e.target.value},
        })
      }
    >
      <option value="">Select speaker...</option>
      {interviewSpeakers.map((speakerRef) => {
        console.log(speakerRef, 'speaker ref')
        return (
          <option key={speakerRef._ref} value={speakerRef._ref}>
            {speakerRef?._ref}
          </option>
        )
      })}
    </Select>
  )
}
