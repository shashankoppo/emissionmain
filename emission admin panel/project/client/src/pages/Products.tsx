import { useState, useEffect } from 'react';
import api from '../lib/api';
import { Plus, Trash2, Edit2, Search, Package, Tag, IndianRupee } from 'lucide-react';
import ProductForm from '../components/ProductForm';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  wholesalePrice: number;
  retailPrice: number | null;
  inStock: boolean;
  category: string;
  subcategory: string;
  shortDescription: string;
  images: string;
  moq: number;
  createdAt: string;
}

const API_BASE = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : '';

function getImageUrl(images: string): string {
  try {
    const parsed = typeof images === 'string' ? JSON.parse(images) : images;
    if (Array.isArray(parsed) && parsed.length > 0) {
      const img = parsed[0];
      if (img.startsWith('http')) return img;
      return `${API_BASE}${img.startsWith('/') ? '' : '/'}${img}`;
    }
  } catch { }
  return '';
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStock, setFilterStock] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts(products.filter((p) => p.id !== id));
    } catch (error) {
      alert('Failed to delete product');
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedProduct(null);
    fetchProducts();
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.subcategory.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    const matchesStock = filterStock === 'all' ||
      (filterStock === 'instock' && product.inStock) ||
      (filterStock === 'outofstock' && !product.inStock);
    return matchesSearch && matchesCategory && matchesStock;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-1">Manage your retail product catalog • {products.length} products</p>
        </div>
        <button
          onClick={() => {
            setSelectedProduct(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg transition shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      {/* Stats Strip */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 p-2 rounded-lg">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Total Products</p>
              <p className="text-xl font-bold text-gray-900">{products.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-green-50 p-2 rounded-lg">
              <Tag className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">In Stock</p>
              <p className="text-xl font-bold text-green-600">{products.filter(p => p.inStock).length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-orange-50 p-2 rounded-lg">
              <Tag className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Out of Stock</p>
              <p className="text-xl font-bold text-orange-600">{products.filter(p => !p.inStock).length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-purple-50 p-2 rounded-lg">
              <IndianRupee className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Avg. Price</p>
              <p className="text-xl font-bold text-gray-900">
                ₹{products.length > 0
                  ? Math.round(products.reduce((sum, p) => sum + p.price, 0) / products.length)
                  : 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            title="Filter by category"
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            <option value="sportswear">Sportswear</option>
            <option value="medicalwear">Medical Wear</option>
          </select>
          <select
            value={filterStock}
            onChange={(e) => setFilterStock(e.target.value)}
            title="Filter by stock status"
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="instock">In Stock</option>
            <option value="outofstock">Out of Stock</option>
          </select>
          <div className="flex items-center gap-1 border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 text-sm ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 text-sm ${viewMode === 'table' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Table
            </button>
          </div>
        </div>
      </div>

      {/* Product Grid View */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 text-lg font-medium">No products found</p>
          <p className="text-gray-400 mt-1 text-sm">Try adjusting your search or filters</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredProducts.map((product) => {
            const imageUrl = getImageUrl(product.images);
            return (
              <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group hover:shadow-lg transition-all duration-300">
                {/* Product Image */}
                <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-12 h-12 text-gray-300" />
                    </div>
                  )}
                  {/* Status Badge */}
                  <span className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full ${product.inStock
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
                    }`}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                  {/* Category Badge */}
                  <span className="absolute top-3 right-3 bg-black/70 text-white text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm">
                    {product.category === 'sportswear' ? 'Sportswear' : 'Medical Wear'}
                  </span>
                  {/* Hover Actions */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedProduct(product);
                        setShowForm(true);
                      }}
                      className="bg-white text-gray-900 p-2.5 rounded-full hover:bg-blue-50 transition shadow-lg"
                      title="Edit Product"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="bg-white text-red-600 p-2.5 rounded-full hover:bg-red-50 transition shadow-lg"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {/* Product Info */}
                <div className="p-4">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                    {product.subcategory}
                  </p>
                  <h3 className="font-semibold text-gray-900 line-clamp-1 mb-2">{product.name}</h3>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
                    {product.wholesalePrice && product.wholesalePrice < product.price && (
                      <span className="text-xs text-green-600 font-medium">Bulk: ₹{product.wholesalePrice}</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                    <span>MOQ: {product.moq}</span>
                    <span>{new Date(product.createdAt).toLocaleDateString('en-IN')}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Retail Price</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Wholesale</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">MOQ</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => {
                const imageUrl = getImageUrl(product.images);
                return (
                  <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          {imageUrl ? (
                            <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-5 h-5 text-gray-300" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.subcategory}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
                        {product.category === 'sportswear' ? 'Sportswear' : 'Medical Wear'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">₹{product.price}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">₹{product.wholesalePrice}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{product.moq}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${product.inStock
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => {
                          setSelectedProduct(product);
                          setShowForm(true);
                        }}
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 mr-3 text-sm"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {showForm && <ProductForm product={selectedProduct} onClose={handleFormClose} />}
    </div>
  );
}
