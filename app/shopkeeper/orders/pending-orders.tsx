// app/shopkeeper/orders/pending-orders.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import OrdersScreen from './orders-list-screen';
import { FilterParams } from './orders-list-screen';

const PendingOrders = () => {
  // Pre-set filters for Pending Orders
  const presetFilters: Partial<FilterParams> = {
    shopId: 'SHOP001',
    fromOrderDate: '',
    toOrderDate: '',
    orderStatus: ['PENDING'], // Only show PENDING orders
    deliveryType: ['SAMEDAY', 'NEXTDAY'], // Only show SAMEDAY and NEXTDAY
  };

  return (
    <View style={styles.container}>
      <OrdersScreen 
        initialTab="pending"
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

export default PendingOrders;