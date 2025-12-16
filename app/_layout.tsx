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
            {/* =============================== */}
            {/* PUBLIC / USER-FACING SCREENS */}
            {/* =============================== */}
            
            {/* Authentication */}
            <Stack.Screen 
              name="index" 
              options={{ 
                headerShown: false,
                title: 'Login'
              }} 
            />
            <Stack.Screen name="login" options={{ headerShown: false }} />
            
            {/* User Product Screens */}
            <Stack.Screen name="productlist" options={{ headerShown: false }} />
            <Stack.Screen name="productdetail" options={{ headerShown: false }} />
            
            {/* User Cart & Checkout */}
            <Stack.Screen name="cart" options={{ headerShown: false }} />
            
            {/* User Tabs Navigation */}
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            
            {/* User Modals */}
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
            
            {/* User Location & QR */}
            <Stack.Screen name="location-search" options={{ headerShown: false }} />
            <Stack.Screen name="qr-scanner" options={{ headerShown: false }} />
            
            {/* User Profile & Reports */}
            <Stack.Screen name="profile" options={{ headerShown: false }} />
            <Stack.Screen name="reports-analytics" options={{ headerShown: false }} />

            {/* =============================== */}
            {/* ADMIN SCREENS */}
            {/* =============================== */}
            
            {/* Admin Authentication */}
            <Stack.Screen name="admin/admin-login" options={{ headerShown: false }} />
            
            {/* Admin Dashboard */}
            <Stack.Screen name="admin/admin-dashboard" options={{ headerShown: false }} />
            
            {/* Shop Management */}
            <Stack.Screen name="admin/shop-management" options={{ headerShown: false }} />
            <Stack.Screen name="admin/add-shop" options={{ headerShown: false }} />
            <Stack.Screen name="admin/edit-shop" options={{ headerShown: false }} />
            <Stack.Screen name="admin/shop-details" options={{ headerShown: false }} />
            
            {/* Product Management */}
            <Stack.Screen name="admin/product-management" options={{ headerShown: false }} />
            <Stack.Screen name="admin/add-product" options={{ headerShown: false }} />
            <Stack.Screen name="admin/edit-product" options={{ headerShown: false }} />
            <Stack.Screen name="admin/product-details" options={{ headerShown: false }} />
            
            {/* User Management */}
            <Stack.Screen name="admin/user-management" options={{ headerShown: false }} />
            <Stack.Screen name="admin/user-details" options={{ headerShown: false }} />
            <Stack.Screen name="admin/add-user" options={{ headerShown: false }} />
            
            {/* Admin Global Settings */}
            <Stack.Screen name="admin/global-settings" options={{ headerShown: false }} />
            
            {/* Admin Reports & Analytics */}
            <Stack.Screen name="admin/reports-analytics" options={{ headerShown: false }} />
            
            {/* Admin QR Scanner */}
            <Stack.Screen name="admin/qr-scanner" options={{ headerShown: false }} />

            {/* =============================== */}
            {/* SHOPKEEPER SCREENS */}
            {/* =============================== */}
            
            {/* Shopkeeper Authentication */}
            <Stack.Screen name="shopkeeper/shopkeeper-login" options={{ headerShown: false }} />
            
            {/* Shopkeeper Dashboard */}
            <Stack.Screen 
              name="shopkeeper/shopkeeper-dashboard" 
              options={{ 
                headerShown: false 
              }} 
            />
            
            {/* =============================== */}
            {/* SHOPKEEPER PRODUCTS SECTION */}
            {/* =============================== */}
            
            {/* Products List - Main screen */}
            <Stack.Screen 
              name="shopkeeper/products/product-list" 
              options={{ 
                headerShown: false
              }} 
            />
            
            {/* Select Product - Step 1: Choose from categories */}
            <Stack.Screen 
              name="shopkeeper/products/select-product" 
              options={{ 
                headerShown: false
              }} 
            />
            
            {/* Add Product - Step 2: Add details for selected product */}
            <Stack.Screen 
              name="shopkeeper/products/add-product" 
            options={{ 
                headerShown: false
              }} 
            />
            
            {/* Edit Product - Edit existing product */}
            <Stack.Screen 
              name="shopkeeper/products/edit-product" 
              options={{ 
                headerShown: false
              }} 
            />
            
            {/* Category Products - View products by category */}
            <Stack.Screen 
              name="shopkeeper/products/category-products" 
              options={{ 
                headerShown: false
              }} 
            />
            
            {/* =============================== */}
            {/* SHOPKEEPER MY LIST SECTION */}
            {/* =============================== */}
            
            {/* My List - Manage shopkeeper's product list */}
            <Stack.Screen 
              name="shopkeeper/my-list/my-list" 
              options={{ 
                headerShown: false
              }} 
            />
            
            {/* =============================== */}
            {/* SHOPKEEPER ORDERS SECTION */}
            {/* =============================== */}
            
            {/* Orders List - View all orders with tabs (All, Today's, Pending) */}
            <Stack.Screen 
              name="shopkeeper/orders/orders-list" 
              options={{ 
                headerShown: false,
              }} 
            />
            
            {/* Order Details - View specific order */}
            <Stack.Screen 
              name="shopkeeper/orders/order-details" 
              options={{ 
                headerShown: false
              }} 
            />
            
            {/* Today's Orders - Only shows today's orders (no tabs) */}
            <Stack.Screen 
              name="shopkeeper/orders/todays-orders" 
              options={{ 
                headerShown: false,
              }} 
            />
            
            {/* Pending Orders - Only shows pending orders (no tabs) */}
            <Stack.Screen 
              name="shopkeeper/orders/pending-orders" 
              options={{ 
                headerShown: false,
              }} 
            />
            
            {/* =============================== */}
            {/* SHOPKEEPER BANNERS SECTION */}
            {/* =============================== */}
            
            {/* Banners Management */}
            <Stack.Screen 
              name="shopkeeper/banners/add-banners" 
              options={{ 
                headerShown: false
              }} 
            />
            
            {/* =============================== */}
            {/* SHOPKEEPER PROFILE SECTION */}
            {/* =============================== */}
            
            {/* Profile Information */}
            <Stack.Screen 
              name="shopkeeper/profile/profile-info" 
              options={{ 
                headerShown: false
              }} 
            />
            
            {/* Update Request */}
            <Stack.Screen 
              name="shopkeeper/profile/update-request" 
             options={{ 
                headerShown: false
              }} 
            />
            
            {/* =============================== */}
            {/* SHOPKEEPER REPORTS SECTION */}
            {/* =============================== */}
            
            {/* Reports Main Screen */}
            <Stack.Screen 
              name="shopkeeper/reports/reports-main" 
              options={{ 
                headerShown: false
              }} 
            />
            
            {/* Stock Report */}
            <Stack.Screen 
              name="shopkeeper/reports/stock-report" 
            options={{ 
                headerShown: false
              }} 
            />
            
            {/* Sales Report */}
            <Stack.Screen 
              name="shopkeeper/reports/sales-report" 
             options={{ 
                headerShown: false
              }} 
            />
            
            {/* Order Analytics Report */}
            <Stack.Screen 
              name="shopkeeper/reports/order-analytics" 
              options={{ 
                headerShown: false
              }} 
            />
            
            {/* Quantity Report */}
            <Stack.Screen 
              name="shopkeeper/reports/quantity-report" 
             options={{ 
                headerShown: false
              }} 
            />
            
            {/* Custom Report */}
            <Stack.Screen 
              name="shopkeeper/reports/custom-report" 
             options={{ 
                headerShown: false
              }} 
            />
            
            {/* Weekly/Monthly Report */}
            <Stack.Screen 
              name="shopkeeper/reports/weekly-monthly-report" 
              options={{ 
                headerShown: false
              }} 
            />
            
            {/* =============================== */}
            {/* SHOPKEEPER SETTINGS SECTION */}
            {/* =============================== */}
            
            {/* Delivery Settings */}
            <Stack.Screen 
              name="shopkeeper/settings/delivery-settings" 
             options={{ 
                headerShown: false
              }} 
            />
            
            {/* Shop Settings */}
            <Stack.Screen 
              name="shopkeeper/settings/shop-settings" 
              options={{ 
                headerShown: false
              }} 
            />
            
            {/* Change Password */}
            <Stack.Screen 
              name="shopkeeper/settings/change-password" 
              options={{ 
                headerShown: false
              }} 
            />
            
            {/* Privacy Policy */}
            <Stack.Screen 
              name="shopkeeper/settings/privacy" 
              options={{ 
                headerShown: false
              }} 
            />
            
            {/* Terms & Conditions */}
            <Stack.Screen 
              name="shopkeeper/settings/terms" 
             options={{ 
                headerShown: false
              }} 
            />
            
            {/* =============================== */}
            {/* SHOPKEEPER SUPPORT SECTION */}
            {/* =============================== */}
            
            {/* Support Main */}
            <Stack.Screen 
              name="shopkeeper/support" 
              options={{ 
                headerShown: false
              }} 
            />
            
            {/* Contact Admin */}
            <Stack.Screen 
              name="shopkeeper/contact-admin" 
              options={{ 
                headerShown: false
              }} 
            />
            
            {/* Help Center */}
            <Stack.Screen 
              name="shopkeeper/help-center" 
            options={{ 
                headerShown: false
              }} 
            />
            
            {/* Notifications */}
            <Stack.Screen 
              name="shopkeeper/notifications" 
              options={{ 
                headerShown: false
              }} 
            />
            
            {/* Customers */}
            <Stack.Screen 
              name="shopkeeper/customers/customers-list" 
            options={{ 
                headerShown: false
              }} 
            />
            
            {/* =============================== */}
            {/* SHOPKEEPER CATEGORIES SECTION */}
            {/* =============================== */}
            
            {/* Categories Management */}
            <Stack.Screen 
              name="shopkeeper/categories/categories-list" 
              options={{ 
                headerShown: false
              }} 
            />
            
            {/* Add Category */}
            <Stack.Screen 
              name="shopkeeper/categories/add-category" 
             options={{ 
                headerShown: false
              }} 
            />
            
            {/* =============================== */}
            {/* SHOPKEEPER INVENTORY SECTION */}
            {/* =============================== */}
            
            {/* Inventory Management */}
            <Stack.Screen 
              name="shopkeeper/inventory/inventory-management" 
              options={{ 
                headerShown: false
              }} 
            />
            
            {/* =============================== */}
            {/* STORES / CONTEXTS (Hidden Screens) */}
            {/* =============================== */}
            
            {/* Shop Context */}
            <Stack.Screen name="admin/shop-context" options={{ headerShown: false }} />
            
            {/* Product Context */}
            <Stack.Screen name="admin/product-context" options={{ headerShown: false }} />
            
            {/* Shopkeeper Context */}
            <Stack.Screen name="shopkeeper/shopkeeper-context" options={{ headerShown: false }} />
            
            {/* Orders Context/Store */}
            <Stack.Screen name="shopkeeper/orders/orders-store" options={{ headerShown: false }} />
            <Stack.Screen name="shopkeeper/orders/orders-context" options={{ headerShown: false }} />
            
            {/* Cart Store */}
            <Stack.Screen name="cartStore" options={{ headerShown: false }} />
            <Stack.Screen name="admin/cartStore" options={{ headerShown: false }} />
            <Stack.Screen name="shopkeeper/cartStore" options={{ headerShown: false }} />
            
            {/* Product Store */}
            <Stack.Screen name="admin/productStore" options={{ headerShown: false }} />
            <Stack.Screen name="shopkeeper/productStore" options={{ headerShown: false }} />
            
            {/* Cart Storage Utility */}
            <Stack.Screen name="utils/cartStorage" options={{ headerShown: false }} />
            
            {/* Async Storage Utility */}
            <Stack.Screen name="utils/asyncStorage" options={{ headerShown: false }} />

            {/* Orders Types & Utilities */}
            <Stack.Screen name="shopkeeper/orders/orders-types" options={{ headerShown: false }} />
            <Stack.Screen name="shopkeeper/orders/orders-utils" options={{ headerShown: false }} />

          </Stack>
          
          {/* Status Bar Configuration */}
          <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        </ThemeProvider>
      </ProductProvider>
    </ShopProvider>
  );
}