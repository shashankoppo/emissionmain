import { useState } from 'react';
import { Menu, X, ShoppingCart, ChevronDown, User, Search, Heart, Package } from 'lucide-react';
import { PageType } from '../../types';
import EmissionLogo from '../UI/EmissionLogo';

interface HeaderProps {
  currentPage: PageType;
  onNavigate: (page: PageType, id?: string) => void;
  cartItemCount?: number;
  isLoggedIn?: boolean;
  onOpenCart?: () => void;
}

export default function Header({ currentPage, onNavigate, cartItemCount = 0, isLoggedIn = false, onOpenCart }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const shopDropdown = [
    { label: 'All Products', page: 'products' as PageType },
    { label: 'Sportswear', page: 'products' as PageType, id: 'sportswear' },
    { label: 'Medical Wear', page: 'products' as PageType, id: 'medicalwear' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('products');
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  const handleCartClick = () => {
    if (onOpenCart) {
      onOpenCart();
    } else {
      onNavigate('cart');
    }
  };

  return (
    <>
      <header className="bg-white sticky top-0 z-50 shadow-sm">
        {/* Announcement Bar - Like Knya */}
        <div className="bg-black text-white overflow-hidden">
          <div className="relative flex">
            <div className="animate-marquee whitespace-nowrap py-2 text-xs font-medium flex gap-12 sm:gap-16 items-center">
              <span>🚚 FREE SHIPPING ON ALL ORDERS</span>
              <span>✨ PREMIUM QUALITY GUARANTEED</span>
              <span>🔄 EASY 7-DAY RETURNS</span>
              <span>🏭 MADE IN INDIA — ISO CERTIFIED</span>
              <span>💳 SECURE PAYMENTS — UPI, CARDS, COD</span>
              <span>🚚 FREE SHIPPING ON ALL ORDERS</span>
              <span>✨ PREMIUM QUALITY GUARANTEED</span>
              <span>🔄 EASY 7-DAY RETURNS</span>
              <span>🏭 MADE IN INDIA — ISO CERTIFIED</span>
              <span>💳 SECURE PAYMENTS — UPI, CARDS, COD</span>
            </div>
          </div>
        </div>

        {/* Main Nav */}
        <div className="border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Left: Mobile Menu + Logo */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="lg:hidden p-2 text-gray-600 hover:text-black rounded-lg hover:bg-gray-50 transition"
                  title="Toggle menu"
                >
                  {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
                <button onClick={() => onNavigate('home')} className="flex-shrink-0">
                  <EmissionLogo size="md" color="black" />
                </button>
              </div>

              {/* Center: Nav Links */}
              <nav className="hidden lg:flex items-center gap-1">
                <button
                  onClick={() => onNavigate('home')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${currentPage === 'home' ? 'text-black' : 'text-gray-500 hover:text-black'
                    }`}
                >
                  Home
                </button>

                {/* Shop Dropdown */}
                <div
                  className="relative"
                  onMouseEnter={() => setIsShopDropdownOpen(true)}
                  onMouseLeave={() => setIsShopDropdownOpen(false)}
                >
                  <button
                    onClick={() => onNavigate('products')}
                    className={`flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${currentPage === 'products' || currentPage === 'product-detail'
                        ? 'text-black'
                        : 'text-gray-500 hover:text-black'
                      }`}
                  >
                    Shop
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  {isShopDropdownOpen && (
                    <div className="absolute left-0 top-full pt-2 w-56 z-50">
                      <div className="bg-white border border-gray-200 rounded-xl shadow-xl py-2">
                        {shopDropdown.map((item) => (
                          <button
                            key={item.label}
                            onClick={() => {
                              onNavigate(item.page, item.id);
                              setIsShopDropdownOpen(false);
                            }}
                            className="block w-full text-left px-5 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-black transition"
                          >
                            {item.label}
                          </button>
                        ))}
                        <div className="border-t border-gray-100 mt-2 pt-2 mx-3">
                          <button
                            onClick={() => {
                              onNavigate('contact');
                              setIsShopDropdownOpen(false);
                            }}
                            className="block w-full text-left px-2 py-2.5 text-sm text-gray-400 hover:text-black transition"
                          >
                            Bulk / Custom Orders →
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => onNavigate('about')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${currentPage === 'about' ? 'text-black' : 'text-gray-500 hover:text-black'
                    }`}
                >
                  About
                </button>
                <button
                  onClick={() => onNavigate('contact')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${currentPage === 'contact' ? 'text-black' : 'text-gray-500 hover:text-black'
                    }`}
                >
                  Contact
                </button>
                <button
                  onClick={() => onNavigate('track-order')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${currentPage === 'track-order' ? 'text-black' : 'text-gray-500 hover:text-black'
                    }`}
                >
                  Track Order
                </button>
              </nav>

              {/* Right: Icons */}
              <div className="flex items-center gap-1">
                {/* Search Toggle */}
                <button
                  onClick={() => setShowSearch(!showSearch)}
                  className="p-2.5 text-gray-500 hover:text-black rounded-lg hover:bg-gray-50 transition"
                  title="Search"
                >
                  <Search className="w-5 h-5" />
                </button>

                {/* Wishlist */}
                <button
                  onClick={() => onNavigate('products')}
                  className="hidden sm:flex p-2.5 text-gray-500 hover:text-black rounded-lg hover:bg-gray-50 transition"
                  title="Wishlist"
                >
                  <Heart className="w-5 h-5" />
                </button>

                {/* Account */}
                <div
                  className="relative"
                  onMouseEnter={() => setIsAccountDropdownOpen(true)}
                  onMouseLeave={() => setIsAccountDropdownOpen(false)}
                >
                  <button
                    onClick={() => onNavigate(isLoggedIn ? 'account' : 'login')}
                    className="p-2.5 text-gray-500 hover:text-black rounded-lg hover:bg-gray-50 transition"
                    title="Account"
                  >
                    <User className="w-5 h-5" />
                  </button>
                  {isAccountDropdownOpen && (
                    <div className="absolute right-0 top-full pt-2 w-48 z-50">
                      <div className="bg-white border border-gray-200 rounded-xl shadow-xl py-2">
                        {isLoggedIn ? (
                          <>
                            <button onClick={() => { onNavigate('account'); setIsAccountDropdownOpen(false); }} className="block w-full text-left px-5 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-black transition">My Account</button>
                            <button onClick={() => { onNavigate('orders'); setIsAccountDropdownOpen(false); }} className="block w-full text-left px-5 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-black transition">My Orders</button>
                            <button onClick={() => { onNavigate('track-order'); setIsAccountDropdownOpen(false); }} className="block w-full text-left px-5 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-black transition">Track Order</button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => { onNavigate('login'); setIsAccountDropdownOpen(false); }} className="block w-full text-left px-5 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-black transition">Sign In</button>
                            <button onClick={() => { onNavigate('register'); setIsAccountDropdownOpen(false); }} className="block w-full text-left px-5 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-black transition">Create Account</button>
                            <div className="border-t border-gray-100 mt-2 pt-2">
                              <button onClick={() => { onNavigate('track-order'); setIsAccountDropdownOpen(false); }} className="block w-full text-left px-5 py-2.5 text-sm text-gray-400 hover:text-black transition">Track Order</button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Cart - Now opens drawer */}
                <button
                  onClick={handleCartClick}
                  className="relative p-2.5 text-gray-500 hover:text-black rounded-lg hover:bg-gray-50 transition"
                  title="Shopping Cart"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-black text-white text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1">
                      {cartItemCount > 99 ? '99+' : cartItemCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        {showSearch && (
          <div className="border-b border-gray-100 bg-white">
            <div className="max-w-2xl mx-auto px-4 py-4">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products..."
                  autoFocus
                  className="w-full pl-12 pr-20 py-3.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-black focus:border-transparent"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-900 transition"
                >
                  Search
                </button>
              </form>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsMenuOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-80 bg-white shadow-xl overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <EmissionLogo size="md" color="black" />
                <button onClick={() => setIsMenuOpen(false)} title="Close menu" className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Auth */}
              {!isLoggedIn ? (
                <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-600 mb-3">Sign in for the best experience</p>
                  <button
                    onClick={() => { onNavigate('login'); setIsMenuOpen(false); }}
                    className="w-full bg-black text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-900 transition mb-2"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => { onNavigate('register'); setIsMenuOpen(false); }}
                    className="w-full border border-gray-300 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                  >
                    Create Account
                  </button>
                </div>
              ) : (
                <div className="mb-6 p-4 bg-gray-50 rounded-xl flex items-center gap-3">
                  <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold">U</div>
                  <div>
                    <p className="text-sm font-medium text-black">Welcome back!</p>
                    <button onClick={() => { onNavigate('account'); setIsMenuOpen(false); }} className="text-xs text-gray-500 hover:text-black">View Profile →</button>
                  </div>
                </div>
              )}

              {/* Nav Links */}
              <div className="space-y-1">
                {[
                  { label: 'Home', page: 'home' as PageType },
                  { label: 'Shop All', page: 'products' as PageType },
                  { label: 'Sportswear', page: 'products' as PageType, id: 'sportswear' },
                  { label: 'Medical Wear', page: 'products' as PageType, id: 'medicalwear' },
                  { label: 'About Us', page: 'about' as PageType },
                  { label: 'Contact', page: 'contact' as PageType },
                ].map((link) => (
                  <button
                    key={link.label}
                    onClick={() => { onNavigate(link.page, link.id); setIsMenuOpen(false); }}
                    className={`block w-full text-left px-4 py-3 text-sm rounded-lg transition ${currentPage === link.page ? 'bg-black text-white font-medium' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    {link.label}
                  </button>
                ))}
              </div>

              {/* Mobile Quick Links */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-1">
                <button
                  onClick={() => { onNavigate('track-order'); setIsMenuOpen(false); }}
                  className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <Package className="w-4 h-4" />
                  Track Order
                </button>
                <button
                  onClick={handleCartClick}
                  className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Shopping Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
      `}</style>
    </>
  );
}
