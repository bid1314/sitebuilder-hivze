import { cn } from "@/lib/utils"
import { Button } from "./button"
import { Star } from "lucide-react"

interface ProductCardProps {
  imageUrl?: string
  productName?: string
  price?: number
  originalPrice?: number
  rating?: number
  className?: string
  productLink?: string
  linkTarget?: string
}

export function ProductCard({
  imageUrl = "/placeholder.svg?width=300&height=300",
  productName = "Cool Product",
  price = 99.99,
  originalPrice,
  rating = 4.5,
  className,
  productLink,
  linkTarget = "_self",
}: ProductCardProps) {
  const cardContent = (
    <div className={cn("border rounded-lg overflow-hidden shadow-sm w-full max-w-sm bg-white", className)}>
      <div className="relative">
        <img src={imageUrl || "/placeholder.svg"} alt={productName} className="w-full h-64 object-cover" />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{productName}</h3>
        <div className="flex items-center mt-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${i < Math.round(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500 ml-2">{rating.toFixed(1)}</span>
        </div>
        <div className="flex items-baseline mt-4">
          <span className="text-2xl font-bold text-gray-900">${price.toFixed(2)}</span>
          {originalPrice && (
            <span className="ml-2 text-sm text-gray-500 line-through">${originalPrice.toFixed(2)}</span>
          )}
        </div>
        <Button className="w-full mt-4">Add to Cart</Button>
      </div>
    </div>
  )

  return productLink ? (
    <a
      href={productLink}
      target={linkTarget}
      rel={linkTarget === "_blank" ? "noopener noreferrer" : undefined}
      className="block hover:opacity-90 transition-opacity"
    >
      {cardContent}
    </a>
  ) : (
    cardContent
  )
}
