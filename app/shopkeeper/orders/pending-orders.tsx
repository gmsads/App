import React from 'react';
import { View, StyleSheet } from 'react-native';
import OrdersScreen from './orders-list';

const PendingOrders = () => {
  return (
    <View style={styles.container}>
      <OrdersScreen initialTab="pending" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default PendingOrders;