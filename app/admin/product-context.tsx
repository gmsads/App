// ProductContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Product } from './productStore';
import productStore, { subscribe, getAllProducts, addProduct, deleteProduct, updateProduct } from './productStore';

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => { success: boolean; message: string };
  deleteProduct: (id: string) => { success: boolean; message: string };
  updateProduct: (id: string, updatedData: Partial<Product>) => { success: boolean; message: string };
  checkProductExists: (name: string, category?: string) => { exists: boolean; message: string };
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(getAllProducts());

  useEffect(() => {
    const unsubscribe = subscribe(() => {
      setProducts(getAllProducts());
    });
    
    return unsubscribe;
  }, []);

  const handleAddProduct = (productData: Omit<Product, 'id'>) => {
    const result = addProduct(productData);
    return result;
  };

  const handleDeleteProduct = (id: string) => {
    const success = deleteProduct(id);
    return { 
      success, 
      message: success ? 'Product deleted successfully' : 'Failed to delete product' 
    };
  };

  const handleUpdateProduct = (id: string, updatedData: Partial<Product>) => {
    const result = updateProduct(id, updatedData);
    return result;
  };

  const checkProductExists = (name: string, category?: string) => {
    return productStore.productExists(name, category);
  };

  return (
    <ProductContext.Provider value={{ 
      products, 
      addProduct: handleAddProduct, 
      deleteProduct: handleDeleteProduct, 
      updateProduct: handleUpdateProduct,
      checkProductExists
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProductContext must be used within a ProductProvider');
  }
  return context;
};

export default ProductContext;