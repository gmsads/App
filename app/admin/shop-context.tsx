import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Shop = {
  id: string;
  shopId: number;
  name: string;
  owner: string;
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  email: string;
  password: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
  updatedAt: string;
  zoneId?: string;
  radius?: number;
  gpsCoordinates?: string;
  city?: string;
  state?: string;
  country?: string;
  zipcode?: string;
  files?: string[];
  role?: string;
};

type ShopContextType = {
  shops: Shop[];
  addShop: (shop: Omit<Shop, 'id' | 'shopId' | 'createdAt' | 'updatedAt' | 'status'>) => void;
  updateShop: (id: string, shop: Partial<Omit<Shop, 'id' | 'shopId' | 'createdAt' | 'updatedAt'>>) => void;
  deleteShop: (id: string) => void;
  toggleShopStatus: (id: string) => void;
  loading: boolean;
};

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const useShop = () => {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};

type ShopProviderProps = {
  children: ReactNode;
};

const SHOPS_STORAGE_KEY = '@shops_data';

export const ShopProvider: React.FC<ShopProviderProps> = ({ children }) => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadShopsFromStorage();
  }, []);

  useEffect(() => {
    if (!loading) {
      saveShopsToStorage();
    }
  }, [shops, loading]);

  const loadShopsFromStorage = async () => {
    try {
      const storedShops = await AsyncStorage.getItem(SHOPS_STORAGE_KEY);
      
      if (storedShops) {
        const parsedShops = JSON.parse(storedShops);
        setShops(parsedShops);
      } else {
        const initialShops: Shop[] = [
          { 
            id: '1',
            shopId: 12634,
            name: "John's Store",
            owner: "John Doe",
            firstName: "John",
            lastName: "Doe",
            address: "123 Market Street",
            phone: "1234567890",
            email: "john.doe@example.com",
            password: "password123",
            status: 'Active',
            createdAt: "2025-12-01T14:11:41.398",
            updatedAt: "2025-01-05T15:30:00",
            zoneId: "zone-123",
            radius: 5,
            gpsCoordinates: "40.712776,-74.005974",
            city: "New York",
            state: "NY",
            country: "USA",
            zipcode: "10001",
            files: ["image1.jpg", "image2.png"],
            role: "SHOPKEEPER"
          },
          { 
            id: '2',
            shopId: 33737,
            name: "John's Store",
            owner: "John Doe",
            firstName: "John",
            lastName: "Doe",
            address: "123 Market Street",
            phone: "1234567880",
            email: "john.doe@example.com",
            password: "password123",
            status: 'Active',
            createdAt: "2025-12-01T17:31:41.049",
            updatedAt: "2025-01-05T15:30:00",
            zoneId: "zone-123",
            radius: 5,
            gpsCoordinates: "40.712776,-74.005974",
            city: "New York",
            state: "NY",
            country: "USA",
            zipcode: "10001",
            files: ["image1.jpg", "image2.png"],
            role: "SHOPKEEPER"
          },
          { 
            id: '3',
            shopId: 44556,
            name: "Fresh Mart",
            owner: "Raj Sharma",
            firstName: "Raj",
            lastName: "Sharma",
            address: "456 Main Street",
            phone: "9876543210",
            email: "raj@freshmart.com",
            password: "password456",
            status: 'Active',
            createdAt: "2025-11-15T10:20:30.000",
            updatedAt: "2025-01-10T12:00:00",
            zoneId: "zone-456",
            radius: 3,
            gpsCoordinates: "40.758896,-73.985130",
            city: "New York",
            state: "NY",
            country: "USA",
            zipcode: "10002",
            files: ["shop1.jpg", "shop2.jpg"],
            role: "SHOPKEEPER"
          },
          { 
            id: '4',
            shopId: 55667,
            name: "Super Store",
            owner: "Priya Patel",
            firstName: "Priya",
            lastName: "Patel",
            address: "789 Broadway",
            phone: "8765432109",
            email: "priya@superstore.com",
            password: "password789",
            status: 'Inactive',
            createdAt: "2025-10-20T14:30:00.000",
            updatedAt: "2025-01-12T09:15:00",
            zoneId: "zone-789",
            radius: 4,
            gpsCoordinates: "40.750504,-73.993439",
            city: "New York",
            state: "NY",
            country: "USA",
            zipcode: "10003",
            files: ["store1.png"],
            role: "SHOPKEEPER"
          },
          { 
            id: '5',
            shopId: 66778,
            name: "Quick Mart",
            owner: "Amit Kumar",
            firstName: "Amit",
            lastName: "Kumar",
            address: "321 5th Avenue",
            phone: "7654321098",
            email: "amit@quickmart.com",
            password: "password012",
            status: 'Active',
            createdAt: "2025-09-25T11:45:00.000",
            updatedAt: "2025-01-08T16:20:00",
            zoneId: "zone-012",
            radius: 6,
            gpsCoordinates: "40.761432,-73.977622",
            city: "New York",
            state: "NY",
            country: "USA",
            zipcode: "10004",
            files: ["mart1.jpg", "mart2.jpg", "mart3.png"],
            role: "SHOPKEEPER"
          }
        ];
        
        setShops(initialShops);
        await AsyncStorage.setItem(SHOPS_STORAGE_KEY, JSON.stringify(initialShops));
      }
    } catch (error) {
      console.error('Error loading shops from storage:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveShopsToStorage = async () => {
    try {
      await AsyncStorage.setItem(SHOPS_STORAGE_KEY, JSON.stringify(shops));
    } catch (error) {
      console.error('Error saving shops to storage:', error);
    }
  };

  const addShop = (shopData: Omit<Shop, 'id' | 'shopId' | 'createdAt' | 'updatedAt' | 'status'>) => {
    const newShop: Shop = {
      ...shopData,
      id: Date.now().toString(),
      shopId: Date.now(),
      status: 'Active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setShops(prevShops => [...prevShops, newShop]);
  };

  const updateShop = (id: string, shopData: Partial<Omit<Shop, 'id' | 'shopId' | 'createdAt' | 'updatedAt'>>) => {
    setShops(prevShops =>
      prevShops.map(shop =>
        shop.id === id 
          ? { 
              ...shop, 
              ...shopData,
              updatedAt: new Date().toISOString(),
              owner: shopData.firstName && shopData.lastName 
                ? `${shopData.firstName} ${shopData.lastName}`
                : shop.owner
            } 
          : shop
      )
    );
  };

  const deleteShop = (id: string) => {
    setShops(prevShops => prevShops.filter(shop => shop.id !== id));
  };

  const toggleShopStatus = (id: string) => {
    setShops(prevShops =>
      prevShops.map(shop =>
        shop.id === id
          ? { 
              ...shop, 
              status: shop.status === 'Active' ? 'Inactive' : 'Active',
              updatedAt: new Date().toISOString()
            }
          : shop
      )
    );
  };

  return (
    <ShopContext.Provider
      value={{
        shops,
        addShop,
        updateShop,
        deleteShop,
        toggleShopStatus,
        loading,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export default ShopContext;