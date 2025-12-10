// app/shopkeeper/orders/todays-orders.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import OrdersScreen from './orders-list-screen';

const TodaysOrders = () => {
  return (
    <View style={styles.container}>
      <OrdersScreen initialTab="today" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default TodaysOrders;