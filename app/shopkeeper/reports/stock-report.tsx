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
  Platform,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons, Ionicons, Feather } from '@expo/vector-icons';

// Define the types
interface Product {
  id: string;
  name: string;
  category: string;
  subCategory: string;
  quantity: number;
  unit: string;
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

const StockReport: React.FC = () => {
  const router = useRouter();
  
  // Filter states
  const [fromDate, setFromDate] = useState<Date>(new Date());
  const [toDate, setToDate] = useState<Date>(new Date());
  const [showFromDatePicker, setShowFromDatePicker] = useState<boolean>(false);
  const [showToDatePicker, setShowToDatePicker] = useState<boolean>(false);
  
  // Order status options
  const orderStatuses: StatusOption[] = [
    { id: 'in_stock', label: 'In Stock', checked: true },
    { id: 'low_stock', label: 'Low Stock', checked: true },
    { id: 'out_of_stock', label: 'Out of Stock', checked: true },
    { id: 'discontinued', label: 'Discontinued', checked: false },
  ];
  
  const [selectedStatuses, setSelectedStatuses] = useState<StatusOption[]>(orderStatuses);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('All');
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalStock, setTotalStock] = useState<number>(0);

  // Sample data
  const sampleCategories: Category[] = [
    { name: 'Vegetables', subCategories: ['Leafy', 'Root', 'Fruiting'] },
    { name: 'Fruits', subCategories: ['Tropical', 'Citrus', 'Berries'] },
    { name: 'Snacks', subCategories: ['Chips', 'Biscuits', 'Nuts'] },
    { name: 'Beverages', subCategories: ['Soft Drinks', 'Juices', 'Energy Drinks'] },
    { name: 'Dairy', subCategories: ['Milk', 'Cheese', 'Yogurt'] },
  ];

  const sampleProducts: Product[] = [
    { id: '1', name: 'Spinach', category: 'Vegetables', subCategory: 'Leafy', quantity: 50, unit: 'kg' },
    { id: '2', name: 'Carrot', category: 'Vegetables', subCategory: 'Root', quantity: 100, unit: 'kg' },
    { id: '3', name: 'Tomato', category: 'Vegetables', subCategory: 'Fruiting', quantity: 25, unit: 'kg' },
    { id: '4', name: 'Mango', category: 'Fruits', subCategory: 'Tropical', quantity: 30, unit: 'kg' },
    { id: '5', name: 'Orange', category: 'Fruits', subCategory: 'Citrus', quantity: 40, unit: 'kg' },
    { id: '6', name: 'Potato Chips', category: 'Snacks', subCategory: 'Chips', quantity: 120, unit: 'packs' },
    { id: '7', name: 'Butter Cookies', category: 'Snacks', subCategory: 'Biscuits', quantity: 85, unit: 'boxes' },
    { id: '8', name: 'Cola', category: 'Beverages', subCategory: 'Soft Drinks', quantity: 200, unit: 'bottles' },
    { id: '9', name: 'Milk', category: 'Dairy', subCategory: 'Milk', quantity: 150, unit: 'liters' },
    { id: '10', name: 'Cheese', category: 'Dairy', subCategory: 'Cheese', quantity: 45, unit: 'kg' },
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
    filtered = filtered.filter(p => {
      if (activeStatuses.includes('in_stock') && p.quantity > 20) return true;
      if (activeStatuses.includes('low_stock') && p.quantity <= 20 && p.quantity > 0) return true;
      if (activeStatuses.includes('out_of_stock') && p.quantity === 0) return true;
      if (activeStatuses.includes('discontinued')) return true;
      return false;
    });
    
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

  const generatePDF = async () => {
    setLoading(true);
    try {
      Alert.alert('Success', 'PDF download feature would be implemented here');
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
              <MaterialIcons name="check" size={20} color="#4CAF50" />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  const renderProductItem = ({ item }: { item: Product }) => (
    <View style={styles.productRow}>
      <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
      <View style={styles.quantityContainer}>
        <Text style={[
          styles.quantityText, 
          item.quantity === 0 ? styles.outOfStockText :
          item.quantity <= 20 ? styles.lowStockText :
          styles.inStockText
        ]}>
          {item.quantity}
        </Text>
        <Text style={styles.unitText}>{item.unit}</Text>
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
            <ActivityIndicator size="small" color="#4CAF50" />
          ) : (
            <>
              <Feather name="download" size={20} color="#4CAF50" />
              <Text style={styles.downloadText}>PDF</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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
            <View>
              {showFromDatePicker && (
                <Text>From Date Picker - Implement date picker component</Text>
              )}
              {showToDatePicker && (
                <Text>To Date Picker - Implement date picker component</Text>
              )}
            </View>
          )}

          {/* Order Status Multi-select */}
          <View style={styles.statusSection}>
            <Text style={styles.statusLabel}>Stock Status *</Text>
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
                Showing stock as of {new Date().toLocaleDateString()}
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
                <Text style={styles.columnHeader}>Product Name</Text>
                <Text style={styles.columnHeader}>Quantity</Text>
              </View>
              
              {loading ? (
                <ActivityIndicator size="large" color="#4CAF50" style={styles.loader} />
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
              <Text style={styles.legendText}>In Stock (≥20)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#FF9800' }]} />
              <Text style={styles.legendText}>Low Stock (1-19)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#F44336' }]} />
              <Text style={styles.legendText}>Out of Stock (0)</Text>
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
    backgroundColor: '#E8F5E9',
  },
  downloadText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4CAF50',
  },
  content: {
    flex: 1,
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
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#333',
  },
  categoriesSection: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
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
    backgroundColor: '#4CAF50',
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
  totalStockBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  totalStockText: {
    fontSize: 10,
    color: '#4CAF50',
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
    borderColor: '#4CAF50',
    borderWidth: 1,
  },
  subCategoryText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  activeSubCategoryText: {
    color: '#2E7D32',
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
  quantityContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'flex-end',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 4,
  },
  inStockText: {
    color: '#4CAF50',
  },
  lowStockText: {
    color: '#FF9800',
  },
  outOfStockText: {
    color: '#F44336',
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
    padding: 16,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
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
});

export default StockReport;