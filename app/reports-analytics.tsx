import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

const ReportsAnalytics: React.FC = () => {
  const router = useRouter();
  const [selectedReport, setSelectedReport] = useState<'quantity' | 'sales'>('sales');
  const [selectedArea, setSelectedArea] = useState('All');
  const [selectedShop, setSelectedShop] = useState('All');
  const [dateRange, setDateRange] = useState('last7days');

  // Mock data for demonstration
  const salesData = {
    totalSales: 124500,
    totalOrders: 89,
    averageOrder: 1398,
    topProducts: [
      { name: 'Organic Tomatoes', sales: 25000 },
      { name: 'Basmati Rice', sales: 18000 },
      { name: 'Fresh Milk', sales: 15000 },
    ],
    areaWise: [
      { area: 'Andheri East', sales: 45000, orders: 32 },
      { area: 'Connaught Place', sales: 35000, orders: 25 },
      { area: 'Koramangala', sales: 28000, orders: 18 },
    ],
  };

  const quantityData = {
    totalStock: 450,
    lowStock: 12,
    outOfStock: 3,
    categoryWise: [
      { category: 'Vegetables', quantity: 150 },
      { category: 'Fruits', quantity: 120 },
      { category: 'Grains', quantity: 100 },
    ],
    areaWise: [
      { area: 'Andheri East', quantity: 180 },
      { area: 'Connaught Place', quantity: 120 },
      { area: 'Koramangala', quantity: 90 },
    ],
  };

  const areas = ['All', 'Andheri East', 'Connaught Place', 'Koramangala', 'HSR Layout'];
  const shops = ['All', 'Fresh Mart', 'Daily Needs', 'Quick Store', 'Super Market'];
  const dateRanges = [
    { label: 'Last 7 Days', value: 'last7days' },
    { label: 'Last 30 Days', value: 'last30days' },
    { label: 'Last 3 Months', value: 'last3months' },
    { label: 'Custom', value: 'custom' },
  ];

  const renderStatCard = (title: string, value: string | number, subtitle: string, color: string) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={styles.statSubtitle}>{subtitle}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reports & Analytics</Text>
        <TouchableOpacity style={styles.exportButton}>
          <Text style={styles.exportButtonText}>📊 Export</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Report Type Toggle */}
        <View style={styles.reportTypeContainer}>
          <TouchableOpacity
            style={[
              styles.reportTypeButton,
              selectedReport === 'sales' && styles.reportTypeButtonActive,
            ]}
            onPress={() => setSelectedReport('sales')}
          >
            <Text
              style={[
                styles.reportTypeText,
                selectedReport === 'sales' && styles.reportTypeTextActive,
              ]}
            >
              Sales Reports
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.reportTypeButton,
              selectedReport === 'quantity' && styles.reportTypeButtonActive,
            ]}
            onPress={() => setSelectedReport('quantity')}
          >
            <Text
              style={[
                styles.reportTypeText,
                selectedReport === 'quantity' && styles.reportTypeTextActive,
              ]}
            >
              Quantity Reports
            </Text>
          </TouchableOpacity>
        </View>

        {/* Filters */}
        <View style={styles.filterSection}>
          <Text style={styles.filterTitle}>Filters</Text>
          
          <View style={styles.filterRow}>
            <View style={styles.filterItem}>
              <Text style={styles.filterLabel}>Area</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterButtons}>
                {areas.map(area => (
                  <TouchableOpacity
                    key={area}
                    style={[
                      styles.filterButton,
                      selectedArea === area && styles.filterButtonActive,
                    ]}
                    onPress={() => setSelectedArea(area)}
                  >
                    <Text
                      style={[
                        styles.filterButtonText,
                        selectedArea === area && styles.filterButtonTextActive,
                      ]}
                    >
                      {area}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          <View style={styles.filterRow}>
            <View style={styles.filterItem}>
              <Text style={styles.filterLabel}>Shop</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterButtons}>
                {shops.map(shop => (
                  <TouchableOpacity
                    key={shop}
                    style={[
                      styles.filterButton,
                      selectedShop === shop && styles.filterButtonActive,
                    ]}
                    onPress={() => setSelectedShop(shop)}
                  >
                    <Text
                      style={[
                        styles.filterButtonText,
                        selectedShop === shop && styles.filterButtonTextActive,
                      ]}
                    >
                      {shop}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          <View style={styles.filterRow}>
            <View style={styles.filterItem}>
              <Text style={styles.filterLabel}>Date Range</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterButtons}>
                {dateRanges.map(range => (
                  <TouchableOpacity
                    key={range.value}
                    style={[
                      styles.filterButton,
                      dateRange === range.value && styles.filterButtonActive,
                    ]}
                    onPress={() => setDateRange(range.value)}
                  >
                    <Text
                      style={[
                        styles.filterButtonText,
                        dateRange === range.value && styles.filterButtonTextActive,
                      ]}
                    >
                      {range.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </View>

        {/* Statistics */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>
            {selectedReport === 'sales' ? 'Sales Overview' : 'Stock Overview'}
          </Text>
          
          <View style={styles.statsGrid}>
            {selectedReport === 'sales' ? (
              <>
                {renderStatCard('Total Sales', `₹${salesData.totalSales.toLocaleString()}`, 'All time', '#27ae60')}
                {renderStatCard('Total Orders', salesData.totalOrders, 'Completed', '#3498db')}
                {renderStatCard('Avg Order', `₹${salesData.averageOrder}`, 'Per order', '#e67e22')}
                {renderStatCard('Active Shops', '12', 'Selling', '#9b59b6')}
              </>
            ) : (
              <>
                {renderStatCard('Total Stock', quantityData.totalStock, 'Items', '#27ae60')}
                {renderStatCard('Low Stock', quantityData.lowStock, 'Items', '#f39c12')}
                {renderStatCard('Out of Stock', quantityData.outOfStock, 'Items', '#e74c3c')}
                {renderStatCard('Categories', '8', 'Active', '#3498db')}
              </>
            )}
          </View>
        </View>

        {/* Top Products / Categories */}
        <View style={styles.listSection}>
          <Text style={styles.sectionTitle}>
            {selectedReport === 'sales' ? 'Top Selling Products' : 'Stock by Category'}
          </Text>
          
          <View style={styles.listContainer}>
            {(selectedReport === 'sales' ? salesData.topProducts : quantityData.categoryWise).map((item, index) => (
              <View key={index} style={styles.listItem}>
                <View style={styles.listItemMain}>
                  <Text style={styles.listItemName}>{item.name}</Text>
                  <Text style={styles.listItemValue}>
                    {selectedReport === 'sales' ? `₹${item.sales.toLocaleString()}` : `${item.quantity} items`}
                  </Text>
                </View>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill,
                      { 
                        width: `${selectedReport === 'sales' 
                          ? (item.sales / salesData.topProducts[0].sales) * 100 
                          : (item.quantity / quantityData.categoryWise[0].quantity) * 100
                        }%`,
                        backgroundColor: selectedReport === 'sales' ? '#27ae60' : '#3498db'
                      }
                    ]} 
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Area-wise Breakdown */}
        <View style={styles.areaSection}>
          <Text style={styles.sectionTitle}>Area-wise Breakdown</Text>
          
          <View style={styles.areaList}>
            {(selectedReport === 'sales' ? salesData.areaWise : quantityData.areaWise).map((area, index) => (
              <View key={index} style={styles.areaItem}>
                <View style={styles.areaHeader}>
                  <Text style={styles.areaName}>{area.area}</Text>
                  <Text style={styles.areaValue}>
                    {selectedReport === 'sales' 
                      ? `₹${area.sales.toLocaleString()}` 
                      : `${area.quantity} items`
                    }
                  </Text>
                </View>
                <View style={styles.areaDetails}>
                  <Text style={styles.areaDetail}>
                    {selectedReport === 'sales' 
                      ? `${area.orders} orders` 
                      : 'In stock'
                    }
                  </Text>
                  <Text style={styles.areaPercentage}>
                    {selectedReport === 'sales'
                      ? `${((area.sales / salesData.totalSales) * 100).toFixed(1)}%`
                      : `${((area.quantity / quantityData.totalStock) * 100).toFixed(1)}%`
                    }
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
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
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#3498db',
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  exportButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  exportButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  reportTypeContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  reportTypeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  reportTypeButtonActive: {
    backgroundColor: '#3498db',
  },
  reportTypeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7f8c8d',
  },
  reportTypeTextActive: {
    color: '#fff',
  },
  filterSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
  },
  filterRow: {
    marginBottom: 12,
  },
  filterItem: {
    marginBottom: 8,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  filterButtons: {
    flexDirection: 'row',
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f8f9fa',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  filterButtonActive: {
    backgroundColor: '#3498db',
    borderColor: '#3498db',
  },
  filterButtonText: {
    fontSize: 12,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  statsSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: (width - 48) / 2,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 2,
  },
  statSubtitle: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  listSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  listContainer: {
    marginTop: 8,
  },
  listItem: {
    marginBottom: 16,
  },
  listItemMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  listItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    flex: 1,
  },
  listItemValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#f8f9fa',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  areaSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  areaList: {
    marginTop: 8,
  },
  areaItem: {
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 8,
  },
  areaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  areaName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
  },
  areaValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3498db',
  },
  areaDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  areaDetail: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  areaPercentage: {
    fontSize: 12,
    fontWeight: '600',
    color: '#27ae60',
  },
});

export default ReportsAnalytics;