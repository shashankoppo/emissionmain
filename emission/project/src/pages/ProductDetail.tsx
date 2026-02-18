import { useState, useEffect } from 'react';
import { Check, Package, Truck, Shield, FileText, ShoppingCart, Heart, Star, Minus, Plus, ChevronDown, ChevronUp, Ruler } from 'lucide-react';
import { PageType } from '../types';
import { productAPI, Product } from '../lib/api';
import Button from '../components/UI/Button';
import ProductCard from '../components/UI/ProductCard';
import SizeChart from '../components/UI/SizeChart';
import PincodeChecker from '../components/UI/PincodeChecker';

interface ProductDetailProps {
  productId: string;
  onNavigate: (page: PageType, productId?: string) => void;
  onAddToCart?: (productId: string, quantity: number) => void;
}

export default function ProductDetail({ productId, onNavigate, onAddToCart }: ProductDetailProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  // New States
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>('desc');

  useEffect(() => {
    fetchProduct();
    setQuantity(1);
    setAddedToCart(false);
    setSelectedSize('');
    setSelectedColor('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const data = await productAPI.getById(productId);
      setProduct(data);

      // select first color and size if available
      if (data.availableSizes?.length > 0) setSelectedSize(data.availableSizes[0]);
      if (data.availableColors?.length > 0) setSelectedColor(data.availableColors[0]);

      const allProducts = await productAPI.getAll();
      const related = allProducts
        .filter((p) => p.category === data.category && p.id !== data.id)
        .slice(0, 4);
      setRelatedProducts(related);

      setError(null);
    } catch (err) {
      console.error('Failed to fetch product:', err);
      setError('Failed to load product details.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (onAddToCart && product) {
      onAddToCart(product.id, quantity);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 3000);
    }
  };

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-black"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center flex-col gap-4">
        <h2 className="text-2xl font-bold text-black">Product Not Found</h2>
        <Button onClick={() => onNavigate('products')} variant="primary">Back to Shop</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-32 lg:pb-0">
      <SizeChart
        isOpen={isSizeChartOpen}
        onClose={() => setIsSizeChartOpen(false)}
        category={product.category}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6 overflow-x-auto whitespace-nowrap pb-2">
          <button onClick={() => onNavigate('home')} className="hover:text-black transition">Home</button>
          <span>/</span>
          <button onClick={() => onNavigate('products')} className="hover:text-black transition">Products</button>
          <span>/</span>
          <button onClick={() => onNavigate('products', product.category)} className="hover:text-black transition capitalize">
            {product.category === 'sportswear' ? 'Sportswear' : 'Medical Wear'}
          </button>
          <span>/</span>
          <span className="text-black font-medium text-ellipsis overflow-hidden max-w-[150px]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          {/* Images (Left Column - 7/12) */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Main Image */}
              <div className="md:col-span-2 aspect-[4/5] bg-gray-50 rounded-2xl overflow-hidden cursor-zoom-in">
                <img
                  src={product.images && product.images.length > 0 ? product.images[selectedImage] : product.image}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                />
              </div>
              {/* Additional Images Grid */}
              {product.images && product.images.map((img, idx) => (
                <div
                  key={idx}
                  className={`aspect-[4/5] bg-gray-50 rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${selectedImage === idx ? 'border-black' : 'border-transparent hover:border-gray-200'}`}
                  onClick={() => setSelectedImage(idx)}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info (Right Column - 5/12) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 h-fit">
            <div className="mb-2">
              <span className="text-xs font-bold tracking-widest uppercase text-blue-600">
                {product.category === 'sportswear' ? 'Performance Series' : 'Medical Grade'}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 leading-tight">{product.name}</h1>

            <div className="flex items-center gap-2 mb-6">
              <div className="flex text-yellow-400">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <span className="text-sm text-gray-500 underline decoration-gray-300 underline-offset-4 decoration-1 hover:text-black cursor-pointer">42 Reviews</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-black">
                ₹{(product.retailPrice || product.price).toLocaleString('en-IN')}
              </span>
              {product.retailPrice && product.retailPrice < product.price && (
                <span className="text-lg text-gray-400 line-through">₹{product.price.toLocaleString('en-IN')}</span>
              )}
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md uppercase">
                Free Shipping
              </span>
            </div>

            <PincodeChecker />

            {/* Color Selector */}
            {product.availableColors && product.availableColors.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-bold text-black mb-3">Color: <span className="text-gray-500 font-normal capitalize">{selectedColor}</span></p>
                <div className="flex flex-wrap gap-3">
                  {product.availableColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${selectedColor === color ? 'border-black ring-2 ring-offset-2 ring-black/20 scale-110' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      title={color}
                      style={{ backgroundColor: color.toLowerCase() }}
                    >
                      {selectedColor === color && <Check className={`w-4 h-4 ${['white', 'yellow', 'cream'].includes(color.toLowerCase()) ? 'text-black' : 'text-white'}`} />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            {product.availableSizes && product.availableSizes.length > 0 && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <p className="text-sm font-bold text-black">Size: <span className="text-gray-500 font-normal">{selectedSize}</span></p>
                  <button
                    onClick={() => setIsSizeChartOpen(true)}
                    className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-black underline transition"
                  >
                    <Ruler className="w-3 h-3" /> Size Guide
                  </button>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {product.availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 rounded-lg text-sm font-medium border transition-all ${selectedSize === size
                          ? 'border-black bg-black text-white shadow-lg'
                          : 'border-gray-200 text-gray-900 hover:border-black'
                        }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            {product.inStock ? (
              <div className="space-y-4">
                {/* Quantity & Add to Cart Container */}
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Qty */}
                  <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden w-full sm:w-auto self-start">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-3 hover:bg-gray-100 transition"><Minus className="w-4 h-4" /></button>
                    <span className="px-4 py-3 font-semibold text-black min-w-[3rem] text-center border-x border-gray-300">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-3 hover:bg-gray-100 transition"><Plus className="w-4 h-4" /></button>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={handleAddToCart}
                    className={`flex-1 py-3.5 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0 ${addedToCart ? 'bg-green-600 text-white' : 'bg-black text-white'
                      }`}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {addedToCart ? 'Added to Cart' : 'Add to Cart'}
                  </button>

                  {/* Wishlist */}
                  <button
                    onClick={() => onNavigate('contact', product.id)}
                    className="p-3.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition"
                  >
                    <Heart className="w-5 h-5 text-gray-900" />
                  </button>
                </div>

                <p className="text-xs text-gray-500 text-center">
                  Make 3 interest-free payments of ₹{Math.round((product.retailPrice || product.price) / 3).toLocaleString()} with
                  <span className="font-bold text-black mx-1">Snapmint</span> or
                  <span className="font-bold text-black mx-1">Simpl</span>.
                </p>
              </div>
            ) : (
              <div className="bg-gray-100 rounded-xl p-4 text-center">
                <p className="font-bold text-gray-900 mb-2">Sold Out</p>
                <button
                  onClick={() => onNavigate('contact')}
                  className="text-sm text-blue-600 hover:underline font-medium"
                >
                  Notify me when available
                </button>
              </div>
            )}

            {/* Accordions */}
            <div className="mt-10 border-t border-gray-200">
              {/* Description */}
              <div className="border-b border-gray-200">
                <button
                  onClick={() => toggleAccordion('desc')}
                  className="w-full py-4 flex items-center justify-between text-left font-bold text-black hover:text-gray-600 transition"
                >
                  Description
                  {openAccordion === 'desc' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openAccordion === 'desc' ? 'max-h-96 pb-4' : 'max-h-0'}`}>
                  <p className="text-gray-600 leading-relaxed text-sm">{product.description}</p>
                </div>
              </div>

              {/* Features */}
              <div className="border-b border-gray-200">
                <button
                  onClick={() => toggleAccordion('features')}
                  className="w-full py-4 flex items-center justify-between text-left font-bold text-black hover:text-gray-600 transition"
                >
                  Key Features
                  {openAccordion === 'features' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openAccordion === 'features' ? 'max-h-96 pb-4' : 'max-h-0'}`}>
                  <ul className="space-y-2">
                    {product.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Specs */}
              <div className="border-b border-gray-200">
                <button
                  onClick={() => toggleAccordion('specs')}
                  className="w-full py-4 flex items-center justify-between text-left font-bold text-black hover:text-gray-600 transition"
                >
                  Specifications
                  {openAccordion === 'specs' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openAccordion === 'specs' ? 'max-h-96 pb-4' : 'max-h-0'}`}>
                  <dl className="space-y-2 text-sm">
                    {Object.entries(product.specifications).map(([k, v]) => (
                      <div key={k} className="flex justify-between border-b border-dashed border-gray-100 pb-1">
                        <dt className="text-gray-500">{k}</dt>
                        <dd className="font-medium text-gray-900">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>

              {/* Delivery & Returns */}
              <div className="border-b border-gray-200">
                <button
                  onClick={() => toggleAccordion('delivery')}
                  className="w-full py-4 flex items-center justify-between text-left font-bold text-black hover:text-gray-600 transition"
                >
                  Delivery & Returns
                  {openAccordion === 'delivery' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openAccordion === 'delivery' ? 'max-h-96 pb-4' : 'max-h-0'}`}>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Shipping:</strong> All orders are shipped via express delivery. Estimated delivery in 3-5 business days.
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Returns:</strong> Easy 7-day return policy. Items must be unused and in original packaging.
                  </p>
                </div>
              </div>
            </div>

            {/* Bulk Order Banner */}
            {product.wholesalePrice && (
              <div className="mt-8 bg-black text-white p-6 rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-gray-900 transition" onClick={() => onNavigate('contact')}>
                <div>
                  <h3 className="font-bold text-lg mb-1">Buy for your Team?</h3>
                  <p className="text-gray-400 text-sm">Get upto 40% OFF on bulk orders.</p>
                </div>
                <div className="bg-white/10 p-3 rounded-full group-hover:bg-white/20 transition">
                  <Package className="w-6 h-6" />
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Similar Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 border-t border-gray-100 pt-12">
            <h2 className="text-2xl font-bold text-black mb-8">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onViewDetails={(id) => onNavigate('product-detail', id)}
                  onEnquire={(id) => onNavigate('contact', id)}
                  onAddToCart={onAddToCart}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Mobile Footer */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 p-4 z-40 flex items-center gap-3 safe-area-bottom shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div className="flex-1">
          <p className="text-xs text-gray-500 line-through">₹{product.price.toLocaleString()}</p>
          <p className="text-lg font-bold text-black">₹{product.retailPrice?.toLocaleString() || product.price.toLocaleString()}</p>
        </div>
        <button
          onClick={handleAddToCart}
          className="bg-black text-white px-8 py-3 rounded-xl font-bold flex-1"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
