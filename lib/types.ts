export type ComponentType =
  | "animated-tooltip"
  | "animated-glowing-search-bar"
  | "spotlight-card"
  | "about-us-section"
  | "animated-testimonials"
  | "shuffle-grid"
  | "dock"
  | "interactive-bento-gallery"
  | "header-1"
  | "navbar-1"

export interface Component {
  id: string
  type: ComponentType
  props: {
    // Animated Tooltip
    items?: Array<{ id: number; name: string; designation: string; image: string; link?: string }>
    // Animated Glowing Search Bar
    placeholder?: string
    primaryColor?: string
    secondaryColor?: string
    showBorder?: boolean
    // Spotlight Card
    glowColor?: "blue" | "purple" | "green" | "red" | "orange"
    size?: "sm" | "md" | "lg"
    width?: string | number
    height?: string | number
    customSize?: boolean
    // About Us Section
    title?: string
    subtitle?: string
    description?: string
    mainImage?: string
    services?: Array<{ icon: string; title: string; description: string }>
    stats?: Array<{ icon: string; value: number; label: string; suffix: string }>
    ctaTitle?: string
    ctaDescription?: string
    ctaButtonText?: string
    backgroundColor?: string
    textColor?: string
    accentColor?: string
    // Animated Testimonials
    testimonials?: Array<{ quote: string; name: string; designation: string; src: string }>
    autoplay?: boolean
    // Shuffle Grid
    buttonText?: string
    images?: Array<{ id: number; src: string }>
    // Dock
    dockItems?: Array<{ icon: string; label: string }>
    isMobile?: boolean
    // Interactive Bento Gallery
    mediaItems?: Array<{ id: number; type: "image" | "video"; title: string; desc: string; url: string; span: string }>
    // Header 1
    logoText?: string
    navigationItems?: Array<{
      title: string
      href?: string
      description?: string
      items?: Array<{ title: string; href: string }>
    }>
    cta1Text?: string
    cta2Text?: string
    cta3Text?: string
    // Navbar 1
    logo?: { url: string; src: string; alt: string; title: string }
    menu?: Array<{
      title: string
      url: string
      description?: string
      icon?: string
      items?: Array<{ title: string; url: string; description?: string; icon?: string }>
    }>
    mobileExtraLinks?: Array<{ name: string; url: string }>
    auth?: { login: { text: string; url: string }; signup: { text: string; url: string } }
  }
  children?: Component[]
  layout?: any
  styles?: any
  displayConditions?: any
}
