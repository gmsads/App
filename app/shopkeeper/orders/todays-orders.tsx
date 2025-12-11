// app/shopkeeper/orders/todays-orders.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import OrdersScreen from './orders-list-screen';
import { FilterParams } from './orders-list-screen';

const TodaysOrders = () => {
  // Get today's date
  const today = new Date();
  
  // Set fromOrderDate to today at 00:00:00 (midnight)
  const fromOrderDate = new Date(today);
  fromOrderDate.setHours(0, 0, 0, 0); // Set to midnight
  
  // Set toOrderDate to current date-time (now)
  const toOrderDate = new Date(); // Current date-time
  
  // Pre-set filters for Today's Orders
  const presetFilters: Partial<FilterParams> = {
    shopId: 'SHOP001',
    fromOrderDate: fromOrderDate.toISOString(), // "2025-01-31T00:00:00.000Z"
    toOrderDate: toOrderDate.toISOString(),     // "2025-01-31T14:30:00.000Z"
    orderStatus: ['PENDING', 'DELIVERED'], // Only show PENDING and DELIVERED orders
    deliveryType: ['SAMEDAY', 'NEXTDAY'], // Only show SAMEDAY and NEXTDAY
  };

  return (
    <View style={styles.container}>
      <OrdersScreen 
        initialTab="today"
        presetFilters={presetFilters}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default TodaysOrders;