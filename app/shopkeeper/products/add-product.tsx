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
  availableQuantities: Array<{
    value: string;
    label: string;
  }>;
  availableUnits: Array<{
    value: string;
    label: string;
  }>;
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

// Predefined units and quantities
const ALL_UNITS = [
  { value: 'kg', label: 'Kg' },
  { value: 'g', label: 'Gms' },
  { value: 'kgs', label: 'Kgs' },
  { value: 'dozen', label: 'dozen' },
  { value: 'pieces', label: 'pieces' },
  { value: 'piece', label: 'piece' },
  { value: 'bunch', label: 'bunch' },
  { value: 'bunches', label: 'bunches' },
  { value: 'litre', label: 'litre' },
  { value: 'ml', label: 'ml' },
  { value: 'pack', label: 'pack' },
  { value: 'packs', label: 'packs' },
  { value: 'bottle', label: 'bottle' },
  { value: 'bottles', label: 'bottles' },
  { value: 'box', label: 'box' },
  { value: 'boxes', label: 'boxes' },
  { value: 'packet', label: 'packet' },
  { value: 'packets', label: 'packets' },
];

const ALL_QUANTITIES = [
  { value: '1', label: '1' },
  { value: '50', label: '50' },
  { value: '100', label: '100' },
  { value: '200', label: '200' },
  { value: '250', label: '250' },
  { value: '500', label: '500' },
  { value: '750', label: '750' },
  { value: '1000', label: '1000' },
  { value: '1500', label: '1500' },
  { value: '2000', label: '2000' },
  { value: '2500', label: '2500' },
  { value: '5000', label: '5000' },
  { value: '10000', label: '10000' },
];

// Get appropriate quantities based on product type
const getQuantitiesForProduct = (product: Product) => {
  if (product.category === 'Fruits' || product.category === 'Vegetables') {
    return [
      { value: '250', label: '250g' },
      { value: '500', label: '500g' },
      { value: '1000', label: '1kg' },
      { value: '2000', label: '2kg' },
      { value: '5000', label: '5kg' },
    ];
  } else if (product.category === 'Dairy') {
    if (product.name.toLowerCase().includes('milk')) {
      return [
        { value: '500', label: '500ml' },
        { value: '1000', label: '1 litre' },
        { value: '2000', label: '2 litre' },
      ];
    } else if (product.name.toLowerCase().includes('egg')) {
      return [
        { value: '1', label: '1 piece' },
        { value: '4', label: '4 pieces' },
        { value: '6', label: '6 pieces' },
        { value: '12', label: '1 dozen' },
      ];
    }
  } else if (product.category === 'Grains') {
    return [
      { value: '500', label: '500g' },
      { value: '1000', label: '1kg' },
      { value: '2000', label: '2kg' },
      { value: '5000', label: '5kg' },
      { value: '10000', label: '10kg' },
    ];
  } else if (product.category === 'Bakery') {
    return [
      { value: '1', label: '1 pack' },
      { value: '2', label: '2 packs' },
      { value: '4', label: '4 packs' },
    ];
  }
  
  // Default quantities
  return ALL_QUANTITIES.map(q => ({
    value: q.value,
    label: q.label
  }));
};

// Get appropriate units based on product type
const getUnitsForProduct = (product: Product) => {
  if (product.category === 'Fruits' || product.category === 'Vegetables') {
    return [
      { value: 'g', label: 'Gms' },
      { value: 'kg', label: 'Kg' },
      { value: 'kgs', label: 'Kgs' },
      { value: 'bunch', label: 'bunch' },
      { value: 'bunches', label: 'bunches' },
      { value: 'piece', label: 'piece' },
      { value: 'pieces', label: 'pieces' },
    ];
  } else if (product.category === 'Dairy') {
    if (product.name.toLowerCase().includes('milk')) {
      return [
        { value: 'ml', label: 'ml' },
        { value: 'litre', label: 'litre' },
        { value: 'pack', label: 'pack' },
      ];
    } else if (product.name.toLowerCase().includes('egg')) {
      return [
        { value: 'piece', label: 'piece' },
        { value: 'pieces', label: 'pieces' },
        { value: 'dozen', label: 'dozen' },
      ];
    }
  } else if (product.category === 'Grains') {
    return [
      { value: 'g', label: 'Gms' },
      { value: 'kg', label: 'Kg' },
      { value: 'kgs', label: 'Kgs' },
      { value: 'packet', label: 'packet' },
    ];
  } else if (product.category === 'Bakery') {
    return [
      { value: 'pack', label: 'pack' },
      { value: 'packs', label: 'packs' },
      { value: 'piece', label: 'piece' },
      { value: 'pieces', label: 'pieces' },
    ];
  }
  
  // Default units
  return ALL_UNITS;
};

// Mock product data
const MOCK_PRODUCTS: Product[] = [
  { 
    id: 'P001', 
    name: 'Fresh Tomatoes', 
    category: 'Vegetables', 
    baseUnit: 'kg',
    availableQuantities: [],
    availableUnits: []
  },
  { 
    id: 'P002', 
    name: 'Apples', 
    category: 'Fruits', 
    baseUnit: 'kg',
    availableQuantities: [],
    availableUnits: []
  },
  { 
    id: 'P003', 
    name: 'Milk', 
    category: 'Dairy', 
    baseUnit: 'litre',
    availableQuantities: [],
    availableUnits: []
  },
  { 
    id: 'P004', 
    name: 'Rice', 
    category: 'Grains', 
    baseUnit: 'kg',
    availableQuantities: [],
    availableUnits: []
  },
  { 
    id: 'P005', 
    name: 'Onions', 
    category: 'Vegetables', 
    baseUnit: 'kg',
    availableQuantities: [],
    availableUnits: []
  },
  { 
    id: 'P006', 
    name: 'Bananas', 
    category: 'Fruits', 
    baseUnit: 'dozen',
    availableQuantities: [],
    availableUnits: []
  },
  { 
    id: 'P007', 
    name: 'Bread', 
    category: 'Bakery', 
    baseUnit: 'pack',
    availableQuantities: [],
    availableUnits: []
  },
  { 
    id: 'P008', 
    name: 'Eggs', 
    category: 'Dairy', 
    baseUnit: 'dozen',
    availableQuantities: [],
    availableUnits: []
  },
  { 
    id: 'P009', 
    name: 'Potatoes', 
    category: 'Vegetables', 
    baseUnit: 'kg',
    availableQuantities: [],
    availableUnits: []
  },
  { 
    id: 'P010', 
    name: 'Oranges', 
    category: 'Fruits', 
    baseUnit: 'kg',
    availableQuantities: [],
    availableUnits: []
  },
  { 
    id: 'P011', 
    name: 'Coriander Leaves', 
    category: 'Vegetables', 
    baseUnit: 'bunch',
    availableQuantities: [],
    availableUnits: []
  },
  { 
    id: 'P012', 
    name: 'Grapes', 
    category: 'Fruits', 
    baseUnit: 'kg',
    availableQuantities: [],
    availableUnits: []
  },
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

  // State for quantity and unit selection modals
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [showUnitModal, setShowUnitModal] = useState(false);
  const [currentEditing, setCurrentEditing] = useState<{
    type: 'sameDay' | 'nextDay';
    index: number;
    field: 'quantity' | 'unit';
  } | null>(null);

  // State for custom quantity input
  const [customQuantity, setCustomQuantity] = useState('');

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
        unit: '',
        salePrice: '',
        actualPrice: '',
        discountPercentage: 0,
        available: true,
      },
    ],
    nextDayOptions: [
      {
        quantity: '',
        unit: '',
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
        handleProductSelect(product);
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
    // Generate quantities and units based on product type
    const quantities = getQuantitiesForProduct(product);
    const units = getUnitsForProduct(product);
    
    const updatedProduct = {
      ...product,
      availableQuantities: quantities,
      availableUnits: units
    };
    
    setSelectedProduct(updatedProduct);
    setFormData(prev => ({
      ...prev,
      productId: product.id,
      name: product.name,
      sameDayOptions: prev.sameDayOptions.map(opt => ({
        ...opt,
        quantity: quantities[0]?.value || '',
        unit: product.baseUnit,
      })),
      nextDayOptions: prev.nextDayOptions.map(opt => ({
        ...opt,
        quantity: quantities[0]?.value || '',
        unit: product.baseUnit,
      })),
    }));
    setShowProductSearch(false);
    setSearchQuery('');
  };

  const handleAddQuantityOption = (type: 'sameDay' | 'nextDay') => {
    const defaultUnit = selectedProduct?.baseUnit || '';
    const defaultQuantity = selectedProduct?.availableQuantities[0]?.value || '';
    
    if (type === 'sameDay') {
      setFormData(prev => ({
        ...prev,
        sameDayOptions: [
          ...prev.sameDayOptions,
          {
            quantity: defaultQuantity,
            unit: defaultUnit,
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
            quantity: defaultQuantity,
            unit: defaultUnit,
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

  const openQuantityModal = (type: 'sameDay' | 'nextDay', index: number) => {
    setCurrentEditing({ type, index, field: 'quantity' });
    setCustomQuantity('');
    setShowQuantityModal(true);
  };

  const openUnitModal = (type: 'sameDay' | 'nextDay', index: number) => {
    setCurrentEditing({ type, index, field: 'unit' });
    setShowUnitModal(true);
  };

  const handleQuantitySelect = (quantity: string) => {
    if (currentEditing) {
      handleQuantityOptionChange(
        currentEditing.type,
        currentEditing.index,
        'quantity',
        quantity
      );
      setShowQuantityModal(false);
    }
  };

  const handleCustomQuantitySubmit = () => {
    if (customQuantity.trim() && currentEditing) {
      handleQuantitySelect(customQuantity);
    }
  };

  const handleUnitSelect = (unit: string) => {
    if (currentEditing) {
      handleQuantityOptionChange(
        currentEditing.type,
        currentEditing.index,
        'unit',
        unit
      );
      setShowUnitModal(false);
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

  const getQuantityLabel = (quantityValue: string) => {
    if (!selectedProduct || !quantityValue) return 'Select quantity';
    
    // Check if it's a predefined quantity
    const quantity = selectedProduct.availableQuantities.find(q => q.value === quantityValue);
    if (quantity) return quantity.label;
    
    // Check if it's in ALL_QUANTITIES
    const allQuantity = ALL_QUANTITIES.find(q => q.value === quantityValue);
    if (allQuantity) return allQuantity.label;
    
    // Custom quantity
    const unit = formData.sameDayOptions.find(opt => opt.quantity === quantityValue)?.unit || 
                 formData.nextDayOptions.find(opt => opt.quantity === quantityValue)?.unit;
    
    if (unit) {
      // Convert to appropriate label based on unit
      const numValue = parseInt(quantityValue);
      if (unit === 'g' || unit === 'ml') {
        return `${quantityValue}${unit}`;
      } else if (unit === 'kg' || unit === 'kgs' || unit === 'litre') {
        if (numValue >= 1000) {
          return `${numValue / 1000} ${unit}`;
        }
        return `${quantityValue}g`;
      }
    }
    
    return quantityValue;
  };

  const getUnitLabel = (unitValue: string) => {
    if (!unitValue) return 'Select unit';
    
    const unit = ALL_UNITS.find(u => u.value === unitValue);
    return unit ? unit.label : unitValue;
  };

  const validateForm = () => {
    if (!selectedProduct) {
      Alert.alert('Validation Error', 'Please select a product.');
      return false;
    }

    // Validate same day options
    for (const option of formData.sameDayOptions) {
      if (!option.quantity || !option.unit || !option.salePrice || !option.actualPrice) {
        Alert.alert('Validation Error', 'Please fill all required fields in Same Day options.');
        return false;
      }
    }

    // Validate next day options
    for (const option of formData.nextDayOptions) {
      if (!option.quantity || !option.unit || !option.salePrice || !option.actualPrice) {
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

  const renderQuantityItem = ({ item }: { item: { value: string; label: string } }) => (
    <TouchableOpacity
      style={styles.optionItem}
      onPress={() => handleQuantitySelect(item.value)}
    >
      <Text style={styles.optionItemText}>{item.label}</Text>
    </TouchableOpacity>
  );

  const renderUnitItem = ({ item }: { item: { value: string; label: string } }) => (
    <TouchableOpacity
      style={styles.optionItem}
      onPress={() => handleUnitSelect(item.value)}
    >
      <Text style={styles.optionItemText}>{item.label}</Text>
    </TouchableOpacity>
  );

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
          <Text style={styles.productUnit}>Base: {item.baseUnit}</Text>
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
              <Text style={styles.selectedProductValue}>{getUnitLabel(selectedProduct.baseUnit)}</Text>
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

      {/* Quantity Selection Modal */}
      <Modal
        visible={showQuantityModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowQuantityModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Quantity</Text>
              <TouchableOpacity onPress={() => setShowQuantityModal(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            {/* Custom Quantity Input */}
            <View style={styles.customQuantitySection}>
              <Text style={styles.customQuantityLabel}>Custom Quantity:</Text>
              <View style={styles.customQuantityInputContainer}>
                <TextInput
                  style={styles.customQuantityInput}
                  placeholder="Enter custom quantity"
                  value={customQuantity}
                  onChangeText={setCustomQuantity}
                  keyboardType="numeric"
                />
                <TouchableOpacity
                  style={[
                    styles.customQuantityButton,
                    !customQuantity.trim() && styles.customQuantityButtonDisabled
                  ]}
                  onPress={handleCustomQuantitySubmit}
                  disabled={!customQuantity.trim()}
                >
                  <Text style={styles.customQuantityButtonText}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Common Quantities */}
            <Text style={styles.subSectionTitle}>Common Quantities</Text>
            <FlatList
              data={selectedProduct?.availableQuantities || ALL_QUANTITIES}
              renderItem={renderQuantityItem}
              keyExtractor={(item) => item.value}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyList}>
                  <MaterialIcons name="scale" size={48} color="#ddd" />
                  <Text style={styles.emptyListText}>No quantities available</Text>
                </View>
              }
            />
          </View>
        </View>
      </Modal>

      {/* Unit Selection Modal */}
      <Modal
        visible={showUnitModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowUnitModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Unit</Text>
              <TouchableOpacity onPress={() => setShowUnitModal(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={selectedProduct?.availableUnits || ALL_UNITS}
              renderItem={renderUnitItem}
              keyExtractor={(item) => item.value}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyList}>
                  <MaterialIcons name="straighten" size={48} color="#ddd" />
                  <Text style={styles.emptyListText}>No units available</Text>
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
                        <TouchableOpacity
                          style={styles.selectButton}
                          onPress={() => openQuantityModal('sameDay', index)}
                        >
                          <Text style={[
                            styles.selectButtonText,
                            !option.quantity && styles.placeholderText
                          ]}>
                            {getQuantityLabel(option.quantity)}
                          </Text>
                          <Feather name="chevron-down" size={20} color="#666" />
                        </TouchableOpacity>
                      </View>
                      
                      <View style={styles.formGroup}>
                        <Text style={styles.label}>Unit *</Text>
                        <TouchableOpacity
                          style={styles.selectButton}
                          onPress={() => openUnitModal('sameDay', index)}
                        >
                          <Text style={[
                            styles.selectButtonText,
                            !option.unit && styles.placeholderText
                          ]}>
                            {getUnitLabel(option.unit)}
                          </Text>
                          <Feather name="chevron-down" size={20} color="#666" />
                        </TouchableOpacity>
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
                        <TouchableOpacity
                          style={styles.selectButton}
                          onPress={() => openQuantityModal('nextDay', index)}
                        >
                          <Text style={[
                            styles.selectButtonText,
                            !option.quantity && styles.placeholderText
                          ]}>
                            {getQuantityLabel(option.quantity)}
                          </Text>
                          <Feather name="chevron-down" size={20} color="#666" />
                        </TouchableOpacity>
                      </View>
                      
                      <View style={styles.formGroup}>
                        <Text style={styles.label}>Unit *</Text>
                        <TouchableOpacity
                          style={styles.selectButton}
                          onPress={() => openUnitModal('nextDay', index)}
                        >
                          <Text style={[
                            styles.selectButtonText,
                            !option.unit && styles.placeholderText
                          ]}>
                            {getUnitLabel(option.unit)}
                          </Text>
                          <Feather name="chevron-down" size={20} color="#666" />
                        </TouchableOpacity>
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
              • Select from predefined quantities or enter custom quantity{'\n'}
              • Choose appropriate unit for the product{'\n'}
              • Add multiple quantity options with different pricing{'\n'}
              • Discount percentage is automatically calculated
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
    marginHorizontal: 20,
    marginTop: 16,
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
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  selectButtonText: {
    fontSize: 14,
    color: '#333',
  },
  placeholderText: {
    color: '#999',
  },
  optionItem: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionItemText: {
    fontSize: 16,
    color: '#333',
  },
  customQuantitySection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  customQuantityLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  customQuantityInputContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  customQuantityInput: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  customQuantityButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  customQuantityButtonDisabled: {
    backgroundColor: '#81c784',
    opacity: 0.6,
  },
  customQuantityButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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