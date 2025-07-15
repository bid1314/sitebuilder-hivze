"use client"

import { useState, useCallback, useEffect } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import ComponentPalette from "./component-palette"
import LayoutEditor from "./layout-editor"
import PropertiesPanel from "./properties-panel"
import CodePreview from "./code-preview"
import PreviewPanel from "./preview-panel"
import ThemeBuilder from "./theme-builder"
import SaveTemplateDialog from "./save-template-dialog"
import type { ComponentData, ColumnData, GridLayout, SitePart, Template } from "@/lib/types"
import { generateReactCode } from "@/lib/code-generator"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PanelRight, Eye, RotateCcw, LayoutTemplateIcon, LayoutDashboard } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const STORAGE_KEY = "react-ui-builder-state"
const TEMPLATES_KEY = "ui-builder-templates"

const DEFAULT_LAYOUT: GridLayout = {
  columns: [
    {
      id: "column-1",
      width: 12,
      components: [],
      orientation: "horizontal",
      childColumns: [],
    },
  ],
  containerWidth: "auto",
}

const getDefaultCondition = (sitePart: SitePart): string => {
  const conditionMap: Record<SitePart, string> = {
    Homepage: "Homepage",
    "Site Header": "Entire Site",
    "Site Footer": "Entire Site",
    "About Us Page": "About Us Page",
    "Contact Us Page": "Contact Us Page",
    "Shop Page": "All Products",
    "Blog Page": "All Posts",
    "Single Product Page": "All Products",
    "Single Post": "All Posts",
    "Search Results": "All Search Results",
    Archive: "All Archives",
    Cart: "Cart Page",
    Checkout: "Checkout Page",
    "Account Page": "My Account Page",
    "Error 404": "404 Page",
  }
  return conditionMap[sitePart] || ""
}

export default function UIBuilder() {
  const [layout, setLayout] = useState<GridLayout>(DEFAULT_LAYOUT)
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null)
  const [selectedColumnId, setSelectedColumnId] = useState<string | null>(null)
  const [showPropertiesPanel, setShowPropertiesPanel] = useState(true)
  const [showPreview, setShowPreview] = useState(false)
  const [showThemeBuilder, setShowThemeBuilder] = useState(false)
  const [saveTemplateDialogOpen, setSaveTemplateDialogOpen] = useState(false)
  const [activeEditingContext, setActiveEditingContext] = useState<{ sitePart: SitePart; template?: Template } | null>(
    null,
  )
  const { toast } = useToast()

  // Load saved state on initial render
  useEffect(() => {
    try {
      const savedState = localStorage.getItem(STORAGE_KEY)
      if (savedState) {
        const parsedState = JSON.parse(savedState)
        if (parsedState && parsedState.layout && Array.isArray(parsedState.layout.columns)) {
          const validatedColumns = validateColumns(parsedState.layout.columns)
          setLayout({
            columns: validatedColumns,
            containerWidth: parsedState.layout.containerWidth || DEFAULT_LAYOUT.containerWidth,
          })
          if (parsedState.activeEditingContext) {
            setActiveEditingContext(parsedState.activeEditingContext)
          }
        } else {
          setLayout(DEFAULT_LAYOUT)
        }
      }
    } catch (error) {
      console.error("Failed to load saved state:", error)
      setLayout(DEFAULT_LAYOUT)
    }
  }, [])

  const validateColumns = (columns: any[]): ColumnData[] => {
    return columns.map((column) => ({
      id: column.id || `column-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      width: typeof column.width === "number" ? column.width : 12,
      components: Array.isArray(column.components) ? column.components : [],
      orientation: column.orientation === "vertical" ? "vertical" : "horizontal",
      parentId: column.parentId || null,
      childColumns: Array.isArray(column.childColumns) ? validateColumns(column.childColumns) : [],
      flexLayout: column.flexLayout || "items-start justify-start",
      gap: column.gap || "0",
    }))
  }

  useEffect(() => {
    try {
      const stateToSave = { layout, activeEditingContext, timestamp: new Date().toISOString() }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave))
    } catch (error) {
      console.error("Failed to save state:", error)
    }
  }, [layout, activeEditingContext])

  const resetState = () => {
    if (confirm("Are you sure you want to reset the layout? This cannot be undone.")) {
      setLayout(DEFAULT_LAYOUT)
      setSelectedComponentId(null)
      setSelectedColumnId(null)
      setActiveEditingContext(null)
      localStorage.removeItem(STORAGE_KEY)
      toast({ title: "Layout reset" })
    }
  }

  const saveTemplate = (name: string, sitePart: SitePart, layout: GridLayout) => {
    try {
      const savedTemplates = localStorage.getItem(TEMPLATES_KEY)
      const templates: Template[] = savedTemplates ? JSON.parse(savedTemplates) : []

      const newTemplate: Template = {
        id: `template-${Date.now()}`,
        name,
        sitePart,
        layout,
        createdAt: new Date().toISOString(),
        isActive: true,
        displayCondition: getDefaultCondition(sitePart),
      }

      const updatedTemplates = templates
        .map((t) => (t.sitePart === sitePart ? { ...t, isActive: false } : t))
        .concat(newTemplate)

      localStorage.setItem(TEMPLATES_KEY, JSON.stringify(updatedTemplates))
      setActiveEditingContext({ sitePart, template: newTemplate })

      toast({
        title: "Template saved",
        description: `Template "${name}" for ${sitePart} has been saved and set as active.`,
      })
    } catch (error) {
      console.error("Failed to save template:", error)
      toast({ title: "Save failed", variant: "destructive" })
    }
  }

  const getSelectedComponent = (): { component: ComponentData | null; columnId: string | null } => {
    if (!selectedComponentId) return { component: null, columnId: null }
    const findComponentInColumns = (
      columns: ColumnData[],
    ): { component: ComponentData | null; columnId: string | null } => {
      for (const column of columns) {
        if (!column) continue
        const component = column.components?.find((comp) => comp.id === selectedComponentId)
        if (component) return { component, columnId: column.id }
        if (column.childColumns?.length) {
          const result = findComponentInColumns(column.childColumns)
          if (result.component) return result
        }
      }
      return { component: null, columnId: null }
    }
    return findComponentInColumns(layout.columns || [])
  }

  const getSelectedColumn = (): ColumnData | null => {
    if (!selectedColumnId) return null
    const findColumn = (columns: ColumnData[]): ColumnData | null => {
      for (const column of columns) {
        if (!column) continue
        if (column.id === selectedColumnId) return column
        if (column.childColumns?.length) {
          const result = findColumn(column.childColumns)
          if (result) return result
        }
      }
      return null
    }
    return findColumn(layout.columns || [])
  }

  const handleAddComponent = (componentType: string, columnId: string, defaultProps: any = {}) => {
    const newComponent: ComponentData = {
      id: `component-${Date.now()}`,
      type: componentType,
      props: { ...defaultProps },
    }
    setLayout((prevLayout) => {
      const updateColumns = (columns: ColumnData[]): ColumnData[] =>
        columns.map((column) => {
          if (!column) return column
          if (column.id === columnId) {
            return { ...column, components: [...(column.components || []), newComponent] }
          }
          if (column.childColumns?.length) {
            return { ...column, childColumns: updateColumns(column.childColumns) }
          }
          return column
        })
      return { ...prevLayout, columns: updateColumns(prevLayout.columns || []) }
    })
    setSelectedComponentId(newComponent.id)
  }

  const handleUpdateComponent = (componentId: string, columnId: string, updatedProps: any) => {
    setLayout((prevLayout) => {
      const updateColumns = (columns: ColumnData[]): ColumnData[] =>
        columns.map((column) => {
          if (!column) return column
          if (column.id === columnId) {
            return {
              ...column,
              components: (column.components || []).map((c) =>
                c.id === componentId ? { ...c, props: { ...c.props, ...updatedProps } } : c,
              ),
            }
          }
          if (column.childColumns?.length) {
            return { ...column, childColumns: updateColumns(column.childColumns) }
          }
          return column
        })
      return { ...prevLayout, columns: updateColumns(prevLayout.columns || []) }
    })
  }

  const handleDeleteComponent = (componentId: string, columnId: string) => {
    setLayout((prevLayout) => {
      const updateColumns = (columns: ColumnData[]): ColumnData[] =>
        columns.map((column) => {
          if (!column) return column
          if (column.id === columnId) {
            return { ...column, components: (column.components || []).filter((c) => c.id !== componentId) }
          }
          if (column.childColumns?.length) {
            return { ...column, childColumns: updateColumns(column.childColumns) }
          }
          return column
        })
      return { ...prevLayout, columns: updateColumns(prevLayout.columns || []) }
    })
    if (selectedComponentId === componentId) setSelectedComponentId(null)
  }

  const handleAddColumn = (orientation: "horizontal" | "vertical", parentColumnId?: string) => {
    const newColumn: ColumnData = {
      id: `column-${Date.now()}`,
      width: 12,
      components: [],
      orientation,
      childColumns: [],
      parentId: parentColumnId,
      flexLayout: "items-start justify-start",
      gap: "0",
    }
    setLayout((prevLayout) => {
      if (!parentColumnId) {
        let updatedColumns = [...(prevLayout.columns || [])]
        if (orientation === "horizontal") {
          const count = updatedColumns.length + 1
          const width = Math.floor(12 / count)
          updatedColumns = updatedColumns.map((c) => ({ ...c, width }))
          newColumn.width = width
        }
        return { ...prevLayout, columns: [...updatedColumns, newColumn] }
      } else {
        const updateColumns = (columns: ColumnData[]): ColumnData[] =>
          columns.map((column) => {
            if (!column) return column
            if (column.id === parentColumnId) {
              const children = column.childColumns || []
              let updatedChildren = [...children]
              if (orientation === "horizontal" && updatedChildren.length > 0) {
                const count = updatedChildren.length + 1
                const width = Math.floor(12 / count)
                updatedChildren = updatedChildren.map((c) => ({ ...c, width }))
                newColumn.width = width
              }
              return { ...column, childColumns: [...updatedChildren, newColumn] }
            }
            if (column.childColumns?.length) {
              return { ...column, childColumns: updateColumns(column.childColumns) }
            }
            return column
          })
        return { ...prevLayout, columns: updateColumns(prevLayout.columns || []) }
      }
    })
    setSelectedColumnId(newColumn.id)
  }

  const handleDeleteColumn = (columnId: string) => {
    setLayout((prevLayout) => {
      if ((prevLayout.columns || []).length <= 1 && prevLayout.columns?.[0]?.id === columnId) return prevLayout
      const updateColumns = (columns: ColumnData[]): ColumnData[] => {
        const filtered = columns.filter((c) => c && c.id !== columnId)
        if (filtered.length < columns.length) {
          const horizontal = filtered.filter((c) => c && c.orientation === "horizontal")
          if (horizontal.length > 0) {
            const width = Math.floor(12 / horizontal.length)
            horizontal.forEach((c) => {
              if (c) c.width = width
            })
          }
          return filtered
        }
        return columns.map((c) => {
          if (!c) return c
          if (c.childColumns?.length) {
            return { ...c, childColumns: updateColumns(c.childColumns) }
          }
          return c
        })
      }
      return { ...prevLayout, columns: updateColumns(prevLayout.columns || []) }
    })
    if (getSelectedComponent().columnId === columnId) setSelectedComponentId(null)
    if (selectedColumnId === columnId) setSelectedColumnId(null)
  }

  const handleUpdateColumnWidth = (columnId: string, width: number) => {
    setLayout((prevLayout) => {
      const updateColumns = (columns: ColumnData[]): ColumnData[] =>
        columns.map((c) => {
          if (!c) return c
          if (c.id === columnId) return { ...c, width: Math.min(Math.max(1, width), 12) }
          if (c.childColumns?.length) return { ...c, childColumns: updateColumns(c.childColumns) }
          return c
        })
      return { ...prevLayout, columns: updateColumns(prevLayout.columns || []) }
    })
  }

  const handleUpdateContainerWidth = (width: string) => {
    setLayout((prevLayout) => ({ ...prevLayout, containerWidth: width }))
  }

  const handleMoveComponent = useCallback(
    (dragIndex: number, hoverIndex: number, sourceColumnId: string, targetColumnId: string) => {
      setLayout((prevLayout) => {
        const newLayout = JSON.parse(JSON.stringify(prevLayout))
        const findColumn = (columns: ColumnData[], id: string): ColumnData | null => {
          for (const c of columns) {
            if (c.id === id) return c
            if (c.childColumns?.length) {
              const found = findColumn(c.childColumns, id)
              if (found) return found
            }
          }
          return null
        }
        const sourceCol = findColumn(newLayout.columns, sourceColumnId)
        const targetCol = findColumn(newLayout.columns, targetColumnId)
        if (!sourceCol || !targetCol) return prevLayout
        if (sourceColumnId === targetColumnId) {
          const [moved] = sourceCol.components.splice(dragIndex, 1)
          sourceCol.components.splice(hoverIndex, 0, moved)
        } else {
          const [moved] = sourceCol.components.splice(dragIndex, 1)
          targetCol.components.splice(hoverIndex, 0, moved)
        }
        return newLayout
      })
    },
    [],
  )

  const handleMoveColumn = useCallback((dragIndex: number, hoverIndex: number, parentId: string | null = null) => {
    setLayout((prevLayout) => {
      const newLayout = JSON.parse(JSON.stringify(prevLayout))
      const findParentChildren = (columns: ColumnData[], pId: string): ColumnData[] | null => {
        for (const c of columns) {
          if (c.id === pId) return c.childColumns || []
          if (c.childColumns?.length) {
            const found = findParentChildren(c.childColumns, pId)
            if (found) return found
          }
        }
        return null
      }
      const cols = parentId ? findParentChildren(newLayout.columns, parentId) : newLayout.columns
      if (!cols) return prevLayout
      const [moved] = cols.splice(dragIndex, 1)
      cols.splice(hoverIndex, 0, moved)
      const horizontal = cols.filter((c) => c && c.orientation === "horizontal")
      if (horizontal.length > 0) {
        const width = Math.floor(12 / horizontal.length)
        horizontal.forEach((c) => {
          if (c) c.width = width
        })
      }
      return newLayout
    })
  }, [])

  const handleLoadTemplate = (template: Template) => {
    setLayout(template.layout)
    setActiveEditingContext({ sitePart: template.sitePart, template: template })
    setSelectedComponentId(null)
    setSelectedColumnId(null)
    setShowThemeBuilder(false)
    toast({ title: "Template loaded", description: `Now editing "${template.name}".` })
  }

  const handleCreateNew = (sitePart: SitePart) => {
    setLayout(DEFAULT_LAYOUT)
    setActiveEditingContext({ sitePart: sitePart })
    setSelectedComponentId(null)
    setSelectedColumnId(null)
    setShowThemeBuilder(false)
    toast({ title: `Started new ${sitePart}`, description: "The editor is ready for your new design." })
  }

  const handleUpdateColumn = (columnId: string, updates: Partial<ColumnData>) => {
    setLayout((prevLayout) => {
      const updateColumns = (columns: ColumnData[]): ColumnData[] =>
        columns.map((c) => {
          if (!c) return c
          if (c.id === columnId) return { ...c, ...updates }
          if (c.childColumns?.length) return { ...c, childColumns: updateColumns(c.childColumns) }
          return c
        })
      return { ...prevLayout, columns: updateColumns(prevLayout.columns || []) }
    })
  }

  const { component, columnId } = getSelectedComponent()
  const selectedColumn = getSelectedColumn()
  const generatedCode = generateReactCode(layout)

  if (showThemeBuilder) {
    return (
      <ThemeBuilder
        onBack={() => setShowThemeBuilder(false)}
        onLoadTemplate={handleLoadTemplate}
        onCreateNew={handleCreateNew}
      />
    )
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-screen">
        <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">React UI Builder</h1>
            {activeEditingContext && (
              <div className="text-sm text-gray-500 mt-1">
                Editing: <Badge variant="secondary">{activeEditingContext.sitePart}</Badge>
                {activeEditingContext.template && (
                  <span className="ml-2">
                    Template: <Badge variant="outline">{activeEditingContext.template.name}</Badge>
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={resetState} className="flex items-center bg-transparent">
              <RotateCcw className="w-4 h-4 mr-1" />
              Reset
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSaveTemplateDialogOpen(true)}
              className="flex items-center"
            >
              <LayoutTemplateIcon className="w-4 h-4 mr-1" />
              Save as Template
            </Button>
            <Button variant="default" size="sm" onClick={() => setShowThemeBuilder(true)} className="flex items-center">
              <LayoutDashboard className="w-4 h-4 mr-1" />
              Theme Builder
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPropertiesPanel(!showPropertiesPanel)}
              className="flex items-center"
            >
              <PanelRight className="w-4 h-4 mr-1" />
              {showPropertiesPanel ? "Hide Properties" : "Show Properties"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center"
            >
              <Eye className="w-4 h-4 mr-1" />
              {showPreview ? "Hide Preview" : "Show Preview"}
            </Button>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {!showPreview && (
            <ComponentPalette
              onAddComponent={(type, defaultProps) => {
                const targetColumnId =
                  selectedColumnId || (layout.columns && layout.columns[0] ? layout.columns[0].id : null)
                if (targetColumnId) {
                  handleAddComponent(type, targetColumnId, defaultProps)
                }
              }}
              selectedColumnId={selectedColumnId}
            />
          )}

          <div className="flex-1 flex flex-col overflow-hidden">
            {showPreview ? (
              <PreviewPanel code={generatedCode} layout={layout} onBack={() => setShowPreview(false)} />
            ) : (
              <LayoutEditor
                layout={layout}
                selectedComponentId={selectedComponentId}
                selectedColumnId={selectedColumnId}
                onSelectComponent={setSelectedComponentId}
                onSelectColumn={setSelectedColumnId}
                onAddComponent={handleAddComponent}
                onDeleteComponent={handleDeleteComponent}
                onAddColumn={handleAddColumn}
                onDeleteColumn={handleDeleteColumn}
                onUpdateColumnWidth={handleUpdateColumnWidth}
                onUpdateContainerWidth={handleUpdateContainerWidth}
                onMoveComponent={handleMoveComponent}
                onMoveColumn={handleMoveColumn}
                onUpdateColumn={handleUpdateColumn}
              />
            )}
          </div>

          {showPropertiesPanel && !showPreview && (
            <div className="w-80 border-l border-gray-200 overflow-y-auto">
              <div className="flex flex-col h-full">
                <PropertiesPanel
                  component={component}
                  columnId={columnId}
                  column={selectedColumn}
                  onUpdateComponent={handleUpdateComponent}
                  onUpdateColumn={handleUpdateColumn}
                />
                <CodePreview code={generatedCode} />
              </div>
            </div>
          )}
        </div>

        <SaveTemplateDialog
          open={saveTemplateDialogOpen}
          onOpenChange={setSaveTemplateDialogOpen}
          onSave={saveTemplate}
          layout={layout}
          activeSitePart={activeEditingContext?.sitePart || null}
        />
      </div>
    </DndProvider>
  )
}
