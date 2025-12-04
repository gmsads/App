export interface LoginForm {
  phone: string;
  otp: string;
  shopId?: string;
}

export interface LocationHistory {
  id: string;
  shopId: string;
  shopName: string;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  timestamp: Date;
}

export interface SearchLocation {
  id: string;
  name: string;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  type: 'history' | 'current' | 'search';
}