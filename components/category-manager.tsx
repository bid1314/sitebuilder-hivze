"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pencil, Trash2, Plus, Check, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

interface Category {
  id: string
  name: string
  isDefault?: boolean
}

interface CategoryManagerProps {
  onCategoriesChange: (categories: Category[]) => void
}

export default function CategoryManager({ onCategoriesChange }: CategoryManagerProps) {
  const [categories, setCategories] = useState<Category[]>([{ id: "general", name: "General", isDefault: true }])
  const [newCategoryName, setNewCategoryName] = useState("")
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null)
  const { toast } = useToast()

  // Load categories from local storage
  useEffect(() => {
    try {
      const savedCategories = localStorage.getItem("ui-builder-categories")
      if (savedCategories) {
        const parsedCategories = JSON.parse(savedCategories)
        // Ensure General category exists and is marked as default
        const hasGeneral = parsedCategories.some((cat: any) => cat.id === "general")
        if (!hasGeneral) {
          parsedCategories.unshift({ id: "general", name: "General", isDefault: true })
        } else {
          // Make sure General is marked as default
          parsedCategories.forEach((cat: any) => {
            if (cat.id === "general") {
              cat.isDefault = true
            }
          })
        }
        setCategories(parsedCategories)
      }
    } catch (error) {
      console.error("Failed to load categories:", error)
    }
  }, [])

  // Save categories to local storage when they change
  useEffect(() => {
    try {
      localStorage.setItem("ui-builder-categories", JSON.stringify(categories))
      onCategoriesChange(categories)
    } catch (error) {
      console.error("Failed to save categories:", error)
    }
  }, [categories, onCategoriesChange])

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return

    const newCategory: Category = {
      id: `category-${Date.now()}`,
      name: newCategoryName.trim(),
    }

    setCategories([...categories, newCategory])
    setNewCategoryName("")

    toast({
      title: "Category added",
      description: `Category "${newCategoryName}" has been added.`,
    })
  }

  const handleEditCategory = (category: Category) => {
    setEditingCategory({ ...category })
  }

  const saveEditedCategory = () => {
    if (!editingCategory || !editingCategory.name.trim()) return

    setCategories(
      categories.map((cat) => (cat.id === editingCategory.id ? { ...cat, name: editingCategory.name.trim() } : cat)),
    )

    setEditingCategory(null)

    toast({
      title: "Category updated",
      description: `Category has been renamed to "${editingCategory.name}".`,
    })
  }

  const cancelEdit = () => {
    setEditingCategory(null)
  }

  const confirmDeleteCategory = (category: Category) => {
    if (category.isDefault) return
    setCategoryToDelete(category)
    setDeleteDialogOpen(true)
  }

  const handleDeleteCategory = () => {
    if (!categoryToDelete) return

    // Get templates from local storage
    try {
      const savedTemplates = localStorage.getItem("ui-builder-templates")
      if (savedTemplates) {
        const templates = JSON.parse(savedTemplates)

        // Migrate templates to General category
        const updatedTemplates = templates.map((template: any) => {
          if (template.category === categoryToDelete.id) {
            return { ...template, category: "general" }
          }
          return template
        })

        // Save updated templates
        localStorage.setItem("ui-builder-templates", JSON.stringify(updatedTemplates))
      }
    } catch (error) {
      console.error("Failed to migrate templates:", error)
    }

    // Remove the category
    setCategories(categories.filter((cat) => cat.id !== categoryToDelete.id))
    setCategoryToDelete(null)
    setDeleteDialogOpen(false)

    toast({
      title: "Category deleted",
      description: `Category "${categoryToDelete.name}" has been deleted and its templates moved to General.`,
    })
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Categories</h3>

      <div className="flex items-center space-x-2">
        <Input
          placeholder="New category name"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          className="flex-1"
        />
        <Button onClick={handleAddCategory} disabled={!newCategoryName.trim()}>
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </div>

      <div className="space-y-2 mt-4">
        {categories.map((category) => (
          <div key={category.id} className="flex items-center justify-between p-2 border rounded-md">
            {editingCategory && editingCategory.id === category.id ? (
              <div className="flex items-center space-x-2 flex-1">
                <Input
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  autoFocus
                />
                <Button size="sm" variant="ghost" onClick={saveEditedCategory}>
                  <Check className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={cancelEdit}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <>
                <span className="flex-1">
                  {category.name}
                  {category.isDefault && (
                    <span className="ml-2 text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">Default</span>
                  )}
                </span>
                <div className="flex items-center space-x-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEditCategory(category)}
                    disabled={category.isDefault}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => confirmDeleteCategory(category)}
                    disabled={category.isDefault}
                    className={category.isDefault ? "" : "text-red-500 hover:text-red-700"}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the category "{categoryToDelete?.name}"? All templates in this category
              will be moved to the General category.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCategory}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
