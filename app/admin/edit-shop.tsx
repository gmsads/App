import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useShop } from './shop-context';

const EditShopScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { updateShop } = useShop();
  
  const shopId = params.id as string;
  const shopParam = params.shop as string;
  
  const [shopData, setShopData] = useState({
    name: '',
    owner: '',
    address: '',
    phone: '',
    email: '',
    status: 'Active' as 'Active' | 'Inactive',
  });

  useEffect(() => {
    if (shopParam) {
      try {
        const parsedShop = JSON.parse(shopParam);
        setShopData({
          name: parsedShop.name || '',
          owner: parsedShop.owner || '',
          address: parsedShop.address || '',
          phone: parsedShop.phone || '',
          email: parsedShop.email || '',
          status: parsedShop.status || 'Active',
        });
      } catch (error) {
        console.error('Error parsing shop data:', error);
        Alert.alert('Error', 'Failed to load shop data');
      }
    }
  }, [shopParam]);

  const handleSave = () => {
    if (!shopData.name.trim()) {
      Alert.alert('Error', 'Please enter shop name');
      return;
    }
    if (!shopData.owner.trim()) {
      Alert.alert('Error', 'Please enter owner name');
      return;
    }
    if (!shopData.address.trim()) {
      Alert.alert('Error', 'Please enter shop address');
      return;
    }
    if (!shopData.phone.trim()) {
      Alert.alert('Error', 'Please enter phone number');
      return;
    }

    updateShop(shopId, shopData);
    Alert.alert('Success', 'Shop updated successfully');
    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Shop</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Shop Name *</Text>
          <TextInput
            style={styles.input}
            value={shopData.name}
            onChangeText={(text) => setShopData({ ...shopData, name: text })}
            placeholder="Enter shop name"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Owner Name *</Text>
          <TextInput
            style={styles.input}
            value={shopData.owner}
            onChangeText={(text) => setShopData({ ...shopData, owner: text })}
            placeholder="Enter owner name"
            placeholderTextColor="#999"
          />
        </View>

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

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number *</Text>
          <TextInput
            style={styles.input}
            value={shopData.phone}
            onChangeText={(text) => setShopData({ ...shopData, phone: text })}
            placeholder="Enter phone number"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email Address</Text>
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
  textArea: {
    height: 80,
    textAlignVertical: 'top',
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
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    marginBottom: 20,
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