// app/shopkeeper/dashboard.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Ionicons,
  MaterialIcons,
  FontAwesome5,
  Feather,
} from '@expo/vector-icons';

interface ShopData {
  shopName: string;
  phone: string;
  radius: string;
  deliveryCharges: string;
  minOrderAmount: string;
  deliveryTypes: string[];
  deliverySlots: {
    sameDay: string[];
    nextDay: string[];
  };
}

const ShopkeeperDashboard: React.FC = () => {
  const router = useRouter();
  const [shopData, setShopData] = useState<ShopData | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [ordersCount, setOrdersCount] = useState({
    pending: 5,
    today: 12,
    thisWeek: 45,
    thisMonth: 180,
  });
  const [productsCount, setProductsCount] = useState(28);

  useEffect(() => {
    loadShopData();
    fetchCounts();
  }, []);

  const loadShopData = async () => {
    try {
      const data = await AsyncStorage.getItem('shopkeeperData');
      if (data) {
        setShopData(JSON.parse(data));
      }
    } catch (error) {
      console.error('Error loading shop data:', error);
    }
  };

  const fetchCounts = async () => {
    // Simulate API calls
    setTimeout(() => {
      setProductsCount(32);
    }, 500);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadShopData();
    fetchCounts();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const dashboardCards = [
    {
      title: 'Products',
      count: productsCount,
      icon: 'store' as const,
      color: '#4CAF50',
      screen: '/shopkeeper/products/product-list',
    },
    {
      title: 'Pending Orders',
      count: ordersCount.pending,
      icon: 'receipt' as const,
      color: '#FF9800',
      screen: '/shopkeeper/orders/orders-list?filter=pending',
    },
    {
      title: "Today's Orders",
      count: ordersCount.today,
      icon: 'today' as const,
      color: '#2196F3',
      screen: '/shopkeeper/orders/orders-list?filter=today',
    },
    {
      title: 'My Lists',
      count: 15,
      icon: 'list-alt' as const,
      color: '#9C27B0',
      screen: '/shopkeeper/my-list/my-list',
    },
    {
      title: 'Reports',
      count: 'View',
      icon: 'analytics' as const,
      color: '#795548',
      screen: '/shopkeeper/reports/reports-main',
    },
    {
      title: 'Customers',
      count: 42,
      icon: 'people' as const,
      color: '#607D8B',
      screen: '/shopkeeper/customers/customers-list',
    },
  ];

  const quickActions = [
    {
      title: 'Add Product',
      icon: 'add-circle' as const,
      color: '#4CAF50',
      screen: '/shopkeeper/products/add-product',
    },
    {
      title: 'Edit List',
      icon: 'edit' as const,
      color: '#FF9800',
      screen: '/shopkeeper/my-list/my-list',
    },
    {
      title: 'Delivery Settings',
      icon: 'delivery-dining' as const,
      color: '#2196F3',
      screen: '/shopkeeper/settings/delivery-settings',
    },
    {
      title: 'Profile',
      icon: 'person' as const,
      color: '#9C27B0',
      screen: '/shopkeeper/profile/profile-info',
    },
    {
      title: 'Notifications',
      icon: 'notifications' as const,
      color: '#FF5722',
      screen: '/shopkeeper/notifications',
    },
    {
      title: 'Support',
      icon: 'help' as const,
      color: '#009688',
      screen: '/shopkeeper/support',
    },
  ];

  const renderDashboardCard = (card: any, index: number) => (
    <TouchableOpacity
      key={index}
      style={[styles.card, { borderLeftColor: card.color }]}
      onPress={() => router.push(card.screen as any)}
    >
      <View style={styles.cardHeader}>
        <MaterialIcons name={card.icon} size={24} color={card.color} />
        <Text style={styles.cardTitle}>{card.title}</Text>
      </View>
      <Text style={[styles.cardCount, { color: card.color }]}>
        {card.count}
      </Text>
    </TouchableOpacity>
  );

  const renderQuickAction = (action: any, index: number) => (
    <TouchableOpacity
      key={index}
      style={styles.quickAction}
      onPress={() => router.push(action.screen as any)}
    >
      <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
        <MaterialIcons name={action.icon} size={24} color="#fff" />
      </View>
      <Text style={styles.actionText}>{action.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#4CAF50" barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.shopName}>
            {shopData?.shopName || 'My Shop'}
          </Text>
          <Text style={styles.shopContact}>
            📞 {shopData?.phone || '+91 XXXXXXXXXX'}
          </Text>
          <View style={styles.shopStats}>
            <Text style={styles.statItem}>📍 {shopData?.radius || '0 km'}</Text>
            <Text style={styles.statItem}>🚚 {shopData?.deliveryCharges || '₹0'}</Text>
            <Text style={styles.statItem}>💰 Min: {shopData?.minOrderAmount || '₹0'}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => router.push('/shopkeeper/profile/profile-info')}
        >
          <Ionicons name="person-circle" size={40} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Dashboard Cards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dashboard Overview</Text>
          <View style={styles.dashboardGrid}>
            {dashboardCards.map(renderDashboardCard)}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map(renderQuickAction)}
          </View>
        </View>

        {/* Performance Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance Metrics</Text>
          <View style={styles.metricsContainer}>
            <View style={styles.metricCard}>
              <FontAwesome5 name="boxes" size={20} color="#4CAF50" />
              <Text style={styles.metricValue}>{ordersCount.thisWeek}</Text>
              <Text style={styles.metricLabel}>Weekly Orders</Text>
            </View>
            <View style={styles.metricCard}>
              <FontAwesome5 name="rupee-sign" size={20} color="#2196F3" />
              <Text style={styles.metricValue}>₹{ordersCount.thisWeek * 250}</Text>
              <Text style={styles.metricLabel}>Weekly Revenue</Text>
            </View>
            <View style={styles.metricCard}>
              <Feather name="users" size={20} color="#FF9800" />
              <Text style={styles.metricValue}>42</Text>
              <Text style={styles.metricLabel}>Active Customers</Text>
            </View>
            <View style={styles.metricCard}>
              <MaterialIcons name="star" size={20} color="#FFD700" />
              <Text style={styles.metricValue}>4.5</Text>
              <Text style={styles.metricLabel}>Avg Rating</Text>
            </View>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityCard}>
            <View style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: '#4CAF50' }]}>
                <MaterialIcons name="shopping-cart" size={16} color="#fff" />
              </View>
              <View style={styles.activityText}>
                <Text style={styles.activityTitle}>New order received</Text>
                <Text style={styles.activityTime}>2 minutes ago</Text>
              </View>
              <Text style={styles.activityAmount}>₹450</Text>
            </View>
            <View style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: '#2196F3' }]}>
                <MaterialIcons name="inventory" size={16} color="#fff" />
              </View>
              <View style={styles.activityText}>
                <Text style={styles.activityTitle}>Low stock alert</Text>
                <Text style={styles.activityTime}>30 minutes ago</Text>
              </View>
              <Text style={[styles.activityAmount, { color: '#FF5722' }]}>2 items</Text>
            </View>
            <View style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: '#FF9800' }]}>
                <MaterialIcons name="rate-review" size={16} color="#fff" />
              </View>
              <View style={styles.activityText}>
                <Text style={styles.activityTitle}>New review received</Text>
                <Text style={styles.activityTime}>1 hour ago</Text>
              </View>
              <Text style={[styles.activityAmount, { color: '#FFD700' }]}>★★★★☆</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4CAF50',
    padding: 20,
    paddingTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  headerLeft: {
    flex: 1,
  },
  shopName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  shopContact: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 8,
  },
  shopStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statItem: {
    fontSize: 12,
    color: '#fff',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  profileButton: {
    padding: 4,
    marginLeft: 12,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  quickAction: {
    alignItems: 'center',
    width: '31%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  dashboardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
    flex: 1,
  },
  cardCount: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  metricCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  activityCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityText: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#999',
  },
  activityAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
});

export default ShopkeeperDashboard;