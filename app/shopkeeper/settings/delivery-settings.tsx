import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  MaterialIcons,
  Ionicons,
} from '@expo/vector-icons';

// Define the interface to match your JSON structure
interface DeliverySettings {
  shopId: number;
  minOrder: string;
  deliveryFee: string;
  deliveryTypes: string[];
  sameDayDeliverySlots: string[];
  nextDayDeliverySlots: string[];
}

// Define the delivery slot interface
interface DeliverySlot {
  label: string;
  value: string;
}

const DeliverySettings: React.FC = () => {
  const router = useRouter();
  
  // Predefined available time slots
  const defaultSlots: DeliverySlot[] = [
    { label: '07:00 AM - 09:00 AM', value: '07:00 AM - 09:00 AM' },
    { label: '09:00 AM - 11:00 AM', value: '09:00 AM - 11:00 AM' },
    { label: '10:00 AM - 12:00 PM', value: '10:00 AM - 12:00 PM' },
    { label: '12:00 PM - 02:00 PM', value: '12:00 PM - 02:00 PM' },
    { label: '02:00 PM - 04:00 PM', value: '02:00 PM - 04:00 PM' },
    { label: '04:00 PM - 06:00 PM', value: '04:00 PM - 06:00 PM' },
    { label: '05:00 PM - 07:00 PM', value: '05:00 PM - 07:00 PM' },
    { label: '06:00 PM - 08:00 PM', value: '06:00 PM - 08:00 PM' },
  ];

  // Default settings based on your JSON
  const defaultSettings: DeliverySettings = {
    shopId: 101,
    minOrder: '150',
    deliveryFee: '20',
    deliveryTypes: ['SameDay', 'NextDay'],
    sameDayDeliverySlots: [
      '07:00 AM - 09:00 AM',
      '10:00 AM - 12:00 PM',
      '05:00 PM - 07:00 PM'
    ],
    nextDayDeliverySlots: [
      '07:00 AM - 09:00 AM',
      '10:00 AM - 12:00 PM'
    ],
  };

  // State declarations
  const [settings, setSettings] = useState<DeliverySettings>(defaultSettings);
  const [availableSlots] = useState<DeliverySlot[]>(defaultSlots);
  const [loading, setLoading] = useState(false);
  const [tempSlots, setTempSlots] = useState({
    sameDay: [...defaultSettings.sameDayDeliverySlots],
    nextDay: [...defaultSettings.nextDayDeliverySlots],
  });

  // Load saved settings on component mount
  useEffect(() => {
    loadSettings();
  }, []);

  // Function to load settings from AsyncStorage with proper error handling
  const loadSettings = async () => {
    try {
      const data = await AsyncStorage.getItem('deliverySettings');
      if (data) {
        const parsedData = JSON.parse(data);
        
        // Ensure all fields exist with fallback values
        const loadedSettings: DeliverySettings = {
          shopId: parsedData.shopId || defaultSettings.shopId,
          minOrder: parsedData.minOrder || parsedData.minOrderAmount || defaultSettings.minOrder,
          deliveryFee: parsedData.deliveryFee || parsedData.deliveryCharges || defaultSettings.deliveryFee,
          deliveryTypes: Array.isArray(parsedData.deliveryTypes) 
            ? parsedData.deliveryTypes 
            : defaultSettings.deliveryTypes,
          sameDayDeliverySlots: Array.isArray(parsedData.sameDayDeliverySlots)
            ? parsedData.sameDayDeliverySlots
            : defaultSettings.sameDayDeliverySlots,
          nextDayDeliverySlots: Array.isArray(parsedData.nextDayDeliverySlots)
            ? parsedData.nextDayDeliverySlots
            : defaultSettings.nextDayDeliverySlots,
        };
        
        setSettings(loadedSettings);
        setTempSlots({
          sameDay: loadedSettings.sameDayDeliverySlots,
          nextDay: loadedSettings.nextDayDeliverySlots,
        });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      // Reset to defaults if there's an error
      setSettings(defaultSettings);
      setTempSlots({
        sameDay: defaultSettings.sameDayDeliverySlots,
        nextDay: defaultSettings.nextDayDeliverySlots,
      });
    }
  };

  // Function to save settings
  const handleSave = async () => {
    setLoading(true);
    try {
      const updatedSettings: DeliverySettings = {
        ...settings,
        sameDayDeliverySlots: tempSlots.sameDay,
        nextDayDeliverySlots: tempSlots.nextDay,
      };
      
      // Save to AsyncStorage
      await AsyncStorage.setItem('deliverySettings', JSON.stringify(updatedSettings));
      
      // Also update shopkeeper data if needed
      const shopDataStr = await AsyncStorage.getItem('shopkeeperData');
      if (shopDataStr) {
        const shopData = JSON.parse(shopDataStr);
        shopData.deliveryFee = `₹${updatedSettings.deliveryFee}`;
        shopData.minOrder = `₹${updatedSettings.minOrder}`;
        await AsyncStorage.setItem('shopkeeperData', JSON.stringify(shopData));
      }
      
      Alert.alert('Success', 'Delivery settings saved successfully!');
      setSettings(updatedSettings);
    } catch (error) {
      console.error('Error saving settings:', error);
      Alert.alert('Error', 'Failed to save settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Function to toggle a time slot
  const toggleSlot = (slotType: 'sameDay' | 'nextDay', slotValue: string) => {
    setTempSlots(prev => {
      const slots = [...prev[slotType]];
      const index = slots.indexOf(slotValue);
      
      if (index > -1) {
        slots.splice(index, 1);
      } else {
        slots.push(slotValue);
      }
      
      return { ...prev, [slotType]: slots };
    });
  };

  // Function to toggle a delivery type
  const toggleDeliveryType = (type: string) => {
    setSettings(prev => {
      const deliveryTypes = [...(prev.deliveryTypes || [])];
      const index = deliveryTypes.indexOf(type);
      
      if (index > -1) {
        deliveryTypes.splice(index, 1);
      } else {
        deliveryTypes.push(type);
      }
      
      return { ...prev, deliveryTypes };
    });
  };

  // Check if a delivery type is active (with null safety)
  const isDeliveryTypeActive = (type: string) => {
    if (!settings.deliveryTypes || !Array.isArray(settings.deliveryTypes)) {
      return false;
    }
    return settings.deliveryTypes.includes(type);
  };

  // Render a delivery type toggle item
  const renderDeliveryType = (type: string, label: string, icon: string) => {
    const isActive = isDeliveryTypeActive(type);

    return (
      <View key={type} style={styles.deliveryTypeItem}>
        <View style={styles.deliveryTypeInfo}>
          <MaterialIcons 
            name={icon as any} 
            size={24} 
            color={isActive ? '#4CAF50' : '#999'} 
          />
          <Text style={[
            styles.deliveryTypeLabel,
            !isActive && styles.deliveryTypeDisabled
          ]}>
            {label}
          </Text>
        </View>
        <Switch
          value={isActive}
          onValueChange={() => toggleDeliveryType(type)}
          trackColor={{ false: '#ddd', true: '#4CAF50' }}
        />
      </View>
    );
  };

  // Render a slot selector section
  const renderSlotSelector = (slotType: 'sameDay' | 'nextDay', title: string) => {
    return (
      <View style={styles.slotSection}>
        <Text style={styles.slotTitle}>{title}</Text>
        <View style={styles.slotsContainer}>
          {availableSlots.map((slot) => {
            const isSelected = tempSlots[slotType].includes(slot.value);
            return (
              <TouchableOpacity
                key={slot.value}
                style={[
                  styles.slotButton,
                  isSelected && styles.slotButtonSelected,
                ]}
                onPress={() => toggleSlot(slotType, slot.value)}
              >
                <Text style={[
                  styles.slotText,
                  isSelected && styles.slotTextSelected,
                ]}>
                  {slot.label}
                </Text>
                {isSelected && (
                  <MaterialIcons name="check" size={16} color="#4CAF50" />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  // Map delivery type codes to display names
  const deliveryTypeNames: Record<string, string> = {
    'SameDay': 'Same Day',
    'NextDay': 'Next Day',
    'ThirtyMinutes': '30 Mins',
    'OneHour': '1 Hour',
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <MaterialIcons name="delivery-dining" size={32} color="#4CAF50" />
        <Text style={styles.headerTitle}>Delivery Settings</Text>
        <Text style={styles.headerSubtitle}>Configure your delivery preferences</Text>
      </View>

      {/* Pricing Settings Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pricing Settings</Text>
        
        <View style={styles.inputGroup}>
          <View style={styles.inputRow}>
            <MaterialIcons name="payment" size={24} color="#666" />
            <Text style={styles.inputLabel}>Minimum Order Amount (₹)</Text>
          </View>
          <TextInput
            style={styles.input}
            value={settings.minOrder}
            onChangeText={(value) => setSettings(prev => ({ ...prev, minOrder: value }))}
            keyboardType="numeric"
            placeholder="Enter minimum amount"
          />
        </View>

        <View style={styles.inputGroup}>
          <View style={styles.inputRow}>
            <MaterialIcons name="local-shipping" size={24} color="#666" />
            <Text style={styles.inputLabel}>Delivery Fee (₹)</Text>
          </View>
          <TextInput
            style={styles.input}
            value={settings.deliveryFee}
            onChangeText={(value) => setSettings(prev => ({ ...prev, deliveryFee: value }))}
            keyboardType="numeric"
            placeholder="Enter delivery fee"
          />
        </View>
      </View>

      {/* Delivery Types Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Delivery Types</Text>
        <Text style={styles.sectionDescription}>
          Select the delivery types you want to offer
        </Text>
        
        {renderDeliveryType('SameDay', 'Same Day Delivery', 'today')}
        {renderDeliveryType('NextDay', 'Next Day Delivery', 'date-range')}
        {renderDeliveryType('ThirtyMinutes', '30 Minutes Delivery', 'timer')}
        {renderDeliveryType('OneHour', '1 Hour Delivery', 'access-time')}
      </View>

      {/* Delivery Slots Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Delivery Slots</Text>
        <Text style={styles.sectionDescription}>
          Select available time slots for deliveries
        </Text>
        
        {isDeliveryTypeActive('SameDay') && renderSlotSelector('sameDay', 'Same Day Delivery Slots')}
        {isDeliveryTypeActive('NextDay') && renderSlotSelector('nextDay', 'Next Day Delivery Slots')}
      </View>

      {/* Current Configuration Section */}
      <View style={styles.configSection}>
        <Text style={styles.configTitle}>Current Configuration</Text>
        
        <View style={styles.configItem}>
          <MaterialIcons name="store" size={20} color="#2196F3" />
          <View style={styles.configInfo}>
            <Text style={styles.configLabel}>Shop ID:</Text>
            <Text style={styles.configValue}>{settings.shopId}</Text>
          </View>
        </View>
        
        <View style={styles.configItem}>
          <MaterialIcons name="payment" size={20} color="#2196F3" />
          <View style={styles.configInfo}>
            <Text style={styles.configLabel}>Min Order Amount:</Text>
            <Text style={styles.configValue}>₹{settings.minOrder}</Text>
          </View>
        </View>
        
        <View style={styles.configItem}>
          <MaterialIcons name="local-shipping" size={20} color="#2196F3" />
          <View style={styles.configInfo}>
            <Text style={styles.configLabel}>Delivery Fee:</Text>
            <Text style={styles.configValue}>₹{settings.deliveryFee}</Text>
          </View>
        </View>
        
        <View style={styles.configItem}>
          <MaterialIcons name="schedule" size={20} color="#2196F3" />
          <View style={styles.configInfo}>
            <Text style={styles.configLabel}>Active Delivery Types:</Text>
            <Text style={styles.configValue}>
              {settings.deliveryTypes && Array.isArray(settings.deliveryTypes)
                ? settings.deliveryTypes
                    .map(type => deliveryTypeNames[type] || type)
                    .join(', ') || 'None'
                : 'None'}
            </Text>
          </View>
        </View>
        
        {isDeliveryTypeActive('SameDay') && (
          <View style={styles.configItem}>
            <MaterialIcons name="today" size={20} color="#2196F3" />
            <View style={styles.configInfo}>
              <Text style={styles.configLabel}>Same Day Slots:</Text>
              <Text style={styles.configValue}>
                {tempSlots.sameDay.length} slots selected
              </Text>
            </View>
          </View>
        )}
        
        {isDeliveryTypeActive('NextDay') && (
          <View style={styles.configItem}>
            <MaterialIcons name="date-range" size={20} color="#2196F3" />
            <View style={styles.configInfo}>
              <Text style={styles.configLabel}>Next Day Slots:</Text>
              <Text style={styles.configValue}>
                {tempSlots.nextDay.length} slots selected
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Save Button */}
      <TouchableOpacity
        style={[styles.saveButton, loading && styles.saveButtonDisabled]}
        onPress={handleSave}
        disabled={loading}
      >
        {loading ? (
          <Ionicons name="refresh" size={24} color="#fff" />
        ) : (
          <>
            <MaterialIcons name="save" size={24} color="#fff" />
            <Text style={styles.saveButtonText}>Save Settings</Text>
          </>
        )}
      </TouchableOpacity>

      {/* Help Text Section */}
      <View style={styles.helpSection}>
        <MaterialIcons name="help" size={20} color="#666" />
        <Text style={styles.helpText}>
          Changes will be applied immediately. Make sure to inform customers about any changes in delivery slots.
        </Text>
      </View>
    </ScrollView>
  );
};

// Styles (same as before)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 12,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
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
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  deliveryTypeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f9f9f9',
  },
  deliveryTypeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  deliveryTypeLabel: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  deliveryTypeDisabled: {
    color: '#999',
  },
  slotSection: {
    marginTop: 16,
  },
  slotTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  slotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  slotButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    gap: 4,
  },
  slotButtonSelected: {
    backgroundColor: '#e8f5e9',
    borderColor: '#4CAF50',
  },
  slotText: {
    fontSize: 14,
    color: '#666',
  },
  slotTextSelected: {
    color: '#2e7d32',
    fontWeight: '600',
  },
  configSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  configTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  configItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f9f9f9',
  },
  configInfo: {
    flex: 1,
    marginLeft: 12,
  },
  configLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  configValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  saveButtonDisabled: {
    backgroundColor: '#81c784',
    opacity: 0.7,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  helpSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#e8f5e9',
    padding: 16,
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

export default DeliverySettings;