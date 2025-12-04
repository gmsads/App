import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import {
  MaterialIcons,
  Ionicons,
  FontAwesome5,
} from '@expo/vector-icons';

interface QuantityType {
  type: string;
  value: number;
  unit: 'pcs' | 'g' | 'kg' | 'bunch' | 'dozen';
  sameDayPrice: string;
  nextDayPrice: string;
  sameDayAvailable: boolean;
  nextDayAvailable: boolean;
  sameAsNextDay: boolean;
}

interface ProductForm {
  name: string;
  description: string;
  category: string;
  image: string | null;
  quantityTypes: QuantityType[];
  sameDayDelivery: boolean;
  nextDayDelivery: boolean;
  status: 'pending' | 'approved';
}

const AddProduct: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<ProductForm>({
    name: '',
    description: '',
    category: 'vegetables',
    image: null,
    quantityTypes: [
      {
        type: 'Small Pack',
        value: 250,
        unit: 'g',
        sameDayPrice: '',
        nextDayPrice: '',
        sameDayAvailable: true,
        nextDayAvailable: true,
        sameAsNextDay: false,
      },
    ],
    sameDayDelivery: true,
    nextDayDelivery: true,
    status: 'pending',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = [
    { value: 'vegetables', label: 'Vegetables' },
    { value: 'fruits', label: 'Fruits' },
    { value: 'dairy', label: 'Dairy' },
    { value: 'groceries', label: 'Groceries' },
    { value: 'beverages', label: 'Beverages' },
    { value: 'snacks', label: 'Snacks' },
  ];

  const units = [
    { value: 'pcs', label: 'Pieces' },
    { value: 'g', label: 'Grams' },
    { value: 'kg', label: 'Kilograms' },
    { value: 'bunch', label: 'Bunch' },
    { value: 'dozen', label: 'Dozen' },
  ];

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Please allow access to your photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setFormData(prev => ({ ...prev, image: result.assets[0].uri }));
    }
  };

  const handleAddQuantityType = () => {
    setFormData(prev => ({
      ...prev,
      quantityTypes: [
        ...prev.quantityTypes,
        {
          type: '',
          value: 1,
          unit: 'kg',
          sameDayPrice: '',
          nextDayPrice: '',
          sameDayAvailable: true,
          nextDayAvailable: true,
          sameAsNextDay: false,
        },
      ],
    }));
  };

  const handleRemoveQuantityType = (index: number) => {
    if (formData.quantityTypes.length === 1) {
      Alert.alert('Cannot remove', 'At least one quantity type is required.');
      return;
    }

    setFormData(prev => ({
      ...prev,
      quantityTypes: prev.quantityTypes.filter((_, i) => i !== index),
    }));
  };

  const handleQuantityTypeChange = (index: number, field: keyof QuantityType, value: any) => {
    const updatedTypes = [...formData.quantityTypes];
    
    if (field === 'sameAsNextDay' && value === true) {
      // If setting same as next day, copy next day values to same day
      updatedTypes[index] = {
        ...updatedTypes[index],
        [field]: value,
        sameDayPrice: updatedTypes[index].nextDayPrice,
        sameDayAvailable: updatedTypes[index].nextDayAvailable,
      };
    } else {
      updatedTypes[index] = {
        ...updatedTypes[index],
        [field]: value,
      };
      
      // If sameAsNextDay is true and nextDayPrice changes, update sameDayPrice too
      if (field === 'nextDayPrice' && updatedTypes[index].sameAsNextDay) {
        updatedTypes[index].sameDayPrice = value;
      }
      if (field === 'nextDayAvailable' && updatedTypes[index].sameAsNextDay) {
        updatedTypes[index].sameDayAvailable = value;
      }
    }
    
    setFormData(prev => ({ ...prev, quantityTypes: updatedTypes }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    // Validate quantity types
    formData.quantityTypes.forEach((type, index) => {
      if (!type.type.trim()) {
        newErrors[`quantityType_${index}`] = 'Quantity type name is required';
      }
      if (!type.sameDayPrice) {
        newErrors[`sameDayPrice_${index}`] = 'Same day price is required';
      }
      if (!type.nextDayPrice) {
        newErrors[`nextDayPrice_${index}`] = 'Next day price is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fill all required fields correctly.');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert(
        'Success',
        'Product added successfully! It will be visible after admin approval.',
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
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Product</Text>
      </View>

      {/* Product Image */}
      <TouchableOpacity
        style={styles.imagePicker}
        onPress={pickImage}
      >
        {formData.image ? (
          <Image source={{ uri: formData.image }} style={styles.imagePreview} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <MaterialIcons name="add-photo-alternate" size={48} color="#ccc" />
            <Text style={styles.imagePlaceholderText}>Add Product Image</Text>
            <Text style={styles.imagePlaceholderSubtext}>Tap to select</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Basic Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Basic Information</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Product Name *</Text>
          <TextInput
            style={[styles.input, errors.name && styles.inputError]}
            placeholder="Enter product name"
            value={formData.name}
            onChangeText={(value) => {
              setFormData(prev => ({ ...prev, name: value }));
              if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
            }}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.textArea, errors.description && styles.inputError]}
            placeholder="Enter product description"
            value={formData.description}
            onChangeText={(value) => {
              setFormData(prev => ({ ...prev, description: value }));
              if (errors.description) setErrors(prev => ({ ...prev, description: '' }));
            }}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          {errors.description && (
            <Text style={styles.errorText}>{errors.description}</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Category</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryContainer}
          >
            {categories.map(category => (
              <TouchableOpacity
                key={category.value}
                style={[
                  styles.categoryButton,
                  formData.category === category.value && styles.categoryButtonActive,
                ]}
                onPress={() => setFormData(prev => ({ ...prev, category: category.value }))}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    formData.category === category.value && styles.categoryButtonTextActive,
                  ]}
                >
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Delivery Options */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Delivery Options</Text>
          <View style={styles.deliveryOptions}>
            <TouchableOpacity
              style={[
                styles.deliveryOption,
                formData.sameDayDelivery && styles.deliveryOptionActive,
              ]}
              onPress={() => setFormData(prev => ({ 
                ...prev, 
                sameDayDelivery: !prev.sameDayDelivery 
              }))}
            >
              <MaterialIcons 
                name="today" 
                size={20} 
                color={formData.sameDayDelivery ? '#4CAF50' : '#666'} 
              />
              <Text style={[
                styles.deliveryOptionText,
                formData.sameDayDelivery && styles.deliveryOptionTextActive,
              ]}>
                Same Day
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.deliveryOption,
                formData.nextDayDelivery && styles.deliveryOptionActive,
              ]}
              onPress={() => setFormData(prev => ({ 
                ...prev, 
                nextDayDelivery: !prev.nextDayDelivery 
              }))}
            >
              <MaterialIcons 
                name="date-range" 
                size={20} 
                color={formData.nextDayDelivery ? '#4CAF50' : '#666'} 
              />
              <Text style={[
                styles.deliveryOptionText,
                formData.nextDayDelivery && styles.deliveryOptionTextActive,
              ]}>
                Next Day
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Quantity Types & Pricing */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quantity Types & Pricing</Text>
        <Text style={styles.sectionDescription}>
          Add different quantity options with pricing
        </Text>

        {formData.quantityTypes.map((type, index) => (
          <View key={index} style={styles.quantityTypeCard}>
            <View style={styles.quantityTypeHeader}>
              <Text style={styles.quantityTypeTitle}>
                Quantity Type {index + 1}
              </Text>
              {formData.quantityTypes.length > 1 && (
                <TouchableOpacity
                  onPress={() => handleRemoveQuantityType(index)}
                >
                  <MaterialIcons name="delete" size={24} color="#f44336" />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.quantityTypeForm}>
              {/* Quantity Type Name */}
              <View style={styles.formRow}>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Type Name *</Text>
                  <TextInput
                    style={[
                      styles.input,
                      errors[`quantityType_${index}`] && styles.inputError,
                    ]}
                    placeholder="e.g., Small Pack, Large Pack"
                    value={type.type}
                    onChangeText={(value) =>
                      handleQuantityTypeChange(index, 'type', value)
                    }
                  />
                  {errors[`quantityType_${index}`] && (
                    <Text style={styles.errorText}>
                      {errors[`quantityType_${index}`]}
                    </Text>
                  )}
                </View>
              </View>

              {/* Quantity and Unit */}
              <View style={styles.formRow}>
                <View style={[styles.formGroup, styles.quantityGroup]}>
                  <Text style={styles.label}>Quantity</Text>
                  <TextInput
                    style={styles.input}
                    value={type.value.toString()}
                    onChangeText={(value) =>
                      handleQuantityTypeChange(index, 'value', parseFloat(value) || 0)
                    }
                    keyboardType="numeric"
                    placeholder="e.g., 250"
                  />
                </View>

                <View style={[styles.formGroup, styles.unitGroup]}>
                  <Text style={styles.label}>Unit</Text>
                  <View style={styles.unitPicker}>
                    {units.map(unit => (
                      <TouchableOpacity
                        key={unit.value}
                        style={[
                          styles.unitButton,
                          type.unit === unit.value && styles.unitButtonActive,
                        ]}
                        onPress={() =>
                          handleQuantityTypeChange(index, 'unit', unit.value)
                        }
                      >
                        <Text
                          style={[
                            styles.unitButtonText,
                            type.unit === unit.value && styles.unitButtonTextActive,
                          ]}
                        >
                          {unit.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>

              {/* Pricing */}
              <View style={styles.pricingSection}>
                <Text style={styles.pricingTitle}>Pricing</Text>
                
                <View style={styles.sameAsNextDayToggle}>
                  <Text style={styles.toggleLabel}>Same as Next Day</Text>
                  <Switch
                    value={type.sameAsNextDay}
                    onValueChange={(value) =>
                      handleQuantityTypeChange(index, 'sameAsNextDay', value)
                    }
                    trackColor={{ false: '#ddd', true: '#4CAF50' }}
                  />
                </View>

                <View style={styles.pricingRow}>
                  <View style={styles.priceInput}>
                    <Text style={styles.label}>Same Day Price (₹) *</Text>
                    <TextInput
                      style={[
                        styles.input,
                        errors[`sameDayPrice_${index}`] && styles.inputError,
                        type.sameAsNextDay && styles.inputDisabled,
                      ]}
                      value={type.sameDayPrice}
                      onChangeText={(value) =>
                        handleQuantityTypeChange(index, 'sameDayPrice', value)
                      }
                      keyboardType="numeric"
                      placeholder="Enter price"
                      editable={!type.sameAsNextDay}
                    />
                    {errors[`sameDayPrice_${index}`] && (
                      <Text style={styles.errorText}>
                        {errors[`sameDayPrice_${index}`]}
                      </Text>
                    )}
                  </View>

                  <View style={styles.priceInput}>
                    <Text style={styles.label}>Next Day Price (₹) *</Text>
                    <TextInput
                      style={[
                        styles.input,
                        errors[`nextDayPrice_${index}`] && styles.inputError,
                      ]}
                      value={type.nextDayPrice}
                      onChangeText={(value) =>
                        handleQuantityTypeChange(index, 'nextDayPrice', value)
                      }
                      keyboardType="numeric"
                      placeholder="Enter price"
                    />
                    {errors[`nextDayPrice_${index}`] && (
                      <Text style={styles.errorText}>
                        {errors[`nextDayPrice_${index}`]}
                      </Text>
                    )}
                  </View>
                </View>

                {/* Availability */}
                <View style={styles.availabilityRow}>
                  <View style={styles.availabilityToggle}>
                    <Text style={styles.label}>Same Day Available</Text>
                    <Switch
                      value={type.sameDayAvailable}
                      onValueChange={(value) =>
                        handleQuantityTypeChange(index, 'sameDayAvailable', value)
                      }
                      trackColor={{ false: '#ddd', true: '#4CAF50' }}
                      disabled={type.sameAsNextDay}
                    />
                  </View>

                  <View style={styles.availabilityToggle}>
                    <Text style={styles.label}>Next Day Available</Text>
                    <Switch
                      value={type.nextDayAvailable}
                      onValueChange={(value) =>
                        handleQuantityTypeChange(index, 'nextDayAvailable', value)
                      }
                      trackColor={{ false: '#ddd', true: '#4CAF50' }}
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>
        ))}

        <TouchableOpacity
          style={styles.addQuantityButton}
          onPress={handleAddQuantityType}
        >
          <Ionicons name="add-circle" size={24} color="#4CAF50" />
          <Text style={styles.addQuantityText}>Add Another Quantity Type</Text>
        </TouchableOpacity>
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.submitButton, loading && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <Ionicons name="refresh" size={24} color="#fff" />
        ) : (
          <>
            <MaterialIcons name="add-circle" size={24} color="#fff" />
            <Text style={styles.submitButtonText}>Add Product for Approval</Text>
          </>
        )}
      </TouchableOpacity>

      {/* Help Text */}
      <View style={styles.helpSection}>
        <MaterialIcons name="info" size={20} color="#666" />
        <Text style={styles.helpText}>
          • Products require admin approval before appearing in the store{'\n'}
          • Make sure all information is accurate before submission{'\n'}
          • You can edit products after approval from "My List"
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  imagePicker: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  imagePreview: {
    width: '100%',
    height: 200,
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  imagePlaceholderText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
  },
  imagePlaceholderSubtext: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    margin: 16,
    marginTop: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333',
  },
  inputError: {
    borderColor: '#f44336',
    backgroundColor: '#fff5f5',
  },
  textArea: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333',
    minHeight: 100,
  },
  errorText: {
    color: '#f44336',
    fontSize: 12,
    marginTop: 4,
  },
  categoryContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  categoryButton: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  categoryButtonActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#666',
  },
  categoryButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  deliveryOptions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  deliveryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    gap: 8,
  },
  deliveryOptionActive: {
    backgroundColor: '#e8f5e9',
    borderColor: '#4CAF50',
  },
  deliveryOptionText: {
    fontSize: 14,
    color: '#666',
  },
  deliveryOptionTextActive: {
    color: '#2e7d32',
    fontWeight: '600',
  },
  quantityTypeCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  quantityTypeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  quantityTypeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  quantityTypeForm: {
    gap: 12,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
  },
  formGroup: {
    flex: 1,
  },
  quantityGroup: {
    flex: 1,
  },
  unitGroup: {
    flex: 2,
  },
  unitPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  unitButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  unitButtonActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  unitButtonText: {
    fontSize: 12,
    color: '#666',
  },
  unitButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  pricingSection: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  pricingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  sameAsNextDayToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  pricingRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  priceInput: {
    flex: 1,
  },
  inputDisabled: {
    backgroundColor: '#eee',
    color: '#999',
  },
  availabilityRow: {
    flexDirection: 'row',
    gap: 16,
  },
  availabilityToggle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
  },
  addQuantityButton: {
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
  addQuantityText: {
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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