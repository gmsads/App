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

interface DeliverySettings {
  deliveryCharges: string;
  minOrderAmount: string;
  deliveryTypes: {
    sameDay: boolean;
    nextDay: boolean;
    thirtyMinutes: boolean;
    oneHour: boolean;
  };
  deliverySlots: {
    sameDay: string[];
    nextDay: string[];
  };
  availableSlots: {
    label: string;
    value: string;
  }[];
}

interface DeliverySlot {
  label: string;
  value: string;
}

const DeliverySettings: React.FC = () => {
  const router = useRouter();
  const [settings, setSettings] = useState<DeliverySettings>({
    deliveryCharges: '30',
    minOrderAmount: '200',
    deliveryTypes: {
      sameDay: true,
      nextDay: true,
      thirtyMinutes: false,
      oneHour: true,
    },
    deliverySlots: {
      sameDay: ['6am-9am', '9am-12pm', '12pm-3pm'],
      nextDay: ['Morning', 'Evening', '6am-12pm', '12pm-7pm'],
    },
    availableSlots: [
      { label: '6am to 9am', value: '6am-9am' },
      { label: '9am to 12pm', value: '9am-12pm' },
      { label: '12pm to 3pm', value: '12pm-3pm' },
      { label: '3pm to 6pm', value: '3pm-6pm' },
      { label: '6am to 12pm', value: '6am-12pm' },
      { label: '12pm to 7pm', value: '12pm-7pm' },
      { label: 'Morning', value: 'Morning' },
      { label: 'Evening', value: 'Evening' },
    ],
  });

  const [loading, setLoading] = useState(false);
  const [tempSlots, setTempSlots] = useState({
    sameDay: [...settings.deliverySlots.sameDay],
    nextDay: [...settings.deliverySlots.nextDay],
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await AsyncStorage.getItem('deliverySettings');
      if (data) {
        const parsedData = JSON.parse(data);
        setSettings(parsedData);
        setTempSlots(parsedData.deliverySlots);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const updatedSettings = {
        ...settings,
        deliverySlots: tempSlots,
      };
      
      await AsyncStorage.setItem('deliverySettings', JSON.stringify(updatedSettings));
      
      // Also update shopkeeper data
      const shopDataStr = await AsyncStorage.getItem('shopkeeperData');
      if (shopDataStr) {
        const shopData = JSON.parse(shopDataStr);
        shopData.deliveryCharges = `₹${updatedSettings.deliveryCharges}`;
        shopData.minOrderAmount = `₹${updatedSettings.minOrderAmount}`;
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

  const toggleDeliveryType = (type: keyof typeof settings.deliveryTypes) => {
    setSettings(prev => ({
      ...prev,
      deliveryTypes: {
        ...prev.deliveryTypes,
        [type]: !prev.deliveryTypes[type],
      },
    }));
  };

  const renderDeliveryType = (type: keyof typeof settings.deliveryTypes) => {
    const labels: Record<keyof typeof settings.deliveryTypes, string> = {
      sameDay: 'Same Day Delivery',
      nextDay: 'Next Day Delivery',
      thirtyMinutes: '30 Minutes Delivery',
      oneHour: '1 Hour Delivery',
    };
    
    const icons: Record<keyof typeof settings.deliveryTypes, any> = {
      sameDay: 'today',
      nextDay: 'date-range',
      thirtyMinutes: 'timer',
      oneHour: 'access-time',
    };

    return (
      <View key={type} style={styles.deliveryTypeItem}>
        <View style={styles.deliveryTypeInfo}>
          <MaterialIcons 
            name={icons[type]} 
            size={24} 
            color={settings.deliveryTypes[type] ? '#4CAF50' : '#999'} 
          />
          <Text style={[
            styles.deliveryTypeLabel,
            !settings.deliveryTypes[type] && styles.deliveryTypeDisabled
          ]}>
            {labels[type]}
          </Text>
        </View>
        <Switch
          value={settings.deliveryTypes[type]}
          onValueChange={() => toggleDeliveryType(type)}
          trackColor={{ false: '#ddd', true: '#4CAF50' }}
        />
      </View>
    );
  };

  const renderSlotSelector = (slotType: 'sameDay' | 'nextDay', title: string) => {
    const availableSlots: DeliverySlot[] = slotType === 'sameDay' 
      ? settings.availableSlots.filter(slot => 
          !['Morning', 'Evening'].includes(slot.label)
        )
      : settings.availableSlots;

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

  const deliveryTypeNames: Record<string, string> = {
    sameDay: 'Same Day',
    nextDay: 'Next Day',
    thirtyMinutes: '30 Mins',
    oneHour: '1 Hour',
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="delivery-dining" size={32} color="#4CAF50" />
        <Text style={styles.headerTitle}>Delivery Settings</Text>
        <Text style={styles.headerSubtitle}>Configure your delivery preferences</Text>
      </View>

      {/* Pricing Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pricing Settings</Text>
        
        <View style={styles.inputGroup}>
          <View style={styles.inputRow}>
            <MaterialIcons name="local-shipping" size={24} color="#666" />
            <Text style={styles.inputLabel}>Delivery Charges (₹)</Text>
          </View>
          <TextInput
            style={styles.input}
            value={settings.deliveryCharges}
            onChangeText={(value) => setSettings(prev => ({ ...prev, deliveryCharges: value }))}
            keyboardType="numeric"
            placeholder="Enter amount"
          />
        </View>

        <View style={styles.inputGroup}>
          <View style={styles.inputRow}>
            <MaterialIcons name="payment" size={24} color="#666" />
            <Text style={styles.inputLabel}>Minimum Order Amount (₹)</Text>
          </View>
          <TextInput
            style={styles.input}
            value={settings.minOrderAmount}
            onChangeText={(value) => setSettings(prev => ({ ...prev, minOrderAmount: value }))}
            keyboardType="numeric"
            placeholder="Enter amount"
          />
        </View>
      </View>

      {/* Delivery Types */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Delivery Types</Text>
        <Text style={styles.sectionDescription}>
          Select the delivery types you want to offer
        </Text>
        
        {(Object.keys(settings.deliveryTypes) as Array<keyof typeof settings.deliveryTypes>).map(type => 
          renderDeliveryType(type)
        )}
      </View>

      {/* Delivery Slots */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Delivery Slots</Text>
        <Text style={styles.sectionDescription}>
          Select available time slots for deliveries
        </Text>
        
        {renderSlotSelector('sameDay', 'Same Day Delivery Slots')}
        {renderSlotSelector('nextDay', 'Next Day Delivery Slots')}
      </View>

      {/* Current Configuration */}
      <View style={styles.configSection}>
        <Text style={styles.configTitle}>Current Configuration</Text>
        
        <View style={styles.configItem}>
          <MaterialIcons name="info" size={20} color="#2196F3" />
          <View style={styles.configInfo}>
            <Text style={styles.configLabel}>Delivery Charges:</Text>
            <Text style={styles.configValue}>₹{settings.deliveryCharges}</Text>
          </View>
        </View>
        
        <View style={styles.configItem}>
          <MaterialIcons name="info" size={20} color="#2196F3" />
          <View style={styles.configInfo}>
            <Text style={styles.configLabel}>Min Order Amount:</Text>
            <Text style={styles.configValue}>₹{settings.minOrderAmount}</Text>
          </View>
        </View>
        
        <View style={styles.configItem}>
          <MaterialIcons name="schedule" size={20} color="#2196F3" />
          <View style={styles.configInfo}>
            <Text style={styles.configLabel}>Active Delivery Types:</Text>
            <Text style={styles.configValue}>
              {Object.entries(settings.deliveryTypes)
                .filter(([, value]) => value)
                .map(([key]) => deliveryTypeNames[key])
                .join(', ')}
            </Text>
          </View>
        </View>
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

      {/* Help Text */}
      <View style={styles.helpSection}>
        <MaterialIcons name="help" size={20} color="#666" />
        <Text style={styles.helpText}>
          Changes will be applied immediately. Make sure to inform customers about any changes in delivery slots.
        </Text>
      </View>
    </ScrollView>
  );
};

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