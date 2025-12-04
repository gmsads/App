// ProductManagement.tsx
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  Alert,
  FlatList,
  Image,
  Modal,
  TextInput,
  ScrollView
} from 'react-native';
import { useProductContext } from './product-context';
import { Product } from './productStore';

const ProductManagement: React.FC = () => {
  const router = useRouter();
  const { products, deleteProduct, updateProduct } = useProductContext();

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editProductData, setEditProductData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    subCategory: '',
    quantity: '',
    image: '',
  });

  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [subCategoryModalVisible, setSubCategoryModalVisible] = useState(false);

  const categories: string[] = [
    'Fruits',
    'Vegetables'
  ];

  const subCategories: Record<string, string[]> = {
    'Fruits': [
      'Apples',
      'Bananas',
      'Oranges',
      'Grapes',
      'Strawberries',
      'Blueberries',
      'Raspberries',
      'Mangoes',
      'Pineapples',
      'Watermelons',
      'Melons',
      'Peaches',
      'Plums',
      'Cherries',
      'Pears',
      'Kiwis',
      'Papayas',
      'Guavas',
      'Pomegranates',
      'Lemons',
      'Limes',
      'Coconuts',
      'Avocados',
      'Figs',
      'Dates',
      'Lychees',
      'Dragon Fruits',
      'Star Fruits',
      'Jackfruits',
      'Passion Fruits'
    ],
    'Vegetables': [
      'Potatoes',
      'Tomatoes',
      'Onions',
      'Garlic',
      'Carrots',
      'Broccoli',
      'Cauliflower',
      'Spinach',
      'Lettuce',
      'Cabbage',
      'Bell Peppers',
      'Chili Peppers',
      'Cucumbers',
      'Zucchini',
      'Eggplants',
      'Pumpkins',
      'Sweet Potatoes',
      'Beets',
      'Radishes',
      'Turnips',
      'Green Beans',
      'Peas',
      'Corn',
      'Mushrooms',
      'Ginger',
      'Celery',
      'Asparagus',
      'Artichokes',
      'Okra',
      'Brussels Sprouts',
      'Kale',
      'Collard Greens',
      'Bok Choy',
      'Leeks',
      'Shallots',
      'Spring Onions'
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

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setEditProductData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      subCategory: product.subCategory,
      quantity: product.quantity,
      image: product.image || '',
    });
    setEditModalVisible(true);
  };

  const handleUpdateProduct = () => {
    if (!editProductData.name || !editProductData.price || !editProductData.quantity || !editProductData.category) {
      Alert.alert('Error', 'Please fill in all required fields (*)');
      return;
    }

    if (selectedProduct) {
      const result = updateProduct(selectedProduct.id, editProductData);
      
      if (result.success) {
        Alert.alert('Success', result.message);
        setEditModalVisible(false);
        setSelectedProduct(null);
      } else {
        Alert.alert('Product Already Exists', result.message);
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

  const renderProductItem = ({ item }: { item: Product }) => (
    <View style={styles.productCard}>
      <Image 
        source={{ uri: item.image || 'https://via.placeholder.com/80/CCCCCC/FFFFFF?text=No+Image' }} 
        style={styles.productImage}
        defaultSource={{ uri: 'https://via.placeholder.com/80/CCCCCC/FFFFFF?text=No+Image' }}
      />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>₹{item.price}</Text>
        <Text style={styles.productCategory}>{item.category} • {item.subCategory}</Text>
        <Text style={styles.productDescription} numberOfLines={2}>
          {item.description || 'No description'}
        </Text>
        <Text style={styles.productQuantity}>Quantity: {item.quantity}</Text>
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

  return (
    <SafeAreaView style={styles.container}>
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