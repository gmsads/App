export type OrderStatus = 'PENDING' | 'PROCESSING' | 'DELIVERED' | 'CANCELLED';
export type DeliveryType = 'SAMEDAY' | 'NEXTDAY' | 'SCHEDULED';

export interface Order {
  orderId: string;
  shopId: string;
  address: string;
  createdAt: string;
  deliveryDate: string;
  deliveryType: DeliveryType;
  deliverySlot: string;
  status: OrderStatus;
  phone: string;
  customerName?: string;
  totalAmount?: string;
  paymentMethod?: string;
  items?: OrderItem[];
}

export interface OrderItem {
  name: string;
  quantity: number;
  price: string;
}

export interface FilterParams {
  shopId: string;
  fromOrderDate?: string;
  toOrderDate?: string;
  orderStatus: OrderStatus[];
  deliveryType: DeliveryType[];
}

export interface OrderListResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
}