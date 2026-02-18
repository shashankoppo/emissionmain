import { useState, useEffect } from 'react';
import api from '../lib/api';
import { X, Upload, Plus, Trash2, Tag, Shirt, Palette } from 'lucide-react';

interface Product {
  id?: string;
  name: string;
  slug: string;
  category: string;
  subcategory: string;
  description: string;
  shortDescription: string;
  price: number;
  wholesalePrice: number;
  retailPrice: number;
  images: string[];
  features: string[];
  specifications: Record<string, string>;
  inStock: boolean;
  moq: number;
  availableSizes: string[];
  availableColors: string[];
  allowsEmbroidery: boolean;
  gstPercentage: number;
  shippingIncluded: boolean;
}

interface ProductFormProps {
  product: any | null;
  onClose: () => void;
}

const COMMON_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL'];
const COMMON_COLORS = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Navy', hex: '#001F3F' },
  { name: 'Red', hex: '#FF4136' },
  { name: 'Royal Blue', hex: '#0074D9' },
  { name: 'Green', hex: '#2ECC40' },
  { name: 'Grey', hex: '#AAAAAA' },
  { name: 'Maroon', hex: '#85144b' },
  { name: 'Yellow', hex: '#FFDC00' },
  { name: 'Orange', hex: '#FF851B' },
  { name: 'Pink', hex: '#FF69B4' },
  { name: 'Sky Blue', hex: '#87CEEB' },
];

const SUBCATEGORIES: Record<string, string[]> = {
  sportswear: ['T-Shirts', 'Tracksuits', 'Jerseys', 'Shorts', 'Track Pants', 'Sports Bras', 'Polo Shirts'],
  medicalwear: ['Scrubs', 'Lab Coats', 'Hospital Uniforms', 'PPE Clothing', 'Surgical Gowns', 'Aprons'],
};

export default function ProductForm({ product, onClose }: ProductFormProps) {
  const [formData, setFormData] = useState<Product>({
    name: '',
    slug: '',
    category: 'sportswear',
    subcategory: '',
    description: '',
    shortDescription: '',
    price: 0,
    wholesalePrice: 0,
    retailPrice: 0,
    images: [],
    features: [''],
    specifications: {},
    inStock: true,
    moq: 1,
    availableSizes: [],
    availableColors: [],
    allowsEmbroidery: false,
    gstPercentage: 18,
    shippingIncluded: true,
  });

  const [newSpecKey, setNewSpecKey] = useState('');
  const [newSpecValue, setNewSpecValue] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'pricing' | 'media' | 'details' | 'variants'>('basic');
  const [customColor, setCustomColor] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        images: typeof product.images === 'string' ? JSON.parse(product.images) : product.images || [],
        features: typeof product.features === 'string' ? JSON.parse(product.features) : product.features || [''],
        specifications: typeof product.specifications === 'string' ? JSON.parse(product.specifications) : product.specifications || {},
        availableSizes: typeof product.availableSizes === 'string' ? JSON.parse(product.availableSizes) : product.availableSizes || [],
        availableColors: typeof product.availableColors === 'string' ? JSON.parse(product.availableColors) : product.availableColors || [],
        retailPrice: product.retailPrice || product.price || 0,
        gstPercentage: product.gstPercentage || 18,
        shippingIncluded: product.shippingIncluded !== undefined ? product.shippingIncluded : true,
        allowsEmbroidery: product.allowsEmbroidery || false,
      });
    }
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (name === 'name') {
      const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      setFormData((prev) => ({
        ...prev,
        name: value,
        slug: slug,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'number' ? parseFloat(value) || 0 : value,
      }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setUploading(true);
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);

    try {
      const response = await api.post('/upload', uploadFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, response.data.url],
      }));
    } catch (error: any) {
      console.error('Upload failed:', error);
      alert(error.response?.data?.error || 'Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData((prev) => ({ ...prev, features: newFeatures }));
  };

  const handleAddFeature = () => {
    setFormData((prev) => ({ ...prev, features: [...prev.features, ''] }));
  };

  const handleRemoveFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handleAddSpecification = () => {
    if (newSpecKey && newSpecValue) {
      setFormData((prev) => ({
        ...prev,
        specifications: { ...prev.specifications, [newSpecKey]: newSpecValue },
      }));
      setNewSpecKey('');
      setNewSpecValue('');
    }
  };

  const handleRemoveSpecification = (key: string) => {
    const newSpecs = { ...formData.specifications };
    delete newSpecs[key];
    setFormData((prev) => ({ ...prev, specifications: newSpecs }));
  };

  const toggleSize = (size: string) => {
    setFormData((prev) => ({
      ...prev,
      availableSizes: prev.availableSizes.includes(size)
        ? prev.availableSizes.filter(s => s !== size)
        : [...prev.availableSizes, size],
    }));
  };

  const toggleColor = (color: string) => {
    setFormData((prev) => ({
      ...prev,
      availableColors: prev.availableColors.includes(color)
        ? prev.availableColors.filter(c => c !== color)
        : [...prev.availableColors, color],
    }));
  };

  const addCustomColor = () => {
    if (customColor.trim() && !formData.availableColors.includes(customColor.trim())) {
      setFormData((prev) => ({
        ...prev,
        availableColors: [...prev.availableColors, customColor.trim()],
      }));
      setCustomColor('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('Please enter product name');
      return;
    }

    if (formData.images.length === 0) {
      alert('Please upload at least one image');
      return;
    }

    if (formData.price <= 0) {
      alert('Please enter a valid retail price');
      return;
    }

    const cleanedFeatures = formData.features.filter(f => f.trim() !== '');

    if (cleanedFeatures.length === 0) {
      alert('Please add at least one feature');
      return;
    }

    setSaving(true);

    try {
      const dataToSend = {
        ...formData,
        features: JSON.stringify(cleanedFeatures),
        images: JSON.stringify(formData.images),
        specifications: JSON.stringify(formData.specifications),
        availableSizes: JSON.stringify(formData.availableSizes),
        availableColors: JSON.stringify(formData.availableColors),
      };

      if (product?.id) {
        await api.put(`/products/${product.id}`, dataToSend);
      } else {
        await api.post('/products', dataToSend);
      }

      alert('Product saved successfully!');
      onClose();
    } catch (error: any) {
      console.error('Save failed:', error);
      const errorMessage = error.response?.data?.error || 'Failed to save product. Please try again.';
      alert(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'basic' as const, label: 'Basic Info', icon: Tag },
    { id: 'pricing' as const, label: 'Pricing & Stock', icon: Tag },
    { id: 'media' as const, label: 'Images', icon: Upload },
    { id: 'details' as const, label: 'Features & Specs', icon: Tag },
    { id: 'variants' as const, label: 'Sizes & Colors', icon: Shirt },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {product ? 'Edit Product' : 'Add New Product'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">Fill in the product details for your retail catalog</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 px-6">
          <div className="flex gap-1 -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition ${activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          {/* Basic Info Tab */}
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., Performance Training T-Shirt"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug (URL-friendly) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="slug"
                    required
                    value={formData.slug}
                    onChange={handleChange}
                    placeholder="Auto-generated from name"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    title="Select product category"
                    value={formData.category}
                    onChange={(e) => {
                      handleChange(e);
                      setFormData(prev => ({ ...prev, subcategory: '' }));
                    }}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="sportswear">Sportswear</option>
                    <option value="medicalwear">Medical Wear</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subcategory <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="subcategory"
                    required
                    title="Select product subcategory"
                    value={formData.subcategory}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select subcategory</option>
                    {(SUBCATEGORIES[formData.category] || []).map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short Description <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="shortDescription"
                  required
                  value={formData.shortDescription}
                  onChange={handleChange}
                  placeholder="Brief one-line description for product cards"
                  maxLength={100}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">{formData.shortDescription.length}/100 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  required
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Detailed product description for the product detail page..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Pricing & Stock Tab */}
          {activeTab === 'pricing' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-800 font-medium">💡 Retail Price is the main price shown to customers. Wholesale Price is shown for bulk orders.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Retail Price (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="599"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-semibold"
                  />
                  <p className="text-xs text-gray-500 mt-1">Primary price shown to customers</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Wholesale Price (₹)
                  </label>
                  <input
                    type="number"
                    name="wholesalePrice"
                    min="0"
                    step="0.01"
                    value={formData.wholesalePrice}
                    onChange={handleChange}
                    placeholder="399"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Shown for bulk orders ({formData.moq}+ units)</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    MOQ (Minimum Order for Wholesale)
                  </label>
                  <input
                    type="number"
                    name="moq"
                    min="1"
                    value={formData.moq}
                    onChange={handleChange}
                    placeholder="50"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Min qty for wholesale pricing</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GST Percentage
                  </label>
                  <select
                    name="gstPercentage"
                    value={formData.gstPercentage}
                    onChange={(e) => setFormData(prev => ({ ...prev, gstPercentage: parseFloat(e.target.value) }))}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="0">0% (Exempt)</option>
                    <option value="5">5%</option>
                    <option value="12">12%</option>
                    <option value="18">18%</option>
                    <option value="28">28%</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-4 border-t border-gray-200">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.inStock}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, inStock: e.target.checked }))
                    }
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">In Stock</span>
                    <p className="text-xs text-gray-500">Product is available for purchase</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.shippingIncluded}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, shippingIncluded: e.target.checked }))
                    }
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">Free Shipping</span>
                    <p className="text-xs text-gray-500">Shipping cost is included in the price</p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Images Tab */}
          {activeTab === 'media' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Product Images <span className="text-red-500">*</span>
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Upload high-quality product images. First image will be the primary/thumbnail image.
                </p>
                <div className="flex flex-wrap gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image.startsWith('http') ? image : `${api.defaults.baseURL?.replace('/api', '')}${image}`}
                        alt={`Product ${index + 1}`}
                        className="w-36 h-36 object-cover rounded-xl border-2 border-gray-200 shadow-sm"
                      />
                      <button
                        type="button"
                        title="Remove image"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      {index === 0 && (
                        <span className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                          Primary
                        </span>
                      )}
                    </div>
                  ))}
                  <label className="w-36 h-36 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                    {uploading ? (
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-xs text-gray-500 font-medium">Upload Image</span>
                        <span className="text-xs text-gray-400 mt-1">Max 5MB</span>
                      </>
                    )}
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Features & Specs Tab */}
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Features */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Product Features <span className="text-red-500">*</span>
                </h3>
                <div className="space-y-2">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                        placeholder={`Feature ${index + 1} (e.g., Moisture-wicking fabric)`}
                        className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {formData.features.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium mt-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Feature
                  </button>
                </div>
              </div>

              {/* Specifications */}
              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Specifications</h3>
                <div className="space-y-3">
                  {Object.entries(formData.specifications).map(([key, value]) => (
                    <div key={key} className="flex gap-2 items-center bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <div className="flex-1 grid grid-cols-2 gap-2">
                        <span className="font-medium text-gray-700 text-sm">{key}</span>
                        <span className="text-gray-600 text-sm">{value}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveSpecification(key)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  <div className="flex gap-2 mt-4">
                    <input
                      type="text"
                      value={newSpecKey}
                      onChange={(e) => setNewSpecKey(e.target.value)}
                      placeholder="e.g., Material"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                    <input
                      type="text"
                      value={newSpecValue}
                      onChange={(e) => setNewSpecValue(e.target.value)}
                      placeholder="e.g., 100% Cotton"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                    <button
                      type="button"
                      onClick={handleAddSpecification}
                      disabled={!newSpecKey || !newSpecValue}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Embroidery */}
              <div className="pt-6 border-t border-gray-200">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.allowsEmbroidery}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, allowsEmbroidery: e.target.checked }))
                    }
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">Allows Custom Embroidery</span>
                    <p className="text-xs text-gray-500">Customers can add custom text/logo embroidery to this product</p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Sizes & Colors Tab */}
          {activeTab === 'variants' && (
            <div className="space-y-6">
              {/* Available Sizes */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  <Shirt className="w-5 h-5 inline mr-2" />
                  Available Sizes
                </h3>
                <p className="text-sm text-gray-500 mb-4">Select all sizes this product is available in</p>
                <div className="flex flex-wrap gap-2">
                  {COMMON_SIZES.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => toggleSize(size)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition ${formData.availableSizes.includes(size)
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-400'
                        }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {formData.availableSizes.length > 0 && (
                  <p className="text-xs text-gray-500 mt-2">
                    Selected: {formData.availableSizes.join(', ')}
                  </p>
                )}
              </div>

              {/* Available Colors */}
              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  <Palette className="w-5 h-5 inline mr-2" />
                  Available Colors
                </h3>
                <p className="text-sm text-gray-500 mb-4">Select or add colors this product is available in</p>
                <div className="flex flex-wrap gap-3 mb-4">
                  {COMMON_COLORS.map((color) => (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => toggleColor(color.name)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border-2 transition ${formData.availableColors.includes(color.name)
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-gray-400'
                        }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-full border ${color.name === 'White' ? 'border-gray-300' : 'border-transparent'}`}
                        style={{ backgroundColor: color.hex }}
                      ></span>
                      <span className="text-gray-700">{color.name}</span>
                    </button>
                  ))}
                </div>
                {/* Custom Color */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customColor}
                    onChange={(e) => setCustomColor(e.target.value)}
                    placeholder="Add custom color name"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomColor())}
                  />
                  <button
                    type="button"
                    onClick={addCustomColor}
                    disabled={!customColor.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 text-sm font-medium"
                  >
                    Add Color
                  </button>
                </div>
                {formData.availableColors.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {formData.availableColors.map((color) => (
                      <span
                        key={color}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
                      >
                        {color}
                        <button
                          type="button"
                          onClick={() => toggleColor(color)}
                          className="ml-1 hover:text-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-6 mt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={saving || uploading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {saving ? 'Saving Product...' : product ? 'Update Product' : 'Create Product'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
