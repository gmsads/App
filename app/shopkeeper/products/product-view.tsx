import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  Switch,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons, FontAwesome5, Feather } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type QuantityOption = {
  quantity: string;
  unit: string;
  actualPrice: number;
  salePrice: number;
  discountPercent: number;
  isEnabled: boolean;
  isOutOfStock: boolean;
};

type Product = {
  id: string;
  name: string;
  category: string;
  sameDayOptions: QuantityOption[];
  nextDayOptions: QuantityOption[];
};

const ProductListView: React.FC = () => {
  const router = useRouter();
  
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Fresh Tomatoes',
      category: 'vegetables',
      sameDayOptions: [
        { quantity: '1', unit: 'kg', actualPrice: 80, salePrice: 40, discountPercent: 50, isEnabled: true, isOutOfStock: false },
        { quantity: '500', unit: 'g', actualPrice: 60, salePrice: 45, discountPercent: 25, isEnabled: true, isOutOfStock: true },
        { quantity: '250', unit: 'g', actualPrice: 20, salePrice: 20, discountPercent: 0, isEnabled: true, isOutOfStock: false },
      ],
      nextDayOptions: [
        { quantity: '1', unit: 'kg', actualPrice: 80, salePrice: 40, discountPercent: 50, isEnabled: true, isOutOfStock: false },
        { quantity: '500', unit: 'g', actualPrice: 60, salePrice: 45, discountPercent: 25, isEnabled: false, isOutOfStock: false },
        { quantity: '250', unit: 'g', actualPrice: 20, salePrice: 20, discountPercent: 0, isEnabled: true, isOutOfStock: true },
      ],
    },
    {
      id: '2',
      name: 'Organic Apples',
      category: 'fruits',
      sameDayOptions: [
        { quantity: '2', unit: 'kg', actualPrice: 200, salePrice: 160, discountPercent: 20, isEnabled: true, isOutOfStock: false },
        { quantity: '1', unit: 'kg', actualPrice: 120, salePrice: 100, discountPercent: 17, isEnabled: true, isOutOfStock: false },
        { quantity: '500', unit: 'g', actualPrice: 70, salePrice: 60, discountPercent: 14, isEnabled: true, isOutOfStock: true },
      ],
      nextDayOptions: [
        { quantity: '2', unit: 'kg', actualPrice: 180, salePrice: 150, discountPercent: 17, isEnabled: true, isOutOfStock: false },
        { quantity: '1', unit: 'kg', actualPrice: 110, salePrice: 90, discountPercent: 18, isEnabled: false, isOutOfStock: false },
        { quantity: '500', unit: 'g', actualPrice: 65, salePrice: 55, discountPercent: 15, isEnabled: true, isOutOfStock: false },
      ],
    },
    {
      id: '3',
      name: 'Fresh Potatoes',
      category: 'vegetables',
      sameDayOptions: [
        { quantity: '5', unit: 'kg', actualPrice: 150, salePrice: 120, discountPercent: 20, isEnabled: true, isOutOfStock: false },
        { quantity: '2', unit: 'kg', actualPrice: 70, salePrice: 60, discountPercent: 14, isEnabled: true, isOutOfStock: false },
        { quantity: '1', unit: 'kg', actualPrice: 40, salePrice: 35, discountPercent: 12, isEnabled: true, isOutOfStock: false },
      ],
      nextDayOptions: [
        { quantity: '5', unit: 'kg', actualPrice: 140, salePrice: 110, discountPercent: 21, isEnabled: true, isOutOfStock: false },
        { quantity: '2', unit: 'kg', actualPrice: 65, salePrice: 55, discountPercent: 15, isEnabled: true, isOutOfStock: false },
        { quantity: '1', unit: 'kg', actualPrice: 35, salePrice: 30, discountPercent: 14, isEnabled: true, isOutOfStock: false },
      ],
    },
    {
      id: '4',
      name: 'Rose Bouquet',
      category: 'flowers',
      sameDayOptions: [
        { quantity: '12', unit: 'pcs', actualPrice: 500, salePrice: 400, discountPercent: 20, isEnabled: true, isOutOfStock: false },
        { quantity: '6', unit: 'pcs', actualPrice: 300, salePrice: 250, discountPercent: 17, isEnabled: true, isOutOfStock: false },
      ],
      nextDayOptions: [
        { quantity: '12', unit: 'pcs', actualPrice: 450, salePrice: 350, discountPercent: 22, isEnabled: true, isOutOfStock: false },
        { quantity: '6', unit: 'pcs', actualPrice: 280, salePrice: 230, discountPercent: 18, isEnabled: true, isOutOfStock: false },
      ],
    },
    {
      id: '5',
      name: 'Lily Flowers',
      category: 'flowers',
      sameDayOptions: [
        { quantity: '10', unit: 'pcs', actualPrice: 400, salePrice: 320, discountPercent: 20, isEnabled: true, isOutOfStock: true },
        { quantity: '5', unit: 'pcs', actualPrice: 220, salePrice: 180, discountPercent: 18, isEnabled: true, isOutOfStock: false },
      ],
      nextDayOptions: [
        { quantity: '10', unit: 'pcs', actualPrice: 380, salePrice: 300, discountPercent: 21, isEnabled: true, isOutOfStock: false },
        { quantity: '5', unit: 'pcs', actualPrice: 200, salePrice: 170, discountPercent: 15, isEnabled: true, isOutOfStock: false },
      ],
    },
  ]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editOptionsType, setEditOptionsType] = useState<'sameDay' | 'nextDay'>('sameDay');
  
  const categories = [
    { id: 'all', name: 'All', count: 5, icon: 'grid-outline' },
    { id: 'vegetables', name: 'Vegetables', count: 2, icon: 'leaf-outline' },
    { id: 'fruits', name: 'Fruits', count: 1, icon: 'nutrition-outline' },
    { id: 'flowers', name: 'Flowers', count: 2, icon: 'flower-outline' },
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleEnableToggle = (productId: string, optionType: 'sameDay' | 'nextDay', optionIndex: number) => {
    setProducts(prev => prev.map(product => {
      if (product.id === productId) {
        const options = optionType === 'sameDay' ? product.sameDayOptions : product.nextDayOptions;
        const updatedOptions = [...options];
        updatedOptions[optionIndex] = {
          ...updatedOptions[optionIndex],
          isEnabled: !updatedOptions[optionIndex].isEnabled
        };
        
        return {
          ...product,
          [optionType === 'sameDay' ? 'sameDayOptions' : 'nextDayOptions']: updatedOptions
        };
      }
      return product;
    }));
  };

  const handleEditOptions = (product: Product, type: 'sameDay' | 'nextDay') => {
    setSelectedProduct(product);
    setEditOptionsType(type);
    setEditModalVisible(true);
  };

  const handleSaveEdit = () => {
    if (!selectedProduct) return;
    
    setProducts(prev => prev.map(product => 
      product.id === selectedProduct.id ? selectedProduct : product
    ));
    setEditModalVisible(false);
    Alert.alert('Success', 'Prices updated successfully!');
  };

  const renderOptionsColumn = (options: QuantityOption[], type: 'sameDay' | 'nextDay', productId: string) => (
    <View style={styles.optionsColumn}>
      <View style={styles.optionsContainer}>
        {options.map((option, index) => (
          <View 
            key={index} 
            style={[
              styles.optionBox,
              option.isOutOfStock && styles.outOfStockBox,
              !option.isEnabled && styles.disabledBox
            ]}
          >
            <View style={styles.optionHeader}>
              <View style={styles.quantityBadge}>
                <Text style={styles.quantityText}>
                  {option.quantity}{option.unit}
                </Text>
              </View>
              <View style={styles.availabilityToggle}>
                <Switch
                  value={option.isEnabled}
                  onValueChange={() => handleEnableToggle(productId, type, index)}
                  trackColor={{ false: '#e0e0e0', true: '#4CAF50' }}
                  thumbColor="#fff"
                  ios_backgroundColor="#e0e0e0"
                />
              </View>
            </View>
            
            <View style={styles.optionDetails}>
              <View style={styles.priceContainer}>
                <Text style={styles.actualPrice}>₹{option.actualPrice}</Text>
                <Text style={styles.salePrice}>₹{option.salePrice}</Text>
              </View>
              <View style={styles.discountContainer}>
                <Text style={styles.discountText}>
                  {option.discountPercent > 0 ? `${option.discountPercent}% OFF` : 'No Discount'}
                </Text>
              </View>
              <View style={styles.statusContainer}>
                <View style={[
                  styles.statusIndicator,
                  { backgroundColor: option.isOutOfStock ? '#f44336' : '#4CAF50' }
                ]} />
                <Text style={styles.statusText}>
                  {option.isOutOfStock ? 'Out of Stock' : 'In Stock'}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>
      
      <TouchableOpacity 
        style={styles.editButton}
        onPress={() => {
          const product = products.find(p => p.id === productId);
          if (product) handleEditOptions(product, type);
        }}
      >
        <Feather name="edit-2" size={14} color="#2196F3" />
        <Text style={styles.editButtonText}>Edit Prices</Text>
      </TouchableOpacity>
    </View>
  );

  const calculateColumnWidth = () => {
    const totalWidth = SCREEN_WIDTH - 32;
    const nameColumnWidth = totalWidth * 0.25;
    const optionColumnWidth = totalWidth * 0.30;
    const editColumnWidth = totalWidth * 0.15;
    return { nameColumnWidth, optionColumnWidth, editColumnWidth };
  };

  const { nameColumnWidth, optionColumnWidth, editColumnWidth } = calculateColumnWidth();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Product Prices Management</Text>
          <Text style={styles.headerSubtitle}>Bulk update prices and availability</Text>
        </View>
        <View style={styles.headerStats}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{filteredProducts.length}</Text>
            <Text style={styles.statLabel}>Products</Text>
          </View>
        </View>
      </View>

      {/* Search and Filter */}
      <View style={styles.filterContainer}>
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products by name..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity 
              onPress={() => setSearchQuery('')}
              style={styles.clearButton}
            >
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          ) : null}
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryContent}
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
                name={category.icon as any}
                size={16}
                color={selectedCategory === category.id ? '#fff' : '#666'}
              />
              <Text style={[
                styles.categoryText,
                selectedCategory === category.id && styles.categoryTextActive
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
          ))}
        </ScrollView>
      </View>

      {/* Table Header */}
      <View style={styles.tableHeader}>
        <View style={[styles.tableHeaderCell, { width: nameColumnWidth }]}>
          <Text style={styles.tableHeaderText}>PRODUCT</Text>
        </View>
        <View style={[styles.tableHeaderCell, { width: optionColumnWidth }]}>
          <View style={styles.optionHeaderLabel}>
            <Ionicons name="flash-outline" size={16} color="#fff" />
            <Text style={styles.tableHeaderText}>SAME DAY</Text>
          </View>
        </View>
        <View style={[styles.tableHeaderCell, { width: optionColumnWidth }]}>
          <View style={styles.optionHeaderLabel}>
            <Ionicons name="calendar-outline" size={16} color="#fff" />
            <Text style={styles.tableHeaderText}>NEXT DAY</Text>
          </View>
        </View>
        <View style={[styles.tableHeaderCell, { width: editColumnWidth }]}>
          <Text style={styles.tableHeaderText}>ACTIONS</Text>
        </View>
      </View>

      {/* Products Table */}
      <ScrollView 
        style={styles.tableContainer}
        showsVerticalScrollIndicator={false}
      >
        {filteredProducts.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="inventory" size={64} color="#ddd" />
            <Text style={styles.emptyStateText}>No products found</Text>
            <Text style={styles.emptyStateSubtext}>
              {searchQuery ? 'Try a different search term' : 'No products in this category'}
            </Text>
          </View>
        ) : (
          filteredProducts.map(product => (
            <View key={product.id} style={styles.tableRow}>
              {/* Product Name Column */}
              <View style={[styles.tableCell, { width: nameColumnWidth }]}>
                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={2}>
                    {product.name}
                  </Text>
                  <View style={[
                    styles.categoryTag,
                    product.category === 'flowers' && styles.flowerCategoryTag
                  ]}>
                    <Text style={[
                      styles.categoryTextSmall,
                      product.category === 'flowers' && styles.flowerCategoryText
                    ]}>
                      {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Same Day Options Column */}
              <View style={[styles.tableCell, styles.optionCell, { width: optionColumnWidth }]}>
                {renderOptionsColumn(product.sameDayOptions, 'sameDay', product.id)}
              </View>

              {/* Next Day Options Column */}
              <View style={[styles.tableCell, styles.optionCell, { width: optionColumnWidth }]}>
                {renderOptionsColumn(product.nextDayOptions, 'nextDay', product.id)}
              </View>

              {/* Edit All Column */}
              <View style={[styles.tableCell, { width: editColumnWidth }]}>
                <TouchableOpacity 
                  style={styles.editAllButton}
                  onPress={() => {
                    setSelectedProduct(product);
                    setEditModalVisible(true);
                  }}
                >
                  <View style={styles.editAllIcon}>
                    <Feather name="edit-3" size={18} color="#fff" />
                  </View>
                  <Text style={styles.editAllText}>Edit All</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible && selectedProduct !== null}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>
                  Edit {editOptionsType === 'sameDay' ? 'Same Day' : 'Next Day'} Prices
                </Text>
                <Text style={styles.modalSubtitle}>{selectedProduct?.name}</Text>
              </View>
              <TouchableOpacity 
                onPress={() => setEditModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView 
              style={styles.modalScrollView}
              showsVerticalScrollIndicator={false}
            >
              {selectedProduct?.[editOptionsType === 'sameDay' ? 'sameDayOptions' : 'nextDayOptions'].map((option, index) => (
                <View key={index} style={styles.editOptionCard}>
                  <View style={styles.editOptionHeader}>
                    <View style={styles.optionTitleContainer}>
                      <View style={styles.quantityBadgeLarge}>
                        <Text style={styles.quantityTextLarge}>
                          {option.quantity}{option.unit}
                        </Text>
                      </View>
                      <View style={styles.priceSummary}>
                        <Text style={styles.originalPrice}>₹{option.actualPrice}</Text>
                        <Text style={styles.finalPrice}>₹{option.salePrice}</Text>
                        {option.discountPercent > 0 && (
                          <View style={styles.discountBadge}>
                            <Text style={styles.discountBadgeText}>
                              {option.discountPercent}% OFF
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                    
                    <View style={styles.toggleGroup}>
                      <View style={styles.toggleItem}>
                        <Text style={styles.toggleLabel}>Enabled</Text>
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
                          trackColor={{ false: '#e0e0e0', true: '#4CAF50' }}
                          thumbColor="#fff"
                        />
                      </View>
                      <View style={styles.toggleItem}>
                        <Text style={styles.toggleLabel}>In Stock</Text>
                        <Switch
                          value={!option.isOutOfStock}
                          onValueChange={(value) => {
                            if (selectedProduct) {
                              const updatedProduct = { ...selectedProduct };
                              const options = editOptionsType === 'sameDay' 
                                ? updatedProduct.sameDayOptions 
                                : updatedProduct.nextDayOptions;
                              options[index].isOutOfStock = !value;
                              setSelectedProduct(updatedProduct);
                            }
                          }}
                          trackColor={{ false: '#e0e0e0', true: '#4CAF50' }}
                          thumbColor="#fff"
                        />
                      </View>
                    </View>
                  </View>

                  <View style={styles.priceInputs}>
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Original Price</Text>
                      <View style={styles.priceInputContainer}>
                        <Text style={styles.currencySymbol}>₹</Text>
                        <TextInput
                          style={styles.input}
                          value={option.actualPrice.toString()}
                          onChangeText={(text) => {
                            if (selectedProduct) {
                              const updatedProduct = { ...selectedProduct };
                              const options = editOptionsType === 'sameDay' 
                                ? updatedProduct.sameDayOptions 
                                : updatedProduct.nextDayOptions;
                              const newPrice = parseFloat(text) || 0;
                              options[index].actualPrice = newPrice;
                              options[index].discountPercent = Math.round(
                                ((newPrice - options[index].salePrice) / newPrice) * 100
                              );
                              setSelectedProduct(updatedProduct);
                            }
                          }}
                          keyboardType="numeric"
                          placeholder="0"
                        />
                      </View>
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Sale Price</Text>
                      <View style={styles.priceInputContainer}>
                        <Text style={styles.currencySymbol}>₹</Text>
                        <TextInput
                          style={styles.input}
                          value={option.salePrice.toString()}
                          onChangeText={(text) => {
                            if (selectedProduct) {
                              const updatedProduct = { ...selectedProduct };
                              const options = editOptionsType === 'sameDay' 
                                ? updatedProduct.sameDayOptions 
                                : updatedProduct.nextDayOptions;
                              const newPrice = parseFloat(text) || 0;
                              options[index].salePrice = newPrice;
                              options[index].discountPercent = Math.round(
                                ((options[index].actualPrice - newPrice) / options[index].actualPrice) * 100
                              );
                              setSelectedProduct(updatedProduct);
                            }
                          }}
                          keyboardType="numeric"
                          placeholder="0"
                        />
                      </View>
                    </View>
                  </View>

                  <View style={styles.summaryRow}>
                    <View style={styles.summaryItem}>
                      <Text style={styles.summaryLabel}>Discount</Text>
                      <Text style={styles.summaryValue}>
                        {option.discountPercent}%
                      </Text>
                    </View>
                    <View style={styles.summaryItem}>
                      <Text style={styles.summaryLabel}>You Save</Text>
                      <Text style={[styles.summaryValue, styles.savingsText]}>
                        ₹{option.actualPrice - option.salePrice}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
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

      {/* Add Product Button */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.addProductButton}
          onPress={() => router.push('/shopkeeper/products/select-product')}
        >
          <View style={styles.addButtonContent}>
            <Ionicons name="add-circle" size={22} color="#fff" />
            <Text style={styles.addProductText}>Add New Product</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  headerStats: {
    marginLeft: 20,
  },
  statBox: {
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
  },
  filterContainer: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    height: 48,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 0,
  },
  clearButton: {
    padding: 4,
  },
  categoryScroll: {
    paddingLeft: 16,
  },
  categoryContent: {
    paddingRight: 16,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    minWidth: 100,
  },
  categoryButtonActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  categoryText: {
    fontSize: 14,
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
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 24,
    alignItems: 'center',
  },
  categoryCountActive: {
    backgroundColor: '#fff',
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
    backgroundColor: '#2e7d32',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  tableHeaderCell: {
    justifyContent: 'center',
  },
  tableHeaderText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  optionHeaderLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tableContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginBottom: 8,
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
    minHeight: 100,
  },
  tableCell: {
    paddingHorizontal: 8,
  },
  optionCell: {
    justifyContent: 'center',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
    lineHeight: 20,
  },
  categoryTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  flowerCategoryTag: {
    backgroundColor: '#f3e5f5',
  },
  categoryTextSmall: {
    fontSize: 12,
    color: '#2e7d32',
    fontWeight: '500',
  },
  flowerCategoryText: {
    color: '#7b1fa2',
  },
  optionsColumn: {
    alignItems: 'center',
  },
  optionsContainer: {
    width: '100%',
  },
  optionBox: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  outOfStockBox: {
    backgroundColor: '#fff5f5',
    borderColor: '#f44336',
  },
  disabledBox: {
    opacity: 0.6,
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  quantityBadge: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  quantityText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1976d2',
  },
  availabilityToggle: {
    transform: [{ scale: 0.8 }],
  },
  optionDetails: {
    alignItems: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
    gap: 6,
  },
  actualPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  salePrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  discountContainer: {
    marginBottom: 4,
  },
  discountText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#f44336',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 10,
    color: '#666',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#e3f2fd',
    borderRadius: 6,
    marginTop: 4,
  },
  editButtonText: {
    fontSize: 12,
    color: '#1976d2',
    fontWeight: '600',
  },
  editAllButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  editAllIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2196F3',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  editAllText: {
    fontSize: 12,
    color: '#2196F3',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
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
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  addProductButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingVertical: 16,
  },
  addButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  addProductText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  closeButton: {
    padding: 4,
  },
  modalScrollView: {
    padding: 20,
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
    marginBottom: 16,
  },
  optionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  quantityBadgeLarge: {
    backgroundColor: '#1976d2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  quantityTextLarge: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  priceSummary: {
    alignItems: 'flex-end',
  },
  originalPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
    marginBottom: 2,
  },
  finalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  discountBadge: {
    backgroundColor: '#f44336',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  discountBadgeText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
  },
  toggleGroup: {
    flexDirection: 'row',
    gap: 20,
  },
  toggleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  toggleLabel: {
    fontSize: 14,
    color: '#333',
  },
  priceInputs: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  inputGroup: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  currencySymbol: {
    fontSize: 16,
    color: '#666',
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  savingsText: {
    color: '#4CAF50',
  },
  modalActions: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
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

export default ProductListView;