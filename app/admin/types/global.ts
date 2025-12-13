// This is now just for type declarations, not a route
export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: 'super-admin' | 'admin' | 'moderator';
  permissions: string[];
  isActive: boolean;
  createdAt: Date;
}

export interface AdminShop {
  id: string;
  name: string;
  ownerName: string;
  ownerEmail: string;
  phone: string;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  verificationStatus: 'verified' | 'unverified' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
  totalProducts: number;
  totalSales: number;
}

export interface AdminProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  shopId: string;
  shopName: string;
  status: 'active' | 'inactive' | 'out-of-stock';
  inventory: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminReport {
  id: string;
  title: string;
  type: 'sales' | 'users' | 'shops' | 'products' | 'revenue';
  data: any;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  generatedAt: Date;
  startDate: Date;
  endDate: Date;
}

export interface DashboardStats {
  totalShops: number;
  activeShops: number;
  totalProducts: number;
  totalUsers: number;
  totalSales: number;
  totalRevenue: number;
  pendingVerifications: number;
}

export interface AdminSettings {
  platformName: string;
  maintenanceMode: boolean;
  allowNewRegistrations: boolean;
  allowShopRegistrations: boolean;
  commissionRate: number;
  taxRate: number;
  currency: string;
}

export interface AuditLog {
  id: string;
  adminId: string;
  adminUsername: string;
  action: string;
  resource: string;
  resourceId: string;
  details: any;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
}