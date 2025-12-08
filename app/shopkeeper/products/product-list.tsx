// Import React and necessary hooks
import React, { useState } from 'react';

// Import React Native components
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  RefreshControl,
  Modal,
  Switch,
} from 'react-native';

// Import navigation
import { useRouter } from 'expo-router';

// Import icon libraries
import { Ionicons, MaterialIcons, FontAwesome5, Feather } from '@expo/vector-icons';

// ==============================================
// TYPE DEFINITIONS
// ==============================================

// Define the Product type for card view
type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: string;
  status: 'approved' | 'pending' | 'rejected';
  inStock: boolean;
  quantityTypes: string[];
  sameDayPrice?: number;
  nextDayPrice?: number;
};

// Define the QuantityOption type for table view
type QuantityOption = {
  quantity: string;
  unit: string;
  actualPrice: number;
  salePrice: number;
  discountPercent: number;
  isEnabled: boolean;
  isOutOfStock: boolean;
};

// Define the TableProduct type for table view
type TableProduct = {
  id: string;
  name: string;
  category: string;
  sameDayOptions: QuantityOption[];
  nextDayOptions: QuantityOption[];
};

// ==============================================
// CARD VIEW COMPONENT
// ==============================================
const CardView: React.FC = () => {
  // Initialize router for navigation
  const router = useRouter();
  
  // State for products data
  const [products] = useState<Product[]>([
    {
      id: '1',
      name: 'Fresh Tomatoes',
      category: 'vegetables',
      price: 40,
      quantity: '1 kg',
      status: 'approved',
      inStock: true,
      quantityTypes: ['250g', '500g', '1kg'],
      sameDayPrice: 45,
      nextDayPrice: 40,
    },
    {
      id: '2',
      name: 'Apples',
      category: 'fruits',
      price: 120,
      quantity: '1 kg',
      status: 'approved',
      inStock: true,
      quantityTypes: ['500g', '1kg', '2kg'],
      sameDayPrice: 125,
      nextDayPrice: 120,
    },
  ]);
  
  // State for search functionality
  const [searchQuery, setSearchQuery] = useState('');
  
  // State for category filtering
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // State for pull-to-refresh
  const [refreshing, setRefreshing] = useState(false);
  
  // Define categories with icons and counts
  const categories = [
    { id: 'all', name: 'All Products', icon: 'grid-outline' as const, count: 28 },
    { id: 'vegetables', name: 'Vegetables', icon: 'leaf-outline' as const, count: 15 },
    { id: 'fruits', name: 'Fruits', icon: 'nutrition-outline' as const, count: 8 },
    { id: 'dairy', name: 'Dairy', icon: 'egg-outline' as const, count: 3 },
  ];

  // Filter products based on search query and selected category
  const filteredProducts = products.filter(product => {
    // Check if product name matches search query (case insensitive)
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Check if product category matches selected category
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    
    // Return products that match both conditions
    return matchesSearch && matchesCategory;
  });

  // Handle pull-to-refresh action
  const onRefresh = () => {
    setRefreshing(true);
    // Simulate API call with timeout
    setTimeout(() => setRefreshing(false), 1000);
  };

  // Handle adding product to My List
  const handleAddToMyList = (product: Product) => {
    Alert.alert(
      'Add to My List',
      `Add "${product.name}" to your list?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Add', 
          onPress: () => Alert.alert('Success', 'Product added to My List') 
        },
      ]
    );
  };

  // Handle editing a product
  const handleEditProduct = (product: Product) => {
    Alert.alert(
      'Edit Product',
      `Edit "${product.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Edit', 
          onPress: () => {
            // Navigate to the select product flow
            router.push('/shopkeeper/products/select-product');
          }
        },
      ]
    );
  };

  // Handle updating product price
  const handleUpdatePrice = (product: Product) => {
    router.push('/shopkeeper/my-list/my-list');
  };

  // Render the card view
  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        {/* Search icon */}
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        
        {/* Search input field */}
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        
        {/* Clear search button (shown only when there's text) */}
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Category Filter Horizontal Scroll */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.categoryContainer}
      >
        {categories.map(category => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton, 
              selectedCategory === category.id && styles.categoryButtonActive
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            {/* Category icon */}
            <Ionicons
              name={category.icon}
              size={16}
              color={selectedCategory === category.id ? '#fff' : '#666'}
            />
            
            {/* Category name */}
            <Text style={[
              styles.categoryText, 
              selectedCategory === category.id && styles.categoryTextActive
            ]}>
              {category.name}
            </Text>
            
            {/* Product count in category */}
            <View style={styles.categoryCount}>
              <Text style={[
                styles.countText, 
                selectedCategory === category.id && styles.countTextActive
              ]}>
                {category.count}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Products List with Pull-to-Refresh */}
      <ScrollView
        style={styles.productsContainer}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
          />
        }
      >
        {/* Products Header */}
        <View style={styles.productsHeader}>
          <Text style={styles.productsTitle}>
            {selectedCategory === 'all' 
              ? 'All Products' 
              : categories.find(c => c.id === selectedCategory)?.name || 'Products'
            }
          </Text>
          <Text style={styles.productsCount}>
            {filteredProducts.length} products
          </Text>
        </View>

        {/* Product Cards */}
        {filteredProducts.map(product => (
          <View key={product.id} style={styles.productCard}>
            {/* Product Header Section */}
            <View style={styles.productHeader}>
              {/* Product Info (Left side) */}
              <View style={styles.productInfo}>
                <Text style={styles.productName}>
                  {product.name}
                </Text>
                <View style={styles.productMeta}>
                  <Text style={styles.productCategory}>
                    {product.category}
                  </Text>
                  {/* Status Badge */}
                  <View style={[
                    styles.statusBadge, 
                    { 
                      backgroundColor: product.status === 'approved' 
                        ? '#4CAF50' 
                        : product.status === 'pending' 
                        ? '#FF9800' 
                        : '#f44336' 
                    }
                  ]}>
                    <Text style={styles.statusText}>
                      {product.status}
                    </Text>
                  </View>
                </View>
              </View>
              
              {/* Price Info (Right side) */}
              <View style={styles.priceContainer}>
                <Text style={styles.price}>
                  ₹{product.price}
                </Text>
                <Text style={styles.quantity}>
                  {product.quantity}
                </Text>
              </View>
            </View>

            {/* Product Details Section */}
            <View style={styles.productDetails}>
              {/* Quantity Types */}
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>
                  Quantity Types:
                </Text>
                <View style={styles.quantityTypes}>
                  {product.quantityTypes.map((type, index) => (
                    <Text key={index} style={styles.quantityType}>
                      {type}
                    </Text>
                  ))}
                </View>
              </View>
              
              {/* Same Day/Next Day Prices */}
              {product.sameDayPrice && product.nextDayPrice && (
                <View style={styles.detailRow}>
                  <View style={styles.dayPrices}>
                    {/* Same Day Price */}
                    <View style={styles.dayPrice}>
                      <Text style={styles.dayLabel}>
                        Same Day:
                      </Text>
                      <Text style={styles.dayPriceValue}>
                        ₹{product.sameDayPrice}
                      </Text>
                    </View>
                    
                    {/* Next Day Price */}
                    <View style={styles.dayPrice}>
                      <Text style={styles.dayLabel}>
                        Next Day:
                      </Text>
                      <Text style={styles.dayPriceValue}>
                        ₹{product.nextDayPrice}
                      </Text>
                    </View>
                  </View>
                </View>
              )}

              {/* Stock Status */}
              <View style={styles.stockStatus}>
                <View style={[
                  styles.stockIndicator, 
                  { 
                    backgroundColor: product.inStock ? '#4CAF50' : '#f44336' 
                  }
                ]}>
                  <Text style={styles.stockText}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Product Action Buttons */}
            <View style={styles.productActions}>
              {/* Edit Button */}
              <TouchableOpacity 
                style={[styles.actionButton, styles.editButton]} 
                onPress={() => handleEditProduct(product)}
              >
                <MaterialIcons name="edit" size={16} color="#2196F3" />
                <Text style={[styles.actionText, { color: '#2196F3' }]}>
                  Edit
                </Text>
              </TouchableOpacity>
              
              {/* Update Price Button */}
              <TouchableOpacity 
                style={[styles.actionButton, styles.priceButton]} 
                onPress={() => handleUpdatePrice(product)}
              >
                <FontAwesome5 name="rupee-sign" size={14} color="#FF9800" />
                <Text style={[styles.actionText, { color: '#FF9800' }]}>
                  Update Price
                </Text>
              </TouchableOpacity>
              
              {/* Add to List Button */}
              <TouchableOpacity 
                style={[styles.actionButton, styles.listButton]} 
                onPress={() => handleAddToMyList(product)}
              >
                <MaterialIcons name="add" size={16} color="#4CAF50" />
                <Text style={[styles.actionText, { color: '#4CAF50' }]}>
                  Add to List
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Empty State (No products found) */}
        {filteredProducts.length === 0 && (
          <View style={styles.emptyState}>
            <MaterialIcons name="inventory" size={64} color="#ddd" />
            <Text style={styles.emptyStateText}>
              No products found
            </Text>
            <Text style={styles.emptyStateSubtext}>
              Try changing your search or filters
            </Text>
          </View>
        )}

        {/* Add New Product Button */}
        <TouchableOpacity 
          style={styles.addProductButton} 
          onPress={() => router.push('/shopkeeper/products/select-product')}
        >
          <Ionicons name="add-circle" size={24} color="#fff" />
          <Text style={styles.addProductText}>
            Add New Product
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

// ==============================================
// TABLE VIEW COMPONENT
// ==============================================
const TableView: React.FC = () => {
  // Initialize router for navigation
  const router = useRouter();
  
  // State for products data
  const [products, setProducts] = useState<TableProduct[]>([
    {
      id: '1',
      name: 'Fresh Tomatoes',
      category: 'vegetables',
      sameDayOptions: [
        { 
          quantity: '1', 
          unit: 'kg', 
          actualPrice: 80, 
          salePrice: 40, 
          discountPercent: 50, 
          isEnabled: true, 
          isOutOfStock: false 
        },
        { 
          quantity: '500', 
          unit: 'g', 
          actualPrice: 60, 
          salePrice: 45, 
          discountPercent: 25, 
          isEnabled: true, 
          isOutOfStock: true 
        },
        { 
          quantity: '250', 
          unit: 'g', 
          actualPrice: 20, 
          salePrice: 20, 
          discountPercent: 0, 
          isEnabled: true, 
          isOutOfStock: false 
        },
      ],
      nextDayOptions: [
        { 
          quantity: '1', 
          unit: 'kg', 
          actualPrice: 80, 
          salePrice: 40, 
          discountPercent: 50, 
          isEnabled: true, 
          isOutOfStock: false 
        },
        { 
          quantity: '500', 
          unit: 'g', 
          actualPrice: 60, 
          salePrice: 45, 
          discountPercent: 25, 
          isEnabled: false, 
          isOutOfStock: false 
        },
        { 
          quantity: '250', 
          unit: 'g', 
          actualPrice: 20, 
          salePrice: 20, 
          discountPercent: 0, 
          isEnabled: true, 
          isOutOfStock: true 
        },
      ],
    },
    {
      id: '2',
      name: 'Organic Apples',
      category: 'fruits',
      sameDayOptions: [
        { 
          quantity: '2', 
          unit: 'kg', 
          actualPrice: 200, 
          salePrice: 160, 
          discountPercent: 20, 
          isEnabled: true, 
          isOutOfStock: false 
        },
        { 
          quantity: '1', 
          unit: 'kg', 
          actualPrice: 120, 
          salePrice: 100, 
          discountPercent: 17, 
          isEnabled: true, 
          isOutOfStock: false 
        },
        { 
          quantity: '500', 
          unit: 'g', 
          actualPrice: 70, 
          salePrice: 60, 
          discountPercent: 14, 
          isEnabled: true, 
          isOutOfStock: true 
        },
      ],
      nextDayOptions: [
        { 
          quantity: '2', 
          unit: 'kg', 
          actualPrice: 180, 
          salePrice: 150, 
          discountPercent: 17, 
          isEnabled: true, 
          isOutOfStock: false 
        },
        { 
          quantity: '1', 
          unit: 'kg', 
          actualPrice: 110, 
          salePrice: 90, 
          discountPercent: 18, 
          isEnabled: false, 
          isOutOfStock: false 
        },
        { 
          quantity: '500', 
          unit: 'g', 
          actualPrice: 65, 
          salePrice: 55, 
          discountPercent: 15, 
          isEnabled: true, 
          isOutOfStock: false 
        },
      ],
    },
  ]);
  
  // State for search functionality
  const [searchQuery, setSearchQuery] = useState('');
  
  // State for category filtering
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // State for selected product in edit modal
  const [selectedProduct, setSelectedProduct] = useState<TableProduct | null>(null);
  
  // State for edit modal visibility
  const [editModalVisible, setEditModalVisible] = useState(false);
  
  // State for which options are being edited (sameDay or nextDay)
  const [editOptionsType, setEditOptionsType] = useState<'sameDay' | 'nextDay'>('sameDay');
  
  // Define categories for filtering
  const categories = [
    { id: 'all', name: 'All Products', count: 28 },
    { id: 'vegetables', name: 'Vegetables', count: 15 },
    { id: 'fruits', name: 'Fruits', count: 8 },
    { id: 'dairy', name: 'Dairy', count: 3 },
    { id: 'grains', name: 'Grains', count: 2 },
  ];

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Toggle enable/disable for an option
  const handleEnableToggle = (
    productId: string, 
    optionType: 'sameDay' | 'nextDay', 
    optionIndex: number
  ) => {
    setProducts(prev => prev.map(product => {
      if (product.id === productId) {
        // Get the options array based on type
        const options = optionType === 'sameDay' 
          ? product.sameDayOptions 
          : product.nextDayOptions;
        
        // Create a copy of the options array
        const updatedOptions = [...options];
        
        // Toggle the enabled state
        updatedOptions[optionIndex] = {
          ...updatedOptions[optionIndex],
          isEnabled: !updatedOptions[optionIndex].isEnabled
        };
        
        // Return updated product
        return {
          ...product,
          [optionType === 'sameDay' ? 'sameDayOptions' : 'nextDayOptions']: updatedOptions
        };
      }
      return product;
    }));
  };

  // Open edit modal for a product's options
  const handleEditOptions = (product: TableProduct, type: 'sameDay' | 'nextDay') => {
    setSelectedProduct(product);
    setEditOptionsType(type);
    setEditModalVisible(true);
  };

  // Save edited options
  const handleSaveEdit = () => {
    if (!selectedProduct) return;
    
    // Update products state with edited product
    setProducts(prev => prev.map(product => 
      product.id === selectedProduct.id ? selectedProduct : product
    ));
    
    // Close modal and show success message
    setEditModalVisible(false);
    Alert.alert('Success', 'Prices updated successfully!');
  };

  // Render options column (Same Day or Next Day)
  const renderOptionsColumn = (
    options: QuantityOption[], 
    type: 'sameDay' | 'nextDay', 
    productId: string
  ) => (
    <View style={tableStyles.optionsColumn}>
      {options.map((option, index) => (
        <View 
          key={index} 
          style={[
            tableStyles.optionBox,
            option.isOutOfStock && tableStyles.outOfStockBox,
            !option.isEnabled && tableStyles.disabledBox
          ]}
        >
          {/* Option Header with Enable/Disable Toggle */}
          <View style={tableStyles.optionHeader}>
            <View style={tableStyles.availabilityToggle}>
              <Switch
                value={option.isEnabled}
                onValueChange={() => handleEnableToggle(productId, type, index)}
                trackColor={{ false: '#ddd', true: '#4CAF50' }}
                thumbColor="#fff"
              />
              <Text style={tableStyles.optionStatusText}>
                {option.isEnabled ? 'Enabled' : 'Disabled'}
              </Text>
            </View>
          </View>
          
          {/* Option Details */}
          <View style={tableStyles.optionDetails}>
            <Text style={tableStyles.quantityText}>
              {option.quantity}{option.unit}
            </Text>
            <Text style={tableStyles.priceRow}>
              <Text style={tableStyles.actualPrice}>
                ₹{option.actualPrice}
              </Text>
              <Text style={tableStyles.salePrice}>
                {' '}₹{option.salePrice}
              </Text>
            </Text>
            <Text style={tableStyles.discountText}>
              {option.discountPercent}% off
            </Text>
          </View>
        </View>
      ))}
      
      {/* Edit Button for this column */}
      <TouchableOpacity 
        style={tableStyles.editButton}
        onPress={() => {
          const product = products.find(p => p.id === productId);
          if (product) handleEditOptions(product, type);
        }}
      >
        <Feather name="edit-2" size={14} color="#2196F3" />
        <Text style={tableStyles.editButtonText}>
          Edit
        </Text>
      </TouchableOpacity>
    </View>
  );

  // Render the table view
  return (
    <View style={tableStyles.container}>
      {/* Header Section */}
      <View style={tableStyles.header}>
        <Text style={tableStyles.headerTitle}>
          Product Prices Management
        </Text>
        <Text style={tableStyles.headerSubtitle}>
          Update prices and availability in bulk
        </Text>
      </View>

      {/* Search and Filter Section */}
      <View style={tableStyles.filterContainer}>
        {/* Search Bar */}
        <View style={tableStyles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" style={tableStyles.searchIcon} />
          <TextInput
            style={tableStyles.searchInput}
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Category Filter */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={tableStyles.categoryContainer}
        >
          {categories.map(category => (
            <TouchableOpacity
              key={category.id}
              style={[
                tableStyles.categoryButton, 
                selectedCategory === category.id && tableStyles.categoryButtonActive
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text style={[
                tableStyles.categoryText, 
                selectedCategory === category.id && tableStyles.categoryTextActive
              ]}>
                {category.name}
              </Text>
              <View style={tableStyles.categoryCount}>
                <Text style={[
                  tableStyles.countText, 
                  selectedCategory === category.id && tableStyles.countTextActive
                ]}>
                  {category.count}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Table Header */}
      <View style={tableStyles.tableHeader}>
        {/* Column 1: Product Name */}
        <View style={[tableStyles.column, tableStyles.nameColumn]}>
          <Text style={tableStyles.columnHeader}>
            Product Name
          </Text>
        </View>
        
        {/* Column 2: Same Day */}
        <View style={[tableStyles.column, tableStyles.optionsColumnHeader]}>
          <Text style={tableStyles.columnHeader}>
            Same Day
          </Text>
        </View>
        
        {/* Column 3: Next Day */}
        <View style={[tableStyles.column, tableStyles.optionsColumnHeader]}>
          <Text style={tableStyles.columnHeader}>
            Next Day
          </Text>
        </View>
        
        {/* Column 4: Edit All */}
        <View style={[tableStyles.column, tableStyles.editColumn]}>
          <Text style={tableStyles.columnHeader}>
            Edit All
          </Text>
        </View>
      </View>

      {/* Products Table */}
      <ScrollView style={tableStyles.tableContainer}>
        {filteredProducts.map(product => (
          <View key={product.id} style={tableStyles.tableRow}>
            {/* Column 1: Product Name */}
            <View style={[tableStyles.column, tableStyles.nameColumn]}>
              <Text style={tableStyles.productName}>
                {product.name}
              </Text>
              <Text style={tableStyles.productCategory}>
                {product.category}
              </Text>
            </View>

            {/* Column 2: Same Day Options */}
            {renderOptionsColumn(product.sameDayOptions, 'sameDay', product.id)}

            {/* Column 3: Next Day Options */}
            {renderOptionsColumn(product.nextDayOptions, 'nextDay', product.id)}

            {/* Column 4: Edit All Button */}
            <View style={[tableStyles.column, tableStyles.editColumn]}>
              <TouchableOpacity 
                style={tableStyles.editAllButton}
                onPress={() => {
                  setSelectedProduct(product);
                  setEditModalVisible(true);
                }}
              >
                <Feather name="edit" size={16} color="#2196F3" />
                <Text style={tableStyles.editAllText}>
                  Edit All
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <View style={tableStyles.emptyState}>
            <MaterialIcons name="inventory" size={64} color="#ddd" />
            <Text style={tableStyles.emptyStateText}>
              No products found
            </Text>
            <Text style={tableStyles.emptyStateSubtext}>
              Try changing your search or filters
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Edit Modal for Price Updates */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible && selectedProduct !== null}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={tableStyles.modalContainer}>
          <View style={tableStyles.modalContent}>
            {/* Modal Header */}
            <View style={tableStyles.modalHeader}>
              <Text style={tableStyles.modalTitle}>
                Edit {editOptionsType === 'sameDay' ? 'Same Day' : 'Next Day'} Prices - {selectedProduct?.name}
              </Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Modal Content (Options List) */}
            <ScrollView style={tableStyles.modalScrollView}>
              {selectedProduct?.[editOptionsType === 'sameDay' ? 'sameDayOptions' : 'nextDayOptions'].map((option, index) => (
                <View key={index} style={tableStyles.editOptionCard}>
                  {/* Option Header */}
                  <View style={tableStyles.editOptionHeader}>
                    <Text style={tableStyles.editOptionTitle}>
                      {option.quantity}{option.unit}
                    </Text>
                    <View style={tableStyles.availabilityRow}>
                      <Text style={tableStyles.availabilityLabel}>
                        Available:
                      </Text>
                      <Switch
                        value={option.isEnabled}
                        onValueChange={(value) => {
                          if (selectedProduct) {
                            const updatedProduct = { ...selectedProduct };
                            const options = editOptionsType === 'sameDay' 
                              ? updatedProduct.sameDayOptions 
                              : updatedProduct.nextDayOptions;
                            options[index].isEnabled = value;
                            setSelectedProduct(updatedProduct);
                          }
                        }}
                        trackColor={{ false: '#ddd', true: '#4CAF50' }}
                        thumbColor="#fff"
                      />
                    </View>
                  </View>

                  {/* Price Inputs */}
                  <View style={tableStyles.priceInputs}>
                    {/* Actual Price Input */}
                    <View style={tableStyles.inputGroup}>
                      <Text style={tableStyles.inputLabel}>
                        Actual Price (₹)
                      </Text>
                      <TextInput
                        style={tableStyles.input}
                        value={option.actualPrice.toString()}
                        onChangeText={(text) => {
                          if (selectedProduct) {
                            const updatedProduct = { ...selectedProduct };
                            const options = editOptionsType === 'sameDay' 
                              ? updatedProduct.sameDayOptions 
                              : updatedProduct.nextDayOptions;
                            options[index].actualPrice = parseFloat(text) || 0;
                            
                            // Recalculate discount percentage
                            options[index].discountPercent = Math.round(
                              ((options[index].actualPrice - options[index].salePrice) / 
                               options[index].actualPrice) * 100
                            );
                            setSelectedProduct(updatedProduct);
                          }
                        }}
                        keyboardType="numeric"
                      />
                    </View>

                    {/* Sale Price Input */}
                    <View style={tableStyles.inputGroup}>
                      <Text style={tableStyles.inputLabel}>
                        Sale Price (₹)
                      </Text>
                      <TextInput
                        style={tableStyles.input}
                        value={option.salePrice.toString()}
                        onChangeText={(text) => {
                          if (selectedProduct) {
                            const updatedProduct = { ...selectedProduct };
                            const options = editOptionsType === 'sameDay' 
                              ? updatedProduct.sameDayOptions 
                              : updatedProduct.nextDayOptions;
                            options[index].salePrice = parseFloat(text) || 0;
                            
                            // Recalculate discount percentage
                            options[index].discountPercent = Math.round(
                              ((options[index].actualPrice - options[index].salePrice) / 
                               options[index].actualPrice) * 100
                            );
                            setSelectedProduct(updatedProduct);
                          }
                        }}
                        keyboardType="numeric"
                      />
                    </View>
                  </View>

                  {/* Discount Information */}
                  <View style={tableStyles.discountRow}>
                    <Text style={tableStyles.discountLabel}>
                      Discount: {option.discountPercent}%
                    </Text>
                    <Text style={tableStyles.savingsText}>
                      Save: ₹{option.actualPrice - option.salePrice}
                    </Text>
                  </View>

                  {/* Stock Toggle */}
                  <View style={tableStyles.stockToggle}>
                    <Text style={tableStyles.stockLabel}>
                      Out of Stock:
                    </Text>
                    <Switch
                      value={option.isOutOfStock}
                      onValueChange={(value) => {
                        if (selectedProduct) {
                          const updatedProduct = { ...selectedProduct };
                          const options = editOptionsType === 'sameDay' 
                            ? updatedProduct.sameDayOptions 
                            : updatedProduct.nextDayOptions;
                          options[index].isOutOfStock = value;
                          setSelectedProduct(updatedProduct);
                        }
                      }}
                      trackColor={{ false: '#ddd', true: '#f44336' }}
                      thumbColor="#fff"
                    />
                  </View>
                </View>
              ))}
            </ScrollView>

            {/* Modal Action Buttons */}
            <View style={tableStyles.modalActions}>
              <TouchableOpacity 
                style={[tableStyles.modalButton, tableStyles.cancelButton]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={tableStyles.cancelButtonText}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[tableStyles.modalButton, tableStyles.saveButton]}
                onPress={handleSaveEdit}
              >
                <Text style={tableStyles.saveButtonText}>
                  Save Changes
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add New Product Button */}
      <TouchableOpacity 
        style={tableStyles.addProductButton}
        onPress={() => router.push('/shopkeeper/products/select-product')}
      >
        <Ionicons name="add-circle" size={24} color="#fff" />
        <Text style={tableStyles.addProductText}>
          Add New Product
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// ==============================================
// MAIN PRODUCT LIST COMPONENT WITH VIEW TOGGLE
// ==============================================
const ProductList: React.FC = () => {
  // State to track current view (card or table)
  const [currentView, setCurrentView] = useState<'card' | 'table'>('card');
  
  // Render the selected view
  return (
    <View style={mainStyles.container}>
      {/* View Toggle Buttons */}
      <View style={mainStyles.toggleContainer}>
        <TouchableOpacity
          style={[
            mainStyles.toggleButton,
            currentView === 'card' && mainStyles.toggleButtonActive
          ]}
          onPress={() => setCurrentView('card')}
        >
          <Ionicons 
            name="grid-outline" 
            size={20} 
            color={currentView === 'card' ? '#fff' : '#666'} 
          />
          <Text style={[
            mainStyles.toggleText,
            currentView === 'card' && mainStyles.toggleTextActive
          ]}>
            Card View
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            mainStyles.toggleButton,
            currentView === 'table' && mainStyles.toggleButtonActive
          ]}
          onPress={() => setCurrentView('table')}
        >
          <Ionicons 
            name="list-outline" 
            size={20} 
            color={currentView === 'table' ? '#fff' : '#666'} 
          />
          <Text style={[
            mainStyles.toggleText,
            currentView === 'table' && mainStyles.toggleTextActive
          ]}>
            Table View
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Render the selected view */}
      {currentView === 'card' ? <CardView /> : <TableView />}
    </View>
  );
};

// ==============================================
// STYLES FOR MAIN COMPONENT
// ==============================================
const mainStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  toggleButtonActive: {
    backgroundColor: '#4CAF50',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  toggleTextActive: {
    color: '#fff',
  },
});

// ==============================================
// STYLES FOR CARD VIEW
// ==============================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333',
  },
  categoryContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    minWidth: 120,
    justifyContent: 'center',
  },
  categoryButtonActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  categoryText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  categoryTextActive: {
    color: '#fff',
  },
  categoryCount: {
    marginLeft: 8,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
  },
  countText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  countTextActive: {
    color: '#4CAF50',
    backgroundColor: '#fff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
  },
  productsContainer: {
    flex: 1,
    padding: 16,
  },
  productsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  productsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  productsCount: {
    fontSize: 14,
    color: '#666',
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  productMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  productCategory: {
    fontSize: 12,
    color: '#666',
    textTransform: 'capitalize',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  quantity: {
    fontSize: 12,
    color: '#666',
  },
  productDetails: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
    marginBottom: 12,
  },
  detailRow: {
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  quantityTypes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quantityType: {
    fontSize: 12,
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  dayPrices: {
    flexDirection: 'row',
    gap: 16,
  },
  dayPrice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dayLabel: {
    fontSize: 12,
    color: '#666',
  },
  dayPriceValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  stockStatus: {
    marginTop: 8,
  },
  stockIndicator: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  stockText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
  },
  productActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#f5f5f5',
    gap: 4,
  },
  editButton: {
    backgroundColor: '#e3f2fd',
  },
  priceButton: {
    backgroundColor: '#fff3e0',
  },
  listButton: {
    backgroundColor: '#e8f5e9',
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#999',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 4,
  },
  addProductButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    gap: 8,
  },
  addProductText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

// ==============================================
// STYLES FOR TABLE VIEW
// ==============================================
const tableStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  filterContainer: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  categoryContainer: {
    paddingHorizontal: 16,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  categoryButtonActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  categoryTextActive: {
    color: '#fff',
  },
  categoryCount: {
    marginLeft: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  countText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  countTextActive: {
    color: '#4CAF50',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  column: {
    paddingHorizontal: 4,
  },
  columnHeader: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  nameColumn: {
    flex: 2,
  },
  optionsColumnHeader: {
    flex: 3,
  },
  editColumn: {
    flex: 1,
  },
  tableContainer: {
    flex: 1,
    paddingHorizontal: 8,
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginTop: 8,
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 12,
    color: '#666',
    textTransform: 'capitalize',
  },
  optionsColumn: {
    flex: 3,
    alignItems: 'center',
  },
  optionBox: {
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
    padding: 8,
    marginBottom: 8,
    width: '100%',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  outOfStockBox: {
    backgroundColor: '#fff5f5',
    borderColor: '#f44336',
  },
  disabledBox: {
    opacity: 0.5,
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  availabilityToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  optionStatusText: {
    fontSize: 10,
    color: '#666',
  },
  optionDetails: {
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  priceRow: {
    fontSize: 11,
    marginBottom: 2,
  },
  actualPrice: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  salePrice: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  discountText: {
    fontSize: 10,
    color: '#f44336',
    fontWeight: '600',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: 4,
    paddingVertical: 4,
  },
  editButtonText: {
    fontSize: 12,
    color: '#2196F3',
    fontWeight: '600',
  },
  editAllButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    backgroundColor: '#e3f2fd',
    borderRadius: 6,
  },
  editAllText: {
    fontSize: 12,
    color: '#2196F3',
    fontWeight: '600',
    marginTop: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 20,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#999',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 4,
  },
  addProductButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    margin: 16,
    borderRadius: 12,
    gap: 8,
  },
  addProductText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 16,
  },
  modalScrollView: {
    padding: 20,
    maxHeight: 400,
  },
  editOptionCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  editOptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  editOptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  availabilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  availabilityLabel: {
    fontSize: 12,
    color: '#666',
  },
  priceInputs: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  inputGroup: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
  },
  discountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  discountLabel: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  savingsText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  stockToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  stockLabel: {
    fontSize: 14,
    color: '#333',
  },
  modalActions: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

// Export the main component
export default ProductList;