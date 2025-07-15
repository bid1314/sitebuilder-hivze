import type React from "react"
import { AnimatedTooltip } from "@/components/ui/animated-tooltip"
import SearchComponent from "@/components/ui/animated-glowing-search-bar"
import { GlowCard } from "@/components/ui/spotlight-card"
import AboutUsSection from "@/components/ui/about-us-section"
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials"
import { ShuffleHero } from "@/components/ui/shuffle-grid"
import { Dock } from "@/components/ui/dock"
import InteractiveBentoGallery from "@/components/ui/interactive-bento-gallery"
import { Header1 } from "@/components/ui/header-1"
import { Navbar1 } from "@/components/ui/navbar-1"
import {
  Home,
  Search,
  Music,
  Heart,
  Settings,
  Plus,
  UserIcon,
  Book,
  Sunset,
  Trees,
  Zap,
  Award,
  Users,
  Calendar,
  TrendingUp,
  Pen,
  PaintBucket,
  Ruler,
  PenTool,
  Building2,
  type LucideIcon,
} from "lucide-react"

const iconMap: { [key: string]: LucideIcon } = {
  Home,
  Search,
  Music,
  Heart,
  Settings,
  Plus,
  User: UserIcon,
  Book,
  Sunset,
  Trees,
  Zap,
  Award,
  Users,
  Calendar,
  TrendingUp,
  Pen,
  PaintBucket,
  Ruler,
  PenTool,
  Building2,
}

const getIcon = (iconName: string) => {
  return iconMap[iconName] || Home
}

interface ComponentProps {
  component: {
    type: string
    props: any
    children?: ComponentProps[]
  }
}

const ComponentRenderer: React.FC<ComponentProps> = ({ component }) => {
  const renderChildren = () => {
    if (component.children && component.children.length > 0) {
      return component.children.map((child, index) => <ComponentRenderer key={index} component={child} />)
    }
    return null
  }

  switch (component.type) {
    case "animated-tooltip":
      return <AnimatedTooltip {...(component.props as any)} />
    case "animated-glowing-search-bar":
      return <SearchComponent {...(component.props as any)} />
    case "spotlight-card":
      return <GlowCard {...(component.props as any)}>{renderChildren()}</GlowCard>
    case "about-us-section": {
      const props = { ...component.props }
      if (props.services) {
        props.services = props.services.map((s) => ({ ...s, icon: getIcon(s.icon) }))
      }
      if (props.stats) {
        props.stats = props.stats.map((s) => ({ ...s, icon: getIcon(s.icon) }))
      }
      return <AboutUsSection {...(props as any)} />
    }
    case "animated-testimonials":
      return <AnimatedTestimonials {...(component.props as any)} />
    case "shuffle-grid":
      return <ShuffleHero {...(component.props as any)} />
    case "dock": {
      const props = { ...component.props }
      if (props.dockItems) {
        props.items = props.dockItems.map((item) => ({ ...item, icon: getIcon(item.icon) }))
      }
      return <Dock {...(props as any)} />
    }
    case "interactive-bento-gallery":
      return <InteractiveBentoGallery {...(component.props as any)} />
    case "header-1":
      return <Header1 {...(component.props as any)} />
    case "navbar-1": {
      const props = { ...component.props }
      if (props.menu) {
        props.menu = props.menu.map((item) => ({
          ...item,
          icon: item.icon ? getIcon(item.icon) : undefined,
          items: item.items?.map((subItem) => ({
            ...subItem,
            icon: subItem.icon ? getIcon(subItem.icon) : undefined,
          })),
        }))
      }
      return <Navbar1 {...(props as any)} />
    }
    default:
      return <div>Component type {component.type} not found</div>
  }
}

export default ComponentRenderer
