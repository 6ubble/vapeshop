export const ENDPOINTS = {
    // Products
    PRODUCTS: '/products',
    PRODUCT_BY_ID: (id: string) => `/products/${id}`,
    PRODUCTS_BY_CATEGORY: (category: string) => `/products?category=${category}`,
    PRODUCT_SEARCH: (query: string) => `/products/search?q=${encodeURIComponent(query)}`,
    
    // Users
    USER_PROFILE: (userId: number) => `/users/${userId}`,
    USER_FAVORITES: (userId: number) => `/users/${userId}/favorites`,
    
    // Orders
    ORDERS: '/orders',
    ORDER_BY_ID: (id: string) => `/orders/${id}`,
    USER_ORDERS: (userId: string) => `/orders?userId=${userId}`,
    ORDER_STATUS: (id: string) => `/orders/${id}/status`,
    
    // Cart
    CART: '/cart',
    CART_ITEM: (itemId: string) => `/cart/${itemId}`,
    
    // Misc
    CATEGORIES: '/categories',
    BRANDS: '/brands',
    UPLOAD: '/upload'
  } as const;
  