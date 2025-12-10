// app/shopkeeper/orders/orders-list-screen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Modal,
  TextInput,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';

// Types
export interface Order {
  orderId: string;
  shopId: string;
  address: string;
  createdAt: string;
  deliveryDate: string;
  deliveryType: 'SAMEDAY' | 'NEXTDAY' | 'SCHEDULED';
  deliverySlot: string;
  status: 'PENDING' | 'PROCESSING' | 'DELIVERED' | 'CANCELLED';
  phone: string;
  customerName: string;
  totalAmount: string;
}

export interface FilterParams {
  shopId: string;
  fromOrderDate?: string;
  toOrderDate?: string;
  orderStatus: Array<'PENDING' | 'PROCESSING' | 'DELIVERED' | 'CANCELLED'>;
  deliveryType: Array<'SAMEDAY' | 'NEXTDAY' | 'SCHEDULED'>;
}

// Icon components
const FilterIcon = () => <Text style={styles.iconText}>⚡</Text>;
const CalendarIcon = () => <Text style={styles.iconText}>📅</Text>;
const XIcon = () => <Text style={styles.iconText}>✕</Text>;
const ChevronLeftIcon = () => <Text style={styles.iconText}>←</Text>;

const OrdersScreen: React.FC<{ initialTab?: 'all' | 'today' | 'pending' }> = ({ initialTab = 'all' }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'all' | 'today' | 'pending'>(initialTab);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Filter states
  const [filters, setFilters] = useState<FilterParams>({
    shopId: 'SHOP001',
    fromOrderDate: '',
    toOrderDate: '',
    orderStatus: ['PENDING', 'PROCESSING', 'DELIVERED', 'CANCELLED'],
    deliveryType: ['SAMEDAY', 'NEXTDAY', 'SCHEDULED'],
  });

  const statusOptions: Array<'PENDING' | 'PROCESSING' | 'DELIVERED' | 'CANCELLED'> = [
    'PENDING', 'PROCESSING', 'DELIVERED', 'CANCELLED'
  ];

  const deliveryTypeOptions: Array<'SAMEDAY' | 'NEXTDAY' | 'SCHEDULED'> = [
    'SAMEDAY', 'NEXTDAY', 'SCHEDULED'
  ];

  useEffect(() => {
    fetchOrders();
  }, [activeTab]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      // Mock data based on active tab
      let mockOrders: Order[] = [];
      
      const today = new Date().toISOString().split('T')[0];
      
      switch (activeTab) {
        case 'today':
          mockOrders = [
            {
              orderId: 'ORD789012',
              shopId: 'SHOP789',
              address: '101 Today Street, City, State, 12345',
              createdAt: today,
              deliveryDate: today,
              deliveryType: 'SAMEDAY',
              deliverySlot: '10:00 AM - 12:00 PM',
              status: 'PENDING',
              phone: '+1234567890',
              customerName: 'John Today',
              totalAmount: '$89.99'
            },
            {
              orderId: 'ORD789013',
              shopId: 'SHOP789',
              address: '202 Today Avenue, City, State, 12345',
              createdAt: today,
              deliveryDate: today,
              deliveryType: 'NEXTDAY',
              deliverySlot: '02:00 PM - 04:00 PM',
              status: 'PROCESSING',
              phone: '+1234567891',
              customerName: 'Jane Today',
              totalAmount: '$45.50'
            },
          ];
          break;
          
        case 'pending':
          mockOrders = [
            {
              orderId: 'ORD789014',
              shopId: 'SHOP789',
              address: '303 Pending Road, City, State, 12345',
              createdAt: '2025-01-15',
              deliveryDate: '2025-01-16',
              deliveryType: 'NEXTDAY',
              deliverySlot: '11:00 AM - 01:00 PM',
              status: 'PENDING',
              phone: '+1234567892',
              customerName: 'Bob Pending',
              totalAmount: '$75.25'
            },
            {
              orderId: 'ORD789015',
              shopId: 'SHOP789',
              address: '404 Waiting Street, City, State, 12345',
              createdAt: '2025-01-14',
              deliveryDate: '2025-01-15',
              deliveryType: 'SAMEDAY',
              deliverySlot: '09:00 AM - 11:00 AM',
              status: 'PENDING',
              phone: '+1234567893',
              customerName: 'Alice Pending',
              totalAmount: '$120.75'
            },
          ];
          break;
          
        default: // 'all'
          mockOrders = [
            {
              orderId: 'ORD123456',
              shopId: 'SHOP789',
              address: '123 Main Street, City, State, 12345',
              createdAt: '2025-01-15',
              deliveryDate: '2025-01-15',
              deliveryType: 'SAMEDAY',
              deliverySlot: '10:00 AM - 12:00 PM',
              status: 'DELIVERED',
              phone: '+1234567890',
              customerName: 'John Doe',
              totalAmount: '$125.50'
            },
            {
              orderId: 'ORD123457',
              shopId: 'SHOP789',
              address: '456 Oak Avenue, City, State, 12345',
              createdAt: '2025-01-14',
              deliveryDate: '2025-01-15',
              deliveryType: 'NEXTDAY',
              deliverySlot: '03:00 PM - 05:00 PM',
              status: 'PROCESSING',
              phone: '+1234567891',
              customerName: 'Jane Smith',
              totalAmount: '$89.99'
            },
            {
              orderId: 'ORD123458',
              shopId: 'SHOP789',
              address: '789 Pine Road, City, State, 12345',
              createdAt: '2025-01-13',
              deliveryDate: '2025-01-14',
              deliveryType: 'SCHEDULED',
              deliverySlot: '01:00 PM - 03:00 PM',
              status: 'CANCELLED',
              phone: '+1234567892',
              customerName: 'Mike Johnson',
              totalAmount: '$65.25'
            },
          ];
      }
      
      setOrders(mockOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const handleStatusToggle = (status: typeof statusOptions[0]) => {
    setFilters(prev => ({
      ...prev,
      orderStatus: prev.orderStatus.includes(status)
        ? prev.orderStatus.filter(s => s !== status)
        : [...prev.orderStatus, status],
    }));
  };

  const handleDeliveryTypeToggle = (type: typeof deliveryTypeOptions[0]) => {
    setFilters(prev => ({
      ...prev,
      deliveryType: prev.deliveryType.includes(type)
        ? prev.deliveryType.filter(t => t !== type)
        : [...prev.deliveryType, type],
    }));
  };

  const applyFilters = () => {
    setShowFilterModal(false);
    fetchOrders();
  };

  const resetFilters = () => {
    setFilters({
      shopId: 'SHOP001',
      fromOrderDate: '',
      toOrderDate: '',
      orderStatus: ['PENDING', 'PROCESSING', 'DELIVERED', 'CANCELLED'],
      deliveryType: ['SAMEDAY', 'NEXTDAY', 'SCHEDULED'],
    });
  };

  const renderOrderItem = ({ item }: { item: Order }) => (
    <TouchableOpacity 
      style={styles.orderCard}
      onPress={() => router.push({
        pathname: '/shopkeeper/orders/order-details',
        params: { orderId: item.orderId }
      })}
    >
      <View style={styles.orderHeader}>
        <View style={styles.orderInfo}>
          <Text style={styles.addressText}>{item.address}</Text>
          <View style={styles.orderMeta}>
            <Text style={styles.metaText}>Order Date: {item.createdAt}</Text>
            <Text style={styles.metaText}>•</Text>
            <Text style={styles.metaText}>Type: {item.deliveryType}</Text>
            <Text style={styles.metaText}>•</Text>
            <Text style={styles.metaText}>Slot: {item.deliverySlot}</Text>
          </View>
        </View>
        <View style={styles.orderActions}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'PENDING': return '#FFA500';
      case 'PROCESSING': return '#4169E1';
      case 'DELIVERED': return '#32CD32';
      case 'CANCELLED': return '#FF4444';
      default: return '#666666';
    }
  };

  const getScreenTitle = () => {
    switch (activeTab) {
      case 'today': return "Today's Orders";
      case 'pending': return 'Pending Orders';
      default: return 'All Orders';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeftIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{getScreenTitle()}</Text>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilterModal(true)}
        >
          <FilterIcon />
        </TouchableOpacity>
      </View>

      {/* Tabs - Only show when initialTab is 'all' (in main orders list) */}
      {initialTab === 'all' && (
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'all' && styles.activeTab]}
            onPress={() => setActiveTab('all')}
          >
            <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
              All Orders
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'today' && styles.activeTab]}
            onPress={() => setActiveTab('today')}
          >
            <Text style={[styles.tabText, activeTab === 'today' && styles.activeTabText]}>
              Today's
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'pending' && styles.activeTab]}
            onPress={() => setActiveTab('pending')}
          >
            <Text style={[styles.tabText, activeTab === 'pending' && styles.activeTabText]}>
              Pending
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Orders List */}
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.orderId}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={onRefresh}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No orders found</Text>
              <Text style={styles.emptySubText}>Try adjusting your filters</Text>
            </View>
          }
        />
      )}

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Orders</Text>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                <XIcon />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.filterContent}>
              {/* Date Range */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Date Range</Text>
                <View style={styles.dateInputContainer}>
                  <View style={styles.dateInput}>
                    <CalendarIcon />
                    <TextInput
                      style={styles.dateInputField}
                      placeholder="From Date"
                      value={filters.fromOrderDate}
                      onChangeText={(text) => setFilters(prev => ({ ...prev, fromOrderDate: text }))}
                    />
                  </View>
                  <Text style={styles.dateSeparator}>to</Text>
                  <View style={styles.dateInput}>
                    <CalendarIcon />
                    <TextInput
                      style={styles.dateInputField}
                      placeholder="To Date"
                      value={filters.toOrderDate}
                      onChangeText={(text) => setFilters(prev => ({ ...prev, toOrderDate: text }))}
                    />
                  </View>
                </View>
              </View>

              {/* Order Status */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Order Status</Text>
                <View style={styles.filterOptions}>
                  {statusOptions.map((status) => (
                    <TouchableOpacity
                      key={status}
                      style={[
                        styles.filterOption,
                        filters.orderStatus.includes(status) && styles.selectedFilterOption,
                      ]}
                      onPress={() => handleStatusToggle(status)}
                    >
                      <Text
                        style={[
                          styles.filterOptionText,
                          filters.orderStatus.includes(status) && styles.selectedFilterOptionText,
                        ]}
                      >
                        {status}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Delivery Type */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Delivery Type</Text>
                <View style={styles.filterOptions}>
                  {deliveryTypeOptions.map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.filterOption,
                        filters.deliveryType.includes(type) && styles.selectedFilterOption,
                      ]}
                      onPress={() => handleDeliveryTypeToggle(type)}
                    >
                      <Text
                        style={[
                          styles.filterOptionText,
                          filters.deliveryType.includes(type) && styles.selectedFilterOptionText,
                        ]}
                      >
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
                <Text style={styles.resetButtonText}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  filterButton: {
    backgroundColor: '#007AFF',
    padding: 8,
    borderRadius: 8,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
    paddingBottom: 20,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderInfo: {
    flex: 1,
    marginRight: 12,
  },
  addressText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  orderMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
  },
  metaText: {
    fontSize: 12,
    color: '#666666',
  },
  orderActions: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#999999',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  filterContent: {
    padding: 16,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
  },
  dateInputField: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#000000',
  },
  dateSeparator: {
    fontSize: 14,
    color: '#666666',
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#F5F5F5',
  },
  selectedFilterOption: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  filterOptionText: {
    fontSize: 14,
    color: '#666666',
  },
  selectedFilterOptionText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    gap: 12,
  },
  resetButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF4444',
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF4444',
  },
  applyButton: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#007AFF',
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  iconText: {
    fontSize: 18,
    color: '#FFFFFF',
  },
});

export default OrdersScreen;