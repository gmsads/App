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
      icon: 'store',
      color: '#4CAF50',
      screen: '/shopkeeper/products/product-list',
    },
    {
      title: 'Pending Orders',
      count: ordersCount.pending,
      icon: 'receipt',
      color: '#FF9800',
      screen: '/shopkeeper/orders/orders-list?filter=pending',
    },
    {
      title: "Today's Orders",
      count: ordersCount.today,
      icon: 'today',
      color: '#2196F3',
      screen: '/shopkeeper/orders/orders-list?filter=today',
    },
    {
      title: 'My List',
      count: 15,
      icon: 'list-alt',
      color: '#9C27B0',
      screen: '/shopkeeper/my-list/my-list',
    },
    {
      title: 'Banners',
      count: 3,
      icon: 'image',
      color: '#009688',
      screen: '/shopkeeper/banners/add-banners',
    },
    {
      title: 'Reports',
      count: 'View',
      icon: 'analytics',
      color: '#795548',
      screen: '/shopkeeper/reports/sales-report',
    },
  ];

  const quickActions = [
    {
      title: 'Add Product',
      icon: 'add-circle',
      color: '#4CAF50',
      screen: '/shopkeeper/products/add-product',
    },
    {
      title: 'Update Prices',
      icon: 'edit',
      color: '#FF9800',
      screen: '/shopkeeper/my-list/my-list',
    },
    {
      title: 'Delivery Settings',
      icon: 'delivery-dining',
      color: '#2196F3',
      screen: '/shopkeeper/settings/delivery-settings',
    },
    {
      title: 'View Profile',
      icon: 'person',
      color: '#9C27B0',
      screen: '/shopkeeper/profile/profile-info',
    },
  ];

  const renderDashboardCard = (card: any, index: number) => (
    <TouchableOpacity
      key={index}
      style={[styles.card, { borderLeftColor: card.color }]}
      onPress={() => router.push(card.screen)}
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
      onPress={() => router.push(action.screen)}
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
        <View>
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
        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map(renderQuickAction)}
          </View>
        </View>

        {/* Dashboard Cards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dashboard</Text>
          <View style={styles.dashboardGrid}>
            {dashboardCards.map(renderDashboardCard)}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityList}>
            {[
              { text: 'New order received (#ORD1001)', time: '10 mins ago' },
              { text: 'Product "Tomatoes" price updated', time: '1 hour ago' },
              { text: 'Order #ORD1000 delivered', time: '2 hours ago' },
              { text: 'New product "Apples" added', time: '3 hours ago' },
              { text: 'Delivery settings updated', time: '1 day ago' },
            ].map((activity, index) => (
              <View key={index} style={styles.activityItem}>
                <View style={styles.activityDot} />
                <View style={styles.activityContent}>
                  <Text style={styles.activityText}>{activity.text}</Text>
                  <Text style={styles.activityTime}>{activity.time}</Text>
                </View>
              </View>
            ))}
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
    width: '48%',
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
  activityList: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginTop: 6,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#999',
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
});

export default ShopkeeperDashboard;