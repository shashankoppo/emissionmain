import { Target, Eye, Award, Users, Factory, TrendingUp } from 'lucide-react';
import { PageType } from '../types';
import Button from '../components/UI/Button';

interface AboutProps {
  onNavigate: (page: PageType, productId?: string) => void;
}

export default function About({ onNavigate }: AboutProps) {
  const values = [
    {
      icon: Award,
      title: 'Quality First',
      description:
        'Uncompromising commitment to manufacturing excellence and product quality',
    },
    {
      icon: Users,
      title: 'Customer Focus',
      description: 'Building long-term partnerships through reliability and service',
    },
    {
      icon: Factory,
      title: 'Innovation',
      description: 'Continuous improvement in manufacturing processes and technology',
    },
    {
      icon: TrendingUp,
      title: 'Sustainability',
      description: 'Responsible manufacturing practices for environmental stewardship',
    },
  ];

  const milestones = [
    { year: '2008', event: 'Company founded in Jabalpur, Madhya Pradesh' },
    { year: '2012', event: 'ISO 9001 certification achieved' },
    { year: '2015', event: 'Became registered government vendor' },
    { year: '2018', event: 'Expanded into medical wear manufacturing' },
    { year: '2020', event: 'PPE production during pandemic crisis' },
    { year: '2024', event: 'Serving 500+ institutions pan-India' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h1 className="text-5xl font-bold mb-6">About emission</h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Leading OEM manufacturer of sportswear and medical wear in Jabalpur, Madhya Pradesh
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-4xl font-bold text-black mb-6">About Us</h2>
            <p className="text-lg text-gray-600 mb-4">
              At emissíon, we believe performance is not just worn — it's emitted.
              Built to Perform, our brand is driven by innovation, precision, and purpose. We design
              and manufacture high-quality medical uniforms and performance sportswear that meet
              the real demands of professionals and athletes.
            </p>
            <p className="text-lg text-gray-600 mb-4">
              From long hospital shifts to intense training sessions, emissíon apparel is engineered
              for endurance, flexibility, and all-day comfort. Every stitch reflects durability.
              Every fabric is selected for breathability and movement. Every design is created to
              support those who push beyond limits.
            </p>
            <p className="text-lg text-gray-600 mb-6">
              As a manufacturing-led brand, we maintain complete control over quality — from fabric
              development to final production — ensuring consistency, strength, and excellence in
              every piece.
            </p>
            <div className="border-l-4 border-black pl-6 py-2">
              <p className="text-xl font-bold text-black italic">
                "emissíon is more than clothing. It's confidence in motion. It's strength in every step.
                It's performance you emit."
              </p>
              <p className="mt-2 text-gray-600 font-medium">— Built to Perform</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-gray-50 p-8 border border-gray-200 text-center">
              <div className="text-4xl font-bold text-black mb-2">15+</div>
              <p className="text-sm text-gray-600">Years in Business</p>
            </div>
            <div className="bg-gray-50 p-8 border border-gray-200 text-center">
              <div className="text-4xl font-bold text-black mb-2">500+</div>
              <p className="text-sm text-gray-600">Institutions Served</p>
            </div>
            <div className="bg-gray-50 p-8 border border-gray-200 text-center">
              <div className="text-4xl font-bold text-black mb-2">50K+</div>
              <p className="text-sm text-gray-600">Monthly Production</p>
            </div>
            <div className="bg-gray-50 p-8 border border-gray-200 text-center">
              <div className="text-4xl font-bold text-black mb-2">100+</div>
              <p className="text-sm text-gray-600">Team Members</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <div className="bg-gray-50 p-12 border border-gray-200">
            <Target className="w-12 h-12 text-black mb-6" />
            <h2 className="text-3xl font-bold text-black mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600">
              To manufacture world-class sportswear and medical wear that empowers athletes and
              healthcare professionals. We strive to be the preferred manufacturing partner for
              institutions seeking quality, reliability, and value.
            </p>
          </div>
          <div className="bg-black text-white p-12">
            <Eye className="w-12 h-12 mb-6" />
            <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
            <p className="text-lg text-gray-300">
              To establish emission as India's leading institutional apparel manufacturer, known for
              innovation, quality, and customer service. We aim to expand our capabilities while
              maintaining our commitment to excellence.
            </p>
          </div>
        </div>

        <div className="mb-20">
          <h2 className="text-3xl font-bold text-black mb-12 text-center">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-8 border border-gray-200 text-center">
                <value.icon className="w-12 h-12 text-black mx-auto mb-4" />
                <h3 className="font-semibold text-black mb-3">{value.title}</h3>
                <p className="text-sm text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 p-12 border border-gray-200 mb-20">
          <h2 className="text-3xl font-bold text-black mb-12 text-center">Our Journey</h2>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex items-start space-x-6">
                  <div className="bg-black text-white px-4 py-2 font-bold min-w-[80px] text-center">
                    {milestone.year}
                  </div>
                  <div className="flex-1 pt-2">
                    <p className="text-gray-700">{milestone.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <div>
            <h2 className="text-3xl font-bold text-black mb-6">Manufacturing Excellence</h2>
            <p className="text-gray-600 mb-6">
              Our manufacturing facility in Jabalpur is equipped with advanced machinery and
              technology for producing high-quality apparel at scale:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-black rounded-full mt-2" />
                <span className="text-gray-700">
                  Modern cutting and stitching equipment for precision manufacturing
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-black rounded-full mt-2" />
                <span className="text-gray-700">
                  Quality control systems at every stage of production
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-black rounded-full mt-2" />
                <span className="text-gray-700">
                  Skilled workforce trained in international quality standards
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-black rounded-full mt-2" />
                <span className="text-gray-700">
                  Efficient production planning for timely order fulfillment
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-black rounded-full mt-2" />
                <span className="text-gray-700">
                  In-house design and sampling capabilities
                </span>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-black mb-6">Why Choose emission?</h2>
            <p className="text-gray-600 mb-6">
              When you partner with Emission, you get more than just a manufacturer:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-black rounded-full mt-2" />
                <span className="text-gray-700">
                  Direct manufacturer pricing with no intermediaries
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-black rounded-full mt-2" />
                <span className="text-gray-700">
                  Complete customization options for branding and design
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-black rounded-full mt-2" />
                <span className="text-gray-700">
                  Flexible MOQ to accommodate different order sizes
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-black rounded-full mt-2" />
                <span className="text-gray-700">
                  GST compliant invoicing and tender-ready documentation
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-black rounded-full mt-2" />
                <span className="text-gray-700">
                  Pan-India delivery through reliable logistics partners
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-black text-white p-12 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Partner With Us?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join hundreds of institutions that trust emission for their sportswear and medical wear
            requirements
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => onNavigate('contact')} variant="outline" size="lg">
              Get In Touch
            </Button>
            <Button onClick={() => onNavigate('products')} variant="outline" size="lg">
              View Products
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
