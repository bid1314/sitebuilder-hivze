"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { GridLayout, SitePart } from "@/lib/types"

const siteParts: SitePart[] = [
  "Homepage",
  "Site Header",
  "Site Footer",
  "About Us Page",
  "Contact Us Page",
  "Shop Page",
  "Blog Page",
  "Single Product Page",
  "Single Post",
  "Search Results",
  "Archive",
  "Cart",
  "Checkout",
  "Account Page",
  "Error 404",
]

interface SaveTemplateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (name: string, sitePart: SitePart, layout: GridLayout) => void
  layout: GridLayout
  activeSitePart: SitePart | null
}

export default function SaveTemplateDialog({
  open,
  onOpenChange,
  onSave,
  layout,
  activeSitePart,
}: SaveTemplateDialogProps) {
  const [name, setName] = useState("")
  const [sitePart, setSitePart] = useState<SitePart>("Homepage")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open && activeSitePart) {
      setSitePart(activeSitePart)
    } else if (!open) {
      // Reset form when dialog closes
      setName("")
      setSitePart("Homepage")
      setError(null)
    }
  }, [open, activeSitePart])

  const handleSave = () => {
    if (!name.trim()) {
      setError("Template name is required")
      return
    }

    onSave(name, sitePart, layout)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save Part Template</DialogTitle>
          <DialogDescription>Save your current layout as a template for a specific site part.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setError(null)
              }}
              placeholder="My Template"
              className="col-span-3"
            />
            {error && <p className="text-red-500 text-sm col-span-4 text-right">{error}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="sitePart" className="text-right">
              Site Part
            </Label>
            <Select value={sitePart} onValueChange={(value) => setSitePart(value as SitePart)}>
              <SelectTrigger id="sitePart" className="col-span-3">
                <SelectValue placeholder="Select a site part" />
              </SelectTrigger>
              <SelectContent>
                {siteParts.map((part) => (
                  <SelectItem key={part} value={part}>
                    {part}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Template</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
