// app/shopkeeper/reports/stock-report.tsx
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
  Modal,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons, Ionicons, Feather } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

// Define the types
interface Product {
  id: string;
  name: string;
  category: string;
  subCategory: string;
  quantity: number;
  unit: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
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

const { width } = Dimensions.get('window');

// Checkbox component
const Checkbox = ({ checked, onPress }: { checked: boolean; onPress: () => void }) => (
  <TouchableOpacity onPress={onPress} style={styles.checkbox}>
    <View style={[styles.checkboxInner, checked && styles.checkboxChecked]}>
      {checked && <MaterialIcons name="check" size={14} color="#fff" />}
    </View>
  </TouchableOpacity>
);

const StockReport: React.FC = () => {
  const router = useRouter();
  
  // Filter states
  const [fromDate, setFromDate] = useState<Date>(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1); // 1st of current month
  });
  const [toDate, setToDate] = useState<Date>(new Date());
  const [showFromDatePicker, setShowFromDatePicker] = useState<boolean>(false);
  const [showToDatePicker, setShowToDatePicker] = useState<boolean>(false);
  
  // Order status options
  const orderStatuses: StatusOption[] = [
    { id: 'in_stock', label: 'In Stock', checked: true },
    { id: 'low_stock', label: 'Low Stock', checked: true },
    { id: 'out_of_stock', label: 'Out of Stock', checked: true },
  ];
  
  const [selectedStatuses, setSelectedStatuses] = useState<StatusOption[]>(orderStatuses);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('All');
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalStock, setTotalStock] = useState<number>(0);
  const [showStatusModal, setShowStatusModal] = useState<boolean>(false);

  // Sample data
  const sampleCategories: Category[] = [
    { name: 'Vegetables', subCategories: ['Leafy', 'Root', 'Fruiting'] },
    { name: 'Fruits', subCategories: ['Tropical', 'Citrus', 'Berries'] },
    { name: 'Snacks', subCategories: ['Chips', 'Biscuits', 'Nuts'] },
    { name: 'Beverages', subCategories: ['Soft Drinks', 'Juices', 'Energy Drinks'] },
    { name: 'Dairy', subCategories: ['Milk', 'Cheese', 'Yogurt'] },
  ];

  const sampleProducts: Product[] = [
    { id: '1', name: 'Spinach', category: 'Vegetables', subCategory: 'Leafy', quantity: 50, unit: 'kg', status: 'in_stock' },
    { id: '2', name: 'Carrot', category: 'Vegetables', subCategory: 'Root', quantity: 100, unit: 'kg', status: 'in_stock' },
    { id: '3', name: 'Tomato', category: 'Vegetables', subCategory: 'Fruiting', quantity: 5, unit: 'kg', status: 'low_stock' },
    { id: '4', name: 'Mango', category: 'Fruits', subCategory: 'Tropical', quantity: 30, unit: 'kg', status: 'in_stock' },
    { id: '5', name: 'Orange', category: 'Fruits', subCategory: 'Citrus', quantity: 0, unit: 'kg', status: 'out_of_stock' },
    { id: '6', name: 'Potato Chips', category: 'Snacks', subCategory: 'Chips', quantity: 120, unit: 'packs', status: 'in_stock' },
    { id: '7', name: 'Butter Cookies', category: 'Snacks', subCategory: 'Biscuits', quantity: 15, unit: 'boxes', status: 'low_stock' },
    { id: '8', name: 'Cola', category: 'Beverages', subCategory: 'Soft Drinks', quantity: 200, unit: 'bottles', status: 'in_stock' },
    { id: '9', name: 'Milk', category: 'Dairy', subCategory: 'Milk', quantity: 0, unit: 'liters', status: 'out_of_stock' },
    { id: '10', name: 'Cheese', category: 'Dairy', subCategory: 'Cheese', quantity: 45, unit: 'kg', status: 'in_stock' },
  ];

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [selectedCategory, selectedSubCategory, selectedStatuses, products]);

  const loadData = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setCategories(sampleCategories);
      setProducts(sampleProducts);
      setFilteredProducts(sampleProducts);
      calculateTotalStock(sampleProducts);
      setLoading(false);
    }, 1000);
  };

  const calculateTotalStock = (productsList: Product[]) => {
    const total = productsList.reduce((sum, p) => sum + p.quantity, 0);
    setTotalStock(total);
  };

  const filterProducts = () => {
    let filtered = [...products];
    
    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    
    // Filter by subcategory
    if (selectedSubCategory !== 'All') {
      filtered = filtered.filter(p => p.subCategory === selectedSubCategory);
    }
    
    // Filter by status
    const activeStatuses = selectedStatuses.filter(s => s.checked).map(s => s.id);
    if (activeStatuses.length > 0) {
      filtered = filtered.filter(p => activeStatuses.includes(p.status));
    }
    
    setFilteredProducts(filtered);
    calculateTotalStock(filtered);
  };

  const handleStatusToggle = (id: string) => {
    setSelectedStatuses(prev => 
      prev.map(status => 
        status.id === id ? { ...status, checked: !status.checked } : status
      )
    );
  };

  const handleFromDateChange = (event: any, date?: Date) => {
    setShowFromDatePicker(false);
    if (date) {
      // Validate: not before 1st of current month
      const currentMonthFirst = new Date();
      currentMonthFirst.setDate(1);
      currentMonthFirst.setHours(0, 0, 0, 0);
      
      if (date < currentMonthFirst) {
        Alert.alert('Invalid Date', 'From date cannot be before 1st of current month');
        return;
      }
      
      // Validate: not after toDate
      if (date > toDate) {
        setToDate(date);
      }
      setFromDate(date);
    }
  };

  const handleToDateChange = (event: any, date?: Date) => {
    setShowToDatePicker(false);
    if (date) {
      // Validate: not before fromDate
      if (date < fromDate) {
        Alert.alert('Invalid Date', 'To date cannot be before from date');
        return;
      }
      
      // Validate: not after current date
      const currentDate = new Date();
      currentDate.setHours(23, 59, 59, 999);
      
      if (date > currentDate) {
        Alert.alert('Invalid Date', 'To date cannot be after current date');
        return;
      }
      
      setToDate(date);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusNames = () => {
    const activeStatuses = selectedStatuses.filter(s => s.checked);
    if (activeStatuses.length === 0) {
      return 'All Statuses';
    }
    if (activeStatuses.length === selectedStatuses.length) {
      return 'All Statuses';
    }
    return activeStatuses.map(s => s.label).join(', ');
  };

  const generatePDF = async () => {
    setLoading(true);
    try {
      const filterData = {
        fromDate: formatDate(fromDate),
        toDate: formatDate(toDate),
        selectedStatuses: selectedStatuses.filter(s => s.checked).map(s => s.label),
        selectedCategory,
        selectedSubCategory,
      };
      
      console.log('Generating report with filters:', filterData);
      
      Alert.alert(
        'Report Generated',
        `Stock report for ${formatDate(fromDate)} to ${formatDate(toDate)}\n` +
        `Status: ${getStatusNames()}\n` +
        `Category: ${selectedCategory}\n` +
        `Total Products: ${filteredProducts.length}\n` +
        `Total Stock: ${totalStock} units`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to generate report');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = () => {
    filterProducts();
    Alert.alert('Filters Applied', `Filters updated successfully!\nShowing ${filteredProducts.length} products`);
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
              <MaterialIcons name="check" size={20} color="#27ae60" />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  const renderProductItem = ({ item }: { item: Product }) => {
    let statusColor = '#4CAF50'; // in_stock
    let statusText = 'In Stock';
    
    if (item.status === 'low_stock') {
      statusColor = '#FF9800';
      statusText = 'Low Stock';
    } else if (item.status === 'out_of_stock') {
      statusColor = '#F44336';
      statusText = 'Out of Stock';
    }

    return (
      <View style={styles.productRow}>
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.productCategory}>{item.category} • {item.subCategory}</Text>
        </View>
        <View style={styles.quantityContainer}>
          <View style={[styles.statusBadge, { backgroundColor: `${statusColor}20` }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>{statusText}</Text>
          </View>
          <View style={styles.quantityWrapper}>
            <Text style={[
              styles.quantityText, 
              { color: statusColor }
            ]}>
              {item.quantity}
            </Text>
            <Text style={styles.unitText}>{item.unit}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Stock Report</Text>
        <TouchableOpacity onPress={generatePDF} disabled={loading} style={styles.downloadButton}>
          {loading ? (
            <ActivityIndicator size="small" color="#27ae60" />
          ) : (
            <>
              <Feather name="download" size={20} color="#27ae60" />
              <Text style={styles.downloadText}>PDF</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Filters Section - Updated like admin */}
        <View style={styles.filterSection}>
          <Text style={styles.filterTitle}>Advanced Filters</Text>
          <Text style={styles.filterSubtitle}>All fields are mandatory</Text>
          
          {/* Date Range Inputs */}
          <View style={styles.dateInputRow}>
            <View style={styles.dateInputContainer}>
              <Text style={styles.inputLabel}>From Date *</Text>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setShowFromDatePicker(true)}
              >
                <Text style={styles.dateInputText}>{formatDate(fromDate)}</Text>
                <Text style={styles.calendarIcon}>📅</Text>
              </TouchableOpacity>
              {showFromDatePicker && (
                <DateTimePicker
                  value={fromDate}
                  mode="date"
                  display="default"
                  onChange={handleFromDateChange}
                  maximumDate={new Date()}
                />
              )}
            </View>
            
            <View style={styles.dateInputContainer}>
              <Text style={styles.inputLabel}>To Date *</Text>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setShowToDatePicker(true)}
              >
                <Text style={styles.dateInputText}>{formatDate(toDate)}</Text>
                <Text style={styles.calendarIcon}>📅</Text>
              </TouchableOpacity>
              {showToDatePicker && (
                <DateTimePicker
                  value={toDate}
                  mode="date"
                  display="default"
                  onChange={handleToDateChange}
                  minimumDate={fromDate}
                  maximumDate={new Date()}
                />
              )}
            </View>
          </View>

          {/* Stock Status Dropdown - Updated like admin */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Stock Status (Multi-select) *</Text>
            <TouchableOpacity
              style={styles.dropdownInput}
              onPress={() => setShowStatusModal(true)}
            >
              <Text style={styles.dropdownText}>
                {getStatusNames()}
              </Text>
              <Text style={styles.dropdownIcon}>▼</Text>
            </TouchableOpacity>
          </View>

          {/* Apply Filters Button */}
          <TouchableOpacity style={styles.applyButton} onPress={handleApplyFilters}>
            <Text style={styles.applyButtonText}>Apply Filters</Text>
          </TouchableOpacity>
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
                Results ({filteredProducts.length} products)
              </Text>
              <Text style={styles.resultsSubtitle}>
                Showing stock from {formatDate(fromDate)} to {formatDate(toDate)}
              </Text>
            </View>
            <View style={styles.totalStockBadge}>
              <Text style={styles.totalStockText}>Total Stock</Text>
              <Text style={styles.totalStockValue}>{totalStock} units</Text>
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
                <Text style={styles.columnHeader}>Product Details</Text>
                <Text style={styles.columnHeader}>Status & Quantity</Text>
              </View>
              
              {loading ? (
                <ActivityIndicator size="large" color="#27ae60" style={styles.loader} />
              ) : filteredProducts.length > 0 ? (
                <FlatList
                  data={filteredProducts}
                  renderItem={renderProductItem}
                  keyExtractor={(item) => item.id}
                  scrollEnabled={false}
                  contentContainerStyle={styles.productsList}
                />
              ) : (
                <View style={styles.emptyState}>
                  <MaterialIcons name="inventory" size={48} color="#ccc" />
                  <Text style={styles.emptyStateText}>No products found</Text>
                  <Text style={styles.emptyStateSubtext}>
                    Try adjusting your filters
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Legend */}
        <View style={styles.legendSection}>
          <Text style={styles.legendTitle}>Stock Status Legend</Text>
          <View style={styles.legendItems}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#4CAF50' }]} />
              <Text style={styles.legendText}>In Stock (≥20 units)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#FF9800' }]} />
              <Text style={styles.legendText}>Low Stock (1-19 units)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#F44336' }]} />
              <Text style={styles.legendText}>Out of Stock (0 units)</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Status Selection Modal - Like admin */}
      <Modal
        visible={showStatusModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowStatusModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Stock Status</Text>
              <TouchableOpacity onPress={() => setShowStatusModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={selectedStatuses}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => handleStatusToggle(item.id)}
                >
                  <Checkbox 
                    checked={item.checked} 
                    onPress={() => handleStatusToggle(item.id)}
                  />
                  <Text style={styles.modalItemText}>{item.label}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={item => item.id}
            />
            <TouchableOpacity
              style={styles.modalDoneButton}
              onPress={() => setShowStatusModal(false)}
            >
              <Text style={styles.modalDoneButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
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
    paddingHorizontal: 16,
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
    color: '#27ae60',
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  downloadButton: {
    backgroundColor: '#E8F5E9',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 4,
  },
  downloadText: {
    color: '#27ae60',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
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
    marginBottom: 4,
  },
  filterSubtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 16,
  },
  dateInputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dateInputContainer: {
    flex: 1,
    marginHorizontal: 4,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  dateInputText: {
    fontSize: 14,
    color: '#2c3e50',
  },
  calendarIcon: {
    fontSize: 16,
  },
  dropdownInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  dropdownText: {
    fontSize: 14,
    color: '#2c3e50',
  },
  dropdownIcon: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  applyButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  categoriesSection: {
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
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
    backgroundColor: '#27ae60',
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
  totalStockBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  totalStockText: {
    fontSize: 10,
    color: '#27ae60',
    fontWeight: '600',
    marginBottom: 2,
  },
  totalStockValue: {
    fontSize: 14,
    color: '#2E7D32',
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
    backgroundColor: '#E8F5E9',
    borderColor: '#27ae60',
    borderWidth: 1,
  },
  subCategoryText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  activeSubCategoryText: {
    color: '#27ae60',
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
  productInfo: {
    flex: 2,
    paddingRight: 8,
  },
  productName: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 12,
    color: '#666',
  },
  quantityContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  quantityWrapper: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 4,
  },
  unitText: {
    fontSize: 12,
    color: '#666',
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
  legendSection: {
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
  legendTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  legendItems: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
  // Modal styles like admin
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  modalClose: {
    fontSize: 20,
    color: '#7f8c8d',
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalItemText: {
    fontSize: 16,
    color: '#2c3e50',
    marginLeft: 12,
  },
  modalDoneButton: {
    backgroundColor: '#27ae60',
    margin: 16,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalDoneButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Checkbox styles
  checkbox: {
    marginRight: 12,
  },
  checkboxInner: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    backgroundColor: '#3498db',
    borderColor: '#3498db',
  },
});

export default StockReport;