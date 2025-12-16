// product-context.tsx (UPDATED) - PRICE & QUANTITY REMOVED
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the Product interface - PRICE & QUANTITY REMOVED
export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  subCategory: string;
  image: string | null;
  units: string[];
  unitOptions: string[];
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
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProductsFromStorage();
  }, []);

  const loadProductsFromStorage = async () => {
    try {
      setLoading(true);
      
      const storedProducts = await AsyncStorage.getItem(PRODUCTS_STORAGE_KEY);
      
      if (storedProducts) {
        const parsedProducts: any[] = JSON.parse(storedProducts);
        
        const fixedProducts = parsedProducts.map(product => ({
          ...product,
          units: product.units 
            ? (Array.isArray(product.units) ? product.units : [product.units])
            : [],
          unitOptions: product.unitOptions 
            ? (Array.isArray(product.unitOptions) ? product.unitOptions : [product.unitOptions])
            : (product.units ? [] : ['1'])
        }));
        
        setProducts(fixedProducts);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error('Error loading products from storage:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const saveProductsToStorage = async (productsToSave: Product[]) => {
    try {
      await AsyncStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(productsToSave));
    } catch (error) {
      console.error('Error saving products to storage:', error);
    }
  };

  const checkProductExists = (name: string, category?: string): { exists: boolean; message: string } => {
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

  const addProduct = (productData: Omit<Product, 'id'>): { success: boolean; message: string } => {
    const checkResult = checkProductExists(productData.name, productData.category);
    
    if (checkResult.exists) {
      return { success: false, message: checkResult.message };
    }

    const newProduct: Product = {
      ...productData,
      id: Date.now().toString()
    };
    
    const updatedProducts = [newProduct, ...products];
    
    setProducts(updatedProducts);
    saveProductsToStorage(updatedProducts);
    
    return { success: true, message: 'Product added successfully' };
  };

  const deleteProduct = (id: string): { success: boolean; message: string } => {
    const productToDelete = products.find(product => product.id === id);
    
    if (!productToDelete) {
      return { success: false, message: 'Product not found' };
    }
    
    const updatedProducts = products.filter(product => product.id !== id);
    
    setProducts(updatedProducts);
    saveProductsToStorage(updatedProducts);
    
    return { 
      success: true, 
      message: `Product "${productToDelete.name}" deleted successfully` 
    };
  };

  const updateProduct = (id: string, updatedData: Partial<Product>): { success: boolean; message: string } => {
    const productIndex = products.findIndex(product => product.id === id);
    
    if (productIndex === -1) {
      return { success: false, message: 'Product not found' };
    }
    
    const product = products[productIndex];
    
    const newName = updatedData.name || product.name;
    const newCategory = updatedData.category || product.category;
    
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
    
    const updatedProducts = [...products];
    
    updatedProducts[productIndex] = { 
      ...product,
      ...updatedData
    };
    
    setProducts(updatedProducts);
    saveProductsToStorage(updatedProducts);
    
    return { success: true, message: 'Product updated successfully' };
  };

  const contextValue: ProductContextType = {
    products,
    addProduct,
    deleteProduct,
    updateProduct,
    checkProductExists,
    loading
  };

  return (
    <ProductContext.Provider value={contextValue}>
      {children}
    </ProductContext.Provider>
  );
};

// Custom hook to use the product context
export const useProductContext = () => {
  const context = useContext(ProductContext);
  
  if (context === undefined) {
    throw new Error('useProductContext must be used within a ProductProvider');
  }
  
  return context;
};

export default ProductContext;