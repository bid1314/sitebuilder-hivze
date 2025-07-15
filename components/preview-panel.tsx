"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, RefreshCw, Smartphone, Tablet, Monitor, Code, Eye } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { GridLayout } from "@/lib/types"

interface PreviewPanelProps {
  code: string
  layout: GridLayout
  onBack: () => void
}

export default function PreviewPanel({ code, layout, onBack }: PreviewPanelProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [loading, setLoading] = useState(true)
  const [viewportSize, setViewportSize] = useState<"mobile" | "tablet" | "desktop">("desktop")
  const [activeTab, setActiveTab] = useState<"visual" | "code">("visual")

  const generatePreviewHTML = () => {
    return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://cdn.tailwindcss.com"></script>
        <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
        <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
        <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
        <style>
          body {
            margin: 0;
            padding: 20px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          }
          
          /* Button styles */
          .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 0.375rem;
            font-weight: 500;
            transition-property: color, background-color, border-color;
            transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
            transition-duration: 150ms;
            padding: 0.5rem 1rem;
            cursor: pointer;
          }
          
          .btn-default {
            background-color: rgb(59, 130, 246);
            color: white;
          }
          
          .btn-default:hover {
            background-color: rgb(37, 99, 235);
          }
          
          .btn-destructive {
            background-color: rgb(239, 68, 68);
            color: white;
          }
          
          .btn-destructive:hover {
            background-color: rgb(220, 38, 38);
          }
          
          .btn-outline {
            border: 1px solid rgb(209, 213, 219);
            background-color: transparent;
          }
          
          .btn-outline:hover {
            background-color: rgb(243, 244, 246);
          }
          
          .btn-secondary {
            background-color: rgb(229, 231, 235);
            color: rgb(17, 24, 39);
          }
          
          .btn-secondary:hover {
            background-color: rgb(209, 213, 219);
          }
          
          .btn-ghost {
            background-color: transparent;
          }
          
          .btn-ghost:hover {
            background-color: rgb(243, 244, 246);
          }
          
          .btn-link {
            background-color: transparent;
            color: rgb(59, 130, 246);
            text-decoration: underline;
          }
          
          /* Input styles */
          .input {
            display: flex;
            height: 2.5rem;
            width: 100%;
            border-radius: 0.375rem;
            border: 1px solid rgb(209, 213, 219);
            background-color: white;
            padding: 0.5rem 0.75rem;
            font-size: 0.875rem;
          }
          
          .input:focus {
            outline: 2px solid rgb(59, 130, 246);
            outline-offset: 2px;
          }
          
          /* Tailwind-like utility classes */
          .flex { display: flex; }
          .flex-wrap { flex-wrap: wrap; }
          .flex-col { flex-direction: column; }
          .flex-row { flex-direction: row; }
          .items-start { align-items: flex-start; }
          .items-center { align-items: center; }
          .items-end { align-items: flex-end; }
          .justify-start { justify-content: flex-start; }
          .justify-center { justify-content: center; }
          .justify-end { justify-content: flex-end; }
          .justify-between { justify-content: space-between; }
          .justify-around { justify-content: space-around; }
          .justify-evenly { justify-content: space-evenly; }
          .gap-1 { gap: 0.25rem; }
          .gap-2 { gap: 0.5rem; }
          .gap-3 { gap: 0.75rem; }
          .gap-4 { gap: 1rem; }
          .gap-5 { gap: 1.25rem; }
          .gap-6 { gap: 1.5rem; }
          .gap-8 { gap: 2rem; }
          .gap-10 { gap: 2.5rem; }
          .gap-12 { gap: 3rem; }
          .w-full { width: 100%; }
          .w-1\\/12 { width: 8.333333%; }
          .w-2\\/12 { width: 16.666667%; }
          .w-3\\/12 { width: 25%; }
          .w-4\\/12 { width: 33.333333%; }
          .w-5\\/12 { width: 41.666667%; }
          .w-6\\/12 { width: 50%; }
          .w-7\\/12 { width: 58.333333%; }
          .w-8\\/12 { width: 66.666667%; }
          .w-9\\/12 { width: 75%; }
          .w-10\\/12 { width: 83.333333%; }
          .w-11\\/12 { width: 91.666667%; }
          .p-2 { padding: 0.5rem; }
          .p-4 { padding: 1rem; }
        </style>
      </head>
      <body>
        <div id="root"></div>
        <script type="text/babel">
          // Define React components and hooks directly without imports
          const { useState, useEffect } = React;
          
          const Button = ({ children, variant = "default", size = "default", className = "", ...props }) => {
            const getVariantClasses = () => {
              switch (variant) {
                case "default": return "btn btn-default";
                case "destructive": return "btn btn-destructive";
                case "outline": return "btn btn-outline";
                case "secondary": return "btn btn-secondary";
                case "ghost": return "btn btn-ghost";
                case "link": return "btn btn-link";
                default: return "btn btn-default";
              }
            };
            
            const getSizeClasses = () => {
              switch (size) {
                case "default": return "h-10 px-4 py-2";
                case "sm": return "h-8 px-3 py-1 text-sm";
                case "lg": return "h-12 px-6 py-3 text-lg";
                default: return "h-10 px-4 py-2";
              }
            };
            
            return (
              <button
                className={\`\${getVariantClasses()} \${className}\`}
                {...props}
              >
                {children}
              </button>
            );
          };
          
          const Input = ({ className = "", ...props }) => {
            return (
              <input
                className={\`input \${className}\`}
                {...props}
              />
            );
          };
          
          try {
            ${code.replace(/import\s+.*?from\s+['"].*?['"];?/g, "").replace(/export\s+default\s+/g, "")}
            
            ReactDOM.render(<GeneratedUI />, document.getElementById('root'));
          } catch (error) {
            ReactDOM.render(
              <div style={{ color: 'red', padding: '20px', border: '1px solid red', borderRadius: '4px' }}>
                <h3>Error rendering preview:</h3>
                <pre>{error.toString()}</pre>
              </div>,
              document.getElementById('root')
            );
          }
        </script>
      </body>
    </html>
  `
  }

  const refreshPreview = () => {
    setLoading(true)
    if (iframeRef.current) {
      const iframe = iframeRef.current
      const html = generatePreviewHTML()

      iframe.srcdoc = html

      iframe.onload = () => {
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    refreshPreview()
  }, [code])

  const getViewportWidth = () => {
    switch (viewportSize) {
      case "mobile":
        return "375px"
      case "tablet":
        return "768px"
      case "desktop":
      default:
        return "100%"
    }
  }

  return (
    <div className="flex-1 p-4 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <Button variant="outline" size="sm" onClick={onBack} className="flex items-center">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Editor
        </Button>
        <div className="flex items-center space-x-2">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "visual" | "code")} className="mr-4">
            <TabsList>
              <TabsTrigger value="visual" className="flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                Visual
              </TabsTrigger>
              <TabsTrigger value="code" className="flex items-center">
                <Code className="h-4 w-4 mr-1" />
                Code
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {activeTab === "visual" && (
            <div className="flex items-center border rounded-md overflow-hidden">
              <Button
                variant={viewportSize === "mobile" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewportSize("mobile")}
                className="rounded-none border-0"
              >
                <Smartphone className="h-4 w-4" />
              </Button>
              <Button
                variant={viewportSize === "tablet" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewportSize("tablet")}
                className="rounded-none border-0"
              >
                <Tablet className="h-4 w-4" />
              </Button>
              <Button
                variant={viewportSize === "desktop" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewportSize("desktop")}
                className="rounded-none border-0"
              >
                <Monitor className="h-4 w-4" />
              </Button>
            </div>
          )}

          <Button variant="outline" size="sm" onClick={refreshPreview} className="flex items-center">
            <RefreshCw className={`h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {activeTab === "visual" ? (
        <div className="flex-1 border border-gray-300 rounded-md overflow-hidden flex justify-center bg-gray-100">
          <div
            className="bg-white h-full overflow-auto transition-all duration-300"
            style={{ width: getViewportWidth() }}
          >
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
                <div className="text-center">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto text-blue-500" />
                  <p className="mt-2 text-sm text-gray-600">Loading preview...</p>
                </div>
              </div>
            )}
            <iframe
              ref={iframeRef}
              className="w-full h-full"
              title="Preview"
              sandbox="allow-scripts"
              style={{ minHeight: "500px" }}
            />
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-auto">
          <pre className="bg-gray-50 p-4 rounded-md overflow-auto h-full text-sm">
            <code>{code}</code>
          </pre>
        </div>
      )}
    </div>
  )
}
