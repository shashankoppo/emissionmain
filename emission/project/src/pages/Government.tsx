import { FileText, Shield, Award, Truck, CheckCircle, Clock } from 'lucide-react';
import { PageType } from '../types';
import Button from '../components/UI/Button';

interface GovernmentProps {
  onNavigate: (page: PageType, productId?: string) => void;
}

export default function Government({ onNavigate }: GovernmentProps) {
  const credentials = [
    {
      icon: Shield,
      title: 'GST Registered',
      description: 'Fully compliant with GST regulations and tax requirements',
    },
    {
      icon: Award,
      title: 'ISO Certified',
      description: 'Quality management systems certified to international standards',
    },
    {
      icon: FileText,
      title: 'Tender Ready',
      description: 'Complete documentation for government procurement processes',
    },
    {
      icon: Truck,
      title: 'Pan-India Supply',
      description: 'Reliable logistics network for nationwide delivery',
    },
  ];

  const sectors = [
    {
      title: 'Sports & Youth Affairs',
      items: [
        'State sports departments and councils',
        'Government sports academies and training centers',
        'District sports complexes',
        'Youth development programs',
      ],
    },
    {
      title: 'Education Department',
      items: [
        'Government schools and colleges',
        'Physical education programs',
        'Interschool competition uniforms',
        'Sports quota student apparel',
      ],
    },
    {
      title: 'Health Department',
      items: [
        'Government hospitals and clinics',
        'Community health centers',
        'Public health programs',
        'Medical staff uniform requirements',
      ],
    },
    {
      title: 'Defense & Police',
      items: [
        'Sports uniforms for training academies',
        'Physical fitness program apparel',
        'Inter-department sports competitions',
        'Welfare department requirements',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h1 className="text-5xl font-bold mb-6">Government & Institutional Supply</h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Registered government vendor for sportswear and medical wear supply across Madhya Pradesh
            and India
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-black mb-6">
            Trusted Partner for Government Procurement
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Emission by Krish Sports is a qualified government vendor specializing in bulk supply of
            sportswear and medical wear for government departments, institutions, and public sector
            undertakings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {credentials.map((credential, index) => (
            <div key={index} className="bg-gray-50 p-8 border border-gray-200 text-center">
              <credential.icon className="w-12 h-12 text-black mx-auto mb-4" />
              <h3 className="font-semibold text-black mb-2">{credential.title}</h3>
              <p className="text-sm text-gray-600">{credential.description}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-bold text-black mb-6">Why Government Bodies Trust Us</h2>
            <ul className="space-y-4">
              <li className="flex items-start space-x-4">
                <CheckCircle className="w-6 h-6 text-black flex-shrink-0 mt-1" />
                <div>
                  <strong className="text-black">Competitive Pricing:</strong>
                  <p className="text-gray-600">
                    Direct manufacturer rates ensuring best value for public funds
                  </p>
                </div>
              </li>
              <li className="flex items-start space-x-4">
                <CheckCircle className="w-6 h-6 text-black flex-shrink-0 mt-1" />
                <div>
                  <strong className="text-black">Timely Delivery:</strong>
                  <p className="text-gray-600">
                    Reliable production schedules meeting tender delivery deadlines
                  </p>
                </div>
              </li>
              <li className="flex items-start space-x-4">
                <CheckCircle className="w-6 h-6 text-black flex-shrink-0 mt-1" />
                <div>
                  <strong className="text-black">Quality Assurance:</strong>
                  <p className="text-gray-600">
                    ISO certified processes ensuring consistent product quality
                  </p>
                </div>
              </li>
              <li className="flex items-start space-x-4">
                <CheckCircle className="w-6 h-6 text-black flex-shrink-0 mt-1" />
                <div>
                  <strong className="text-black">Complete Documentation:</strong>
                  <p className="text-gray-600">
                    All certificates, licenses, and compliance documents readily available
                  </p>
                </div>
              </li>
              <li className="flex items-start space-x-4">
                <CheckCircle className="w-6 h-6 text-black flex-shrink-0 mt-1" />
                <div>
                  <strong className="text-black">Large Production Capacity:</strong>
                  <p className="text-gray-600">
                    Ability to handle large-volume institutional orders
                  </p>
                </div>
              </li>
              <li className="flex items-start space-x-4">
                <CheckCircle className="w-6 h-6 text-black flex-shrink-0 mt-1" />
                <div>
                  <strong className="text-black">After-Sales Support:</strong>
                  <p className="text-gray-600">
                    Dedicated support for warranty and replacement requirements
                  </p>
                </div>
              </li>
            </ul>
          </div>
          <div className="bg-gray-50 p-8 border border-gray-200">
            <h3 className="text-2xl font-bold text-black mb-6">Procurement Process</h3>
            <div className="space-y-6">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <h4 className="font-semibold text-black">Tender Participation</h4>
                </div>
                <p className="text-sm text-gray-600 ml-11">
                  Submit tender documents with technical and commercial bids
                </p>
              </div>
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <h4 className="font-semibold text-black">Sample Submission</h4>
                </div>
                <p className="text-sm text-gray-600 ml-11">
                  Provide product samples for evaluation and approval
                </p>
              </div>
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <h4 className="font-semibold text-black">Work Order</h4>
                </div>
                <p className="text-sm text-gray-600 ml-11">
                  Receive and confirm work order with delivery schedule
                </p>
              </div>
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold">
                    4
                  </div>
                  <h4 className="font-semibold text-black">Production & Delivery</h4>
                </div>
                <p className="text-sm text-gray-600 ml-11">
                  Manufacture and deliver as per specifications and timeline
                </p>
              </div>
            </div>
            <div className="mt-8">
              <Button
                onClick={() => onNavigate('contact')}
                variant="primary"
                size="lg"
                fullWidth
              >
                Government Enquiry Form
              </Button>
            </div>
          </div>
        </div>

        <div className="mb-20">
          <h2 className="text-3xl font-bold text-black mb-12 text-center">
            Government Sectors We Serve
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sectors.map((sector, index) => (
              <div key={index} className="bg-white p-8 border border-gray-200">
                <h3 className="text-xl font-bold text-black mb-4">{sector.title}</h3>
                <ul className="space-y-2">
                  {sector.items.map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-3">
                      <div className="w-1.5 h-1.5 bg-black rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-black text-white p-12 mb-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">
              Available Certifications & Documents
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="bg-white/10 p-6 border border-white/20">
                <h3 className="font-semibold mb-3">Business Credentials</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>GST Registration Certificate</li>
                  <li>PAN Card</li>
                  <li>MSME Registration</li>
                  <li>Trade License</li>
                  <li>Bank Account Details</li>
                </ul>
              </div>
              <div className="bg-white/10 p-6 border border-white/20">
                <h3 className="font-semibold mb-3">Quality Certifications</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>ISO 9001:2015</li>
                  <li>Product Test Reports</li>
                  <li>Material Certificates</li>
                  <li>Manufacturing License</li>
                  <li>Quality Policy Document</li>
                </ul>
              </div>
            </div>
            <div className="text-center mt-8">
              <Button
                onClick={() => onNavigate('certifications')}
                variant="outline"
                size="lg"
              >
                View All Certifications
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <div className="bg-gray-50 p-8 border border-gray-200">
            <h3 className="text-2xl font-bold text-black mb-6">Product Categories</h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-black mb-2">Sportswear Supply</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Sports uniforms, track suits, jerseys, and athletic wear for government sports
                  programs, schools, and training academies.
                </p>
                <Button
                  onClick={() => onNavigate('products', 'sportswear')}
                  variant="outline"
                  size="sm"
                >
                  View Sportswear
                </Button>
              </div>
              <div>
                <h4 className="font-semibold text-black mb-2">Medical Wear Supply</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Medical scrubs, hospital uniforms, lab coats, and PPE for government healthcare
                  facilities and programs.
                </p>
                <Button
                  onClick={() => onNavigate('products', 'medicalwear')}
                  variant="outline"
                  size="sm"
                >
                  View Medical Wear
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-8 border border-gray-200">
            <h3 className="text-2xl font-bold text-black mb-6">Get Started</h3>
            <p className="text-gray-600 mb-6">
              For government tenders, bulk procurement enquiries, or institutional supply
              requirements, contact our dedicated government sales team.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-black" />
                <span className="text-sm text-gray-700">Response within 24 hours</span>
              </div>
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-black" />
                <span className="text-sm text-gray-700">Complete documentation provided</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-black" />
                <span className="text-sm text-gray-700">Competitive quotes guaranteed</span>
              </div>
            </div>
            <div className="mt-8">
              <Button
                onClick={() => onNavigate('contact')}
                variant="primary"
                size="lg"
                fullWidth
              >
                Submit Enquiry
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-8 border border-gray-200">
          <h2 className="text-xl font-bold text-black mb-4">
            Government Approved Sportswear & Medical Wear Supplier in Madhya Pradesh
          </h2>
          <p className="text-gray-600">
            Emission by Krish Sports is a registered government vendor and approved supplier of
            sportswear and medical wear for government departments and public institutions in
            Jabalpur, Madhya Pradesh, and across India. We participate in government tenders for
            sports uniforms, athletic wear, medical scrubs, hospital uniforms, and PPE clothing
            supply. Our GST registration, ISO certification, and tender-ready documentation make us a
            preferred choice for government procurement officers seeking reliable manufacturers for
            bulk institutional orders. We have successfully supplied to state sports departments,
            government hospitals, public schools, and various government programs across Madhya
            Pradesh.
          </p>
        </div>
      </div>
    </div>
  );
}
