import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  Modal,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useShop } from './shop-context';

// Define role type
type RoleType = 'SHOPKEEPER' | 'Admin';

const EditShopScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { updateShop } = useShop();
  
  const shopId = params.id as string;
  const shopParam = params.shop as string;
  
  const [shopData, setShopData] = useState({
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
    
    // Status
    status: 'Active' as 'Active' | 'Inactive',
  });

  useEffect(() => {
    if (shopParam) {
      try {
        const parsedShop = JSON.parse(shopParam);
        
        // Split owner name into first and last name
        const ownerParts = parsedShop.owner?.split(' ') || [];
        const firstName = ownerParts[0] || '';
        const lastName = ownerParts.slice(1).join(' ') || '';
        
        setShopData({
          firstName: parsedShop.firstName || firstName,
          lastName: parsedShop.lastName || lastName,
          email: parsedShop.email || '',
          password: parsedShop.password || '',
          phoneNumber: parsedShop.phone || '',
          role: parsedShop.role || 'SHOPKEEPER',
          
          shopName: parsedShop.name || '',
          address: parsedShop.address || '',
          city: parsedShop.city || '',
          state: parsedShop.state || '',
          country: parsedShop.country || '',
          zipcode: parsedShop.zipcode || '',
          
          gpsCoordinates: parsedShop.gpsCoordinates || '',
          zoneId: parsedShop.zoneId || '',
          radius: parsedShop.radius?.toString() || '',
          
          status: parsedShop.status || 'Active',
        });
      } catch (error) {
        console.error('Error parsing shop data:', error);
        Alert.alert('Error', 'Failed to load shop data');
      }
    }
  }, [shopParam]);

  const handleSave = () => {
    // Validate required fields
    const errors: string[] = [];
    
    const requiredFields = [
      { field: 'firstName', label: 'First Name' },
      { field: 'lastName', label: 'Last Name' },
      { field: 'email', label: 'Email' },
      { field: 'phoneNumber', label: 'Phone Number' },
      { field: 'shopName', label: 'Shop Name' },
      { field: 'address', label: 'Address' },
      { field: 'city', label: 'City' },
      { field: 'state', label: 'State' },
      { field: 'country', label: 'Country' },
      { field: 'zipcode', label: 'Zipcode' },
      { field: 'gpsCoordinates', label: 'GPS Coordinates' },
      { field: 'zoneId', label: 'Zone ID' },
      { field: 'radius', label: 'Radius' },
    ];

    requiredFields.forEach(({ field, label }) => {
      if (!shopData[field as keyof typeof shopData]?.trim()) {
        errors.push(`${label} is required`);
      }
    });

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (shopData.email && !emailRegex.test(shopData.email)) {
      errors.push('Please enter a valid email address');
    }

    // Validate phone number (10 digits)
    if (shopData.phoneNumber && !/^\d{10}$/.test(shopData.phoneNumber)) {
      errors.push('Phone number must be 10 digits');
    }

    // Validate radius is a valid number
    if (shopData.radius && isNaN(parseFloat(shopData.radius))) {
      errors.push('Radius must be a valid number');
    }

    if (errors.length > 0) {
      Alert.alert('Validation Error', errors.join('\n'));
      return;
    }

    // Prepare data for updateShop
    const updatedData = {
      firstName: shopData.firstName,
      lastName: shopData.lastName,
      name: shopData.shopName,
      owner: `${shopData.firstName} ${shopData.lastName}`.trim(),
      address: shopData.address,
      phone: shopData.phoneNumber,
      email: shopData.email,
      password: shopData.password,
      status: shopData.status,
      zoneId: shopData.zoneId,
      radius: parseFloat(shopData.radius),
      gpsCoordinates: shopData.gpsCoordinates,
      city: shopData.city,
      state: shopData.state,
      country: shopData.country,
      zipcode: shopData.zipcode,
      role: shopData.role,
    };

    updateShop(shopId, updatedData);
    Alert.alert('Success', 'Shop updated successfully');
    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Shop</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
        {/* Read-only Shop ID Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shop Identification</Text>
          <View style={styles.readOnlyContainer}>
            <Text style={styles.readOnlyLabel}>Shop ID</Text>
            <View style={styles.readOnlyValueContainer}>
              <Text style={styles.readOnlyValue}>{shopId}</Text>
              <Text style={styles.readOnlyNote}>(Read Only)</Text>
            </View>
          </View>
        </View>

        {/* Personal Information Section */}
        <Text style={styles.sectionTitle}>Personal Information</Text>
        
        {/* First and Last Name Row */}
        <View style={styles.row}>
          <View style={[styles.inputGroup, styles.halfInput]}>
            <Text style={styles.label}>First Name *</Text>
            <TextInput
              style={styles.input}
              value={shopData.firstName}
              onChangeText={(text) => setShopData({ ...shopData, firstName: text })}
              placeholder="Enter first name"
              placeholderTextColor="#999"
            />
          </View>

          <View style={[styles.inputGroup, styles.halfInput]}>
            <Text style={styles.label}>Last Name *</Text>
            <TextInput
              style={styles.input}
              value={shopData.lastName}
              onChangeText={(text) => setShopData({ ...shopData, lastName: text })}
              placeholder="Enter last name"
              placeholderTextColor="#999"
            />
          </View>
        </View>

        {/* Email Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email *</Text>
          <TextInput
            style={styles.input}
            value={shopData.email}
            onChangeText={(text) => setShopData({ ...shopData, email: text })}
            placeholder="Enter email address"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* Password Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={shopData.password}
            onChangeText={(text) => setShopData({ ...shopData, password: text })}
            placeholder="Enter new password (leave blank to keep current)"
            placeholderTextColor="#999"
            secureTextEntry
          />
        </View>

        {/* Phone Number Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number *</Text>
          <TextInput
            style={styles.input}
            value={shopData.phoneNumber}
            onChangeText={(text) => setShopData({ ...shopData, phoneNumber: text })}
            placeholder="Enter 10-digit phone number"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
            maxLength={10}
          />
        </View>

        {/* Role Selection */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Role *</Text>
          <View style={styles.roleContainer}>
            <TouchableOpacity
              style={[
                styles.roleButton,
                shopData.role === 'SHOPKEEPER' && styles.shopkeeperRoleButton
              ]}
              onPress={() => setShopData({ ...shopData, role: 'SHOPKEEPER' })}
            >
              <Text style={[
                styles.roleButtonText,
                shopData.role === 'SHOPKEEPER' && styles.shopkeeperRoleButtonText
              ]}>
                SHOPKEEPER
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.roleButton,
                shopData.role === 'Admin' && styles.adminRoleButton
              ]}
              onPress={() => setShopData({ ...shopData, role: 'Admin' })}
            >
              <Text style={[
                styles.roleButtonText,
                shopData.role === 'Admin' && styles.adminRoleButtonText
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
            value={shopData.shopName}
            onChangeText={(text) => setShopData({ ...shopData, shopName: text })}
            placeholder="Enter shop name"
            placeholderTextColor="#999"
          />
        </View>

        {/* Address Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Address *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={shopData.address}
            onChangeText={(text) => setShopData({ ...shopData, address: text })}
            placeholder="Enter shop address"
            placeholderTextColor="#999"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        {/* City and State Row */}
        <View style={styles.row}>
          <View style={[styles.inputGroup, styles.halfInput]}>
            <Text style={styles.label}>City *</Text>
            <TextInput
              style={styles.input}
              value={shopData.city}
              onChangeText={(text) => setShopData({ ...shopData, city: text })}
              placeholder="Enter city"
              placeholderTextColor="#999"
            />
          </View>

          <View style={[styles.inputGroup, styles.halfInput]}>
            <Text style={styles.label}>State *</Text>
            <TextInput
              style={styles.input}
              value={shopData.state}
              onChangeText={(text) => setShopData({ ...shopData, state: text })}
              placeholder="Enter state"
              placeholderTextColor="#999"
            />
          </View>
        </View>

        {/* Country and Zipcode Row */}
        <View style={styles.row}>
          <View style={[styles.inputGroup, styles.halfInput]}>
            <Text style={styles.label}>Country *</Text>
            <TextInput
              style={styles.input}
              value={shopData.country}
              onChangeText={(text) => setShopData({ ...shopData, country: text })}
              placeholder="Enter country"
              placeholderTextColor="#999"
            />
          </View>

          <View style={[styles.inputGroup, styles.halfInput]}>
            <Text style={styles.label}>Zipcode *</Text>
            <TextInput
              style={styles.input}
              value={shopData.zipcode}
              onChangeText={(text) => setShopData({ ...shopData, zipcode: text })}
              placeholder="Enter zipcode"
              placeholderTextColor="#999"
              keyboardType="number-pad"
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
            value={shopData.gpsCoordinates}
            onChangeText={(text) => setShopData({ ...shopData, gpsCoordinates: text })}
            placeholder="e.g., 40.712776,-74.005974"
            placeholderTextColor="#999"
          />
        </View>

        {/* Zone ID and Radius Row */}
        <View style={styles.row}>
          <View style={[styles.inputGroup, styles.halfInput]}>
            <Text style={styles.label}>Zone ID *</Text>
            <TextInput
              style={styles.input}
              value={shopData.zoneId}
              onChangeText={(text) => setShopData({ ...shopData, zoneId: text })}
              placeholder="Enter zone ID"
              placeholderTextColor="#999"
            />
          </View>

          <View style={[styles.inputGroup, styles.halfInput]}>
            <Text style={styles.label}>Radius * (in km)</Text>
            <TextInput
              style={styles.input}
              value={shopData.radius}
              onChangeText={(text) => setShopData({ ...shopData, radius: text })}
              placeholder="e.g., 5"
              placeholderTextColor="#999"
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        {/* Status Selection */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Status</Text>
          <View style={styles.statusContainer}>
            <TouchableOpacity
              style={[
                styles.statusButton,
                shopData.status === 'Active' && styles.activeStatusButton
              ]}
              onPress={() => setShopData({ ...shopData, status: 'Active' })}
            >
              <Text style={[
                styles.statusButtonText,
                shopData.status === 'Active' && styles.activeStatusButtonText
              ]}>
                Active
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.statusButton,
                shopData.status === 'Inactive' && styles.inactiveStatusButton
              ]}
              onPress={() => setShopData({ ...shopData, status: 'Inactive' })}
            >
              <Text style={[
                styles.statusButtonText,
                shopData.status === 'Inactive' && styles.inactiveStatusButtonText
              ]}>
                Inactive
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Required Note */}
        <View style={styles.requiredNote}>
          <Text style={styles.requiredNoteText}>* All fields are required except password</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
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
  
  section: {
    marginBottom: 20,
  },
  
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
  
  readOnlyContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  
  readOnlyLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7f8c8d',
    marginBottom: 4,
  },
  
  readOnlyValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  readOnlyValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  
  readOnlyNote: {
    fontSize: 12,
    color: '#95a5a6',
    fontStyle: 'italic',
  },
  
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  
  inputGroup: {
    marginBottom: 16,
  },
  
  halfInput: {
    flex: 1,
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
  
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  
  roleContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  
  roleButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  
  shopkeeperRoleButton: {
    backgroundColor: '#3498db',
    borderColor: '#2980b9',
  },
  
  adminRoleButton: {
    backgroundColor: '#9b59b6',
    borderColor: '#8e44ad',
  },
  
  roleButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6c757d',
  },
  
  shopkeeperRoleButtonText: {
    color: '#fff',
  },
  
  adminRoleButtonText: {
    color: '#fff',
  },
  
  statusContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  
  statusButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  
  activeStatusButton: {
    backgroundColor: '#d4edda',
    borderColor: '#c3e6cb',
  },
  
  inactiveStatusButton: {
    backgroundColor: '#f8d7da',
    borderColor: '#f5c6cb',
  },
  
  statusButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6c757d',
  },
  
  activeStatusButtonText: {
    color: '#155724',
  },
  
  inactiveStatusButtonText: {
    color: '#721c24',
  },
  
  requiredNote: {
    backgroundColor: '#fff8e1',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#ffa000',
  },
  
  requiredNoteText: {
    fontSize: 12,
    color: '#ff6f00',
    fontWeight: '500',
  },
  
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
    marginBottom: 40,
  },
  
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#6c757d',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  
  cancelButtonText: {
    color: '#6c757d',
    fontSize: 16,
    fontWeight: '600',
  },
  
  saveButton: {
    flex: 1,
    backgroundColor: '#3498db',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EditShopScreen;