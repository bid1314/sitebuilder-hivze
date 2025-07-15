"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useImageUpload } from "@/hooks/use-image-upload"
import { ImagePlus, Upload, Trash2 } from "lucide-react"
import Image from "next/image"
import { useCallback, useState } from "react"
import { cn } from "@/lib/utils"

interface ImageUploadProps {
  value: string | undefined
  onChange: (url: string) => void
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const { previewUrl, fileInputRef, handleThumbnailClick, handleFileChange, handleRemove } = useImageUpload({
    onUpload: onChange,
    initialUrl: value,
  })

  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)
      const file = e.dataTransfer.files?.[0]
      if (file && file.type.startsWith("image/")) {
        const fakeEvent = {
          target: {
            files: [file],
          },
        } as unknown as React.ChangeEvent<HTMLInputElement>
        handleFileChange(fakeEvent)
      }
    },
    [handleFileChange],
  )

  return (
    <div className="w-full">
      <Input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
      {!previewUrl ? (
        <div
          onClick={handleThumbnailClick}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "flex h-40 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 transition-colors hover:bg-muted",
            isDragging && "border-primary/50 bg-primary/5",
          )}
        >
          <ImagePlus className="h-6 w-6 text-muted-foreground" />
          <div className="text-center">
            <p className="text-xs font-medium">Click or drag to upload</p>
          </div>
        </div>
      ) : (
        <div className="relative">
          <div className="group relative h-40 overflow-hidden rounded-lg border">
            <Image
              src={previewUrl || "/placeholder.svg"}
              alt="Preview"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
              <Button size="icon" variant="secondary" onClick={handleThumbnailClick} className="h-8 w-8">
                <Upload className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="destructive" onClick={handleRemove} className="h-8 w-8">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
