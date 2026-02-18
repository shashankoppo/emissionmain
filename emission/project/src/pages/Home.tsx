import { useState, useEffect } from 'react';
import { ArrowRight, Package, Shield, Truck, Star, CheckCircle, Clock, Award } from 'lucide-react';
import { PageType } from '../types';
import { productAPI, Product } from '../lib/api';
import ProductCard from '../components/UI/ProductCard';

interface HomeProps {
  onNavigate: (page: PageType, param?: string) => void;
  onAddToCart?: (productId: string, quantity: number) => void;
}

export default function Home({ onNavigate, onAddToCart }: HomeProps) {
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBestSellers();
  }, []);

  const fetchBestSellers = async () => {
    try {
      const allProducts = await productAPI.getAll();
      setBestSellers(allProducts.slice(0, 4));
    } catch (err) {
      console.error('Failed to fetch products', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    {
      id: 'sportswear',
      title: 'Performance Sportswear',
      image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&q=80',
      desc: 'Engineered for athletes',
    },
    {
      id: 'medicalwear',
      title: 'Medical Scrubs & Coats',
      image: 'https://images.unsplash.com/photo-1584982751601-97dcc096654c?auto=format&fit=crop&q=80',
      desc: 'Professional & Comfortable',
    },
    {
      id: 'custom',
      title: 'Custom Uniforms',
      image: 'https://images.unsplash.com/photo-1556906781-9a412961d289?auto=format&fit=crop&q=80',
      desc: 'Logos & Embroidery',
    },
  ];

  return (
    <div className="font-sans">
      {/* Hero Section - High Impact */}
      <div className="relative h-[85vh] bg-black overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1571731956672-f2b94d7dd0cb?auto=format&fit=crop&q=80"
            alt="Hero Background"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />
        </div>
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-3xl">
              <span className="inline-block py-1 px-3 rounded-full bg-white/10 text-white text-sm font-semibold mb-6 backdrop-blur-sm border border-white/20">
                🚀 New Collection 2026
              </span>
              <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6 animate-fade-in-up">
                Performance.<br />
                Precision.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                  Perfection.
                </span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-xl leading-relaxed">
                Premium sportswear and medical apparel engineered for professionals.
                Experience the perfect blend of comfort, durability, and style.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => onNavigate('products')}
                  className="bg-white text-black px-8 py-4 rounded-xl text-lg font-bold hover:bg-gray-100 transition-transform transform hover:scale-105 flex items-center gap-2"
                >
                  Shop Now
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onNavigate('contact')}
                  className="bg-white/10 text-white border border-white/30 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/20 transition backdrop-blur-sm"
                >
                  Bulk Orders
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-2">
            <div className="w-1 h-3 bg-white rounded-full" />
          </div>
        </div>
      </div>

      {/* Trust Badges Strip (Similar to Jogger Sports) */}
      <div className="bg-black border-t border-gray-900 py-6">
        <div className="max-w-7xl mx-auto px-4 overflow-x-auto">
          <div className="flex justify-between min-w-[600px] text-gray-400 text-sm font-medium">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-white" />
              <span>Free Shipping Across India</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-white" />
              <span>100% Secure Payments</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-white" />
              <span>Easy 7-Day Returns</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-white" />
              <span>ISO 9001:2015 Certified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Shop by Category - Visual Grid (Knya Style) */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-4">Shop by Category</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our diverse collection tailored for your specific needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => onNavigate('products', cat.id)}
                className="group relative h-[500px] rounded-3xl overflow-hidden cursor-pointer shadow-lg"
              >
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 transform transition-transform duration-500 group-hover:-translate-y-2">
                  <h3 className="text-2xl font-bold text-white mb-2">{cat.title}</h3>
                  <p className="text-gray-300 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    {cat.desc}
                  </p>
                  <button className="flex items-center gap-2 text-white font-semibold border-b border-white pb-1 group-hover:border-blue-400 transition-colors">
                    Explore Collection <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers (Jogger Sports Logic) */}
      <section className="py-20 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <span className="text-blue-600 font-bold tracking-wider text-sm uppercase mb-2 block">Top Rated</span>
              <h2 className="text-4xl font-bold text-black">Best Sellers</h2>
            </div>
            <button
              onClick={() => onNavigate('products')}
              className="text-black font-semibold border-b-2 border-black pb-1 hover:text-gray-600 hover:border-gray-600 transition"
            >
              View All Products
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center p-12">
              <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {bestSellers.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onViewDetails={(id) => onNavigate('product-detail', id)}
                  onAddToCart={onAddToCart}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us - Modern Cards */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-100 rounded-full blur-3xl opacity-50" />
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-100 rounded-full blur-3xl opacity-50" />
              <img
                src="https://images.unsplash.com/photo-1556817405-6e7c515712c6?auto=format&fit=crop&q=80"
                alt="Quality Manufacturing"
                className="relative z-10 rounded-3xl shadow-2xl w-full"
              />
              <div className="absolute -right-8 top-1/2 -translate-y-1/2 bg-white p-6 rounded-2xl shadow-xl z-20 hidden md:block">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">100%</p>
                    <p className="text-xs text-gray-500">Quality Checked</p>
                  </div>
                </div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-green-500 w-full h-full" />
                </div>
              </div>
            </div>

            <div>
              <span className="text-blue-600 font-bold tracking-wider text-sm uppercase mb-4 block">Why Emission?</span>
              <h2 className="text-4xl font-bold text-black mb-6 leading-tight">
                Crafted for durability,<br />Designed for comfort.
              </h2>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                We control the entire manufacturing process from fabric selection to final stitching.
                Our ISO-certified facility in Jabalpur ensures that every piece of clothing meets international standards.
              </p>

              <div className="space-y-6">
                {[
                  { icon: Shield, title: 'Premium Fabrics', desc: 'Moisture-wicking, anti-microbial, and durable materials.' },
                  { icon: Clock, title: 'Fast Delivery', desc: 'Dispatched within 24 hours for stock items.' },
                  { icon: Package, title: 'Direct from Factory', desc: 'No middlemen. Best prices guaranteed.' }
                ].map((feature, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-6 h-6 text-black" />
                    </div>
                    <div>
                      <h4 className="font-bold text-black mb-1">{feature.title}</h4>
                      <p className="text-sm text-gray-500">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter / CTA */}
      <section className="py-20 bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-900/30 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-900/30 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Join the Movement</h2>
          <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
            Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
          </p>

          <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-6 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm"
            />
            <button className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition">
              Subscribe
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-6">
            We assume you're not a robot. By subscribing you agree to our Terms & Conditions.
          </p>
        </div>
      </section>
    </div>
  );
}
