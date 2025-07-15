import { cn } from "@/lib/utils"

interface GradientHeadlineProps {
  text: string
  fromColor?: string
  toColor?: string
  element?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
  className?: string
}

export function GradientHeadline({
  text,
  fromColor = "from-blue-500",
  toColor = "to-cyan-500",
  element = "h2",
  className,
}: GradientHeadlineProps) {
  const Tag = element
  return (
    <Tag className={cn("bg-gradient-to-r bg-clip-text text-transparent", fromColor, toColor, className)}>{text}</Tag>
  )
}
