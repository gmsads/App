// AddProduct.tsx
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  Image,
  Modal,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useProductContext } from './product-context';

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  category: string;
  subCategory: string;
  quantity: string;
  image: string | null;
}

const AddProduct = () => {
  const router = useRouter();
  const { addProduct } = useProductContext();

  const [productData, setProductData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: '',
    category: '',
    subCategory: '',
    quantity: '',
    image: null,
  });

  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [subCategoryModalVisible, setSubCategoryModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const pickImage = async (): Promise<void> => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Sorry, we need camera roll permissions to make this work!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setProductData({ ...productData, image: result.assets[0].uri });
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleSave = (): void => {
    // Prevent multiple submissions
    if (isSubmitting) return;
    
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!productData.name || !productData.price || !productData.quantity || !productData.category) {
        Alert.alert('Error', 'Please fill in all required fields (*)');
        setIsSubmitting(false);
        return;
      }

      // Validate price is a valid positive number
      const price = parseFloat(productData.price);
      if (isNaN(price) || price <= 0) {
        Alert.alert('Error', 'Please enter a valid price (must be greater than 0)');
        setIsSubmitting(false);
        return;
      }

      // Validate quantity is a valid positive integer
      const quantity = parseInt(productData.quantity);
      if (isNaN(quantity) || quantity <= 0 || !Number.isInteger(quantity)) {
        Alert.alert('Error', 'Please enter a valid quantity (must be a whole number greater than 0)');
        setIsSubmitting(false);
        return;
      }

      // Trim and clean data
      const cleanProductData = {
        name: productData.name.trim(),
        description: productData.description.trim(),
        price: price.toString(),
        category: productData.category.trim(),
        subCategory: productData.subCategory.trim(),
        quantity: quantity.toString(),
        image: productData.image,
      };

      // Call addProduct which includes duplicate check
      const result = addProduct(cleanProductData);

      if (result.success) {
        Alert.alert(
          'Success',
          result.message,
          [
            {
              text: 'OK',
              onPress: () => {
                setIsSubmitting(false);
                router.back();
              }
            }
          ]
        );
      } else {
        Alert.alert(
          'Product Already Exists',
          result.message,
          [
            {
              text: 'OK',
              onPress: () => setIsSubmitting(false)
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error adding product:', error);
      Alert.alert(
        'Error',
        'Failed to add product. Please try again.',
        [
          {
            text: 'OK',
            onPress: () => setIsSubmitting(false)
          }
        ]
      );
    }
  };

  const handleCategorySelect = (category: string): void => {
    setProductData({ ...productData, category, subCategory: '' });
    setCategoryModalVisible(false);
  };

  const handleSubCategorySelect = (subCategory: string): void => {
    setProductData({ ...productData, subCategory });
    setSubCategoryModalVisible(false);
  };

  const getCurrentSubCategories = (): string[] => {
    if (!productData.category) return [];
    return subCategories[productData.category] || [];
  };

  // Format price input
  const formatPriceInput = (text: string) => {
    // Remove any non-numeric characters except decimal point
    const cleaned = text.replace(/[^0-9.]/g, '');
    
    // Ensure only one decimal point
    const parts = cleaned.split('.');
    if (parts.length > 2) {
      return parts[0] + '.' + parts.slice(1).join('');
    }
    
    // Limit to 2 decimal places
    if (parts[1] && parts[1].length > 2) {
      return parts[0] + '.' + parts[1].slice(0, 2);
    }
    
    return cleaned;
  };

  // Format quantity input (only whole numbers)
  const formatQuantityInput = (text: string) => {
    // Remove any non-numeric characters
    const cleaned = text.replace(/[^0-9]/g, '');
    
    // Remove leading zeros
    if (cleaned.length > 1 && cleaned.startsWith('0')) {
      return cleaned.substring(1);
    }
    
    return cleaned;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Product</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Product Image</Text>
          <TouchableOpacity style={styles.imageUpload} onPress={pickImage}>
            {productData.image ? (
              <Image 
                source={{ uri: productData.image }} 
                style={styles.productImage} 
                resizeMode="cover"
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.imagePlaceholderText}>+ Add Image</Text>
                <Text style={styles.imageHintText}>(Optional)</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Product Name *</Text>
          <TextInput
            style={styles.input}
            value={productData.name}
            onChangeText={(text) => setProductData({ ...productData, name: text })}
            placeholder="Enter product name"
            placeholderTextColor="#95a5a6"
            maxLength={100}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={productData.description}
            onChangeText={(text) => setProductData({ ...productData, description: text })}
            placeholder="Enter product description"
            placeholderTextColor="#95a5a6"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            maxLength={500}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Price (₹) *</Text>
          <TextInput
            style={styles.input}
            value={productData.price}
            onChangeText={(text) => {
              const formatted = formatPriceInput(text);
              setProductData({ ...productData, price: formatted });
            }}
            placeholder="0.00"
            placeholderTextColor="#95a5a6"
            keyboardType="decimal-pad"
          />
          {productData.price && (
            <Text style={styles.validationHint}>
              Price: ₹{parseFloat(productData.price || '0').toFixed(2)}
            </Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Category *</Text>
          <TouchableOpacity 
            style={styles.input} 
            onPress={() => setCategoryModalVisible(true)}
          >
            <Text style={productData.category ? styles.selectedText : styles.placeholderText}>
              {productData.category || 'Select Category'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Sub Category</Text>
          <TouchableOpacity 
            style={[
              styles.input, 
              !productData.category && styles.disabledInput
            ]} 
            onPress={() => setSubCategoryModalVisible(true)}
            disabled={!productData.category}
          >
            <Text style={productData.subCategory ? styles.selectedText : styles.placeholderText}>
              {productData.subCategory || 'Select Sub Category'}
            </Text>
          </TouchableOpacity>
          {!productData.category && (
            <Text style={styles.validationHint}>
              Please select a category first
            </Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Quantity *</Text>
          <TextInput
            style={styles.input}
            value={productData.quantity}
            onChangeText={(text) => {
              const formatted = formatQuantityInput(text);
              setProductData({ ...productData, quantity: formatted });
            }}
            placeholder="0"
            placeholderTextColor="#95a5a6"
            keyboardType="number-pad"
          />
          {productData.quantity && (
            <Text style={styles.validationHint}>
              Quantity: {productData.quantity} units
            </Text>
          )}
        </View>

        <TouchableOpacity 
          style={[
            styles.saveButton,
            isSubmitting && styles.saveButtonDisabled
          ]} 
          onPress={handleSave}
          disabled={isSubmitting}
        >
          <Text style={styles.saveButtonText}>
            {isSubmitting ? 'Adding Product...' : 'Add Product'}
          </Text>
        </TouchableOpacity>

        <View style={styles.requiredHint}>
          <Text style={styles.requiredHintText}>
            * Required fields
          </Text>
        </View>
      </ScrollView>

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
  placeholder: {
    width: 60,
  },
  form: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
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
    height: 100,
    textAlignVertical: 'top',
  },
  imageUpload: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  productImage: {
    width: 200,
    height: 150,
    borderRadius: 8,
  },
  imagePlaceholder: {
    width: 200,
    height: 150,
    borderWidth: 2,
    borderColor: '#3498db',
    borderStyle: 'dashed',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  },
  imagePlaceholderText: {
    color: '#3498db',
    fontSize: 16,
    fontWeight: '500',
  },
  imageHintText: {
    color: '#7f8c8d',
    fontSize: 12,
    marginTop: 4,
  },
  validationHint: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 4,
    marginLeft: 4,
  },
  saveButton: {
    backgroundColor: '#27ae60',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  saveButtonDisabled: {
    backgroundColor: '#95a5a6',
    opacity: 0.7,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  requiredHint: {
    alignItems: 'center',
    marginBottom: 40,
  },
  requiredHintText: {
    color: '#7f8c8d',
    fontSize: 14,
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
    width: '80%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#2c3e50',
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  modalItemText: {
    fontSize: 16,
    color: '#2c3e50',
  },
  modalCloseButton: {
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#e74c3c',
    borderRadius: 8,
  },
  modalCloseButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddProduct;