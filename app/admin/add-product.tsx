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
import Checkbox from 'expo-checkbox';

// Interface for form data
interface ProductFormData {
  name: string;
  description: string;
  units: string[];
  category: string;
  subCategory: string;
  image: string | null;
  customUnit: string;
  customCategory: string;
  customSubCategory: string;
}

const AddProduct = () => {
  // Get router for navigation
  const router = useRouter();
  
  // Get context functions
  const { addProduct, checkProductExists } = useProductContext();

  // State for product form data
  const [productData, setProductData] = useState<ProductFormData>({
    name: '',
    description: '',
    units: [],
    category: '',
    subCategory: '',
    image: null,
    customUnit: '',
    customCategory: '',
    customSubCategory: '',
  });

  // State for modal visibility
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [subCategoryModalVisible, setSubCategoryModalVisible] = useState(false);
  const [unitsModalVisible, setUnitsModalVisible] = useState(false);
  
  // State for loading
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State for showing custom inputs
  const [showCustomCategoryInput, setShowCustomCategoryInput] = useState(false);
  const [showCustomSubCategoryInput, setShowCustomSubCategoryInput] = useState(false);
  const [showCustomUnitInput, setShowCustomUnitInput] = useState(false);

  // State for search in modals
  const [categorySearch, setCategorySearch] = useState('');
  const [subCategorySearch, setSubCategorySearch] = useState('');
  const [unitSearch, setUnitSearch] = useState('');

  // Predefined categories
  const predefinedCategories: string[] = [
    'Fruits',
    'Vegetables',
    'Flowers'
  ];

  // Comprehensive sub-categories
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

  // Function to pick image from gallery
  const pickImage = async (): Promise<void> => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Sorry, we need camera roll permissions to add images!');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      // Set image if not canceled
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setProductData({ ...productData, image: result.assets[0].uri });
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  // Function to toggle unit selection
  const handleUnitToggle = (unit: string): void => {
    const updatedUnits = [...productData.units];
    if (updatedUnits.includes(unit)) {
      // Remove unit if already selected
      const index = updatedUnits.indexOf(unit);
      updatedUnits.splice(index, 1);
    } else {
      // Add unit if not selected
      updatedUnits.push(unit);
    }
    setProductData({ ...productData, units: updatedUnits });
  };

  // Function to add custom unit
  const handleAddCustomUnit = (): void => {
    if (productData.customUnit.trim()) {
      const customUnit = productData.customUnit.trim();
      if (!productData.units.includes(customUnit)) {
        const updatedUnits = [...productData.units, customUnit];
        setProductData({ 
          ...productData, 
          units: updatedUnits,
          customUnit: '' 
        });
        setShowCustomUnitInput(false);
        setUnitSearch('');
      }
    }
  };

  // Function to add custom category
  const handleAddCustomCategory = (): void => {
    if (productData.customCategory.trim()) {
      const customCategory = productData.customCategory.trim();
      setProductData({ 
        ...productData, 
        category: customCategory,
        customCategory: '',
        subCategory: ''
      });
      setShowCustomCategoryInput(false);
      setCategorySearch('');
      setSubCategorySearch('');
    }
  };

  // Function to add custom sub-category
  const handleAddCustomSubCategory = (): void => {
    if (productData.customSubCategory.trim()) {
      const customSubCategory = productData.customSubCategory.trim();
      setProductData({ 
        ...productData, 
        subCategory: customSubCategory,
        customSubCategory: '' 
      });
      setShowCustomSubCategoryInput(false);
      setSubCategorySearch('');
    }
  };

  // Function to save product
  const handleSave = (): void => {
    // Prevent multiple submissions
    if (isSubmitting) return;
    
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!productData.name || !productData.category || productData.units.length === 0) {
        Alert.alert('Error', 'Please fill in all required fields (*)');
        setIsSubmitting(false);
        return;
      }

      // Check if product exists
      const existsCheck = checkProductExists(productData.name, productData.category);
      if (existsCheck.exists) {
        Alert.alert('Product Already Exists', existsCheck.message);
        setIsSubmitting(false);
        return;
      }

      // Prepare product data
      const productToSave = {
        name: productData.name.trim(),
        description: productData.description.trim(),
        price: '0', // Default price
        category: productData.category,
        subCategory: productData.subCategory || '',
        quantity: 0, // Default quantity
        image: productData.image || '',
        units: productData.units,
        sameDayAvailable: true,
        nextDayAvailable: true
      };

      // Add product using context
      const result = addProduct(productToSave);

      // Handle result
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
          'Error',
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

  // Function to select category
  const handleCategorySelect = (category: string): void => {
    setProductData({ 
      ...productData, 
      category, 
      subCategory: ''
    });
    setCategoryModalVisible(false);
    setCategorySearch('');
  };

  // Function to select sub-category
  const handleSubCategorySelect = (subCategory: string): void => {
    setProductData({ ...productData, subCategory });
    setSubCategoryModalVisible(false);
    setSubCategorySearch('');
  };

  // Function to get filtered sub-categories
  const getCurrentSubCategories = (): string[] => {
    if (!productData.category) return [];
    const categories = subCategories[productData.category] || [];
    
    // Filter by search term
    if (subCategorySearch.trim()) {
      return categories.filter(item =>
        item.toLowerCase().includes(subCategorySearch.toLowerCase())
      );
    }
    
    return categories;
  };

  // Function to remove unit
  const removeUnit = (unit: string): void => {
    const updatedUnits = productData.units.filter(u => u !== unit);
    setProductData({ ...productData, units: updatedUnits });
  };

  // Function to filter categories
  const getFilteredCategories = (): string[] => {
    if (!categorySearch.trim()) return predefinedCategories;
    
    return predefinedCategories.filter(item =>
      item.toLowerCase().includes(categorySearch.toLowerCase())
    );
  };

  // Function to filter units
  const getFilteredUnits = (): string[] => {
    if (!unitSearch.trim()) return predefinedUnits;
    
    return predefinedUnits.filter(item =>
      item.toLowerCase().includes(unitSearch.toLowerCase())
    );
  };

  // Function to close all modals
  const closeAllModals = (): void => {
    setCategoryModalVisible(false);
    setSubCategoryModalVisible(false);
    setUnitsModalVisible(false);
    setCategorySearch('');
    setSubCategorySearch('');
    setUnitSearch('');
    setShowCustomCategoryInput(false);
    setShowCustomSubCategoryInput(false);
    setShowCustomUnitInput(false);
  };

  // Render component
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Product</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Form */}
      <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
        {/* Image Upload */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Product Image (Optional)</Text>
          <TouchableOpacity style={styles.imageUpload} onPress={pickImage}>
            {productData.image ? (
              <View style={styles.imageContainer}>
                <Image 
                  source={{ uri: productData.image }} 
                  style={styles.productImage} 
                  resizeMode="cover"
                />
                <TouchableOpacity 
                  style={styles.removeImageButton}
                  onPress={() => setProductData({ ...productData, image: null })}
                >
                  <Text style={styles.removeImageText}>✕</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.imagePlaceholderText}>+ Add Image</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Product Name */}
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

        {/* Description */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description (Optional)</Text>
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

        {/* Units */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Units *</Text>
          <TouchableOpacity 
            style={styles.input} 
            onPress={() => setUnitsModalVisible(true)}
          >
            <Text style={productData.units.length > 0 ? styles.selectedText : styles.placeholderText}>
              {productData.units.length > 0 
                ? `Selected: ${productData.units.join(', ')}` 
                : 'Select Units'}
            </Text>
          </TouchableOpacity>
          
          {/* Selected Units Display */}
          {productData.units.length > 0 && (
            <View style={styles.selectedUnitsContainer}>
              <Text style={styles.selectedUnitsLabel}>Selected Units:</Text>
              <View style={styles.unitsChips}>
                {productData.units.map((unit, index) => (
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

        {/* Category */}
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

        {/* Sub Category */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Sub Category (Optional)</Text>
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

        {/* Save Button */}
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

        {/* Required Hint */}
        <View style={styles.requiredHint}>
          <Text style={styles.requiredHintText}>
            * Required fields
          </Text>
        </View>
      </ScrollView>

      {/* Units Modal */}
      <Modal
        visible={unitsModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeAllModals}
      >
        <SafeAreaView style={styles.modalOuterContainer}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Units (Multiple)</Text>
              
              {/* Search Input */}
              <View style={styles.modalSearchContainer}>
                <TextInput
                  style={styles.modalSearchInput}
                  placeholder="Search units..."
                  placeholderTextColor="#95a5a6"
                  value={unitSearch}
                  onChangeText={setUnitSearch}
                />
              </View>
              
              {/* Units List */}
              <FlatList
                data={getFilteredUnits()}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <View style={styles.modalItemWithCheckbox}>
                    <Checkbox
                      value={productData.units.includes(item)}
                      onValueChange={() => handleUnitToggle(item)}
                      color={productData.units.includes(item) ? '#27ae60' : undefined}
                    />
                    <Text style={styles.modalItemText}>{item}</Text>
                  </View>
                )}
                ListFooterComponent={() => (
                  <View>
                    {/* Custom Unit Input */}
                    {showCustomUnitInput ? (
                      <View style={styles.customInputContainer}>
                        <TextInput
                          style={styles.customInput}
                          value={productData.customUnit}
                          onChangeText={(text) => setProductData({ ...productData, customUnit: text })}
                          placeholder="Enter custom unit"
                          placeholderTextColor="#95a5a6"
                          autoFocus
                        />
                        <View style={styles.customInputButtons}>
                          <TouchableOpacity 
                            style={styles.customInputButton}
                            onPress={handleAddCustomUnit}
                          >
                            <Text style={styles.customInputButtonText}>Add</Text>
                          </TouchableOpacity>
                          <TouchableOpacity 
                            style={[styles.customInputButton, styles.customInputButtonCancel]}
                            onPress={() => {
                              setShowCustomUnitInput(false);
                              setUnitSearch('');
                            }}
                          >
                            <Text style={styles.customInputButtonText}>Cancel</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={styles.addCustomButton}
                        onPress={() => setShowCustomUnitInput(true)}
                      >
                        <Text style={styles.addCustomButtonText}>+ Add Custom Unit</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              />
              
              {/* Done Button */}
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={closeAllModals}
              >
                <Text style={styles.modalCloseButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Category Modal */}
      <Modal
        visible={categoryModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeAllModals}
      >
        <SafeAreaView style={styles.modalOuterContainer}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Category</Text>
              
              {/* Search Input */}
              <View style={styles.modalSearchContainer}>
                <TextInput
                  style={styles.modalSearchInput}
                  placeholder="Search categories..."
                  placeholderTextColor="#95a5a6"
                  value={categorySearch}
                  onChangeText={setCategorySearch}
                />
              </View>
              
              {/* Categories List */}
              <FlatList
                data={getFilteredCategories()}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => handleCategorySelect(item)}
                  >
                    <Text style={styles.modalItemText}>{item}</Text>
                  </TouchableOpacity>
                )}
                ListFooterComponent={() => (
                  <View>
                    {/* Custom Category Input */}
                    {showCustomCategoryInput ? (
                      <View style={styles.customInputContainer}>
                        <TextInput
                          style={styles.customInput}
                          value={productData.customCategory}
                          onChangeText={(text) => setProductData({ ...productData, customCategory: text })}
                          placeholder="Enter custom category"
                          placeholderTextColor="#95a5a6"
                          autoFocus
                        />
                        <View style={styles.customInputButtons}>
                          <TouchableOpacity 
                            style={styles.customInputButton}
                            onPress={handleAddCustomCategory}
                          >
                            <Text style={styles.customInputButtonText}>Add</Text>
                          </TouchableOpacity>
                          <TouchableOpacity 
                            style={[styles.customInputButton, styles.customInputButtonCancel]}
                            onPress={() => {
                              setShowCustomCategoryInput(false);
                              setCategorySearch('');
                            }}
                          >
                            <Text style={styles.customInputButtonText}>Cancel</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={styles.addCustomButton}
                        onPress={() => setShowCustomCategoryInput(true)}
                      >
                        <Text style={styles.addCustomButtonText}>+ Add Custom Category</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              />
              
              {/* Cancel Button */}
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={closeAllModals}
              >
                <Text style={styles.modalCloseButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Sub Category Modal */}
      <Modal
        visible={subCategoryModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeAllModals}
      >
        <SafeAreaView style={styles.modalOuterContainer}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Sub Category</Text>
              
              {/* Search Input */}
              <View style={styles.modalSearchContainer}>
                <TextInput
                  style={styles.modalSearchInput}
                  placeholder="Search sub-categories..."
                  placeholderTextColor="#95a5a6"
                  value={subCategorySearch}
                  onChangeText={setSubCategorySearch}
                />
              </View>
              
              {/* Sub Categories List */}
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
                ListFooterComponent={() => (
                  <View>
                    {/* Custom Sub-Category Input */}
                    {showCustomSubCategoryInput ? (
                      <View style={styles.customInputContainer}>
                        <TextInput
                          style={styles.customInput}
                          value={productData.customSubCategory}
                          onChangeText={(text) => setProductData({ ...productData, customSubCategory: text })}
                          placeholder="Enter custom sub-category"
                          placeholderTextColor="#95a5a6"
                          autoFocus
                        />
                        <View style={styles.customInputButtons}>
                          <TouchableOpacity 
                            style={styles.customInputButton}
                            onPress={handleAddCustomSubCategory}
                          >
                            <Text style={styles.customInputButtonText}>Add</Text>
                          </TouchableOpacity>
                          <TouchableOpacity 
                            style={[styles.customInputButton, styles.customInputButtonCancel]}
                            onPress={() => {
                              setShowCustomSubCategoryInput(false);
                              setSubCategorySearch('');
                            }}
                          >
                            <Text style={styles.customInputButtonText}>Cancel</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={styles.addCustomButton}
                        onPress={() => setShowCustomSubCategoryInput(true)}
                      >
                        <Text style={styles.addCustomButtonText}>+ Add Custom Sub-Category</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              />
              
              {/* Cancel Button */}
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={closeAllModals}
              >
                <Text style={styles.modalCloseButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

// Styles
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
  imageContainer: {
    position: 'relative',
  },
  productImage: {
    width: 200,
    height: 150,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: '#e74c3c',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeImageText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
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
  selectedUnitsContainer: {
    marginTop: 10,
  },
  selectedUnitsLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 8,
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
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  unitChipText: {
    color: 'white',
    fontSize: 14,
    marginRight: 6,
  },
  removeUnitButton: {
    padding: 2,
  },
  removeUnitText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalOuterContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  modalSearchContainer: {
    marginBottom: 15,
  },
  modalSearchInput: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#2c3e50',
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  modalItemWithCheckbox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
    gap: 12,
  },
  modalItemText: {
    fontSize: 16,
    color: '#2c3e50',
  },
  modalCloseButton: {
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#3498db',
    borderRadius: 8,
  },
  modalCloseButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  customInputContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  customInput: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#3498db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#2c3e50',
    marginBottom: 10,
  },
  customInputButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  customInputButton: {
    flex: 1,
    backgroundColor: '#27ae60',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  customInputButtonCancel: {
    backgroundColor: '#e74c3c',
  },
  customInputButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  addCustomButton: {
    padding: 15,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  addCustomButtonText: {
    color: '#3498db',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddProduct;