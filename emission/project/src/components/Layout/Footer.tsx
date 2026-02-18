import { MapPin, Phone, Mail, ArrowRight } from 'lucide-react';
import { PageType } from '../../types';
import EmissionLogo from '../UI/EmissionLogo';

interface FooterProps {
  onNavigate: (page: PageType) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Newsletter */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-white text-lg font-bold mb-1">Stay Updated</h3>
              <p className="text-gray-400 text-sm">Get notified about new products and exclusive offers</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm placeholder-gray-500 focus:ring-2 focus:ring-white/30 focus:border-transparent flex-1 md:w-64"
              />
              <button className="px-6 py-3 bg-white text-black rounded-xl text-sm font-semibold hover:bg-gray-100 transition-colors flex items-center gap-1">
                Subscribe
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* About */}
          <div>
            <div className="mb-4">
              <EmissionLogo size="md" color="white" />
            </div>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              Premium sportswear and medical wear manufacturer. Buy directly from our factory at the best prices with free shipping across India.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              Jabalpur, Madhya Pradesh, India
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Shop</h3>
            <ul className="space-y-3">
              <li>
                <button onClick={() => onNavigate('products')} className="text-sm text-gray-400 hover:text-white transition-colors">
                  All Products
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('products')} className="text-sm text-gray-400 hover:text-white transition-colors">
                  Sportswear
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('products')} className="text-sm text-gray-400 hover:text-white transition-colors">
                  Medical Wear
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('products')} className="text-sm text-gray-400 hover:text-white transition-colors">
                  T-Shirts & Jerseys
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('products')} className="text-sm text-gray-400 hover:text-white transition-colors">
                  Scrubs & Uniforms
                </button>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <button onClick={() => onNavigate('about')} className="text-sm text-gray-400 hover:text-white transition-colors">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('certifications')} className="text-sm text-gray-400 hover:text-white transition-colors">
                  Certifications
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="text-sm text-gray-400 hover:text-white transition-colors">
                  Contact Us
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="text-sm text-gray-400 hover:text-white transition-colors">
                  Bulk Orders
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('privacy')} className="text-sm text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('terms')} className="text-sm text-gray-400 hover:text-white transition-colors">
                  Terms & Conditions
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Get In Touch</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-400">+91 7987040844</p>
                  <p className="text-xs text-gray-500">11:00 AM - 6:00 PM</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-400">info@emission.in</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-400">1650/A Narsingh Nagar</p>
                  <p className="text-sm text-gray-400">Ranjhi, Jabalpur</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} Emission. All rights reserved. Made with ❤️ in India.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-500">We accept:</span>
              <div className="flex gap-2">
                <span className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-400">UPI</span>
                <span className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-400">Cards</span>
                <span className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-400">NetBanking</span>
                <span className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-400">COD</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
