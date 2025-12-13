
// Import React and necessary hooks
import React, { useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  Switch,
} from 'react-native';

// Import navigation
import { useRouter } from 'expo-router';

// Import icon libraries
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';

// ==============================================
// TYPE DEFINITIONS
// ==============================================

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
// PRODUCT LIST COMPONENT (TABLE VIEW ONLY)
// ==============================================
const ProductList: React.FC = () => {
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
          isOutOfStock: false 
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
          actualPrice: 75, 
          salePrice: 38, 
          discountPercent: 49, 
          isEnabled: true, 
          isOutOfStock: false 
        },
        { 
          quantity: '500', 
          unit: 'g', 
          actualPrice: 55, 
          salePrice: 40, 
          discountPercent: 27, 
          isEnabled: false, 
          isOutOfStock: false 
        },
        { 
          quantity: '250', 
          unit: 'g', 
          actualPrice: 18, 
          salePrice: 18, 
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
          isOutOfStock: true 
        },
        { 
          quantity: '500', 
          unit: 'g', 
          actualPrice: 70, 
          salePrice: 60, 
          discountPercent: 14, 
          isEnabled: true, 
          isOutOfStock: false 
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
    {
      id: '3',
      name: 'Fresh Milk',
      category: 'dairy',
      sameDayOptions: [
        { 
          quantity: '1', 
          unit: 'litre', 
          actualPrice: 60, 
          salePrice: 55, 
          discountPercent: 8, 
          isEnabled: true, 
          isOutOfStock: false 
        },
        { 
          quantity: '500', 
          unit: 'ml', 
          actualPrice: 35, 
          salePrice: 32, 
          discountPercent: 9, 
          isEnabled: true, 
          isOutOfStock: false 
        },
      ],
      nextDayOptions: [
        { 
          quantity: '1', 
          unit: 'litre', 
          actualPrice: 58, 
          salePrice: 52, 
          discountPercent: 10, 
          isEnabled: true, 
          isOutOfStock: false 
        },
        { 
          quantity: '500', 
          unit: 'ml', 
          actualPrice: 33, 
          salePrice: 30, 
          discountPercent: 9, 
          isEnabled: true, 
          isOutOfStock: false 
        },
      ],
    },
    {
      id: '4',
      name: 'Basmati Rice',
      category: 'grains',
      sameDayOptions: [
        { 
          quantity: '5', 
          unit: 'kg', 
          actualPrice: 500, 
          salePrice: 450, 
          discountPercent: 10, 
          isEnabled: true, 
          isOutOfStock: false 
        },
        { 
          quantity: '1', 
          unit: 'kg', 
          actualPrice: 110, 
          salePrice: 100, 
          discountPercent: 9, 
          isEnabled: true, 
          isOutOfStock: false 
        },
      ],
      nextDayOptions: [
        { 
          quantity: '5', 
          unit: 'kg', 
          actualPrice: 480, 
          salePrice: 430, 
          discountPercent: 10, 
          isEnabled: true, 
          isOutOfStock: false 
        },
        { 
          quantity: '1', 
          unit: 'kg', 
          actualPrice: 105, 
          salePrice: 95, 
          discountPercent: 10, 
          isEnabled: true, 
          isOutOfStock: false 
        },
      ],
    },
    {
      id: '5',
      name: 'Fresh Eggs',
      category: 'dairy',
      sameDayOptions: [
        { 
          quantity: '12', 
          unit: 'pcs', 
          actualPrice: 80, 
          salePrice: 70, 
          discountPercent: 13, 
          isEnabled: true, 
          isOutOfStock: false 
        },
        { 
          quantity: '6', 
          unit: 'pcs', 
          actualPrice: 45, 
          salePrice: 40, 
          discountPercent: 11, 
          isEnabled: true, 
          isOutOfStock: false 
        },
      ],
      nextDayOptions: [
        { 
          quantity: '12', 
          unit: 'pcs', 
          actualPrice: 78, 
          salePrice: 68, 
          discountPercent: 13, 
          isEnabled: true, 
          isOutOfStock: false 
        },
        { 
          quantity: '6', 
          unit: 'pcs', 
          actualPrice: 43, 
          salePrice: 38, 
          discountPercent: 12, 
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
    { id: 'all', name: 'All', count: 5, icon: 'grid-outline' as const },
    { id: 'vegetables', name: 'Vegetables', count: 1, icon: 'leaf-outline' as const },
    { id: 'fruits', name: 'Fruits', count: 1, icon: 'nutrition-outline' as const },
    { id: 'dairy', name: 'Dairy', count: 2, icon: 'egg-outline' as const },
    { id: 'grains', name: 'Grains', count: 1, icon: 'fast-food-outline' as const },
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

  // Render options column with toggle switches
  const renderOptionsColumn = (
    options: QuantityOption[], 
    type: 'sameDay' | 'nextDay', 
    productId: string
  ) => (
    <View style={styles.optionsColumn}>
      {options.map((option, index) => (
        <View key={index}>
          <View 
            style={[
              styles.optionBox,
              option.isOutOfStock && styles.outOfStockBox,
              !option.isEnabled && styles.disabledBox
            ]}
          >
            {/* Option Header - Just Toggle */}
            <View style={styles.optionHeader}>
              <Switch
                value={option.isEnabled}
                onValueChange={() => handleEnableToggle(productId, type, index)}
                trackColor={{ false: '#ddd', true: '#4CAF50' }}
                thumbColor="#fff"
              />
            </View>
            
            {/* Option Details */}
            <View style={styles.optionDetails}>
              <Text style={styles.quantityText}>
                {option.quantity}{option.unit}
              </Text>
              <Text style={styles.priceRow}>
                <Text style={styles.actualPrice}>
                  ₹{option.actualPrice}
                </Text>
                <Text style={styles.salePrice}>
                  {' '}₹{option.salePrice}
                </Text>
              </Text>
              <Text style={styles.discountText}>
                {option.discountPercent}% off
              </Text>
            </View>
          </View>
          
          {/* Add spacing between options (except for last one) */}
          {index < options.length - 1 && (
            <View style={styles.optionSpacer} />
          )}
        </View>
      ))}
      
      {/* Edit Button for this column */}
      <TouchableOpacity 
        style={styles.editButton}
        onPress={() => {
          const product = products.find(p => p.id === productId);
          if (product) handleEditOptions(product, type);
        }}
      >
        <Feather name="edit-2" size={14} color="#2196F3" />
        <Text style={styles.editButtonText}>
          Edit
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
       My Products
        </Text>
        <Text style={styles.headerSubtitle}>
          Update prices and availability in bulk
        </Text>
      </View>

      {/* Search and Filter Section */}
      <View style={styles.filterContainer}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={setSearchQuery}
<<<<<<< HEAD
            placeholderTextColor="#999"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={16} color="#999" />
            </TouchableOpacity>
          )}
        </View>

        {/* Categories with +Add Category */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoryContainer}
          contentContainerStyle={styles.categoryContent}
        >
          {categories.map(category => (
            <View key={category.id} style={styles.categoryItemContainer}>
              <TouchableOpacity
                style={[
                  styles.categoryButton, 
                  selectedCategory === category.id && styles.categoryButtonActive
                ]}
                onPress={() => setSelectedCategory(category.id)}
                onLongPress={() => category.id !== 'all' && handleDeleteCategory(category.id)}
              >
                <Ionicons
                  name={category.icon as any}
                  size={12}
                  color={selectedCategory === category.id ? '#fff' : '#666'}
                  style={styles.categoryIcon}
                />
                <Text style={[
                  styles.categoryButtonText, 
                  selectedCategory === category.id && styles.categoryButtonTextActive
                ]}>
                  {category.name}
                </Text>
                <View style={[
                  styles.categoryCount,
                  selectedCategory === category.id && styles.categoryCountActive
                ]}>
                  <Text style={[
                    styles.countText, 
                    selectedCategory === category.id && styles.countTextActive
                  ]}>
                    {category.count}
                  </Text>
                </View>
              </TouchableOpacity>
              {category.id !== 'all' && (
                <TouchableOpacity 
                  style={styles.deleteCategoryButton}
                  onPress={() => handleDeleteCategory(category.id)}
                >
                  <Ionicons name="close-circle" size={10} color="#f44336" />
                </TouchableOpacity>
              )}
            </View>
          ))}
          
          {/* + Add Category Button */}
          <TouchableOpacity
            style={styles.addCategoryButton}
            onPress={() => setAddCategoryModalVisible(true)}
          >
            <Ionicons name="add-circle" size={12} color="#4CAF50" style={styles.categoryIcon} />
            <Text style={styles.addCategoryText}>Add Category</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Products List */}
      <FlatList
        data={filteredProducts}
        renderItem={renderProductCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialIcons name="inventory" size={50} color="#ddd" />
            <Text style={styles.emptyStateText}>No products found</Text>
            <Text style={styles.emptyStateSubtext}>Try changing your search or filters</Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />

      {/* Edit Product Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent
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
              <Ionicons
                name={category.icon}
                size={16}
                color={selectedCategory === category.id ? '#fff' : '#666'}
              />
              <Text style={[
                styles.categoryText, 
                selectedCategory === category.id && styles.categoryTextActive
              ]}>
                {category.name}
              </Text>
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
      </View>

      {/* Table Header */}
      <View style={styles.tableHeader}>
        {/* Column 1: Product Name */}
        <View style={[styles.column, styles.nameColumn]}>
          <Text style={styles.columnHeader}>
            Product Name
          </Text>
        </View>
        
        {/* Column 2: Same Day */}
        <View style={[styles.column, styles.optionsColumnHeader]}>
          <View style={styles.columnHeaderWithIcon}>
            <Ionicons name="flash-outline" size={16} color="#fff" />
            <Text style={styles.columnHeader}>
              Same Day
            </Text>
          </View>
        </View>
        
        {/* Column 3: Next Day */}
        <View style={[styles.column, styles.optionsColumnHeader]}>
          <View style={styles.columnHeaderWithIcon}>
            <Ionicons name="calendar-outline" size={16} color="#fff" />
            <Text style={styles.columnHeader}>
              Next Day
            </Text>
          </View>
        </View>
      </View>

      {/* Products Table */}
      <ScrollView style={styles.tableContainer}>
        {filteredProducts.map(product => (
          <View key={product.id} style={styles.tableRow}>
            {/* Column 1: Product Name */}
            <View style={[styles.column, styles.nameColumn]}>
              <Text style={styles.productName}>
                {product.name}
              </Text>
              <Text style={styles.productCategory}>
                {product.category}
              </Text>
            </View>

            {/* Column 2: Same Day Options */}
            {renderOptionsColumn(product.sameDayOptions, 'sameDay', product.id)}

            {/* Column 3: Next Day Options */}
            {renderOptionsColumn(product.nextDayOptions, 'nextDay', product.id)}
          </View>
        ))}

        {/* Empty State */}
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
      </ScrollView>

      {/* Edit Modal for Price Updates */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible && selectedProduct !== null}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Edit {editOptionsType === 'sameDay' ? 'Same Day' : 'Next Day'} Prices - {selectedProduct?.name}
              </Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Modal Content (Options List) */}
            <ScrollView style={styles.modalScrollView}>
              {selectedProduct?.[editOptionsType === 'sameDay' ? 'sameDayOptions' : 'nextDayOptions'].map((option, index) => (
                <View key={index} style={styles.editOptionCard}>
                  {/* Option Header */}
                  <View style={styles.editOptionHeader}>
                    <Text style={styles.editOptionTitle}>
                      {option.quantity}{option.unit}
                    </Text>
                    <View style={styles.availabilityRow}>
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
                  <View style={styles.priceInputs}>
                    {/* Actual Price Input */}
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>
                        Actual Price (₹)
                      </Text>
                      <TextInput
                        style={styles.input}
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
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>
                        Sale Price (₹)
                      </Text>
                      <TextInput
                        style={styles.input}
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
                  <View style={styles.discountRow}>
                    <Text style={styles.discountLabel}>
                      Discount: {option.discountPercent}%
                    </Text>
                    <Text style={styles.savingsText}>
                      Save: ₹{option.actualPrice - option.salePrice}
                    </Text>
                  </View>

                  {/* Stock Toggle */}
                  <View style={styles.stockToggle}>
                    <Text style={styles.stockLabel}>
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
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>

                <Text style={styles.cancelButtonText}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveEdit}
              >

                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Category Modal */}
      <Modal
        visible={addCategoryModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setAddCategoryModalVisible(false)}
      >
        <View style={styles.addCategoryModalContainer}>
          <View style={styles.addCategoryModalContent}>
            <View style={styles.addCategoryModalHeader}>
              <Text style={styles.addCategoryModalTitle}>Add New Category</Text>
              <TouchableOpacity onPress={() => setAddCategoryModalVisible(false)}>
                <Ionicons name="close" size={20} color="#666" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.addCategoryModalBody}>
              <Text style={styles.addCategoryLabel}>
                Enter category name (e.g., Snacks, Beverages, Bakery, etc.)
              </Text>
              <TextInput
                style={styles.addCategoryInput}
                placeholder="Category name"
                value={newCategoryName}
                onChangeText={setNewCategoryName}
                placeholderTextColor="#999"
                autoFocus
              />
              
              <View style={styles.suggestionsContainer}>
                <Text style={styles.suggestionsTitle}>Suggestions:</Text>
                <View style={styles.suggestionsRow}>
                  {['Snacks', 'Beverages', 'Bakery', 'Meat', 'Seafood'].map((suggestion) => (
                    <TouchableOpacity
                      key={suggestion}
                      style={styles.suggestionChip}
                      onPress={() => setNewCategoryName(suggestion)}
                    >
                      <Text style={styles.suggestionText}>{suggestion}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
            
            <View style={styles.addCategoryModalActions}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setAddCategoryModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleAddCategory}
              >
                <Text style={styles.saveButtonText}>Add Category</Text>

              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};


// ==============================================
// STYLES
// ==============================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {

    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingTop: 45,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productCountContainer: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  productCountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 10,
    height: 36,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 14,
    color: '#333',
  },
  categoryContainer: {
    flexDirection: 'row',
  },
  categoryContent: {
    paddingRight: 12,
  },
  categoryItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 6,
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

    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    height: 30,

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
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginLeft: 6,
    marginRight: 6,
  },
  categoryTextActive: {
    color: '#fff',
  },
  categoryCount: {
    backgroundColor: '#fff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  countText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#666',
  },
  countTextActive: {
    color: '#4CAF50',
  },
  deleteCategoryButton: {
    marginLeft: 4,
    padding: 2,
  },
  addCategoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderStyle: 'dashed',
    height: 30,
  },
  addCategoryText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4CAF50',
  },
  listContent: {
    padding: 8,
    paddingBottom: 100,
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 3,
    padding: 3,
    marginBottom: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  editButton: {
    padding: 2,
  },
  sectionContainer: {
    marginBottom: 5,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#333',
    marginLeft: 4,
    textTransform: 'uppercase',
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  optionsColumn: {
    flexDirection: 'column',
  },
  optionItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
    padding: 4,
    marginBottom: 3,
    borderWidth: 1,
    borderColor: '#e9ecef',
    position: 'relative',
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  switchContainer: {
    transform: [{ scale: 0.8 }],
    marginLeft: -5,
    marginTop: -2,
  },
  outOfStockBadge: {
    backgroundColor: '#ffebee',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
  },
  outOfStockText: {
    fontSize: 8,
    color: '#f44336',
    fontWeight: '600',
  },
  quantityText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  actualPrice: {
    fontSize: 10,
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
    fontSize: 12,
    textAlign: 'center',
  },
  columnHeaderWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  nameColumn: {
    flex: 1.2,
  },
  optionsColumnHeader: {
    flex: 1.8,
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
    minHeight: 180,
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
    flex: 1.8,
    alignItems: 'center',
  },
  optionBox: {
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
    padding: 8,
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
  optionSpacer: {
    height: 8,
    width: '100%',
  },
  optionHeader: {
    alignItems: 'center',
    marginBottom: 8,
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
>>>>>>> 59b5a119e90d67880c7e91df3ad1810d608fbaad
    textDecorationLine: 'line-through',
    color: '#999',
  },
  salePrice: {
<<<<<<< HEAD
    fontSize: 11,
=======
>>>>>>> 59b5a119e90d67880c7e91df3ad1810d608fbaad
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  discountText: {
<<<<<<< HEAD
    fontSize: 9,
    color: '#f44336',
    fontWeight: '600',
  },
  smallEditButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    padding: 2,
=======
    fontSize: 10,
    color: '#f44336',
    fontWeight: '600',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#e3f2fd',
    borderRadius: 6,
    alignSelf: 'center',
  },
  editButtonText: {
    fontSize: 12,
    color: '#2196F3',
    fontWeight: '600',
>>>>>>> 59b5a119e90d67880c7e91df3ad1810d608fbaad
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
<<<<<<< HEAD
    padding: 30,
    marginTop: 20,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#999',
    marginTop: 12,
  },
  emptyStateSubtext: {
    fontSize: 12,
=======
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
>>>>>>> 59b5a119e90d67880c7e91df3ad1810d608fbaad
    color: '#ccc',
    marginTop: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
<<<<<<< HEAD
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '80%',
=======
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
>>>>>>> 59b5a119e90d67880c7e91df3ad1810d608fbaad
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
<<<<<<< HEAD
    padding: 16,
=======
    padding: 20,
>>>>>>> 59b5a119e90d67880c7e91df3ad1810d608fbaad
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
<<<<<<< HEAD
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  modalBody: {
    padding: 16,
  },
  modalSection: {
    marginBottom: 16,
  },
  modalSectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: screenWidth < 375 ? 'column' : 'row',
    gap: 10,
    marginBottom: 12,
  },
  inputContainer: {
    flex: 1,
    marginBottom: screenWidth < 375 ? 8 : 0,
=======
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
  },
  priceInputs: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  inputGroup: {
    flex: 1,
>>>>>>> 59b5a119e90d67880c7e91df3ad1810d608fbaad
  },
  inputLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  input: {
<<<<<<< HEAD
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    color: '#333',
  },
  infoRow: {
=======
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
>>>>>>> 59b5a119e90d67880c7e91df3ad1810d608fbaad
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
<<<<<<< HEAD
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  savingsText: {
    fontSize: 13,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  toggleLabel: {
    fontSize: 13,
=======
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
>>>>>>> 59b5a119e90d67880c7e91df3ad1810d608fbaad
    color: '#333',
  },
  modalActions: {
    flexDirection: 'row',
<<<<<<< HEAD
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    gap: 10,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
=======
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
>>>>>>> 59b5a119e90d67880c7e91df3ad1810d608fbaad
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
<<<<<<< HEAD
    fontSize: 14,
=======
    fontSize: 16,
>>>>>>> 59b5a119e90d67880c7e91df3ad1810d608fbaad
    fontWeight: '600',
  },
  saveButtonText: {
    color: '#fff',
<<<<<<< HEAD
    fontSize: 14,
    fontWeight: 'bold',
  },
  addCategoryModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  addCategoryModalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '100%',
    maxWidth: 380,
  },
  addCategoryModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  addCategoryModalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  addCategoryModalBody: {
    padding: 16,
  },
  addCategoryLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
  },
  addCategoryInput: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#333',
    marginBottom: 16,
  },
  suggestionsContainer: {
    marginBottom: 8,
  },
  suggestionsTitle: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
    fontWeight: '600',
  },
  suggestionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  suggestionChip: {
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  suggestionText: {
    fontSize: 11,
    color: '#4CAF50',
    fontWeight: '600',
  },
  addCategoryModalActions: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    gap: 10,
  },
});

=======
    fontSize: 16,
    fontWeight: 'bold',
  },
});

// Export the main component
>>>>>>> 59b5a119e90d67880c7e91df3ad1810d608fbaad
export default ProductList;