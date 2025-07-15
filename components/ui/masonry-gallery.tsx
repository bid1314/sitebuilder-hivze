import { cn } from "@/lib/utils"

interface Image {
  src: string
  alt: string
  link?: string
}

interface MasonryGalleryProps {
  images?: Image[]
  columns?: number
  gap?: number
  className?: string
}

const defaultImages: Image[] = [
  { src: "https://images.unsplash.com/photo-1523599329123-483457785285?w=500", alt: "Image 1" },
  { src: "https://images.unsplash.com/photo-1500332988905-1bf1c7c33b7b?w=500", alt: "Image 2" },
  { src: "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=500", alt: "Image 3" },
  { src: "https://images.unsplash.com/photo-1495433324511-bf8e92934d90?w=500", alt: "Image 4" },
  { src: "https://images.unsplash.com/photo-1516238840748-95f7a2223553?w=500", alt: "Image 5" },
  { src: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=500", alt: "Image 6" },
]

export function MasonryGallery({ images = defaultImages, columns = 3, gap = 4, className }: MasonryGalleryProps) {
  return (
    <div
      className={cn("w-full", className)}
      style={{
        columnCount: columns,
        columnGap: `${gap * 0.25}rem`,
      }}
    >
      {images.map((image, index) => {
        const imageElement = (
          <img src={image.src || "/placeholder.svg"} alt={image.alt} className="w-full h-auto block rounded-lg" />
        )

        return (
          <div key={index} className="mb-4 break-inside-avoid">
            {image.link ? (
              <a
                href={image.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:opacity-90 transition-opacity"
              >
                {imageElement}
              </a>
            ) : (
              imageElement
            )}
          </div>
        )
      })}
    </div>
  )
}
