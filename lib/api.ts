import type { ApiResponse } from '@/types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// ─── Token helpers ────────────────────────────────────────────────────────────

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

// ─── Core fetch wrapper ───────────────────────────────────────────────────────

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || `Request failed with status ${res.status}`);
  }

  return data as ApiResponse<T>;
}

// ─── HTTP method shortcuts ────────────────────────────────────────────────────

export const api = {
  get: <T>(path: string) =>
    request<T>(path, { method: 'GET' }),

  post: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    }),

  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: 'DELETE',
      body: body ? JSON.stringify(body) : undefined,
    }),
};

// ─── Auth endpoints ───────────────────────────────────────────────────────────

import type { AuthUser, LoginPayload, RegisterPayload, LoginResponse } from '@/types';

export const authApi = {
  login: (payload: LoginPayload) =>
    api.post<LoginResponse>('/auth/login', payload),

  register: (payload: RegisterPayload) =>
    api.post<LoginResponse>('/auth/register', payload),

  logout: () => api.post('/auth/logout'),

  me: () => api.get<{ user: AuthUser }>('/auth/me'),
};

// ─── Products endpoints ───────────────────────────────────────────────────────

import type { Product, ProductFilters } from '@/types';

export const productsApi = {
  getAll: (filters: ProductFilters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== '' && v !== null) params.set(k, String(v));
    });
    const qs = params.toString();
    return api.get<{ products: Product[]; pagination: unknown }>(`/products${qs ? `?${qs}` : ''}`);
  },

  getById: (id: string) =>
    api.get<{ product: Product }>(`/products/${id}`),

  getRelated: (id: string, limit = 4) =>
    api.get<{ products: Product[] }>(`/products/${id}/related?limit=${limit}`),

  search: (q: string) =>
    api.get<{ products: Product[] }>(`/products/search?q=${encodeURIComponent(q)}`),

  create: (data: Partial<Product>) =>
    api.post<{ product: Product }>('/products', data),

  update: (id: string, data: Partial<Product>) =>
    api.put<{ product: Product }>(`/products/${id}`, data),

  delete: (id: string) =>
    api.delete(`/products/${id}`),
};

// ─── Categories endpoints ─────────────────────────────────────────────────────

import type { Category } from '@/types';

export const categoriesApi = {
  getAll: () =>
    api.get<{ categories: Category[] }>('/categories'),

  getById: (id: string) =>
    api.get<{ category: Category }>(`/categories/${id}`),

  getBySlug: (slug: string) =>
    api.get<{ category: Category; subcategories: Category[] }>(`/categories/slug/${slug}`),

  create: (data: Partial<Category>) =>
    api.post<{ category: Category }>('/categories', data),

  update: (id: string, data: Partial<Category>) =>
    api.put<{ category: Category }>(`/categories/${id}`, data),

  delete: (id: string) =>
    api.delete(`/categories/${id}`),
};

// ─── Cart endpoints ───────────────────────────────────────────────────────────

import type { Cart } from '@/types';

export const cartApi = {
  get: () => api.get<{ cart: Cart }>('/cart'),

  add: (productId: string, quantity = 1) =>
    api.post<{ cart: Cart }>('/cart/add', { productId, quantity }),

  update: (productId: string, quantity: number) =>
    api.put<{ cart: Cart }>('/cart', { productId, quantity }),

  remove: (productId: string) =>
    api.delete<{ cart: Cart }>('/cart', { productId }),

  clear: () => api.delete('/cart/clear'),
};

// ─── Orders endpoints ─────────────────────────────────────────────────────────

import type { Order, CreateOrderPayload, StripeSessionPayload } from '@/types';

export const ordersApi = {
  getAll: (page = 1, limit = 10) =>
    api.get<{ orders: Order[]; pagination: unknown }>(`/orders?page=${page}&limit=${limit}`),

  getById: (id: string) =>
    api.get<{ order: Order }>(`/orders/${id}`),

  create: (payload: CreateOrderPayload) =>
    api.post<{ order: Order }>('/orders', payload),

  cancel: (id: string) =>
    api.put<{ order: Order }>(`/orders/${id}/cancel`),

  updateStatus: (id: string, data: { orderStatus?: string; paymentStatus?: string; trackingNumber?: string }) =>
    api.put<{ order: Order }>(`/orders/${id}/status`, data),

  getStats: () =>
    api.get('/orders/stats'),

  getAllAdmin: (page = 1, limit = 20) =>
    api.get<{ orders: Order[]; pagination: unknown }>(`/orders/admin/all?page=${page}&limit=${limit}`),
};

export const paymentsApi = {
  createStripeSession: (payload: StripeSessionPayload) =>
    api.post<{ url: string; id: string }>('/payments/stripe-session', payload),

  confirmStripeSession: (sessionId: string) =>
    api.post<{ order: Order }>('/payments/stripe-confirm', { sessionId }),
};

// ─── Reviews endpoints ────────────────────────────────────────────────────────

import type { Review, ReviewPayload } from '@/types';

export const reviewsApi = {
  getForProduct: (productId: string, page = 1, sort = 'newest') =>
    api.get<{ reviews: Review[]; pagination: unknown; ratingBreakdown: unknown }>(
      `/reviews/product/${productId}?page=${page}&sort=${sort}`
    ),

  create: (payload: ReviewPayload) =>
    api.post<{ review: Review }>(`/reviews/product/${payload.productId}`, payload),

  update: (reviewId: string, data: Partial<ReviewPayload>) =>
    api.put<{ review: Review }>(`/reviews/${reviewId}`, data),

  delete: (reviewId: string) =>
    api.delete(`/reviews/${reviewId}`),

  markHelpful: (reviewId: string) =>
    api.put(`/reviews/${reviewId}/helpful`),

  getUserReviews: () =>
    api.get<{ reviews: Review[] }>('/reviews/user'),

  getStats: () =>
    api.get('/reviews/stats'),
};
