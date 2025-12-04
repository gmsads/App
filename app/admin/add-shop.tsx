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
  Platform,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useShop } from './shop-context';

// Define role type
type RoleType = 'SHOPKEEPER' | 'Admin';

// Define file types with labels
type FileType = 'photo' | 'aadhar' | 'pan' | 'shop';

// Define the request body interface to match API
interface ShopkeeperRegistrationRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  gpsCoordinates: string;
  shopName: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  files: string[];
  role: RoleType;
  zoneId: string;
  radius: number;
}

const AddShopkeeperScreen = () => {
  // Initialize router
  const router = useRouter();
  
  // Get addShop function from context
  const { addShop } = useShop();

  // State for form data
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    role: 'SHOPKEEPER' as RoleType,
    
    // Shop Information
    shopName: '',
    address: '',
    city: '',
    state: '',
    country: '',
    zipcode: '',
    
    // Location Information
    gpsCoordinates: '',
    zoneId: '',
    radius: '',
  });

  // State for file uploads
  const [files, setFiles] = useState<{
    photo: string | null;
    aadhar: string | null;
    pan: string | null;
    shop: string | null;
  }>({
    photo: null,
    aadhar: null,
    pan: null,
    shop: null,
  });

  // State for file picker modal
  const [selectedFileType, setSelectedFileType] = useState<FileType | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // State for loading
  const [isLoading, setIsLoading] = useState(false);

  // Function to pick image from gallery
  const pickImage = async (type: FileType) => {
    try {
      // Request permission for media library
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Permission to access camera roll is required!');
        return;
      }

      // Launch image library
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      // If image is selected, update state
      if (!result.canceled) {
        setFiles(prev => ({
          ...prev,
          [type]: result.assets[0].uri
        }));
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  // Function to take photo with camera
  const takePhoto = async (type: FileType) => {
    try {
      // Request camera permission
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Permission to access camera is required!');
        return;
      }

      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      // If photo is taken, update state
      if (!result.canceled) {
        setFiles(prev => ({
          ...prev,
          [type]: result.assets[0].uri
        }));
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  // Function to open file picker modal
  const openFilePicker = (type: FileType) => {
    setSelectedFileType(type);
    setModalVisible(true);
  };

  // Function to handle file action selection
  const handleFileAction = (action: 'gallery' | 'camera') => {
    if (!selectedFileType) return;
    
    setModalVisible(false);
    if (action === 'gallery') {
      pickImage(selectedFileType);
    } else {
      takePhoto(selectedFileType);
    }
  };

  // Function to validate form data
  const validateForm = () => {
    const errors: string[] = [];

    // Define all required fields
    const requiredFields = [
      { field: 'firstName', label: 'First Name' },
      { field: 'lastName', label: 'Last Name' },
      { field: 'email', label: 'Email' },
      { field: 'password', label: 'Password' },
      { field: 'phoneNumber', label: 'Phone Number' },
      { field: 'gpsCoordinates', label: 'GPS Coordinates' },
      { field: 'shopName', label: 'Shop Name' },
      { field: 'address', label: 'Address' },
      { field: 'city', label: 'City' },
      { field: 'state', label: 'State' },
      { field: 'country', label: 'Country' },
      { field: 'zipcode', label: 'Zipcode' },
      { field: 'zoneId', label: 'Zone ID' },
      { field: 'radius', label: 'Radius' },
    ];

    // Check each required field
    requiredFields.forEach(({ field, label }) => {
      if (!formData[field as keyof typeof formData]?.trim()) {
        errors.push(`${label} is required`);
      }
    });

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      errors.push('Please enter a valid email address');
    }

    // Validate phone number (10 digits)
    if (formData.phoneNumber && !/^\d{10}$/.test(formData.phoneNumber)) {
      errors.push('Phone number must be 10 digits');
    }

    // Validate radius is a valid number
    if (formData.radius && isNaN(parseFloat(formData.radius))) {
      errors.push('Radius must be a valid number');
    }

    // Validate all required files are uploaded
    if (!files.photo) errors.push('Shopkeeper photo is required');
    if (!files.aadhar) errors.push('Aadhar card photo is required');
    if (!files.pan) errors.push('PAN card photo is required');
    if (!files.shop) errors.push('Shop photo is required');

    return errors;
  };

  // Function to handle save/register
  const handleSave = async () => {
    // Validate form
    const errors = validateForm();
    
    if (errors.length > 0) {
      Alert.alert('Validation Error', errors.join('\n'));
      return;
    }

    // Set loading state
    setIsLoading(true);

    try {
      // Collect all uploaded file URIs
      const uploadedFiles: string[] = [];
      if (files.photo) uploadedFiles.push(files.photo);
      if (files.aadhar) uploadedFiles.push(files.aadhar);
      if (files.pan) uploadedFiles.push(files.pan);
      if (files.shop) uploadedFiles.push(files.shop);

      // Prepare request body matching API structure exactly
      const requestBody: ShopkeeperRegistrationRequest = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        gpsCoordinates: formData.gpsCoordinates,
        shopName: formData.shopName,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        zipcode: formData.zipcode,
        files: uploadedFiles,
        role: formData.role,
        zoneId: formData.zoneId,
        radius: parseFloat(formData.radius),
      };

      console.log('Sending request to API with body:', JSON.stringify(requestBody, null, 2));

      // Make API call to register shopkeeper
      const response = await fetch('http://localhost:8080/api/admin/registerShopKeeper', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if needed
          // 'Authorization': `Bearer ${yourAuthToken}`,
        },
        body: JSON.stringify(requestBody),
      });

      // Check if response is ok
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        let errorMessage = 'Registration failed';
        
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // If response is not JSON, use the text
          errorMessage = errorText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }

      // Parse successful response
      const result = await response.json();
      console.log('API Success Response:', result);
      
      // Also add to local context if needed (for offline/local state)
      const shopData = {
        name: formData.shopName,
        owner: `${formData.firstName} ${formData.lastName}`.trim(),
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.address,
        phone: formData.phoneNumber,
        email: formData.email,
        password: formData.password,
        status: 'Active' as 'Active' | 'Inactive',
        zoneId: formData.zoneId,
        radius: parseFloat(formData.radius),
        gpsCoordinates: formData.gpsCoordinates,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        zipcode: formData.zipcode,
        role: formData.role,
        files: uploadedFiles,
      };

      // Add shop to local context
      addShop(shopData);
      
      // Show success message
      Alert.alert('Success', 'Shopkeeper registered successfully!');
      
      // Navigate back to previous screen
      router.back();
    } catch (error) {
      console.error('Error registering shopkeeper:', error);
      Alert.alert('Registration Error', error.message || 'Failed to register shopkeeper. Please try again.');
    } finally {
      // Reset loading state
      setIsLoading(false);
    }
  };

  // Function to handle cancel
  const handleCancel = () => {
    router.back();
  };

  // Function to render file upload component
  const renderFileUpload = (type: FileType, label: string) => {
    const fileUri = files[type];
    
    return (
      <TouchableOpacity 
        style={styles.fileUploadContainer}
        onPress={() => openFilePicker(type)}
        disabled={isLoading}
      >
        {fileUri ? (
          <>
            <Image source={{ uri: fileUri }} style={styles.filePreview} />
            <View style={styles.fileOverlay}>
              <Text style={styles.fileOverlayText}>Change</Text>
            </View>
          </>
        ) : (
          <View style={styles.filePlaceholder}>
            <Text style={styles.filePlaceholderIcon}>📷</Text>
            <Text style={styles.filePlaceholderText}>{label}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  // Main component render
  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel} style={styles.backButton} disabled={isLoading}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Register Shopkeeper</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Form ScrollView */}
      <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
        {/* Personal Information Section */}
        <Text style={styles.sectionTitle}>Personal Information</Text>
        
        {/* First and Last Name Row */}
        <View style={styles.row}>
          <View style={[styles.inputGroup, styles.halfInput]}>
            <Text style={styles.label}>First Name *</Text>
            <TextInput
              style={styles.input}
              value={formData.firstName}
              onChangeText={(text) => setFormData({ ...formData, firstName: text })}
              placeholder="Enter first name"
              placeholderTextColor="#999"
              editable={!isLoading}
            />
          </View>

          <View style={[styles.inputGroup, styles.halfInput]}>
            <Text style={styles.label}>Last Name *</Text>
            <TextInput
              style={styles.input}
              value={formData.lastName}
              onChangeText={(text) => setFormData({ ...formData, lastName: text })}
              placeholder="Enter last name"
              placeholderTextColor="#999"
              editable={!isLoading}
            />
          </View>
        </View>

        {/* Email Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email *</Text>
          <TextInput
            style={styles.input}
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            placeholder="Enter email address"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isLoading}
          />
        </View>

        {/* Password Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password *</Text>
          <TextInput
            style={styles.input}
            value={formData.password}
            onChangeText={(text) => setFormData({ ...formData, password: text })}
            placeholder="Enter password"
            placeholderTextColor="#999"
            secureTextEntry
            editable={!isLoading}
          />
        </View>

        {/* Phone Number Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number *</Text>
          <TextInput
            style={styles.input}
            value={formData.phoneNumber}
            onChangeText={(text) => setFormData({ ...formData, phoneNumber: text })}
            placeholder="Enter 10-digit phone number"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
            maxLength={10}
            editable={!isLoading}
          />
        </View>

        {/* Role Selection */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Role *</Text>
          <View style={styles.roleContainer}>
            <TouchableOpacity
              style={[
                styles.roleButton,
                formData.role === 'SHOPKEEPER' && styles.shopkeeperRoleButton
              ]}
              onPress={() => setFormData({ ...formData, role: 'SHOPKEEPER' })}
              disabled={isLoading}
            >
              <Text style={[
                styles.roleButtonText,
                formData.role === 'SHOPKEEPER' && styles.shopkeeperRoleButtonText
              ]}>
                SHOPKEEPER
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.roleButton,
                formData.role === 'Admin' && styles.adminRoleButton
              ]}
              onPress={() => setFormData({ ...formData, role: 'Admin' })}
              disabled={isLoading}
            >
              <Text style={[
                styles.roleButtonText,
                formData.role === 'Admin' && styles.adminRoleButtonText
              ]}>
                Admin
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Shop Information Section */}
        <Text style={styles.sectionTitle}>Shop Information</Text>

        {/* Shop Name Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Shop Name *</Text>
          <TextInput
            style={styles.input}
            value={formData.shopName}
            onChangeText={(text) => setFormData({ ...formData, shopName: text })}
            placeholder="Enter shop name"
            placeholderTextColor="#999"
            editable={!isLoading}
          />
        </View>

        {/* Address Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Address *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.address}
            onChangeText={(text) => setFormData({ ...formData, address: text })}
            placeholder="Enter shop address"
            placeholderTextColor="#999"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            editable={!isLoading}
          />
        </View>

        {/* City and State Row */}
        <View style={styles.row}>
          <View style={[styles.inputGroup, styles.halfInput]}>
            <Text style={styles.label}>City *</Text>
            <TextInput
              style={styles.input}
              value={formData.city}
              onChangeText={(text) => setFormData({ ...formData, city: text })}
              placeholder="Enter city"
              placeholderTextColor="#999"
              editable={!isLoading}
            />
          </View>

          <View style={[styles.inputGroup, styles.halfInput]}>
            <Text style={styles.label}>State *</Text>
            <TextInput
              style={styles.input}
              value={formData.state}
              onChangeText={(text) => setFormData({ ...formData, state: text })}
              placeholder="Enter state"
              placeholderTextColor="#999"
              editable={!isLoading}
            />
          </View>
        </View>

        {/* Country and Zipcode Row */}
        <View style={styles.row}>
          <View style={[styles.inputGroup, styles.halfInput]}>
            <Text style={styles.label}>Country *</Text>
            <TextInput
              style={styles.input}
              value={formData.country}
              onChangeText={(text) => setFormData({ ...formData, country: text })}
              placeholder="Enter country"
              placeholderTextColor="#999"
              editable={!isLoading}
            />
          </View>

          <View style={[styles.inputGroup, styles.halfInput]}>
            <Text style={styles.label}>Zipcode *</Text>
            <TextInput
              style={styles.input}
              value={formData.zipcode}
              onChangeText={(text) => setFormData({ ...formData, zipcode: text })}
              placeholder="Enter zipcode"
              placeholderTextColor="#999"
              keyboardType="number-pad"
              editable={!isLoading}
            />
          </View>
        </View>

        {/* Location Information Section */}
        <Text style={styles.sectionTitle}>Location Information</Text>

        {/* GPS Coordinates Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>GPS Coordinates *</Text>
          <TextInput
            style={styles.input}
            value={formData.gpsCoordinates}
            onChangeText={(text) => setFormData({ ...formData, gpsCoordinates: text })}
            placeholder="e.g., 40.712776,-74.005974"
            placeholderTextColor="#999"
            editable={!isLoading}
          />
        </View>

        {/* Zone ID and Radius Row */}
        <View style={styles.row}>
          <View style={[styles.inputGroup, styles.halfInput]}>
            <Text style={styles.label}>Zone ID *</Text>
            <TextInput
              style={styles.input}
              value={formData.zoneId}
              onChangeText={(text) => setFormData({ ...formData, zoneId: text })}
              placeholder="Enter zone ID"
              placeholderTextColor="#999"
              editable={!isLoading}
            />
          </View>

          <View style={[styles.inputGroup, styles.halfInput]}>
            <Text style={styles.label}>Radius * (in km)</Text>
            <TextInput
              style={styles.input}
              value={formData.radius}
              onChangeText={(text) => setFormData({ ...formData, radius: text })}
              placeholder="e.g., 5"
              placeholderTextColor="#999"
              keyboardType="decimal-pad"
              editable={!isLoading}
            />
          </View>
        </View>

        {/* Document Uploads Section */}
        <Text style={styles.sectionTitle}>Required Documents</Text>
        
        <Text style={styles.fileUploadNote}>
          Upload the following documents (All are mandatory):
        </Text>
        
        {/* File Upload Grid */}
        <View style={styles.fileUploadGrid}>
          {renderFileUpload('photo', 'Shopkeeper Photo')}
          {renderFileUpload('aadhar', 'Aadhar Card')}
          {renderFileUpload('pan', 'PAN Card')}
          {renderFileUpload('shop', 'Shop Photo')}
        </View>

        {/* Required Note */}
        <View style={styles.requiredNote}>
          <Text style={styles.requiredNoteText}>* All fields and documents are mandatory</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.cancelButton, isLoading && styles.disabledButton]} 
            onPress={handleCancel}
            disabled={isLoading}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.saveButton, isLoading && styles.disabledButton]} 
            onPress={handleSave}
            disabled={isLoading}
          >
            <Text style={styles.saveButtonText}>
              {isLoading ? 'Registering...' : 'Register Shopkeeper'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* File Picker Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Upload Document</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => handleFileAction('gallery')}
            >
              <Text style={styles.modalButtonText}>Choose from Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => handleFileAction('camera')}
            >
              <Text style={styles.modalButtonText}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelModalButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelModalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  // Main container
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  
  // Header styles
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
  
  // Back button
  backButton: {
    padding: 8,
  },
  
  // Back button text
  backButtonText: {
    color: '#3498db',
    fontSize: 16,
    fontWeight: '500',
  },
  
  // Header title
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  
  // Placeholder for header alignment
  placeholder: {
    width: 60,
  },
  
  // Form container
  form: {
    flex: 1,
    padding: 20,
  },
  
  // Section title
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 10,
    marginBottom: 15,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  
  // File upload note
  fileUploadNote: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 12,
  },
  
  // Row container for side-by-side inputs
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  
  // Input group container
  inputGroup: {
    marginBottom: 16,
  },
  
  // Half width input
  halfInput: {
    flex: 1,
  },
  
  // Label for inputs
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 6,
  },
  
  // Input field
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
  
  // Text area input
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  
  // Role container
  roleContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  
  // Role button base
  roleButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  
  // Shopkeeper role button active
  shopkeeperRoleButton: {
    backgroundColor: '#3498db',
    borderColor: '#2980b9',
  },
  
  // Admin role button active
  adminRoleButton: {
    backgroundColor: '#9b59b6',
    borderColor: '#8e44ad',
  },
  
  // Role button text base
  roleButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6c757d',
  },
  
  // Shopkeeper role button text active
  shopkeeperRoleButtonText: {
    color: '#fff',
  },
  
  // Admin role button text active
  adminRoleButtonText: {
    color: '#fff',
  },
  
  // File upload grid container
  fileUploadGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  
  // File upload container
  fileUploadContainer: {
    width: '48%',
    aspectRatio: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
    marginBottom: 12,
  },
  
  // File preview image
  filePreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  
  // File overlay for change button
  fileOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 6,
  },
  
  // File overlay text
  fileOverlayText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  
  // File placeholder when no file
  filePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  
  // File placeholder icon
  filePlaceholderIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  
  // File placeholder text
  filePlaceholderText: {
    fontSize: 12,
    color: '#6c757d',
    textAlign: 'center',
  },
  
  // Required note container
  requiredNote: {
    backgroundColor: '#fff8e1',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#ffa000',
  },
  
  // Required note text
  requiredNoteText: {
    fontSize: 12,
    color: '#ff6f00',
    fontWeight: '500',
  },
  
  // Button container
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
    marginBottom: 40,
  },
  
  // Cancel button
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#6c757d',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  
  // Cancel button text
  cancelButtonText: {
    color: '#6c757d',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Save button
  saveButton: {
    flex: 1,
    backgroundColor: '#27ae60',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  
  // Save button text
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Disabled button style
  disabledButton: {
    opacity: 0.6,
  },
  
  // Modal overlay
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  
  // Modal content
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  
  // Modal title
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2c3e50',
  },
  
  // Modal button
  modalButton: {
    width: '100%',
    padding: 15,
    backgroundColor: '#3498db',
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  
  // Modal button text
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Cancel modal button
  cancelModalButton: {
    backgroundColor: '#e0e0e0',
  },
  
  // Cancel modal button text
  cancelModalButtonText: {
    color: '#6c757d',
  },
});

export default AddShopkeeperScreen;