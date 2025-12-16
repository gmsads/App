import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const ShopSettings = () => {
  const router = useRouter();
  const [shopName, setShopName] = useState('FreshMart Supermarket');
  const [ownerName, setOwnerName] = useState('Rajesh Kumar');
  const [phone, setPhone] = useState('+91 9876543210');
  const [address, setAddress] = useState('123 Main Street, Market Area');
  const [city, setCity] = useState('New Delhi');
  const [pincode, setPincode] = useState('110001');
  
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [smsUpdates, setSmsUpdates] = useState(false);

  const handleSaveChanges = () => {
    Alert.alert('Success', 'Settings saved successfully!');
  };

  const handleReset = () => {
    Alert.alert(
      'Reset Settings',
      'Are you sure you want to reset all settings to default?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          onPress: () => {
            setNotifications(true);
            setEmailUpdates(true);
            setSmsUpdates(false);
            Alert.alert('Success', 'Settings reset to default!');
          }
        },
      ]
    );
  };

  const settingsSections = [
    {
      title: 'Shop Information',
      icon: 'store' as const,
      items: [
        {
          type: 'input',
          label: 'Shop Name',
          value: shopName,
          onChange: setShopName,
          icon: 'store' as const,
        },
        {
          type: 'input',
          label: 'Owner Name',
          value: ownerName,
          onChange: setOwnerName,
          icon: 'person' as const,
        },
        {
          type: 'input',
          label: 'Phone Number',
          value: phone,
          onChange: setPhone,
          icon: 'phone' as const,
        },
        {
          type: 'input',
          label: 'Address',
          value: address,
          onChange: setAddress,
          icon: 'home' as const,
        },
        {
          type: 'input',
          label: 'City',
          value: city,
          onChange: setCity,
          icon: 'location-city' as const,
        },
        {
          type: 'input',
          label: 'Pincode',
          value: pincode,
          onChange: setPincode,
          icon: 'mail' as const,
        },
      ],
    },
    {
      title: 'Notifications',
      icon: 'notifications' as const,
      items: [
        {
          type: 'switch',
          label: 'Push Notifications',
          value: notifications,
          onChange: setNotifications,
          icon: 'notifications' as const,
        },
        {
          type: 'switch',
          label: 'Email Updates',
          value: emailUpdates,
          onChange: setEmailUpdates,
          icon: 'email' as const,
        },
        {
          type: 'switch',
          label: 'SMS Updates',
          value: smsUpdates,
          onChange: setSmsUpdates,
          icon: 'sms' as const,
        },
      ],
    },
    {
      title: 'Account',
      icon: 'security' as const,
      items: [
        {
          type: 'button',
          label: 'Change Password',
          icon: 'lock' as const,
          onPress: () => router.push('/shopkeeper/settings/change-password'),
        },
        {
          type: 'button',
          label: 'Privacy Settings',
          icon: 'privacy-tip' as const,
          onPress: () => {
            Alert.alert('Privacy Settings', 'Privacy settings page is under development.');
          },
        },
        {
          type: 'button',
          label: 'Terms & Conditions',
          icon: 'description' as const,
          onPress: () => {
            Alert.alert('Terms & Conditions', 'Terms & conditions page is under development.');
          },
        },
      ],
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shop Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      {settingsSections.map((section, sectionIndex) => (
        <View key={sectionIndex} style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name={section.icon} size={20} color="#4CAF50" />
            <Text style={styles.sectionTitle}>{section.title}</Text>
          </View>
          
          <View style={styles.sectionContent}>
            {section.items.map((item, itemIndex) => (
              <View key={itemIndex} style={styles.settingItem}>
                <View style={styles.settingLabelContainer}>
                  <MaterialIcons name={item.icon} size={20} color="#666" />
                  <Text style={styles.settingLabel}>{item.label}</Text>
                </View>
                
                {item.type === 'input' && (
                  <TextInput
                    style={styles.input}
                    value={item.value}
                    onChangeText={item.onChange}
                    placeholder={`Enter ${item.label.toLowerCase()}`}
                  />
                )}
                
                {item.type === 'switch' && (
                  <Switch
                    value={item.value}
                    onValueChange={item.onChange}
                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                    thumbColor={item.value ? '#f5dd4b' : '#f4f3f4'}
                  />
                )}
                
                {item.type === 'button' && (
                  <TouchableOpacity onPress={item.onPress}>
                    <MaterialIcons name="chevron-right" size={24} color="#999" />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        </View>
      ))}

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
          <MaterialIcons name="save" size={20} color="#fff" />
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <MaterialIcons name="refresh" size={20} color="#f44336" />
          <Text style={styles.resetButtonText}>Reset to Default</Text>
        </TouchableOpacity>
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
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  section: {
    backgroundColor: '#fff',
    margin: 16,
    marginBottom: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 12,
  },
  sectionContent: {
    padding: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingLabel: {
    fontSize: 14,
    color: '#333',
    marginLeft: 12,
    flex: 1,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 6,
    padding: 8,
    fontSize: 14,
    color: '#333',
    textAlign: 'right',
  },
  actionButtons: {
    padding: 16,
    gap: 12,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resetButton: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f44336',
    gap: 8,
  },
  resetButtonText: {
    color: '#f44336',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ShopSettings;