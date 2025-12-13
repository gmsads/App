export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  unit: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  total: number;
  status: 'delivered' | 'cancelled' | 'requested';
  items: CartItem[];
}

// Global cart items array - FIXED: Use let to allow reassignment
export let cartItems: CartItem[] = [];

// Orders history
export let orders: Order[] = [];

// Listeners array for reactivity
const listeners: Array<() => void> = [];

// Function to notify all listeners
const notifyListeners = () => {
  listeners.forEach(listener => listener());
};

// Subscribe to cart changes
export const subscribeToCartChanges = (listener: () => void) => {
  listeners.push(listener);
  return () => {
    const index = listeners.indexOf(listener);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  };
};

// Cart functions - FIXED: All functions now notify listeners
export const addToCart = (product: any, quantity: number) => {
  const existingItemIndex = cartItems.findIndex(item => item.id === product.id);
  
  if (existingItemIndex > -1) {
    cartItems[existingItemIndex].quantity += quantity;
  } else {
    cartItems.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity,
      unit: product.unit || 'pcs'
    });
  }
  
  // Create a new array reference to trigger reactivity
  cartItems = [...cartItems];
  notifyListeners();
  return true;
};

export const getCartItemCount = () => {
  return cartItems.reduce((total, item) => total + item.quantity, 0);
};

export const updateCartItemQuantity = (id: string, newQuantity: number) => {
  const itemIndex = cartItems.findIndex(item => item.id === id);
  if (itemIndex > -1) {
    if (newQuantity < 1) {
      cartItems.splice(itemIndex, 1);
    } else {
      cartItems[itemIndex].quantity = newQuantity;
    }
  }
  // Create a new array reference to trigger reactivity
  cartItems = [...cartItems];
  notifyListeners();
};

export const removeFromCart = (id: string) => {
  cartItems = cartItems.filter(item => item.id !== id);
  notifyListeners();
};

export const clearCart = () => {
  cartItems = [];
  notifyListeners();
};

// Order functions
export const createOrder = (): Order => {
  const orderId = Date.now().toString();
  const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;
  const today = new Date().toISOString().split('T')[0];
  
  const order: Order = {
    id: orderId,
    orderNumber: orderNumber,
    date: today,
    total: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    status: 'requested',
    items: [...cartItems]
  };
  
  orders.unshift(order); // Add to beginning of array
  // Create new array reference for orders
  orders = [...orders];
  
  clearCart(); // Clear cart after order is created
  return order;
};

export const getOrders = (): Order[] => {
  return [...orders]; // Return copy
};

export const getOrderById = (id: string): Order | undefined => {
  return orders.find(order => order.id === id);
};

// Re-order functions
export const reorderItems = (orderId: string): boolean => {
  const order = orders.find(order => order.id === orderId);
  if (order) {
    // Clear current cart and add items from the order
    clearCart();
    order.items.forEach(item => {
      addToCart(item, item.quantity);
    });
    return true;
  }
  return false;
};

export const getRecentOrders = (count: number = 5): Order[] => {
  return orders.slice(0, count);
};

export const hasOrders = (): boolean => {
  return orders.length > 0;
};

// Helper to get current cart items
export const getCartItems = (): CartItem[] => {
  return [...cartItems]; // Return copy
};

// Default export
const cartStore = {
  cartItems,
  orders,
  addToCart,
  getCartItemCount,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
  createOrder,
  getOrders,
  getOrderById,
  reorderItems,
  getRecentOrders,
  hasOrders,
  getCartItems,
  subscribeToCartChanges,
};

export default cartStore;