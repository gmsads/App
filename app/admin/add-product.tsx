// AddProduct.tsx (UPDATED WITH unitOptions) - PRICE & QUANTITY REMOVED
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

// Interface for form data - PRICE & QUANTITY REMOVED
interface ProductFormData {
  name: string;
  description: string;
  units: string[];
  unitOptions: string[];
  category: string;
  subCategory: string;
  image: string | null;
  sameDayAvailable: boolean;
  nextDayAvailable: boolean;
  customUnit: string;
  customUnitOption: string;
  customCategory: string;
  customSubCategory: string;
}

const AddProduct = () => {
  const router = useRouter();
  const { addProduct, checkProductExists } = useProductContext();

  const [productData, setProductData] = useState<ProductFormData>({
    name: '',
    description: '',
    units: [],
    unitOptions: [],
    category: '',
    subCategory: '',
    image: null,
    sameDayAvailable: true,
    nextDayAvailable: true,
    customUnit: '',
    customUnitOption: '',
    customCategory: '',
    customSubCategory: '',
  });

  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [subCategoryModalVisible, setSubCategoryModalVisible] = useState(false);
  const [unitsModalVisible, setUnitsModalVisible] = useState(false);
  const [unitOptionsModalVisible, setUnitOptionsModalVisible] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [showCustomCategoryInput, setShowCustomCategoryInput] = useState(false);
  const [showCustomSubCategoryInput, setShowCustomSubCategoryInput] = useState(false);
  const [showCustomUnitInput, setShowCustomUnitInput] = useState(false);
  const [showCustomUnitOptionInput, setShowCustomUnitOptionInput] = useState(false);

  const [categorySearch, setCategorySearch] = useState('');
  const [subCategorySearch, setSubCategorySearch] = useState('');
  const [unitSearch, setUnitSearch] = useState('');
  const [unitOptionSearch, setUnitOptionSearch] = useState('');

  const predefinedCategories: string[] = [
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

  const predefinedUnitOptions: string[] = [
    '750',
    '500',
    '250',
    '200',
    '100',
    '50',
    '1'
  ];

  const pickImage = async (): Promise<void> => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Sorry, we need camera roll permissions to add images!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
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

  const handleUnitToggle = (unit: string): void => {
    const updatedUnits = [...productData.units];
    if (updatedUnits.includes(unit)) {
      const index = updatedUnits.indexOf(unit);
      updatedUnits.splice(index, 1);
    } else {
      updatedUnits.push(unit);
    }
    setProductData({ ...productData, units: updatedUnits });
  };

  const handleUnitOptionToggle = (unitOption: string): void => {
    const updatedUnitOptions = [...productData.unitOptions];
    if (updatedUnitOptions.includes(unitOption)) {
      const index = updatedUnitOptions.indexOf(unitOption);
      updatedUnitOptions.splice(index, 1);
    } else {
      updatedUnitOptions.push(unitOption);
    }
    setProductData({ ...productData, unitOptions: updatedUnitOptions });
  };

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

  const handleAddCustomUnitOption = (): void => {
    if (productData.customUnitOption.trim()) {
      const customUnitOption = productData.customUnitOption.trim();
      if (!productData.unitOptions.includes(customUnitOption)) {
        const updatedUnitOptions = [...productData.unitOptions, customUnitOption];
        setProductData({ 
          ...productData, 
          unitOptions: updatedUnitOptions,
          customUnitOption: '' 
        });
        setShowCustomUnitOptionInput(false);
        setUnitOptionSearch('');
      }
    }
  };

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

  const handleSave = (): void => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);

    try {
      if (!productData.name || !productData.category || productData.units.length === 0) {
        Alert.alert('Error', 'Please fill in all required fields (*)');
        setIsSubmitting(false);
        return;
      }

      const existsCheck = checkProductExists(productData.name, productData.category);
      if (existsCheck.exists) {
        Alert.alert('Product Already Exists', existsCheck.message);
        setIsSubmitting(false);
        return;
      }

      const productToSave = {
        name: productData.name.trim(),
        description: productData.description.trim(),
        category: productData.category,
        subCategory: productData.subCategory || '',
        image: productData.image || '',
        units: productData.units,
        unitOptions: productData.unitOptions.length > 0 ? productData.unitOptions : ['1'],
        sameDayAvailable: productData.sameDayAvailable,
        nextDayAvailable: productData.nextDayAvailable
      };

      const result = addProduct(productToSave);

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

  const handleCategorySelect = (category: string): void => {
    setProductData({ 
      ...productData, 
      category, 
      subCategory: ''
    });
    setCategoryModalVisible(false);
    setCategorySearch('');
  };

  const handleSubCategorySelect = (subCategory: string): void => {
    setProductData({ ...productData, subCategory });
    setSubCategoryModalVisible(false);
    setSubCategorySearch('');
  };

  const getCurrentSubCategories = (): string[] => {
    if (!productData.category) return [];
    const categories = subCategories[productData.category] || [];
    
    if (subCategorySearch.trim()) {
      return categories.filter(item =>
        item.toLowerCase().includes(subCategorySearch.toLowerCase())
      );
    }
    
    return categories;
  };

  const removeUnit = (unit: string): void => {
    const updatedUnits = productData.units.filter(u => u !== unit);
    setProductData({ ...productData, units: updatedUnits });
  };

  const removeUnitOption = (unitOption: string): void => {
    const updatedUnitOptions = productData.unitOptions.filter(u => u !== unitOption);
    setProductData({ ...productData, unitOptions: updatedUnitOptions });
  };

  const getFilteredCategories = (): string[] => {
    if (!categorySearch.trim()) return predefinedCategories;
    
    return predefinedCategories.filter(item =>
      item.toLowerCase().includes(categorySearch.toLowerCase())
    );
  };

  const getFilteredUnits = (): string[] => {
    if (!unitSearch.trim()) return predefinedUnits;
    
    return predefinedUnits.filter(item =>
      item.toLowerCase().includes(unitSearch.toLowerCase())
    );
  };

  const getFilteredUnitOptions = (): string[] => {
    if (!unitOptionSearch.trim()) return predefinedUnitOptions;
    
    return predefinedUnitOptions.filter(item =>
      item.toLowerCase().includes(unitOptionSearch.toLowerCase())
    );
  };

  const closeAllModals = (): void => {
    setCategoryModalVisible(false);
    setSubCategoryModalVisible(false);
    setUnitsModalVisible(false);
    setUnitOptionsModalVisible(false);
    setCategorySearch('');
    setSubCategorySearch('');
    setUnitSearch('');
    setUnitOptionSearch('');
    setShowCustomCategoryInput(false);
    setShowCustomSubCategoryInput(false);
    setShowCustomUnitInput(false);
    setShowCustomUnitOptionInput(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Product</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
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

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Unit Options (Optional)</Text>
          <Text style={styles.subLabel}>e.g., 750ml, 500g, etc.</Text>
          <TouchableOpacity 
            style={styles.input} 
            onPress={() => setUnitOptionsModalVisible(true)}
          >
            <Text style={productData.unitOptions.length > 0 ? styles.selectedText : styles.placeholderText}>
              {productData.unitOptions.length > 0 
                ? `Selected: ${productData.unitOptions.join(', ')}` 
                : 'Select Unit Options'}
            </Text>
          </TouchableOpacity>
          
          {productData.unitOptions.length > 0 && (
            <View style={styles.selectedUnitsContainer}>
              <Text style={styles.selectedUnitsLabel}>Selected Unit Options:</Text>
              <View style={styles.unitsChips}>
                {productData.unitOptions.map((unitOption, index) => (
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

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Delivery Options</Text>
          <View style={styles.checkboxContainer}>
            <View style={styles.checkboxRow}>
              <Checkbox
                value={productData.sameDayAvailable}
                onValueChange={(value) => setProductData({ ...productData, sameDayAvailable: value })}
                color={productData.sameDayAvailable ? '#27ae60' : undefined}
              />
              <Text style={styles.checkboxLabel}>Same Day Delivery Available</Text>
            </View>
            <View style={styles.checkboxRow}>
              <Checkbox
                value={productData.nextDayAvailable}
                onValueChange={(value) => setProductData({ ...productData, nextDayAvailable: value })}
                color={productData.nextDayAvailable ? '#27ae60' : undefined}
              />
              <Text style={styles.checkboxLabel}>Next Day Delivery Available</Text>
            </View>
          </View>
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
        visible={unitsModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeAllModals}
      >
        <SafeAreaView style={styles.modalOuterContainer}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Units (Multiple)</Text>
              
              <View style={styles.modalSearchContainer}>
                <TextInput
                  style={styles.modalSearchInput}
                  placeholder="Search units..."
                  placeholderTextColor="#95a5a6"
                  value={unitSearch}
                  onChangeText={setUnitSearch}
                />
              </View>
              
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

      <Modal
        visible={unitOptionsModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeAllModals}
      >
        <SafeAreaView style={styles.modalOuterContainer}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Unit Options (Multiple)</Text>
              <Text style={styles.modalSubtitle}>e.g., 750, 500, 250, etc.</Text>
              
              <View style={styles.modalSearchContainer}>
                <TextInput
                  style={styles.modalSearchInput}
                  placeholder="Search unit options..."
                  placeholderTextColor="#95a5a6"
                  value={unitOptionSearch}
                  onChangeText={setUnitOptionSearch}
                />
              </View>
              
              <FlatList
                data={getFilteredUnitOptions()}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <View style={styles.modalItemWithCheckbox}>
                    <Checkbox
                      value={productData.unitOptions.includes(item)}
                      onValueChange={() => handleUnitOptionToggle(item)}
                      color={productData.unitOptions.includes(item) ? '#27ae60' : undefined}
                    />
                    <Text style={styles.modalItemText}>{item}</Text>
                  </View>
                )}
                ListFooterComponent={() => (
                  <View>
                    {showCustomUnitOptionInput ? (
                      <View style={styles.customInputContainer}>
                        <TextInput
                          style={styles.customInput}
                          value={productData.customUnitOption}
                          onChangeText={(text) => setProductData({ ...productData, customUnitOption: text })}
                          placeholder="Enter custom unit option (e.g., 300)"
                          placeholderTextColor="#95a5a6"
                          autoFocus
                          keyboardType="numeric"
                        />
                        <View style={styles.customInputButtons}>
                          <TouchableOpacity 
                            style={styles.customInputButton}
                            onPress={handleAddCustomUnitOption}
                          >
                            <Text style={styles.customInputButtonText}>Add</Text>
                          </TouchableOpacity>
                          <TouchableOpacity 
                            style={[styles.customInputButton, styles.customInputButtonCancel]}
                            onPress={() => {
                              setShowCustomUnitOptionInput(false);
                              setUnitOptionSearch('');
                            }}
                          >
                            <Text style={styles.customInputButtonText}>Cancel</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={styles.addCustomButton}
                        onPress={() => setShowCustomUnitOptionInput(true)}
                      >
                        <Text style={styles.addCustomButtonText}>+ Add Custom Unit Option</Text>
                      </TouchableOpacity>
                    )}
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
        </SafeAreaView>
      </Modal>

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
              
              <View style={styles.modalSearchContainer}>
                <TextInput
                  style={styles.modalSearchInput}
                  placeholder="Search categories..."
                  placeholderTextColor="#95a5a6"
                  value={categorySearch}
                  onChangeText={setCategorySearch}
                />
              </View>
              
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
              
              <View style={styles.modalSearchContainer}>
                <TextInput
                  style={styles.modalSearchInput}
                  placeholder="Search sub-categories..."
                  placeholderTextColor="#95a5a6"
                  value={subCategorySearch}
                  onChangeText={setSubCategorySearch}
                />
              </View>
              
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
  subLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 8,
    fontStyle: 'italic',
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
    marginBottom: 10,
    textAlign: 'center',
    color: '#2c3e50',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 15,
    textAlign: 'center',
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
  checkboxContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 16,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#2c3e50',
  },
});

export default AddProduct;