// app/shopkeeper/reports/sales-report.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  Alert,
  Platform,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons, Ionicons, Feather, FontAwesome5 } from '@expo/vector-icons';

// Define the types
interface SalesItem {
  id: string;
  productName: string;
  price: number;
  category: string;
  subCategory: string;
  quantity: number;
  total: number;
  date: string;
}

interface Category {
  name: string;
  subCategories: string[];
}

interface StatusOption {
  id: string;
  label: string;
  checked: boolean;
}

interface TimePeriod {
  id: 'yesterday' | 'lastWeek' | 'lastMonth';
  label: string;
  icon: string;
}

const { width } = Dimensions.get('window');

const SalesReport: React.FC = () => {
  const router = useRouter();
  
  // Time period buttons
  const timePeriods: TimePeriod[] = [
    { id: 'yesterday', label: 'Yesterday', icon: 'calendar-day' },
    { id: 'lastWeek', label: 'Last Week', icon: 'calendar-week' },
    { id: 'lastMonth', label: 'Last Month', icon: 'calendar-alt' },
  ];
  
  const [activePeriod, setActivePeriod] = useState<'yesterday' | 'lastWeek' | 'lastMonth'>('lastMonth');
  
  // Filter states
  const [fromDate, setFromDate] = useState<Date>(new Date());
  const [toDate, setToDate] = useState<Date>(new Date());
  const [showFromDatePicker, setShowFromDatePicker] = useState<boolean>(false);
  const [showToDatePicker, setShowToDatePicker] = useState<boolean>(false);
  
  // Order status options
  const orderStatuses: StatusOption[] = [
    { id: 'completed', label: 'Completed', checked: true },
    { id: 'pending', label: 'Pending', checked: true },
    { id: 'cancelled', label: 'Cancelled', checked: false },
    { id: 'returned', label: 'Returned', checked: false },
  ];
  
  const [selectedStatuses, setSelectedStatuses] = useState<StatusOption[]>(orderStatuses);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('All');
  const [salesData, setSalesData] = useState<SalesItem[]>([]);
  const [filteredData, setFilteredData] = useState<SalesItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalSales, setTotalSales] = useState<number>(0);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [averageOrderValue, setAverageOrderValue] = useState<number>(0);

  // Sample data
  const sampleCategories: Category[] = [
    { name: 'Vegetables', subCategories: ['Leafy', 'Root', 'Fruiting'] },
    { name: 'Fruits', subCategories: ['Tropical', 'Citrus', 'Berries'] },
    { name: 'Snacks', subCategories: ['Chips', 'Biscuits', 'Nuts'] },
    { name: 'Beverages', subCategories: ['Soft Drinks', 'Juices', 'Energy Drinks'] },
  ];

  const sampleSalesData: SalesItem[] = [
    { id: '1', productName: 'Spinach', price: 40, quantity: 5, total: 200, category: 'Vegetables', subCategory: 'Leafy', date: '2024-01-15' },
    { id: '2', productName: 'Carrot', price: 60, quantity: 3, total: 180, category: 'Vegetables', subCategory: 'Root', date: '2024-01-15' },
    { id: '3', productName: 'Tomato', price: 30, quantity: 10, total: 300, category: 'Vegetables', subCategory: 'Fruiting', date: '2024-01-14' },
    { id: '4', productName: 'Mango', price: 120, quantity: 2, total: 240, category: 'Fruits', subCategory: 'Tropical', date: '2024-01-14' },
    { id: '5', productName: 'Orange', price: 80, quantity: 4, total: 320, category: 'Fruits', subCategory: 'Citrus', date: '2024-01-13' },
    { id: '6', productName: 'Potato Chips', price: 20, quantity: 15, total: 300, category: 'Snacks', subCategory: 'Chips', date: '2024-01-13' },
    { id: '7', productName: 'Butter Cookies', price: 50, quantity: 8, total: 400, category: 'Snacks', subCategory: 'Biscuits', date: '2024-01-12' },
    { id: '8', productName: 'Cola', price: 90, quantity: 6, total: 540, category: 'Beverages', subCategory: 'Soft Drinks', date: '2024-01-12' },
    { id: '9', productName: 'Apple Juice', price: 120, quantity: 3, total: 360, category: 'Beverages', subCategory: 'Juices', date: '2024-01-11' },
    { id: '10', productName: 'Energy Drink', price: 110, quantity: 5, total: 550, category: 'Beverages', subCategory: 'Energy Drinks', date: '2024-01-11' },
    { id: '11', productName: 'Onion', price: 25, quantity: 8, total: 200, category: 'Vegetables', subCategory: 'Root', date: '2024-01-10' },
    { id: '12', productName: 'Banana', price: 40, quantity: 6, total: 240, category: 'Fruits', subCategory: 'Tropical', date: '2024-01-10' },
    { id: '13', productName: 'Chips', price: 10, quantity: 20, total: 200, category: 'Snacks', subCategory: 'Chips', date: '2024-01-09' },
    { id: '14', productName: 'Mineral Water', price: 20, quantity: 12, total: 240, category: 'Beverages', subCategory: 'Soft Drinks', date: '2024-01-09' },
  ];

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    updateDatesForPeriod();
    filterSalesData();
  }, [activePeriod]);

  useEffect(() => {
    filterSalesData();
  }, [selectedCategory, selectedSubCategory, selectedStatuses, salesData, fromDate, toDate]);

  const updateDatesForPeriod = () => {
    const today = new Date();
    let from = new Date();
    let to = new Date();

    switch (activePeriod) {
      case 'yesterday':
        from.setDate(today.getDate() - 1);
        to.setDate(today.getDate() - 1);
        break;
      case 'lastWeek':
        from.setDate(today.getDate() - 7);
        break;
      case 'lastMonth':
        from.setMonth(today.getMonth() - 1);
        break;
    }

    setFromDate(from);
    setToDate(to);
  };

  const loadData = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setCategories(sampleCategories);
      setSalesData(sampleSalesData);
      filterSalesData();
      setLoading(false);
    }, 1000);
  };

  const filterSalesData = () => {
    let filtered = [...salesData];
    
    // Filter by date range
    filtered = filtered.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= fromDate && itemDate <= toDate;
    });
    
    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    // Filter by subcategory
    if (selectedSubCategory !== 'All') {
      filtered = filtered.filter(item => item.subCategory === selectedSubCategory);
    }
    
    // Calculate totals
    const total = filtered.reduce((sum, item) => sum + item.total, 0);
    const productsCount = filtered.reduce((sum, item) => sum + item.quantity, 0);
    const avgValue = filtered.length > 0 ? total / filtered.length : 0;
    
    setTotalSales(total);
    setTotalProducts(productsCount);
    setAverageOrderValue(avgValue);
    setFilteredData(filtered);
  };

  const handleStatusToggle = (id: string) => {
    setSelectedStatuses(prev => 
      prev.map(status => 
        status.id === id ? { ...status, checked: !status.checked } : status
      )
    );
  };

  const generatePDF = async () => {
    setLoading(true);
    try {
      Alert.alert('Success', 'Sales report PDF download feature would be implemented here');
      // In a real app, implement PDF generation logic
    } catch (error) {
      Alert.alert('Error', 'Failed to generate report');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const renderCategoryTabs = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.categoryTabs}
      contentContainerStyle={styles.categoryTabsContent}
    >
      <TouchableOpacity
        style={[styles.categoryTab, selectedCategory === 'All' && styles.activeCategoryTab]}
        onPress={() => {
          setSelectedCategory('All');
          setSelectedSubCategory('All');
        }}
      >
        <Text style={[styles.categoryTabText, selectedCategory === 'All' && styles.activeCategoryTabText]}>
          All
        </Text>
      </TouchableOpacity>
      {categories.map((cat, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.categoryTab, selectedCategory === cat.name && styles.activeCategoryTab]}
          onPress={() => {
            setSelectedCategory(cat.name);
            setSelectedSubCategory('All');
          }}
        >
          <Text style={[styles.categoryTabText, selectedCategory === cat.name && styles.activeCategoryTabText]}>
            {cat.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderSubCategories = () => {
    const currentCategory = categories.find(cat => cat.name === selectedCategory);
    if (!currentCategory && selectedCategory !== 'All') return null;

    const subCats = selectedCategory === 'All' 
      ? ['All'] 
      : ['All', ...currentCategory!.subCategories];

    return (
      <ScrollView style={styles.subCategoryList}>
        {subCats.map((subCat, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.subCategoryItem, selectedSubCategory === subCat && styles.activeSubCategory]}
            onPress={() => setSelectedSubCategory(subCat)}
          >
            <Text style={[styles.subCategoryText, selectedSubCategory === subCat && styles.activeSubCategoryText]}>
              {subCat}
            </Text>
            {selectedSubCategory === subCat && (
              <MaterialIcons name="check" size={20} color="#2196F3" />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  const renderSalesItem = ({ item }: { item: SalesItem }) => (
    <View style={styles.productRow}>
      <Text style={styles.productName} numberOfLines={2}>{item.productName}</Text>
      <View style={styles.priceContainer}>
        <Text style={styles.priceText}>₹{item.price}</Text>
        <Text style={styles.quantityText}>×{item.quantity}</Text>
      </View>
    </View>
  );

  const handleDateChange = (event: any, date?: Date) => {
    if (date) {
      if (showFromDatePicker) {
        setFromDate(date);
        setShowFromDatePicker(false);
      }
      if (showToDatePicker) {
        setToDate(date);
        setShowToDatePicker(false);
      }
    } else {
      setShowFromDatePicker(false);
      setShowToDatePicker(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sales Report</Text>
        <TouchableOpacity onPress={generatePDF} disabled={loading} style={styles.downloadButton}>
          {loading ? (
            <ActivityIndicator size="small" color="#2196F3" />
          ) : (
            <>
              <Feather name="download" size={20} color="#2196F3" />
              <Text style={styles.downloadText}>PDF</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Time Period Buttons */}
        <View style={styles.timePeriodSection}>
          <Text style={styles.sectionTitle}>Time Period</Text>
          <View style={styles.timePeriodButtons}>
            {timePeriods.map((period) => (
              <TouchableOpacity
                key={period.id}
                style={[
                  styles.timePeriodButton,
                  activePeriod === period.id && styles.activeTimePeriodButton
                ]}
                onPress={() => setActivePeriod(period.id)}
              >
                <FontAwesome5 
                  name={period.icon} 
                  size={16} 
                  color={activePeriod === period.id ? '#fff' : '#2196F3'} 
                />
                <Text style={[
                  styles.timePeriodText,
                  activePeriod === period.id && styles.activeTimePeriodText
                ]}>
                  {period.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Filters Section */}
        <View style={styles.filterSection}>
          <Text style={styles.filterTitle}>Filters</Text>
          <Text style={styles.filterSubtitle}>All fields are mandatory</Text>
          
          {/* Date Range */}
          <View style={styles.dateRow}>
            <View style={styles.dateInputContainer}>
              <Text style={styles.dateLabel}>From Date & Time *</Text>
              <TouchableOpacity 
                style={styles.dateInput}
                onPress={() => setShowFromDatePicker(true)}
              >
                <Text style={styles.dateText}>{fromDate.toLocaleDateString()}</Text>
                <MaterialIcons name="calendar-today" size={20} color="#666" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.dateInputContainer}>
              <Text style={styles.dateLabel}>To Date & Time *</Text>
              <TouchableOpacity 
                style={styles.dateInput}
                onPress={() => setShowToDatePicker(true)}
              >
                <Text style={styles.dateText}>{toDate.toLocaleDateString()}</Text>
                <MaterialIcons name="calendar-today" size={20} color="#666" />
              </TouchableOpacity>
            </View>
          </View>

          {(showFromDatePicker || showToDatePicker) && (
            <View style={styles.datePickerPlaceholder}>
              <Text>Date picker would appear here</Text>
            </View>
          )}

          {/* Order Status Multi-select */}
          <View style={styles.statusSection}>
            <Text style={styles.statusLabel}>Order Status *</Text>
            <View style={styles.checkboxGrid}>
              {selectedStatuses.map((status) => (
                <View key={status.id} style={styles.checkboxItem}>
                  <TouchableOpacity
                    style={[styles.customCheckbox, status.checked && styles.customCheckboxChecked]}
                    onPress={() => handleStatusToggle(status.id)}
                  >
                    {status.checked && <MaterialIcons name="check" size={14} color="#fff" />}
                  </TouchableOpacity>
                  <Text style={styles.checkboxLabel}>{status.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Sales Summary */}
        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>Sales Summary</Text>
          <View style={styles.summaryCards}>
            <View style={styles.summaryCard}>
              <View style={[styles.summaryIcon, { backgroundColor: '#E3F2FD' }]}>
                <FontAwesome5 name="rupee-sign" size={20} color="#2196F3" />
              </View>
              <Text style={styles.summaryValue}>{formatCurrency(totalSales)}</Text>
              <Text style={styles.summaryLabel}>Total Sales</Text>
            </View>
            
            <View style={styles.summaryCard}>
              <View style={[styles.summaryIcon, { backgroundColor: '#E8F5E9' }]}>
                <MaterialIcons name="inventory" size={20} color="#4CAF50" />
              </View>
              <Text style={styles.summaryValue}>{totalProducts}</Text>
              <Text style={styles.summaryLabel}>Products Sold</Text>
            </View>
            
            <View style={styles.summaryCard}>
              <View style={[styles.summaryIcon, { backgroundColor: '#FFF3E0' }]}>
                <MaterialIcons name="trending-up" size={20} color="#FF9800" />
              </View>
              <Text style={styles.summaryValue}>{formatCurrency(averageOrderValue)}</Text>
              <Text style={styles.summaryLabel}>Avg Order Value</Text>
            </View>
            
            <View style={styles.summaryCard}>
              <View style={[styles.summaryIcon, { backgroundColor: '#F3E5F5' }]}>
                <MaterialIcons name="receipt" size={20} color="#9C27B0" />
              </View>
              <Text style={styles.summaryValue}>{filteredData.length}</Text>
              <Text style={styles.summaryLabel}>Total Orders</Text>
            </View>
          </View>
        </View>

        {/* Categories Section */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Categories</Text>
          {renderCategoryTabs()}
        </View>

        {/* Results Section */}
        <View style={styles.resultsSection}>
          <View style={styles.resultsHeader}>
            <View>
              <Text style={styles.resultsTitle}>
                Results ({filteredData.length} items)
              </Text>
              <Text style={styles.resultsSubtitle}>
                Showing sales from {fromDate.toLocaleDateString()} to {toDate.toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.totalSalesBadge}>
              <Text style={styles.totalSalesText}>Total Sales</Text>
              <Text style={styles.totalSalesValue}>{formatCurrency(totalSales)}</Text>
            </View>
          </View>

          <View style={styles.resultsContainer}>
            {/* Left: Subcategories */}
            <View style={styles.subCategoriesColumn}>
              <Text style={styles.columnTitle}>Sub Categories</Text>
              {renderSubCategories()}
            </View>

            {/* Right: Products Table */}
            <View style={styles.productsColumn}>
              <View style={styles.tableHeader}>
                <Text style={styles.columnHeader}>Product Name</Text>
                <Text style={styles.columnHeader}>Price</Text>
              </View>
              
              {loading ? (
                <ActivityIndicator size="large" color="#2196F3" style={styles.loader} />
              ) : filteredData.length > 0 ? (
                <FlatList
                  data={filteredData}
                  renderItem={renderSalesItem}
                  keyExtractor={(item) => item.id}
                  scrollEnabled={false}
                  contentContainerStyle={styles.productsList}
                />
              ) : (
                <View style={styles.emptyState}>
                  <MaterialIcons name="bar-chart" size={48} color="#ccc" />
                  <Text style={styles.emptyStateText}>No sales data found</Text>
                  <Text style={styles.emptyStateSubtext}>
                    Try adjusting your filters or time period
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Period Summary */}
        <View style={styles.periodSummary}>
          <Text style={styles.periodSummaryTitle}>Period Summary</Text>
          <View style={styles.periodSummaryRow}>
            <View style={styles.periodSummaryItem}>
              <Text style={styles.periodSummaryLabel}>Time Period</Text>
              <Text style={styles.periodSummaryValue}>
                {activePeriod === 'yesterday' ? 'Yesterday' : 
                 activePeriod === 'lastWeek' ? 'Last 7 Days' : 'Last 30 Days'}
              </Text>
            </View>
            <View style={styles.periodSummaryItem}>
              <Text style={styles.periodSummaryLabel}>Date Range</Text>
              <Text style={styles.periodSummaryValue}>
                {fromDate.toLocaleDateString()} - {toDate.toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.periodSummaryItem}>
              <Text style={styles.periodSummaryLabel}>Active Filters</Text>
              <Text style={styles.periodSummaryValue}>
                {selectedCategory} • {selectedStatuses.filter(s => s.checked).length} statuses
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#E3F2FD',
  },
  downloadText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2196F3',
  },
  content: {
    flex: 1,
  },
  timePeriodSection: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  timePeriodButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  timePeriodButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  activeTimePeriodButton: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  timePeriodText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2196F3',
  },
  activeTimePeriodText: {
    color: '#fff',
    fontWeight: '600',
  },
  filterSection: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  filterSubtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 16,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 20,
  },
  dateInputContainer: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    fontWeight: '500',
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fafafa',
  },
  dateText: {
    fontSize: 14,
    color: '#333',
  },
  datePickerPlaceholder: {
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 16,
  },
  statusSection: {
    marginBottom: 8,
  },
  statusLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
  },
  checkboxGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minWidth: 100,
  },
  customCheckbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  customCheckboxChecked: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#333',
  },
  summarySection: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  summaryCards: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  summaryCard: {
    width: '48%',
    backgroundColor: '#fafafa',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  summaryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  categoriesSection: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
  },
  categoryTabs: {
    flexDirection: 'row',
  },
  categoryTabsContent: {
    paddingRight: 16,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    marginRight: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  activeCategoryTab: {
    backgroundColor: '#2196F3',
  },
  categoryTabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeCategoryTabText: {
    color: '#fff',
    fontWeight: '600',
  },
  resultsSection: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  resultsSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  totalSalesBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  totalSalesText: {
    fontSize: 10,
    color: '#2196F3',
    fontWeight: '600',
    marginBottom: 2,
  },
  totalSalesValue: {
    fontSize: 14,
    color: '#1565C0',
    fontWeight: 'bold',
  },
  resultsContainer: {
    flexDirection: 'row',
    flex: 1,
    minHeight: 400,
  },
  subCategoriesColumn: {
    width: '35%',
    marginRight: 12,
  },
  columnTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  subCategoryList: {
    maxHeight: 350,
  },
  subCategoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fafafa',
    borderRadius: 6,
    marginBottom: 6,
  },
  activeSubCategory: {
    backgroundColor: '#E3F2FD',
    borderColor: '#2196F3',
    borderWidth: 1,
  },
  subCategoryText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  activeSubCategoryText: {
    color: '#1565C0',
    fontWeight: '600',
  },
  productsColumn: {
    flex: 1,
    backgroundColor: '#fafafa',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#e0e0e0',
    marginBottom: 8,
  },
  columnHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  productsList: {
    paddingBottom: 8,
  },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  productName: {
    flex: 2,
    fontSize: 14,
    color: '#333',
    paddingRight: 8,
    fontWeight: '500',
  },
  priceContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'flex-end',
    gap: 8,
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  quantityText: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  loader: {
    marginVertical: 40,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#999',
    marginTop: 12,
    marginBottom: 4,
    fontWeight: '500',
  },
  emptyStateSubtext: {
    fontSize: 12,
    color: '#ccc',
  },
  periodSummary: {
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  periodSummaryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  periodSummaryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  periodSummaryItem: {
    flex: 1,
    minWidth: 100,
  },
  periodSummaryLabel: {
    fontSize: 11,
    color: '#666',
    marginBottom: 2,
    fontWeight: '500',
  },
  periodSummaryValue: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
  },
});

export default SalesReport;