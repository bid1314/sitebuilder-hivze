"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import {
  Pen,
  PaintBucket,
  Home,
  Ruler,
  PenTool,
  Building2,
  Award,
  Users,
  Calendar,
  CheckCircle,
  Sparkles,
  Star,
  ArrowRight,
  Zap,
  TrendingUp,
} from "lucide-react"
import { motion, useScroll, useTransform, useInView, useSpring } from "framer-motion"

interface AboutUsSectionProps {
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
}

export default function AboutUsSection({
  title = "About Us",
  subtitle = "DISCOVER OUR STORY",
  description = "We are a passionate team of designers and architects dedicated to creating beautiful, functional spaces that inspire and elevate everyday living. With attention to detail and commitment to excellence, we transform visions into reality.",
  mainImage = "https://images.unsplash.com/photo-1747582411588-f9b4acabe995?q=80&w=3027&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  services = [
    {
      icon: "Pen",
      title: "Interior",
      description:
        "Transform your living spaces with our expert interior design services. We blend functionality and aesthetics to create spaces that reflect your unique style and personality.",
    },
    {
      icon: "Home",
      title: "Exterior",
      description:
        "Make a lasting impression with stunning exterior designs that enhance curb appeal and create harmonious connections between architecture and landscape.",
    },
    {
      icon: "PenTool",
      title: "Design",
      description:
        "Our innovative design process combines creativity with practicality, resulting in spaces that are both beautiful and functional for everyday living.",
    },
    {
      icon: "PaintBucket",
      title: "Decoration",
      description:
        "Elevate your space with our curated decoration services. From color schemes to textiles and accessories, we perfect every detail to bring your vision to life.",
    },
    {
      icon: "Ruler",
      title: "Planning",
      description:
        "Our meticulous planning process ensures every project runs smoothly from concept to completion, with careful attention to timelines, budgets, and requirements.",
    },
    {
      icon: "Building2",
      title: "Execution",
      description:
        "Watch your dream space come to life through our flawless execution. Our skilled team handles every aspect of implementation with precision and care.",
    },
  ],
  stats = [
    { icon: "Award", value: 150, label: "Projects Completed", suffix: "+" },
    { icon: "Users", value: 1200, label: "Happy Clients", suffix: "+" },
    { icon: "Calendar", value: 12, label: "Years Experience", suffix: "" },
    { icon: "TrendingUp", value: 98, label: "Satisfaction Rate", suffix: "%" },
  ],
  ctaTitle = "Ready to transform your space?",
  ctaDescription = "Let's create something beautiful together.",
  ctaButtonText = "Get Started",
  backgroundColor = "#F2F2EB",
  textColor = "#202e44",
  accentColor = "#88734C",
}: AboutUsSectionProps) {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: false, amount: 0.1 })
  const isStatsInView = useInView(statsRef, { once: false, amount: 0.3 })

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 50])
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 20])
  const rotate2 = useTransform(scrollYProgress, [0, 1], [0, -20])

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  const iconMap = {
    Pen,
    PaintBucket,
    Home,
    Ruler,
    PenTool,
    Building2,
    Award,
    Users,
    Calendar,
    TrendingUp,
    CheckCircle,
    Sparkles,
    Star,
  }

  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName as keyof typeof iconMap] || Pen
    return <IconComponent className="w-6 h-6" />
  }

  const getStatIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName as keyof typeof iconMap] || Award
    return <IconComponent />
  }

  const servicesWithPositions =
    services?.map((service, index) => ({
      ...service,
      position: index < 3 ? "left" : "right",
    })) || []

  return (
    <section
      id="about-section"
      ref={sectionRef}
      className="w-full py-24 px-4 text-[#202e44] overflow-hidden relative"
      style={{
        background: `linear-gradient(to bottom, ${backgroundColor}, #F8F8F2)`,
        color: textColor,
      }}
    >
      {/* Decorative background elements */}
      <motion.div
        className="absolute top-20 left-10 w-64 h-64 rounded-full blur-3xl"
        style={{
          y: y1,
          rotate: rotate1,
          backgroundColor: `${accentColor}0D`, // 5% opacity
        }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-80 h-80 rounded-full blur-3xl"
        style={{
          y: y2,
          rotate: rotate2,
          backgroundColor: "#A9BBC80D", // 5% opacity
        }}
      />

      <motion.div
        className="container mx-auto max-w-6xl relative z-10"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <motion.div className="flex flex-col items-center mb-6" variants={itemVariants}>
          <motion.span
            className="font-medium mb-2 flex items-center gap-2"
            style={{ color: accentColor }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Zap className="w-4 h-4" />
            {subtitle}
          </motion.span>
          <h2 className="text-4xl md:text-5xl font-light mb-4 text-center">{title}</h2>
          <motion.div
            className="w-24 h-1"
            style={{ backgroundColor: accentColor }}
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </motion.div>

        <motion.p
          className="text-center max-w-2xl mx-auto mb-16 opacity-80"
          variants={itemVariants}
          style={{ color: textColor }}
        >
          {description}
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Left Column */}
          <div className="space-y-16">
            {servicesWithPositions
              .filter((service) => service.position === "left")
              .map((service, index) => (
                <ServiceItem
                  key={`left-${index}`}
                  icon={getIcon(service.icon)}
                  title={service.title}
                  description={service.description}
                  variants={itemVariants}
                  delay={index * 0.2}
                  direction="left"
                  accentColor={accentColor}
                  textColor={textColor}
                />
              ))}
          </div>

          {/* Center Image */}
          <div className="flex justify-center items-center order-first md:order-none mb-8 md:mb-0">
            <motion.div className="relative w-full max-w-xs" variants={itemVariants}>
              <motion.div
                className="rounded-md overflow-hidden shadow-xl"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
              >
                <img src={mainImage || "/placeholder.svg"} alt="Modern House" className="w-full h-full object-cover" />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-[#202e44]/50 to-transparent flex items-end justify-center p-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.9 }}
                >
                  <motion.button
                    className="bg-white text-[#202e44] px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Our Portfolio <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-16">
            {servicesWithPositions
              .filter((service) => service.position === "right")
              .map((service, index) => (
                <ServiceItem
                  key={`right-${index}`}
                  icon={getIcon(service.icon)}
                  title={service.title}
                  description={service.description}
                  variants={itemVariants}
                  delay={index * 0.2}
                  direction="right"
                  accentColor={accentColor}
                  textColor={textColor}
                />
              ))}
          </div>
        </div>

        {/* Stats Section */}
        <motion.div
          ref={statsRef}
          className="mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          initial="hidden"
          animate={isStatsInView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          {stats?.map((stat, index) => (
            <StatCounter
              key={index}
              icon={getStatIcon(stat.icon)}
              value={stat.value}
              label={stat.label}
              suffix={stat.suffix}
              delay={index * 0.1}
              accentColor={accentColor}
              textColor={textColor}
            />
          )) || []}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="mt-20 text-white p-8 rounded-xl flex flex-col md:flex-row items-center justify-between gap-6"
          style={{ backgroundColor: textColor }}
          initial={{ opacity: 0, y: 30 }}
          animate={isStatsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="flex-1">
            <h3 className="text-2xl font-medium mb-2">{ctaTitle}</h3>
            <p className="text-white/80">{ctaDescription}</p>
          </div>
          <motion.button
            className="text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium transition-colors"
            style={{ backgroundColor: accentColor }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {ctaButtonText} <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  )
}

interface ServiceItemProps {
  icon: React.ReactNode
  title: string
  description: string
  variants: any
  delay: number
  direction: "left" | "right"
  accentColor: string
  textColor: string
}

function ServiceItem({
  icon,
  title,
  description,
  variants,
  delay,
  direction,
  accentColor,
  textColor,
}: ServiceItemProps) {
  return (
    <motion.div
      className="flex flex-col group"
      variants={variants}
      transition={{ delay }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <motion.div
        className="flex items-center gap-3 mb-3"
        initial={{ x: direction === "left" ? -20 : 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: delay + 0.2 }}
      >
        <motion.div
          className="p-3 rounded-lg transition-colors duration-300 relative"
          style={{
            color: accentColor,
            backgroundColor: `${accentColor}1A`, // 10% opacity
          }}
          whileHover={{ rotate: [0, -10, 10, -5, 0], transition: { duration: 0.5 } }}
        >
          {icon}
        </motion.div>
        <h3 className="text-xl font-medium transition-colors duration-300" style={{ color: textColor }}>
          {title}
        </h3>
      </motion.div>
      <motion.p
        className="text-sm leading-relaxed pl-12 opacity-80"
        style={{ color: textColor }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ duration: 0.6, delay: delay + 0.4 }}
      >
        {description}
      </motion.p>
    </motion.div>
  )
}

interface StatCounterProps {
  icon: React.ReactNode
  value: number
  label: string
  suffix: string
  delay: number
  accentColor: string
  textColor: string
}

function StatCounter({ icon, value, label, suffix, delay, accentColor, textColor }: StatCounterProps) {
  const countRef = useRef(null)
  const isInView = useInView(countRef, { once: false })
  const [hasAnimated, setHasAnimated] = useState(false)

  const springValue = useSpring(0, {
    stiffness: 50,
    damping: 10,
  })

  useEffect(() => {
    if (isInView && !hasAnimated) {
      springValue.set(value)
      setHasAnimated(true)
    } else if (!isInView && hasAnimated) {
      springValue.set(0)
      setHasAnimated(false)
    }
  }, [isInView, value, springValue, hasAnimated])

  const displayValue = useTransform(springValue, (latest) => Math.floor(latest))

  return (
    <motion.div
      className="bg-white/50 backdrop-blur-sm p-6 rounded-xl flex flex-col items-center text-center group hover:bg-white transition-colors duration-300"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, delay },
        },
      }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <motion.div
        className="w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-colors duration-300"
        style={{
          backgroundColor: `${textColor}0D`, // 5% opacity
          color: accentColor,
        }}
        whileHover={{ rotate: 360, transition: { duration: 0.8 } }}
      >
        {icon}
      </motion.div>
      <motion.div ref={countRef} className="text-3xl font-bold flex items-center" style={{ color: textColor }}>
        <motion.span>{displayValue}</motion.span>
        <span>{suffix}</span>
      </motion.div>
      <p className="text-sm mt-1" style={{ color: `${textColor}B3` }}>
        {label}
      </p>
      <motion.div
        className="w-10 h-0.5 mt-3 group-hover:w-16 transition-all duration-300"
        style={{ backgroundColor: accentColor }}
      />
    </motion.div>
  )
}
