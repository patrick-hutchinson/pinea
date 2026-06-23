export function FootnoteAnnotation(props) {
  const {renderDefault, textElement, focused, selected} = props

  return renderDefault({
    ...props,
    textElement: (
      <span style={{display: 'inline-flex', alignItems: 'baseline', gap: '0.15em'}}>
        <span
          style={{
            backgroundColor: selected ? 'rgba(227, 181, 11, 0.28)' : 'rgba(227, 181, 11, 0.16)',
            borderBottom: focused ? '2px solid #b88700' : '2px dotted #b88700',
            borderRadius: '2px',
            boxShadow: selected ? '0 0 0 1px rgba(184, 135, 0, 0.18)' : 'none',
          }}
        >
          {textElement}
        </span>
        <button
          type="button"
          contentEditable={false}
          onMouseDown={(event) => {
            event.preventDefault()
            event.stopPropagation()
            props.onOpen()
          }}
          title="Edit footnote"
          style={{
            appearance: 'none',
            background: 'transparent',
            border: 0,
            cursor: 'pointer',
            fontSize: '0.9em',
            lineHeight: 1,
            margin: 0,
            padding: 0,
          }}
        >
          🦶
        </button>
      </span>
    ),
  })
}
