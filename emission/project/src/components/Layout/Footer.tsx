import { MapPin, Award } from 'lucide-react';
import { PageType } from '../../types';
import EmissionLogo from '../UI/EmissionLogo';

interface FooterProps {
  onNavigate: (page: PageType) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-black text-[#888] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 lg:gap-8">
          {/* Brand Identity */}
          <div className="lg:col-span-4">
            <div className="mb-8">
              <EmissionLogo size="md" color="white" />
            </div>
            <p className="text-xs font-bold uppercase tracking-widest leading-loose mb-10 max-w-sm">
              ENGINEERING UTILITY SINCE 2026. BORN IN THE HEART OF JABALPUR. MASTERING THE FUSION OF MEDICAL PRECISION AND ATHLETIC PERFORMANCE.
            </p>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-white">
                <MapPin className="w-4 h-4 text-blue-500" />
                <span>Madhya Pradesh, India</span>
              </div>
              <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-white">
                <Award className="w-4 h-4 text-purple-500" />
                <span>ISO 9001:2015 PRESET</span>
              </div>
            </div>
          </div>

          {/* Shop Links */}
          <div className="lg:col-span-2">
            <h3 className="text-[10px] font-black text-white uppercase tracking-[0.4em] mb-8">Directory</h3>
            <ul className="space-y-4">
              {['Products', 'Sportswear', 'Medical Wear', 'Jerseys', 'Uniforms'].map((link) => (
                <li key={link}>
                  <button onClick={() => onNavigate('products')} className="text-[10px] font-black uppercase tracking-[0.2em] hover:text-white transition-colors">
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Corporate Links */}
          <div className="lg:col-span-2">
            <h3 className="text-[10px] font-black text-white uppercase tracking-[0.4em] mb-8">Corporate</h3>
            <ul className="space-y-4">
              {['About Us', 'Contact', 'Bulk Orders', 'Privacy', 'Terms'].map((link) => (
                <li key={link}>
                  <button onClick={() => onNavigate(link.toLowerCase().replace(' ', '-') as PageType)} className="text-[10px] font-black uppercase tracking-[0.2em] hover:text-white transition-colors">
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-4 lg:pl-10">
            <h3 className="text-[10px] font-black text-white uppercase tracking-[0.4em] mb-8">Connect</h3>
            <div className="space-y-8">
              <div className="group cursor-pointer">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 group-hover:text-blue-500 transition-colors mb-2">Voice</p>
                <p className="text-sm font-black text-white tracking-widest">+91 7987040844</p>
              </div>
              <div className="group cursor-pointer">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 group-hover:text-purple-500 transition-colors mb-2">Digital</p>
                <p className="text-sm font-black text-white tracking-widest leading-loose">GENESIS@EMISSION.IN</p>
              </div>
              <div className="group cursor-pointer">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 group-hover:text-emerald-500 transition-colors mb-2">Genesis Location</p>
                <p className="text-xs font-bold text-white tracking-wider leading-loose">
                  1650/A NARSINGH NAGAR<br />RANJHI, JABALPUR
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Legal & Local Pride */}
      <div className="border-t border-white/5 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <p className="text-[8px] font-black uppercase tracking-[0.4em]">
                © {new Date().getFullYear()} EMISSION LABORATORY.
              </p>
              <div className="h-4 w-[1px] bg-white/10 hidden md:block" />
              <p className="text-[8px] font-black uppercase tracking-[0.4em] text-white/40">
                ENGINEERED WITH PASSION IN JABALPUR, INDIA.
              </p>
            </div>

            <div className="flex items-center gap-6 opacity-40 hover:opacity-100 transition-opacity">
              {['UPI', 'VISA', 'AMEX', 'COD'].map((pay) => (
                <span key={pay} className="text-[8px] font-black uppercase tracking-[0.3em]">{pay}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
