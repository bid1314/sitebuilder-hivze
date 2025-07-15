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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import type { Template, SitePart } from "@/lib/types"

const conditionOptions: Record<SitePart, string[]> = {
  Homepage: ["Homepage"],
  "Site Header": ["Entire Site"],
  "Site Footer": ["Entire Site"],
  "About Us Page": ["About Us Page"],
  "Contact Us Page": ["Contact Us Page"],
  "Shop Page": ["All Products"],
  "Blog Page": ["All Posts"],
  "Single Product Page": ["All Products", "Products in Category... (coming soon)"],
  "Single Post": ["All Posts", "Posts in Category... (coming soon)"],
  "Search Results": ["All Search Results"],
  Archive: ["All Archives"],
  Cart: ["Cart Page"],
  Checkout: ["Checkout Page"],
  "Account Page": ["My Account Page"],
  "Error 404": ["404 Page"],
}

interface DisplayConditionsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  template: Template | null
  onSave: (templateId: string, newCondition: string) => void
}

export default function DisplayConditionsDialog({
  open,
  onOpenChange,
  template,
  onSave,
}: DisplayConditionsDialogProps) {
  const [condition, setCondition] = useState("")

  useEffect(() => {
    if (template) {
      setCondition(template.displayCondition)
    }
  }, [template])

  if (!template) return null

  const handleSave = () => {
    onSave(template.id, condition)
    onOpenChange(false)
  }

  const availableConditions = conditionOptions[template.sitePart] || []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Display Conditions for "{template.name}"</DialogTitle>
          <DialogDescription>Choose where to display this template.</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Label htmlFor="condition-select">Condition</Label>
          <Select value={condition} onValueChange={setCondition}>
            <SelectTrigger id="condition-select">
              <SelectValue placeholder="Select a condition" />
            </SelectTrigger>
            <SelectContent>
              {availableConditions.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Conditions</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
