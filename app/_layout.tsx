import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import React from 'react';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { ShopProvider } from './admin/shop-context';
import { ProductProvider } from './admin/product-context';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ShopProvider>
      <ProductProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            {/* User-facing screens */}
            <Stack.Screen 
              name="index" 
              options={{ 
                headerShown: false,
                title: 'Login'
              }} 
            />
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="productlist" options={{ headerShown: false }} />
            <Stack.Screen name="productdetail" options={{ headerShown: false }} />
            <Stack.Screen name="cart" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
            <Stack.Screen name="location-search" options={{ headerShown: false }} />
            <Stack.Screen name="qr-scanner" options={{ headerShown: false }} />
            <Stack.Screen name="profile" options={{ headerShown: false }} />
            <Stack.Screen name="reports-analytics" options={{ headerShown: false }} />

            {/* Admin Screens */}
            <Stack.Screen name="admin/admin-login" options={{ headerShown: false }} />
            <Stack.Screen name="admin/admin-dashboard" options={{ headerShown: false }} />
            <Stack.Screen name="admin/shop-management" options={{ headerShown: false }} />
            <Stack.Screen name="admin/product-management" options={{ headerShown: false }} />
            <Stack.Screen name="admin/global-settings" options={{ headerShown: false }} />
            <Stack.Screen name="admin/reports-analytics" options={{ headerShown: false }} />
            <Stack.Screen name="admin/qr-scanner" options={{ headerShown: false }} />
            <Stack.Screen name="admin/add-shop" options={{ headerShown: false }} />
            <Stack.Screen name="admin/edit-shop" options={{ headerShown: false }} />
            <Stack.Screen name="admin/shop-details" options={{ headerShown: false }} />
            <Stack.Screen name="admin/add-product" options={{ headerShown: false }} />
            <Stack.Screen name="admin/edit-product" options={{ headerShown: false }} />
            <Stack.Screen name="admin/product-details" options={{ headerShown: false }} />
            
            <Stack.Screen name="admin/user-management" options={{ headerShown: false }} />
            <Stack.Screen name="admin/user-details" options={{ headerShown: false }} />
<Stack.Screen name="admin/add-user" options={{ headerShown: false }} />


            {/* Store/Context Screens */}
            <Stack.Screen name="admin/shop-context" options={{ headerShown: false }} />
            <Stack.Screen name="admin/product-context" options={{ headerShown: false }} />
            <Stack.Screen name="cartStore" options={{ headerShown: false }} />
            <Stack.Screen name="admin/cartStore" options={{ headerShown: false }} />
            <Stack.Screen name="admin/productStore" options={{ headerShown: false }} />
            <Stack.Screen name="utils/cartStorage" options={{ headerShown: false }} />

            {/* Shopkeeper Screens */}
            
            {/* Shopkeeper Login & Dashboard */}
            <Stack.Screen name="shopkeeper/shopkeeper-login" options={{ headerShown: false }} />
            <Stack.Screen name="shopkeeper/shopkeeper-dashboard" options={{ headerShown: false }} />
            
            {/* Shopkeeper Products */}
            <Stack.Screen name="shopkeeper/products/product-list" options={{ 
              headerShown: true, 
              title: 'Products',
              headerBackTitle: 'Dashboard'
            }} />
            <Stack.Screen name="shopkeeper/products/add-product" options={{ 
              headerShown: true, 
              title: 'Add Product',
              headerBackTitle: 'Products'
            }} />
            <Stack.Screen name="shopkeeper/products/edit-product" options={{ 
              headerShown: true, 
              title: 'Edit Product',
              headerBackTitle: 'Products'
            }} />
            <Stack.Screen name="shopkeeper/products/category-products" options={{ 
              headerShown: true, 
              title: 'Category Products',
              headerBackTitle: 'Products'
            }} />
            
            {/* Shopkeeper My List */}
            <Stack.Screen name="shopkeeper/my-list/my-list" options={{ 
              headerShown: true, 
              title: 'My List',
              headerBackTitle: 'Dashboard'
            }} />
            
            {/* Shopkeeper Orders */}
            <Stack.Screen name="shopkeeper/orders/orders-list" options={{ 
              headerShown: true, 
              title: 'Orders',
              headerBackTitle: 'Dashboard'
            }} />
            <Stack.Screen name="shopkeeper/orders/order-details" options={{ 
              headerShown: true, 
              title: 'Order Details',
              headerBackTitle: 'Orders'
            }} />
            
            {/* Shopkeeper Banners */}
            <Stack.Screen name="shopkeeper/banners/add-banners" options={{ 
              headerShown: true, 
              title: 'Manage Banners',
              headerBackTitle: 'Dashboard'
            }} />
            
            {/* Shopkeeper Profile */}
            <Stack.Screen name="shopkeeper/profile/profile-info" options={{ 
              headerShown: true, 
              title: 'Profile',
              headerBackTitle: 'Dashboard'
            }} />
            <Stack.Screen name="shopkeeper/profile/update-request" options={{ 
              headerShown: true, 
              title: 'Update Request',
              headerBackTitle: 'Profile'
            }} />
            
            {/* Shopkeeper Reports */}
            <Stack.Screen name="shopkeeper/reports/quantity-report" options={{ 
              headerShown: true, 
              title: 'Quantity Report',
              headerBackTitle: 'Reports'
            }} />
            <Stack.Screen name="shopkeeper/reports/sales-report" options={{ 
              headerShown: true, 
              title: 'Sales Report',
              headerBackTitle: 'Reports'
            }} />
            <Stack.Screen name="shopkeeper/reports/custom-report" options={{ 
              headerShown: true, 
              title: 'Custom Report',
              headerBackTitle: 'Reports'
            }} />
            <Stack.Screen name="shopkeeper/reports/weekly-monthly-report" options={{ 
              headerShown: true, 
              title: 'Weekly/Monthly Report',
              headerBackTitle: 'Reports'
            }} />
            
            {/* Shopkeeper Settings */}
            <Stack.Screen name="shopkeeper/settings/delivery-settings" options={{ 
              headerShown: true, 
              title: 'Delivery Settings',
              headerBackTitle: 'Dashboard'
            }} />
            <Stack.Screen name="shopkeeper/settings/shop-settings" options={{ 
              headerShown: true, 
              title: 'Shop Settings',
              headerBackTitle: 'Dashboard'
            }} />
            <Stack.Screen name="shopkeeper/settings/change-password" options={{ 
              headerShown: true, 
              title: 'Change Password',
              headerBackTitle: 'Shop Settings'
            }} />
            <Stack.Screen name="shopkeeper/settings/privacy" options={{ 
              headerShown: true, 
              title: 'Privacy Policy',
              headerBackTitle: 'Shop Settings'
            }} />
            <Stack.Screen name="shopkeeper/settings/terms" options={{ 
              headerShown: true, 
              title: 'Terms & Conditions',
              headerBackTitle: 'Shop Settings'
            }} />

            {/* Shopkeeper Support */}
            <Stack.Screen name="shopkeeper/support" options={{ 
              headerShown: true, 
              title: 'Support',
              headerBackTitle: 'Dashboard'
            }} />
            <Stack.Screen name="shopkeeper/contact-admin" options={{ 
              headerShown: true, 
              title: 'Contact Admin',
              headerBackTitle: 'Support'
            }} />
            <Stack.Screen name="shopkeeper/help-center" options={{ 
              headerShown: true, 
              title: 'Help Center',
              headerBackTitle: 'Support'
            }} />

          </Stack>
          <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        </ThemeProvider>
      </ProductProvider>
    </ShopProvider>
  );
}