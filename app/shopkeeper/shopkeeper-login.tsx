import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LoginForm {
  shopId: string;
  password: string;
}

const ShopkeeperLogin: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginForm>({
    shopId: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ shopId: '', password: '' });

  const validateForm = () => {
    const newErrors = { shopId: '', password: '' };
    let isValid = true;

    if (!formData.shopId.trim()) {
      newErrors.shopId = 'Shop ID is required';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, accept any login
      const shopData = {
        shopId: formData.shopId,
        shopName: `FreshMart ${formData.shopId}`,
        phone: '+91 9876543210',
        radius: '5 km',
        deliveryCharges: '₹30',
        minOrderAmount: '₹200',
        deliveryTypes: ['same_day', 'next_day'],
        deliverySlots: {
          sameDay: ['6am-9am', '9am-12pm', '12pm-3pm'],
          nextDay: ['Morning', 'Evening', '6am-12pm']
        }
      };
      
      await AsyncStorage.setItem('shopkeeperData', JSON.stringify(shopData));
      
      Alert.alert('Success', 'Login successful!');
      router.replace('/shopkeeper/shopkeeper-dashboard');
      
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>🛒 ShopKeeper</Text>
          <Text style={styles.subtitle}>Manage your store efficiently</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>Shop Login</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Shop ID</Text>
            <TextInput
              style={[styles.input, errors.shopId ? styles.inputError : null]}
              placeholder="Enter your Shop ID"
              value={formData.shopId}
              onChangeText={(value) => {
                setFormData(prev => ({ ...prev, shopId: value }));
                if (errors.shopId) setErrors(prev => ({ ...prev, shopId: '' }));
              }}
              autoCapitalize="none"
            />
            {errors.shopId && (
              <Text style={styles.errorText}>{errors.shopId}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={[styles.input, errors.password ? styles.inputError : null]}
              placeholder="Enter your password"
              value={formData.password}
              onChangeText={(value) => {
                setFormData(prev => ({ ...prev, password: value }));
                if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
              }}
              secureTextEntry
            />
            {errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}
          </View>

          <TouchableOpacity
            style={[styles.loginButton, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.loginButtonText}>
              {loading ? 'Logging in...' : 'Login'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.demoButton}
            onPress={() => {
              setFormData({ shopId: 'shop123', password: 'password123' });
            }}
          >
            <Text style={styles.demoButtonText}>Use Demo Credentials</Text>
          </TouchableOpacity>

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Note:</Text>
            <Text style={styles.infoText}>
              • Shop ID is provided during registration{'\n'}
              • Contact admin for password reset{'\n'}
              • Demo login available for testing
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  inputError: {
    borderColor: '#ff4444',
    backgroundColor: '#fff5f5',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginTop: 4,
  },
  loginButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#81c784',
    opacity: 0.7,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  demoButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  demoButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  infoBox: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#e8f5e9',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
    color: '#555',
    lineHeight: 18,
  },
});

export default ShopkeeperLogin;