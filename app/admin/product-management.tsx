// ProductManagement.tsx (UPDATED WITH unitOptions)
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  FlatList,
  Image,
  Modal,
  TextInput,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProductContext } from './product-context';
import Checkbox from 'expo-checkbox';

const ProductManagement: React.FC = () => {
  const router = useRouter();
  const { products, deleteProduct, updateProduct } = useProductContext();

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [editProductData, setEditProductData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    subCategory: '',
    quantity: '',
    image: '',
    units: [] as string[],
    unitOptions: [] as string[], // NEW
    sameDayAvailable: false, // NEW
    nextDayAvailable: false, // NEW
  });

  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [subCategoryModalVisible, setSubCategoryModalVisible] = useState(false);
  const [unitsModalVisible, setUnitsModalVisible] = useState(false); // NEW
  const [unitOptionsModalVisible, setUnitOptionsModalVisible] = useState(false); // NEW

  const categories: string[] = [
    'Fruits',
    'Vegetables',
    'Flowers'
  ];

  const subCategories: Record<string, string[]> = {
    'Fruits': [
      'Apple',
      'Apricot',
      'Avocado',
      'Banana',
      'Blackberry',
      'Blueberry',
      'Cantaloupe',
      'Cherry',
      'Coconut',
      'Cranberry',
      'Date',
      'Dragon Fruit',
      'Durian',
      'Fig',
      'Gooseberry',
      'Grape',
      'Grapefruit',
      'Guava',
      'Honeydew',
      'Jackfruit',
      'Kiwi',
      'Lemon',
      'Lime',
      'Lychee',
      'Mango',
      'Mangosteen',
      'Melon',
      'Mulberry',
      'Nectarine',
      'Orange',
      'Papaya',
      'Passion Fruit',
      'Peach',
      'Pear',
      'Persimmon',
      'Pineapple',
      'Plum',
      'Pomegranate',
      'Pomelo',
      'Rambutan',
      'Raspberry',
      'Red Currant',
      'Starfruit',
      'Strawberry',
      'Tangerine',
      'Watermelon'
    ],
    'Vegetables': [
      'Artichoke',
      'Arugula',
      'Asparagus',
      'Beetroot',
      'Bell Pepper',
      'Bok Choy',
      'Broccoli',
      'Brussels Sprouts',
      'Cabbage',
      'Capsicum',
      'Carrot',
      'Cauliflower',
      'Celery',
      'Chard',
      'Chili Pepper',
      'Collard Greens',
      'Corn',
      'Cucumber',
      'Eggplant',
      'Endive',
      'Fennel',
      'Garlic',
      'Ginger',
      'Green Beans',
      'Green Onion',
      'Kale',
      'Kohlrabi',
      'Leek',
      'Lettuce',
      'Mushroom',
      'Mustard Greens',
      'Okra',
      'Onion',
      'Parsnip',
      'Peas',
      'Potato',
      'Pumpkin',
      'Radish',
      'Red Cabbage',
      'Rhubarb',
      'Rutabaga',
      'Shallot',
      'Spinach',
      'Squash',
      'Sweet Potato',
      'Tomato',
      'Turnip',
      'Watercress',
      'Yam',
      'Zucchini'
    ],
    'Flowers': [
      'Rose',
      'Lily',
      'Tulip',
      'Sunflower',
      'Orchid',
      'Daisy',
      'Marigold',
      'Jasmine',
      'Lavender',
      'Hibiscus',
      'Chrysanthemum',
      'Carnation',
      'Daffodil',
      'Peony',
      'Hydrangea',
      'Gerbera',
      'Iris',
      'Lotus',
      'Magnolia',
      'Pansy',
      'Petunia',
      'Poppy',
      'Snapdragon',
      'Zinnia',
      'Begonia',
      'Bluebell',
      'Buttercup',
      'Camellia',
      'Dahlia',
      'Freesia',
      'Gardenia',
      'Gladiolus',
      'Honeysuckle',
      'Hyacinth',
      'Lilac',
      'Morning Glory',
      'Narcissus',
      'Oleander',
      'Periwinkle',
      'Primrose',
      'Ranunculus',
      'Sweet Pea',
      'Violet',
      'Wisteria'
    ]
  };

  // Predefined units
  const predefinedUnits: string[] = [
    'kg',
    'kgs',
    'gms',
    'piece',
    'pieces',
    'bunch',
    'bunches',
    'pack',
    'packs',
    'liter',
    'liters',
    'ml',
    'dozen',
    'box',
    'boxes',
    'packet',
    'packets'
  ];

  // Predefined unit options
  const predefinedUnitOptions: string[] = [
    '750',
    '500',
    '250',
    '200',
    '100',
    '50',
    '1'
  ];

  const handleAddProduct = () => {
    router.push('/admin/add-product');
  };

  const handleDeleteProduct = (productId: string, productName: string) => {
    Alert.alert(
      'Delete Product',
      `Are you sure you want to delete "${productName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            const result = deleteProduct(productId);
            if (result.success) {
              Alert.alert('Success', result.message);
            } else {
              Alert.alert('Error', result.message);
            }
          }
        }
      ]
    );
  };

  const handleEditProduct = (product: any) => {
    setSelectedProduct(product);
    
    // Fix: Ensure units and unitOptions are arrays
    let unitsArray: string[] = [];
    if (product.units) {
      if (Array.isArray(product.units)) {
        unitsArray = product.units;
      } else if (typeof product.units === 'string') {
        try {
          unitsArray = product.units.split(',').map((unit: string) => unit.trim());
        } catch {
          unitsArray = [product.units];
        }
      }
    }
    
    let unitOptionsArray: string[] = [];
    if (product.unitOptions) {
      if (Array.isArray(product.unitOptions)) {
        unitOptionsArray = product.unitOptions;
      } else if (typeof product.unitOptions === 'string') {
        try {
          unitOptionsArray = product.unitOptions.split(',').map((option: string) => option.trim());
        } catch {
          unitOptionsArray = [product.unitOptions];
        }
      }
    } else {
      unitOptionsArray = ['1']; // Default
    }
    
    setEditProductData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      category: product.category,
      subCategory: product.subCategory || '',
      quantity: product.quantity.toString(),
      image: product.image || '',
      units: unitsArray,
      unitOptions: unitOptionsArray,
      sameDayAvailable: product.sameDayAvailable || false,
      nextDayAvailable: product.nextDayAvailable || false,
    });
    setEditModalVisible(true);
  };

  const handleUpdateProduct = () => {
    if (!editProductData.name || !editProductData.price || !editProductData.quantity || !editProductData.category || editProductData.units.length === 0) {
      Alert.alert('Error', 'Please fill in all required fields (*)');
      return;
    }

    // Validate price is a valid number
    const priceNum = parseFloat(editProductData.price);
    if (isNaN(priceNum) || priceNum <= 0) {
      Alert.alert('Error', 'Please enter a valid price');
      return;
    }

    // Validate quantity is a valid number
    const quantityNum = parseInt(editProductData.quantity);
    if (isNaN(quantityNum) || quantityNum < 0) {
      Alert.alert('Error', 'Please enter a valid quantity');
      return;
    }

    if (selectedProduct) {
      const result = updateProduct(selectedProduct.id, {
        ...editProductData,
        quantity: quantityNum,
        price: editProductData.price,
        units: editProductData.units,
        unitOptions: editProductData.unitOptions.length > 0 ? editProductData.unitOptions : ['1'],
        sameDayAvailable: editProductData.sameDayAvailable,
        nextDayAvailable: editProductData.nextDayAvailable,
      });
      
      if (result.success) {
        Alert.alert('Success', result.message);
        setEditModalVisible(false);
        setSelectedProduct(null);
      } else {
        Alert.alert('Error', result.message);
      }
    }
  };

  const handleCategorySelect = (category: string) => {
    setEditProductData({ ...editProductData, category, subCategory: '' });
    setCategoryModalVisible(false);
  };

  const handleSubCategorySelect = (subCategory: string) => {
    setEditProductData({ ...editProductData, subCategory });
    setSubCategoryModalVisible(false);
  };

  const handleUnitToggle = (unit: string) => {
    const updatedUnits = [...editProductData.units];
    if (updatedUnits.includes(unit)) {
      const index = updatedUnits.indexOf(unit);
      updatedUnits.splice(index, 1);
    } else {
      updatedUnits.push(unit);
    }
    setEditProductData({ ...editProductData, units: updatedUnits });
  };

  const handleUnitOptionToggle = (unitOption: string) => {
    const updatedUnitOptions = [...editProductData.unitOptions];
    if (updatedUnitOptions.includes(unitOption)) {
      const index = updatedUnitOptions.indexOf(unitOption);
      updatedUnitOptions.splice(index, 1);
    } else {
      updatedUnitOptions.push(unitOption);
    }
    setEditProductData({ ...editProductData, unitOptions: updatedUnitOptions });
  };

  const getCurrentSubCategories = (): string[] => {
    if (!editProductData.category) return [];
    return subCategories[editProductData.category] || [];
  };

  const removeUnit = (unit: string) => {
    const updatedUnits = editProductData.units.filter(u => u !== unit);
    setEditProductData({ ...editProductData, units: updatedUnits });
  };

  const removeUnitOption = (unitOption: string) => {
    const updatedUnitOptions = editProductData.unitOptions.filter(u => u !== unitOption);
    setEditProductData({ ...editProductData, unitOptions: updatedUnitOptions });
  };

  const closeAllModals = () => {
    setCategoryModalVisible(false);
    setSubCategoryModalVisible(false);
    setUnitsModalVisible(false);
    setUnitOptionsModalVisible(false);
  };

  const renderProductItem = ({ item }: { item: any }) => {
    // Fix: Ensure units and unitOptions are always arrays for display
    let displayUnits = 'N/A';
    if (item.units) {
      if (Array.isArray(item.units)) {
        displayUnits = item.units.join(', ');
      } else if (typeof item.units === 'string') {
        displayUnits = item.units;
      }
    }
    
    let displayUnitOptions = 'N/A';
    if (item.unitOptions) {
      if (Array.isArray(item.unitOptions)) {
        displayUnitOptions = item.unitOptions.join(', ');
      } else if (typeof item.unitOptions === 'string') {
        displayUnitOptions = item.unitOptions;
      }
    } else {
      displayUnitOptions = '1';
    }
    
    return (
      <View style={styles.productCard}>
        <Image 
          source={{ uri: item.image || 'https://via.placeholder.com/80/CCCCCC/FFFFFF?text=No+Image' }} 
          style={styles.productImage}
          defaultSource={{ uri: 'https://via.placeholder.com/80/CCCCCC/FFFFFF?text=No+Image' }}
        />
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productPrice}>₹{item.price}</Text>
          <Text style={styles.productCategory}>{item.category} • {item.subCategory || 'N/A'}</Text>
          <Text style={styles.productDescription} numberOfLines={2}>
            {item.description || 'No description'}
          </Text>
          <Text style={styles.productQuantity}>Quantity: {item.quantity}</Text>
          <Text style={styles.productUnits}>Units: {displayUnits}</Text>
          <Text style={styles.productUnitOptions}>Unit Options: {displayUnitOptions}</Text>
          <View style={styles.deliveryInfo}>
            <Text style={styles.deliveryText}>
              Same Day: {item.sameDayAvailable ? '✓' : '✗'} | 
              Next Day: {item.nextDayAvailable ? '✓' : '✗'}
            </Text>
          </View>
        </View>
        <View style={styles.productActions}>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => handleEditProduct(item)}
          >
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={() => handleDeleteProduct(item.id, item.name)}
          >
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Management</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddProduct}>
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {products.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>No Products Yet</Text>
          <Text style={styles.emptyStateText}>
            Get started by adding your first product to manage.
          </Text>
          <TouchableOpacity style={styles.addFirstProductButton} onPress={handleAddProduct}>
            <Text style={styles.addFirstProductButtonText}>Add Your First Product</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={products}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.productsList}
          showsVerticalScrollIndicator={false}
        />
      )}

      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Product</Text>
            
            <ScrollView style={styles.editForm} showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Product Image</Text>
                <View style={styles.imageContainer}>
                  <Image 
                    source={{ uri: editProductData.image || 'https://via.placeholder.com/150/CCCCCC/FFFFFF?text=No+Image' }} 
                    style={styles.editProductImage}
                    resizeMode="cover"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Product Name *</Text>
                <TextInput
                  style={styles.input}
                  value={editProductData.name}
                  onChangeText={(text) => setEditProductData({ ...editProductData, name: text })}
                  placeholder="Enter product name"
                  placeholderTextColor="#95a5a6"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={editProductData.description}
                  onChangeText={(text) => setEditProductData({ ...editProductData, description: text })}
                  placeholder="Enter product description"
                  placeholderTextColor="#95a5a6"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Price (₹) *</Text>
                <TextInput
                  style={styles.input}
                  value={editProductData.price}
                  onChangeText={(text) => setEditProductData({ ...editProductData, price: text })}
                  placeholder="Enter price"
                  placeholderTextColor="#95a5a6"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Quantity *</Text>
                <TextInput
                  style={styles.input}
                  value={editProductData.quantity}
                  onChangeText={(text) => setEditProductData({ ...editProductData, quantity: text })}
                  placeholder="Enter quantity"
                  placeholderTextColor="#95a5a6"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Category *</Text>
                <TouchableOpacity 
                  style={styles.input} 
                  onPress={() => setCategoryModalVisible(true)}
                >
                  <Text style={editProductData.category ? styles.selectedText : styles.placeholderText}>
                    {editProductData.category || 'Select Category'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Sub Category</Text>
                <TouchableOpacity 
                  style={[
                    styles.input, 
                    !editProductData.category && styles.disabledInput
                  ]} 
                  onPress={() => setSubCategoryModalVisible(true)}
                  disabled={!editProductData.category}
                >
                  <Text style={editProductData.subCategory ? styles.selectedText : styles.placeholderText}>
                    {editProductData.subCategory || 'Select Sub Category'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Units *</Text>
                <TouchableOpacity 
                  style={styles.input} 
                  onPress={() => setUnitsModalVisible(true)}
                >
                  <Text style={editProductData.units.length > 0 ? styles.selectedText : styles.placeholderText}>
                    {editProductData.units.length > 0 
                      ? `Selected: ${editProductData.units.join(', ')}` 
                      : 'Select Units'}
                  </Text>
                </TouchableOpacity>
                
                {/* Selected Units Display */}
                {editProductData.units.length > 0 && (
                  <View style={styles.selectedUnitsContainer}>
                    <View style={styles.unitsChips}>
                      {editProductData.units.map((unit, index) => (
                        <View key={index} style={styles.unitChip}>
                          <Text style={styles.unitChipText}>{unit}</Text>
                          <TouchableOpacity 
                            onPress={() => removeUnit(unit)}
                            style={styles.removeUnitButton}
                          >
                            <Text style={styles.removeUnitText}>✕</Text>
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Unit Options</Text>
                <Text style={styles.subLabel}>e.g., 750ml, 500g, etc.</Text>
                <TouchableOpacity 
                  style={styles.input} 
                  onPress={() => setUnitOptionsModalVisible(true)}
                >
                  <Text style={editProductData.unitOptions.length > 0 ? styles.selectedText : styles.placeholderText}>
                    {editProductData.unitOptions.length > 0 
                      ? `Selected: ${editProductData.unitOptions.join(', ')}` 
                      : 'Select Unit Options'}
                  </Text>
                </TouchableOpacity>
                
                {/* Selected Unit Options Display */}
                {editProductData.unitOptions.length > 0 && (
                  <View style={styles.selectedUnitsContainer}>
                    <View style={styles.unitsChips}>
                      {editProductData.unitOptions.map((unitOption, index) => (
                        <View key={index} style={styles.unitChip}>
                          <Text style={styles.unitChipText}>{unitOption}</Text>
                          <TouchableOpacity 
                            onPress={() => removeUnitOption(unitOption)}
                            style={styles.removeUnitButton}
                          >
                            <Text style={styles.removeUnitText}>✕</Text>
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Delivery Options</Text>
                <View style={styles.checkboxContainer}>
                  <View style={styles.checkboxRow}>
                    <Checkbox
                      value={editProductData.sameDayAvailable}
                      onValueChange={(value) => setEditProductData({ ...editProductData, sameDayAvailable: value })}
                      color={editProductData.sameDayAvailable ? '#27ae60' : undefined}
                    />
                    <Text style={styles.checkboxLabel}>Same Day Delivery</Text>
                  </View>
                  <View style={styles.checkboxRow}>
                    <Checkbox
                      value={editProductData.nextDayAvailable}
                      onValueChange={(value) => setEditProductData({ ...editProductData, nextDayAvailable: value })}
                      color={editProductData.nextDayAvailable ? '#27ae60' : undefined}
                    />
                    <Text style={styles.checkboxLabel}>Next Day Delivery</Text>
                  </View>
                </View>
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={styles.cancelButton} 
                  onPress={() => setEditModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.updateButton} 
                  onPress={handleUpdateProduct}
                >
                  <Text style={styles.updateButtonText}>Update Product</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Category Modal */}
      <Modal
        visible={categoryModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeAllModals}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Category</Text>
            <FlatList
              data={categories}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => handleCategorySelect(item)}
                >
                  <Text style={styles.modalItemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={closeAllModals}
            >
              <Text style={styles.modalCloseButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Sub Category Modal */}
      <Modal
        visible={subCategoryModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeAllModals}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Sub Category</Text>
            <FlatList
              data={getCurrentSubCategories()}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => handleSubCategorySelect(item)}
                >
                  <Text style={styles.modalItemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={closeAllModals}
            >
              <Text style={styles.modalCloseButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Units Modal */}
      <Modal
        visible={unitsModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeAllModals}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Units (Multiple)</Text>
            <FlatList
              data={predefinedUnits}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <View style={styles.modalItemWithCheckbox}>
                  <Checkbox
                    value={editProductData.units.includes(item)}
                    onValueChange={() => handleUnitToggle(item)}
                    color={editProductData.units.includes(item) ? '#27ae60' : undefined}
                  />
                  <Text style={styles.modalItemText}>{item}</Text>
                </View>
              )}
            />
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={closeAllModals}
            >
              <Text style={styles.modalCloseButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Unit Options Modal */}
      <Modal
        visible={unitOptionsModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeAllModals}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Unit Options (Multiple)</Text>
            <Text style={styles.modalSubtitle}>e.g., 750, 500, 250, etc.</Text>
            <FlatList
              data={predefinedUnitOptions}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <View style={styles.modalItemWithCheckbox}>
                  <Checkbox
                    value={editProductData.unitOptions.includes(item)}
                    onValueChange={() => handleUnitOptionToggle(item)}
                    color={editProductData.unitOptions.includes(item) ? '#27ae60' : undefined}
                  />
                  <Text style={styles.modalItemText}>{item}</Text>
                </View>
              )}
            />
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={closeAllModals}
            >
              <Text style={styles.modalCloseButtonText}>Done</Text>
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
    paddingHorizontal: 20,
    paddingTop: 20,
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
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  addButton: {
    backgroundColor: '#27ae60',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  productsList: {
    padding: 16,
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e74c3c',
    marginBottom: 2,
  },
  productCategory: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 2,
  },
  productDescription: {
    fontSize: 12,
    color: '#95a5a6',
    marginBottom: 2,
  },
  productQuantity: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 2,
  },
  productUnits: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 2,
  },
  productUnitOptions: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 2,
  },
  deliveryInfo: {
    marginTop: 4,
  },
  deliveryText: {
    fontSize: 11,
    color: '#7f8c8d',
  },
  productActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 24,
  },
  addFirstProductButton: {
    backgroundColor: '#27ae60',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addFirstProductButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#2c3e50',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 15,
    textAlign: 'center',
  },
  editForm: {
    maxHeight: 500,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 6,
  },
  subLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 6,
    fontStyle: 'italic',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#2c3e50',
  },
  disabledInput: {
    backgroundColor: '#f8f9fa',
    opacity: 0.6,
  },
  selectedText: {
    color: '#2c3e50',
  },
  placeholderText: {
    color: '#95a5a6',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  editProductImage: {
    width: 120,
    height: 90,
    borderRadius: 8,
  },
  selectedUnitsContainer: {
    marginTop: 10,
  },
  unitsChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  unitChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3498db',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
  },
  unitChipText: {
    color: 'white',
    fontSize: 12,
    marginRight: 6,
  },
  removeUnitButton: {
    padding: 2,
  },
  removeUnitText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#95a5a6',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  updateButton: {
    flex: 1,
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  modalItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  modalItemWithCheckbox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
    gap: 12,
  },
  modalItemText: {
    fontSize: 14,
    color: '#2c3e50',
  },
  modalCloseButton: {
    padding: 12,
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: '#3498db',
    borderRadius: 8,
  },
  modalCloseButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  checkboxContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#2c3e50',
  },
});

export default ProductManagement;