import {type ChangeEvent, useCallback, useMemo, useRef, useState} from 'react'
import {Box, Button, Card, Flex, Stack, Text} from '@sanity/ui'
import {ArrayOfObjectsInputProps, PatchEvent, insert, setIfMissing, useClient} from 'sanity'

type BlurPlaceholderGalleryItem = {
  _key: string
  _type: 'imageWithMetadata'
  image: {
    _type: 'image'
    asset: {
      _type: 'reference'
      _ref: string
    }
  }
  altText?: string
}

const isImageFile = (file: File) => file.type.startsWith('image/')

const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 B'

  const units = ['B', 'KB', 'MB', 'GB']
  const unitIndex = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
  const value = bytes / 1024 ** unitIndex

  return `${value.toFixed(value >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`
}

const createArrayItem = (assetId: string): BlurPlaceholderGalleryItem => ({
  _key: crypto.randomUUID(),
  _type: 'imageWithMetadata',
  image: {
    _type: 'image',
    asset: {
      _type: 'reference',
      _ref: assetId,
    },
  },
  altText: '',
})

export default function BlurPlaceholderGalleryInput(props: ArrayOfObjectsInputProps) {
  const {renderDefault, onChange} = props
  const client = useClient({apiVersion: '2025-02-10'})
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadStats, setUploadStats] = useState({
    completedFiles: 0,
    totalFiles: 0,
    uploadedBytes: 0,
    totalBytes: 0,
  })

  const handleFiles = useCallback(
    async (incomingFiles: FileList | File[]) => {
      const files = Array.from(incomingFiles)
      const imageFiles = files.filter(isImageFile)

      if (imageFiles.length === 0) {
        setError('Bitte nur Bilddateien auswählen oder hineinziehen.')
        return
      }

      if (imageFiles.length !== files.length) {
        setError('Einige Dateien wurden übersprungen, weil sie keine Bilder sind.')
      } else {
        setError(null)
      }

      const totalBytes = imageFiles.reduce((sum, file) => sum + file.size, 0)
      setUploadStats({
        completedFiles: 0,
        totalFiles: imageFiles.length,
        uploadedBytes: 0,
        totalBytes,
      })
      setIsUploading(true)

      try {
        const uploadedItems = []

        for (const [index, file] of imageFiles.entries()) {
          const asset = await client.assets.upload('image', file, {
            filename: file.name,
          })

          uploadedItems.push(createArrayItem(asset._id))
          setUploadStats({
            completedFiles: index + 1,
            totalFiles: imageFiles.length,
            uploadedBytes: imageFiles.slice(0, index + 1).reduce((sum, current) => sum + current.size, 0),
            totalBytes,
          })
        }

        onChange(PatchEvent.from([setIfMissing([]), insert(uploadedItems, 'after', [-1])]))
      } catch (uploadError) {
        setError(
          uploadError instanceof Error
            ? uploadError.message
            : 'Beim Hochladen der Bilder ist etwas schiefgelaufen.',
        )
      } finally {
        setIsUploading(false)
      }
    },
    [client, onChange],
  )

  const onFileInputChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target.files?.length) {
        await handleFiles(event.target.files)
      }

      event.target.value = ''
    },
    [handleFiles],
  )

  const dropTone = useMemo(() => {
    if (isUploading) return 'transparent'
    return isDragging ? 'primary' : 'default'
  }, [isDragging, isUploading])

  return (
    <Stack space={4}>
      <Card
        padding={4}
        radius={3}
        tone={dropTone}
        border
        onDragEnter={(event) => {
          event.preventDefault()
          setIsDragging(true)
        }}
        onDragOver={(event) => {
          event.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={(event) => {
          event.preventDefault()
          setIsDragging(false)
        }}
        onDrop={async (event) => {
          event.preventDefault()
          setIsDragging(false)

          if (event.dataTransfer.files?.length) {
            await handleFiles(event.dataTransfer.files)
          }
        }}
        style={{
          borderStyle: 'dashed',
          transition: 'background-color 0.15s ease, border-color 0.15s ease',
        }}
      >
        <Stack space={3}>
          <Text weight="semibold">Hier kannst du Bilder via drag & drop hochladen!</Text>
          <Text size={1} muted>
            Alle Bilder können danach mit Copyright Texten versehen werden.
          </Text>

          <Flex gap={3} align="center">
            <Button
              text={isUploading ? 'Lädt hoch...' : 'Bilder auswählen'}
              mode="default"
              tone="primary"
              disabled={isUploading}
              onClick={() => inputRef.current?.click()}
            />
            <Box>
              {uploadStats.totalFiles > 0 ? (
                <Text size={1} muted>
                  {uploadStats.completedFiles} von {uploadStats.totalFiles} Bildern hochgeladen ·{' '}
                  {formatBytes(uploadStats.uploadedBytes)} von {formatBytes(uploadStats.totalBytes)}
                </Text>
              ) : (
                <Text size={1} muted>
                  Die Bilder werden direkt in Sanity hochgeladen und unten zur Galerie hinzugefügt.
                </Text>
              )}
            </Box>
          </Flex>

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={onFileInputChange}
          />

          {error ? (
            <Card padding={3} radius={2} tone="critical">
              <Text size={1}>{error}</Text>
            </Card>
          ) : null}
        </Stack>
      </Card>

      {renderDefault(props)}
    </Stack>
  )
}
