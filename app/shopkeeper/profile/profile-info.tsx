import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, MaterialIcons, FontAwesome5, Feather } from '@expo/vector-icons';

type ShopProfile = {
  shopId: string;
  shopName: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  gstNumber?: string;
  shopType: string;
  registrationDate: string;
  status: 'active' | 'pending' | 'suspended';
  radius: string;
  deliveryCharges: string;
  minOrderAmount: string;
};

const ProfileInfo: React.FC = () => {
  const router = useRouter();
  const [profile, setProfile] = useState<ShopProfile | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalOrders: 1245,
    completedOrders: 1180,
    pendingOrders: 15,
    cancelledOrders: 50,
    totalRevenue: 254800,
    avgRating: 4.5,
  });

  useEffect(() => {
    loadProfile();
    loadStats();
  }, []);

  const loadProfile = async () => {
    try {
      const storedProfile = await AsyncStorage.getItem('shopProfile');
      if (storedProfile) {
        setProfile(JSON.parse(storedProfile));
      } else {
        const demoProfile: ShopProfile = {
          shopId: 'SHOP12345',
          shopName: 'FreshMart Supermarket',
          ownerName: 'Rajesh Kumar',
          email: 'rajesh@freshmart.com',
          phone: '+91 9876543210',
          address: '123 Main Street, Market Area',
          city: 'New Delhi',
          pincode: '110001',
          gstNumber: 'GSTIN123456789',
          shopType: 'Supermarket',
          registrationDate: '15 Jan 2023',
          status: 'active',
          radius: '5 km',
          deliveryCharges: '₹30',
          minOrderAmount: '₹200',
        };
        setProfile(demoProfile);
        await AsyncStorage.setItem('shopProfile', JSON.stringify(demoProfile));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      Alert.alert('Error', 'Failed to load profile data');
    }
  };

  const loadStats = async () => {
    try {
      setTimeout(() => {
        setStats({
          totalOrders: 1280,
          completedOrders: 1210,
          pendingOrders: 20,
          cancelledOrders: 50,
          totalRevenue: 259400,
          avgRating: 4.6,
        });
      }, 500);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadProfile();
    loadStats();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleUpdateRequest = () => {
    Alert.alert(
      'Update Profile',
      'Please contact support to update your profile information.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Contact Support', onPress: () => router.push('/shopkeeper/support') }
      ]
    );
  };

  const handleViewOrders = (filter: string) => {
    Alert.alert(
      'Coming Soon',
      'Orders management feature is under development.',
      [{ text: 'OK' }]
    );
  };

  const handleViewReports = () => {
    Alert.alert(
      'Reports',
      'Report features are under development.',
      [{ text: 'OK' }]
    );
  };

  const handleDeliverySettings = () => {
    router.push('/shopkeeper/settings/delivery-settings');
  };

  const handleShopSettings = () => {
    router.push('/shopkeeper/settings/shop-settings');
  };

  const profileSections = [
    {
      title: 'Personal Information',
      items: [
        { icon: 'store' as const, label: 'Shop Name', value: profile?.shopName },
        { icon: 'person' as const, label: 'Owner Name', value: profile?.ownerName },
        { icon: 'email' as const, label: 'Email', value: profile?.email },
        { icon: 'phone' as const, label: 'Phone', value: profile?.phone },
        { icon: 'home' as const, label: 'Address', value: profile?.address },
        { icon: 'location-city' as const, label: 'City', value: profile?.city },
        { icon: 'mail' as const, label: 'Pincode', value: profile?.pincode },
      ],
    },
    {
      title: 'Business Information',
      items: [
        { icon: 'badge' as const, label: 'Shop ID', value: profile?.shopId },
        { icon: 'business' as const, label: 'Shop Type', value: profile?.shopType },
        { icon: 'receipt' as const, label: 'GST Number', value: profile?.gstNumber || 'Not Provided' },
        { icon: 'date-range' as const, label: 'Registration Date', value: profile?.registrationDate },
        { icon: 'circle' as const, label: 'Status', value: profile?.status, status: true },
      ],
    },
    {
      title: 'Delivery Settings',
      items: [
        { icon: 'my-location' as const, label: 'Delivery Radius', value: profile?.radius },
        { icon: 'local-shipping' as const, label: 'Delivery Charges', value: profile?.deliveryCharges },
        { icon: 'payment' as const, label: 'Minimum Order', value: profile?.minOrderAmount },
      ],
    },
  ];

  const orderStats = [
    { label: 'Total Orders', value: stats.totalOrders, icon: 'receipt' as const, color: '#2196F3' },
    { label: 'Completed', value: stats.completedOrders, icon: 'check-circle' as const, color: '#4CAF50' },
    { label: 'Pending', value: stats.pendingOrders, icon: 'schedule' as const, color: '#FF9800' },
    { label: 'Cancelled', value: stats.cancelledOrders, icon: 'cancel' as const, color: '#f44336' },
  ];

  const actionButtons = [
    { 
      title: 'Update Profile', 
      icon: 'edit' as const, 
      color: '#2196F3', 
      onPress: handleUpdateRequest 
    },
    { 
      title: 'Shop Settings', 
      icon: 'settings' as const, 
      color: '#4CAF50', 
      onPress: handleShopSettings 
    },
    { 
      title: 'View Orders', 
      icon: 'list-alt' as const, 
      color: '#FF9800', 
      onPress: () => handleViewOrders('all') 
    },
    { 
      title: 'Reports', 
      icon: 'analytics' as const, 
      color: '#9C27B0', 
      onPress: handleViewReports 
    },
  ];

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return dateString;
  };

  return (
    <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{profile?.shopName?.charAt(0) || 'S'}</Text>
            </View>
            <View style={[styles.onlineIndicator, { backgroundColor: profile?.status === 'active' ? '#4CAF50' : profile?.status === 'pending' ? '#FF9800' : '#f44336' }]} />
          </View>
          
          <View style={styles.headerInfo}>
            <Text style={styles.shopName}>{profile?.shopName || 'Loading...'}</Text>
            <Text style={styles.shopId}>ID: {profile?.shopId || 'SHOP12345'}</Text>
            <View style={styles.ratingContainer}>
              <MaterialIcons name="star" size={16} color="#FFD700" />
              <Text style={styles.rating}>{stats.avgRating}</Text>
              <View style={[
                styles.statusBadgeContainer, 
                { backgroundColor: profile?.status === 'active' ? 'rgba(76, 175, 80, 0.3)' : 
                  profile?.status === 'pending' ? 'rgba(255, 152, 0, 0.3)' : 'rgba(244, 67, 54, 0.3)' }
              ]}>
                <Text style={styles.statusBadge}>● {profile?.status?.toUpperCase() || 'ACTIVE'}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Stats Overview */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Order Overview</Text>
        <View style={styles.statsGrid}>
          {orderStats.map((stat, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.statCard}
              onPress={() => handleViewOrders(stat.label.toLowerCase())}
              activeOpacity={0.7}
            >
              <View style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
                <MaterialIcons name={stat.icon} size={24} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value.toLocaleString()}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <TouchableOpacity style={styles.revenueCard} activeOpacity={0.7}>
          <View style={styles.revenueInfo}>
            <Text style={styles.revenueLabel}>Total Revenue</Text>
            <Text style={styles.revenueValue}>₹{stats.totalRevenue.toLocaleString()}</Text>
          </View>
          <View style={styles.revenueTrend}>
            <Feather name="trending-up" size={20} color="#4CAF50" />
            <Text style={styles.trendText}>+12% this month</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsSection}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {actionButtons.map((button, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.actionButton} 
              onPress={button.onPress}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIcon, { backgroundColor: button.color }]}>
                <MaterialIcons name={button.icon} size={24} color="#fff" />
              </View>
              <Text style={styles.actionText}>{button.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Profile Details */}
      <View style={styles.detailsSection}>
        {profileSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.sectionCard}>
            <Text style={styles.sectionCardTitle}>{section.title}</Text>
            {section.items.map((item, itemIndex) => (
              <View key={itemIndex} style={styles.detailRow}>
                <View style={styles.detailLabelContainer}>
                  <MaterialIcons name={item.icon} size={20} color="#666" style={styles.detailIcon} />
                  <Text style={styles.detailLabel}>{item.label}</Text>
                </View>
                <Text style={[
                  styles.detailValue,
                  item.status && item.value === 'active' && styles.activeStatus,
                  item.status && item.value === 'pending' && styles.pendingStatus,
                  item.status && item.value === 'suspended' && styles.suspendedStatus,
                ]}>
                  {item.value || 'N/A'}
                </Text>
              </View>
            ))}
          </View>
        ))}
      </View>

      {/* Additional Stats */}
      <View style={styles.additionalStats}>
        <TouchableOpacity style={styles.statItem} activeOpacity={0.7}>
          <FontAwesome5 name="calendar-check" size={20} color="#2196F3" />
          <View style={styles.statItemInfo}>
            <Text style={styles.statItemLabel}>Average Orders/Day</Text>
            <Text style={styles.statItemValue}>15</Text>
          </View>
          <MaterialIcons name="chevron-right" size={20} color="#999" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.statItem} activeOpacity={0.7}>
          <FontAwesome5 name="users" size={20} color="#4CAF50" />
          <View style={styles.statItemInfo}>
            <Text style={styles.statItemLabel}>Active Customers</Text>
            <Text style={styles.statItemValue}>42</Text>
          </View>
          <MaterialIcons name="chevron-right" size={20} color="#999" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.statItem} activeOpacity={0.7} onPress={handleDeliverySettings}>
          <MaterialIcons name="timer" size={20} color="#FF9800" />
          <View style={styles.statItemInfo}>
            <Text style={styles.statItemLabel}>Avg Delivery Time</Text>
            <Text style={styles.statItemValue}>45 mins</Text>
          </View>
          <MaterialIcons name="chevron-right" size={20} color="#999" />
        </TouchableOpacity>
      </View>

      {/* Support & Help */}
      <View style={styles.supportSection}>
        <TouchableOpacity style={styles.supportButton} activeOpacity={0.7} onPress={() => router.push('/shopkeeper/support')}>
          <MaterialIcons name="help-outline" size={24} color="#2196F3" />
          <Text style={styles.supportButtonText}>Help & Support</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.supportButton} activeOpacity={0.7} onPress={() => router.push('/shopkeeper/contact-admin')}>
          <MaterialIcons name="contact-support" size={24} color="#4CAF50" />
          <Text style={styles.supportButtonText}>Contact Admin</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Registered on {formatDate(profile?.registrationDate)}</Text>
        <Text style={styles.footerSubtext}>Last updated: Today, 10:30 AM</Text>
        
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={() => {
            Alert.alert(
              'Logout',
              'Are you sure you want to logout?',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Logout', onPress: () => router.replace('/shopkeeper/shopkeeper-login') }
              ]
            );
          }}
        >
          <MaterialIcons name="logout" size={20} color="#f44336" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4CAF50',
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    zIndex: 10,
    padding: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#fff',
  },
  headerInfo: {
    flex: 1,
  },
  shopName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  shopId: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 12,
    marginLeft: 4,
  },
  statusBadgeContainer: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusBadge: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  statsSection: {
    padding: 20,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  statCard: {
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
    marginBottom: 12,
    marginRight: '4%',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  revenueCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  revenueInfo: {
    flex: 1,
  },
  revenueLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  revenueValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  revenueTrend: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
    marginLeft: 4,
  },
  actionsSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  actionButton: {
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
    marginBottom: 12,
    marginRight: '4%',
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
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  detailsSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f9f9f9',
  },
  detailLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailIcon: {
    marginRight: 12,
    width: 24,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'right',
    flex: 1,
  },
  activeStatus: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  pendingStatus: {
    color: '#FF9800',
    fontWeight: 'bold',
  },
  suspendedStatus: {
    color: '#f44336',
    fontWeight: 'bold',
  },
  additionalStats: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f9f9f9',
  },
  statItemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  statItemLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  statItemValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  supportSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  supportButton: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  supportButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 8,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    color: '#999',
    marginBottom: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f44336',
    gap: 8,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f44336',
  },
});

export default ProfileInfo;