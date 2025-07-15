"use client"
import { cn } from "@/lib/utils"

interface ImageSource {
  src: string
  alt: string
  link?: string
}

interface ShowImageListItemProps {
  text: string
  images: [ImageSource, ImageSource]
}

function RevealImageListItem({ text, images }: ShowImageListItemProps) {
  const container = "absolute right-8 -top-1 z-40 h-20 w-16"
  const effect =
    "relative duration-500 delay-100 shadow-none group-hover:shadow-xl scale-0 group-hover:scale-100 opacity-0 group-hover:opacity-100 group-hover:w-full group-hover:h-full w-16 h-16 overflow-hidden transition-all rounded-md"

  const createImageElement = (image: ImageSource, className: string) => {
    const imgElement = (
      <img alt={image.alt} src={image.src || "/placeholder.svg"} className="h-full w-full object-cover" />
    )

    return image.link ? (
      <a
        href={image.link}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {imgElement}
      </a>
    ) : (
      imgElement
    )
  }

  return (
    <div className="group relative h-fit w-fit overflow-visible py-8">
      <h1 className="text-7xl font-black text-foreground transition-all duration-500 group-hover:opacity-40">{text}</h1>
      <div className={container}>
        <div className={effect}>{createImageElement(images[1], effect)}</div>
      </div>
      <div
        className={cn(
          container,
          "translate-x-0 translate-y-0 rotate-0 transition-all delay-150 duration-500 group-hover:translate-x-6 group-hover:translate-y-6 group-hover:rotate-12",
        )}
      >
        <div className={cn(effect, "duration-200")}>{createImageElement(images[0], cn(effect, "duration-200"))}</div>
      </div>
    </div>
  )
}

interface RevealImageListProps {
  items?: ShowImageListItemProps[]
  title?: string
  className?: string
}

function RevealImageList({ items, title = "Our services", className }: RevealImageListProps) {
  const defaultItems: ShowImageListItemProps[] = [
    {
      text: "Branding",
      images: [
        {
          src: "https://images.unsplash.com/photo-1512295767273-ac109ac3acfa?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
          alt: "Image 1",
        },
        {
          src: "https://images.unsplash.com/photo-1567262439850-1d4dc1fefdd0?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
          alt: "Image 2",
        },
      ],
    },
    {
      text: "Web design",
      images: [
        {
          src: "https://images.unsplash.com/photo-1587440871875-191322ee64b0?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
          alt: "Image 1",
        },
        {
          src: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
          alt: "Image 2",
        },
      ],
    },
    {
      text: "Illustration",
      images: [
        {
          src: "https://images.unsplash.com/photo-1575995872537-3793d29d972c?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
          alt: "Image 1",
        },
        {
          src: "https://images.unsplash.com/photo-1579762715118-a6f1d4b934f1?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
          alt: "Image 2",
        },
      ],
    },
  ]

  const displayItems = items || defaultItems

  return (
    <div className={cn("flex flex-col gap-1 rounded-sm bg-background px-8 py-4", className)}>
      <h3 className="text-sm font-black uppercase text-muted-foreground">{title}</h3>
      {displayItems.map((item, index) => (
        <RevealImageListItem key={index} text={item.text} images={item.images} />
      ))}
    </div>
  )
}

export { RevealImageList }
