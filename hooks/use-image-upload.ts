"use client"

import type React from "react"

import { useCallback, useEffect, useRef, useState } from "react"

interface UseImageUploadProps {
  onUpload?: (url: string) => void
  initialUrl?: string | null
}

export function useImageUpload({ onUpload, initialUrl }: UseImageUploadProps = {}) {
  const previewRef = useRef<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialUrl || null)
  const [fileName, setFileName] = useState<string | null>(null)

  useEffect(() => {
    if (initialUrl !== previewUrl) {
      setPreviewUrl(initialUrl || null)
    }
  }, [initialUrl, previewUrl])

  const handleThumbnailClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (file) {
        setFileName(file.name)
        if (previewRef.current && previewRef.current.startsWith("blob:")) {
          URL.revokeObjectURL(previewRef.current)
        }
        const url = URL.createObjectURL(file)
        setPreviewUrl(url)
        previewRef.current = url
        onUpload?.(url)
      }
    },
    [onUpload],
  )

  const handleRemove = useCallback(() => {
    if (previewRef.current && previewRef.current.startsWith("blob:")) {
      URL.revokeObjectURL(previewRef.current)
    }
    setPreviewUrl(null)
    setFileName(null)
    previewRef.current = null
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    onUpload?.("")
  }, [onUpload])

  useEffect(() => {
    return () => {
      if (previewRef.current && previewRef.current.startsWith("blob:")) {
        URL.revokeObjectURL(previewRef.current)
      }
    }
  }, [])

  return {
    previewUrl,
    fileName,
    fileInputRef,
    handleThumbnailClick,
    handleFileChange,
    handleRemove,
  }
}
