import { Award, FileCheck, Shield, CheckCircle } from 'lucide-react';
import { PageType } from '../types';
import Button from '../components/UI/Button';

interface CertificationsProps {
  onNavigate: (page: PageType, productId?: string) => void;
}

export default function Certifications({ onNavigate }: CertificationsProps) {
  const certifications = [
    {
      icon: Award,
      title: 'ISO 9001:2015 Certification',
      authority: 'International Organization for Standardization',
      description:
        'Quality management system certification ensuring consistent product quality and customer satisfaction',
      year: '2012',
    },
    {
      icon: Shield,
      title: 'GST Registration',
      authority: 'Goods and Services Tax Network',
      description:
        'Registered under GST for compliant invoicing and tax procedures across India',
      year: 'Current',
    },
    {
      icon: FileCheck,
      title: 'MSME Registration',
      authority: 'Ministry of MSME, Government of India',
      description:
        'Registered as Micro, Small and Medium Enterprise with Government of India',
      year: 'Current',
    },
    {
      icon: Award,
      title: 'Government Vendor Registration',
      authority: 'Various State & Central Departments',
      description:
        'Approved vendor for government procurement across multiple departments',
      year: 'Current',
    },
  ];

  const compliance = [
    'ISO 9001:2015 Quality Management',
    'GST Tax Compliance',
    'Labor Law Compliance',
    'Environmental Regulations',
    'Textile Testing Standards',
    'Medical Wear Safety Standards',
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h1 className="text-5xl font-bold mb-6">Certifications & Compliance</h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Committed to quality, safety, and regulatory compliance across all manufacturing
            processes
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-black mb-6">Our Certifications</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We maintain the highest standards of quality and compliance, verified through
            internationally recognized certifications
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {certifications.map((cert, index) => (
            <div key={index} className="bg-gray-50 p-8 border border-gray-200">
              <cert.icon className="w-12 h-12 text-black mb-4" />
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-2xl font-bold text-black">{cert.title}</h3>
                <span className="bg-black text-white px-3 py-1 text-sm font-semibold">
                  {cert.year}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-3 font-medium">{cert.authority}</p>
              <p className="text-gray-600">{cert.description}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <div className="bg-white p-8 border border-gray-200">
            <h3 className="text-2xl font-bold text-black mb-6">Quality Assurance</h3>
            <p className="text-gray-600 mb-6">
              Our ISO 9001:2015 certification demonstrates our commitment to quality management
              excellence. We maintain rigorous quality control processes:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">
                  Incoming material inspection and testing
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">
                  In-process quality checks at every production stage
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">
                  Final inspection before packaging and dispatch
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">
                  Regular internal and external audits
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">
                  Customer feedback integration for continuous improvement
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-black text-white p-8">
            <h3 className="text-2xl font-bold mb-6">Compliance Standards</h3>
            <p className="text-gray-300 mb-6">
              We adhere to all relevant regulations and standards for textile manufacturing and
              institutional supply:
            </p>
            <div className="space-y-2">
              {compliance.map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full" />
                  <span className="text-gray-200">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-12 border border-gray-200 mb-20">
          <h2 className="text-3xl font-bold text-black mb-6 text-center">
            Testing & Documentation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="text-center">
              <h4 className="font-semibold text-black mb-3">Material Testing</h4>
              <p className="text-sm text-gray-600">
                All fabrics tested for strength, colorfastness, shrinkage, and durability
              </p>
            </div>
            <div className="text-center">
              <h4 className="font-semibold text-black mb-3">Product Certification</h4>
              <p className="text-sm text-gray-600">
                Test reports available for all product specifications and requirements
              </p>
            </div>
            <div className="text-center">
              <h4 className="font-semibold text-black mb-3">Documentation</h4>
              <p className="text-sm text-gray-600">
                Complete records maintained for traceability and compliance verification
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-black mb-6">
              Certificates Available for Download
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              For tender participation, government procurement, or business verification, we can
              provide certified copies of all our registrations and certifications.
            </p>
            <Button onClick={() => onNavigate('contact')} variant="primary" size="lg">
              Request Certificate Copies
            </Button>
          </div>
          <div className="bg-gray-50 p-8 border border-gray-200">
            <h3 className="text-xl font-bold text-black mb-6">Documents We Provide</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <FileCheck className="w-5 h-5 text-black flex-shrink-0 mt-1" />
                <div>
                  <p className="font-medium text-black">ISO Certificate</p>
                  <p className="text-sm text-gray-600">Current ISO 9001:2015 certification</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <FileCheck className="w-5 h-5 text-black flex-shrink-0 mt-1" />
                <div>
                  <p className="font-medium text-black">GST Certificate</p>
                  <p className="text-sm text-gray-600">GST registration certificate</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <FileCheck className="w-5 h-5 text-black flex-shrink-0 mt-1" />
                <div>
                  <p className="font-medium text-black">MSME Certificate</p>
                  <p className="text-sm text-gray-600">MSME registration document</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <FileCheck className="w-5 h-5 text-black flex-shrink-0 mt-1" />
                <div>
                  <p className="font-medium text-black">Test Reports</p>
                  <p className="text-sm text-gray-600">Product testing and quality reports</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <FileCheck className="w-5 h-5 text-black flex-shrink-0 mt-1" />
                <div>
                  <p className="font-medium text-black">Company Profile</p>
                  <p className="text-sm text-gray-600">Detailed company information document</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
