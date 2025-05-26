import { Category, Product, LoginCredentials, RegisterData, User } from "@/types/api";

const API_URL = "https://api.escuelajs.co/api/v1";

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) throw new Error("Failed to fetch products");
    return await response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const fetchProductsByCategory = async (categoryId: number): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_URL}/products/?categoryId=${categoryId}`);
    if (!response.ok) throw new Error("Failed to fetch products by category");
    return await response.json();
  } catch (error) {
    console.error("Error fetching products by category:", error);
    throw error;
  }
};

export const fetchProduct = async (id: number): Promise<Product> => {
  try {
    const response = await fetch(`${API_URL}/products/${id}`);
    if (!response.ok) throw new Error("Failed to fetch product");
    return await response.json();
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await fetch(`${API_URL}/categories`);
    if (!response.ok) throw new Error("Failed to fetch categories");
    return await response.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const login = async (credentials: LoginCredentials): Promise<User> => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });
    
    if (!response.ok) throw new Error("Login failed");
    return await response.json();
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};

export const register = async (userData: RegisterData): Promise<User> => {
  try {
    const response = await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) throw new Error("Registration failed");
    return await response.json();
  } catch (error) {
    console.error("Error during registration:", error);
    throw error;
  }
};