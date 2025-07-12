import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Coins } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Item } from "@shared/schema";

interface ProductCardProps {
  item: Item;
  onWishlistToggle?: (itemId: number, isWishlisted: boolean) => void;
  isWishlisted?: boolean;
}

export default function ProductCard({ item, onWishlistToggle, isWishlisted = false }: ProductCardProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onWishlistToggle?.(item.id, !isWishlisted);
  };

  const getConditionColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'like new':
      case 'excellent':
        return 'bg-green-500';
      case 'good':
        return 'bg-yellow-500';
      case 'fair':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow group cursor-pointer">
      <Link href={`/items/${item.id}`}>
        <div className="relative">
          {item.imageUrls && item.imageUrls.length > 0 ? (
            <img
              src={item.imageUrls[0]}
              alt={item.title}
              className={cn(
                "w-full h-48 object-cover rounded-t-lg group-hover:scale-105 transition-transform",
                !isImageLoaded && "bg-gray-200 animate-pulse"
              )}
              onLoad={() => setIsImageLoaded(true)}
            />
          ) : (
            <div className="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
              <span className="text-gray-400">No Image</span>
            </div>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleWishlistClick}
          >
            <Heart className={cn("h-4 w-4", isWishlisted ? "fill-red-500 text-red-500" : "text-gray-400")} />
          </Button>
          
          <Badge
            className={cn(
              "absolute top-2 left-2 text-white text-xs font-medium",
              getConditionColor(item.condition)
            )}
          >
            {item.condition}
          </Badge>
        </div>
        
        <CardContent className="p-4">
          <h3 className="font-semibold text-gray-900 mb-1 truncate">{item.title}</h3>
          <p className="text-sm text-gray-600 mb-2">
            {item.brand && `${item.brand} • `}Size {item.size}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Coins className="h-4 w-4 text-rewear-green" />
              <span className="rewear-green font-semibold">{item.pointsValue} pts</span>
            </div>
            
            <Button
              size="sm"
              className="bg-rewear-green text-white hover:bg-rewear-green-dark transition-colors"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // Handle swap action
              }}
            >
              Swap
            </Button>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
