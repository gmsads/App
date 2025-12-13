import React, { useState, useEffect } from 'react';
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
  FlatList,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';

// Type definitions
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

type Category = {
  id: string;
  name: string;
  count: number;
  icon: string;
};

const { width: screenWidth } = Dimensions.get('window');

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Fresh Tomatoes',
      category: 'vegetables',
      sameDayOptions: [
        { 
          quantity: '1', unit: 'kg', actualPrice: 80, salePrice: 40, discountPercent: 50, 
          isEnabled: true, isOutOfStock: false 
        },
        { 
          quantity: '500', unit: 'g', actualPrice: 60, salePrice: 45, discountPercent: 25, 
          isEnabled: true, isOutOfStock: false 
        },
      ],
      nextDayOptions: [
        { 
          quantity: '1', unit: 'kg', actualPrice: 75, salePrice: 38, discountPercent: 49, 
          isEnabled: true, isOutOfStock: false 
        },
        { 
          quantity: '500', unit: 'g', actualPrice: 55, salePrice: 40, discountPercent: 27, 
          isEnabled: false, isOutOfStock: false 
        },
      ],
    },
    {
      id: '2',
      name: 'Organic Apples',
      category: 'fruits',
      sameDayOptions: [
        { 
          quantity: '2', unit: 'kg', actualPrice: 200, salePrice: 160, discountPercent: 20, 
          isEnabled: true, isOutOfStock: false 
        },
        { 
          quantity: '1', unit: 'kg', actualPrice: 120, salePrice: 100, discountPercent: 17, 
          isEnabled: true, isOutOfStock: false 
        },
      ],
      nextDayOptions: [
        { 
          quantity: '2', unit: 'kg', actualPrice: 180, salePrice: 150, discountPercent: 17, 
          isEnabled: true, isOutOfStock: false 
        },
        { 
          quantity: '1', unit: 'kg', actualPrice: 110, salePrice: 90, discountPercent: 18, 
          isEnabled: false, isOutOfStock: false 
        },
      ],
    },
    {
      id: '3',
      name: 'Fresh Milk',
      category: 'dairy',
      sameDayOptions: [
        { 
          quantity: '1', unit: 'litre', actualPrice: 60, salePrice: 55, discountPercent: 8, 
          isEnabled: true, isOutOfStock: false 
        },
      ],
      nextDayOptions: [
        { 
          quantity: '1', unit: 'litre', actualPrice: 58, salePrice: 52, discountPercent: 10, 
          isEnabled: true, isOutOfStock: false 
        },
      ],
    },
  ]);

  const [categories, setCategories] = useState<Category[]>([
    { id: 'all', name: 'All', count: 3, icon: 'grid' },
    { id: 'vegetables', name: 'Vegetables', count: 1, icon: 'leaf' },
    { id: 'fruits', name: 'Fruits', count: 1, icon: 'nutrition' },
    { id: 'dairy', name: 'Dairy', count: 1, icon: 'egg' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editOptionsType, setEditOptionsType] = useState<'sameDay' | 'nextDay'>('sameDay');
  const [editingOptionIndex, setEditingOptionIndex] = useState<number | null>(null);
  const [editedOption, setEditedOption] = useState<QuantityOption | null>(null);
  const [addCategoryModalVisible, setAddCategoryModalVisible] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Load categories from AsyncStorage on component mount
  useEffect(() => {
    loadCategories();
  }, []);

  // Save categories to AsyncStorage whenever they change
  useEffect(() => {
    saveCategories();
  }, [categories]);

  // Load categories from AsyncStorage
  const loadCategories = async () => {
    try {
      const savedCategories = await AsyncStorage.getItem('productCategories');
      if (savedCategories) {
        const parsedCategories = JSON.parse(savedCategories);
        // Ensure we have the default categories if none are saved
        if (parsedCategories.length > 0) {
          setCategories(parsedCategories);
        }
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  // Save categories to AsyncStorage
  const saveCategories = async () => {
    try {
      await AsyncStorage.setItem('productCategories', JSON.stringify(categories));
    } catch (error) {
      console.error('Error saving categories:', error);
    }
  };

  // Calculate product counts for each category
  const updateCategoryCounts = () => {
    const updatedCategories = categories.map(cat => {
      if (cat.id === 'all') {
        return { ...cat, count: products.length };
      } else {
        const count = products.filter(p => p.category === cat.id).length;
        return { ...cat, count };
      }
    });
    setCategories(updatedCategories);
  };

  useEffect(() => {
    updateCategoryCounts();
  }, [products]);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setEditOptionsType('sameDay');
    setEditModalVisible(true);
    setEditingOptionIndex(0);
    setEditedOption({...product.sameDayOptions[0]});
  };

  const handleEditOption = (product: Product, type: 'sameDay' | 'nextDay', index: number) => {
    setSelectedProduct(product);
    setEditOptionsType(type);
    setEditingOptionIndex(index);
    const optionToEdit = type === 'sameDay' 
      ? product.sameDayOptions[index]
      : product.nextDayOptions[index];
    setEditedOption({...optionToEdit});
    setEditModalVisible(true);
  };

  const handleSaveEdit = () => {
    if (!selectedProduct || !editedOption || editingOptionIndex === null) return;

    const updatedProducts = products.map(product => {
      if (product.id === selectedProduct.id) {
        const updatedProduct = { ...product };
        if (editOptionsType === 'sameDay') {
          updatedProduct.sameDayOptions[editingOptionIndex] = editedOption;
        } else {
          updatedProduct.nextDayOptions[editingOptionIndex] = editedOption;
        }
        return updatedProduct;
      }
      return product;
    });

    setProducts(updatedProducts);
    setEditModalVisible(false);
    Alert.alert('Success', 'Product updated successfully!');
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      Alert.alert('Error', 'Please enter a category name');
      return;
    }

    // Check if category already exists
    const categoryExists = categories.some(
      cat => cat.name.toLowerCase() === newCategoryName.toLowerCase() || 
             cat.id === newCategoryName.toLowerCase().replace(/\s+/g, '-')
    );

    if (categoryExists) {
      Alert.alert('Error', 'Category already exists!');
      return;
    }

    // Create new category
    const newCategory: Category = {
      id: newCategoryName.toLowerCase().replace(/\s+/g, '-'),
      name: newCategoryName,
      count: 0,
      icon: 'cube', // Default icon for new categories
    };

    // Add new category to categories list
    setCategories(prev => [...prev, newCategory]);
    
    Alert.alert('Success', `Category "${newCategoryName}" added successfully!`);
    setNewCategoryName('');
    setAddCategoryModalVisible(false);
  };

  // Function to delete a category
  const handleDeleteCategory = (categoryId: string) => {
    if (categoryId === 'all') {
      Alert.alert('Cannot Delete', 'The "All" category cannot be deleted.');
      return;
    }

    // Check if any products are using this category
    const productsInCategory = products.filter(p => p.category === categoryId);
    if (productsInCategory.length > 0) {
      Alert.alert(
        'Cannot Delete', 
        `There are ${productsInCategory.length} product(s) in this category. Please move them to another category first.`
      );
      return;
    }

    Alert.alert(
      'Delete Category',
      'Are you sure you want to delete this category?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            const updatedCategories = categories.filter(cat => cat.id !== categoryId);
            setCategories(updatedCategories);
            if (selectedCategory === categoryId) {
              setSelectedCategory('all');
            }
          }
        }
      ]
    );
  };

  const renderProductCard = ({ item }: { item: Product }) => {
    const isSmallScreen = screenWidth < 375;
    const optionWidth = isSmallScreen ? '48%' : '48%';
    
    return (
      <View style={styles.productCard}>
        {/* Product Header - Removed category badge */}
        <View style={styles.productHeader}>
          <Text style={styles.productName}>{item.name}</Text>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => handleEditProduct(item)}
          >
            <Feather name="edit-2" size={14} color="#2196F3" />
          </TouchableOpacity>
        </View>

        {/* Same Day Options - Smaller cards */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Ionicons name="flash-outline" size={10} color="#4CAF50" />
            <Text style={styles.sectionTitle}>Same Day</Text>
          </View>
          <View style={[styles.optionsRow, isSmallScreen && styles.optionsColumn]}>
            {item.sameDayOptions.map((option, index) => (
              <View key={index} style={[styles.optionItem, { width: optionWidth }]}>
                <View style={styles.optionHeader}>
                  <View style={styles.switchContainer}>
                    <Switch
                      value={option.isEnabled}
                      onValueChange={() => {
                        const updatedProducts = products.map(p => {
                          if (p.id === item.id) {
                            const updated = {...p};
                            updated.sameDayOptions[index].isEnabled = !option.isEnabled;
                            return updated;
                          }
                          return p;
                        });
                        setProducts(updatedProducts);
                      }}
                      trackColor={{ false: '#ddd', true: '#4CAF50' }}
                      ios_backgroundColor="#ddd"
                    />
                  </View>
                  {option.isOutOfStock && (
                    <View style={styles.outOfStockBadge}>
                      <Text style={styles.outOfStockText}>Out of stock</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.quantityText}>{option.quantity}{option.unit}</Text>
                <View style={styles.priceContainer}>
                  <Text style={styles.actualPrice}>₹{option.actualPrice}</Text>
                  <Text style={styles.salePrice}>₹{option.salePrice}</Text>
                </View>
                <Text style={styles.discountText}>{option.discountPercent}% off</Text>
                <TouchableOpacity 
                  style={styles.smallEditButton}
                  onPress={() => handleEditOption(item, 'sameDay', index)}
                >
                  <Feather name="edit-2" size={8} color="#2196F3" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* Next Day Options - Smaller cards */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Ionicons name="calendar-outline" size={10} color="#2196F3" />
            <Text style={styles.sectionTitle}>Next Day</Text>
          </View>
          <View style={[styles.optionsRow, isSmallScreen && styles.optionsColumn]}>
            {item.nextDayOptions.map((option, index) => (
              <View key={index} style={[styles.optionItem, { width: optionWidth }]}>
                <View style={styles.optionHeader}>
                  <View style={styles.switchContainer}>
                    <Switch
                      value={option.isEnabled}
                      onValueChange={() => {
                        const updatedProducts = products.map(p => {
                          if (p.id === item.id) {
                            const updated = {...p};
                            updated.nextDayOptions[index].isEnabled = !option.isEnabled;
                            return updated;
                          }
                          return p;
                        });
                        setProducts(updatedProducts);
                      }}
                      trackColor={{ false: '#ddd', true: '#4CAF50' }}
                      ios_backgroundColor="#ddd"
                    />
                  </View>
                  {option.isOutOfStock && (
                    <View style={styles.outOfStockBadge}>
                      <Text style={styles.outOfStockText}>Out of stock</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.quantityText}>{option.quantity}{option.unit}</Text>
                <View style={styles.priceContainer}>
                  <Text style={styles.actualPrice}>₹{option.actualPrice}</Text>
                  <Text style={styles.salePrice}>₹{option.salePrice}</Text>
                </View>
                <Text style={styles.discountText}>{option.discountPercent}% off</Text>
                <TouchableOpacity 
                  style={styles.smallEditButton}
                  onPress={() => handleEditOption(item, 'nextDay', index)}
                >
                  <Feather name="edit-2" size={8} color="#2196F3" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>My Products</Text>
          </View>
          <View style={styles.headerActions}>
            <View style={styles.productCountContainer}>
              <Text style={styles.productCountText}>{filteredProducts.length}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.searchBar}>
          <Ionicons name="search" size={16} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={setSearchQuery}
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
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Edit {editOptionsType === 'sameDay' ? 'Same Day' : 'Next Day'} Option
              </Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Ionicons name="close" size={20} color="#666" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              {editedOption && (
                <>
                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>
                      {editedOption.quantity}{editedOption.unit}
                    </Text>
                    
                    <View style={styles.inputRow}>
                      <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Actual Price (₹)</Text>
                        <TextInput
                          style={styles.input}
                          value={editedOption.actualPrice.toString()}
                          onChangeText={(text) => {
                            const price = parseFloat(text) || 0;
                            setEditedOption({
                              ...editedOption,
                              actualPrice: price,
                              discountPercent: Math.round(
                                ((price - editedOption.salePrice) / price) * 100
                              )
                            });
                          }}
                          keyboardType="numeric"
                        />
                      </View>
                      
                      <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Sale Price (₹)</Text>
                        <TextInput
                          style={styles.input}
                          value={editedOption.salePrice.toString()}
                          onChangeText={(text) => {
                            const price = parseFloat(text) || 0;
                            setEditedOption({
                              ...editedOption,
                              salePrice: price,
                              discountPercent: Math.round(
                                ((editedOption.actualPrice - price) / editedOption.actualPrice) * 100
                              )
                            });
                          }}
                          keyboardType="numeric"
                        />
                      </View>
                    </View>
                    
                    <View style={styles.infoRow}>
                      <Text style={styles.discountText}>
                        Discount: {editedOption.discountPercent}%
                      </Text>
                      <Text style={styles.savingsText}>
                        Save: ₹{editedOption.actualPrice - editedOption.salePrice}
                      </Text>
                    </View>
                    
                    <View style={styles.toggleRow}>
                      <Text style={styles.toggleLabel}>Enabled:</Text>
                      <Switch
                        value={editedOption.isEnabled}
                        onValueChange={(value) => setEditedOption({...editedOption, isEnabled: value})}
                        trackColor={{ false: '#ddd', true: '#4CAF50' }}
                        ios_backgroundColor="#ddd"
                      />
                    </View>
                    
                    <View style={styles.toggleRow}>
                      <Text style={styles.toggleLabel}>Out of Stock:</Text>
                      <Switch
                        value={editedOption.isOutOfStock}
                        onValueChange={(value) => setEditedOption({...editedOption, isOutOfStock: value})}
                        trackColor={{ false: '#ddd', true: '#f44336' }}
                        ios_backgroundColor="#ddd"
                      />
                    </View>
                  </View>
                </>
              )}
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
  },
  categoryButtonActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  categoryIcon: {
    marginRight: 4,
  },
  categoryButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#666',
    marginRight: 4,
  },
  categoryButtonTextActive: {
    color: '#fff',
  },
  categoryCount: {
    backgroundColor: '#fff',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 8,
    minWidth: 18,
    alignItems: 'center',
  },
  categoryCountActive: {
    backgroundColor: '#fff',
  },
  countText: {
    fontSize: 9,
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
    textDecorationLine: 'line-through',
    color: '#999',
  },
  salePrice: {
    fontSize: 11,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  discountText: {
    fontSize: 9,
    color: '#f44336',
    fontWeight: '600',
  },
  smallEditButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    padding: 2,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
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
  },
  inputLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  input: {
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
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
    color: '#333',
  },
  modalActions: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    gap: 10,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
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
    fontSize: 14,
    fontWeight: '600',
  },
  saveButtonText: {
    color: '#fff',
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

export default ProductList;