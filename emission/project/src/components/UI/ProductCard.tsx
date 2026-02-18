import { useState } from 'react';
import { Product } from '../../types';
import { Eye, ShoppingCart, Heart, Plus } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onViewDetails: (productId: string) => void;
  onEnquire?: (productId: string) => void;
  onAddToCart?: (productId: string, quantity: number) => void;
}

export default function ProductCard({ product, onViewDetails, onEnquire, onAddToCart }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  // Handle image source
  const mainImage = product.images && product.images.length > 0 ? product.images[0] : product.image;
  const hoverImage = product.images && product.images.length > 1 ? product.images[1] : mainImage;

  // Pricing Logic
  // retailPrice is the selling price. price is MRP.
  // If retailPrice is present, we show it as current price and 'price' as strikethrough MRP.
  const currentPrice = product.retailPrice || product.price;
  const originalPrice = product.price;
  const hasDiscount = currentPrice < originalPrice;
  const discountPercentage = hasDiscount
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToCart && product.inStock) {
      onAddToCart(product.id, 1);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  return (
    <div
      className="group relative bg-white rounded-2xl overflow-hidden cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onViewDetails(product.id)}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden">
        <img
          src={isHovered ? hoverImage : mainImage}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-700 ease-in-out ${isHovered ? 'scale-110' : 'scale-100'}`}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          {!product.inStock && (
            <span className="bg-red-600 text-white text-[10px] font-bold px-3 py-1 rounded-md uppercase tracking-wider">
              Sold Out
            </span>
          )}
          {product.inStock && hasDiscount && (
            <span className="bg-black text-white text-[10px] font-bold px-3 py-1 rounded-md uppercase tracking-wider">
              -{discountPercentage}%
            </span>
          )}
          {product.inStock && !hasDiscount && (Math.random() > 0.7) && (
            <span className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-md uppercase tracking-wider">
              New Arrival
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onEnquire) onEnquire(product.id);
          }}
          className="absolute top-3 right-3 p-2 bg-white rounded-full text-gray-900 shadow-md hover:bg-gray-100 transition-transform hover:scale-110 z-10"
        >
          <Heart className="w-4 h-4" />
        </button>

        {/* Hover Actions */}
        <div className={`absolute bottom-4 left-4 right-4 transition-all duration-300 transform ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          {product.inStock ? (
            <button
              onClick={handleAddToCart}
              className={`w-full py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 shadow-xl transition-colors ${addedToCart ? 'bg-green-600 text-white' : 'bg-white text-black hover:bg-gray-100'
                }`}
            >
              {addedToCart ? (
                <>Added to Cart ✓</>
              ) : (
                <>
                  <Plus className="w-4 h-4" /> Quick Add
                </>
              )}
            </button>
          ) : (
            <button
              className="w-full py-3 rounded-lg font-bold text-sm bg-gray-800 text-white cursor-not-allowed opacity-80"
            >
              Out of Stock
            </button>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="pt-4 px-1 pb-2">
        <h3 className="font-bold text-base text-black mb-1 line-clamp-1 group-hover:text-gray-600 transition-colors">
          {product.name}
        </h3>

        <p className="text-xs text-gray-500 mb-2">{product.category === 'sportswear' ? 'Sportswear' : 'Medical Wear'} • {product.subcategory}</p>

        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-black">
            ₹{currentPrice.toLocaleString()}
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through decoration-gray-400">
              ₹{originalPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
