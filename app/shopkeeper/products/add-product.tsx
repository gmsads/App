// app/shopkeeper/products/add-product.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Switch,
  ActivityIndicator,
  FlatList,
  Modal,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';

interface QuantityOption {
  quantity: string;
  unit: string;
  salePrice: string;
  actualPrice: string;
  discountPercentage: number;
  available: boolean;
}

interface Product {
  id: string;
  name: string;
  category: string;
  baseUnit: string;
}

interface ProductForm {
  shopId: string;
  productId: string;
  name: string;
  sameDayAvailable: 'Available' | 'Out of Stock' | 'Disabled';
  nextDayAvailable: 'Available' | 'Out of Stock' | 'Disabled';
  sameDayOptions: QuantityOption[];
  nextDayOptions: QuantityOption[];
}

// Mock product data - replace with your actual API call
const MOCK_PRODUCTS: Product[] = [
  { id: 'P001', name: 'Fresh Tomatoes', category: 'Vegetables', baseUnit: 'kg' },
  { id: 'P002', name: 'Apples', category: 'Fruits', baseUnit: 'kg' },
  { id: 'P003', name: 'Milk', category: 'Dairy', baseUnit: 'litre' },
  { id: 'P004', name: 'Rice', category: 'Grains', baseUnit: 'kg' },
  { id: 'P005', name: 'Onions', category: 'Vegetables', baseUnit: 'kg' },
  { id: 'P006', name: 'Bananas', category: 'Fruits', baseUnit: 'dozen' },
  { id: 'P007', name: 'Bread', category: 'Bakery', baseUnit: 'pack' },
  { id: 'P008', name: 'Eggs', category: 'Dairy', baseUnit: 'dozen' },
  { id: 'P009', name: 'Potatoes', category: 'Vegetables', baseUnit: 'kg' },
  { id: 'P010', name: 'Oranges', category: 'Fruits', baseUnit: 'kg' },
];

const AddProduct: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // State for product search modal
  const [showProductSearch, setShowProductSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(MOCK_PRODUCTS);

  // Get shopId from your auth/store
  const shopId = 'S987'; // Replace with actual shop ID from your auth system

  const [formData, setFormData] = useState<ProductForm>({
    shopId: shopId,
    productId: '',
    name: '',
    sameDayAvailable: 'Available',
    nextDayAvailable: 'Available',
    sameDayOptions: [
      {
        quantity: '',
        unit: 'kg',
        salePrice: '',
        actualPrice: '',
        discountPercentage: 0,
        available: true,
      },
    ],
    nextDayOptions: [
      {
        quantity: '',
        unit: 'kg',
        salePrice: '',
        actualPrice: '',
        discountPercentage: 0,
        available: true,
      },
    ],
  });

  // Initialize from params if available
  useEffect(() => {
    if (params.productId && params.productName) {
      const product = MOCK_PRODUCTS.find(p => p.id === params.productId);
      if (product) {
        setSelectedProduct(product);
        setFormData(prev => ({
          ...prev,
          productId: product.id,
          name: product.name,
          sameDayOptions: prev.sameDayOptions.map(opt => ({
            ...opt,
            unit: product.baseUnit,
          })),
          nextDayOptions: prev.nextDayOptions.map(opt => ({
            ...opt,
            unit: product.baseUnit,
          })),
        }));
      }
    }
  }, [params]);

  // Filter products based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProducts(MOCK_PRODUCTS);
    } else {
      const filtered = MOCK_PRODUCTS.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery]);

  const availabilityOptions = [
    { value: 'Available', label: 'Available', color: '#4CAF50' },
    { value: 'Out of Stock', label: 'Out of Stock', color: '#FF9800' },
    { value: 'Disabled', label: 'Disabled', color: '#F44336' },
  ];

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setFormData(prev => ({
      ...prev,
      productId: product.id,
      name: product.name,
      sameDayOptions: prev.sameDayOptions.map(opt => ({
        ...opt,
        unit: product.baseUnit,
      })),
      nextDayOptions: prev.nextDayOptions.map(opt => ({
        ...opt,
        unit: product.baseUnit,
      })),
    }));
    setShowProductSearch(false);
    setSearchQuery('');
  };

  const handleAddQuantityOption = (type: 'sameDay' | 'nextDay') => {
    const currentUnit = selectedProduct?.baseUnit || 'kg';
    
    if (type === 'sameDay') {
      setFormData(prev => ({
        ...prev,
        sameDayOptions: [
          ...prev.sameDayOptions,
          {
            quantity: '',
            unit: currentUnit,
            salePrice: '',
            actualPrice: '',
            discountPercentage: 0,
            available: true,
          },
        ],
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        nextDayOptions: [
          ...prev.nextDayOptions,
          {
            quantity: '',
            unit: currentUnit,
            salePrice: '',
            actualPrice: '',
            discountPercentage: 0,
            available: true,
          },
        ],
      }));
    }
  };

  const handleRemoveQuantityOption = (type: 'sameDay' | 'nextDay', index: number) => {
    if (type === 'sameDay') {
      if (formData.sameDayOptions.length === 1) {
        Alert.alert('Cannot remove', 'At least one quantity option is required.');
        return;
      }
      setFormData(prev => ({
        ...prev,
        sameDayOptions: prev.sameDayOptions.filter((_, i) => i !== index),
      }));
    } else {
      if (formData.nextDayOptions.length === 1) {
        Alert.alert('Cannot remove', 'At least one quantity option is required.');
        return;
      }
      setFormData(prev => ({
        ...prev,
        nextDayOptions: prev.nextDayOptions.filter((_, i) => i !== index),
      }));
    }
  };

  const handleQuantityOptionChange = (
    type: 'sameDay' | 'nextDay',
    index: number,
    field: keyof QuantityOption,
    value: any
  ) => {
    if (type === 'sameDay') {
      const updatedOptions = [...formData.sameDayOptions];
      updatedOptions[index] = {
        ...updatedOptions[index],
        [field]: value,
      };

      // Calculate discount if salePrice or actualPrice changes
      if (field === 'salePrice' || field === 'actualPrice') {
        const salePrice = field === 'salePrice' ? value : updatedOptions[index].salePrice;
        const actualPrice = field === 'actualPrice' ? value : updatedOptions[index].actualPrice;
        const sale = parseFloat(salePrice);
        const actual = parseFloat(actualPrice);
        if (sale && actual && actual > sale) {
          updatedOptions[index].discountPercentage = Math.round(((actual - sale) / actual) * 100);
        } else {
          updatedOptions[index].discountPercentage = 0;
        }
      }

      setFormData(prev => ({ ...prev, sameDayOptions: updatedOptions }));
    } else {
      const updatedOptions = [...formData.nextDayOptions];
      updatedOptions[index] = {
        ...updatedOptions[index],
        [field]: value,
      };

      // Calculate discount if salePrice or actualPrice changes
      if (field === 'salePrice' || field === 'actualPrice') {
        const salePrice = field === 'salePrice' ? value : updatedOptions[index].salePrice;
        const actualPrice = field === 'actualPrice' ? value : updatedOptions[index].actualPrice;
        const sale = parseFloat(salePrice);
        const actual = parseFloat(actualPrice);
        if (sale && actual && actual > sale) {
          updatedOptions[index].discountPercentage = Math.round(((actual - sale) / actual) * 100);
        } else {
          updatedOptions[index].discountPercentage = 0;
        }
      }

      setFormData(prev => ({ ...prev, nextDayOptions: updatedOptions }));
    }
  };

  const validateForm = () => {
    if (!selectedProduct) {
      Alert.alert('Validation Error', 'Please select a product.');
      return false;
    }

    // Validate same day options
    for (const option of formData.sameDayOptions) {
      if (!option.quantity || !option.salePrice || !option.actualPrice) {
        Alert.alert('Validation Error', 'Please fill all required fields in Same Day options.');
        return false;
      }
    }

    // Validate next day options
    for (const option of formData.nextDayOptions) {
      if (!option.quantity || !option.salePrice || !option.actualPrice) {
        Alert.alert('Validation Error', 'Please fill all required fields in Next Day options.');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    try {
      // Prepare data according to your JSON structure
      const submitData = {
        productId: formData.productId,
        name: formData.name,
        shopId: formData.shopId,
        sameDayAvailable: formData.sameDayAvailable,
        nextDayAvailable: formData.nextDayAvailable,
        quantityOptions: {
          sameDay: formData.sameDayOptions.map(opt => ({
            quantity: parseInt(opt.quantity),
            unit: opt.unit,
            SalePrice: parseInt(opt.salePrice),
            ActualPrice: parseInt(opt.actualPrice),
            DiscountPercentage: opt.discountPercentage,
            Available: opt.available,
          })),
          nextDay: formData.nextDayOptions.map(opt => ({
            quantity: parseInt(opt.quantity),
            unit: opt.unit,
            SalePrice: parseInt(opt.salePrice),
            ActualPrice: parseInt(opt.actualPrice),
            DiscountPercentage: opt.discountPercentage,
            Available: opt.available,
          })),
        },
      };

      console.log('Submitting:', submitData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      Alert.alert(
        'Success',
        'Product added successfully!',
        [
          {
            text: 'OK',
            onPress: () => router.push('/shopkeeper/products/product-list'),
          },
        ]
      );
    } catch (error) {
      console.error('Error adding product:', error);
      Alert.alert('Error', 'Failed to add product. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading product details...</Text>
      </View>
    );
  }

  const renderProductItem = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={[
        styles.productItem,
        selectedProduct?.id === item.id && styles.productItemSelected
      ]}
      onPress={() => handleProductSelect(item)}
    >
      <View style={styles.productItemContent}>
        <View>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productCategory}>{item.category}</Text>
        </View>
        <View style={styles.productDetails}>
          <Text style={styles.productUnit}>Unit: {item.baseUnit}</Text>
          <Text style={styles.productId}>ID: {item.id}</Text>
        </View>
      </View>
      {selectedProduct?.id === item.id && (
        <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Product Details</Text>
      </View>

      {/* Product Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Product</Text>
        
        <TouchableOpacity
          style={styles.productSelector}
          onPress={() => setShowProductSearch(true)}
        >
          <View style={styles.productSelectorContent}>
            <Ionicons name="search" size={20} color="#666" />
            <Text style={[
              styles.productSelectorText,
              !selectedProduct && styles.productSelectorPlaceholder
            ]}>
              {selectedProduct ? selectedProduct.name : 'Search and select a product...'}
            </Text>
          </View>
          <Feather name="chevron-down" size={20} color="#666" />
        </TouchableOpacity>

        {/* Hidden Product ID and Shop ID */}
        <View style={styles.hiddenInfo}>
          <Text style={styles.hiddenLabel}>Product ID: {formData.productId || 'Not selected'}</Text>
          <Text style={styles.hiddenLabel}>Shop ID: {formData.shopId}</Text>
        </View>

        {selectedProduct && (
          <View style={styles.selectedProductInfo}>
            <View style={styles.selectedProductRow}>
              <Text style={styles.selectedProductLabel}>Product:</Text>
              <Text style={styles.selectedProductValue}>{selectedProduct.name}</Text>
            </View>
            <View style={styles.selectedProductRow}>
              <Text style={styles.selectedProductLabel}>Category:</Text>
              <Text style={styles.selectedProductValue}>{selectedProduct.category}</Text>
            </View>
            <View style={styles.selectedProductRow}>
              <Text style={styles.selectedProductLabel}>Base Unit:</Text>
              <Text style={styles.selectedProductValue}>{selectedProduct.baseUnit}</Text>
            </View>
          </View>
        )}
      </View>

      {/* Product Search Modal */}
      <Modal
        visible={showProductSearch}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowProductSearch(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Product</Text>
              <TouchableOpacity onPress={() => setShowProductSearch(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search products..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
              />
              {searchQuery ? (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={20} color="#999" />
                </TouchableOpacity>
              ) : null}
            </View>

            {/* Product List */}
            <FlatList
              data={filteredProducts}
              renderItem={renderProductItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyList}>
                  <MaterialIcons name="inventory" size={48} color="#ddd" />
                  <Text style={styles.emptyListText}>No products found</Text>
                  <Text style={styles.emptyListSubtext}>Try a different search term</Text>
                </View>
              }
            />
          </View>
        </View>
      </Modal>

      {/* Availability Options */}
      {selectedProduct && (
        <>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Availability Settings</Text>
            
            <View style={styles.availabilitySection}>
              <Text style={styles.subSectionTitle}>Same Day Delivery</Text>
              <View style={styles.availabilityButtons}>
                {availabilityOptions.map(option => (
                  <TouchableOpacity
                    key={`same-${option.value}`}
                    style={[
                      styles.availabilityButton,
                      formData.sameDayAvailable === option.value && {
                        backgroundColor: option.color + '20',
                        borderColor: option.color,
                      },
                    ]}
                    onPress={() => setFormData(prev => ({ 
                      ...prev, 
                      sameDayAvailable: option.value as any 
                    }))}
                  >
                    <View style={[styles.availabilityDot, { backgroundColor: option.color }]} />
                    <Text style={[
                      styles.availabilityButtonText,
                      formData.sameDayAvailable === option.value && {
                        color: option.color,
                        fontWeight: '600',
                      },
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.availabilitySection}>
              <Text style={styles.subSectionTitle}>Next Day Delivery</Text>
              <View style={styles.availabilityButtons}>
                {availabilityOptions.map(option => (
                  <TouchableOpacity
                    key={`next-${option.value}`}
                    style={[
                      styles.availabilityButton,
                      formData.nextDayAvailable === option.value && {
                        backgroundColor: option.color + '20',
                        borderColor: option.color,
                      },
                    ]}
                    onPress={() => setFormData(prev => ({ 
                      ...prev, 
                      nextDayAvailable: option.value as any 
                    }))}
                  >
                    <View style={[styles.availabilityDot, { backgroundColor: option.color }]} />
                    <Text style={[
                      styles.availabilityButtonText,
                      formData.nextDayAvailable === option.value && {
                        color: option.color,
                        fontWeight: '600',
                      },
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Same Day Quantity Options */}
          {formData.sameDayAvailable !== 'Disabled' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Same Day Quantity Options</Text>
              
              {formData.sameDayOptions.map((option, index) => (
                <View key={`same-${index}`} style={styles.quantityCard}>
                  <View style={styles.quantityHeader}>
                    <Text style={styles.quantityTitle}>Option {index + 1}</Text>
                    {formData.sameDayOptions.length > 1 && (
                      <TouchableOpacity
                        onPress={() => handleRemoveQuantityOption('sameDay', index)}
                      >
                        <MaterialIcons name="delete" size={24} color="#f44336" />
                      </TouchableOpacity>
                    )}
                  </View>

                  <View style={styles.quantityForm}>
                    <View style={styles.formRow}>
                      <View style={styles.formGroup}>
                        <Text style={styles.label}>Quantity *</Text>
                        <TextInput
                          style={styles.input}
                          value={option.quantity}
                          onChangeText={(value) => 
                            handleQuantityOptionChange('sameDay', index, 'quantity', value)
                          }
                          keyboardType="numeric"
                          placeholder="e.g., 1"
                        />
                      </View>
                      
                      <View style={styles.formGroup}>
                        <Text style={styles.label}>Unit</Text>
                        <TextInput
                          style={styles.input}
                          value={option.unit}
                          editable={false}
                        />
                      </View>
                    </View>

                    <View style={styles.formRow}>
                      <View style={styles.formGroup}>
                        <Text style={styles.label}>Actual Price (₹) *</Text>
                        <TextInput
                          style={styles.input}
                          value={option.actualPrice}
                          onChangeText={(value) => 
                            handleQuantityOptionChange('sameDay', index, 'actualPrice', value)
                          }
                          keyboardType="numeric"
                          placeholder="Original price"
                        />
                      </View>
                      
                      <View style={styles.formGroup}>
                        <Text style={styles.label}>Sale Price (₹) *</Text>
                        <TextInput
                          style={styles.input}
                          value={option.salePrice}
                          onChangeText={(value) => 
                            handleQuantityOptionChange('sameDay', index, 'salePrice', value)
                          }
                          keyboardType="numeric"
                          placeholder="Discounted price"
                        />
                      </View>
                    </View>

                    <View style={styles.discountRow}>
                      <Text style={styles.label}>Discount:</Text>
                      <Text style={styles.discountText}>
                        {option.discountPercentage}% off
                      </Text>
                    </View>

                    <View style={styles.availableToggle}>
                      <Text style={styles.label}>Available</Text>
                      <Switch
                        value={option.available}
                        onValueChange={(value) => 
                          handleQuantityOptionChange('sameDay', index, 'available', value)
                        }
                        trackColor={{ false: '#ddd', true: '#4CAF50' }}
                      />
                    </View>
                  </View>
                </View>
              ))}

              <TouchableOpacity
                style={styles.addButton}
                onPress={() => handleAddQuantityOption('sameDay')}
              >
                <Ionicons name="add-circle" size={24} color="#4CAF50" />
                <Text style={styles.addButtonText}>Add Same Day Option</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Next Day Quantity Options */}
          {formData.nextDayAvailable !== 'Disabled' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Next Day Quantity Options</Text>
              
              {formData.nextDayOptions.map((option, index) => (
                <View key={`next-${index}`} style={styles.quantityCard}>
                  <View style={styles.quantityHeader}>
                    <Text style={styles.quantityTitle}>Option {index + 1}</Text>
                    {formData.nextDayOptions.length > 1 && (
                      <TouchableOpacity
                        onPress={() => handleRemoveQuantityOption('nextDay', index)}
                      >
                        <MaterialIcons name="delete" size={24} color="#f44336" />
                      </TouchableOpacity>
                    )}
                  </View>

                  <View style={styles.quantityForm}>
                    <View style={styles.formRow}>
                      <View style={styles.formGroup}>
                        <Text style={styles.label}>Quantity *</Text>
                        <TextInput
                          style={styles.input}
                          value={option.quantity}
                          onChangeText={(value) => 
                            handleQuantityOptionChange('nextDay', index, 'quantity', value)
                          }
                          keyboardType="numeric"
                          placeholder="e.g., 5"
                        />
                      </View>
                      
                      <View style={styles.formGroup}>
                        <Text style={styles.label}>Unit</Text>
                        <TextInput
                          style={styles.input}
                          value={option.unit}
                          editable={false}
                        />
                      </View>
                    </View>

                    <View style={styles.formRow}>
                      <View style={styles.formGroup}>
                        <Text style={styles.label}>Actual Price (₹) *</Text>
                        <TextInput
                          style={styles.input}
                          value={option.actualPrice}
                          onChangeText={(value) => 
                            handleQuantityOptionChange('nextDay', index, 'actualPrice', value)
                          }
                          keyboardType="numeric"
                          placeholder="Original price"
                        />
                      </View>
                      
                      <View style={styles.formGroup}>
                        <Text style={styles.label}>Sale Price (₹) *</Text>
                        <TextInput
                          style={styles.input}
                          value={option.salePrice}
                          onChangeText={(value) => 
                            handleQuantityOptionChange('nextDay', index, 'salePrice', value)
                          }
                          keyboardType="numeric"
                          placeholder="Discounted price"
                        />
                      </View>
                    </View>

                    <View style={styles.discountRow}>
                      <Text style={styles.label}>Discount:</Text>
                      <Text style={styles.discountText}>
                        {option.discountPercentage}% off
                      </Text>
                    </View>

                    <View style={styles.availableToggle}>
                      <Text style={styles.label}>Available</Text>
                      <Switch
                        value={option.available}
                        onValueChange={(value) => 
                          handleQuantityOptionChange('nextDay', index, 'available', value)
                        }
                        trackColor={{ false: '#ddd', true: '#4CAF50' }}
                      />
                    </View>
                  </View>
                </View>
              ))}

              <TouchableOpacity
                style={styles.addButton}
                onPress={() => handleAddQuantityOption('nextDay')}
              >
                <Ionicons name="add-circle" size={24} color="#4CAF50" />
                <Text style={styles.addButtonText}>Add Next Day Option</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, saving && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={24} color="#fff" />
                <Text style={styles.submitButtonText}>Add Product</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Help Text */}
          <View style={styles.helpSection}>
            <Ionicons name="information-circle" size={20} color="#666" />
            <Text style={styles.helpText}>
              • Add different quantity options with pricing for same day and next day delivery{'\n'}
              • Discount percentage is automatically calculated{'\n'}
              • You can disable entire delivery type if not offering it
            </Text>
          </View>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 12,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    margin: 16,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  productSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  productSelectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  productSelectorText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
  },
  productSelectorPlaceholder: {
    color: '#999',
  },
  hiddenInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
  },
  hiddenLabel: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
  selectedProductInfo: {
    backgroundColor: '#e8f5e9',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  selectedProductRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  selectedProductLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2e7d32',
    width: 100,
  },
  selectedProductValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingBottom: 20,
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    marginHorizontal: 20,
    marginVertical: 12,
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
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  productItemSelected: {
    backgroundColor: '#e8f5e9',
  },
  productItemContent: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 14,
    color: '#666',
    backgroundColor: '#f0f0f0',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  productDetails: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 12,
  },
  productUnit: {
    fontSize: 12,
    color: '#4CAF50',
  },
  productId: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'monospace',
  },
  emptyList: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyListText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#999',
    marginTop: 16,
  },
  emptyListSubtext: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 4,
  },
  availabilitySection: {
    marginBottom: 20,
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  availabilityButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  availabilityButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    gap: 8,
  },
  availabilityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  availabilityButtonText: {
    fontSize: 14,
    color: '#666',
  },
  quantityCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  quantityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  quantityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  quantityForm: {
    gap: 12,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
  },
  formGroup: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#333',
  },
  discountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#e8f5e9',
    padding: 12,
    borderRadius: 6,
  },
  discountText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  availableToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 6,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderStyle: 'dashed',
    gap: 8,
  },
  addButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    margin: 16,
    borderRadius: 12,
    gap: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#81c784',
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  helpSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#e8f5e9',
    padding: 16,
    margin: 16,
    marginTop: 0,
    borderRadius: 8,
    gap: 8,
  },
  helpText: {
    flex: 1,
    fontSize: 14,
    color: '#2e7d32',
    lineHeight: 20,
  },
});

export default AddProduct;