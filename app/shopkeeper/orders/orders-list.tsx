// app/shopkeeper/orders/orders-list.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import OrdersScreen from './orders-list-screen';

const OrdersListPage = () => {
  return (
    <View style={styles.container}>
      <OrdersScreen initialTab="all" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default OrdersListPage;