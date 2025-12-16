import { useRouter } from 'expo-router';
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
  Image,
  Modal,
  ActivityIndicator,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

interface GlobalSettings {
  defaultRadius: number;
  handlingCharges: number;
  banners: string[];
  isMaintenance: boolean;
  maintenanceMessage: string;
}

const GlobalSettings: React.FC = () => {
  const router = useRouter();
  const [settings, setSettings] = useState<GlobalSettings>({
    defaultRadius: 5,
    handlingCharges: 10.0,
    banners: [],
    isMaintenance: false,
    maintenanceMessage: 'App is under maintenance. Please check back later.',
  });
  const [newBannerUrl, setNewBannerUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [fetchingSettings, setFetchingSettings] = useState(false);
  const [handlingChargesText, setHandlingChargesText] = useState('10.00');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setFetchingSettings(true);
    try {
      const savedSettings = await AsyncStorage.getItem('globalSettings');
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);
        // Set the text input value
        setHandlingChargesText(
          parsedSettings.handlingCharges === 0 
            ? '' 
            : parsedSettings.handlingCharges.toString()
        );
        console.log('Settings loaded from storage:', parsedSettings);
      } else {
        // Use default settings if nothing is saved
        console.log('No saved settings found, using defaults');
        // Save default settings for first time
        await AsyncStorage.setItem('globalSettings', JSON.stringify(settings));
        setHandlingChargesText('10.00');
      }
    } catch (error) {
      console.error('Error loading settings from storage:', error);
      Alert.alert(
        'Error',
        'Failed to load settings. Using default settings.',
        [{ text: 'OK' }]
      );
    } finally {
      setFetchingSettings(false);
    }
  };

  const saveSettings = async () => {
    setLoading(true);
    try {
      // Ensure handlingCharges is a proper number
      const finalSettings = {
        ...settings,
        handlingCharges: parseFloat(settings.handlingCharges.toFixed(2))
      };
      
      await AsyncStorage.setItem('globalSettings', JSON.stringify(finalSettings));
      console.log('Settings saved:', finalSettings);
      Alert.alert('Success', 'Settings saved successfully!', [{ text: 'OK' }]);
    } catch (error) {
      console.error('Error saving settings:', error);
      Alert.alert('Error', 'Failed to save settings.', [{ text: 'OK' }]);
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert('Permission required', 'Please allow access to your photo library to upload images.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0].uri) {
        setUploadingImage(true);
        const imageUri = result.assets[0].uri;
        // Simulate upload delay
        setTimeout(() => {
          addBanner(imageUri);
          setUploadingImage(false);
          Alert.alert('Success', 'Image added to banners!', [{ text: 'OK' }]);
        }, 1000);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image', [{ text: 'OK' }]);
      setUploadingImage(false);
    }
  };

  const addBanner = (url?: string) => {
    const bannerUrl = url || newBannerUrl.trim();
    if (bannerUrl) {
      setSettings(prev => ({
        ...prev,
        banners: [...prev.banners, bannerUrl],
      }));
      if (!url) {
        setNewBannerUrl('');
        Alert.alert('Success', 'Banner added successfully!', [{ text: 'OK' }]);
      }
    } else {
      Alert.alert('Error', 'Please enter a valid URL', [{ text: 'OK' }]);
    }
  };

  const removeBanner = (index: number) => {
    Alert.alert(
      'Remove Banner',
      'Are you sure you want to remove this banner?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setSettings(prev => ({
              ...prev,
              banners: prev.banners.filter((_, i) => i !== index),
            }));
            Alert.alert('Success', 'Banner removed', [{ text: 'OK' }]);
          },
        },
      ]
    );
  };

  const handleMaintenanceToggle = (value: boolean) => {
    if (value) {
      Alert.alert(
        'Enable Maintenance Mode',
        'Are you sure you want to enable maintenance mode? This will show a maintenance message to all customers.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Enable',
            style: 'destructive',
            onPress: () => handleSettingChange('isMaintenance', true),
          },
        ]
      );
    } else {
      handleSettingChange('isMaintenance', false);
    }
  };

  const handleSettingChange = (key: keyof GlobalSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleDefaultRadiusChange = (value: string) => {
    // Handle empty input
    if (value === '') {
      handleSettingChange('defaultRadius', 0);
      return;
    }
    
    // Only allow digits
    const cleanValue = value.replace(/[^0-9]/g, '');
    
    if (cleanValue === '') {
      handleSettingChange('defaultRadius', 0);
      return;
    }
    
    const intValue = parseInt(cleanValue, 10);
    if (!isNaN(intValue)) {
      handleSettingChange('defaultRadius', intValue);
    }
  };

  const handleHandlingChargesChange = (text: string) => {
    // Update the text input
    setHandlingChargesText(text);
    
    // Handle empty input
    if (text === '') {
      handleSettingChange('handlingCharges', 0);
      return;
    }
    
    // Handle single dot
    if (text === '.') {
      handleSettingChange('handlingCharges', 0);
      return;
    }
    
    // Check if it's a valid number
    const numValue = parseFloat(text);
    if (!isNaN(numValue)) {
      // Update the state with the parsed number
      handleSettingChange('handlingCharges', numValue);
    }
  };

  const handleHandlingChargesBlur = () => {
    // Format to 2 decimal places when input loses focus
    if (handlingChargesText && handlingChargesText !== '') {
      const numValue = parseFloat(handlingChargesText);
      if (!isNaN(numValue)) {
        const formattedValue = numValue.toFixed(2);
        setHandlingChargesText(formattedValue);
        handleSettingChange('handlingCharges', parseFloat(formattedValue));
      }
    }
  };

  const formatCurrency = (value: number) => {
    return value.toFixed(2);
  };

  if (fetchingSettings) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Loading settings...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#3498db" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Global Settings</Text>
        <TouchableOpacity 
          style={[styles.saveButton, loading && styles.buttonDisabled]}
          onPress={saveSettings}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>
            {loading ? 'Saving...' : 'Submit'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Settings</Text>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Default Delivery Radius (km)</Text>
            <TextInput
              style={styles.numberInput}
              value={settings.defaultRadius === 0 ? '' : settings.defaultRadius.toString()}
              onChangeText={handleDefaultRadiusChange}
              keyboardType="number-pad"
              placeholder="Enter radius"
              placeholderTextColor="#95a5a6"
            />
            <Text style={styles.inputNote}>Enter whole numbers only (e.g., 5, 10, 15)</Text>
            <Text style={styles.currentValue}>
              Current value: {settings.defaultRadius} km
            </Text>
          </View>

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Handling Charges (₹)</Text>
            <View style={styles.currencyInputContainer}>
              <Text style={styles.currencySymbol}>₹</Text>
              <TextInput
                style={[styles.numberInput, styles.currencyInput]}
                value={handlingChargesText}
                onChangeText={handleHandlingChargesChange}
                onBlur={handleHandlingChargesBlur}
                keyboardType="decimal-pad"
                placeholder="0.00"
                placeholderTextColor="#95a5a6"
              />
            </View>
            <Text style={styles.inputNote}>Enter decimal values up to 2 decimal places (e.g., 4.90, 10.50, 15.99)</Text>
            <Text style={styles.currentValue}>
              Current value: ₹{formatCurrency(settings.handlingCharges)}
            </Text>
            <View style={styles.exampleContainer}>
              <Text style={styles.exampleText}>Quick set:</Text>
              <View style={styles.exampleButtons}>
                <TouchableOpacity 
                  style={styles.exampleButton}
                  onPress={() => {
                    setHandlingChargesText('4.99');
                    handleSettingChange('handlingCharges', 4.99);
                  }}
                >
                  <Text style={styles.exampleButtonText}>₹4.99</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.exampleButton}
                  onPress={() => {
                    setHandlingChargesText('9.99');
                    handleSettingChange('handlingCharges', 9.99);
                  }}
                >
                  <Text style={styles.exampleButtonText}>₹9.99</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.exampleButton}
                  onPress={() => {
                    setHandlingChargesText('14.50');
                    handleSettingChange('handlingCharges', 14.50);
                  }}
                >
                  <Text style={styles.exampleButtonText}>₹14.50</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>System Settings</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.switchContainer}>
              <View style={styles.switchLabelContainer}>
                <Text style={styles.settingLabel}>Maintenance Mode</Text>
                <View style={styles.maintenanceStatus}>
                  <View style={[
                    styles.statusIndicator, 
                    settings.isMaintenance ? styles.statusActive : styles.statusInactive
                  ]} />
                  <Text style={styles.statusText}>
                    {settings.isMaintenance ? 'Active' : 'Inactive'}
                  </Text>
                </View>
              </View>
              <Switch
                value={settings.isMaintenance}
                onValueChange={handleMaintenanceToggle}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={settings.isMaintenance ? '#3498db' : '#f4f3f4'}
              />
            </View>
            {settings.isMaintenance && (
              <View style={styles.maintenancePreview}>
                <Ionicons name="construct-outline" size={40} color="#e67e22" />
                <Text style={styles.maintenancePreviewTitle}>Maintenance Mode Active</Text>
                <Text style={styles.maintenancePreviewText}>
                  {settings.maintenanceMessage}
                </Text>
              </View>
            )}
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Maintenance Message</Text>
              <TextInput
                style={styles.textInput}
                value={settings.maintenanceMessage}
                onChangeText={(value) => handleSettingChange('maintenanceMessage', value)}
                placeholder="Enter maintenance message..."
                placeholderTextColor="#95a5a6"
                multiline
                numberOfLines={3}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Banner Management</Text>
          <Text style={styles.bannerNote}>
            Recommended size: 1200 x 600px (16:9 aspect ratio)
          </Text>
          
          <View style={styles.bannerForm}>
            <TextInput
              style={styles.bannerInput}
              placeholder="Enter banner image URL"
              placeholderTextColor="#95a5a6"
              value={newBannerUrl}
              onChangeText={setNewBannerUrl}
            />
            <TouchableOpacity 
              style={[styles.addBannerButton, !newBannerUrl.trim() && styles.buttonDisabled]}
              onPress={() => addBanner()}
              disabled={!newBannerUrl.trim()}
            >
              <Text style={styles.addBannerButtonText}>Add URL</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.uploadSection}>
            <Text style={styles.uploadTitle}>Or upload from device</Text>
            <TouchableOpacity 
              style={styles.uploadButton}
              onPress={pickImage}
              disabled={uploadingImage}
            >
              {uploadingImage ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="cloud-upload-outline" size={20} color="#fff" />
                  <Text style={styles.uploadButtonText}>Upload Image</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          <Text style={styles.bannersTitle}>
            Current Banners ({settings.banners.length})
          </Text>
          
          {settings.banners.length === 0 ? (
            <View style={styles.noBannersContainer}>
              <Ionicons name="images-outline" size={48} color="#bdc3c7" />
              <Text style={styles.noBannersText}>No banners added yet</Text>
              <Text style={styles.noBannersSubText}>
                Add banners to display on the customer homepage
              </Text>
            </View>
          ) : (
            <View style={styles.bannersGrid}>
              {settings.banners.map((banner, index) => (
                <View key={index} style={styles.bannerCard}>
                  <Image 
                    source={{ uri: banner }} 
                    style={styles.bannerImage} 
                    resizeMode="cover"
                    onError={() => console.log('Error loading image:', banner)}
                  />
                  <TouchableOpacity 
                    style={styles.removeButton}
                    onPress={() => removeBanner(index)}
                  >
                    <Ionicons name="close-circle" size={24} color="#e74c3c" />
                  </TouchableOpacity>
                  <View style={styles.bannerIndex}>
                    <Text style={styles.bannerIndexText}>{index + 1}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.infoSection}>
          <Ionicons name="information-circle-outline" size={24} color="#27ae60" />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>About Global Settings</Text>
            <Text style={styles.infoText}>
              • Default Radius: Applies to all new shopkeepers (Integer values){'\n'}
              • Handling Charges: Base charges for all orders (Decimal values){'\n'}
              • Banners: Displayed in the app homepage (16:9 ratio recommended){'\n'}
              • Maintenance Mode: Shows message and icon to customers{'\n'}
              • Settings are saved locally on your device
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.submitContainer}>
        <TouchableOpacity 
          style={[styles.submitButton, loading && styles.buttonDisabled]}
          onPress={saveSettings}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="save-outline" size={20} color="#fff" />
              <Text style={styles.submitButtonText}>Save All Settings</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
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
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  saveButton: {
    backgroundColor: '#27ae60',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#7f8c8d',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
    paddingLeft: 12,
  },
  settingItem: {
    marginBottom: 24,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  switchLabelContainer: {
    flex: 1,
    marginRight: 16,
  },
  maintenanceStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusActive: {
    backgroundColor: '#e74c3c',
  },
  statusInactive: {
    backgroundColor: '#2ecc71',
  },
  statusText: {
    fontSize: 12,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  maintenancePreview: {
    backgroundColor: '#fff8e1',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#ffeaa7',
    alignItems: 'center',
  },
  maintenancePreviewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e67e22',
    marginTop: 8,
    marginBottom: 4,
  },
  maintenancePreviewText: {
    fontSize: 14,
    color: '#7d6608',
    textAlign: 'center',
    lineHeight: 20,
  },
  numberInput: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '500',
  },
  currencyInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencySymbol: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginRight: 8,
    paddingVertical: 14,
  },
  currencyInput: {
    flex: 1,
  },
  textInput: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#2c3e50',
    textAlignVertical: 'top',
  },
  inputNote: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 4,
    fontStyle: 'italic',
  },
  currentValue: {
    fontSize: 14,
    color: '#3498db',
    marginTop: 8,
    fontWeight: '500',
  },
  exampleContainer: {
    marginTop: 12,
  },
  exampleText: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 8,
  },
  exampleButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  exampleButton: {
    backgroundColor: '#ecf0f1',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bdc3c7',
  },
  exampleButtonText: {
    color: '#2c3e50',
    fontSize: 14,
    fontWeight: '500',
  },
  bannerNote: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  bannerForm: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  bannerInput: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#2c3e50',
  },
  addBannerButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 90,
  },
  addBannerButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  uploadSection: {
    marginBottom: 24,
  },
  uploadTitle: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 8,
    textAlign: 'center',
  },
  uploadButton: {
    backgroundColor: '#9b59b6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 10,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  bannersTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 8,
  },
  noBannersContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  noBannersText: {
    textAlign: 'center',
    color: '#7f8c8d',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 12,
  },
  noBannersSubText: {
    textAlign: 'center',
    color: '#bdc3c7',
    fontSize: 14,
    marginTop: 4,
  },
  bannersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  bannerCard: {
    width: '100%',
    marginBottom: 12,
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    backgroundColor: '#ecf0f1',
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 4,
  },
  bannerIndex: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(52, 152, 219, 0.9)',
    borderRadius: 10,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerIndexText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  infoSection: {
    backgroundColor: '#e8f6f3',
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#27ae60',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#27ae60',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#2c3e50',
    lineHeight: 20,
  },
  submitContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  submitButton: {
    backgroundColor: '#27ae60',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default GlobalSettings;