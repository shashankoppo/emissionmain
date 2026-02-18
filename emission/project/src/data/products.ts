import { Product } from '../types';

export const products: Product[] = [
  {
    id: 'sp-tshirt-001',
    name: 'Performance Training T-Shirt',
    category: 'sportswear',
    subcategory: 'T-Shirts',
    description: 'Premium moisture-wicking training t-shirt engineered for peak athletic performance. Manufactured with advanced breathable fabric technology, ideal for sports teams, institutions, and bulk orders.',
    shortDescription: 'Moisture-wicking performance tee for athletes',
    price: 599,
    wholesalePrice: 399,
    image: 'https://images.pexels.com/photos/8844356/pexels-photo-8844356.jpeg?auto=compress&cs=tinysrgb&w=800',
    images: [
      'https://images.pexels.com/photos/8844356/pexels-photo-8844356.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    features: [
      'Advanced moisture-wicking technology',
      'Anti-bacterial fabric treatment',
      'Reinforced stitching for durability',
      'Available in custom team colors',
      'GSM: 180-220'
    ],
    specifications: {
      'Material': '100% Polyester',
      'GSM': '180-220',
      'Sizes': 'XS to 5XL',
      'MOQ': '50 pieces',
      'Customization': 'Logo, Colors, Design'
    },
    inStock: true,
    moq: 50
  },
  {
    id: 'sp-tracksuit-001',
    name: 'Professional Sports Tracksuit',
    category: 'sportswear',
    subcategory: 'Tracksuits',
    description: 'Complete tracksuit set manufactured for professional athletes and sports institutions. Premium quality fabric with superior durability for intensive training and competition use.',
    shortDescription: 'Professional grade tracksuit for teams',
    price: 1899,
    wholesalePrice: 1299,
    image: 'https://images.pexels.com/photos/8844118/pexels-photo-8844118.jpeg?auto=compress&cs=tinysrgb&w=800',
    images: [
      'https://images.pexels.com/photos/8844118/pexels-photo-8844118.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    features: [
      'Full zip jacket with side pockets',
      'Elastic waistband with drawstring',
      'Breathable mesh lining',
      'Weather-resistant outer layer',
      'Custom branding available'
    ],
    specifications: {
      'Material': 'Polyester blend',
      'GSM': '250-280',
      'Sizes': 'S to 4XL',
      'MOQ': '30 sets',
      'Customization': 'Full customization available'
    },
    inStock: true,
    moq: 30
  },
  {
    id: 'sp-jersey-001',
    name: 'Team Sports Jersey',
    category: 'sportswear',
    subcategory: 'Jerseys',
    description: 'Lightweight sports jersey designed for maximum performance. Perfect for football, cricket, athletics teams, schools, and government sports programs across Madhya Pradesh.',
    shortDescription: 'Lightweight performance jersey',
    price: 799,
    wholesalePrice: 549,
    image: 'https://images.pexels.com/photos/8844283/pexels-photo-8844283.jpeg?auto=compress&cs=tinysrgb&w=800',
    images: [
      'https://images.pexels.com/photos/8844283/pexels-photo-8844283.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    features: [
      'Ultra-lightweight construction',
      'Quick-dry technology',
      'Sublimation printing compatible',
      'Mesh ventilation panels',
      'Ideal for bulk institutional orders'
    ],
    specifications: {
      'Material': '100% Polyester',
      'GSM': '140-160',
      'Sizes': 'XS to 3XL',
      'MOQ': '25 pieces',
      'Customization': 'Numbers, names, logos'
    },
    inStock: true,
    moq: 25
  },
  {
    id: 'sp-shorts-001',
    name: 'Athletic Training Shorts',
    category: 'sportswear',
    subcategory: 'Shorts',
    description: 'High-performance athletic shorts with advanced fabric technology. Manufactured for sports academies, schools, and government athletic programs in Jabalpur and across India.',
    shortDescription: 'Breathable athletic shorts',
    price: 499,
    wholesalePrice: 349,
    image: 'https://images.pexels.com/photos/7690986/pexels-photo-7690986.jpeg?auto=compress&cs=tinysrgb&w=800',
    images: [
      'https://images.pexels.com/photos/7690986/pexels-photo-7690986.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    features: [
      'Elastic waistband with drawcord',
      'Side mesh pockets',
      'Moisture-wicking fabric',
      'Anti-chafe inner lining',
      'Bulk order friendly'
    ],
    specifications: {
      'Material': 'Polyester blend',
      'GSM': '160-180',
      'Sizes': 'S to 3XL',
      'MOQ': '50 pieces',
      'Customization': 'Colors and logos'
    },
    inStock: true,
    moq: 50
  },
  {
    id: 'mw-scrubs-001',
    name: 'Medical Scrubs Set',
    category: 'medicalwear',
    subcategory: 'Scrubs',
    description: 'Professional medical scrubs manufactured for hospitals, clinics, and healthcare institutions. Durable, comfortable, and compliant with medical industry standards. Ideal for government hospital procurement.',
    shortDescription: 'Professional healthcare scrubs',
    price: 899,
    wholesalePrice: 649,
    image: 'https://images.pexels.com/photos/6749773/pexels-photo-6749773.jpeg?auto=compress&cs=tinysrgb&w=800',
    images: [
      'https://images.pexels.com/photos/6749773/pexels-photo-6749773.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    features: [
      'Multiple utility pockets',
      'Easy-care fabric',
      'Color-fast and shrink-resistant',
      'Antimicrobial treatment available',
      'Hospital-grade quality'
    ],
    specifications: {
      'Material': 'Poly-cotton blend',
      'GSM': '180-200',
      'Sizes': 'XS to 4XL',
      'MOQ': '100 sets',
      'Customization': 'Colors and embroidery'
    },
    inStock: true,
    moq: 100
  },
  {
    id: 'mw-labcoat-001',
    name: 'Professional Lab Coat',
    category: 'medicalwear',
    subcategory: 'Lab Coats',
    description: 'Premium quality lab coats for medical professionals, laboratories, and pharmaceutical companies. Manufactured to meet institutional requirements for government and private sector procurement in Madhya Pradesh.',
    shortDescription: 'Premium medical lab coat',
    price: 1099,
    wholesalePrice: 799,
    image: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=800',
    images: [
      'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    features: [
      'Three front pockets',
      'Button-front closure',
      'Stain-resistant fabric',
      'Professional cut and fit',
      'Bulk institutional supply available'
    ],
    specifications: {
      'Material': '65% Polyester, 35% Cotton',
      'GSM': '200-220',
      'Sizes': 'S to 4XL',
      'MOQ': '50 pieces',
      'Customization': 'Embroidery, colors'
    },
    inStock: true,
    moq: 50
  },
  {
    id: 'mw-uniform-001',
    name: 'Hospital Staff Uniform',
    category: 'medicalwear',
    subcategory: 'Hospital Uniforms',
    description: 'Complete hospital staff uniform manufactured for healthcare facilities. Designed for comfort during long shifts, suitable for nurses, attendants, and support staff in government and private hospitals.',
    shortDescription: 'Comfortable hospital staff uniform',
    price: 799,
    wholesalePrice: 599,
    image: 'https://images.pexels.com/photos/8460157/pexels-photo-8460157.jpeg?auto=compress&cs=tinysrgb&w=800',
    images: [
      'https://images.pexels.com/photos/8460157/pexels-photo-8460157.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    features: [
      'Breathable fabric for all-day comfort',
      'Easy to maintain and wash',
      'Color-coded options available',
      'Professional appearance',
      'Government tender compliant'
    ],
    specifications: {
      'Material': 'Poly-cotton',
      'GSM': '170-190',
      'Sizes': 'S to 3XL',
      'MOQ': '100 pieces',
      'Customization': 'Colors and badges'
    },
    inStock: true,
    moq: 100
  },
  {
    id: 'mw-ppe-001',
    name: 'PPE Medical Coveralls',
    category: 'medicalwear',
    subcategory: 'PPE Clothing',
    description: 'Medical-grade PPE coveralls for healthcare workers and medical facilities. Manufactured to international safety standards for hospitals and healthcare institutions across India.',
    shortDescription: 'Medical-grade PPE coveralls',
    price: 399,
    wholesalePrice: 279,
    image: 'https://images.pexels.com/photos/3902881/pexels-photo-3902881.jpeg?auto=compress&cs=tinysrgb&w=800',
    images: [
      'https://images.pexels.com/photos/3902881/pexels-photo-3902881.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    features: [
      'Fluid-resistant material',
      'Full-body coverage',
      'Elastic cuffs and ankles',
      'Front zipper closure',
      'Certified for medical use'
    ],
    specifications: {
      'Material': 'Non-woven fabric',
      'GSM': '60-80',
      'Sizes': 'M to XXL',
      'MOQ': '500 pieces',
      'Customization': 'Limited'
    },
    inStock: true,
    moq: 500
  }
];

export const categories = [
  {
    id: 'sportswear',
    name: 'Sportswear',
    slug: 'sportswear',
    description: 'Premium sportswear manufactured for athletes, teams, and institutions',
    image: 'https://images.pexels.com/photos/8844356/pexels-photo-8844356.jpeg?auto=compress&cs=tinysrgb&w=800',
    subcategories: ['T-Shirts', 'Tracksuits', 'Jerseys', 'Shorts']
  },
  {
    id: 'medicalwear',
    name: 'Medical Wear',
    slug: 'medical-wear',
    description: 'Professional medical clothing for healthcare institutions',
    image: 'https://images.pexels.com/photos/6749773/pexels-photo-6749773.jpeg?auto=compress&cs=tinysrgb&w=800',
    subcategories: ['Scrubs', 'Lab Coats', 'Hospital Uniforms', 'PPE Clothing']
  }
];
