import { Factory, Palette, Zap, TrendingUp, CheckCircle, Clock } from 'lucide-react';
import { PageType } from '../types';
import Button from '../components/UI/Button';

interface OEMProps {
  onNavigate: (page: PageType, productId?: string) => void;
}

export default function OEM({ onNavigate }: OEMProps) {
  const capabilities = [
    {
      icon: Factory,
      title: 'Advanced Manufacturing',
      description:
        'State-of-the-art production facility with capacity for 50,000+ units per month',
    },
    {
      icon: Palette,
      title: 'Full Customization',
      description:
        'Complete design flexibility including fabrics, colors, prints, and branding',
    },
    {
      icon: Zap,
      title: 'Rapid Prototyping',
      description: 'Quick sample development and approval process within 7-10 days',
    },
    {
      icon: TrendingUp,
      title: 'Scalable Production',
      description: 'Flexible MOQ and ability to scale production based on demand',
    },
    {
      icon: CheckCircle,
      title: 'Quality Control',
      description: 'ISO-certified processes with multi-stage quality inspection',
    },
    {
      icon: Clock,
      title: 'Timely Delivery',
      description: 'Reliable production schedules with pan-India logistics network',
    },
  ];

  const process = [
    {
      step: '01',
      title: 'Requirement Analysis',
      description:
        'Understanding your specific needs, target market, and design preferences',
    },
    {
      step: '02',
      title: 'Design & Sampling',
      description:
        'Creating prototypes and samples for approval with multiple iterations',
    },
    {
      step: '03',
      title: 'Material Sourcing',
      description:
        'Procuring high-quality fabrics and materials as per specifications',
    },
    {
      step: '04',
      title: 'Production',
      description:
        'Manufacturing at scale with continuous quality monitoring',
    },
    {
      step: '05',
      title: 'Quality Assurance',
      description:
        'Rigorous inspection at multiple stages ensuring zero defects',
    },
    {
      step: '06',
      title: 'Packaging & Delivery',
      description:
        'Custom packaging and logistics coordination for timely delivery',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h1 className="text-5xl font-bold mb-6">OEM Manufacturing Excellence</h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Your trusted OEM partner for sportswear and medical wear manufacturing in Jabalpur,
            Madhya Pradesh
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-4xl font-bold text-black mb-6">
              Premium OEM Manufacturing Services
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              emission is a leading OEM manufacturer specializing in sportswear and
              medical wear production. Based in Jabalpur, Madhya Pradesh, we offer comprehensive
              manufacturing solutions for brands, distributors, and institutional buyers across India.
            </p>
            <p className="text-lg text-gray-600 mb-8">
              Our facility is equipped with modern machinery and skilled workforce capable of
              delivering high-quality products at competitive prices. We handle everything from
              design to delivery, allowing you to focus on your brand and sales.
            </p>
            <Button onClick={() => onNavigate('contact')} variant="primary" size="lg">
              Discuss Your OEM Requirements
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {capabilities.map((capability, index) => (
              <div key={index} className="bg-gray-50 p-6 border border-gray-200">
                <capability.icon className="w-10 h-10 text-black mb-4" />
                <h3 className="font-semibold text-black mb-2">{capability.title}</h3>
                <p className="text-sm text-gray-600">{capability.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 p-12 border border-gray-200 mb-20">
          <h2 className="text-3xl font-bold text-black mb-12 text-center">
            Our OEM Manufacturing Process
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {process.map((item, index) => (
              <div key={index} className="relative">
                <div className="text-5xl font-bold text-gray-200 mb-4">{item.step}</div>
                <h3 className="text-xl font-bold text-black mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <div className="bg-white p-8 border border-gray-200">
            <h3 className="text-2xl font-bold text-black mb-6">Sportswear OEM</h3>
            <p className="text-gray-600 mb-6">
              We manufacture a complete range of sports apparel for brands and institutions:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <div className="w-1.5 h-1.5 bg-black rounded-full mt-2" />
                <span className="text-gray-700">Performance t-shirts and jerseys</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-1.5 h-1.5 bg-black rounded-full mt-2" />
                <span className="text-gray-700">Track suits and training wear</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-1.5 h-1.5 bg-black rounded-full mt-2" />
                <span className="text-gray-700">Athletic shorts and pants</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-1.5 h-1.5 bg-black rounded-full mt-2" />
                <span className="text-gray-700">Team uniforms and kits</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-1.5 h-1.5 bg-black rounded-full mt-2" />
                <span className="text-gray-700">Custom sports accessories</span>
              </li>
            </ul>
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-2">
                <strong>MOQ:</strong> 25-100 pieces per design
              </p>
              <p className="text-sm text-gray-600">
                <strong>Lead Time:</strong> 15-30 days from approval
              </p>
            </div>
          </div>

          <div className="bg-white p-8 border border-gray-200">
            <h3 className="text-2xl font-bold text-black mb-6">Medical Wear OEM</h3>
            <p className="text-gray-600 mb-6">
              Professional medical apparel manufacturing for healthcare brands:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <div className="w-1.5 h-1.5 bg-black rounded-full mt-2" />
                <span className="text-gray-700">Medical scrubs and surgical wear</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-1.5 h-1.5 bg-black rounded-full mt-2" />
                <span className="text-gray-700">Lab coats and doctor uniforms</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-1.5 h-1.5 bg-black rounded-full mt-2" />
                <span className="text-gray-700">Hospital staff uniforms</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-1.5 h-1.5 bg-black rounded-full mt-2" />
                <span className="text-gray-700">PPE clothing and protective wear</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-1.5 h-1.5 bg-black rounded-full mt-2" />
                <span className="text-gray-700">Patient gowns and accessories</span>
              </li>
            </ul>
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-2">
                <strong>MOQ:</strong> 50-500 pieces per design
              </p>
              <p className="text-sm text-gray-600">
                <strong>Lead Time:</strong> 20-35 days from approval
              </p>
            </div>
          </div>
        </div>

        <div className="bg-black text-white p-12 mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Why Choose emission as Your OEM Partner?</h2>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 flex-shrink-0 mt-1" />
                  <div>
                    <strong>Competitive Pricing:</strong>
                    <p className="text-gray-300">
                      Direct manufacturer rates with transparent pricing structure
                    </p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 flex-shrink-0 mt-1" />
                  <div>
                    <strong>Quality Assurance:</strong>
                    <p className="text-gray-300">
                      ISO certified manufacturing with stringent quality control
                    </p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 flex-shrink-0 mt-1" />
                  <div>
                    <strong>Flexible MOQ:</strong>
                    <p className="text-gray-300">
                      Lower minimum order quantities for new brands
                    </p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 flex-shrink-0 mt-1" />
                  <div>
                    <strong>Complete Confidentiality:</strong>
                    <p className="text-gray-300">
                      Your designs and brand information remain confidential
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="bg-white text-black p-8">
              <h3 className="text-2xl font-bold mb-6">Start Your OEM Partnership</h3>
              <p className="text-gray-600 mb-6">
                Contact us to discuss your manufacturing requirements and receive a detailed quote.
              </p>
              <Button
                onClick={() => onNavigate('contact')}
                variant="primary"
                size="lg"
                fullWidth
              >
                Request OEM Quote
              </Button>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <Button
                  onClick={() => onNavigate('products')}
                  variant="outline"
                  size="sm"
                  fullWidth
                >
                  View Product Samples
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-8 border border-gray-200">
          <h2 className="text-xl font-bold text-black mb-4">
            OEM Sportswear & Medical Wear Manufacturer in Jabalpur, Madhya Pradesh
          </h2>
          <p className="text-gray-600">
            emission is a trusted OEM manufacturer of sportswear and medical wear
            located in Jabalpur, Madhya Pradesh. We provide end-to-end manufacturing solutions
            including design, sampling, production, quality control, and delivery for brands,
            distributors, and institutional buyers across India. Our facility specializes in
            producing performance sportswear, athletic uniforms, medical scrubs, hospital wear, and
            PPE clothing with complete customization options. With ISO certification, flexible MOQ,
            competitive pricing, and reliable delivery schedules, we are the preferred OEM partner for
            businesses seeking quality apparel manufacturing in central India.
          </p>
        </div>
      </div>
    </div>
  );
}
