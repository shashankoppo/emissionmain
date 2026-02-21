import { useState, useEffect } from 'react';
import { ArrowRight, Package, Shield, Truck, CheckCircle, Clock, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import { PageType } from '../types';
import { productAPI, Product, bannerAPI, Banner, collectionAPI, FeaturedCollection } from '../lib/api';
import ProductCard from '../components/UI/ProductCard';

interface HomeProps {
  onNavigate: (page: PageType, param?: string) => void;
  onAddToCart?: (productId: string, quantity: number) => void;
}

export default function Home({ onNavigate, onAddToCart }: HomeProps) {
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [collections, setCollections] = useState<FeaturedCollection[]>([]);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchBestSellers(), fetchBanners(), fetchCollections()]).finally(() => {
      setLoading(false);
    });
  }, []);

  const fetchCollections = async () => {
    try {
      const data = await collectionAPI.getAll();
      setCollections(data);
    } catch (err) {
      console.error('Failed to fetch collections', err);
    }
  };

  const fetchBanners = async () => {
    try {
      const data = await bannerAPI.getAll();
      setBanners(data);
    } catch (err) {
      console.error('Failed to fetch banners', err);
    }
  };

  const fetchBestSellers = async () => {
    try {
      const allProducts = await productAPI.getAll();
      setBestSellers(allProducts.slice(0, 4));
    } catch (err) {
      console.error('Failed to fetch products', err);
    }
  };

  const nextBanner = () => {
    setCurrentBanner((prev) => (prev + 1) % (banners.length || 1));
  };

  const prevBanner = () => {
    setCurrentBanner((prev) => (prev - 1 + (banners.length || 1)) % (banners.length || 1));
  };

  // Auto-slide banners
  useEffect(() => {
    if (banners.length > 1) {
      const timer = setInterval(nextBanner, 5000);
      return () => clearInterval(timer);
    }
  }, [banners.length]);

  return (
    <div className="font-sans selection:bg-black selection:text-white">
      {/* Hero Section - Dynamic Banners */}
      <div className="relative h-[90vh] bg-black overflow-hidden flex items-center">
        {banners.length > 0 ? (
          <>
            {/* Background Visual */}
            <div className="absolute inset-0 transition-all duration-1000 ease-in-out">
              <img
                src={banners[currentBanner].imageUrl}
                alt={banners[currentBanner].title || 'Hero Background'}
                className="w-full h-full object-cover opacity-60 transition-transform duration-[10s] scale-110 animate-ken-burns"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
            </div>

            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
              <div className="max-w-2xl animate-slide-up" key={currentBanner}>
                {/* Badge */}
                <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full glass-card text-white text-[10px] font-bold mb-8 uppercase tracking-widest shadow-xl">
                  <span>🚀</span>
                  <span>New Collection 2026</span>
                </div>

                {/* Headline */}
                <h1 className="text-6xl md:text-8xl font-black text-white leading-[1.1] tracking-tight mb-8">
                  {banners[currentBanner].title ? (
                    <>
                      {banners[currentBanner].title.split('.').map((line, i) => (
                        <span key={i}>
                          {line}
                          {i < banners[currentBanner].title!.split('.').length - 1 && <br />}
                        </span>
                      ))}
                    </>
                  ) : (
                    <>Performance.<br />Precision.<br /><span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">Perfection.</span></>
                  )}
                </h1>

                {/* Subtext */}
                <p className="text-white/80 text-lg md:text-xl font-medium mb-12 leading-relaxed max-w-xl">
                  {banners[currentBanner].subtitle || 'Premium sportswear and medical apparel engineered for professionals. Experience the perfect blend of comfort, durability, and style.'}
                </p>

                {/* Buttons */}
                <div className="flex flex-wrap gap-5">
                  <button
                    onClick={() => onNavigate('products')}
                    className="group bg-white text-black px-10 py-5 rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-gray-100 transition-all flex items-center gap-2 shadow-2xl"
                  >
                    Shop Now
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button
                    onClick={() => onNavigate('contact')}
                    className="bg-black/20 backdrop-blur-md border border-white/20 text-white px-10 py-5 rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all shadow-xl"
                  >
                    Bulk Orders
                  </button>
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            {banners.length > 1 && (
              <>
                <button
                  onClick={prevBanner}
                  title="Previous Banner"
                  className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full glass-card flex items-center justify-center text-white hover:bg-white hover:text-black transition-all z-20"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextBanner}
                  title="Next Banner"
                  className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full glass-card flex items-center justify-center text-white hover:bg-white hover:text-black transition-all z-20"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                {/* Dots */}
                <div className="absolute bottom-10 right-20 flex gap-3 z-20">
                  {banners.map((_, i) => (
                    <button
                      key={i}
                      title={`Go to slide ${i + 1}`}
                      onClick={() => setCurrentBanner(i)}
                      className={`h-1.5 rounded-full transition-all duration-500 ${currentBanner === i ? 'w-8 bg-blue-500' : 'w-2 bg-white/30 hover:bg-white/50'}`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          /* Fallback if no banners */
          <>
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1571731956672-f2b94d7dd0cb?auto=format&fit=crop&q=80"
                alt="Hero Background"
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
            </div>

            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
              <div className="max-w-2xl animate-slide-up">
                <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full glass-card text-white text-[10px] font-bold mb-8 uppercase tracking-widest shadow-xl">
                  <span>🚀</span>
                  <span>New Collection 2026</span>
                </div>
                <h1 className="text-6xl md:text-8xl font-black text-white leading-[1.1] tracking-tight mb-8">
                  Performance.<br />Precision.<br /><span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">Perfection.</span>
                </h1>
                <p className="text-white/80 text-lg md:text-xl font-medium mb-12 leading-relaxed max-w-xl">
                  Premium sportswear and medical apparel engineered for professionals.
                </p>
                <div className="flex flex-wrap gap-5">
                  <button onClick={() => onNavigate('products')} className="group bg-white text-black px-10 py-5 rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-gray-100 transition-all flex items-center gap-2 shadow-2xl">
                    Shop Now <ArrowRight className="w-5 h-5" />
                  </button>
                  <button onClick={() => onNavigate('contact')} className="bg-black/20 backdrop-blur-md border border-white/20 text-white px-10 py-5 rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all shadow-xl">
                    Bulk Orders
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-10">
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex p-1 justify-center">
            <div className="w-1.5 h-3 bg-white rounded-full animate-scroll-pill" />
          </div>
        </div>
      </div>

      {/* Trust Badges - Sleek Minimalist */}
      <div className="bg-black py-8 border-y border-white/5 relative z-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0">
            {[
              { icon: Truck, text: 'Pan-India Express Delivery' },
              { icon: Shield, text: 'Secure Transactions Guarantee' },
              { icon: CheckCircle, text: '7-Day Premium Returns' },
              { icon: Award, text: 'ISO 9001:2015 Precision' }
            ].map((item, idx) => (
              <div key={idx} className={`flex items-center justify-center gap-4 group ${idx !== 3 ? 'lg:border-r lg:border-white/10' : ''}`}>
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-white group-hover:rotate-[360deg] transition-all duration-700">
                  <item.icon className="w-5 h-5 text-white group-hover:text-black transition-colors" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-white transition-colors">
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Shop by Category - Ultra Modern */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-50/50 rounded-full blur-3xl -mr-96 -mt-96" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-24">
            <span className="text-blue-600 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Curated Collections</span>
            <h2 className="text-5xl md:text-7xl font-black text-black tracking-tighter uppercase leading-none">Choose Your<br />Masterpiece.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {(collections.length > 0 ? collections : [
              {
                id: 'sportswear',
                title: 'Performance Sportswear',
                imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80',
                description: 'Engineered for athletes',
                link: '/products/sportswear'
              },
              {
                id: 'medicalwear',
                title: 'Medical Scrubs & Coats',
                imageUrl: 'https://images.unsplash.com/photo-1581595221475-79d150275510?auto=format&fit=crop&q=80',
                description: 'Professional & Comfortable',
                link: '/products/medicalwear'
              },
              {
                id: 'custom',
                title: 'Custom Uniforms',
                imageUrl: 'https://images.unsplash.com/photo-1598501022238-79673b40090d?auto=format&fit=crop&q=80',
                description: 'Logos & Embroidery',
                link: '/contact'
              }
            ]).map((cat: any) => (
              <div
                key={cat.id}
                onClick={() => {
                  if (cat.link?.startsWith('http')) {
                    window.location.href = cat.link;
                  } else if (cat.link?.startsWith('/')) {
                    // Assuming internal navigation or simple link
                    const page = cat.link.split('/')[1] as PageType || 'products';
                    const param = cat.link.split('/')[2];
                    onNavigate(page, param);
                  } else {
                    onNavigate('products', cat.id);
                  }
                }}
                className="group relative h-[600px] rounded-[48px] overflow-hidden cursor-pointer premium-shadow active:scale-95 transition-all duration-500"
              >
                <img
                  src={cat.imageUrl || cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
                <div className="absolute inset-0 glass-dark opacity-0 group-hover:opacity-10 transition-opacity" />

                <div className="absolute bottom-0 left-0 right-0 p-12 translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="w-12 h-[1px] bg-white/50 mb-6 group-hover:w-full transition-all duration-700" />
                  <h3 className="text-3xl font-black text-white mb-3 uppercase tracking-tight">{cat.title}</h3>
                  <p className="text-white/60 text-xs font-bold uppercase tracking-widest leading-relaxed mb-6 opacity-0 group-hover:opacity-100 transition-all delay-100">
                    {cat.description || cat.desc}
                  </p>
                  <div className="flex items-center gap-3 text-white text-[10px] font-black uppercase tracking-[0.3em] group-hover:gap-5 transition-all">
                    Explore Now <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers - Dynamic Grid */}
      <section className="py-32 bg-gray-50 overflow-hidden relative">
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-black/5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="animate-fade-in">
              <span className="text-blue-600 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Crowd Favorites</span>
              <h2 className="text-5xl font-black text-black tracking-tighter uppercase leading-none">Best<br />Sellers.</h2>
            </div>
            <button
              onClick={() => onNavigate('products')}
              className="group flex items-center gap-4 text-black text-[10px] font-black uppercase tracking-[0.3em] hover:text-blue-600 transition-colors"
            >
              Discover Full Archive
              <div className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center group-hover:border-blue-600 transition-colors">
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center p-12">
              <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
              {bestSellers.map((product) => (
                <div key={product.id} className="animate-fade-in">
                  <ProductCard
                    product={product}
                    onViewDetails={(id) => onNavigate('product-detail', id)}
                    onAddToCart={onAddToCart}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us - Premium Visual Storytelling */}
      <section className="py-40 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-[48px] opacity-10 blur-2xl group-hover:opacity-20 transition-opacity duration-700" />
              <div className="relative overflow-hidden rounded-[40px] shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80"
                  alt="Precision Manufacturing"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              {/* Floating Badge */}
              <div className="absolute -right-12 -bottom-12 glass-dark p-8 rounded-[32px] shadow-2xl animate-float hidden md:block">
                <div className="flex items-center gap-5 mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-white text-black flex items-center justify-center shadow-lg">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-white font-black text-2xl tracking-tighter">100%</p>
                    <p className="text-white/40 text-[8px] font-black uppercase tracking-[0.2em]">Quality Integrity</p>
                  </div>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-white w-[100%] h-full rounded-full" />
                </div>
              </div>
            </div>

            <div className="lg:pl-10">
              <span className="text-blue-600 font-black text-[10px] uppercase tracking-[0.4em] mb-6 block">The Emission Identity</span>
              <h2 className="text-5xl md:text-7xl font-black text-black tracking-tighter uppercase leading-none mb-8">
                Mastered by<br />Hand. <span className="text-gray-300">Perfected</span><br />by Science.
              </h2>
              <p className="text-gray-500 text-lg mb-12 font-medium leading-relaxed max-w-xl">
                From the heart of Jabalpur, we redefine utility. Our ISO-certified facility bridges the gap between raw endurance and professional elegance.
              </p>

              <div className="grid grid-cols-1 gap-12">
                {[
                  { icon: Shield, title: 'Bionic Fabrics', desc: 'Moisture-wicking, anti-microbial engineered DNA.' },
                  { icon: Clock, title: 'Velocity Fulfilment', desc: 'Strategic dispatch infrastructure for 24h arrivals.' },
                  { icon: Package, title: 'Direct Genesis', desc: 'Factory-to-door ecosystem. Zero dilution.' }
                ].map((feature, i) => (
                  <div key={i} className="flex gap-8 group">
                    <div className="w-16 h-16 rounded-[24px] bg-gray-50 flex items-center justify-center flex-shrink-0 group-hover:bg-black group-hover:rotate-12 transition-all duration-500">
                      <feature.icon className="w-6 h-6 text-black group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <h4 className="font-black text-sm uppercase tracking-tight text-black mb-2">{feature.title}</h4>
                      <p className="text-xs text-gray-400 font-semibold tracking-wide leading-relaxed max-w-xs">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter - High Octane CTA */}
      <section className="py-40 bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <span className="text-blue-500 font-black text-[10px] uppercase tracking-[0.5em] mb-10 block">Stay Ahead</span>
          <h2 className="text-6xl md:text-8xl font-black mb-10 tracking-tighter uppercase leading-none">Join the<br /><span className="text-gradient">Collective.</span></h2>
          <p className="text-white/40 text-sm font-bold uppercase tracking-widest mb-16 max-w-xl mx-auto leading-relaxed">
            Gain early access to limited laboratory drops and performance engineering insights.
          </p>

          <form className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto" onSubmit={(e) => e.preventDefault()}>
            <div className="flex-1 relative group">
              <input
                type="email"
                placeholder="GENESIS@EMISSION.COM"
                className="w-full px-8 py-6 rounded-2xl glass-dark text-white placeholder-white/20 text-xs font-black tracking-widest focus:outline-none focus:ring-2 focus:ring-white/50 transition-all uppercase"
              />
            </div>
            <button className="px-12 py-6 bg-white text-black font-black text-xs uppercase tracking-[0.3em] rounded-2xl hover:bg-white/90 transition-all active:scale-95 shadow-2xl shadow-white/10">
              Infiltrate
            </button>
          </form>

          <div className="mt-16 pt-16 border-t border-white/5 flex flex-wrap justify-center gap-10">
            {['Instagram', 'LinkedIn', 'YouTube'].map((social) => (
              <a key={social} href="#" className="text-[8px] font-black uppercase tracking-[0.4em] text-white/30 hover:text-white transition-colors">
                {social}
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
