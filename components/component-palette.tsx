"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  InfoIcon as Tooltip,
  Search,
  CreditCard,
  User,
  MessageSquare,
  Grid,
  Dock,
  GalleryHorizontal,
  Heading1,
  Navigation,
  ImageIcon,
  Type,
  Square,
  MousePointer,
  Layers,
  Lightbulb,
  Plus,
} from "lucide-react"

interface ComponentPaletteProps {
  onAddComponent: (type: string, defaultProps?: any) => void
  selectedColumnId: string | null
}

const componentCategories = [
  {
    name: "Basic",
    components: [
      {
        type: "text",
        name: "Text",
        icon: <Type className="w-4 h-4" />,
        description: "Simple text element",
        defaultProps: { text: "Sample text", element: "p" },
      },
      {
        type: "image",
        name: "Image",
        icon: <ImageIcon className="w-4 h-4" />,
        description: "Image component",
        defaultProps: { src: "/placeholder.svg?height=200&width=300", alt: "Sample image" },
      },
      {
        type: "button",
        name: "Button",
        icon: <MousePointer className="w-4 h-4" />,
        description: "Interactive button",
        defaultProps: { text: "Click me", variant: "default" },
      },
      {
        type: "div",
        name: "Container",
        icon: <Square className="w-4 h-4" />,
        description: "Generic container",
        defaultProps: { text: "Container", className: "p-4 border rounded" },
      },
    ],
  },
  {
    name: "Interactive",
    components: [
      {
        type: "animated-tooltip",
        name: "Animated Tooltip",
        icon: <Tooltip className="w-4 h-4" />,
        description: "Hover tooltips with animation",
        defaultProps: {
          items: [
            {
              id: 1,
              name: "John Doe",
              designation: "Software Engineer",
              image: "/placeholder.svg?height=100&width=100",
            },
            {
              id: 2,
              name: "Jane Smith",
              designation: "Product Manager",
              image: "/placeholder.svg?height=100&width=100",
            },
          ],
        },
      },
      {
        type: "animated-glowing-search-bar",
        name: "Glowing Search Bar",
        icon: <Search className="w-4 h-4" />,
        description: "Animated search input with glow effects",
        defaultProps: {
          placeholder: "Search...",
          primaryColor: "#402fb5",
          secondaryColor: "#cf30aa",
          showBorder: true,
        },
      },
      {
        type: "spotlight-card",
        name: "Spotlight Card",
        icon: <CreditCard className="w-4 h-4" />,
        description: "Card with spotlight hover effect",
        defaultProps: {
          glowColor: "blue",
          size: "md",
        },
      },
      {
        type: "dock",
        name: "Dock",
        icon: <Dock className="w-4 h-4" />,
        description: "macOS-style dock component",
        defaultProps: {
          dockItems: [
            { icon: "Home", label: "Home" },
            { icon: "Search", label: "Search" },
            { icon: "Music", label: "Music" },
            { icon: "Heart", label: "Favorites" },
            { icon: "Settings", label: "Settings" },
          ],
          isMobile: false,
        },
      },
    ],
  },
  {
    name: "Content",
    components: [
      {
        type: "about-us-section",
        name: "About Us Section",
        icon: <User className="w-4 h-4" />,
        description: "Complete about us section with stats",
        defaultProps: {
          title: "About Us",
          subtitle: "DISCOVER OUR STORY",
          description: "We are a passionate team dedicated to creating amazing experiences.",
          mainImage: "/placeholder.svg?height=400&width=300",
        },
      },
      {
        type: "animated-testimonials",
        name: "Animated Testimonials",
        icon: <MessageSquare className="w-4 h-4" />,
        description: "Testimonial carousel with animations",
        defaultProps: {
          testimonials: [
            {
              quote: "This product has completely transformed how we work. Highly recommended!",
              name: "Sarah Johnson",
              designation: "CEO, TechCorp",
              src: "/placeholder.svg?height=400&width=400",
            },
            {
              quote: "Amazing experience from start to finish. The team is incredibly professional.",
              name: "Mike Chen",
              designation: "Designer, CreativeStudio",
              src: "/placeholder.svg?height=400&width=400",
            },
          ],
          autoplay: true,
        },
      },
      {
        type: "shuffle-grid",
        name: "Shuffle Grid",
        icon: <Grid className="w-4 h-4" />,
        description: "Animated shuffling image grid",
        defaultProps: {
          title: "Let's change it up a bit",
          subtitle: "Better every day",
          description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit.",
          buttonText: "Get Started",
        },
      },
      {
        type: "interactive-bento-gallery",
        name: "Bento Gallery",
        icon: <GalleryHorizontal className="w-4 h-4" />,
        description: "Interactive masonry-style gallery",
        defaultProps: {
          title: "Interactive Gallery",
          description: "Click on any item to view in detail",
          mediaItems: [
            {
              id: 1,
              type: "image",
              title: "Sample Image",
              desc: "Beautiful landscape",
              url: "/placeholder.svg?height=300&width=400",
              span: "md:col-span-1 md:row-span-3 sm:col-span-1 sm:row-span-2",
            },
            {
              id: 2,
              type: "image",
              title: "Another Image",
              desc: "Stunning view",
              url: "/placeholder.svg?height=200&width=400",
              span: "md:col-span-2 md:row-span-2 col-span-1 sm:col-span-2 sm:row-span-2",
            },
          ],
        },
      },
    ],
  },
  {
    name: "Navigation",
    components: [
      {
        type: "header-1",
        name: "Header 1",
        icon: <Heading1 className="w-4 h-4" />,
        description: "Modern header with navigation",
        defaultProps: {
          logoText: "Brand",
          navigationItems: [
            { title: "Home", href: "/" },
            { title: "About", href: "/about" },
            { title: "Contact", href: "/contact" },
          ],
          cta1Text: "Book a demo",
          cta2Text: "Sign in",
          cta3Text: "Get started",
        },
      },
      {
        type: "navbar-1",
        name: "Navbar 1",
        icon: <Navigation className="w-4 h-4" />,
        description: "Responsive navbar with dropdowns",
        defaultProps: {
          logo: {
            url: "#",
            src: "/placeholder.svg?height=32&width=32",
            alt: "Logo",
            title: "Brand",
          },
          menu: [
            { title: "Home", url: "#" },
            { title: "About", url: "#" },
            { title: "Services", url: "#" },
            { title: "Contact", url: "#" },
          ],
        },
      },
    ],
  },
]

export default function ComponentPalette({ onAddComponent, selectedColumnId }: ComponentPaletteProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredCategories = componentCategories
    .map((category) => ({
      ...category,
      components: category.components.filter(
        (component) =>
          component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          component.description.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    }))
    .filter((category) => category.components.length > 0)

  const handleDragStart = (e: React.DragEvent, componentType: string, defaultProps: any) => {
    e.dataTransfer.setData("componentType", componentType)
    e.dataTransfer.setData("defaultProps", JSON.stringify(defaultProps))
  }

  return (
    <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Components</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search components..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {!selectedColumnId && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-yellow-800">
              <Lightbulb className="w-4 h-4 inline mr-1" />
              Select a column to add components
            </p>
          </div>
        )}

        {filteredCategories.map((category) => (
          <Card key={category.name} className="overflow-hidden">
            <CardHeader
              className="pb-2 cursor-pointer hover:bg-gray-50"
              onClick={() => setSelectedCategory(selectedCategory === category.name ? null : category.name)}
            >
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                {category.name}
                <Badge variant="secondary" className="text-xs">
                  {category.components.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            {(selectedCategory === null || selectedCategory === category.name) && (
              <CardContent className="pt-0 space-y-2">
                {category.components.map((component) => (
                  <div
                    key={component.type}
                    draggable
                    onDragStart={(e) => handleDragStart(e, component.type, component.defaultProps)}
                    onClick={() => selectedColumnId && onAddComponent(component.type, component.defaultProps)}
                    className={`
                      group relative p-3 rounded-lg border border-gray-200 bg-white 
                      hover:border-blue-300 hover:shadow-sm transition-all duration-200 
                      ${selectedColumnId ? "cursor-pointer" : "cursor-not-allowed opacity-60"}
                    `}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 p-2 bg-gray-100 rounded-md group-hover:bg-blue-50 transition-colors">
                        {component.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate">{component.name}</h3>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{component.description}</p>
                      </div>
                    </div>
                    {selectedColumnId && (
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Plus className="w-4 h-4 text-blue-500" />
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            )}
          </Card>
        ))}

        {filteredCategories.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No components found</p>
            <p className="text-xs mt-1">Try adjusting your search terms</p>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="text-xs text-gray-500 space-y-1">
          <p className="flex items-center">
            <MousePointer className="w-3 h-3 mr-1" />
            Drag & drop or click to add
          </p>
          <p className="flex items-center">
            <Layers className="w-3 h-3 mr-1" />
            {componentCategories.reduce((acc, cat) => acc + cat.components.length, 0)} components available
          </p>
        </div>
      </div>
    </div>
  )
}
