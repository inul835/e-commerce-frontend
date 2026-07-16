// ─── API Response Wrappers ────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev?: boolean;
}

export interface PaginatedData<T> {
  pagination: PaginationMeta;
  [key: string]: T[] | PaginationMeta;
}

// ─── User ─────────────────────────────────────────────────────────────────────

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface User {
  _id: string;
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin';
  avatar?: string;
  address?: Address;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'customer' | 'admin';
}

export interface LoginResponse {
  user: AuthUser;
  token: string;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

// ─── Category ─────────────────────────────────────────────────────────────────

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parent?: string | Category;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Product ──────────────────────────────────────────────────────────────────

export interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  discount?: number;
  category: Category | string;
  images: string[];
  inventory: number;
  sku: string;
  rating: number;
  reviewCount: number;
  specifications?: Record<string, string>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'newest' | 'price-asc' | 'price-desc' | 'rating';
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

export interface CartItem {
  product: Product;
  quantity: number;
  itemTotal?: number;
  itemDiscount?: number;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  subtotal: number;
  totalDiscount: number;
  total: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Order ────────────────────────────────────────────────────────────────────

export type PaymentMethod = 'credit_card' | 'debit_card' | 'paypal' | 'stripe';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  product: Product;
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  orderNumber: string;
  user: string | User;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: Address;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  shippingCost: number;
  tax: number;
  notes?: string;
  trackingNumber?: string;
  summary?: {
    subtotal: number;
    tax: number;
    shippingCost: number;
    total: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderPayload {
  shippingAddress: Address;
  paymentMethod: PaymentMethod;
  notes?: string;
}

export interface StripeSessionPayload {
  shippingAddress: Address;
  notes?: string;
}

// ─── Review ───────────────────────────────────────────────────────────────────

export interface Review {
  _id: string;
  product: string | Product;
  user: AuthUser & { avatar?: string };
  rating: number;
  title: string;
  comment: string;
  helpfulCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewPayload {
  productId: string;
  rating: number;
  title: string;
  comment: string;
}

export interface RatingBreakdown {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
}

// ─── Admin Stats ──────────────────────────────────────────────────────────────

export interface OrderStats {
  orders: {
    total: number;
    pending: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };
  revenue: {
    totalRevenue: number;
    averageOrderValue: number;
    totalTax: number;
    totalShipping: number;
  };
}
