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

// Global cart items array
export let cartItems: CartItem[] = [];

// Orders history
export let orders: Order[] = [];

// Cart functions
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
      unit: product.unit
    });
  }
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
};

export const removeFromCart = (id: string) => {
  cartItems = cartItems.filter(item => item.id !== id);
};

export const clearCart = () => {
  cartItems = [];
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
  clearCart(); // Clear cart after order is created
  return order;
};

export const getOrders = (): Order[] => {
  return orders;
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

// Default export to fix the warning
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
};

export default cartStore;