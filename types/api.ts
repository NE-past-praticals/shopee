export interface Product {
    id: number;
    title: string;
    price: number;
    description: string;
    category: Category;
    images: string[];
    creationAt?: string;
    updatedAt?: string;
  }
  
  export interface Category {
    id: number;
    name: string;
    image: string;
    creationAt?: string;
    updatedAt?: string;
  }
  
  export interface User {
    id: number;
    email: string;
    password: string;
    name: string;
    role: string;
    avatar: string;
  }
  
  export interface LoginCredentials {
    email: string;
    password: string;
  }
  
  export interface RegisterData {
    name: string;
    email: string;
    password: string;
    avatar: string;
  }
  
  export interface CartItem {
    product: Product;
    quantity: number;
  }