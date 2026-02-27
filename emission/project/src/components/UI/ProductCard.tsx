import { useState } from 'react';
import { Product } from '../../types';
import { Eye, Heart, Plus, Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onViewDetails: (productId: string) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (productId: string) => void;
  onAddToCart?: (productId: string, quantity: number, size?: string, color?: string) => void;
}

export default function ProductCard({
  product,
  onViewDetails,
  isWishlisted = false,
  onToggleWishlist,
  onAddToCart
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const mainImage = product.images && product.images.length > 0 ? product.images[0] : product.image;
  const hoverImage = product.images && product.images.length > 1 ? product.images[1] : mainImage;

  const currentPrice = product.retailPrice || product.price;
  const originalPrice = product.price;
  const hasDiscount = currentPrice < originalPrice;
  const discountPercentage = hasDiscount
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToCart && product.inStock) {
      // For quick add, we use first available size/color if they exist
      const defaultSize = product.availableSizes?.[0];
      const defaultColor = product.availableColors?.[0];
      onAddToCart(product.id, 1, defaultSize, defaultColor);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  return (
    <div
      className="group relative bg-white rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onViewDetails(product.id)}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] bg-gray-50 overflow-hidden">
        <img
          src={isHovered ? hoverImage : mainImage}
          alt={product.name}
          className={`w-full h-full object-cover transition-all duration-1000 ease-out ${isHovered ? 'scale-110 blur-[2px]' : 'scale-100'}`}
        />

        {/* Overlay on hover */}
        <div className={`absolute inset-0 bg-black/10 transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          {!product.inStock && (
            <span className="backdrop-blur-md bg-red-500/80 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
              Out of Stock
            </span>
          )}
          {product.inStock && hasDiscount && (
            <span className="backdrop-blur-md bg-black/80 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
              Save {discountPercentage}%
            </span>
          )}
        </div>

        {/* Quick Actions Bar */}
        <div className={`absolute top-4 right-4 flex flex-col gap-2 transition-all duration-500 transform ${isHovered ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}`}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onToggleWishlist) onToggleWishlist(product.id);
            }}
            title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
            className={`p-3 backdrop-blur-md rounded-full shadow-xl transition-all duration-300 ${isWishlisted ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-white/90 text-gray-900 hover:bg-black hover:text-white'}`}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(product.id);
            }}
            title="View Details"
            className="p-3 bg-white/90 backdrop-blur-md rounded-full text-gray-900 shadow-xl hover:bg-black hover:text-white transition-all duration-300"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom Add to Cart Button */}
        <div className={`absolute bottom-6 left-6 right-6 transition-all duration-500 transform ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          {product.inStock ? (
            <button
              onClick={handleAddToCart}
              className={`w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-2xl transition-all duration-300 transform active:scale-95 ${addedToCart
                ? 'bg-green-500 text-white'
                : 'bg-white text-black hover:bg-black hover:text-white'
                }`}
            >
              {addedToCart ? (
                <>Added Successfully ✓</>
              ) : (
                <>
                  <Plus className="w-4 h-4" /> Quick Add
                </>
              )}
            </button>
          ) : (
            <button
              className="w-full py-4 rounded-2xl font-bold text-sm bg-gray-900/50 backdrop-blur-md text-white/50 cursor-not-allowed uppercase tracking-widest"
              disabled
            >
              Unavailable
            </button>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-6 transition-colors duration-300">
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">
              {product.category === 'sportswear' ? 'Performance' : 'Medical Grade'}
            </p>
            <h3 className="font-bold text-lg text-black line-clamp-1 transition-colors group-hover:text-blue-600">
              {product.name}
            </h3>
          </div>
          <div className="flex items-center gap-1 bg-yellow-400/10 px-2 py-1 rounded-lg">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-[10px] font-bold text-black">4.9</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black text-black">
              ₹{currentPrice.toLocaleString()}
            </span>
            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through font-medium">
                ₹{originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          <div className="flex -space-x-1">
            {product.availableColors?.slice(0, 3).map((color, idx) => (
              <div
                key={idx}
                className="w-3 h-3 rounded-full border border-white"
                style={{ backgroundColor: color.toLowerCase() }}
              />
            ))}
            {product.availableColors && product.availableColors.length > 3 && (
              <span className="text-[8px] font-bold text-gray-400 pl-2">+{product.availableColors.length - 3}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
