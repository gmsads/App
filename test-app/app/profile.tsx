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
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getOrders, CartItem } from './cartStore';

// Updated Order interface to match cartStore
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

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  joinDate: string;
}

const Profile: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'orders' | 'profile'>('orders');
  const [selectedOrderStatus, setSelectedOrderStatus] = useState<'all' | 'delivered' | 'cancelled' | 'requested'>('all');
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAddressModalVisible, setIsAddressModalVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  // Mock user data
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    joinDate: 'January 2024',
  });

  // Mock addresses
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

  // Use real orders from cartStore
  const [orders, setOrders] = useState<Order[]>([]);

  // Load orders when component mounts
  useEffect(() => {
    loadOrders();
  }, []);

  // Load orders when component focuses (using a simpler approach)
  useEffect(() => {
    const interval = setInterval(() => {
      loadOrders();
    }, 1000); // Check every second

    return () => clearInterval(interval);
  }, []);

  const loadOrders = () => {
    const ordersFromStore = getOrders();
    setOrders(ordersFromStore);
  };

  const filteredOrders = selectedOrderStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === selectedOrderStatus);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return '#2ecc71';
      case 'cancelled': return '#e74c3c';
      case 'requested': return '#f39c12';
      default: return '#95a5a6';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      case 'requested': return 'Processing';
      default: return status;
    }
  };

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

  const handleSaveProfile = () => {
    setIsEditMode(false);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const handleAddAddress = () => {
    setEditingAddress(null);
    setIsAddressModalVisible(true);
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setIsAddressModalVisible(true);
  };

  const handleSaveAddress = (addressData: Omit<Address, 'id'>) => {
    if (editingAddress) {
      // Update existing address
      setAddresses(addresses.map(addr => 
        addr.id === editingAddress.id 
          ? { ...addressData, id: editingAddress.id }
          : addressData.isDefault ? { ...addr, isDefault: false } : addr
      ));
    } else {
      // Add new address
      const newAddress: Address = {
        ...addressData,
        id: Date.now().toString(),
      };
      setAddresses(prev => 
        addressData.isDefault 
          ? prev.map(addr => ({ ...addr, isDefault: false })).concat(newAddress)
          : prev.concat(newAddress)
      );
    }
    setIsAddressModalVisible(false);
    setEditingAddress(null);
  };

  const handleSetDefaultAddress = (addressId: string) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === addressId,
    })));
  };

  const handleDeleteAddress = (addressId: string) => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setAddresses(addresses.filter(addr => addr.id !== addressId));
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Success', 'You have been logged out successfully!');
            router.push('/');
          },
        },
      ]
    );
  };

  const renderOrderItem = ({ item }: { item: Order }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderNumber}>{item.orderNumber}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>
      <Text style={styles.orderDate}>Date: {item.date}</Text>
      <Text style={styles.orderTotal}>Total: ${item.total.toFixed(2)}</Text>
      <Text style={styles.orderItems}>
        Items: {item.items.slice(0, 2).map(item => item.name).join(', ')}
        {item.items.length > 2 && ` +${item.items.length - 2} more`}
      </Text>
      <TouchableOpacity
        style={styles.viewButton}
        onPress={() => handleViewOrder(item)}
      >
        <Text style={styles.viewButtonText}>View Details</Text>
      </TouchableOpacity>
    </View>
  );

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
      <View style={styles.addressActions}>
        {!item.isDefault && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleSetDefaultAddress(item.id)}
          >
            <Text style={styles.actionButtonText}>Set Default</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleEditAddress(item)}
        >
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteAddress(item.id)}
        >
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>👤 Profile</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'orders' && styles.activeTab]}
          onPress={() => setActiveTab('orders')}
        >
          <Text style={[styles.tabText, activeTab === 'orders' && styles.activeTabText]}>
            Order History ({orders.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'profile' && styles.activeTab]}
          onPress={() => setActiveTab('profile')}
        >
          <Text style={[styles.tabText, activeTab === 'profile' && styles.activeTabText]}>
            Profile & Address
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'orders' ? (
          <>
            {/* Order Status Filter */}
            <View style={styles.filterContainer}>
              <Text style={styles.filterTitle}>Filter by Status:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
                {['all', 'requested', 'delivered', 'cancelled'].map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.filterButton,
                      selectedOrderStatus === status && styles.filterButtonActive,
                    ]}
                    onPress={() => setSelectedOrderStatus(status as any)}
                  >
                    <Text
                      style={[
                        styles.filterButtonText,
                        selectedOrderStatus === status && styles.filterButtonTextActive,
                      ]}
                    >
                      {status === 'all' ? 'All Orders' : getStatusText(status)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
              <View style={styles.emptyOrdersContainer}>
                <Text style={styles.emptyOrdersTitle}>No Orders Yet</Text>
                <Text style={styles.emptyOrdersText}>
                  {orders.length === 0 
                    ? "You haven't placed any orders yet. Start shopping to see your order history here!"
                    : "No orders match the selected filter."
                  }
                </Text>
                {orders.length === 0 && (
                  <TouchableOpacity 
                    style={styles.startShoppingButton}
                    onPress={() => router.push('/')}
                  >
                    <Text style={styles.startShoppingText}>Start Shopping</Text>
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
        ) : (
          <>
            {/* Profile Summary */}
            <View style={styles.profileSection}>
              <Text style={styles.sectionTitle}>Profile Information</Text>
              <View style={styles.profileCard}>
                <View style={styles.profileHeader}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>👤</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => setIsEditMode(!isEditMode)}
                  >
                    <Text style={styles.editButtonText}>
                      {isEditMode ? 'Cancel' : 'Edit'}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.profileField}>
                  <Text style={styles.fieldLabel}>Name</Text>
                  {isEditMode ? (
                    <TextInput
                      style={styles.textInput}
                      value={userProfile.name}
                      onChangeText={(text) => setUserProfile({ ...userProfile, name: text })}
                      placeholder="Enter your name"
                    />
                  ) : (
                    <Text style={styles.fieldValue}>{userProfile.name}</Text>
                  )}
                </View>

                <View style={styles.profileField}>
                  <Text style={styles.fieldLabel}>Email</Text>
                  {isEditMode ? (
                    <TextInput
                      style={styles.textInput}
                      value={userProfile.email}
                      onChangeText={(text) => setUserProfile({ ...userProfile, email: text })}
                      keyboardType="email-address"
                      placeholder="Enter your email"
                    />
                  ) : (
                    <Text style={styles.fieldValue}>{userProfile.email}</Text>
                  )}
                </View>

                <View style={styles.profileField}>
                  <Text style={styles.fieldLabel}>Phone</Text>
                  {isEditMode ? (
                    <TextInput
                      style={styles.textInput}
                      value={userProfile.phone}
                      onChangeText={(text) => setUserProfile({ ...userProfile, phone: text })}
                      keyboardType="phone-pad"
                      placeholder="Enter your phone number"
                    />
                  ) : (
                    <Text style={styles.fieldValue}>{userProfile.phone}</Text>
                  )}
                </View>

                <View style={styles.profileField}>
                  <Text style={styles.fieldLabel}>Member Since</Text>
                  <Text style={styles.fieldValue}>{userProfile.joinDate}</Text>
                </View>

                {isEditMode && (
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSaveProfile}
                  >
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Address Management */}
            <View style={styles.addressSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Saved Addresses</Text>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={handleAddAddress}
                >
                  <Text style={styles.addButtonText}>+ Add New</Text>
                </TouchableOpacity>
              </View>

              <FlatList
                data={addresses}
                renderItem={renderAddressItem}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                contentContainerStyle={styles.addressesList}
              />
            </View>

            {/* Logout Button */}
            <View style={styles.logoutSection}>
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
              >
                <Text style={styles.logoutButtonText}>🚪 Logout</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>

      {/* Address Modal */}
      <AddressModal
        visible={isAddressModalVisible}
        address={editingAddress}
        onSave={handleSaveAddress}
        onClose={() => {
          setIsAddressModalVisible(false);
          setEditingAddress(null);
        }}
      />
    </SafeAreaView>
  );
};

// Address Modal Component
interface AddressModalProps {
  visible: boolean;
  address: Address | null;
  onSave: (address: Omit<Address, 'id'>) => void;
  onClose: () => void;
}

const AddressModal: React.FC<AddressModalProps> = ({ visible, address, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    type: address?.type || 'Home',
    street: address?.street || '',
    city: address?.city || '',
    state: address?.state || '',
    zipCode: address?.zipCode || '',
    isDefault: address?.isDefault || false,
  });

  React.useEffect(() => {
    if (address) {
      setFormData({
        type: address.type,
        street: address.street,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
        isDefault: address.isDefault,
      });
    } else {
      setFormData({
        type: 'Home',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        isDefault: false,
      });
    }
  }, [address]);

  const handleSave = () => {
    if (!formData.street.trim() || !formData.city.trim() || !formData.state.trim() || !formData.zipCode.trim()) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }
    onSave(formData);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>
            {address ? 'Edit Address' : 'Add New Address'}
          </Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeButton}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Address Type</Text>
            <View style={styles.typeButtons}>
              {['Home', 'Work', 'Other'].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeButton,
                    formData.type === type && styles.typeButtonActive,
                  ]}
                  onPress={() => setFormData({ ...formData, type })}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      formData.type === type && styles.typeButtonTextActive,
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Street Address *</Text>
            <TextInput
              style={styles.textInput}
              value={formData.street}
              onChangeText={(text) => setFormData({ ...formData, street: text })}
              placeholder="Enter street address"
              returnKeyType="next"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>City *</Text>
            <TextInput
              style={styles.textInput}
              value={formData.city}
              onChangeText={(text) => setFormData({ ...formData, city: text })}
              placeholder="Enter city"
              returnKeyType="next"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>State *</Text>
            <TextInput
              style={styles.textInput}
              value={formData.state}
              onChangeText={(text) => setFormData({ ...formData, state: text })}
              placeholder="Enter state"
              returnKeyType="next"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>ZIP Code *</Text>
            <TextInput
              style={styles.textInput}
              value={formData.zipCode}
              onChangeText={(text) => setFormData({ ...formData, zipCode: text })}
              placeholder="Enter ZIP code"
              keyboardType="numeric"
              returnKeyType="done"
            />
          </View>

          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setFormData({ ...formData, isDefault: !formData.isDefault })}
          >
            <View style={[styles.checkbox, formData.isDefault && styles.checkboxChecked]}>
              {formData.isDefault && <Text style={styles.checkboxTick}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>Set as default address</Text>
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.modalFooter}>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveModalButton} onPress={handleSave}>
            <Text style={styles.saveModalButtonText}>
              {address ? 'Update' : 'Save'} Address
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 20,
    color: '#2c3e50',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  headerRight: {
    width: 40,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#2ecc71',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#95a5a6',
  },
  activeTabText: {
    color: '#2ecc71',
  },
  content: {
    flex: 1,
  },
  filterContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
  },
  filterScroll: {
    flexGrow: 0,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: '#2ecc71',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7f8c8d',
  },
  filterButtonTextActive: {
    color: 'white',
  },
  ordersList: {
    padding: 16,
  },
  emptyOrdersContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyOrdersTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#95a5a6',
    marginBottom: 12,
  },
  emptyOrdersText: {
    fontSize: 16,
    color: '#bdc3c7',
    textAlign: 'center',
    lineHeight: 22,
  },
  startShoppingButton: {
    backgroundColor: '#2ecc71',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  startShoppingText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  orderCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  orderDate: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: 4,
  },
  orderItems: {
    fontSize: 14,
    color: '#95a5a6',
    marginBottom: 12,
  },
  viewButton: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  profileSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
  },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ecf0f1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#3498db',
  },
  editButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  profileField: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7f8c8d',
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 16,
    color: '#2c3e50',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#bdc3c7',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#2c3e50',
    backgroundColor: 'white',
  },
  saveButton: {
    backgroundColor: '#2ecc71',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addressSection: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#2ecc71',
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  addressesList: {
    paddingBottom: 16,
  },
  addressCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ecf0f1',
  },
  defaultAddressCard: {
    borderColor: '#2ecc71',
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
    color: '#2c3e50',
  },
  defaultBadge: {
    backgroundColor: '#2ecc71',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  defaultBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  addressText: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 2,
  },
  addressActions: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#3498db',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
  },
  logoutSection: {
    padding: 16,
    paddingTop: 0,
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  closeButton: {
    fontSize: 20,
    color: '#7f8c8d',
    padding: 4,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ecf0f1',
  },
  typeButtonActive: {
    backgroundColor: '#2ecc71',
    borderColor: '#2ecc71',
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7f8c8d',
  },
  typeButtonTextActive: {
    color: 'white',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#bdc3c7',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#2ecc71',
    borderColor: '#2ecc71',
  },
  checkboxTick: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#2c3e50',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#95a5a6',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  saveModalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#2ecc71',
    alignItems: 'center',
  },
  saveModalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Profile;