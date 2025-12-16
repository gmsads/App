import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const WeeklyMonthlyReport = () => {
  const router = useRouter();
  const [timeRange, setTimeRange] = useState<'weekly' | 'monthly'>('weekly');
  const [selectedMonth, setSelectedMonth] = useState('November 2024');
  const [selectedWeek, setSelectedWeek] = useState('Week 48 (Nov 25 - Dec 1)');

  const weeklyData = [
    { day: 'Mon', sales: 12450, orders: 45 },
    { day: 'Tue', sales: 15800, orders: 52 },
    { day: 'Wed', sales: 14200, orders: 48 },
    { day: 'Thu', sales: 17500, orders: 58 },
    { day: 'Fri', sales: 21000, orders: 68 },
    { day: 'Sat', sales: 24500, orders: 75 },
    { day: 'Sun', sales: 18500, orders: 62 },
  ];

  const monthlyData = [
    { month: 'Jan', sales: 245000, orders: 850 },
    { month: 'Feb', sales: 265000, orders: 920 },
    { month: 'Mar', sales: 285000, orders: 980 },
    { month: 'Apr', sales: 275000, orders: 950 },
    { month: 'May', sales: 295000, orders: 1020 },
    { month: 'Jun', sales: 310000, orders: 1080 },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Periodic Reports</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Time Range Selector */}
      <View style={styles.timeRangeSelector}>
        <TouchableOpacity
          style={[styles.timeButton, timeRange === 'weekly' && styles.timeButtonActive]}
          onPress={() => setTimeRange('weekly')}
        >
          <Text style={[styles.timeButtonText, timeRange === 'weekly' && styles.timeButtonTextActive]}>
            Weekly
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.timeButton, timeRange === 'monthly' && styles.timeButtonActive]}
          onPress={() => setTimeRange('monthly')}
        >
          <Text style={[styles.timeButtonText, timeRange === 'monthly' && styles.timeButtonTextActive]}>
            Monthly
          </Text>
        </TouchableOpacity>
      </View>

      {/* Report Content */}
      <View style={styles.reportSection}>
        <Text style={styles.sectionTitle}>
          {timeRange === 'weekly' ? 'Weekly Sales Report' : 'Monthly Sales Report'}
        </Text>
        
        <View style={styles.statsOverview}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>₹{
              timeRange === 'weekly' 
                ? weeklyData.reduce((sum, day) => sum + day.sales, 0).toLocaleString()
                : monthlyData.reduce((sum, month) => sum + month.sales, 0).toLocaleString()
            }</Text>
            <Text style={styles.statLabel}>Total Sales</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{
              timeRange === 'weekly'
                ? weeklyData.reduce((sum, day) => sum + day.orders, 0)
                : monthlyData.reduce((sum, month) => sum + month.orders, 0)
            }</Text>
            <Text style={styles.statLabel}>Total Orders</Text>
          </View>
        </View>

        {/* Data Table */}
        <View style={styles.dataTable}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>{timeRange === 'weekly' ? 'Day' : 'Month'}</Text>
            <Text style={styles.tableHeaderText}>Sales (₹)</Text>
            <Text style={styles.tableHeaderText}>Orders</Text>
          </View>
          
          {(timeRange === 'weekly' ? weeklyData : monthlyData).map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{item.day || item.month}</Text>
              <Text style={styles.tableCell}>₹{item.sales.toLocaleString()}</Text>
              <Text style={styles.tableCell}>{item.orders}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  timeRangeSelector: {
    flexDirection: 'row',
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 4,
  },
  timeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  timeButtonActive: {
    backgroundColor: '#4CAF50',
  },
  timeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  timeButtonTextActive: {
    color: '#fff',
  },
  reportSection: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  statsOverview: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  dataTable: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    padding: 12,
  },
  tableHeaderText: {
    flex: 1,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tableCell: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
});

export default WeeklyMonthlyReport;