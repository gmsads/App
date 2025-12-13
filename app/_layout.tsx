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
              name="shopkeeper/dashboard" 
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
                headerShown: true, 
                title: 'Products',
                headerBackTitle: 'Dashboard'
              }} 
            />
            
            {/* Select Product - Step 1: Choose from categories */}
            <Stack.Screen 
              name="shopkeeper/products/select-product" 
              options={{ 
                headerShown: true, 
                title: 'Select Product',
                headerBackTitle: 'Products'
              }} 
            />
            
            {/* Add Product - Step 2: Add details for selected product */}
            <Stack.Screen 
              name="shopkeeper/products/add-product" 
              options={{ 
                headerShown: true, 
                title: 'Add Product Details',
                headerBackTitle: 'Select Product'
              }} 
            />
            
            {/* Edit Product - Edit existing product */}
            <Stack.Screen 
              name="shopkeeper/products/edit-product" 
              options={{ 
                headerShown: true, 
                title: 'Edit Product',
                headerBackTitle: 'Products'
              }} 
            />
            
            {/* Category Products - View products by category */}
            <Stack.Screen 
              name="shopkeeper/products/category-products" 
              options={{ 
                headerShown: true, 
                title: 'Category Products',
                headerBackTitle: 'Products'
              }} 
            />
            
            {/* =============================== */}
            {/* SHOPKEEPER MY LIST SECTION */}
            {/* =============================== */}
            
            {/* My List - Manage shopkeeper's product list */}
            <Stack.Screen 
              name="shopkeeper/my-list/my-list" 
              options={{ 
                headerShown: true, 
                title: 'My List',
                headerBackTitle: 'Dashboard'
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
                headerShown: true, 
                title: 'Order Details',
                headerBackTitle: 'Back'
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
                headerShown: true, 
                title: 'Manage Banners',
                headerBackTitle: 'Dashboard'
              }} 
            />
            
            {/* =============================== */}
            {/* SHOPKEEPER PROFILE SECTION */}
            {/* =============================== */}
            
            {/* Profile Information */}
            <Stack.Screen 
              name="shopkeeper/profile/profile-info" 
              options={{ 
                headerShown: true, 
                title: 'Profile',
                headerBackTitle: 'Dashboard'
              }} 
            />
            
            {/* Update Request */}
            <Stack.Screen 
              name="shopkeeper/profile/update-request" 
              options={{ 
                headerShown: true, 
                title: 'Update Request',
                headerBackTitle: 'Profile'
              }} 
            />
            
            {/* =============================== */}
            {/* SHOPKEEPER REPORTS SECTION */}
            {/* =============================== */}
            
            {/* Reports Main Screen */}
            <Stack.Screen 
              name="shopkeeper/reports/reports-main" 
              options={{ 
                headerShown: true, 
                title: 'Reports & Analytics',
                headerBackTitle: 'Dashboard'
              }} 
            />
            
            {/* Stock Report */}
            <Stack.Screen 
              name="shopkeeper/reports/stock-report" 
              options={{ 
                headerShown: true, 
                title: 'Stock Report',
                headerBackTitle: 'Reports'
              }} 
            />
            
            {/* Sales Report */}
            <Stack.Screen 
              name="shopkeeper/reports/sales-report" 
              options={{ 
                headerShown: true, 
                title: 'Sales Report',
                headerBackTitle: 'Reports'
              }} 
            />
            
            {/* Order Analytics Report */}
            <Stack.Screen 
              name="shopkeeper/reports/order-analytics" 
              options={{ 
                headerShown: true, 
                title: 'Order Analytics',
                headerBackTitle: 'Reports'
              }} 
            />
            
            {/* Quantity Report */}
            <Stack.Screen 
              name="shopkeeper/reports/quantity-report" 
              options={{ 
                headerShown: true, 
                title: 'Quantity Report',
                headerBackTitle: 'Reports'
              }} 
            />
            
            {/* Custom Report */}
            <Stack.Screen 
              name="shopkeeper/reports/custom-report" 
              options={{ 
                headerShown: true, 
                title: 'Custom Report',
                headerBackTitle: 'Reports'
              }} 
            />
            
            {/* Weekly/Monthly Report */}
            <Stack.Screen 
              name="shopkeeper/reports/weekly-monthly-report" 
              options={{ 
                headerShown: true, 
                title: 'Weekly/Monthly Report',
                headerBackTitle: 'Reports'
              }} 
            />
            
            {/* =============================== */}
            {/* SHOPKEEPER SETTINGS SECTION */}
            {/* =============================== */}
            
            {/* Delivery Settings */}
            <Stack.Screen 
              name="shopkeeper/settings/delivery-settings" 
              options={{ 
                headerShown: true, 
                title: 'Delivery Settings',
                headerBackTitle: 'Dashboard'
              }} 
            />
            
            {/* Shop Settings */}
            <Stack.Screen 
              name="shopkeeper/settings/shop-settings" 
              options={{ 
                headerShown: true, 
                title: 'Shop Settings',
                headerBackTitle: 'Dashboard'
              }} 
            />
            
            {/* Change Password */}
            <Stack.Screen 
              name="shopkeeper/settings/change-password" 
              options={{ 
                headerShown: true, 
                title: 'Change Password',
                headerBackTitle: 'Settings'
              }} 
            />
            
            {/* Privacy Policy */}
            <Stack.Screen 
              name="shopkeeper/settings/privacy" 
              options={{ 
                headerShown: true, 
                title: 'Privacy Policy',
                headerBackTitle: 'Settings'
              }} 
            />
            
            {/* Terms & Conditions */}
            <Stack.Screen 
              name="shopkeeper/settings/terms" 
              options={{ 
                headerShown: true, 
                title: 'Terms & Conditions',
                headerBackTitle: 'Settings'
              }} 
            />
            
            {/* =============================== */}
            {/* SHOPKEEPER SUPPORT SECTION */}
            {/* =============================== */}
            
            {/* Support Main */}
            <Stack.Screen 
              name="shopkeeper/support" 
              options={{ 
                headerShown: true, 
                title: 'Support',
                headerBackTitle: 'Dashboard'
              }} 
            />
            
            {/* Contact Admin */}
            <Stack.Screen 
              name="shopkeeper/contact-admin" 
              options={{ 
                headerShown: true, 
                title: 'Contact Admin',
                headerBackTitle: 'Support'
              }} 
            />
            
            {/* Help Center */}
            <Stack.Screen 
              name="shopkeeper/help-center" 
              options={{ 
                headerShown: true, 
                title: 'Help Center',
                headerBackTitle: 'Support'
              }} 
            />
            
            {/* Notifications */}
            <Stack.Screen 
              name="shopkeeper/notifications" 
              options={{ 
                headerShown: true, 
                title: 'Notifications',
                headerBackTitle: 'Dashboard'
              }} 
            />
            
            {/* Customers */}
            <Stack.Screen 
              name="shopkeeper/customers/customers-list" 
              options={{ 
                headerShown: true, 
                title: 'Customers',
                headerBackTitle: 'Dashboard'
              }} 
            />
            
            {/* =============================== */}
            {/* SHOPKEEPER CATEGORIES SECTION */}
            {/* =============================== */}
            
            {/* Categories Management */}
            <Stack.Screen 
              name="shopkeeper/categories/categories-list" 
              options={{ 
                headerShown: true, 
                title: 'Categories',
                headerBackTitle: 'Dashboard'
              }} 
            />
            
            {/* Add Category */}
            <Stack.Screen 
              name="shopkeeper/categories/add-category" 
              options={{ 
                headerShown: true, 
                title: 'Add Category',
                headerBackTitle: 'Categories'
              }} 
            />
            
            {/* =============================== */}
            {/* SHOPKEEPER INVENTORY SECTION */}
            {/* =============================== */}
            
            {/* Inventory Management */}
            <Stack.Screen 
              name="shopkeeper/inventory/inventory-management" 
              options={{ 
                headerShown: true, 
                title: 'Inventory',
                headerBackTitle: 'Dashboard'
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