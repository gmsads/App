import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// Import cart store functions
import { 
  cartItems, 
  clearCart, 
  removeFromCart, 
  updateCartItemQuantity, 
  createOrder,
  subscribeToCartChanges  // Add this import
} from './cartStore';

// Types for our data structures
interface Address {
  id: string;
  name: string;
  flatNo: string;
  address: string;
  phone: string;
  area: string;
  city: string;
  pincode: string;
}

interface DeliveryDate {
  id: string;
  date: Date;
  displayDate: string;
  dayName: string;
  isToday: boolean;
  isTomorrow: boolean;
}

interface DeliverySlot {
  id: string;
  dateId: string;
  time: string;
  available: boolean;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  type: 'card' | 'upi' | 'cod' | 'wallet';
}

interface TipOption {
  id: string;
  amount: number | 'custom';
  label: string;
}

interface DailyOffer {
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  minAmount: number;
  description: string;
}

// Daily offers configuration in Indian Rupees
const DAILY_OFFERS: { [key: string]: DailyOffer } = {
  monday: { 
    code: 'MON20', 
    discount: 20, 
    type: 'percentage', 
    minAmount: 1000, 
    description: '20% off on all orders above ₹1000' 
  },
  tuesday: { 
    code: 'TUE15', 
    discount: 15, 
    type: 'percentage', 
    minAmount: 800, 
    description: '15% off on all orders above ₹800' 
  },
  wednesday: { 
    code: 'WED25', 
    discount: 25, 
    type: 'percentage', 
    minAmount: 1200, 
    description: '25% off on all orders above ₹1200' 
  },
  thursday: { 
    code: 'THU10', 
    discount: 10, 
    type: 'percentage', 
    minAmount: 600, 
    description: '10% off on all orders above ₹600' 
  },
  friday: { 
    code: 'FRI30', 
    discount: 30, 
    type: 'percentage', 
    minAmount: 1400, 
    description: '30% off on all orders above ₹1400' 
  },
  saturday: { 
    code: 'SATFIXED', 
    discount: 100, 
    type: 'fixed', 
    minAmount: 800, 
    description: '₹100 off on all orders above ₹800' 
  },
  sunday: { 
    code: 'SUNFREE', 
    discount: 50, 
    type: 'fixed', 
    minAmount: 1000, 
    description: 'Free shipping - ₹50 off on orders above ₹1000' 
  }
};

// Mock data for addresses
const ADDRESSES: Address[] = [
  { 
    id: '1', 
    name: 'Home', 
    flatNo: 'A-101', 
    address: 'Green Valley Apartments',
    area: 'Sector 15',
    city: 'Gurgaon',
    pincode: '122001',
    phone: '+91-9876543210' 
  },
  { 
    id: '2', 
    name: 'Work', 
    flatNo: 'Office 5B', 
    address: 'Tech Park Building',
    area: 'Electronic City',
    city: 'Bangalore',
    pincode: '560100',
    phone: '+91-9876543211' 
  },
];

// Function to generate delivery dates (next 7 days)
const generateDeliveryDates = (): DeliveryDate[] => {
  const dates: DeliveryDate[] = [];
  const today = new Date();
  
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(today);
    currentDate.setDate(today.getDate() + i);
    
    const dayName = currentDate.toLocaleDateString('en-US', { weekday: 'long' });
    const displayDate = currentDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
    
    dates.push({
      id: `date_${i}`,
      date: currentDate,
      displayDate: displayDate,
      dayName: dayName,
      isToday: i === 0,
      isTomorrow: i === 1
    });
  }
  
  return dates;
};

// Function to generate delivery slots for a specific date
const generateDeliverySlots = (dateId: string): DeliverySlot[] => {
  const slots: DeliverySlot[] = [
    { id: `${dateId}_morning1`, dateId, time: '9:00 AM - 11:00 AM', available: true },
    { id: `${dateId}_morning2`, dateId, time: '11:00 AM - 1:00 PM', available: true },
    { id: `${dateId}_afternoon1`, dateId, time: '1:00 PM - 3:00 PM', available: true },
    { id: `${dateId}_afternoon2`, dateId, time: '3:00 PM - 5:00 PM', available: true },
    { id: `${dateId}_evening1`, dateId, time: '5:00 PM - 7:00 PM', available: true },
    { id: `${dateId}_evening2`, dateId, time: '7:00 PM - 9:00 PM', available: true },
  ];
  
  return slots;
};

// Mock data for payment methods
const PAYMENT_METHODS: PaymentMethod[] = [
  { id: '1', name: 'Credit Card', icon: '💳', type: 'card' },
  { id: '2', name: 'Debit Card', icon: '💳', type: 'card' },
  { id: '3', name: 'UPI', icon: '📱', type: 'upi' },
  { id: '4', name: 'Cash on Delivery', icon: '💰', type: 'cod' },
];

// Mock data for tip options in Indian Rupees
const TIP_OPTIONS: TipOption[] = [
  { id: '1', amount: 0, label: 'No tip' },
  { id: '2', amount: 20, label: '₹20' },
  { id: '3', amount: 50, label: '₹50' },
  { id: '4', amount: 100, label: '₹100' },
  { id: '5', amount: 'custom', label: 'Custom' },
];

// Constants for pricing in Indian Rupees
const MINIMUM_ORDER_AMOUNT = 500;
const DELIVERY_FEE = 49;
const HANDLING_CHARGE = 30;

const CartScreen: React.FC = () => {
  const router = useRouter();
  const [promoCode, setPromoCode] = useState<string>('');
  const [discount, setDiscount] = useState<number>(0);
  const [appliedCoupon, setAppliedCoupon] = useState<DailyOffer | null>(null);
  const [cartItemsState, setCartItemsState] = useState<any[]>([]);
  
  const [selectedAddress, setSelectedAddress] = useState<Address>(ADDRESSES[0]);
  const [deliveryDates, setDeliveryDates] = useState<DeliveryDate[]>([]);
  const [selectedDate, setSelectedDate] = useState<DeliveryDate | null>(null);
  const [deliverySlots, setDeliverySlots] = useState<DeliverySlot[]>([]);
  const [selectedDeliverySlot, setSelectedDeliverySlot] = useState<DeliverySlot | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>(PAYMENT_METHODS[0]);
  const [selectedTip, setSelectedTip] = useState<TipOption>(TIP_OPTIONS[0]);
  const [customTip, setCustomTip] = useState<string>('');
  
  // Modal states
  const [showAddressModal, setShowAddressModal] = useState<boolean>(false);
  const [showDeliveryModal, setShowDeliveryModal] = useState<boolean>(false);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [showLocationModal, setShowLocationModal] = useState<boolean>(false);
  const [showConfirmOrderModal, setShowConfirmOrderModal] = useState<boolean>(false);
  const [showOrderConfirmation, setShowOrderConfirmation] = useState<boolean>(false);
  
  // Payment method specific states
  const [cardNumber, setCardNumber] = useState<string>('');
  const [expiryDate, setExpiryDate] = useState<string>('');
  const [cvv, setCvv] = useState<string>('');
  const [cardHolder, setCardHolder] = useState<string>('');
  const [upiId, setUpiId] = useState<string>('');
  
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [isLocationLoading, setIsLocationLoading] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Initialize delivery dates and select today by default
  useEffect(() => {
    // Initial load of cart items
    setCartItemsState([...cartItems]);
    
    // Subscribe to cart changes
    const unsubscribe = subscribeToCartChanges(() => {
      setCartItemsState([...cartItems]);
    });
    
    const dates = generateDeliveryDates();
    setDeliveryDates(dates);
    
    // Select today by default
    const todayDate = dates.find(date => date.isToday);
    if (todayDate) {
      setSelectedDate(todayDate);
      const slots = generateDeliverySlots(todayDate.id);
      setDeliverySlots(slots);
      
      // Select first available slot by default
      const firstAvailableSlot = slots.find(slot => slot.available);
      if (firstAvailableSlot) {
        setSelectedDeliverySlot(firstAvailableSlot);
      }
    }
    
    return () => unsubscribe();
  }, []);

  // Handle date selection
  const handleDateSelect = (date: DeliveryDate) => {
    setSelectedDate(date);
    const slots = generateDeliverySlots(date.id);
    setDeliverySlots(slots);
    
    // Reset selected slot when date changes
    setSelectedDeliverySlot(null);
  };

  // Get today's offer
  const getTodaysOffer = (): DailyOffer => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = new Date().getDay();
    const todayKey = days[today];
    return DAILY_OFFERS[todayKey] || DAILY_OFFERS.monday;
  };

  // Calculate totals
  const subtotal = cartItemsState.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const deliveryFee = subtotal >= MINIMUM_ORDER_AMOUNT ? 0 : DELIVERY_FEE;
  const tipAmount = selectedTip.amount === 'custom' ? (parseFloat(customTip) || 0) : (selectedTip.amount as number);
  const total = Math.max(0, subtotal + tax + deliveryFee + HANDLING_CHARGE + tipAmount - discount);

  // Update item quantity
  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(id);
      return;
    }
    updateCartItemQuantity(id, newQuantity);
    // Note: No need to update cartItemsState here because subscribeToCartChanges will handle it
  };

  // Remove item from cart
  const removeItem = (id: string) => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            removeFromCart(id);
            // Note: No need to update cartItemsState here because subscribeToCartChanges will handle it
          },
        },
      ]
    );
  };

  // Apply promo code
  const applyPromoCode = () => {
    const trimmedCode = promoCode.trim().toUpperCase();
    
    if (!trimmedCode) {
      Alert.alert('Error', 'Please enter a promo code');
      return;
    }

    // Check for SAVE10 code
    if (trimmedCode === 'SAVE10') {
      const newDiscount = subtotal * 0.1;
      setDiscount(newDiscount);
      setAppliedCoupon({ 
        code: 'SAVE10', 
        discount: 10, 
        type: 'percentage', 
        minAmount: 0,
        description: '10% discount' 
      });
      Alert.alert('Success', 'Promo code applied! 10% discount added.');
      setPromoCode('');
      return;
    }

    // Check for daily offer codes
    const todaysOffer = getTodaysOffer();
    if (trimmedCode === todaysOffer.code) {
      // Check if minimum amount requirement is met
      if (subtotal >= todaysOffer.minAmount) {
        let newDiscount = 0;
        
        if (todaysOffer.type === 'percentage') {
          newDiscount = subtotal * (todaysOffer.discount / 100);
        } else {
          newDiscount = todaysOffer.discount;
        }
        
        setDiscount(newDiscount);
        setAppliedCoupon(todaysOffer);
        Alert.alert('Success', `Promo code applied! ${todaysOffer.description}`);
        setPromoCode('');
        return;
      } else {
        Alert.alert(
          'Minimum Amount Required',
          `This promo code requires a minimum order of ₹${todaysOffer.minAmount}. Add ₹${(todaysOffer.minAmount - subtotal).toFixed(2)} more to use this offer.`
        );
        return;
      }
    }

    // Check all other daily offers (not just today's)
    const allOfferCodes = Object.values(DAILY_OFFERS);
    const matchedOffer = allOfferCodes.find(offer => offer.code === trimmedCode);
    
    if (matchedOffer) {
      // Check if minimum amount requirement is met
      if (subtotal >= matchedOffer.minAmount) {
        let newDiscount = 0;
        
        if (matchedOffer.type === 'percentage') {
          newDiscount = subtotal * (matchedOffer.discount / 100);
        } else {
          newDiscount = matchedOffer.discount;
        }
        
        setDiscount(newDiscount);
        setAppliedCoupon(matchedOffer);
        Alert.alert('Success', `Promo code applied! ${matchedOffer.description}`);
        setPromoCode('');
        return;
      } else {
        Alert.alert(
          'Minimum Amount Required',
          `This promo code requires a minimum order of ₹${matchedOffer.minAmount}. Add ₹${(matchedOffer.minAmount - subtotal).toFixed(2)} more to use this offer.`
        );
        return;
      }
    }

    Alert.alert('Invalid Code', 'The promo code is invalid.');
    setPromoCode('');
  };

  // Remove applied coupon
  const removeCoupon = () => {
    setDiscount(0);
    setAppliedCoupon(null);
  };

  // Get current location
  const getCurrentLocation = async () => {
    setIsLocationLoading(true);
    setTimeout(() => {
      const mockAddress: Address = {
        id: 'current',
        name: 'Current Location',
        flatNo: 'Your Location',
        address: '123 Current Street',
        area: 'Current Area',
        city: 'Current City',
        pincode: '100001',
        phone: '+91-9876500000'
      };
      setSelectedAddress(mockAddress);
      setShowLocationModal(false);
      setIsLocationLoading(false);
      Alert.alert('Location Updated', 'Current location set as delivery address');
    }, 2000);
  };

  // Validate payment details
  const validatePayment = (): boolean => {
    if (selectedPaymentMethod.type === 'card') {
      if (!cardNumber || !expiryDate || !cvv || !cardHolder) {
        Alert.alert('Payment Error', 'Please fill all card details');
        return false;
      }
      if (cardNumber.replace(/\s/g, '').length !== 16) {
        Alert.alert('Payment Error', 'Please enter a valid 16-digit card number');
        return false;
      }
    } else if (selectedPaymentMethod.type === 'upi') {
      if (!upiId || !upiId.includes('@')) {
        Alert.alert('Payment Error', 'Please enter a valid UPI ID');
        return false;
      }
    }
    return true;
  };

  // Process payment
  const processPayment = async (): Promise<boolean> => {
    setIsProcessing(true);
    
    // Simulate payment processing
    return new Promise((resolve) => {
      setTimeout(() => {
        setIsProcessing(false);
        // Simulate successful payment 90% of the time
        const success = Math.random() > 0.1;
        resolve(success);
      }, 3000);
    });
  };

  // Show confirm order modal
  const showConfirmOrder = () => {
    if (cartItemsState.length === 0) {
      Alert.alert('Empty Cart', 'Your cart is empty');
      return;
    }
    
    if (subtotal < MINIMUM_ORDER_AMOUNT) {
      Alert.alert('Minimum Order Not Met', `Add ₹${(MINIMUM_ORDER_AMOUNT - subtotal).toFixed(2)} more to proceed.`);
      return;
    }
    
    if (!selectedDeliverySlot || !selectedDate) {
      Alert.alert('Delivery Time Required', 'Please select a delivery date and time slot');
      return;
    }
    
    if (!validatePayment()) {
      return;
    }
    
    setShowConfirmOrderModal(true);
  };

  // Confirm and place order
  const confirmOrder = async () => {
    setShowConfirmOrderModal(false);
    
    const paymentSuccess = await processPayment();
    
    if (!paymentSuccess) {
      Alert.alert('Payment Failed', 'Your payment could not be processed. Please try again or use a different payment method.');
      return;
    }

    const deliveryDateString = selectedDate?.isToday ? 'Today' : 
                              selectedDate?.isTomorrow ? 'Tomorrow' : 
                              selectedDate?.date.toLocaleDateString('en-US', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              });

    const orderData = {
      orderId: 'ORD' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      items: cartItemsState,
      address: selectedAddress,
      deliveryDate: deliveryDateString,
      deliveryTime: selectedDeliverySlot?.time,
      paymentMethod: selectedPaymentMethod.name,
      paymentDetails: selectedPaymentMethod.type === 'card' ? 
        { cardNumber: cardNumber.slice(-4) } : 
        selectedPaymentMethod.type === 'upi' ? { upiId } : {},
      subtotal: subtotal,
      tax: tax,
      deliveryFee: deliveryFee,
      handlingCharge: HANDLING_CHARGE,
      tip: tipAmount,
      discount: discount,
      total: total,
      appliedCoupon: appliedCoupon,
      orderTime: new Date().toLocaleString(),
      estimatedDelivery: new Date(Date.now() + 30 * 60 * 1000).toLocaleString(),
    };
    
    setOrderDetails(orderData);
    setShowOrderConfirmation(true);
    
    // Create order in cartStore
    createOrder();
    
    // Clear local states
    setDiscount(0);
    setAppliedCoupon(null);
    setPromoCode('');
    setSelectedTip(TIP_OPTIONS[0]);
    setCustomTip('');
    
    // Note: cartItemsState will be automatically updated by the subscription
  };

  // Handle back to shopping
  const handleBackToShopping = () => {
    setDiscount(0);
    setAppliedCoupon(null);
    setSelectedTip(TIP_OPTIONS[0]);
    setCustomTip('');
    setShowOrderConfirmation(false);
    router.back();
  };

  // Simple checkout function
  const handleSimpleCheckout = () => {
    if (cartItemsState.length === 0) {
      Alert.alert('Empty Cart', 'Your cart is empty. Add some items first!');
      return;
    }
    
    // Calculate final total with all charges
    const subtotal = cartItemsState.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal * 0.08;
    const finalTotal = subtotal + tax + DELIVERY_FEE + HANDLING_CHARGE - discount;
    
    // Create the order
    const newOrder = createOrder();
    
    Alert.alert(
      'Order Confirmed! 🎉',
      `Your order #${newOrder.orderNumber} has been placed successfully!\n\nTotal: ₹${finalTotal.toFixed(2)}\nItems: ${cartItemsState.length} products`,
      [
        {
          text: 'View Orders',
          onPress: () => {
            router.push('/profile');
          }
        },
        {
          text: 'Continue Shopping',
          onPress: () => {
            router.back();
          }
        }
      ]
    );
    
    // Clear local state
    setDiscount(0);
    setPromoCode('');
    setSelectedTip(TIP_OPTIONS[0]);
    setCustomTip('');
    setAppliedCoupon(null);
  };

  // Track order function
  const handleTrackOrder = () => {
    Alert.alert(
      'Track Your Order',
      `Order #${orderDetails?.orderId} is being processed and will be delivered by ${orderDetails?.estimatedDelivery}.\n\n📦 Current Status: Order Confirmed\n🚚 Delivery: ${orderDetails?.deliveryDate} at ${orderDetails?.deliveryTime}\n📍 Address: ${orderDetails?.address.flatNo}, ${orderDetails?.address.address}`,
      [
        {
          text: 'OK',
          style: 'default'
        }
      ]
    );
  };

  // Render date item
  const renderDateItem = ({ item }: { item: DeliveryDate }) => (
    <TouchableOpacity
      style={[
        styles.dateItem,
        selectedDate?.id === item.id && styles.selectedDateItem
      ]}
      onPress={() => handleDateSelect(item)}
    >
      <Text style={[
        styles.dateDayName,
        selectedDate?.id === item.id && styles.selectedDateText
      ]}>
        {item.isToday ? 'Today' : item.isTomorrow ? 'Tomorrow' : item.dayName}
      </Text>
      <Text style={[
        styles.dateNumber,
        selectedDate?.id === item.id && styles.selectedDateText
      ]}>
        {item.displayDate}
      </Text>
    </TouchableOpacity>
  );

  // Render delivery slot item
  const renderDeliverySlotItem = ({ item }: { item: DeliverySlot }) => (
    <TouchableOpacity
      style={[
        styles.deliverySlotItem,
        selectedDeliverySlot?.id === item.id && styles.selectedDeliverySlotItem,
        !item.available && styles.unavailableDeliverySlot
      ]}
      onPress={() => {
        if (item.available) {
          setSelectedDeliverySlot(item);
        }
      }}
      disabled={!item.available}
    >
      <Text style={[
        styles.deliverySlotTime,
        !item.available && styles.unavailableDeliverySlotText,
        selectedDeliverySlot?.id === item.id && styles.selectedDeliverySlotText
      ]}>
        {item.time}
      </Text>
      {!item.available && <Text style={styles.unavailableText}>Unavailable</Text>}
    </TouchableOpacity>
  );

  // Render address item
  const renderAddressItem = ({ item }: { item: Address }) => (
    <TouchableOpacity
      style={[
        styles.addressItem,
        selectedAddress.id === item.id && styles.selectedAddressItem
      ]}
      onPress={() => {
        setSelectedAddress(item);
        setShowAddressModal(false);
      }}
    >
      <Text style={styles.addressName}>{item.name}</Text>
      <Text style={styles.addressText}>{item.flatNo}, {item.address}</Text>
      <Text style={styles.areaText}>{item.area}, {item.city} - {item.pincode}</Text>
    </TouchableOpacity>
  );

  // Render payment method item
  const renderPaymentMethodItem = ({ item }: { item: PaymentMethod }) => (
    <TouchableOpacity
      style={[
        styles.paymentMethodItem,
        selectedPaymentMethod.id === item.id && styles.selectedPaymentMethodItem
      ]}
      onPress={() => {
        setSelectedPaymentMethod(item);
        setShowPaymentModal(false);
      }}
    >
      <Text style={styles.paymentIcon}>{item.icon}</Text>
      <Text style={styles.paymentMethodText}>{item.name}</Text>
    </TouchableOpacity>
  );

  // Render tip option
  const renderTipOption = ({ item }: { item: TipOption }) => (
    <TouchableOpacity
      style={[
        styles.tipOption,
        selectedTip.id === item.id && styles.selectedTipOption
      ]}
      onPress={() => {
        setSelectedTip(item);
        if (item.id !== '5') setCustomTip('');
      }}
    >
      <Text style={[
        styles.tipOptionText,
        selectedTip.id === item.id && styles.selectedTipOptionText
      ]}>
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  // Render cart item
  const renderCartItem = ({ item }: { item: any }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>₹{item.price.toFixed(2)}</Text>
        <Text style={styles.itemUnit}>{item.unit}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => updateQuantity(item.id, item.quantity - 1)}
          >
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => updateQuantity(item.id, item.quantity + 1)}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeItem(item.id)}
      >
        <Text style={styles.removeButtonText}>×</Text>
      </TouchableOpacity>
    </View>
  );

  // Empty cart state
  if (cartItemsState.length === 0 && !showOrderConfirmation) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
          <Text style={styles.emptyText}>Add some items to get started!</Text>
          <TouchableOpacity 
            style={styles.continueShoppingBtn}
            onPress={() => router.back()}
          >
            <Text style={styles.continueShoppingBtnText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Order confirmation screen
  if (showOrderConfirmation) {
    return (
      <SafeAreaView style={styles.confirmationScreen}>
        <ScrollView contentContainerStyle={styles.confirmationContent}>
          <View style={styles.successIcon}>
            <Text style={styles.successIconText}>✓</Text>
          </View>
          <Text style={styles.confirmationTitle}>Order Confirmed!</Text>
          <Text style={styles.confirmationSubtitle}>Thank you for your purchase</Text>
          
          <View style={styles.orderDetailsCard}>
            <Text style={styles.orderDetailsTitle}>Order Details</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Order ID:</Text>
              <Text style={styles.detailValue}>{orderDetails?.orderId}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Delivery Date:</Text>
              <Text style={styles.detailValue}>{orderDetails?.deliveryDate}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Delivery Time:</Text>
              <Text style={styles.detailValue}>{orderDetails?.deliveryTime}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Delivery Address:</Text>
              <Text style={styles.detailValue}>
                {orderDetails?.address.flatNo}, {orderDetails?.address.address}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Estimated Delivery:</Text>
              <Text style={styles.detailValue}>{orderDetails?.estimatedDelivery}</Text>
            </View>
            
            <Text style={styles.itemsTitle}>Items Ordered:</Text>
            {orderDetails?.items.map((item: any) => (
              <View key={item.id} style={styles.orderItem}>
                <Text style={styles.orderItemName}>{item.name}</Text>
                <Text style={styles.orderItemQuantity}>x{item.quantity}</Text>
                <Text style={styles.orderItemPrice}>₹{(item.price * item.quantity).toFixed(2)}</Text>
              </View>
            ))}
            
            <View style={styles.orderSummary}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal:</Text>
                <Text style={styles.summaryValue}>₹{orderDetails?.subtotal.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tax:</Text>
                <Text style={styles.summaryValue}>₹{orderDetails?.tax.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Delivery:</Text>
                <Text style={styles.summaryValue}>
                  {orderDetails?.deliveryFee > 0 ? `₹${orderDetails?.deliveryFee.toFixed(2)}` : 'FREE'}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tip:</Text>
                <Text style={styles.summaryValue}>₹{orderDetails?.tip.toFixed(2)}</Text>
              </View>
              {orderDetails?.discount > 0 && (
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, styles.discountText]}>Discount:</Text>
                  <Text style={[styles.summaryValue, styles.discountText]}>
                    -₹{orderDetails?.discount.toFixed(2)}
                  </Text>
                </View>
              )}
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total:</Text>
                <Text style={styles.totalValue}>₹{orderDetails?.total.toFixed(2)}</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.confirmationButtons}>
            <TouchableOpacity 
              style={styles.trackOrderButton}
              onPress={handleTrackOrder}
            >
              <Text style={styles.trackOrderButtonText}>Track Your Order</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.continueShoppingButton}
              onPress={handleBackToShopping}
            >
              <Text style={styles.continueShoppingButtonText}>Continue Shopping</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const todaysOffer = getTodaysOffer();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shopping Cart</Text>
        <Text style={styles.itemCount}>{cartItemsState.length} items</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Location Header */}
        <View style={styles.locationHeader}>
          <Text style={styles.locationIcon}>📍</Text>
          <View style={styles.locationDetails}>
            <Text style={styles.deliveryText}>Delivery in 10 minutes</Text>
            <TouchableOpacity 
              style={styles.locationSelector}
              onPress={() => setShowLocationModal(true)}
            >
              <Text style={styles.locationAddress} numberOfLines={1}>
                {selectedAddress.flatNo}, {selectedAddress.address}, {selectedAddress.area}
              </Text>
              <Text style={styles.changeLocationText}>Change</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Today's Offer */}
        <View style={styles.todaysOfferBanner}>
          <Text style={styles.todaysOfferTitle}>🎁 Today's Special Offer</Text>
          <Text style={styles.todaysOfferText}>{todaysOffer.description}</Text>
          <Text style={styles.todaysOfferCode}>Use code: <Text style={styles.todaysOfferCodeHighlight}>{todaysOffer.code}</Text></Text>
        </View>

        {/* Cart Items */}
        <View style={styles.cartItemsSection}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          <FlatList
            data={cartItemsState}
            renderItem={renderCartItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        </View>

        {/* Delivery Time Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Time</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <Text style={styles.infoLabel}>Your Delivery Schedule</Text>
              <TouchableOpacity onPress={() => setShowDeliveryModal(true)}>
                <Text style={styles.changeText}>Change</Text>
              </TouchableOpacity>
            </View>
            {selectedDate && selectedDeliverySlot ? (
              <Text style={styles.selectedSlotText}>
                {selectedDate.isToday ? 'Today' : selectedDate.isTomorrow ? 'Tomorrow' : selectedDate.dayName}, {selectedDate.displayDate} • {selectedDeliverySlot.time}
              </Text>
            ) : (
              <Text style={styles.noSlotText}>Please select a delivery date and time</Text>
            )}
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Add a Tip</Text>
            <FlatList
              data={TIP_OPTIONS}
              renderItem={renderTipOption}
              keyExtractor={item => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.tipOptionsList}
            />
            {selectedTip.id === '5' && (
              <TextInput
                style={styles.customTipInput}
                placeholder="Enter custom tip amount"
                value={customTip}
                onChangeText={setCustomTip}
                keyboardType="numeric"
              />
            )}
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <Text style={styles.infoLabel}>Selected Method</Text>
              <TouchableOpacity onPress={() => setShowPaymentModal(true)}>
                <Text style={styles.changeText}>Change</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.selectedPaymentText}>
              {selectedPaymentMethod.icon} {selectedPaymentMethod.name}
            </Text>

            {/* Card Payment Form */}
            {selectedPaymentMethod.type === 'card' && (
              <View style={styles.paymentForm}>
                <TextInput
                  style={styles.paymentInput}
                  placeholder="Card Number"
                  value={cardNumber}
                  onChangeText={setCardNumber}
                  keyboardType="numeric"
                  maxLength={19}
                />
                <View style={styles.paymentRow}>
                  <TextInput
                    style={[styles.paymentInput, styles.halfInput]}
                    placeholder="MM/YY"
                    value={expiryDate}
                    onChangeText={setExpiryDate}
                    maxLength={5}
                  />
                  <TextInput
                    style={[styles.paymentInput, styles.halfInput]}
                    placeholder="CVV"
                    value={cvv}
                    onChangeText={setCvv}
                    keyboardType="numeric"
                    maxLength={3}
                    secureTextEntry
                  />
                </View>
                <TextInput
                  style={styles.paymentInput}
                  placeholder="Card Holder Name"
                  value={cardHolder}
                  onChangeText={setCardHolder}
                />
              </View>
            )}

            {/* UPI Payment Form */}
            {selectedPaymentMethod.type === 'upi' && (
              <View style={styles.paymentForm}>
                <TextInput
                  style={styles.paymentInput}
                  placeholder="UPI ID (e.g., name@upi)"
                  value={upiId}
                  onChangeText={setUpiId}
                  autoCapitalize="none"
                />
              </View>
            )}

            {/* Cash on Delivery */}
            {selectedPaymentMethod.type === 'cod' && (
              <View style={styles.codMessage}>
                <Text style={styles.codText}>
                  Pay with cash when your order is delivered. Please keep exact change ready.
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Promo Code */}
        <View style={styles.promoSection}>
          {appliedCoupon ? (
            <View style={styles.appliedCouponContainer}>
              <Text style={styles.appliedCouponText}>Applied: {appliedCoupon.code} -₹{discount.toFixed(2)}</Text>
              <TouchableOpacity onPress={removeCoupon}>
                <Text style={styles.removeCouponText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <TextInput
                style={styles.promoInput}
                placeholder="Enter promo code"
                value={promoCode}
                onChangeText={setPromoCode}
              />
              <TouchableOpacity style={styles.promoButton} onPress={applyPromoCode}>
                <Text style={styles.promoButtonText}>Apply</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Order Summary */}
        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>₹{subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax (8%)</Text>
            <Text style={styles.summaryValue}>₹{tax.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryValue}>
              {deliveryFee > 0 ? `₹${deliveryFee.toFixed(2)}` : 'FREE'}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Handling Fee</Text>
            <Text style={styles.summaryValue}>₹{HANDLING_CHARGE.toFixed(2)}</Text>
          </View>
          {tipAmount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tip</Text>
              <Text style={styles.summaryValue}>₹{tipAmount.toFixed(2)}</Text>
            </View>
          )}
          {discount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, styles.discountText]}>Discount</Text>
              <Text style={[styles.summaryValue, styles.discountText]}>-₹{discount.toFixed(2)}</Text>
            </View>
          )}
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₹{total.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Checkout Buttons */}
      <View style={styles.checkoutButtonContainer}>
        <TouchableOpacity 
          style={[
            styles.checkoutButton,
            (subtotal < MINIMUM_ORDER_AMOUNT || isProcessing || !selectedDeliverySlot) && styles.disabledCheckoutButton
          ]} 
          onPress={showConfirmOrder}
          disabled={subtotal < MINIMUM_ORDER_AMOUNT || isProcessing || !selectedDeliverySlot}
        >
          {isProcessing ? (
            <Text style={styles.checkoutButtonText}>Processing Payment...</Text>
          ) : (
            <Text style={styles.checkoutButtonText}>
              {!selectedDeliverySlot 
                ? 'Select Delivery Time'
                : subtotal < MINIMUM_ORDER_AMOUNT 
                ? `Add ₹${(MINIMUM_ORDER_AMOUNT - subtotal).toFixed(2)} more to checkout`
                : `Place Order • ₹${total.toFixed(2)}`
              }
            </Text>
          )}
        </TouchableOpacity>
        
        {/* Simple Checkout Button */}
        <TouchableOpacity 
          style={styles.simpleCheckoutButton}
          onPress={handleSimpleCheckout}
        >
          <Text style={styles.simpleCheckoutButtonText}>Quick Checkout</Text>
        </TouchableOpacity>
      </View>

      {/* Delivery Time Modal */}
      <Modal visible={showDeliveryModal} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.deliveryModalContent}>
            <Text style={styles.modalTitle}>Select Delivery Date & Time</Text>
            
            {/* Date Selection */}
            <Text style={styles.dateSectionTitle}>Select Date</Text>
            <FlatList
              data={deliveryDates}
              renderItem={renderDateItem}
              keyExtractor={item => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.datesList}
            />

            {/* Time Slots */}
            <Text style={styles.timeSectionTitle}>
              Available Time Slots for {selectedDate?.isToday ? 'Today' : selectedDate?.isTomorrow ? 'Tomorrow' : selectedDate?.dayName}
            </Text>
            <FlatList
              data={deliverySlots}
              renderItem={renderDeliverySlotItem}
              keyExtractor={item => item.id}
              numColumns={2}
              columnWrapperStyle={styles.deliverySlotsRow}
              style={styles.deliverySlotsList}
            />

            <TouchableOpacity 
              style={styles.closeModalButton}
              onPress={() => setShowDeliveryModal(false)}
            >
              <Text style={styles.closeModalText}>Confirm Selection</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Location Modal */}
      <Modal visible={showLocationModal} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Your Location</Text>
            <Text style={styles.locationModalSubtitle}>Search a new address</Text>
            
            <TouchableOpacity 
              style={styles.currentLocationButton}
              onPress={getCurrentLocation}
              disabled={isLocationLoading}
            >
              <Text style={styles.locationIcon}>📍</Text>
              <View style={styles.locationButtonTextContainer}>
                <Text style={styles.locationButtonTitle}>Use My Current Location</Text>
                <Text style={styles.locationButtonSubtitle}>Enable your current location for better services</Text>
              </View>
              {isLocationLoading && <Text style={styles.loadingText}>Loading...</Text>}
            </TouchableOpacity>

            <Text style={styles.locationSectionTitle}>Saved Addresses</Text>
            <FlatList
              data={ADDRESSES}
              renderItem={renderAddressItem}
              keyExtractor={item => item.id}
              style={styles.modalList}
            />
            <TouchableOpacity 
              style={styles.closeModalButton}
              onPress={() => setShowLocationModal(false)}
            >
              <Text style={styles.closeModalText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Confirm Order Modal */}
      <Modal visible={showConfirmOrderModal} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.confirmOrderModalContent}>
            <Text style={styles.confirmOrderTitle}>Confirm Your Order</Text>
            
            <View style={styles.orderSummaryCard}>
              <Text style={styles.orderSummaryTitle}>Order Summary</Text>
              <View style={styles.orderDetailItem}>
                <Text style={styles.orderDetailLabel}>Delivery Address:</Text>
                <Text style={styles.orderDetailValue}>
                  {selectedAddress.flatNo}, {selectedAddress.address}, {selectedAddress.area}
                </Text>
              </View>
              <View style={styles.orderDetailItem}>
                <Text style={styles.orderDetailLabel}>Delivery Date:</Text>
                <Text style={styles.orderDetailValue}>
                  {selectedDate?.isToday ? 'Today' : selectedDate?.isTomorrow ? 'Tomorrow' : selectedDate?.dayName}, {selectedDate?.displayDate}
                </Text>
              </View>
              <View style={styles.orderDetailItem}>
                <Text style={styles.orderDetailLabel}>Delivery Time:</Text>
                <Text style={styles.orderDetailValue}>{selectedDeliverySlot?.time}</Text>
              </View>
              <View style={styles.orderDetailItem}>
                <Text style={styles.orderDetailLabel}>Payment Method:</Text>
                <Text style={styles.orderDetailValue}>{selectedPaymentMethod.name}</Text>
              </View>
              <View style={styles.totalAmountContainer}>
                <Text style={styles.totalAmountLabel}>Total Amount:</Text>
                <Text style={styles.totalAmountValue}>₹{total.toFixed(2)}</Text>
              </View>
            </View>

            <View style={styles.confirmOrderButtons}>
              <TouchableOpacity 
                style={styles.cancelOrderButton}
                onPress={() => setShowConfirmOrderModal(false)}
              >
                <Text style={styles.cancelOrderButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.confirmOrderButton}
                onPress={confirmOrder}
              >
                <Text style={styles.confirmOrderButtonText}>Confirm Order</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Other Modals */}
      <Modal visible={showAddressModal} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Delivery Address</Text>
            <FlatList
              data={ADDRESSES}
              renderItem={renderAddressItem}
              keyExtractor={item => item.id}
            />
            <TouchableOpacity 
              style={styles.closeModalButton}
              onPress={() => setShowAddressModal(false)}
            >
              <Text style={styles.closeModalText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showPaymentModal} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Payment Method</Text>
            <FlatList
              data={PAYMENT_METHODS}
              renderItem={renderPaymentMethodItem}
              keyExtractor={item => item.id}
            />
            <TouchableOpacity 
              style={styles.closeModalButton}
              onPress={() => setShowPaymentModal(false)}
            >
              <Text style={styles.closeModalText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// Styles remain the same as in the original code
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 5,
  },
  backButtonText: {
    fontSize: 20,
    color: '#007ACC',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  itemCount: {
    fontSize: 14,
    color: '#666',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  locationHeader: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 15,
    margin: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  locationIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  locationDetails: {
    flex: 1,
  },
  deliveryText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
    marginBottom: 4,
  },
  locationSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationAddress: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  changeLocationText: {
    fontSize: 14,
    color: '#007ACC',
    fontWeight: '600',
  },
  todaysOfferBanner: {
    backgroundColor: '#fff9e6',
    padding: 15,
    margin: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ffeaa7',
  },
  todaysOfferTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e67e22',
    marginBottom: 5,
  },
  todaysOfferText: {
    fontSize: 14,
    color: '#2c3e50',
    marginBottom: 5,
  },
  todaysOfferCode: {
    fontSize: 13,
    color: '#7f8c8d',
  },
  todaysOfferCodeHighlight: {
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  cartItemsSection: {
    backgroundColor: 'white',
    margin: 15,
    borderRadius: 12,
    padding: 15,
  },
  section: {
    backgroundColor: 'white',
    margin: 15,
    borderRadius: 12,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cartItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007ACC',
    marginBottom: 5,
  },
  itemUnit: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  quantityText: {
    marginHorizontal: 15,
    fontSize: 16,
    fontWeight: '600',
  },
  removeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ffebee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f44336',
  },
  infoCard: {
    marginBottom: 15,
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  changeText: {
    color: '#007ACC',
    fontWeight: '600',
  },
  selectedSlotText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  noSlotText: {
    fontSize: 14,
    color: '#ff6b6b',
    fontStyle: 'italic',
  },
  selectedPaymentText: {
    fontSize: 14,
    color: '#333',
  },
  tipOptionsList: {
    marginTop: 8,
  },
  tipOption: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  selectedTipOption: {
    backgroundColor: '#007ACC',
  },
  tipOptionText: {
    fontSize: 14,
    color: '#333',
  },
  selectedTipOptionText: {
    color: 'white',
  },
  customTipInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    fontSize: 14,
  },
  paymentForm: {
    marginTop: 15,
  },
  paymentInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    fontSize: 14,
  },
  paymentRow: {
    flexDirection: 'row',
    gap: 10,
  },
  halfInput: {
    flex: 1,
  },
  codMessage: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  codText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  promoSection: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: 'white',
    margin: 15,
    borderRadius: 12,
  },
  promoInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    marginRight: 10,
    fontSize: 16,
  },
  promoButton: {
    backgroundColor: '#007ACC',
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: 'center',
  },
  promoButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  appliedCouponContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#d4edda',
    padding: 12,
    borderRadius: 8,
  },
  appliedCouponText: {
    fontSize: 14,
    color: '#155724',
  },
  removeCouponText: {
    color: '#e74c3c',
    fontWeight: 'bold',
  },
  summary: {
    backgroundColor: 'white',
    margin: 15,
    padding: 20,
    borderRadius: 12,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  discountText: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 10,
    marginTop: 5,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007ACC',
  },
  checkoutButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    gap: 10,
  },
  checkoutButton: {
    backgroundColor: '#007ACC',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  disabledCheckoutButton: {
    backgroundColor: '#b0b0b0',
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  simpleCheckoutButton: {
    backgroundColor: '#2ecc71',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  simpleCheckoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  continueShoppingBtn: {
    backgroundColor: '#2ecc71',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  continueShoppingBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  deliveryModalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  dateSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  timeSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  datesList: {
    marginBottom: 10,
  },
  dateItem: {
    alignItems: 'center',
    padding: 12,
    marginRight: 10,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    minWidth: 80,
  },
  selectedDateItem: {
    backgroundColor: '#007ACC',
  },
  dateDayName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  dateNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  selectedDateText: {
    color: 'white',
  },
  deliverySlotsList: {
    maxHeight: 300,
  },
  deliverySlotsRow: {
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  deliverySlotItem: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  selectedDeliverySlotItem: {
    backgroundColor: '#e3f2fd',
    borderColor: '#007ACC',
  },
  unavailableDeliverySlot: {
    backgroundColor: '#f5f5f5',
  },
  deliverySlotTime: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  unavailableDeliverySlotText: {
    color: '#999',
  },
  selectedDeliverySlotText: {
    color: '#007ACC',
    fontWeight: '600',
  },
  unavailableText: {
    fontSize: 10,
    color: '#f44336',
    marginTop: 4,
  },
  modalList: {
    maxHeight: 400,
  },
  addressItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedAddressItem: {
    backgroundColor: '#e3f2fd',
  },
  addressName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  addressText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  areaText: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  paymentMethodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedPaymentMethodItem: {
    backgroundColor: '#e3f2fd',
  },
  paymentIcon: {
    fontSize: 20,
    marginRight: 15,
  },
  paymentMethodText: {
    fontSize: 16,
    color: '#333',
  },
  closeModalButton: {
    backgroundColor: '#007ACC',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  closeModalText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  locationModalSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  currentLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  locationButtonTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  locationButtonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  locationButtonSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  loadingText: {
    fontSize: 12,
    color: '#007ACC',
  },
  locationSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  confirmOrderModalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  confirmOrderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  orderSummaryCard: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  orderSummaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  orderDetailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  orderDetailLabel: {
    fontSize: 14,
    color: '#666',
  },
  orderDetailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    textAlign: 'right',
    flex: 1,
  },
  totalAmountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  totalAmountLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalAmountValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007ACC',
  },
  confirmOrderButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelOrderButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelOrderButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmOrderButton: {
    flex: 1,
    backgroundColor: '#2ecc71',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmOrderButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  confirmationScreen: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  confirmationContent: {
    padding: 20,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
    marginTop: 40,
  },
  successIconText: {
    fontSize: 36,
    color: 'white',
    fontWeight: 'bold',
  },
  confirmationTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  confirmationSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  orderDetailsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  orderDetailsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  itemsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  orderItemName: {
    fontSize: 14,
    color: '#333',
    flex: 2,
  },
  orderItemQuantity: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  orderItemPrice: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    textAlign: 'right',
  },
  orderSummary: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  confirmationButtons: {
    gap: 10,
  },
  trackOrderButton: {
    backgroundColor: '#007ACC',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  trackOrderButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  continueShoppingButton: {
    backgroundColor: '#2ecc71',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueShoppingButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CartScreen;