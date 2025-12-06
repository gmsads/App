// ProductManagement.tsx (FIXED)
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
  });

  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [subCategoryModalVisible, setSubCategoryModalVisible] = useState(false);

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
    
    // Fix: Ensure units is an array
    let unitsArray: string[] = [];
    if (product.units) {
      if (Array.isArray(product.units)) {
        unitsArray = product.units;
      } else if (typeof product.units === 'string') {
        // Try to parse string to array
        try {
          unitsArray = product.units.split(',').map((unit: string) => unit.trim());
        } catch {
          unitsArray = [product.units];
        }
      }
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
    });
    setEditModalVisible(true);
  };

  const handleUpdateProduct = () => {
    if (!editProductData.name || !editProductData.price || !editProductData.quantity || !editProductData.category) {
      Alert.alert('Error', 'Please fill in all required fields (*)');
      return;
    }

    if (selectedProduct) {
      const result = updateProduct(selectedProduct.id, {
        ...editProductData,
        quantity: parseInt(editProductData.quantity) || 0,
        price: editProductData.price,
        units: editProductData.units
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

  const getCurrentSubCategories = (): string[] => {
    if (!editProductData.category) return [];
    return subCategories[editProductData.category] || [];
  };

  const renderProductItem = ({ item }: { item: any }) => {
    // Fix: Ensure units is always an array for display
    let displayUnits = 'N/A';
    if (item.units) {
      if (Array.isArray(item.units)) {
        displayUnits = item.units.join(', ');
      } else if (typeof item.units === 'string') {
        displayUnits = item.units;
      }
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
                <Text style={styles.label}>Units: {editProductData.units.join(', ')}</Text>
                <Text style={styles.unitsHint}>Units cannot be edited. Delete and recreate if needed.</Text>
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

      <Modal
        visible={categoryModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setCategoryModalVisible(false)}
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
              onPress={() => setCategoryModalVisible(false)}
            >
              <Text style={styles.modalCloseButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={subCategoryModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSubCategoryModalVisible(false)}
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
              onPress={() => setSubCategoryModalVisible(false)}
            >
              <Text style={styles.modalCloseButtonText}>Cancel</Text>
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
  unitsHint: {
    fontSize: 12,
    color: '#7f8c8d',
    fontStyle: 'italic',
    marginTop: 4,
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
  modalItemText: {
    fontSize: 14,
    color: '#2c3e50',
  },
  modalCloseButton: {
    padding: 12,
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: '#e74c3c',
    borderRadius: 8,
  },
  modalCloseButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ProductManagement;