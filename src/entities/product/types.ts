export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    images: string[];
    category: string;
    brand: string;
    inStock: boolean;
    stockCount: number;
    rating: number;
    reviewsCount: number;
    tags: string[];
    specifications: ProductSpecification[];
    isPopular: boolean;
    isNew: boolean;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface ProductSpecification {
    name: string;
    value: string;
  }