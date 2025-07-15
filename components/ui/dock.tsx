"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { type LucideIcon, Menu, X } from "lucide-react"

interface DockProps {
  className?: string
  items: {
    icon: LucideIcon
    label: string
    onClick?: () => void
  }[]
  isMobile?: boolean
}

interface DockIconButtonProps {
  icon: LucideIcon
  label: string
  onClick?: () => void
  className?: string
}

const floatingAnimation = {
  initial: { y: 0 },
  animate: {
    y: [-2, 2, -2],
    transition: {
      duration: 4,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut",
    },
  },
}

const DockIconButton = React.forwardRef<HTMLButtonElement, DockIconButtonProps>(
  ({ icon: Icon, label, onClick, className }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className={cn("relative group p-3 rounded-lg", "hover:bg-secondary transition-colors", className)}
      >
        <Icon className="w-5 h-5 text-foreground" />
        <span
          className={cn(
            "absolute -top-8 left-1/2 -translate-x-1/2",
            "px-2 py-1 rounded text-xs",
            "bg-popover text-popover-foreground",
            "opacity-0 group-hover:opacity-100",
            "transition-opacity whitespace-nowrap pointer-events-none",
          )}
        >
          {label}
        </span>
      </motion.button>
    )
  },
)
DockIconButton.displayName = "DockIconButton"

const Dock = React.forwardRef<HTMLDivElement, DockProps>(({ items, className, isMobile = false }, ref) => {
  const [isOpen, setIsOpen] = React.useState(false)

  // Mobile fluid menu
  if (isMobile) {
    return (
      <div ref={ref} className={cn("fixed bottom-4 right-4 z-50", className)}>
        <motion.div className="relative" initial={false} animate={isOpen ? "open" : "closed"}>
          {/* Menu items */}
          {items.slice(1).map((item, index) => (
            <motion.div
              key={item.label}
              className="absolute bottom-0 right-0 mb-16"
              variants={{
                open: {
                  y: -(index + 1) * 60,
                  opacity: 1,
                  scale: 1,
                },
                closed: {
                  y: 0,
                  opacity: 0,
                  scale: 0.3,
                },
              }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <motion.button
                onClick={item.onClick}
                className="w-12 h-12 bg-background border border-border rounded-full flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <item.icon className="w-5 h-5" />
              </motion.button>
            </motion.div>
          ))}

          {/* Main toggle button */}
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            className="w-14 h-14 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.2 }}>
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.div>
          </motion.button>
        </motion.div>
      </div>
    )
  }

  // Desktop dock
  return (
    <div ref={ref} className={cn("w-full h-64 flex items-center justify-center p-2", className)}>
      <div className="w-full max-w-4xl h-64 rounded-2xl flex items-center justify-center relative">
        <motion.div
          initial="initial"
          animate="animate"
          variants={floatingAnimation}
          className={cn(
            "flex items-center gap-1 p-2 rounded-2xl",
            "backdrop-blur-lg border shadow-lg",
            "bg-background/90 border-border",
            "hover:shadow-xl transition-shadow duration-300",
          )}
        >
          {items.map((item) => (
            <DockIconButton key={item.label} {...item} />
          ))}
        </motion.div>
      </div>
    </div>
  )
})
Dock.displayName = "Dock"

export { Dock }
