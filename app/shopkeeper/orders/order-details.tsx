import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, Phone, MapPin, Calendar, Clock, Package, User, CreditCard, CheckCircle } from 'lucide-react-native';

const OrderDetails = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Mock order data
  const order = {
    orderId: params.orderId || 'ORD123456',
    shopId: 'SHOP789',
    address: '123 Main Street, City, State, 12345',
    createdAt: '2025-01-15',
    deliveryDate: '2025-01-15',
    deliveryType: 'SAMEDAY',
    deliverySlot: '10:00 AM - 12:00 PM',
    status: 'PENDING',
    phone: '+1234567890',
    customerName: 'John Doe',
    totalAmount: '$125.50',
    paymentMethod: 'Credit Card',
    paymentStatus: 'Paid',
    items: [
      { id: '1', name: 'Organic Apples', quantity: 2, price: '$25.00', total: '$50.00' },
      { id: '2', name: 'Fresh Milk', quantity: 1, price: '$3.50', total: '$3.50' },
      { id: '3', name: 'Whole Wheat Bread', quantity: 3, price: '$4.00', total: '$12.00' },
      { id: '4', name: 'Free Range Eggs', quantity: 1, price: '$6.00', total: '$6.00' },
    ],
    subtotal: '$71.50',
    deliveryFee: '$5.00',
    tax: '$6.43',
    grandTotal: '$82.93'
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return '#FFA500';
      case 'PROCESSING': return '#4169E1';
      case 'DELIVERED': return '#32CD32';
      case 'CANCELLED': return '#FF4444';
      default: return '#666666';
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
          <ChevronLeft size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Order ID & Status */}
        <View style={styles.statusSection}>
          <View style={styles.orderIdContainer}>
            <Text style={styles.orderIdLabel}>Order #</Text>
            <Text style={styles.orderIdValue}>{order.orderId}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
            <Text style={styles.statusText}>{order.status}</Text>
          </View>
        </View>

        {/* Customer Info Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            <User size={18} color="#007AFF" /> Customer Information
          </Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Name:</Text>
            <Text style={styles.infoValue}>{order.customerName}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Phone size={16} color="#666666" />
            <Text style={styles.infoValue}>{order.phone}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <MapPin size={16} color="#666666" />
            <Text style={[styles.infoValue, styles.addressText]}>{order.address}</Text>
          </View>
        </View>

        {/* Order Timeline Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            <Calendar size={18} color="#007AFF" /> Order Timeline
          </Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Order Date:</Text>
            <Text style={styles.infoValue}>{order.createdAt}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Delivery Date:</Text>
            <Text style={styles.infoValue}>{order.deliveryDate}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Clock size={16} color="#666666" />
            <Text style={styles.infoLabel}>Time Slot:</Text>
            <Text style={styles.infoValue}>{order.deliverySlot}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Package size={16} color="#666666" />
            <Text style={styles.infoLabel}>Delivery Type:</Text>
            <Text style={styles.infoValue}>{order.deliveryType}</Text>
          </View>
        </View>

        {/* Order Items Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Order Items</Text>
          {order.items.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
              </View>
              <View style={styles.itemPriceContainer}>
                <Text style={styles.itemPrice}>{item.price} × {item.quantity}</Text>
                <Text style={styles.itemTotal}>{item.total}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Payment Summary Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            <CreditCard size={18} color="#007AFF" /> Payment Summary
          </Text>
          
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Subtotal:</Text>
            <Text style={styles.paymentValue}>{order.subtotal}</Text>
          </View>
          
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Delivery Fee:</Text>
            <Text style={styles.paymentValue}>{order.deliveryFee}</Text>
          </View>
          
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Tax:</Text>
            <Text style={styles.paymentValue}>{order.tax}</Text>
          </View>
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount:</Text>
            <Text style={styles.totalValue}>{order.grandTotal}</Text>
          </View>
          
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Payment Method:</Text>
            <Text style={styles.paymentValue}>{order.paymentMethod}</Text>
          </View>
          
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Payment Status:</Text>
            <View style={styles.paymentStatusContainer}>
              <CheckCircle size={16} color="#32CD32" />
              <Text style={[styles.paymentValue, styles.paidText]}>{order.paymentStatus}</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        {order.status === 'PENDING' && (
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={[styles.actionButton, styles.acceptButton]}>
              <Text style={styles.actionButtonText}>Accept Order</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.actionButton, styles.rejectButton]}>
              <Text style={[styles.actionButtonText, styles.rejectButtonText]}>Reject Order</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
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
  content: {
    flex: 1,
  },
  statusSection: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderIdContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  orderIdLabel: {
    fontSize: 14,
    color: '#666666',
    marginRight: 4,
  },
  orderIdValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 8,
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666666',
    width: 100,
  },
  infoValue: {
    fontSize: 14,
    color: '#000000',
    flex: 1,
  },
  addressText: {
    fontStyle: 'italic',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '500',
  },
  itemQuantity: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  itemPriceContainer: {
    alignItems: 'flex-end',
  },
  itemPrice: {
    fontSize: 12,
    color: '#666666',
  },
  itemTotal: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginTop: 2,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  paymentLabel: {
    fontSize: 14,
    color: '#666666',
  },
  paymentValue: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '500',
  },
  paymentStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  paidText: {
    color: '#32CD32',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  actionsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: '#007AFF',
  },
  rejectButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FF4444',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  rejectButtonText: {
    color: '#FF4444',
  },
});

export default OrderDetails;