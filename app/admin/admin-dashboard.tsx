// Import necessary modules from React and other libraries
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';

// Import React Native components
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the AdminDashboard component
const AdminDashboard: React.FC = () => {
  // Initialize router for navigation
  const router = useRouter();
  
  // State for pull-to-refresh functionality
  const [refreshing, setRefreshing] = useState<boolean>(false);
  
  // State for dashboard statistics
  const [stats, setStats] = useState({
    totalShops: 0,
    totalProducts: 0,
    totalSales: 0,
    activeUsers: 0,
    totalDailySales: 0,
    totalMonthlySales: 0
  });

  // useEffect hook to run on component mount
  useEffect(() => {
    // Load dashboard data when component mounts
    loadDashboardData();
    
    // Check admin authentication status
    checkAdminAuth();
  }, []); // Empty dependency array means this runs only once on mount

  // Function to check admin authentication
  const checkAdminAuth = async (): Promise<void> => {
    try {
      // Retrieve admin data from AsyncStorage
      const adminData = await AsyncStorage.getItem('adminData');
      
      // If no admin data found, redirect to login page
      if (!adminData) {
        router.replace('/admin/admin-login');
      }
    } catch (error) {
      // Log error and redirect to login if there's an authentication error
      console.error('Auth check error:', error);
      router.replace('/admin/admin-login');
    }
  };

  // Function to load dashboard data (fetching from API)
  const loadDashboardData = async (): Promise<void> => {
    try {
      // In a real app, you would make an API call here
      // For now, we'll use the provided data directly
      const dashboardData = {
        shopCount: 2,
        productCount: 1,
        userCount: 0,
        totalDailySales: 823,
        totalMonthlySales: 823
      };

      setStats({
        totalShops: dashboardData.shopCount,
        totalProducts: dashboardData.productCount,
        totalSales: dashboardData.totalMonthlySales, // Using monthly sales as total sales
        activeUsers: dashboardData.userCount,
        totalDailySales: dashboardData.totalDailySales,
        totalMonthlySales: dashboardData.totalMonthlySales
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Fallback to mock data if API fails
      setStats({
        totalShops: 2,
        totalProducts: 1,
        totalSales: 823,
        activeUsers: 0,
        totalDailySales: 823,
        totalMonthlySales: 823
      });
    }
  };

  // Function to handle pull-to-refresh action
  const onRefresh = async (): Promise<void> => {
    // Set refreshing state to true to show loading indicator
    setRefreshing(true);
    
    // Reload dashboard data
    await loadDashboardData();
    
    // Set refreshing state to false to hide loading indicator
    setRefreshing(false);
  };

  // Function to handle logout action
  const handleLogout = async (): Promise<void> => {
    // Show confirmation alert before logging out
    Alert.alert(
      'Logout', // Alert title
      'Are you sure you want to logout?', // Alert message
      [
        // Cancel button
        { text: 'Cancel', style: 'cancel' },
        // Logout button (destructive style)
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            // Remove admin data from AsyncStorage
            await AsyncStorage.removeItem('adminData');
            
            // Redirect to admin login page
            router.replace('/admin/admin-login');
          },
        },
      ]
    );
  };

  // Interface for menu items
  interface MenuItem {
    title: string; // Menu item title
    description: string; // Menu item description
    icon: string; // Emoji icon
    route: string; // Navigation route
  }

  // Array of menu items for the dashboard
  const menuItems: MenuItem[] = [
    {
      title: 'User Management',
      description: 'View and manage all users',
      icon: '👥',
      route: '/admin/user-management',
    },
    {
      title: 'Shop Management',
      description: 'Add, view, and update shopkeepers',
      icon: '🏪',
      route: '/admin/shop-management',
    },
    {
      title: 'Product Management',
      description: 'Manage products and categories',
      icon: '📦',
      route: '/admin/product-management',
    },
    {
      title: 'Global Settings',
      description: 'Radius, handling charges, banners',
      icon: '⚙️',
      route: '/admin/global-settings',
    },
    {
      title: 'Reports & Analytics',
      description: 'View sales and quantity reports',
      icon: '📊',
      route: '/admin/reports-analytics',
    },
  ];

  // Main component render
  return (
    <View style={styles.container}>
      {/* Header section with title and logout button */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Scrollable content area */}
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Statistics Cards Section */}
        <View style={styles.statsContainer}>
          {/* Total Shops Card */}
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.totalShops}</Text>
            <Text style={styles.statLabel}>Total Shops</Text>
          </View>
          
          {/* Total Products Card */}
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.totalProducts}</Text>
            <Text style={styles.statLabel}>Products</Text>
          </View>
          
          {/* Total Sales Card */}
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>₹{stats.totalSales.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Total Sales</Text>
          </View>
          
          {/* Active Users Card */}
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.activeUsers}</Text>
            <Text style={styles.statLabel}>Active Users</Text>
          </View>
        </View>

        {/* Additional Sales Stats Section */}
        <View style={styles.salesStatsContainer}>
          <Text style={styles.sectionTitle}>Sales Overview</Text>
          <View style={styles.salesStatsRow}>
            <View style={styles.salesStatCard}>
              <Text style={styles.salesStatNumber}>₹{stats.totalDailySales.toLocaleString()}</Text>
              <Text style={styles.salesStatLabel}>Today's Sales</Text>
            </View>
            <View style={styles.salesStatCard}>
              <Text style={styles.salesStatNumber}>₹{stats.totalMonthlySales.toLocaleString()}</Text>
              <Text style={styles.salesStatLabel}>Monthly Sales</Text>
            </View>
          </View>
        </View>

        {/* Menu Grid Section */}
        <View style={styles.menuContainer}>
          {/* Map through menuItems array to create menu cards */}
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuCard}
              onPress={() => router.push(item.route as any)}
            >
              {/* Menu item icon */}
              <Text style={styles.menuIcon}>{item.icon}</Text>
              
              {/* Menu item title */}
              <Text style={styles.menuTitle}>{item.title}</Text>
              
              {/* Menu item description */}
              <Text style={styles.menuDescription}>{item.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Actions Section */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionButtons}>
            {/* Add New Shop Button */}
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/admin/add-shop' as any)}
            >
              <Text style={styles.actionButtonText}>➕ Add New Shop</Text>
            </TouchableOpacity>
            
            {/* Add Product Button */}
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/admin/add-product' as any)}
            >
              <Text style={styles.actionButtonText}>📦 Add Product</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom padding for better scrolling experience */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  // Main container style
  container: {
    flex: 1, // Take full available space
    backgroundColor: '#f8f9fa', // Light gray background
  },
  
  // ScrollView style
  scrollView: {
    flex: 1, // Take full available space
  },
  
  // Header style
  header: {
    flexDirection: 'row', // Arrange children horizontally
    justifyContent: 'space-between', // Space between title and logout button
    alignItems: 'center', // Center vertically
    paddingHorizontal: 20, // Horizontal padding
    paddingTop: 60, // Top padding (accommodates status bar)
    paddingBottom: 20, // Bottom padding
    backgroundColor: '#fff', // White background
    borderBottomWidth: 1, // Bottom border
    borderBottomColor: '#e0e0e0', // Light gray border color
    
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    
    // Elevation for Android
    elevation: 3,
  },
  
  // Header title style
  headerTitle: {
    fontSize: 24, // Large font size
    fontWeight: 'bold', // Bold font weight
    color: '#2c3e50', // Dark blue-gray color
  },
  
  // Logout button style
  logoutButton: {
    paddingHorizontal: 12, // Horizontal padding
    paddingVertical: 8, // Vertical padding
    backgroundColor: '#e74c3c', // Red background
    borderRadius: 8, // Rounded corners
  },
  
  // Logout text style
  logoutText: {
    color: '#fff', // White text
    fontSize: 14, // Medium font size
    fontWeight: '600', // Semi-bold font weight
  },
  
  // Statistics container style
  statsContainer: {
    flexDirection: 'row', // Arrange cards horizontally
    flexWrap: 'wrap', // Allow wrapping to next row
    padding: 16, // Padding around the container
    justifyContent: 'space-between', // Space between cards
  },
  
  // Individual stat card style
  statCard: {
    backgroundColor: '#fff', // White background
    borderRadius: 12, // Rounded corners
    padding: 16, // Internal padding
    marginBottom: 12, // Bottom margin
    width: '48%', // Width to fit two cards per row
    
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    
    // Elevation for Android
    elevation: 3,
    
    // Center align content
    alignItems: 'center',
  },
  
  // Stat number style
  statNumber: {
    fontSize: 24, // Large font size
    fontWeight: 'bold', // Bold font weight
    color: '#3498db', // Blue color
    marginBottom: 4, // Bottom margin
  },
  
  // Stat label style
  statLabel: {
    fontSize: 12, // Small font size
    color: '#7f8c8d', // Gray color
    textAlign: 'center', // Center align text
  },
  
  // Sales stats container
  salesStatsContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  
  // Sales stats row
  salesStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  
  // Sales stat card
  salesStatCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flex: 1,
    alignItems: 'center',
    
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    
    // Elevation for Android
    elevation: 3,
  },
  
  // Sales stat number
  salesStatNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2ecc71', // Green color for sales
    marginBottom: 4,
  },
  
  // Sales stat label
  salesStatLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  
  // Menu container style
  menuContainer: {
    padding: 16, // Padding around the container
  },
  
  // Individual menu card style
  menuCard: {
    backgroundColor: '#fff', // White background
    borderRadius: 12, // Rounded corners
    padding: 20, // Internal padding
    marginBottom: 16, // Bottom margin
    
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    
    // Elevation for Android
    elevation: 3,
  },
  
  // Menu icon style
  menuIcon: {
    fontSize: 32, // Large font size for emoji
    marginBottom: 12, // Bottom margin
  },
  
  // Menu title style
  menuTitle: {
    fontSize: 18, // Medium font size
    fontWeight: 'bold', // Bold font weight
    color: '#2c3e50', // Dark blue-gray color
    marginBottom: 8, // Bottom margin
  },
  
  // Menu description style
  menuDescription: {
    fontSize: 14, // Small font size
    color: '#7f8c8d', // Gray color
    lineHeight: 20, // Line height for better readability
  },
  
  // Quick actions container style
  quickActions: {
    padding: 16, // Internal padding
    backgroundColor: '#fff', // White background
    marginHorizontal: 16, // Horizontal margin
    borderRadius: 12, // Rounded corners
    
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    
    // Elevation for Android
    elevation: 3,
  },
  
  // Section title style
  sectionTitle: {
    fontSize: 18, // Medium font size
    fontWeight: 'bold', // Bold font weight
    color: '#2c3e50', // Dark blue-gray color
    marginBottom: 12, // Bottom margin
  },
  
  // Action buttons container style
  actionButtons: {
    flexDirection: 'row', // Arrange buttons horizontally
    justifyContent: 'space-between', // Space between buttons
    gap: 12, // Gap between buttons
  },
  
  // Individual action button style
  actionButton: {
    backgroundColor: '#3498db', // Blue background
    borderRadius: 8, // Rounded corners
    paddingVertical: 12, // Vertical padding
    paddingHorizontal: 8, // Horizontal padding
    flex: 1, // Take equal width
    alignItems: 'center', // Center align content
  },
  
  // Action button text style
  actionButtonText: {
    color: '#fff', // White text
    fontSize: 14, // Medium font size
    fontWeight: '600', // Semi-bold font weight
    textAlign: 'center', // Center align text
  },
  
  // Bottom padding style
  bottomPadding: {
    height: 20, // Fixed height for padding
  },
});

// Export the component as default
export default AdminDashboard;