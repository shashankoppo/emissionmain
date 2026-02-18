import { useState, useEffect } from 'react';
import { Filter, SlidersHorizontal } from 'lucide-react';
import { PageType } from '../types';
import { productAPI, Product } from '../lib/api';
import ProductCard from '../components/UI/ProductCard';

interface ProductsProps {
  onNavigate: (page: PageType, productId?: string) => void;
  selectedCategory?: string;
  onAddToCart?: (productId: string, quantity: number) => void;
}

const categories = [
  {
    id: 'sportswear',
    name: 'Sportswear',
    subcategories: ['T-Shirts', 'Tracksuits', 'Jerseys', 'Shorts']
  },
  {
    id: 'medicalwear',
    name: 'Medical Wear',
    subcategories: ['Scrubs', 'Lab Coats', 'Hospital Uniforms', 'PPE Clothing']
  }
];

export default function Products({ onNavigate, selectedCategory, onAddToCart }: ProductsProps) {
  const [activeCategory, setActiveCategory] = useState(selectedCategory || 'all');
  const [activeSubcategory, setActiveSubcategory] = useState('all');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('default');
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      setActiveCategory(selectedCategory);
      setActiveSubcategory('all');
    }
  }, [selectedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productAPI.getAll();
      setProducts(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  let filteredProducts = products.filter((product) => {
    if (activeCategory === 'all') return true;
    if (activeCategory !== product.category) return false;
    if (activeSubcategory === 'all') return true;
    return product.subcategory === activeSubcategory;
  });

  // Sort products
  if (sortBy === 'price-low') {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  } else if (sortBy === 'name') {
    filteredProducts = [...filteredProducts].sort((a, b) => a.name.localeCompare(b.name));
  }

  const currentCategory = categories.find((cat) => cat.id === activeCategory);
  const subcategories = currentCategory?.subcategories || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchProducts}
            className="bg-black text-white px-6 py-2 rounded-xl hover:bg-gray-800 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            <button onClick={() => onNavigate('home')} className="hover:text-black transition">Home</button>
            <span>/</span>
            <span className="text-black font-medium">Shop</span>
          </div>
          <h1 className="text-4xl font-bold text-black mb-2">
            {activeCategory === 'all'
              ? 'All Products'
              : activeCategory === 'sportswear'
                ? 'Sportswear'
                : 'Medical Wear'}
          </h1>
          <p className="text-lg text-gray-600">
            Premium quality products at the best prices — buy retail or in bulk.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Filter Sidebar */}
          <aside className={`${showMobileFilter ? 'block' : 'hidden'} lg:block mb-8 lg:mb-0`}>
            <div className="bg-white border border-gray-200 rounded-2xl p-6 sticky top-20">
              <div className="flex items-center space-x-2 mb-6">
                <Filter className="w-5 h-5" />
                <h2 className="font-bold text-black">Filters</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-black mb-3">Category</h3>
                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        setActiveCategory('all');
                        setActiveSubcategory('all');
                      }}
                      className={`block w-full text-left px-4 py-2.5 text-sm rounded-xl transition-all ${activeCategory === 'all'
                        ? 'bg-black text-white font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                      All Products
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => {
                          setActiveCategory(category.id);
                          setActiveSubcategory('all');
                        }}
                        className={`block w-full text-left px-4 py-2.5 text-sm rounded-xl transition-all ${activeCategory === category.id
                          ? 'bg-black text-white font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                          }`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>

                {subcategories.length > 0 && activeCategory !== 'all' && (
                  <div>
                    <h3 className="text-sm font-bold text-black mb-3">Type</h3>
                    <div className="space-y-1">
                      <button
                        onClick={() => setActiveSubcategory('all')}
                        className={`block w-full text-left px-4 py-2.5 text-sm rounded-xl transition-all ${activeSubcategory === 'all'
                          ? 'bg-gray-200 text-black font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                          }`}
                      >
                        All {currentCategory?.name}
                      </button>
                      {subcategories.map((subcat) => (
                        <button
                          key={subcat}
                          onClick={() => setActiveSubcategory(subcat)}
                          className={`block w-full text-left px-4 py-2.5 text-sm rounded-xl transition-all ${activeSubcategory === subcat
                            ? 'bg-gray-200 text-black font-medium'
                            : 'text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                          {subcat}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-6 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-3">Need a large order?</p>
                  <button
                    onClick={() => onNavigate('contact')}
                    className="w-full bg-gray-900 text-white px-4 py-3 text-sm font-semibold rounded-xl hover:bg-black transition-colors"
                  >
                    Request Bulk Quote
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="lg:col-span-3">
            {/* Toolbar */}
            <div className="mb-6 flex flex-wrap justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowMobileFilter(!showMobileFilter)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 transition"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                </button>
                <p className="text-sm text-gray-600">
                  Showing <span className="font-semibold text-black">{filteredProducts.length}</span> {filteredProducts.length === 1 ? 'product' : 'products'}
                </p>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                title="Sort products"
                className="px-4 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-black focus:border-transparent"
              >
                <option value="default">Sort: Default</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="bg-gray-50 rounded-2xl border border-gray-200 p-12 text-center">
                <p className="text-gray-600 text-lg font-medium">No products found in this category.</p>
                <p className="text-gray-400 mt-2 text-sm">Try selecting a different category or subcategory.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onViewDetails={(id) => onNavigate('product-detail', id)}
                    onEnquire={(id) => onNavigate('contact', id)}
                    onAddToCart={onAddToCart}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* SEO Content */}
      <section className="py-12 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-8 border border-gray-100">
            <h2 className="text-lg font-bold text-black mb-3">
              Buy Quality Sportswear & Medical Wear Online
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Shop premium sportswear and medical wear at Emission. We offer a wide range of performance
              t-shirts, tracksuits, jerseys, shorts, medical scrubs, lab coats, hospital uniforms, and PPE clothing.
              All products are manufactured in our ISO certified facility in Jabalpur, Madhya Pradesh.
              Enjoy free shipping across India, secure online payments, and GST compliant billing.
              Need bulk orders? Contact us for special wholesale pricing.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
