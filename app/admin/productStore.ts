// productStore.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

// Product interface
export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  subCategory: string;
  quantity: string;
  image: string | null;
}

// Storage key
const PRODUCTS_STORAGE_KEY = 'products_data';

// Global products array
let products: Product[] = [];

// Listeners for state changes
let listeners: (() => void)[] = [];

// Load products from storage
export const loadProductsFromStorage = async (): Promise<void> => {
  try {
    const storedProducts = await AsyncStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (storedProducts) {
      products = JSON.parse(storedProducts);
      notifyListeners();
    }
  } catch (error) {
    console.error('Error loading products from storage:', error);
  }
};

// Save products to storage
const saveProductsToStorage = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
  } catch (error) {
    console.error('Error saving products to storage:', error);
  }
};

// Notify all listeners when products change
const notifyListeners = () => {
  listeners.forEach(listener => listener());
};

// Subscribe to store changes
export const subscribe = (listener: () => void) => {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter(l => l !== listener);
  };
};

// Check if product already exists
export const productExists = (name: string, category?: string): { exists: boolean; message: string } => {
  const nameLower = name.toLowerCase().trim();
  const categoryLower = category?.toLowerCase().trim();
  
  if (category) {
    const exists = products.some(product => 
      product.name.toLowerCase() === nameLower && 
      product.category.toLowerCase() === categoryLower
    );
    
    if (exists) {
      return { 
        exists: true, 
        message: `Product "${name}" already exists in category "${category}"` 
      };
    }
  } else {
    const exists = products.some(product => product.name.toLowerCase() === nameLower);
    if (exists) {
      return { 
        exists: true, 
        message: `Product "${name}" already exists` 
      };
    }
  }
  
  return { exists: false, message: '' };
};

// Add new product function with validation
export const addProduct = (productData: Omit<Product, 'id'>): { success: boolean; message: string } => {
  // Check if product already exists
  const checkResult = productExists(productData.name, productData.category);
  if (checkResult.exists) {
    return { success: false, message: checkResult.message };
  }
  
  const newProduct: Product = {
    ...productData,
    id: Date.now().toString()
  };
  products.unshift(newProduct);
  saveProductsToStorage();
  notifyListeners();
  return { success: true, message: 'Product added successfully' };
};

// Get all products function
export const getAllProducts = (): Product[] => {
  return [...products];
};

// Get product by ID function
export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

// Update product function with validation
export const updateProduct = (id: string, updatedData: Partial<Product>): { success: boolean; message: string } => {
  const productIndex = products.findIndex(product => product.id === id);
  if (productIndex > -1) {
    const product = products[productIndex];
    const newName = updatedData.name || product.name;
    const newCategory = updatedData.category || product.category;
    
    // Check if another product with same name and category exists
    const duplicateExists = products.some((p, index) => 
      index !== productIndex &&
      p.name.toLowerCase() === newName.toLowerCase() &&
      p.category.toLowerCase() === newCategory.toLowerCase()
    );
    
    if (duplicateExists) {
      return { 
        success: false, 
        message: `Product "${newName}" already exists in category "${newCategory}"` 
      };
    }
    
    products[productIndex] = { ...products[productIndex], ...updatedData };
    saveProductsToStorage();
    notifyListeners();
    return { success: true, message: 'Product updated successfully' };
  }
  return { success: false, message: 'Product not found' };
};

// Delete product function
export const deleteProduct = (id: string): boolean => {
  const initialLength = products.length;
  products = products.filter(product => product.id !== id);
  saveProductsToStorage();
  notifyListeners();
  return products.length < initialLength;
};

// Get products by category function
export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(product => product.category === category);
};

// Get products by search term function
export const searchProducts = (searchTerm: string): Product[] => {
  const term = searchTerm.toLowerCase();
  return products.filter(product => 
    product.name.toLowerCase().includes(term) ||
    product.description.toLowerCase().includes(term) ||
    product.category.toLowerCase().includes(term)
  );
};

// Clear all products function
export const clearAllProducts = () => {
  products = [];
  saveProductsToStorage();
  notifyListeners();
};

// Get products count function
export const getProductsCount = (): number => {
  return products.length;
};

// Get categories list function
export const getCategories = (): string[] => {
  const categories = products.map(product => product.category);
  return [...new Set(categories)];
};

// Initialize products from storage on app start
loadProductsFromStorage();

// Default export
const productStore = {
  products,
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  searchProducts,
  clearAllProducts,
  getProductsCount,
  productExists,
  getCategories,
  subscribe,
  loadProductsFromStorage,
};

export default productStore;