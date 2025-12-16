// 1. Import necessary modules and components
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
    Alert,
    FlatList,
    Modal,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getOrders, CartItem } from './cartStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 2. Define interfaces
interface User {
  phone: string;
  name?: string;
  email?: string;
  profileImage?: string;
  joinDate: string;
}

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  total: number;
  status: 'delivered' | 'cancelled' | 'requested';
  items: CartItem[];
}

interface Address {
  id: string;
  type: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

// 3. Main Profile component
const Profile: React.FC = () => {
  // 4. Initialize router and state variables
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'security'>('orders');
  const [selectedOrderStatus, setSelectedOrderStatus] = useState<'all' | 'delivered' | 'cancelled' | 'requested'>('all');
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAddressModalVisible, setIsAddressModalVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isChangePasswordModal, setIsChangePasswordModal] = useState(false);

  // 5. User data state - this will be loaded from login
  const [user, setUser] = useState<User>({
    phone: '',
    name: 'Guest User',
    email: '',
    profileImage: '',
    joinDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  });

  // 6. Mock addresses data
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      type: 'Home',
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      isDefault: true,
    },
    {
      id: '2',
      type: 'Work',
      street: '456 Office Blvd',
      city: 'New York',
      state: 'NY',
      zipCode: '10002',
      isDefault: false,
    },
  ]);

  // 7. Orders and security state
  const [orders, setOrders] = useState<Order[]>([]);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // 8. Load user data and orders when component mounts - FIXED VERSION
  useEffect(() => {
    loadUserData();
    loadOrders();
  }, []);

  // 9. Function to load user data from storage - FIXED VERSION
  const loadUserData = async () => {
    try {
      // ✅ FIXED: Get current user's phone number first
      const currentUserPhone = await AsyncStorage.getItem('currentUserPhone');
      
      if (currentUserPhone) {
        // ✅ FIXED: Load user data using phone number as unique key
        const userData = await AsyncStorage.getItem(`userData_${currentUserPhone}`);
        
        if (userData) {
          // ✅ FIXED: Parse and set the specific user's data
          const parsedData = JSON.parse(userData);
          setUser(parsedData);
          console.log('User data loaded for:', currentUserPhone);
        } else {
          console.log('No user data found for:', currentUserPhone);
          // If no user data found, set default with phone
          setUser(prev => ({
            ...prev,
            phone: currentUserPhone,
            name: 'Guest User',
            joinDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
          }));
        }
      } else {
        console.log('No current user found in storage');
        // Guest user state
        setUser({
          phone: '',
          name: 'Guest User',
          email: '',
          joinDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  // 10. Function to load orders from cartStore
  const loadOrders = () => {
    const ordersFromStore = getOrders();
    setOrders(ordersFromStore);
  };

  // 11. Function to save user data to storage - FIXED VERSION
  const saveUserData = async (userData: User) => {
    try {
      // ✅ FIXED: Get current user's phone to save data correctly
      const currentUserPhone = await AsyncStorage.getItem('currentUserPhone');
      
      if (currentUserPhone) {
        // ✅ FIXED: Save user data with phone number as unique identifier
        await AsyncStorage.setItem(`userData_${currentUserPhone}`, JSON.stringify(userData));
        setUser(userData);
        console.log('User data saved for:', currentUserPhone);
      } else {
        console.log('No current user found to save data');
      }
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  // 12. Simple profile image handler
  const handleProfileImageClick = () => {
    Alert.alert(
      'Profile Picture',
      'In a full implementation, this would open the camera or photo gallery.',
      [{ text: 'OK' }]
    );
  };

  // 13. Handle save profile - FIXED VERSION
  const handleSaveProfile = async () => {
    await saveUserData(user);
    setIsEditMode(false);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  // 14. Handle change password
  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    
    // Simulate password change
    Alert.alert('Success', 'Password changed successfully!');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setIsChangePasswordModal(false);
  };

  // 15. Filter orders based on selected status
  const filteredOrders = selectedOrderStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === selectedOrderStatus);

  // 16. Get status color for order badges
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return '#10b981';
      case 'cancelled': return '#ef4444';
      case 'requested': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  // 17. Get status text for display
  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      case 'requested': return 'Processing';
      default: return status;
    }
  };

  // 18. Handle viewing order details
  const handleViewOrder = (order: Order) => {
    const itemsList = order.items.map(item => 
      `• ${item.name} (${item.quantity} ${item.unit}) - $${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');
    
    Alert.alert(
      `Order Details - ${order.orderNumber}`,
      `Date: ${order.date}\nTotal: $${order.total.toFixed(2)}\nStatus: ${getStatusText(order.status)}\n\nItems:\n${itemsList}`,
      [{ text: 'OK' }]
    );
  };

  // 19. Handle logout - FIXED VERSION
  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            // ✅ FIXED: Remove current user phone but keep user data for future logins
            await AsyncStorage.removeItem('currentUserPhone');
            Alert.alert('Success', 'You have been logged out successfully!');
            router.replace('/');
          },
        },
      ]
    );
  };

  // 20. Profile Header Component
  const ProfileHeader = () => (
    <View style={styles.profileHeader}>
      <TouchableOpacity onPress={handleProfileImageClick} style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user.name ? user.name.charAt(0).toUpperCase() : '👤'}
          </Text>
        </View>
        <View style={styles.cameraBadge}>
          <Text style={styles.cameraBadgeText}>📷</Text>
        </View>
      </TouchableOpacity>
      
      <View style={styles.profileInfo}>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userPhone}>{user.phone || 'Not logged in'}</Text>
        <Text style={styles.joinDate}>Member since {user.joinDate}</Text>
      </View>
    </View>
  );

  // 21. Stats Card Component
  const StatsCard = () => (
    <View style={styles.statsCard}>
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>{orders.length}</Text>
        <Text style={styles.statLabel}>Total Orders</Text>
      </View>
      <View style={styles.statSeparator} />
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>
          {orders.filter(o => o.status === 'delivered').length}
        </Text>
        <Text style={styles.statLabel}>Delivered</Text>
      </View>
      <View style={styles.statSeparator} />
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>
          {orders.filter(o => o.status === 'requested').length}
        </Text>
        <Text style={styles.statLabel}>Processing</Text>
      </View>
    </View>
  );

  // 22. Render order item
  const renderOrderItem = ({ item }: { item: Order }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.orderNumber}>{item.orderNumber}</Text>
          <Text style={styles.orderDate}>{item.date}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>
      
      <View style={styles.orderDetails}>
        <Text style={styles.orderTotal}>${item.total.toFixed(2)}</Text>
        <Text style={styles.orderItems}>
          {item.items.length} item{item.items.length !== 1 ? 's' : ''}
        </Text>
      </View>
      
      <TouchableOpacity
        style={styles.viewButton}
        onPress={() => handleViewOrder(item)}
      >
        <Text style={styles.viewButtonText}>View Details</Text>
      </TouchableOpacity>
    </View>
  );

  // 23. Render address item
  const renderAddressItem = ({ item }: { item: Address }) => (
    <View style={[styles.addressCard, item.isDefault && styles.defaultAddressCard]}>
      <View style={styles.addressHeader}>
        <Text style={styles.addressType}>{item.type}</Text>
        {item.isDefault && (
          <View style={styles.defaultBadge}>
            <Text style={styles.defaultBadgeText}>Default</Text>
          </View>
        )}
      </View>
      <Text style={styles.addressText}>{item.street}</Text>
      <Text style={styles.addressText}>{item.city}, {item.state} {item.zipCode}</Text>
    </View>
  );

  // 24. Main render function
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      
      {/* 25. Enhanced Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity onPress={() => setIsEditMode(!isEditMode)}>
          <Text style={styles.editHeaderButton}>
            {isEditMode ? 'Done' : 'Edit'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 26. Profile Header */}
        <ProfileHeader />
        
        {/* 27. Stats Card */}
        <StatsCard />

        {/* 28. Enhanced Tab Navigation */}
        <View style={styles.tabContainer}>
          {[
            { key: 'orders', label: 'Orders', icon: '📦' },
            { key: 'profile', label: 'Profile', icon: '👤' },
            { key: 'security', label: 'Security', icon: '🔒' }
          ].map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, activeTab === tab.key && styles.activeTab]}
              onPress={() => setActiveTab(tab.key as any)}
            >
              <Text style={styles.tabIcon}>{tab.icon}</Text>
              <Text style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 29. Orders Tab Content */}
        {activeTab === 'orders' ? (
          <>
            {/* Order Status Filter */}
            <View style={styles.filterContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {['all', 'requested', 'delivered', 'cancelled'].map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.filterButton,
                      selectedOrderStatus === status && styles.filterButtonActive,
                    ]}
                    onPress={() => setSelectedOrderStatus(status as any)}
                  >
                    <Text style={[
                      styles.filterButtonText,
                      selectedOrderStatus === status && styles.filterButtonTextActive,
                    ]}>
                      {status === 'all' ? 'All' : getStatusText(status)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateIcon}>📦</Text>
                <Text style={styles.emptyStateTitle}>No Orders Yet</Text>
                <Text style={styles.emptyStateText}>
                  {orders.length === 0 
                    ? "Start shopping to see your orders here!"
                    : "No orders match the selected filter."
                  }
                </Text>
                {orders.length === 0 && (
                  <TouchableOpacity 
                    style={styles.primaryButton}
                    onPress={() => router.push('/')}
                  >
                    <Text style={styles.primaryButtonText}>Start Shopping</Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <FlatList
                data={filteredOrders}
                renderItem={renderOrderItem}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                contentContainerStyle={styles.ordersList}
              />
            )}
          </>
        ) : activeTab === 'profile' ? (
          <>
            {/* 30. Enhanced Profile Form */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Personal Information</Text>
              <View style={styles.card}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Full Name</Text>
                  {isEditMode ? (
                    <TextInput
                      style={styles.input}
                      value={user.name}
                      onChangeText={(text) => setUser({ ...user, name: text })}
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <Text style={styles.value}>{user.name || 'Not set'}</Text>
                  )}
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Email</Text>
                  {isEditMode ? (
                    <TextInput
                      style={styles.input}
                      value={user.email}
                      onChangeText={(text) => setUser({ ...user, email: text })}
                      keyboardType="email-address"
                      placeholder="Enter your email"
                    />
                  ) : (
                    <Text style={styles.value}>{user.email || 'Not set'}</Text>
                  )}
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Phone Number</Text>
                  <Text style={styles.value}>{user.phone || 'Not set'}</Text>
                </View>

                {isEditMode && (
                  <TouchableOpacity style={styles.primaryButton} onPress={handleSaveProfile}>
                    <Text style={styles.primaryButtonText}>Save Changes</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* 31. Address Management */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Saved Addresses</Text>
                <TouchableOpacity style={styles.addButton} onPress={() => setIsAddressModalVisible(true)}>
                  <Text style={styles.addButtonText}>+ Add New</Text>
                </TouchableOpacity>
              </View>
              
              <FlatList
                data={addresses}
                scrollEnabled={false}
                renderItem={renderAddressItem}
                keyExtractor={(item) => item.id}
              />
            </View>
          </>
        ) : (
          /* 32. Security Tab */
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Security Settings</Text>
            <View style={styles.card}>
              <TouchableOpacity 
                style={styles.securityItem}
                onPress={() => setIsChangePasswordModal(true)}
              >
                <Text style={styles.securityIcon}>🔒</Text>
                <View style={styles.securityInfo}>
                  <Text style={styles.securityTitle}>Change Password</Text>
                  <Text style={styles.securityDescription}>Update your password regularly</Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>

              <View style={styles.securityItem}>
                <Text style={styles.securityIcon}>📱</Text>
                <View style={styles.securityInfo}>
                  <Text style={styles.securityTitle}>Two-Factor Authentication</Text>
                  <Text style={styles.securityDescription}>Add extra security to your account</Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </View>
            </View>
          </View>
        )}

        {/* 33. Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>🚪 Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

// 34. Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backButton: { padding: 8 },
  backButtonText: { fontSize: 20, color: '#1e293b' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#1e293b' },
  editHeaderButton: { fontSize: 16, color: '#3b82f6', fontWeight: '600' },
  content: { flex: 1 },
  
  // Profile Header
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    backgroundColor: 'white',
    marginBottom: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    color: 'white',
    fontWeight: 'bold',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#3b82f6',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  cameraBadgeText: {
    fontSize: 12,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  userPhone: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 4,
  },
  joinDate: {
    fontSize: 14,
    color: '#94a3b8',
  },
  
  // Stats Card
  statsCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  statSeparator: {
    width: 1,
    backgroundColor: '#e2e8f0',
  },
  
  // Enhanced Tabs
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#3b82f6',
  },
  tabIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  activeTabText: {
    color: 'white',
  },
  
  // Sections
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  card: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  
  // Input Groups
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  value: {
    fontSize: 16,
    color: '#1e293b',
    paddingVertical: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1e293b',
    backgroundColor: 'white',
  },
  
  // Buttons
  primaryButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  
  // Orders
  filterContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: '#3b82f6',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
  },
  filterButtonTextActive: {
    color: 'white',
  },
  ordersList: {
    paddingHorizontal: 16,
  },
  orderCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
    color: '#64748b',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  orderItems: {
    fontSize: 14,
    color: '#64748b',
  },
  viewButton: {
    backgroundColor: '#f8fafc',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  viewButtonText: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '600',
  },
  
  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#64748b',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 22,
  },
  
  // Address Card
  addressCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  defaultAddressCard: {
    borderColor: '#10b981',
    borderWidth: 2,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addressType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  defaultBadge: {
    backgroundColor: '#10b981',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  defaultBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  addressText: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 2,
  },
  
  // Security
  securityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  securityIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  securityInfo: {
    flex: 1,
  },
  securityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  securityDescription: {
    fontSize: 14,
    color: '#64748b',
  },
  chevron: {
    fontSize: 18,
    color: '#64748b',
  },
  
  // Logout
  logoutButton: {
    backgroundColor: 'white',
    margin: 16,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  logoutButtonText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

// 35. Export the component
export default Profile;