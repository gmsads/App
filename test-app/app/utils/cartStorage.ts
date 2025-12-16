// utils/cartStorage.ts

// Define the CartItem interface
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  unit: string;
}

// Global cart items array
let cartItems: CartItem[] = [];

// Get all cart items
export const getCartItems = (): CartItem[] => {
  return [...cartItems];
};

// Add item to cart
export const addToCart = (product: Omit<CartItem, 'quantity'>) => {
  const existingItem = cartItems.find(item => item.id === product.id);
  
  if (existingItem) {
    // If item exists, increase quantity
    cartItems = cartItems.map(item =>
      item.id === product.id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
  } else {
    // If item doesn't exist, add new item
    cartItems.push({ ...product, quantity: 1 });
  }
  return getCartItems();
};

// Update item quantity
export const updateCartItemQuantity = (id: string, quantity: number) => {
  if (quantity < 1) {
    removeFromCart(id);
    return getCartItems();
  }
  
  cartItems = cartItems.map(item =>
    item.id === id ? { ...item, quantity } : item
  );
  return getCartItems();
};

// Remove item from cart
export const removeFromCart = (id: string) => {
  cartItems = cartItems.filter(item => item.id !== id);
  return getCartItems();
};

// Get total number of items in cart
export const getCartItemCount = (): number => {
  return cartItems.reduce((total, item) => total + item.quantity, 0);
};

// Clear entire cart
export const clearCart = () => {
  cartItems = [];
};