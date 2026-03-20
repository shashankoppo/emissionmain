import { useState, useEffect } from 'react';
import { PageType } from '../types';
import { SlidersHorizontal, Search, X, ChevronRight, LayoutGrid, List } from 'lucide-react';
import { productAPI, Product, bannerAPI, Banner } from '../lib/api';
import ProductCard from '../components/UI/ProductCard';
import SEO from '../components/UI/SEO';

interface ProductsProps {
  onNavigate: (page: PageType, productId?: string) => void;
  selectedCategory?: string;
  onAddToCart?: (productId: string, quantity: number, size?: string, color?: string) => void;
  wishlist: string[];
  onToggleWishlist: (productId: string) => void;
}

const categories = [
  {
    id: 'sportswear',
    name: 'Sportswear',
    subcategories: ['T-Shirts', 'Tracksuits', 'Jerseys', 'Shorts', 'Hoodies', 'Track Pants']
  },
  {
    id: 'medicalwear',
    name: 'Medical Wear',
    subcategories: ['Scrubs', 'Lab Coats', 'Hospital Uniforms', 'PPE Clothing', 'Surgical Wear']
  }
];

export default function Products({ onNavigate, selectedCategory, onAddToCart, wishlist, onToggleWishlist }: ProductsProps) {
  const [activeCategory, setActiveCategory] = useState(selectedCategory || 'all');
  const [activeSubcategory, setActiveSubcategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('default');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentBanner, setCurrentBanner] = useState(0);
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    fetchProducts(page);
  }, [page, activeCategory, activeSubcategory]);

  useEffect(() => {
    if (selectedCategory) {
      setActiveCategory(selectedCategory);
      setActiveSubcategory('all');
      setPage(1);
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetchBanners();
    setCurrentBanner(0);
  }, [activeCategory]);

  useEffect(() => {
    if (banners.length > 1) {
      const timer = setInterval(() => {
        setCurrentBanner(prev => (prev + 1) % banners.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [banners.length]);

  const fetchBanners = async () => {
    try {
      const data = await bannerAPI.getAll(activeCategory);
      setBanners(data);
    } catch (err) {
      console.error('Failed to fetch banners:', err);
    }
  };

  const fetchProducts = async (pageNum = 1) => {
    try {
      setLoading(true);
      const result = await productAPI.getAll({ 
        page: pageNum, 
        limit: 12, 
        category: activeCategory === 'all' ? undefined : activeCategory,
        // subcategory: activeSubcategory === 'all' ? undefined : activeSubcategory // Add if API supports
      });
      
      if ('data' in result) {
        setProducts(result.data);
        setTotalPages(result.pagination.pages);
        setTotalProducts(result.pagination.total);
      } else {
        setProducts(result);
        setTotalPages(1);
        setTotalProducts(result.length);
      }
      setError(null);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Local sorting (we still keep this for the current page)
  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'price-low') {
      return (Number(a.retailPrice) || Number(a.price)) - (Number(b.retailPrice) || Number(b.price));
    } else if (sortBy === 'price-high') {
      return (Number(b.retailPrice) || Number(b.price)) - (Number(a.retailPrice) || Number(a.price));
    } else if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    }
    return 0;
  });

  const currentCategory = categories.find((cat) => cat.id === activeCategory);
  const subcategories = currentCategory?.subcategories || [];

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="relative w-20 h-20 mb-4">
            <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-black rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="text-gray-500 font-medium tracking-widest uppercase text-xs">Curating Collection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      <SEO
        title={`${activeCategory === 'all' ? 'All Products' : activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Collection | EMISSION`}
        description={`Explore our premium collection of ${activeCategory === 'all' ? 'sportswear and medical wear' : activeCategory}. High-quality manufacturing from Jabalpur.`}
      />
      {/* Search & Hero Bar */}
      <div className="bg-black text-white relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-50 bg-cover bg-center transition-all duration-1000"
          style={{ backgroundImage: `url(${banners.length > 0 ? banners[currentBanner].imageUrl : 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80'})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-4 mb-6">
              <span className="h-[2px] w-12 bg-blue-600"></span>
              <span className="text-xs font-black uppercase tracking-[0.3em] text-blue-500">Official Catalog</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
              {activeCategory === 'all' ? 'THE COLLECTION' : activeCategory.toUpperCase()}
            </h1>
            <p className="text-xl text-gray-300 font-medium mb-10 leading-relaxed uppercase tracking-wide">
              Explore our range of premium {activeCategory === 'all' ? 'sportswear and medical wear' : activeCategory} manufactured for performance and durability.
            </p>

            <form onSubmit={(e) => { e.preventDefault(); setPage(1); fetchProducts(1); }} className="relative group max-w-2xl">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-500 group-focus-within:text-white transition-colors" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl py-6 pl-16 pr-6 text-lg focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all placeholder:text-gray-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => { setSearchQuery(''); setPage(1); fetchProducts(1); }}
                  title="Clear Search"
                  className="absolute right-6 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full transition"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </form>
          </div>
        </div>

        {/* Carousel Dots */}
        {banners.length > 1 && (
          <div className="absolute bottom-10 right-10 flex gap-2 z-20">
            {banners.map((_, i) => (
              <button
                key={i}
                title={`Slide ${i + 1}`}
                onClick={() => setCurrentBanner(i)}
                className={`h-1 rounded-full transition-all duration-500 ${currentBanner === i ? 'w-8 bg-blue-500' : 'w-2 bg-white/20 hover:bg-white/40'}`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 mb-20">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12">
          {/* Sidebar */}
          <aside className="lg:col-span-3">
            <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-[0_30px_60px_rgba(0,0,0,0.05)] sticky top-24">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-sm font-black tracking-[0.2em] text-black">FILTERS</h2>
                <SlidersHorizontal className="w-4 h-4 text-gray-400" />
              </div>

              <div className="space-y-10">
                {/* Category Filter */}
                <div>
                  <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-4">Categories</h3>
                  <div className="space-y-1">
                    <button
                      onClick={() => { setActiveCategory('all'); setActiveSubcategory('all'); setPage(1); }}
                      title="Select All Products"
                      className={`flex items-center justify-between w-full px-4 py-3.5 rounded-2xl transition-all group ${activeCategory === 'all' ? 'bg-black text-white shadow-xl shadow-black/20' : 'hover:bg-gray-50 text-gray-600'}`}
                    >
                      <span className="text-sm font-bold">All Products</span>
                      <ChevronRight className={`w-4 h-4 transition-transform ${activeCategory === 'all' ? 'translate-x-1' : 'opacity-0 group-hover:opacity-100'}`} />
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => { setActiveCategory(cat.id); setActiveSubcategory('all'); setPage(1); }}
                        title={`Select ${cat.name}`}
                        className={`flex items-center justify-between w-full px-4 py-3.5 rounded-2xl transition-all group ${activeCategory === cat.id ? 'bg-black text-white shadow-xl shadow-black/20' : 'hover:bg-gray-50 text-gray-600'}`}
                      >
                        <span className="text-sm font-bold">{cat.name}</span>
                        <ChevronRight className={`w-4 h-4 transition-transform ${activeCategory === cat.id ? 'translate-x-1' : 'opacity-0 group-hover:opacity-100'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Subcategory Filter */}
                {subcategories.length > 0 && activeCategory !== 'all' && (
                  <div className="pt-8 border-t border-gray-50 animate-in fade-in slide-in-from-top-4 duration-500">
                    <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-4">Product Type</h3>
                    <div className="space-y-1">
                      <button
                        onClick={() => { setActiveSubcategory('all'); setPage(1); }}
                        className={`text-sm font-bold w-full text-left px-4 py-2.5 rounded-xl transition-colors ${activeSubcategory === 'all' ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:text-black hover:bg-gray-50'}`}
                      >
                        All {activeCategory === 'sportswear' ? 'Sportswear' : 'Medical Wear'}
                      </button>
                      {subcategories.map((subcat) => (
                        <button
                          key={subcat}
                          onClick={() => { setActiveSubcategory(subcat); setPage(1); }}
                          className={`text-sm font-bold w-full text-left px-4 py-2.5 rounded-xl transition-colors ${activeSubcategory === subcat ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:text-black hover:bg-gray-50'}`}
                        >
                          {subcat}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bulk Widget */}
                <div className="p-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-[28px] text-white shadow-2xl shadow-blue-500/20 relative overflow-hidden group">
                  <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                  <h4 className="font-black text-xl mb-2 relative z-10">Bulk Orders?</h4>
                  <p className="text-blue-100 text-xs mb-8 opacity-80 leading-relaxed relative z-10">Institutional requirements and custom manufacturing available.</p>
                  <button
                    onClick={() => onNavigate('contact')}
                    className="w-full bg-white text-blue-700 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:shadow-xl transition-all relative z-10 active:scale-95"
                  >
                    Request Quote
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Grid */}
          <main className="lg:col-span-9 pt-10">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-12 bg-white p-4 rounded-[28px] border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)]">
              <div className="flex items-center gap-6">
                <div className="flex bg-gray-50 rounded-2xl p-1.5 border border-gray-100">
                  <button
                    onClick={() => setViewMode('grid')}
                    title="Grid View"
                    className={`p-2.5 rounded-xl transition-all active:scale-90 ${viewMode === 'grid' ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    title="List View"
                    className={`p-2.5 rounded-xl transition-all active:scale-90 ${viewMode === 'list' ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
                <div className="h-8 w-[1px] bg-gray-100"></div>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
                  <span className="text-black">{totalProducts}</span> Collected
                </p>
              </div>

              <div className="flex items-center gap-4 pr-4">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  title="Sort by preference"
                  className="bg-transparent text-sm font-black text-black focus:outline-none cursor-pointer appearance-none pr-6 bg-[url('https://api.iconify.design/heroicons:chevron-down.svg')] bg-[length:12px] bg-[right_center] bg-no-repeat"
                >
                  <option value="default">New Arrivals</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">A - Z</option>
                </select>
              </div>
            </div>

            {/* Grid */}
            {error ? (
              <div className="text-center py-20">
                <p className="text-red-500 font-bold mb-4">{error}</p>
                <button onClick={() => fetchProducts(page)} className="bg-black text-white px-8 py-3 rounded-xl uppercase text-xs font-black tracking-widest">Retry</button>
              </div>
            ) : products.length === 0 && !loading ? (
              <div className="bg-white rounded-[40px] border-2 border-dashed border-gray-100 p-24 text-center">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                  <Search className="w-8 h-8 text-gray-200" />
                </div>
                <h3 className="text-3xl font-black text-black mb-4 tracking-tight">Nothing found</h3>
                <p className="text-gray-400 max-w-sm mx-auto leading-relaxed">We couldn't find any products matching your specific selection.</p>
                <button
                  onClick={() => { setSearchQuery(''); setActiveCategory('all'); setPage(1); }}
                  className="mt-10 px-8 py-4 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-gray-800 transition shadow-xl shadow-black/10"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className={`grid gap-10 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                  {sortedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onViewDetails={(id) => onNavigate('product-detail', id)}
                      isWishlisted={wishlist.includes(product.id)}
                      onToggleWishlist={onToggleWishlist}
                      onAddToCart={onAddToCart}
                    />
                  ))}
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-20 flex items-center justify-center gap-4">
                    <button
                      onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 400, behavior: 'smooth' }); }}
                      disabled={page === 1}
                      className="px-8 py-4 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:bg-black hover:text-white transition disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-black"
                    >
                      Previous
                    </button>
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                      Page <span className="text-black">{page}</span> of {totalPages}
                    </span>
                    <button
                      onClick={() => { setPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 400, behavior: 'smooth' }); }}
                      disabled={page === totalPages}
                      className="px-8 py-4 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:bg-black hover:text-white transition disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-black"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
