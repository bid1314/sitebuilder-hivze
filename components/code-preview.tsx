"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check, Download } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface CodePreviewProps {
  code: string
}

export default function CodePreview({ code }: CodePreviewProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }

  return (
    <div className="border-t border-gray-200 p-4 flex-1 overflow-hidden flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Generated Code</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={copyToClipboard} className="flex items-center">
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-1" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </>
            )}
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center">
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Download and Run Instructions</DialogTitle>
                <DialogDescription>
                  Follow these steps to use the generated code in your React project.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Step 1: Create a new React project</h3>
                  <pre className="bg-gray-50 p-2 rounded-md text-xs overflow-x-auto">
                    npx create-next-app my-ui-project
                    <br />
                    cd my-ui-project
                  </pre>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Step 2: Install required dependencies</h3>
                  <pre className="bg-gray-50 p-2 rounded-md text-xs overflow-x-auto">npm install @/components/ui</pre>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Step 3: Create a new component file</h3>
                  <p className="text-sm text-gray-500">
                    Create a file named <code>GeneratedUI.tsx</code> in your components directory and paste the
                    generated code.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Step 4: Import and use the component</h3>
                  <pre className="bg-gray-50 p-2 rounded-md text-xs overflow-x-auto">
                    {`import GeneratedUI from './components/GeneratedUI'

export default function Home() {
  return (
    <main>
      <GeneratedUI />
    </main>
  )
}`}
                  </pre>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Step 5: Run your application</h3>
                  <pre className="bg-gray-50 p-2 rounded-md text-xs overflow-x-auto">npm run dev</pre>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <pre className="bg-gray-50 p-4 rounded-md overflow-auto h-full text-sm">
        <code>{code}</code>
      </pre>
    </div>
  )
}
