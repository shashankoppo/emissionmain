import { useState, useEffect } from 'react';
import { PageType, CartItem } from './types';
import { productAPI } from './lib/api';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import CartDrawer from './components/Layout/CartDrawer';
import WhatsAppButton from './components/UI/WhatsAppButton';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Industries from './pages/Industries';
import OEM from './pages/OEM';
import Government from './pages/Government';
import About from './pages/About';
import Certifications from './pages/Certifications';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import Account from './pages/Account';
import Login from './pages/Login';
import Register from './pages/Register';
import Orders from './pages/Orders';
import TrackOrder from './pages/TrackOrder';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [pageParam, setPageParam] = useState<string | undefined>();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  const handleNavigate = (page: PageType, param?: string) => {
    setCurrentPage(page);
    setPageParam(param);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = async (productId: string, quantity: number) => {
    try {
      // In a real app we might already have the product object
      // For now we fetch it to ensure cart has full details
      const product = await productAPI.getById(productId);

      setCartItems((prev) => {
        const existing = prev.find((item) => item.productId === productId);
        if (existing) {
          return prev.map((item) =>
            item.productId === productId
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        return [...prev, { productId, quantity, product }];
      });
      setIsCartOpen(true); // Open drawer on add
    } catch (err) {
      console.error('Failed to add to cart', err);
    }
  };

  const handleUpdateCart = (items: CartItem[]) => {
    setCartItems(items);
  };

  const handleLogin = (email: string) => {
    setIsLoggedIn(true);
    setUser({ name: 'John Doe', email });
    handleNavigate('home');
  };

  const handleRegister = (data: { name: string; email: string }) => {
    setIsLoggedIn(true);
    setUser({ name: data.name, email: data.email });
    handleNavigate('home');
  };

  useEffect(() => {
    const pageTitles: Record<string, string> = {
      home: 'Emission - Premium Sportswear & Medical Wear',
      products: 'Shop All - Emission',
      'product-detail': 'Product Details - Emission',
      cart: 'Your Cart - Emission',
      checkout: 'Checkout - Emission',
      account: 'My Account - Emission',
      login: 'Login - Emission',
      register: 'Create Account - Emission',
      orders: 'My Orders - Emission',
      'track-order': 'Track Your Order - Emission',
    };

    document.title = pageTitles[currentPage] || 'Emission';
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={handleNavigate} onAddToCart={handleAddToCart} />;
      case 'products':
        return <Products onNavigate={handleNavigate} selectedCategory={pageParam} onAddToCart={handleAddToCart} />;
      case 'product-detail':
        return <ProductDetail productId={pageParam || ''} onNavigate={handleNavigate} onAddToCart={handleAddToCart} />;
      case 'industries':
        return <Industries onNavigate={handleNavigate} />;
      case 'oem':
        return <OEM onNavigate={handleNavigate} />;
      case 'government':
        return <Government onNavigate={handleNavigate} />;
      case 'about':
        return <About onNavigate={handleNavigate} />;
      case 'certifications':
        return <Certifications onNavigate={handleNavigate} />;
      case 'contact':
        return <Contact onNavigate={handleNavigate} selectedProductId={pageParam} />;
      case 'cart':
        // Reuse Cart component as Checkout page
        return <Cart onNavigate={handleNavigate} cartItems={cartItems} onUpdateCart={handleUpdateCart} />;
      case 'checkout':
        return <Cart onNavigate={handleNavigate} cartItems={cartItems} onUpdateCart={handleUpdateCart} />;
      case 'account':
        return <Account onNavigate={handleNavigate} />;
      case 'login':
        return <Login onNavigate={handleNavigate} onLogin={handleLogin} />;
      case 'register':
        return <Register onNavigate={handleNavigate} onRegister={handleRegister} />;
      case 'orders':
        return <Orders onNavigate={handleNavigate} isLoggedIn={isLoggedIn} />;
      case 'track-order':
        return <TrackOrder onNavigate={handleNavigate} />;
      case 'privacy':
        return <Privacy />;
      case 'terms':
        return <Terms />;
      default:
        return <Home onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {currentPage !== 'login' && currentPage !== 'register' && (
        <Header
          currentPage={currentPage}
          onNavigate={handleNavigate}
          cartItemCount={cartItems.length}
          isLoggedIn={isLoggedIn}
          onOpenCart={() => setIsCartOpen(true)}
        />
      )}

      <main className="flex-grow">{renderPage()}</main>

      {currentPage !== 'login' && currentPage !== 'register' && (
        <Footer onNavigate={handleNavigate} />
      )}

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateCart={handleUpdateCart}
        onCheckout={() => {
          setIsCartOpen(false);
          handleNavigate('checkout');
        }}
        onNavigate={handleNavigate}
      />

      <WhatsAppButton />
    </div>
  );
}

export default App;
