import {
  ArrayOfPrimitivesInputProps,
  ArrayOfPrimitivesFunctions,
  ArrayInputFunctionsProps,
  ArraySchemaType,
} from 'sanity'

function ArrayFunctions(
  props: ArrayInputFunctionsProps<string | number | boolean, ArraySchemaType>,
) {
  const valRules = props?.schemaType?.validation?.[0]?._rules || []
  const max = valRules.find((r) => r.flag === 'max')?.constraint
  const total = props?.value?.length || 0
  if (!isNaN(max) && total >= max) return null
  return <ArrayOfPrimitivesFunctions {...props} />
}

export default function ArrayMaxItems(props: ArrayOfPrimitivesInputProps) {
  return props.renderDefault({...props, arrayFunctions: ArrayFunctions})
}
