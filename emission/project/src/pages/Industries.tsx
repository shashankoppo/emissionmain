import { Building, GraduationCap, Heart, Trophy, Users, Briefcase } from 'lucide-react';
import { PageType } from '../types';
import Button from '../components/UI/Button';

interface IndustriesProps {
  onNavigate: (page: PageType, productId?: string) => void;
}

export default function Industries({ onNavigate }: IndustriesProps) {
  const industries = [
    {
      icon: GraduationCap,
      title: 'Educational Institutions',
      description:
        'Schools, colleges, and universities requiring sports uniforms for students and athletic programs',
      applications: [
        'Physical education uniforms',
        'Sports team kits',
        'Interschool competition wear',
        'Athletic academy apparel',
      ],
    },
    {
      icon: Heart,
      title: 'Healthcare Facilities',
      description:
        'Hospitals, clinics, and medical centers requiring professional medical wear',
      applications: [
        'Hospital staff uniforms',
        'Medical scrubs and lab coats',
        'PPE clothing',
        'Clinic and diagnostic center wear',
      ],
    },
    {
      icon: Trophy,
      title: 'Sports Organizations',
      description:
        'Sports clubs, academies, and federations requiring high-performance athletic wear',
      applications: [
        'Team jerseys and uniforms',
        'Training wear',
        'Competition apparel',
        'Coaching staff clothing',
      ],
    },
    {
      icon: Building,
      title: 'Government Departments',
      description:
        'Government bodies requiring uniforms for sports programs and healthcare facilities',
      applications: [
        'State sports authority uniforms',
        'Government hospital wear',
        'Public health program clothing',
        'Youth sports initiative apparel',
      ],
    },
    {
      icon: Briefcase,
      title: 'Corporate Organizations',
      description:
        'Companies organizing sports events and corporate wellness programs',
      applications: [
        'Corporate sports day uniforms',
        'Employee wellness program wear',
        'Company sports team kits',
        'Corporate health initiatives',
      ],
    },
    {
      icon: Users,
      title: 'NGOs & Social Programs',
      description:
        'Non-profit organizations running community health and sports initiatives',
      applications: [
        'Community sports program wear',
        'Health awareness campaign clothing',
        'Social welfare program uniforms',
        'Youth development apparel',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h1 className="text-5xl font-bold mb-6">Industries We Serve</h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Providing specialized sportswear and medical wear solutions across diverse sectors in
            Jabalpur, Madhya Pradesh, and throughout India
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {industries.map((industry, index) => (
            <div key={index} className="bg-gray-50 p-8 border border-gray-200">
              <industry.icon className="w-12 h-12 text-black mb-4" />
              <h3 className="text-2xl font-bold text-black mb-3">{industry.title}</h3>
              <p className="text-gray-600 mb-6">{industry.description}</p>
              <h4 className="font-semibold text-black mb-3">Applications:</h4>
              <ul className="space-y-2">
                {industry.applications.map((app, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-black rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-700">{app}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="bg-black text-white p-12 mb-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Why Institutions Choose Emission</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div>
                <div className="text-4xl font-bold mb-2">15+</div>
                <p className="text-gray-300">Years Experience</p>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">500+</div>
                <p className="text-gray-300">Institutions Served</p>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">50K+</div>
                <p className="text-gray-300">Units Manufactured Monthly</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold text-black mb-6">
              Sector-Specific Solutions
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              We understand that each industry has unique requirements. Our team works closely with
              institutional buyers to develop customized solutions that meet specific needs:
            </p>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-black rounded-full mt-2" />
                <div>
                  <strong className="text-black">Custom Design & Branding:</strong>
                  <span className="text-gray-600">
                    {' '}
                    Tailored designs with institutional logos and colors
                  </span>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-black rounded-full mt-2" />
                <div>
                  <strong className="text-black">Compliance & Certification:</strong>
                  <span className="text-gray-600">
                    {' '}
                    Meeting industry-specific quality standards
                  </span>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-black rounded-full mt-2" />
                <div>
                  <strong className="text-black">Flexible MOQ:</strong>
                  <span className="text-gray-600">
                    {' '}
                    Adaptable minimum order quantities for different institutions
                  </span>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-black rounded-full mt-2" />
                <div>
                  <strong className="text-black">Dedicated Support:</strong>
                  <span className="text-gray-600">
                    {' '}
                    Account managers for institutional orders
                  </span>
                </div>
              </li>
            </ul>
          </div>
          <div className="bg-gray-50 p-8 border border-gray-200">
            <h3 className="text-2xl font-bold text-black mb-6">Get Industry-Specific Quote</h3>
            <p className="text-gray-600 mb-6">
              Contact us with your institutional requirements and receive a customized quote within 24
              hours.
            </p>
            <Button onClick={() => onNavigate('contact')} variant="primary" size="lg" fullWidth>
              Request Custom Quote
            </Button>
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-4">Or explore our capabilities:</p>
              <div className="space-y-2">
                <Button
                  onClick={() => onNavigate('oem')}
                  variant="outline"
                  size="sm"
                  fullWidth
                >
                  OEM Manufacturing
                </Button>
                <Button
                  onClick={() => onNavigate('government')}
                  variant="outline"
                  size="sm"
                  fullWidth
                >
                  Government Supply
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-8 border border-gray-200">
          <h2 className="text-xl font-bold text-black mb-4">
            Institutional Sportswear & Medical Wear Supplier in Madhya Pradesh
          </h2>
          <p className="text-gray-600">
            Emission by Krish Sports serves educational institutions, healthcare facilities, sports
            organizations, government departments, corporate entities, and NGOs across Jabalpur,
            Madhya Pradesh, and India. We specialize in bulk manufacturing of sports uniforms,
            athletic wear, medical scrubs, hospital uniforms, and PPE clothing for institutional
            buyers. Our OEM manufacturing capabilities, combined with government vendor status and
            GST compliance, make us the preferred choice for schools, colleges, hospitals, sports
            academies, and government procurement departments seeking reliable, quality-focused
            apparel manufacturing partners.
          </p>
        </div>
      </div>
    </div>
  );
}
