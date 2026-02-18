import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { PageType } from '../types';
import Button from '../components/UI/Button';
import { enquiryAPI } from '../lib/api';

interface ContactProps {
  onNavigate: (page: PageType, productId?: string) => void;
  selectedProductId?: string;
}

export default function Contact({ selectedProductId }: ContactProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    enquiryType: 'retail',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await enquiryAPI.create(formData);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        enquiryType: 'retail',
        message: '',
      });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      console.error('Failed to submit enquiry:', err);
      setError('Failed to submit enquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h1 className="text-5xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Get in touch for wholesale pricing, government tenders, or custom manufacturing enquiries
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 p-8">
              <h2 className="text-3xl font-bold text-black mb-8">Send Us an Enquiry</h2>
              {submitted && (
                <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 mb-6">
                  <p className="font-semibold">Thank you for your enquiry!</p>
                  <p className="text-sm">We will get back to you within 24 hours.</p>
                </div>
              )}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 mb-6">
                  <p className="font-semibold">Error</p>
                  <p className="text-sm">{error}</p>
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      disabled={loading}
                      className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none disabled:bg-gray-100"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      disabled={loading}
                      className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none disabled:bg-gray-100"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={loading}
                      className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none disabled:bg-gray-100"
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Company / Institution
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      disabled={loading}
                      className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none disabled:bg-gray-100"
                      placeholder="Company name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Enquiry Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="enquiryType"
                    required
                    value={formData.enquiryType}
                    onChange={handleChange}
                    disabled={loading}
                    aria-label="Enquiry Type"
                    className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none disabled:bg-gray-100"
                  >
                    <option value="retail">Retail Enquiry</option>
                    <option value="wholesale">Wholesale / Bulk Order</option>
                    <option value="government">Government / Institutional</option>
                    <option value="custom">Custom Manufacturing / OEM</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none resize-none disabled:bg-gray-100"
                    placeholder={
                      selectedProductId
                        ? 'Please provide details about your requirements including quantity, customization needs, and delivery timeline...'
                        : 'Please provide details about your requirements including product type, quantity, customization needs, and delivery timeline...'
                    }
                  />
                </div>

                <Button type="submit" variant="primary" size="lg" fullWidth disabled={loading}>
                  {loading ? (
                    <span className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending...
                    </span>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Submit Enquiry
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-black mb-6">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <MapPin className="w-6 h-6 text-black flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-black mb-1">Address</p>
                    <p className="text-sm text-gray-600">
                      1650/A Narsingh Nagar
                      <br />
                      Ranjhi, Jabalpur
                      <br />
                      Madhya Pradesh, India
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Phone className="w-6 h-6 text-black flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-black mb-1">Phone</p>
                    <a href="tel:7987040844" className="text-sm text-gray-600 hover:text-black">
                      +91 79870 40844
                    </a>
                    <p className="text-xs text-gray-500 mt-1">11:00 AM - 6:00 PM</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Mail className="w-6 h-6 text-black flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-black mb-1">Email</p>
                    <p className="text-sm text-gray-600">info@emission.in</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-black text-white p-8">
              <h3 className="text-xl font-bold mb-4">Quick Response</h3>
              <p className="text-gray-300 text-sm mb-6">
                We respond to all enquiries within 24 hours. For urgent requirements, please call
                us directly.
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-white rounded-full" />
                  <span>Wholesale quotes within 24 hours</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-white rounded-full" />
                  <span>Government tender support available</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-white rounded-full" />
                  <span>Sample requests processed promptly</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-black mb-4">Location</h3>
              <div className="aspect-video bg-gray-200 flex items-center justify-center text-gray-500">
                <MapPin className="w-12 h-12" />
              </div>
              <p className="text-sm text-gray-600 mt-4">
                Located in the heart of Jabalpur, Madhya Pradesh, with easy access to transportation
                networks for pan-India delivery.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 bg-gray-50 p-8 border border-gray-200">
          <h2 className="text-xl font-bold text-black mb-4">
            Contact Sportswear & Medical Wear Manufacturer in Jabalpur
          </h2>
          <p className="text-gray-600">
            emission is your trusted contact for sportswear and medical wear
            manufacturing in Jabalpur, Madhya Pradesh. Reach out to us for retail purchases, wholesale pricing,
            government tender participation, OEM manufacturing enquiries, or institutional bulk
            orders. We serve customers across India including schools, colleges, hospitals, sports
            organizations, and government departments. Our team responds to all enquiries within 24
            hours and provides competitive quotes, sample availability, and complete product
            specifications. Contact us via phone, email, or visit our manufacturing facility in
            Jabalpur for direct discussions about your apparel requirements.
          </p>
        </div>
      </div>
    </div>
  );
}
