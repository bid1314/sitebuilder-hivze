"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { ArrowLeft, Plus, Trash2, Edit, Settings, CheckCircle } from "lucide-react"
import type { Template, SitePart } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import DisplayConditionsDialog from "./display-conditions-dialog"
import { Badge } from "./ui/badge"

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

interface ThemeBuilderProps {
  onBack: () => void
  onLoadTemplate: (template: Template) => void
  onCreateNew: (sitePart: SitePart) => void
}

export default function ThemeBuilder({ onBack, onLoadTemplate, onCreateNew }: ThemeBuilderProps) {
  const [templates, setTemplates] = useState<Template[]>([])
  const [activePart, setActivePart] = useState<SitePart | "All Parts">("All Parts")
  const [isConditionsDialogOpen, setIsConditionsDialogOpen] = useState(false)
  const [templateForConditions, setTemplateForConditions] = useState<Template | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    try {
      const savedTemplates = localStorage.getItem("ui-builder-templates")
      if (savedTemplates) {
        setTemplates(JSON.parse(savedTemplates))
      }
    } catch (error) {
      console.error("Failed to load templates:", error)
    }
  }, [])

  const saveTemplates = (updatedTemplates: Template[]) => {
    try {
      localStorage.setItem("ui-builder-templates", JSON.stringify(updatedTemplates))
      setTemplates(updatedTemplates)
    } catch (error) {
      console.error("Failed to save templates:", error)
      toast({ title: "Failed to save templates", variant: "destructive" })
    }
  }

  const handleDeleteTemplate = (id: string) => {
    if (confirm("Are you sure you want to delete this template?")) {
      const updatedTemplates = templates.filter((template) => template.id !== id)
      saveTemplates(updatedTemplates)
      toast({ title: "Template deleted" })
    }
  }

  const handleSetActive = (templateId: string) => {
    const templateToActivate = templates.find((t) => t.id === templateId)
    if (!templateToActivate) return

    const updatedTemplates = templates.map((t) => {
      if (t.sitePart === templateToActivate.sitePart) {
        return { ...t, isActive: t.id === templateId }
      }
      return t
    })
    saveTemplates(updatedTemplates)
    toast({ title: `"${templateToActivate.name}" is now active for ${templateToActivate.sitePart}.` })
  }

  const handleSaveConditions = (templateId: string, newCondition: string) => {
    const updatedTemplates = templates.map((t) => (t.id === templateId ? { ...t, displayCondition: newCondition } : t))
    saveTemplates(updatedTemplates)
    toast({ title: "Display conditions updated." })
  }

  const handleOpenConditionsDialog = (template: Template) => {
    setTemplateForConditions(template)
    setIsConditionsDialogOpen(true)
  }

  const getActiveTemplateForPart = (part: SitePart): Template | undefined => {
    return templates.find((t) => t.sitePart === part && t.isActive)
  }

  const getTemplatesForPart = (part: SitePart): Template[] => {
    return templates.filter((t) => t.sitePart === part)
  }

  const renderAllPartsView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {siteParts.map((part) => {
        const activeTemplate = getActiveTemplateForPart(part)
        return (
          <Card
            key={part}
            className="group cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setActivePart(part)}
          >
            <CardHeader>
              <CardTitle className="text-base">{part}</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-40 bg-gray-100 rounded-b-md relative">
              {activeTemplate ? (
                <div className="text-center p-2">
                  <p className="font-semibold truncate">{activeTemplate.name}</p>
                  <p className="text-xs text-gray-500">Condition: {activeTemplate.displayCondition}</p>
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="sm" onClick={() => setActivePart(part)}>
                      Manage Templates
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-16 w-16 rounded-full bg-transparent"
                    onClick={(e) => {
                      e.stopPropagation()
                      onCreateNew(part)
                    }}
                  >
                    <Plus className="h-8 w-8" />
                  </Button>
                  <p className="text-sm text-gray-500 mt-2">Create Template</p>
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )

  const renderPartDetailView = () => {
    if (activePart === "All Parts") return null
    const templatesForPart = getTemplatesForPart(activePart)

    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <Button variant="outline" onClick={() => setActivePart("All Parts")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to All Parts
          </Button>
          <Button onClick={() => onCreateNew(activePart)}>
            <Plus className="h-4 w-4 mr-2" />
            Create New Template for {activePart}
          </Button>
        </div>
        {templatesForPart.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <h3 className="text-xl font-semibold">No templates for {activePart}</h3>
            <p className="text-gray-500 mt-2">Create your first template to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templatesForPart.map((template) => (
              <Card key={template.id} className={template.isActive ? "border-blue-500" : ""}>
                <CardHeader>
                  <CardTitle className="text-base truncate">{template.name}</CardTitle>
                  {template.isActive && (
                    <Badge variant="default" className="absolute top-3 right-3">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                  )}
                </CardHeader>
                <CardContent className="h-32 bg-gray-100 flex items-center justify-center">
                  <p className="text-sm text-gray-500">Template Preview</p>
                </CardContent>
                <CardFooter className="flex flex-col items-start p-4 space-y-3">
                  <p className="text-xs text-gray-600">Condition: {template.displayCondition}</p>
                  <div className="w-full grid grid-cols-2 gap-2">
                    <Button size="sm" variant="outline" onClick={() => onLoadTemplate(template)}>
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleOpenConditionsDialog(template)}>
                      <Settings className="h-4 w-4 mr-1" /> Conditions
                    </Button>
                    <Button
                      size="sm"
                      variant={template.isActive ? "secondary" : "default"}
                      className="col-span-2"
                      onClick={() => handleSetActive(template.id)}
                      disabled={template.isActive}
                    >
                      Set as Active
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-full text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDeleteTemplate(template.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Theme Builder {activePart !== "All Parts" && `: ${activePart}`}
        </h1>
        <Button variant="outline" onClick={onBack} className="bg-transparent">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Builder
        </Button>
      </header>

      <main className="flex-1 p-8 overflow-y-auto">
        {activePart === "All Parts" ? renderAllPartsView() : renderPartDetailView()}
      </main>

      <DisplayConditionsDialog
        open={isConditionsDialogOpen}
        onOpenChange={setIsConditionsDialogOpen}
        template={templateForConditions}
        onSave={handleSaveConditions}
      />
    </div>
  )
}
