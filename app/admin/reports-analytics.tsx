import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
  FlatList,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const { width } = Dimensions.get('window');

// Updated mock data with pre-defined zone/shop for each month
const MOCK_DATA = {
  zones: [
    { id: 'zone1', name: 'Andheri East' },
    { id: 'zone2', name: 'Connaught Place' },
    { id: 'zone3', name: 'Koramangala' },
    { id: 'zone4', name: 'HSR Layout' },
  ],
  shops: [
    { id: 'shop1', name: 'Fresh Veggies Mart', zoneId: 'zone1' },
    { id: 'shop2', name: 'Daily Greens', zoneId: 'zone1' },
    { id: 'shop3', name: 'Quick Vegetable Store', zoneId: 'zone2' },
    { id: 'shop4', name: 'Super Fresh Market', zoneId: 'zone3' },
    { id: 'shop5', name: 'Mega Vegetable Hub', zoneId: 'zone4' },
  ],
  categories: [
    { 
      id: 'cat1', 
      name: 'Fresh Vegetables', 
      image: '🥦', 
      total: 85000, 
      quantityType: 'kg',
      color: '#27ae60',
      items: [
        'Tomatoes', 'Potatoes', 'Onions', 'Carrots', 'Cabbage',
        'Cauliflower', 'Spinach', 'Coriander', 'Green Beans'
      ]
    },
    { 
      id: 'cat2', 
      name: 'Fresh Fruits', 
      image: '🍎', 
      total: 65000, 
      quantityType: 'kg',
      color: '#e74c3c',
      items: [
        'Apples', 'Bananas', 'Oranges', 'Grapes', 'Pomegranate',
        'Watermelon', 'Mangoes', 'Papaya', 'Guava'
      ]
    },
    { 
      id: 'cat3', 
      name: 'Cuts & Sprouts', 
      image: '🥗', 
      total: 28000, 
      quantityType: 'packs',
      color: '#3498db',
      items: [
        'Carrot Cubes', 'Beetroot Cubes', 'Sprouted Moong',
        'Sprouted Chana', 'Mixed Sprouts', 'Ready-to-cook Mix'
      ]
    },
    { 
      id: 'cat4', 
      name: 'Flowers', 
      image: '🌺', 
      total: 45000, 
      quantityType: 'bundles',
      color: '#9b59b6',
      items: [
        'Roses', 'Marigold', 'Jasmine', 'Lotus', 'Lilies',
        'Sunflowers', 'Orchids', 'Tulips'
      ]
    },
  ],
  orderStatuses: [
    { id: 'pending', name: 'Pending' },
    { id: 'processing', name: 'Processing' },
    { id: 'packed', name: 'Packed' },
    { id: 'out_for_delivery', name: 'Out for Delivery' },
    { id: 'delivered', name: 'Delivered' },
  ],
  months: [
    { 
      id: 'today', 
      name: 'Today', 
      sales: 52000,
      allowZoneSelection: true,
      allowShopSelection: true,
      presetZone: null,
      presetShop: null
    },
    { 
      id: 'september', 
      name: 'September', 
      sales: 185000,
      allowZoneSelection: false,
      allowShopSelection: false,
      presetZone: 'zone2',
      presetShop: 'shop3'
    },
    { 
      id: 'october', 
      name: 'October', 
      sales: 195000,
      allowZoneSelection: false,
      allowShopSelection: false,
      presetZone: 'zone3',
      presetShop: 'shop4'
    },
    { 
      id: 'december', 
      name: 'December', 
      sales: 225000,
      allowZoneSelection: false,
      allowShopSelection: false,
      presetZone: 'zone1',
      presetShop: 'shop1'
    },
  ],
  products: [
    { id: 'p1', name: 'Organic Tomatoes', category: 'Fresh Vegetables', sales: 25000, image: '🍅' },
    { id: 'p2', name: 'Alphonso Mangoes', category: 'Fresh Fruits', sales: 18000, image: '🥭' },
    { id: 'p3', name: 'Sprouted Moong', category: 'Cuts & Sprouts', sales: 12000, image: '🌱' },
    { id: 'p4', name: 'Fresh Roses', category: 'Flowers', sales: 15000, image: '🌹' },
    { id: 'p5', name: 'Potatoes', category: 'Fresh Vegetables', sales: 22000, image: '🥔' },
    { id: 'p6', name: 'Apples', category: 'Fresh Fruits', sales: 14000, image: '🍏' },
    { id: 'p7', name: 'Carrot Cubes', category: 'Cuts & Sprouts', sales: 8000, image: '🥕' },
    { id: 'p8', name: 'Marigold', category: 'Flowers', sales: 12000, image: '🌼' },
  ]
};

const Checkbox = ({ checked, onPress }: { checked: boolean; onPress: () => void }) => (
  <TouchableOpacity onPress={onPress} style={styles.checkbox}>
    <View style={[styles.checkboxInner, checked && styles.checkboxChecked]}>
      {checked && <Text style={styles.checkmark}>✓</Text>}
    </View>
  </TouchableOpacity>
);

const ReportsAnalytics: React.FC = () => {
  const router = useRouter();
  const [selectedReport, setSelectedReport] = useState<'quantity' | 'sales'>('sales');
  const [selectedMonth, setSelectedMonth] = useState<string | null>('today');
  const [showMonthModal, setShowMonthModal] = useState(false);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [selectedShop, setSelectedShop] = useState<string | null>(null);
  const [fromDate, setFromDate] = useState<Date>(new Date());
  const [toDate, setToDate] = useState<Date>(new Date());
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);
  const [showZoneModal, setShowZoneModal] = useState(false);
  const [showShopModal, setShowShopModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(['delivered']);
  const [availableShops, setAvailableShops] = useState(MOCK_DATA.shops);
  const [filteredCategories, setFilteredCategories] = useState(MOCK_DATA.categories);
  const [showCategoryDetails, setShowCategoryDetails] = useState<string | null>(null);

  // Get current month data
  const currentMonthData = MOCK_DATA.months.find(m => m.id === selectedMonth);

  // Initialize dates to current month
  useEffect(() => {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    setFromDate(firstDayOfMonth);
  }, []);

  // Set preset zone/shop when month is selected (not today)
  useEffect(() => {
    if (selectedMonth && currentMonthData) {
      if (currentMonthData.presetZone) {
        setSelectedZone(currentMonthData.presetZone);
        // Set available shops based on preset zone
        const filtered = MOCK_DATA.shops.filter(shop => shop.zoneId === currentMonthData.presetZone);
        setAvailableShops(filtered);
        
        if (currentMonthData.presetShop && filtered.some(s => s.id === currentMonthData.presetShop)) {
          setSelectedShop(currentMonthData.presetShop);
        } else {
          setSelectedShop(null);
        }
      } else {
        setSelectedZone(null);
        setSelectedShop(null);
        setAvailableShops(MOCK_DATA.shops);
      }
    }
  }, [selectedMonth]);

  // Filter shops based on selected zone (for Today selection)
  useEffect(() => {
    if (selectedZone && currentMonthData?.allowZoneSelection) {
      const filtered = MOCK_DATA.shops.filter(shop => shop.zoneId === selectedZone);
      setAvailableShops(filtered);
      if (selectedShop && !filtered.some(s => s.id === selectedShop)) {
        setSelectedShop(null);
      }
    }
  }, [selectedZone]);

  // Filter and sort categories by total (high to low)
  useEffect(() => {
    const sorted = [...MOCK_DATA.categories].sort((a, b) => b.total - a.total);
    setFilteredCategories(sorted);
  }, []);

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

  const handleStatusToggle = (statusId: string) => {
    // For sales report, only allow delivered status
    if (selectedReport === 'sales') {
      if (statusId === 'delivered') {
        setSelectedStatuses(['delivered']);
      }
      return;
    }
    
    // For quantity report, allow all except delivered
    if (statusId === 'delivered') return;
    
    setSelectedStatuses(prev => {
      if (prev.includes(statusId)) {
        return prev.filter(id => id !== statusId);
      } else {
        return [...prev, statusId];
      }
    });
  };

  const handleSubmit = () => {
    const monthData = MOCK_DATA.months.find(m => m.id === selectedMonth);
    
    const filterData = {
      selectedReport,
      selectedMonth,
      selectedZone,
      selectedShop,
      fromDate: fromDate.toISOString(),
      toDate: toDate.toISOString(),
      selectedStatuses,
      monthDetails: monthData,
    };
    
    console.log('Filters applied:', filterData);
    
    let message = `Filters applied!\n`;
    message += `Month: ${getMonthName(selectedMonth || 'today')}\n`;
    message += `Zone: ${getZoneName(selectedZone || monthData?.presetZone || 'Not selected')}\n`;
    message += `Shop: ${getShopName(selectedShop || monthData?.presetShop || 'Not selected')}\n`;
    message += `Status: ${getStatusNames()}`;
    
    Alert.alert('Success', message);
  };

  const handleDownload = () => {
    Alert.alert('Download', 'Report download started!');
  };

  const handleMonthSelect = (monthId: string) => {
    setSelectedMonth(monthId);
    setShowMonthModal(false);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getMonthName = (id: string) => {
    return MOCK_DATA.months.find(m => m.id === id)?.name || id;
  };

  const getMonthSales = (id: string) => {
    return MOCK_DATA.months.find(m => m.id === id)?.sales || 0;
  };

  const getZoneName = (id: string | null) => {
    if (!id) return 'Not selected';
    return MOCK_DATA.zones.find(z => z.id === id)?.name || id;
  };

  const getShopName = (id: string | null) => {
    if (!id) return 'Not selected';
    return MOCK_DATA.shops.find(s => s.id === id)?.name || id;
  };

  const getStatusNames = () => {
    if (selectedReport === 'sales') {
      return 'Delivered';
    }
    
    if (selectedStatuses.length === 0) {
      return 'All Statuses';
    }
    
    return selectedStatuses
      .map(id => MOCK_DATA.orderStatuses.find(s => s.id === id)?.name)
      .filter(Boolean)
      .join(', ');
  };

  const getAvailableStatuses = () => {
    if (selectedReport === 'sales') {
      return MOCK_DATA.orderStatuses.filter(s => s.id === 'delivered');
    }
    return MOCK_DATA.orderStatuses.filter(s => s.id !== 'delivered');
  };

  const toggleCategoryDetails = (categoryId: string) => {
    setShowCategoryDetails(showCategoryDetails === categoryId ? null : categoryId);
  };

  const renderCategoryItem = ({ item }: { item: any }) => (
    <View>
      <TouchableOpacity 
        style={styles.categoryItem}
        onPress={() => toggleCategoryDetails(item.id)}
      >
        <View style={styles.categoryImageContainer}>
          <Text style={styles.categoryImage}>{item.image}</Text>
        </View>
        <View style={styles.categoryInfo}>
          <Text style={styles.categoryName}>{item.name}</Text>
          <Text style={styles.categoryQuantityType}>{item.quantityType}</Text>
        </View>
        <View style={styles.categoryTotalContainer}>
          <Text style={styles.categoryTotal}>₹{item.total.toLocaleString()}</Text>
          <Text style={styles.categoryArrow}>
            {showCategoryDetails === item.id ? '▲' : '▼'}
          </Text>
        </View>
      </TouchableOpacity>
      
      {showCategoryDetails === item.id && (
        <View style={styles.categoryDetails}>
          <Text style={styles.detailsTitle}>Popular Items:</Text>
          <View style={styles.itemsGrid}>
            {item.items.slice(0, 6).map((itemName: string, index: number) => (
              <View key={index} style={styles.itemTag}>
                <Text style={styles.itemTagText}>{itemName}</Text>
              </View>
            ))}
          </View>
          {item.items.length > 6 && (
            <Text style={styles.moreItemsText}>+{item.items.length - 6} more items</Text>
          )}
        </View>
      )}
    </View>
  );

  const renderSalesProducts = () => (
    <View style={styles.productsSection}>
      <Text style={styles.sectionTitle}>Top Selling Products</Text>
      {MOCK_DATA.products.sort((a, b) => b.sales - a.sales).map((product, index) => (
        <View key={product.id} style={styles.productItem}>
          <View style={styles.productImageContainer}>
            <Text style={styles.productImage}>{product.image}</Text>
          </View>
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productCategory}>{product.category}</Text>
          </View>
          <Text style={styles.productSales}>₹{product.sales.toLocaleString()}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Fresh Produce Analytics</Text>
        <TouchableOpacity style={styles.exportButton} onPress={handleDownload}>
          <Text style={styles.exportButtonText}>📥 Download</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Report Type Toggle */}
        <View style={styles.reportTypeContainer}>
          <TouchableOpacity
            style={[
              styles.reportTypeButton,
              selectedReport === 'sales' && styles.reportTypeButtonActive,
            ]}
            onPress={() => {
              setSelectedReport('sales');
              setSelectedStatuses(['delivered']); // Auto-select delivered for sales report
            }}
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
            onPress={() => {
              setSelectedReport('quantity');
              setSelectedStatuses([]); // Clear statuses for quantity report
            }}
          >
            <Text
              style={[
                styles.reportTypeText,
                selectedReport === 'quantity' && styles.reportTypeTextActive,
              ]}
            >
              Stock Reports
            </Text>
          </TouchableOpacity>
        </View>

        {/* Month Dropdown for Sales Report */}
        {selectedReport === 'sales' && (
          <View style={styles.monthSection}>
            <Text style={styles.sectionTitle}>Quick Month Select</Text>
            <View style={styles.monthInfo}>
              <TouchableOpacity
                style={styles.monthDropdown}
                onPress={() => setShowMonthModal(true)}
              >
                <View style={styles.monthDropdownContent}>
                  <Text style={styles.monthDropdownText}>
                    {getMonthName(selectedMonth || 'today')}
                  </Text>
                  <Text style={styles.monthDropdownAmount}>
                    ₹{getMonthSales(selectedMonth || 'today').toLocaleString()}
                  </Text>
                </View>
                <Text style={styles.dropdownIcon}>▼</Text>
              </TouchableOpacity>
              {selectedMonth !== 'today' && (
                <Text style={styles.presetInfo}>
                  Preset Zone: {getZoneName(currentMonthData?.presetZone || null)} | 
                  Preset Shop: {getShopName(currentMonthData?.presetShop || null)}
                </Text>
              )}
            </View>
          </View>
        )}

        {/* Filters Section */}
        <View style={styles.filterSection}>
          <Text style={styles.filterTitle}>Advanced Filters</Text>
          
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

          {/* Order Status Dropdown */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>
              {selectedReport === 'sales' ? 'Order Status' : 'Order Status (Multi-select)'}
            </Text>
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

          {/* Zone ID Dropdown */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Zone ID</Text>
            <TouchableOpacity
              style={[
                styles.dropdownInput,
                !currentMonthData?.allowZoneSelection && styles.dropdownDisabled
              ]}
              onPress={() => currentMonthData?.allowZoneSelection && setShowZoneModal(true)}
              disabled={!currentMonthData?.allowZoneSelection}
            >
              <View style={styles.dropdownTextContainer}>
                <Text style={[
                  styles.dropdownText,
                  !currentMonthData?.allowZoneSelection && styles.disabledText
                ]}>
                  {selectedZone ? getZoneName(selectedZone) : 'Select Zone'}
                </Text>
                {!currentMonthData?.allowZoneSelection && (
                  <Text style={styles.presetBadge}>Preset</Text>
                )}
              </View>
              <Text style={styles.dropdownIcon}>
                {currentMonthData?.allowZoneSelection ? '▼' : '🔒'}
              </Text>
            </TouchableOpacity>
            {!currentMonthData?.allowZoneSelection && selectedZone && (
              <Text style={styles.presetNote}>
                Preset zone for {getMonthName(selectedMonth || '')}
              </Text>
            )}
          </View>

          {/* Shop ID Dropdown */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Shop ID</Text>
            <TouchableOpacity
              style={[
                styles.dropdownInput,
                (!selectedZone || !currentMonthData?.allowShopSelection) && styles.dropdownDisabled
              ]}
              onPress={() => selectedZone && currentMonthData?.allowShopSelection && setShowShopModal(true)}
              disabled={!selectedZone || !currentMonthData?.allowShopSelection}
            >
              <View style={styles.dropdownTextContainer}>
                <Text style={[
                  styles.dropdownText,
                  (!selectedZone || !currentMonthData?.allowShopSelection) && styles.disabledText
                ]}>
                  {selectedShop ? getShopName(selectedShop) : 'Select Shop'}
                </Text>
                {!currentMonthData?.allowShopSelection && (
                  <Text style={styles.presetBadge}>Preset</Text>
                )}
              </View>
              <Text style={styles.dropdownIcon}>
                {selectedZone && currentMonthData?.allowShopSelection ? '▼' : '🔒'}
              </Text>
            </TouchableOpacity>
            {!currentMonthData?.allowShopSelection && selectedShop && (
              <Text style={styles.presetNote}>
                Preset shop for {getMonthName(selectedMonth || '')}
              </Text>
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Apply Filters</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.downloadButton} onPress={handleDownload}>
              <Text style={styles.downloadButtonText}>📊 Download Report</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Categories View */}
        <View style={styles.categoriesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Category Performance (High to Low)</Text>
            <Text style={styles.viewAllText}>
              {selectedReport === 'sales' ? 'Sales' : 'Stock'} Overview
            </Text>
          </View>
          
          <View style={styles.categoryHeaders}>
            <Text style={styles.categoryHeader}>Category</Text>
            <Text style={styles.categoryHeader}>Unit</Text>
            <Text style={styles.categoryHeader}>Total</Text>
          </View>
          
          <FlatList
            data={filteredCategories}
            renderItem={renderCategoryItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Show Top Products for Sales Report */}
        {selectedReport === 'sales' && renderSalesProducts()}
      </ScrollView>

      {/* Month Selection Modal */}
      <Modal
        visible={showMonthModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowMonthModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Month</Text>
              <TouchableOpacity onPress={() => setShowMonthModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={MOCK_DATA.months}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => handleMonthSelect(item.id)}
                >
                  <View style={styles.modalItemContent}>
                    <Text style={styles.modalItemText}>{item.name}</Text>
                    <Text style={styles.monthSales}>
                      ₹{item.sales.toLocaleString()}
                    </Text>
                    {!item.allowZoneSelection && (
                      <Text style={styles.monthPresetInfo}>
                        Preset: {getZoneName(item.presetZone)} / {getShopName(item.presetShop)}
                      </Text>
                    )}
                  </View>
                  {selectedMonth === item.id && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              )}
              keyExtractor={item => item.id}
            />
          </View>
        </View>
      </Modal>

      {/* Zone Selection Modal (Only for Today) */}
      {currentMonthData?.allowZoneSelection && (
        <Modal
          visible={showZoneModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowZoneModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Zone</Text>
                <TouchableOpacity onPress={() => setShowZoneModal(false)}>
                  <Text style={styles.modalClose}>✕</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={MOCK_DATA.zones}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => {
                      setSelectedZone(item.id);
                      setShowZoneModal(false);
                    }}
                  >
                    <View style={styles.modalItemContent}>
                      <Text style={styles.modalItemText}>{item.name}</Text>
                      <Text style={styles.zoneShopsCount}>
                        {MOCK_DATA.shops.filter(s => s.zoneId === item.id).length} shops
                      </Text>
                    </View>
                    {selectedZone === item.id && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </TouchableOpacity>
                )}
                keyExtractor={item => item.id}
              />
            </View>
          </View>
        </Modal>
      )}

      {/* Shop Selection Modal (Only for Today with selected Zone) */}
      {currentMonthData?.allowShopSelection && selectedZone && (
        <Modal
          visible={showShopModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowShopModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Shop</Text>
                <TouchableOpacity onPress={() => setShowShopModal(false)}>
                  <Text style={styles.modalClose}>✕</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={availableShops}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => {
                      setSelectedShop(item.id);
                      setShowShopModal(false);
                    }}
                  >
                    <Text style={styles.modalItemText}>{item.name}</Text>
                    {selectedShop === item.id && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </TouchableOpacity>
                )}
                keyExtractor={item => item.id}
              />
            </View>
          </View>
        </Modal>
      )}

      {/* Status Selection Modal */}
      <Modal
        visible={showStatusModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowStatusModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedReport === 'sales' ? 'Order Status' : 'Select Order Status (Multi-select)'}
              </Text>
              <TouchableOpacity onPress={() => setShowStatusModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={getAvailableStatuses()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => handleStatusToggle(item.id)}
                >
                  <Checkbox 
                    checked={selectedStatuses.includes(item.id)} 
                    onPress={() => handleStatusToggle(item.id)}
                  />
                  <Text style={styles.modalItemText}>{item.name}</Text>
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
    color: '#27ae60',
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  exportButton: {
    backgroundColor: '#27ae60',
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
    backgroundColor: '#27ae60',
  },
  reportTypeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7f8c8d',
  },
  reportTypeTextActive: {
    color: '#fff',
  },
  monthSection: {
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
  monthInfo: {
    marginBottom: 8,
  },
  monthDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 8,
  },
  monthDropdownContent: {
    flex: 1,
  },
  monthDropdownText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  monthDropdownAmount: {
    fontSize: 14,
    color: '#27ae60',
    marginTop: 4,
  },
  presetInfo: {
    fontSize: 12,
    color: '#7f8c8d',
    fontStyle: 'italic',
    backgroundColor: '#f0f7ff',
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
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
  dropdownDisabled: {
    backgroundColor: '#f5f5f5',
  },
  dropdownTextContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 14,
    color: '#2c3e50',
  },
  disabledText: {
    color: '#95a5a6',
  },
  presetBadge: {
    fontSize: 10,
    color: '#fff',
    backgroundColor: '#3498db',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  presetNote: {
    fontSize: 11,
    color: '#3498db',
    fontStyle: 'italic',
    marginTop: 4,
    marginLeft: 4,
  },
  dropdownIcon: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 12,
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#27ae60',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  downloadButton: {
    flex: 1,
    backgroundColor: '#3498db',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
  },
  viewAllText: {
    color: '#27ae60',
    fontSize: 14,
    fontWeight: '600',
  },
  categoryHeaders: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
    marginBottom: 8,
  },
  categoryHeader: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7f8c8d',
    textAlign: 'center',
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  categoryImageContainer: {
    width: 50,
    alignItems: 'center',
  },
  categoryImage: {
    fontSize: 32,
  },
  categoryInfo: {
    flex: 2,
    paddingHorizontal: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  categoryQuantityType: {
    fontSize: 13,
    color: '#7f8c8d',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  categoryTotalContainer: {
    alignItems: 'flex-end',
  },
  categoryTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#27ae60',
    marginBottom: 4,
  },
  categoryArrow: {
    fontSize: 12,
    color: '#95a5a6',
  },
  categoryDetails: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    marginTop: -4,
  },
  detailsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  itemTag: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  itemTagText: {
    fontSize: 12,
    color: '#2c3e50',
  },
  moreItemsText: {
    fontSize: 12,
    color: '#3498db',
    fontStyle: 'italic',
  },
  productsSection: {
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
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  productImageContainer: {
    width: 40,
    alignItems: 'center',
  },
  productImage: {
    fontSize: 24,
  },
  productInfo: {
    flex: 1,
    paddingHorizontal: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 2,
  },
  productCategory: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  productSales: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#27ae60',
  },
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
  },
  checkboxChecked: {
    backgroundColor: '#3498db',
  },
  checkmark: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
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
  modalItemContent: {
    flex: 1,
  },
  modalItemText: {
    fontSize: 16,
    color: '#2c3e50',
  },
  monthSales: {
    fontSize: 14,
    color: '#27ae60',
    marginTop: 2,
  },
  monthPresetInfo: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 2,
    fontStyle: 'italic',
  },
  zoneShopsCount: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 2,
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
});

export default ReportsAnalytics;