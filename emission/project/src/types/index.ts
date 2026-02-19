export interface ProductVariant {
  id: string;
  productId: string;
  size: string;
  color: string;
  sku: string;
  stock: number;
  priceAdjustment: number;
}

export interface EmbroideryOption {
  id: string;
  productId: string;
  position: 'left-chest' | 'right-chest' | 'back' | 'sleeves';
  maxChars: number;
  price: number;
  available: boolean;
}

export interface EmbroideryCustomization {
  text: string;
  position: string;
  fontStyle?: string;
  threadColor?: string;
}

export interface Product {
  id: string;
  name: string;
  category: 'sportswear' | 'medicalwear';
  subcategory: string;
  description: string;
  shortDescription: string;
  price: number;
  wholesalePrice: number;
  retailPrice?: number;
  image: string;
  images: string[];
  features: string[];
  specifications: Record<string, string>;
  inStock: boolean;
  moq: number;
  availableSizes?: string[];
  availableColors?: string[];
  variants?: ProductVariant[];
  allowsEmbroidery?: boolean;
  embroideryOptions?: EmbroideryOption[];
  gstPercentage?: number;
  shippingIncluded?: boolean;
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  embroidery?: EmbroideryCustomization | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  subcategories: string[];
}

export interface EnquiryForm {
  name: string;
  email: string;
  phone: string;
  company?: string;
  enquiryType: 'wholesale' | 'government' | 'retail' | 'custom';
  message: string;
  productId?: string;
}

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
  image?: string;
}

export interface CustomerOrder {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'confirmed' | 'processing' | 'shipped' | 'out-for-delivery' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  shippingAddress: string;
  trackingId?: string;
  trackingUrl?: string;
  estimatedDelivery?: string;
  createdAt: string;
  updatedAt: string;
}

export type PageType =
  | 'home'
  | 'products'
  | 'product-detail'
  | 'industries'
  | 'oem'
  | 'government'
  | 'about'
  | 'certifications'
  | 'contact'
  | 'cart'
  | 'checkout'
  | 'account'
  | 'login'
  | 'register'
  | 'orders'
  | 'track-order'
  | 'order-detail'
  | 'privacy'
  | 'terms'
  | 'returns'
  | 'faq';
