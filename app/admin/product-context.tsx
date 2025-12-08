// product-context.tsx (UPDATED)
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the Product interface - UPDATED WITH unitOptions
export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  subCategory: string;
  quantity: number;
  image: string | null;
  units: string[];        // Admin-defined units [kg, gms, dozen, pieces...]
  unitOptions: string[];  // NEW: Unit values [750, 500, 250, 200, 100, 50, 1, custom]
  sameDayAvailable: boolean;
  nextDayAvailable: boolean;
}

// Define the context type
interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => { success: boolean; message: string };
  deleteProduct: (id: string) => { success: boolean; message: string };
  updateProduct: (id: string, updatedData: Partial<Product>) => { success: boolean; message: string };
  checkProductExists: (name: string, category?: string) => { exists: boolean; message: string };
  loading: boolean;
}

// Create the context with undefined initial value
const ProductContext = createContext<ProductContextType | undefined>(undefined);

// Storage key for AsyncStorage
const PRODUCTS_STORAGE_KEY = 'products_data';

// ProductProvider component
export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // State for products list
  const [products, setProducts] = useState<Product[]>([]);
  
  // State for loading indicator
  const [loading, setLoading] = useState(true);

  // Load products from AsyncStorage when component mounts
  useEffect(() => {
    // Call the loadProductsFromStorage function
    loadProductsFromStorage();
  }, []);

  // Function to load products from AsyncStorage
  const loadProductsFromStorage = async () => {
    try {
      // Set loading to true to show loading indicator
      setLoading(true);
      
      // Get products from AsyncStorage using the storage key
      const storedProducts = await AsyncStorage.getItem(PRODUCTS_STORAGE_KEY);
      
      // Check if there are stored products
      if (storedProducts) {
        // Parse the stored products from JSON string to JavaScript array
        const parsedProducts: any[] = JSON.parse(storedProducts);
        
        // Fix: Ensure all products have proper units and unitOptions arrays
        const fixedProducts = parsedProducts.map(product => ({
          // Spread all existing product properties
          ...product,
          // Fix the units field
          units: product.units 
            ? (Array.isArray(product.units) ? product.units : [product.units])
            : [],
          // Fix the unitOptions field - NEW
          unitOptions: product.unitOptions 
            ? (Array.isArray(product.unitOptions) ? product.unitOptions : [product.unitOptions])
            : (product.units ? [] : ['1']) // Default to ['1'] if no unitOptions exists
        }));
        
        // Update the state with the fixed products
        setProducts(fixedProducts);
      } else {
        // If no stored products exist, set empty array
        setProducts([]);
      }
    } catch (error) {
      // Handle any errors that occur during loading
      console.error('Error loading products from storage:', error);
      
      // Set empty array as fallback
      setProducts([]);
    } finally {
      // Set loading to false regardless of success or failure
      setLoading(false);
    }
  };

  // Function to save products to AsyncStorage
  const saveProductsToStorage = async (productsToSave: Product[]) => {
    try {
      // Convert products array to JSON string and save to AsyncStorage
      await AsyncStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(productsToSave));
    } catch (error) {
      // Handle any errors that occur during saving
      console.error('Error saving products to storage:', error);
    }
  };

  // Function to check if product already exists
  const checkProductExists = (name: string, category?: string): { exists: boolean; message: string } => {
    // Convert name to lowercase and trim whitespace for case-insensitive comparison
    const nameLower = name.toLowerCase().trim();
    
    // Convert category to lowercase and trim if provided
    const categoryLower = category?.toLowerCase().trim();
    
    // Check if category was provided
    if (category) {
      // Check if any product has same name AND same category
      const exists = products.some(product => 
        product.name.toLowerCase() === nameLower && 
        product.category.toLowerCase() === categoryLower
      );
      
      // If product exists, return exists true with message
      if (exists) {
        return { 
          exists: true, 
          message: `Product "${name}" already exists in category "${category}"` 
        };
      }
    } else {
      // Check if any product has same name (regardless of category)
      const exists = products.some(product => product.name.toLowerCase() === nameLower);
      
      // If product exists, return exists true with message
      if (exists) {
        return { 
          exists: true, 
          message: `Product "${name}" already exists` 
        };
      }
    }
    
    // If product doesn't exist, return exists false with empty message
    return { exists: false, message: '' };
  };

  // Function to add a new product
  const addProduct = (productData: Omit<Product, 'id'>): { success: boolean; message: string } => {
    // First check if product already exists
    const checkResult = checkProductExists(productData.name, productData.category);
    
    // If product exists, return error
    if (checkResult.exists) {
      return { success: false, message: checkResult.message };
    }

    // Create new product with generated ID
    const newProduct: Product = {
      // Spread all product data
      ...productData,
      // Generate unique ID using current timestamp
      id: Date.now().toString()
    };
    
    // Create updated products array with new product at the beginning
    const updatedProducts = [newProduct, ...products];
    
    // Update the state with new products array
    setProducts(updatedProducts);
    
    // Save the updated products to AsyncStorage
    saveProductsToStorage(updatedProducts);
    
    // Return success response
    return { success: true, message: 'Product added successfully' };
  };

  // Function to delete a product
  const deleteProduct = (id: string): { success: boolean; message: string } => {
    // Find the product to delete
    const productToDelete = products.find(product => product.id === id);
    
    // If product not found, return error
    if (!productToDelete) {
      return { success: false, message: 'Product not found' };
    }
    
    // Create new array without the deleted product
    const updatedProducts = products.filter(product => product.id !== id);
    
    // Update the state
    setProducts(updatedProducts);
    
    // Save to AsyncStorage
    saveProductsToStorage(updatedProducts);
    
    // Return success with product name in message
    return { 
      success: true, 
      message: `Product "${productToDelete.name}" deleted successfully` 
    };
  };

  // Function to update a product
  const updateProduct = (id: string, updatedData: Partial<Product>): { success: boolean; message: string } => {
    // Find the index of the product to update
    const productIndex = products.findIndex(product => product.id === id);
    
    // If product not found, return error
    if (productIndex === -1) {
      return { success: false, message: 'Product not found' };
    }
    
    // Get the original product
    const product = products[productIndex];
    
    // Get the new name (use updated if provided, otherwise keep original)
    const newName = updatedData.name || product.name;
    
    // Get the new category (use updated if provided, otherwise keep original)
    const newCategory = updatedData.category || product.category;
    
    // Check if another product with same name and category exists (excluding current product)
    const duplicateExists = products.some((p, index) => 
      index !== productIndex && // Skip the current product
      p.name.toLowerCase() === newName.toLowerCase() && // Check name match
      p.category.toLowerCase() === newCategory.toLowerCase() // Check category match
    );
    
    // If duplicate exists, return error
    if (duplicateExists) {
      return { 
        success: false, 
        message: `Product "${newName}" already exists in category "${newCategory}"` 
      };
    }
    
    // Create copy of products array
    const updatedProducts = [...products];
    
    // Update the specific product with new data
    updatedProducts[productIndex] = { 
      ...product, // Keep original properties
      ...updatedData // Override with updated properties
    };
    
    // Update the state
    setProducts(updatedProducts);
    
    // Save to AsyncStorage
    saveProductsToStorage(updatedProducts);
    
    // Return success
    return { success: true, message: 'Product updated successfully' };
  };

  // Create the context value object
  const contextValue: ProductContextType = {
    products, // List of products
    addProduct, // Function to add product
    deleteProduct, // Function to delete product
    updateProduct, // Function to update product
    checkProductExists, // Function to check if product exists
    loading // Loading state
  };

  // Return the Provider with context value
  return (
    <ProductContext.Provider value={contextValue}>
      {children}
    </ProductContext.Provider>
  );
};

// Custom hook to use the product context
export const useProductContext = () => {
  // Get the context
  const context = useContext(ProductContext);
  
  // If context is undefined, throw error (must be used within ProductProvider)
  if (context === undefined) {
    throw new Error('useProductContext must be used within a ProductProvider');
  }
  
  // Return the context
  return context;
};

export default ProductContext;