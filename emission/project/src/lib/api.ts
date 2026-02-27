import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const formatImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    const serverUrl = API_BASE_URL.replace('/api', '');
    return `${serverUrl}${url.startsWith('/') ? '' : '/'}${url}`;
};

export interface Product {
    id: string;
    name: string;
    slug: string;
    category: 'sportswear' | 'medicalwear';
    subcategory: string;
    description: string;
    shortDescription: string;
    price: number;
    wholesalePrice: number;
    retailPrice?: number;
    image: string; // Primary image for backward compatibility
    images: string[];
    features: string[];
    specifications: Record<string, string>;
    inStock: boolean;
    moq: number;
    availableSizes?: string[];
    availableColors?: string[];
    allowsEmbroidery?: boolean;
    gstPercentage?: number;
    shippingIncluded?: boolean;
}

export interface Enquiry {
    name: string;
    email: string;
    phone: string;
    company?: string;
    enquiryType: string;
    message: string;
}

export interface Order {
    customerName: string;
    customerEmail: string;
    totalAmount: number;
    shippingAddress: string;
    items: Array<{
        productId: string;
        quantity: number;
        price: number;
    }>;
}

const safeJSONParse = (val: any, fallback: any) => {
    if (typeof val === 'string') {
        try {
            return JSON.parse(val);
        } catch (e) {
            console.error('Failed to parse JSON:', val, e);
            return fallback;
        }
    }
    return val || fallback;
};

// Product API
export const productAPI = {
    getAll: async (): Promise<Product[]> => {
        const response = await api.get('/products');
        return response.data.map((p: any) => {
            let images = safeJSONParse(p.images, []);
            if (Array.isArray(images)) {
                images = images.map((img: string) => formatImageUrl(img));
            }
            return {
                ...p,
                images,
                image: images && images.length > 0 ? images[0] : '',
                features: safeJSONParse(p.features, []),
                specifications: safeJSONParse(p.specifications, {}),
                availableSizes: safeJSONParse(p.availableSizes, []),
                availableColors: safeJSONParse(p.availableColors, []),
                price: parseFloat(p.price) || 0,
                retailPrice: p.retailPrice ? parseFloat(p.retailPrice) : undefined,
                wholesalePrice: p.wholesalePrice ? parseFloat(p.wholesalePrice) : undefined,
            };
        });
    },

    getById: async (id: string): Promise<Product> => {
        const response = await api.get(`/products/${id}`);
        const p = response.data;
        let images = safeJSONParse(p.images, []);
        if (Array.isArray(images)) {
            images = images.map((img: string) => formatImageUrl(img));
        }
        return {
            ...p,
            images,
            image: images && images.length > 0 ? images[0] : '',
            features: safeJSONParse(p.features, []),
            specifications: safeJSONParse(p.specifications, {}),
            availableSizes: safeJSONParse(p.availableSizes, []),
            availableColors: safeJSONParse(p.availableColors, []),
            price: parseFloat(p.price) || 0,
            retailPrice: p.retailPrice ? parseFloat(p.retailPrice) : undefined,
            wholesalePrice: p.wholesalePrice ? parseFloat(p.wholesalePrice) : undefined,
        };
    },

    getByCategory: async (category: string): Promise<Product[]> => {
        const products = await productAPI.getAll();
        return products.filter(p => p.category === category);
    },
};

// Enquiry API
export const enquiryAPI = {
    create: async (enquiry: Enquiry) => {
        const response = await api.post('/enquiries', enquiry);
        return response.data;
    },
};

// Order API
export const orderAPI = {
    create: async (order: Order) => {
        const response = await api.post('/orders', order);
        return response.data;
    },

    getAll: async () => {
        const response = await api.get('/orders');
        return response.data;
    },
};

// Banner API
export interface Banner {
    id: string;
    title: string;
    subtitle: string;
    imageUrl: string;
    link: string;
    active: boolean;
    order: number;
}

export const bannerAPI = {
    getAll: async (): Promise<Banner[]> => {
        const response = await api.get('/banners');
        return response.data.map((b: any) => ({
            ...b,
            imageUrl: formatImageUrl(b.imageUrl)
        }));
    },
};

// Featured Collection API
export interface FeaturedCollection {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    link: string;
    active: boolean;
    order: number;
}

export const collectionAPI = {
    getAll: async (): Promise<FeaturedCollection[]> => {
        const response = await api.get('/collections');
        return response.data.map((c: any) => ({
            ...c,
            imageUrl: formatImageUrl(c.imageUrl)
        }));
    },
};

// Coupon API
export const couponAPI = {
    validate: async (code: string, orderAmount: number) => {
        const response = await api.post('/coupons/validate', { code, orderAmount });
        return response.data;
    },
};

// Customer Auth API
export const customerAPI = {
    register: async (data: { name: string; email: string; password: string; phone?: string }) => {
        const response = await api.post('/customers/register', data);
        return response.data as { token: string; customer: { id: string; name: string; email: string; phone?: string } };
    },
    login: async (email: string, password: string) => {
        const response = await api.post('/customers/login', { email, password });
        return response.data as { token: string; customer: { id: string; name: string; email: string; phone?: string } };
    },
    getOrders: async () => {
        const response = await api.get('/customers/orders');
        return response.data.orders;
    },
};

export default api;
