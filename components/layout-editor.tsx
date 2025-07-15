"use client"

import type React from "react"

import { useRef, useState } from "react"
import type { GridLayout, ColumnData } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, MoveHorizontal, MoveVertical, Plus } from "lucide-react"
import ComponentRenderer from "./component-renderer"
import { useDrag, useDrop } from "react-dnd"

interface LayoutEditorProps {
  layout: GridLayout
  selectedComponentId: string | null
  selectedColumnId: string | null
  onSelectComponent: (id: string | null) => void
  onSelectColumn: (id: string | null) => void
  onAddComponent: (type: string, columnId: string, defaultProps?: any) => void
  onDeleteComponent: (componentId: string, columnId: string) => void
  onAddColumn: (orientation: "horizontal" | "vertical", parentColumnId?: string) => void
  onDeleteColumn: (columnId: string) => void
  onUpdateColumnWidth: (columnId: string, width: number) => void
  onUpdateContainerWidth: (width: string) => void
  onMoveComponent: (dragIndex: number, hoverIndex: number, sourceColumnId: string, targetColumnId: string) => void
  onMoveColumn: (dragIndex: number, hoverIndex: number, parentId?: string | null) => void
  onUpdateColumn: (columnId: string, updates: Partial<ColumnData>) => void
}

export default function LayoutEditor({
  layout,
  selectedComponentId,
  selectedColumnId,
  onSelectComponent,
  onSelectColumn,
  onAddComponent,
  onDeleteComponent,
  onAddColumn,
  onDeleteColumn,
  onUpdateColumnWidth,
  onUpdateContainerWidth,
  onMoveComponent,
  onMoveColumn,
  onUpdateColumn,
}: LayoutEditorProps) {
  const [localLayout, setLayout] = useState<GridLayout>(layout)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, columnId: string) => {
    e.preventDefault()
    const componentType = e.dataTransfer.getData("componentType")
    const defaultPropsString = e.dataTransfer.getData("defaultProps")
    let defaultProps = {}
    if (defaultPropsString) {
      try {
        defaultProps = JSON.parse(defaultPropsString)
      } catch (err) {
        console.error("Failed to parse defaultProps from drag event", err)
      }
    }

    if (componentType) {
      onAddComponent(componentType, columnId, defaultProps)
    }
  }

  const getColumnWidthClass = (width: number) => {
    const widthMap: Record<number, string> = {
      1: "w-1/12",
      2: "w-2/12",
      3: "w-3/12",
      4: "w-4/12",
      5: "w-5/12",
      6: "w-6/12",
      7: "w-7/12",
      8: "w-8/12",
      9: "w-9/12",
      10: "w-10/12",
      11: "w-11/12",
      12: "w-full",
    }
    return widthMap[width] || "w-full"
  }

  const handleUpdateColumn = (columnId: string, updates: Partial<ColumnData>) => {
    setLayout((prevLayout) => {
      // Recursive function to update nested columns
      const updateColumns = (columns: ColumnData[]): ColumnData[] => {
        if (!columns) return []

        return columns.map((column) => {
          if (!column) return column

          if (column.id === columnId) {
            return {
              ...column,
              ...updates,
            }
          }

          if (column.childColumns && column.childColumns.length > 0) {
            return {
              ...column,
              childColumns: updateColumns(column.childColumns),
            }
          }

          return column
        })
      }

      return {
        ...prevLayout,
        columns: updateColumns(prevLayout.columns || []),
      }
    })
  }

  // Define renderColumns function at the component level so it can be passed to child components
  const renderColumns = (columns: ColumnData[] = [], parentId: string | null = null) => {
    // Add a null check for columns
    if (!columns || columns.length === 0) {
      return <div className="flex flex-wrap"></div>
    }

    return (
      <div className="flex flex-wrap">
        {columns.map((column, index) => {
          // Skip rendering if column is undefined
          if (!column) return null

          return (
            <ColumnItem
              key={column.id}
              column={column}
              index={index}
              parentId={parentId}
              selectedComponentId={selectedComponentId}
              selectedColumnId={selectedColumnId}
              onSelectComponent={onSelectComponent}
              onSelectColumn={onSelectColumn}
              onAddComponent={onAddComponent}
              onDeleteComponent={onDeleteComponent}
              onAddColumn={onAddColumn}
              onDeleteColumn={onDeleteColumn}
              onUpdateColumnWidth={onUpdateColumnWidth}
              onMoveComponent={onMoveComponent}
              onMoveColumn={onMoveColumn}
              getColumnWidthClass={getColumnWidthClass}
              handleDragOver={handleDragOver}
              handleDrop={handleDrop}
              renderColumns={renderColumns} // Pass the renderColumns function as a prop
              onUpdateColumn={handleUpdateColumn}
            />
          )
        })}
      </div>
    )
  }

  return (
    <div className="flex-1 p-4 overflow-auto">
      <div className="mb-4 flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Container Width:</span>
          <Input
            type="text"
            value={layout.containerWidth}
            onChange={(e) => onUpdateContainerWidth(e.target.value)}
            className="w-32"
          />
        </div>
        <Button variant="outline" size="sm" onClick={() => onAddColumn("horizontal")} className="flex items-center">
          <MoveHorizontal className="w-4 h-4 mr-1" />
          Add Horizontal Column
        </Button>
        <Button variant="outline" size="sm" onClick={() => onAddColumn("vertical")} className="flex items-center">
          <MoveVertical className="w-4 h-4 mr-1" />
          Add Vertical Column
        </Button>
      </div>

      <div className="border border-gray-300 rounded-md p-4 min-h-[500px]" style={{ width: layout.containerWidth }}>
        {renderColumns(layout.columns)}
      </div>
    </div>
  )
}

interface ColumnItemProps {
  column: ColumnData
  index: number
  parentId: string | null
  selectedComponentId: string | null
  selectedColumnId: string | null
  onSelectComponent: (id: string | null) => void
  onSelectColumn: (id: string | null) => void
  onAddComponent: (type: string, columnId: string, defaultProps?: any) => void
  onDeleteComponent: (componentId: string, columnId: string) => void
  onAddColumn: (orientation: "horizontal" | "vertical", parentColumnId?: string) => void
  onDeleteColumn: (columnId: string) => void
  onUpdateColumnWidth: (columnId: string, width: number) => void
  onMoveComponent: (dragIndex: number, hoverIndex: number, sourceColumnId: string, targetColumnId: string) => void
  onMoveColumn: (dragIndex: number, hoverIndex: number, parentId?: string | null) => void
  getColumnWidthClass: (width: number) => string
  handleDragOver: (e: React.DragEvent) => void
  handleDrop: (e: React.DragEvent, columnId: string) => void
  renderColumns: (columns: ColumnData[], parentId?: string | null) => React.ReactNode // Add this prop
  onUpdateColumn: (columnId: string, updates: Partial<ColumnData>) => void
}

function ColumnItem({
  column,
  index,
  parentId,
  selectedComponentId,
  selectedColumnId,
  onSelectComponent,
  onSelectColumn,
  onAddComponent,
  onDeleteComponent,
  onAddColumn,
  onDeleteColumn,
  onUpdateColumnWidth,
  onMoveComponent,
  onMoveColumn,
  getColumnWidthClass,
  handleDragOver,
  handleDrop,
  renderColumns, // Receive the renderColumns function as a prop
  onUpdateColumn,
}: ColumnItemProps) {
  const ref = useRef<HTMLDivElement>(null)

  // Ensure column has orientation property with a default value
  const orientation = column?.orientation || "horizontal"

  // Set up drag for column
  const [{ isDragging }, drag] = useDrag({
    type: "COLUMN",
    item: { type: "COLUMN", id: column.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  // Set up drop for column
  const [{ isOver }, drop] = useDrop({
    accept: "COLUMN",
    hover(item: any, monitor) {
      if (!ref.current) {
        return
      }

      // Only handle items of type COLUMN
      if (item.type !== "COLUMN") {
        return
      }

      const dragIndex = item.index
      const hoverIndex = index

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }

      // Time to actually perform the action
      onMoveColumn(dragIndex, hoverIndex, parentId)

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  })

  // Initialize drag and drop refs
  drag(drop(ref))

  const isSelected = selectedColumnId === column.id

  // Ensure column has components array
  const components = column?.components || []

  // Ensure column has childColumns array
  const childColumns = column?.childColumns || []

  return (
    <div
      ref={ref}
      className={`${orientation === "horizontal" ? getColumnWidthClass(column.width) : "w-full"} p-2`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div
        className={`border border-dashed ${
          isSelected ? "border-blue-500 bg-blue-50" : "border-gray-300"
        } rounded-md p-4 min-h-[100px] relative`}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, column.id)}
        onClick={(e) => {
          e.stopPropagation()
          onSelectColumn(column.id)
        }}
      >
        <div className="absolute top-2 right-2 flex space-x-1">
          {orientation === "horizontal" && (
            <div className="flex items-center space-x-1 mr-2">
              <Input
                type="number"
                min="1"
                max="12"
                value={column.width}
                onChange={(e) => onUpdateColumnWidth(column.id, Number.parseInt(e.target.value))}
                className="w-16 h-6 text-xs"
                onClick={(e) => e.stopPropagation()}
              />
              <span className="text-xs text-gray-500">/ 12</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={(e) => {
              e.stopPropagation()
              onAddColumn("horizontal", column.id)
            }}
            title="Add Nested Horizontal Column"
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={(e) => {
              e.stopPropagation()
              onDeleteColumn(column.id)
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {isSelected && (
          <div className="absolute top-2 left-2">
            <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-md">Selected Column</span>
          </div>
        )}

        {components.length === 0 && childColumns.length === 0 ? (
          <div className="flex items-center justify-center h-full min-h-[80px] text-gray-400">
            {isSelected ? "Click a component to add here" : "Click to select this column"}
          </div>
        ) : (
          <div className="space-y-2 pt-6">
            {components.map((component, compIndex) => (
              <ComponentItem
                key={component.id}
                component={component}
                index={compIndex}
                columnId={column.id}
                isSelected={selectedComponentId === component.id}
                onSelect={() => onSelectComponent(component.id)}
                onDelete={() => onDeleteComponent(component.id, column.id)}
                onMoveComponent={onMoveComponent}
              />
            ))}
          </div>
        )}

        {childColumns.length > 0 && (
          <div className="mt-4 border-t border-gray-200 pt-4">
            {/* Use the renderColumns prop here */}
            {renderColumns(childColumns, column.id)}
          </div>
        )}
      </div>
    </div>
  )
}

interface ComponentItemProps {
  component: any
  index: number
  columnId: string
  isSelected: boolean
  onSelect: () => void
  onDelete: () => void
  onMoveComponent: (dragIndex: number, hoverIndex: number, sourceColumnId: string, targetColumnId: string) => void
}

function ComponentItem({
  component,
  index,
  columnId,
  isSelected,
  onSelect,
  onDelete,
  onMoveComponent,
}: ComponentItemProps) {
  const ref = useRef<HTMLDivElement>(null)

  // Set up drag for component
  const [{ isDragging }, drag] = useDrag({
    type: "COMPONENT",
    item: { type: "COMPONENT", id: component.id, index, columnId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  // Set up drop for component
  const [{ isOver }, drop] = useDrop({
    accept: "COMPONENT",
    hover(item: any, monitor) {
      if (!ref.current) {
        return
      }

      // Only handle items of type COMPONENT
      if (item.type !== "COMPONENT") {
        return
      }

      const dragIndex = item.index
      const hoverIndex = index
      const sourceColumnId = item.columnId
      const targetColumnId = columnId

      // Don't replace items with themselves
      if (dragIndex === hoverIndex && sourceColumnId === targetColumnId) {
        return
      }

      // Time to actually perform the action
      onMoveComponent(dragIndex, hoverIndex, sourceColumnId, targetColumnId)

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex
      item.columnId = targetColumnId
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  })

  // Initialize drag and drop refs
  drag(drop(ref))

  return (
    <div
      ref={ref}
      className={`p-2 rounded-md ${isSelected ? "ring-2 ring-blue-500" : "hover:bg-gray-50"} ${
        isDragging ? "opacity-50" : "opacity-100"
      } ${isOver ? "bg-gray-100" : ""}`}
      onClick={(e) => {
        e.stopPropagation()
        onSelect()
      }}
      style={{ cursor: "move" }}
    >
      <ComponentRenderer component={component} isSelected={isSelected} onDelete={onDelete} />
    </div>
  )
}
