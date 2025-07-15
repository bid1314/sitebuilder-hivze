"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ImageUpload } from "@/components/ui/image-upload"
import { Trash2, Plus, Settings, Palette, Type } from "lucide-react"
import type { ComponentData, ColumnData } from "@/lib/types"

interface PropertiesPanelProps {
  component: ComponentData | null
  columnId: string | null
  column: ColumnData | null
  onUpdateComponent: (componentId: string, columnId: string, updatedProps: any) => void
  onUpdateColumn: (columnId: string, updates: Partial<ColumnData>) => void
}

export default function PropertiesPanel({
  component,
  columnId,
  column,
  onUpdateComponent,
  onUpdateColumn,
}: PropertiesPanelProps) {
  const [activeTab, setActiveTab] = useState<"component" | "column">("component")

  const handlePropChange = (propName: string, value: any) => {
    if (component && columnId) {
      onUpdateComponent(component.id, columnId, {
        ...component.props,
        [propName]: value,
      })
    }
  }

  const handleNestedPropChange = (objectName: string, propName: string, value: any) => {
    if (component && columnId) {
      onUpdateComponent(component.id, columnId, {
        ...component.props,
        [objectName]: {
          ...component.props[objectName],
          [propName]: value,
        },
      })
    }
  }

  const handleArrayChange = (arrayName: string, index: number, propName: string, value: any) => {
    if (component && columnId) {
      const updatedArray = [...(component.props[arrayName] || [])]
      updatedArray[index] = { ...updatedArray[index], [propName]: value }
      onUpdateComponent(component.id, columnId, {
        ...component.props,
        [arrayName]: updatedArray,
      })
    }
  }

  const addArrayItem = (arrayName: string, newItem: any) => {
    if (component && columnId) {
      onUpdateComponent(component.id, columnId, {
        ...component.props,
        [arrayName]: [...(component.props[arrayName] || []), newItem],
      })
    }
  }

  const removeArrayItem = (arrayName: string, index: number) => {
    if (component && columnId) {
      const updatedArray = [...(component.props[arrayName] || [])]
      updatedArray.splice(index, 1)
      onUpdateComponent(component.id, columnId, {
        ...component.props,
        [arrayName]: updatedArray,
      })
    }
  }

  const renderComponentProperties = () => {
    if (!component) {
      return (
        <div className="text-center py-8 text-gray-500">
          <Settings className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Select a component to edit its properties</p>
        </div>
      )
    }

    switch (component.type) {
      case "text":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="text">Text Content</Label>
              <Textarea
                id="text"
                value={component.props.text || ""}
                onChange={(e) => handlePropChange("text", e.target.value)}
                placeholder="Enter text content..."
              />
            </div>
            <div>
              <Label htmlFor="element">HTML Element</Label>
              <Select
                value={component.props.element || "p"}
                onValueChange={(value) => handlePropChange("element", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="p">Paragraph</SelectItem>
                  <SelectItem value="h1">Heading 1</SelectItem>
                  <SelectItem value="h2">Heading 2</SelectItem>
                  <SelectItem value="h3">Heading 3</SelectItem>
                  <SelectItem value="h4">Heading 4</SelectItem>
                  <SelectItem value="h5">Heading 5</SelectItem>
                  <SelectItem value="h6">Heading 6</SelectItem>
                  <SelectItem value="span">Span</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="className">CSS Classes</Label>
              <Input
                id="className"
                value={component.props.className || ""}
                onChange={(e) => handlePropChange("className", e.target.value)}
                placeholder="text-lg font-bold text-blue-500"
              />
            </div>
          </div>
        )

      case "image":
        return (
          <div className="space-y-4">
            <div>
              <Label>Image</Label>
              <ImageUpload value={component.props.src} onChange={(url) => handlePropChange("src", url)} />
            </div>
            <div>
              <Label htmlFor="alt">Alt Text</Label>
              <Input
                id="alt"
                value={component.props.alt || ""}
                onChange={(e) => handlePropChange("alt", e.target.value)}
                placeholder="Describe the image..."
              />
            </div>
            <div>
              <Label htmlFor="link">Link URL (optional)</Label>
              <Input
                id="link"
                value={component.props.link || ""}
                onChange={(e) => handlePropChange("link", e.target.value)}
                placeholder="https://example.com"
              />
            </div>
            {component.props.link && (
              <div>
                <Label htmlFor="linkTarget">Link Target</Label>
                <Select
                  value={component.props.linkTarget || "_self"}
                  onValueChange={(value) => handlePropChange("linkTarget", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="_self">Same window</SelectItem>
                    <SelectItem value="_blank">New window</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <div>
              <Label htmlFor="className">CSS Classes</Label>
              <Input
                id="className"
                value={component.props.className || ""}
                onChange={(e) => handlePropChange("className", e.target.value)}
                placeholder="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        )

      case "button":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="text">Button Text</Label>
              <Input
                id="text"
                value={component.props.text || ""}
                onChange={(e) => handlePropChange("text", e.target.value)}
                placeholder="Click me"
              />
            </div>
            <div>
              <Label htmlFor="variant">Variant</Label>
              <Select
                value={component.props.variant || "default"}
                onValueChange={(value) => handlePropChange("variant", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="destructive">Destructive</SelectItem>
                  <SelectItem value="outline">Outline</SelectItem>
                  <SelectItem value="secondary">Secondary</SelectItem>
                  <SelectItem value="ghost">Ghost</SelectItem>
                  <SelectItem value="link">Link</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="size">Size</Label>
              <Select
                value={component.props.size || "default"}
                onValueChange={(value) => handlePropChange("size", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="sm">Small</SelectItem>
                  <SelectItem value="lg">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case "animated-tooltip":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Tooltip Items</Label>
              <Button
                size="sm"
                onClick={() =>
                  addArrayItem("items", {
                    id: Date.now(),
                    name: "New Member",
                    designation: "Role",
                    image: "/placeholder.svg?height=100&width=100",
                  })
                }
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Item
              </Button>
            </div>
            {(component.props.items || []).map((item: any, index: number) => (
              <Card key={item.id || index} className="p-3">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">Item {index + 1}</Badge>
                    <Button size="sm" variant="ghost" onClick={() => removeArrayItem("items", index)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div>
                    <Label>Name</Label>
                    <Input
                      value={item.name || ""}
                      onChange={(e) => handleArrayChange("items", index, "name", e.target.value)}
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <Label>Designation</Label>
                    <Input
                      value={item.designation || ""}
                      onChange={(e) => handleArrayChange("items", index, "designation", e.target.value)}
                      placeholder="Software Engineer"
                    />
                  </div>
                  <div>
                    <Label>Image</Label>
                    <ImageUpload
                      value={item.image}
                      onChange={(url) => handleArrayChange("items", index, "image", url)}
                    />
                  </div>
                  <div>
                    <Label>Link (optional)</Label>
                    <Input
                      value={item.link || ""}
                      onChange={(e) => handleArrayChange("items", index, "link", e.target.value)}
                      placeholder="https://example.com"
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )

      case "animated-glowing-search-bar":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="placeholder">Placeholder Text</Label>
              <Input
                id="placeholder"
                value={component.props.placeholder || ""}
                onChange={(e) => handlePropChange("placeholder", e.target.value)}
                placeholder="Search..."
              />
            </div>
            <div>
              <Label htmlFor="primaryColor">Primary Color</Label>
              <div className="flex space-x-2">
                <Input
                  id="primaryColor"
                  type="color"
                  value={component.props.primaryColor || "#402fb5"}
                  onChange={(e) => handlePropChange("primaryColor", e.target.value)}
                  className="w-16 h-10 p-1"
                />
                <Input
                  value={component.props.primaryColor || "#402fb5"}
                  onChange={(e) => handlePropChange("primaryColor", e.target.value)}
                  placeholder="#402fb5"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="secondaryColor">Secondary Color</Label>
              <div className="flex space-x-2">
                <Input
                  id="secondaryColor"
                  type="color"
                  value={component.props.secondaryColor || "#cf30aa"}
                  onChange={(e) => handlePropChange("secondaryColor", e.target.value)}
                  className="w-16 h-10 p-1"
                />
                <Input
                  value={component.props.secondaryColor || "#cf30aa"}
                  onChange={(e) => handlePropChange("secondaryColor", e.target.value)}
                  placeholder="#cf30aa"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="showBorder"
                checked={component.props.showBorder !== false}
                onCheckedChange={(checked) => handlePropChange("showBorder", checked)}
              />
              <Label htmlFor="showBorder">Show Border Effect</Label>
            </div>
          </div>
        )

      case "spotlight-card":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="glowColor">Glow Color</Label>
              <Select
                value={component.props.glowColor || "blue"}
                onValueChange={(value) => handlePropChange("glowColor", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blue">Blue</SelectItem>
                  <SelectItem value="purple">Purple</SelectItem>
                  <SelectItem value="green">Green</SelectItem>
                  <SelectItem value="red">Red</SelectItem>
                  <SelectItem value="orange">Orange</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="size">Size</Label>
              <Select value={component.props.size || "md"} onValueChange={(value) => handlePropChange("size", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sm">Small</SelectItem>
                  <SelectItem value="md">Medium</SelectItem>
                  <SelectItem value="lg">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="customSize"
                checked={component.props.customSize || false}
                onCheckedChange={(checked) => handlePropChange("customSize", checked)}
              />
              <Label htmlFor="customSize">Custom Size</Label>
            </div>
            {component.props.customSize && (
              <>
                <div>
                  <Label htmlFor="width">Width</Label>
                  <Input
                    id="width"
                    value={component.props.width || ""}
                    onChange={(e) => handlePropChange("width", e.target.value)}
                    placeholder="300px or 100%"
                  />
                </div>
                <div>
                  <Label htmlFor="height">Height</Label>
                  <Input
                    id="height"
                    value={component.props.height || ""}
                    onChange={(e) => handlePropChange("height", e.target.value)}
                    placeholder="400px or 50vh"
                  />
                </div>
              </>
            )}
          </div>
        )

      case "about-us-section":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={component.props.title || ""}
                onChange={(e) => handlePropChange("title", e.target.value)}
                placeholder="About Us"
              />
            </div>
            <div>
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                value={component.props.subtitle || ""}
                onChange={(e) => handlePropChange("subtitle", e.target.value)}
                placeholder="DISCOVER OUR STORY"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={component.props.description || ""}
                onChange={(e) => handlePropChange("description", e.target.value)}
                placeholder="Tell your story..."
              />
            </div>
            <div>
              <Label>Main Image</Label>
              <ImageUpload value={component.props.mainImage} onChange={(url) => handlePropChange("mainImage", url)} />
            </div>
            <div>
              <Label htmlFor="accentColor">Accent Color</Label>
              <div className="flex space-x-2">
                <Input
                  type="color"
                  value={component.props.accentColor || "#88734C"}
                  onChange={(e) => handlePropChange("accentColor", e.target.value)}
                  className="w-16 h-10 p-1"
                />
                <Input
                  value={component.props.accentColor || "#88734C"}
                  onChange={(e) => handlePropChange("accentColor", e.target.value)}
                  placeholder="#88734C"
                />
              </div>
            </div>
          </div>
        )

      case "animated-testimonials":
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="autoplay"
                checked={component.props.autoplay || false}
                onCheckedChange={(checked) => handlePropChange("autoplay", checked)}
              />
              <Label htmlFor="autoplay">Auto-play testimonials</Label>
            </div>
            <div className="flex items-center justify-between">
              <Label>Testimonials</Label>
              <Button
                size="sm"
                onClick={() =>
                  addArrayItem("testimonials", {
                    quote: "This is an amazing product!",
                    name: "New Customer",
                    designation: "Customer",
                    src: "/placeholder.svg?height=400&width=400",
                  })
                }
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Testimonial
              </Button>
            </div>
            {(component.props.testimonials || []).map((testimonial: any, index: number) => (
              <Card key={index} className="p-3">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">Testimonial {index + 1}</Badge>
                    <Button size="sm" variant="ghost" onClick={() => removeArrayItem("testimonials", index)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div>
                    <Label>Name</Label>
                    <Input
                      value={testimonial.name || ""}
                      onChange={(e) => handleArrayChange("testimonials", index, "name", e.target.value)}
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <Label>Designation</Label>
                    <Input
                      value={testimonial.designation || ""}
                      onChange={(e) => handleArrayChange("testimonials", index, "designation", e.target.value)}
                      placeholder="CEO, Company"
                    />
                  </div>
                  <div>
                    <Label>Quote</Label>
                    <Textarea
                      value={testimonial.quote || ""}
                      onChange={(e) => handleArrayChange("testimonials", index, "quote", e.target.value)}
                      placeholder="This product is amazing..."
                    />
                  </div>
                  <div>
                    <Label>Image</Label>
                    <ImageUpload
                      value={testimonial.src}
                      onChange={(url) => handleArrayChange("testimonials", index, "src", url)}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )

      case "shuffle-grid":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={component.props.title || ""}
                onChange={(e) => handlePropChange("title", e.target.value)}
                placeholder="Let's change it up a bit"
              />
            </div>
            <div>
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                value={component.props.subtitle || ""}
                onChange={(e) => handlePropChange("subtitle", e.target.value)}
                placeholder="Better every day"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={component.props.description || ""}
                onChange={(e) => handlePropChange("description", e.target.value)}
                placeholder="Describe your offering..."
              />
            </div>
            <div>
              <Label htmlFor="buttonText">Button Text</Label>
              <Input
                id="buttonText"
                value={component.props.buttonText || ""}
                onChange={(e) => handlePropChange("buttonText", e.target.value)}
                placeholder="Get Started"
              />
            </div>
          </div>
        )

      case "dock":
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isMobile"
                checked={component.props.isMobile || false}
                onCheckedChange={(checked) => handlePropChange("isMobile", checked)}
              />
              <Label htmlFor="isMobile">Mobile Mode (Fluid Menu)</Label>
            </div>
            <div className="flex items-center justify-between">
              <Label>Dock Items</Label>
              <Button
                size="sm"
                onClick={() =>
                  addArrayItem("dockItems", {
                    icon: "Plus",
                    label: "New Item",
                  })
                }
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Item
              </Button>
            </div>
            {(component.props.dockItems || []).map((item: any, index: number) => (
              <Card key={index} className="p-3">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">Item {index + 1}</Badge>
                    <Button size="sm" variant="ghost" onClick={() => removeArrayItem("dockItems", index)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div>
                    <Label>Label</Label>
                    <Input
                      value={item.label || ""}
                      onChange={(e) => handleArrayChange("dockItems", index, "label", e.target.value)}
                      placeholder="Home"
                    />
                  </div>
                  <div>
                    <Label>Icon (Lucide Icon Name)</Label>
                    <Input
                      value={item.icon || ""}
                      onChange={(e) => handleArrayChange("dockItems", index, "icon", e.target.value)}
                      placeholder="Home, Search, Settings, etc."
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )

      case "interactive-bento-gallery":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={component.props.title || ""}
                onChange={(e) => handlePropChange("title", e.target.value)}
                placeholder="Interactive Gallery"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={component.props.description || ""}
                onChange={(e) => handlePropChange("description", e.target.value)}
                placeholder="Click on any item to view in detail"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Media Items</Label>
              <Button
                size="sm"
                onClick={() =>
                  addArrayItem("mediaItems", {
                    id: Date.now(),
                    type: "image",
                    title: "New Item",
                    desc: "Description",
                    url: "/placeholder.svg?height=200&width=300",
                    span: "md:col-span-1 md:row-span-2",
                  })
                }
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Item
              </Button>
            </div>
            {(component.props.mediaItems || []).map((item: any, index: number) => (
              <Card key={item.id || index} className="p-3">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">Item {index + 1}</Badge>
                    <Button size="sm" variant="ghost" onClick={() => removeArrayItem("mediaItems", index)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={item.title || ""}
                      onChange={(e) => handleArrayChange("mediaItems", index, "title", e.target.value)}
                      placeholder="Item title"
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Input
                      value={item.desc || ""}
                      onChange={(e) => handleArrayChange("mediaItems", index, "desc", e.target.value)}
                      placeholder="Item description"
                    />
                  </div>
                  <div>
                    <Label>Type</Label>
                    <Select
                      value={item.type || "image"}
                      onValueChange={(value) => handleArrayChange("mediaItems", index, "type", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="image">Image</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Media URL</Label>
                    <ImageUpload
                      value={item.url}
                      onChange={(url) => handleArrayChange("mediaItems", index, "url", url)}
                    />
                  </div>
                  <div>
                    <Label>Grid Span Classes</Label>
                    <Input
                      value={item.span || ""}
                      onChange={(e) => handleArrayChange("mediaItems", index, "span", e.target.value)}
                      placeholder="md:col-span-2 md:row-span-1"
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )

      default:
        return (
          <div className="text-center py-8 text-gray-500">
            <Settings className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No properties available for this component type</p>
          </div>
        )
    }
  }

  const renderColumnProperties = () => {
    if (!column) {
      return (
        <div className="text-center py-8 text-gray-500">
          <Settings className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Select a column to edit its properties</p>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="orientation">Orientation</Label>
          <Select
            value={column.orientation || "horizontal"}
            onValueChange={(value) => onUpdateColumn(column.id, { orientation: value as "horizontal" | "vertical" })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="horizontal">Horizontal</SelectItem>
              <SelectItem value="vertical">Vertical</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {column.orientation === "horizontal" && (
          <div>
            <Label htmlFor="width">Width (out of 12)</Label>
            <Input
              id="width"
              type="number"
              min="1"
              max="12"
              value={column.width || 12}
              onChange={(e) => onUpdateColumn(column.id, { width: Number.parseInt(e.target.value) })}
            />
          </div>
        )}

        <div>
          <Label htmlFor="flexLayout">Flex Layout</Label>
          <Select
            value={column.flexLayout || "items-start justify-start"}
            onValueChange={(value) => onUpdateColumn(column.id, { flexLayout: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="items-start justify-start">Top Left</SelectItem>
              <SelectItem value="items-start justify-center">Top Center</SelectItem>
              <SelectItem value="items-start justify-end">Top Right</SelectItem>
              <SelectItem value="items-center justify-start">Center Left</SelectItem>
              <SelectItem value="items-center justify-center">Center Center</SelectItem>
              <SelectItem value="items-center justify-end">Center Right</SelectItem>
              <SelectItem value="items-end justify-start">Bottom Left</SelectItem>
              <SelectItem value="items-end justify-center">Bottom Center</SelectItem>
              <SelectItem value="items-end justify-end">Bottom Right</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="gap">Gap</Label>
          <Select value={column.gap || "0"} onValueChange={(value) => onUpdateColumn(column.id, { gap: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">No Gap</SelectItem>
              <SelectItem value="1">Gap 1</SelectItem>
              <SelectItem value="2">Gap 2</SelectItem>
              <SelectItem value="3">Gap 3</SelectItem>
              <SelectItem value="4">Gap 4</SelectItem>
              <SelectItem value="6">Gap 6</SelectItem>
              <SelectItem value="8">Gap 8</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    )
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab("component")}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === "component" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Type className="w-4 h-4 inline mr-1" />
            Component
          </button>
          <button
            onClick={() => setActiveTab("column")}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === "column" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Palette className="w-4 h-4 inline mr-1" />
            Column
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "component" && (
          <div>
            {component && (
              <div className="mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Badge variant="outline">{component.type}</Badge>
                  <span className="text-sm text-gray-500">#{component.id.slice(-8)}</span>
                </div>
                <Separator className="my-3" />
              </div>
            )}
            {renderComponentProperties()}
          </div>
        )}

        {activeTab === "column" && (
          <div>
            {column && (
              <div className="mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Badge variant="outline">Column</Badge>
                  <span className="text-sm text-gray-500">#{column.id.slice(-8)}</span>
                </div>
                <Separator className="my-3" />
              </div>
            )}
            {renderColumnProperties()}
          </div>
        )}
      </div>
    </div>
  )
}
