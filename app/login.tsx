import { useRouter } from 'expo-router';
import React, { useState, useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

// Define user type
type UserType = 'customer' | 'shopkeeper' | 'admin';

interface LoginForm {
  phone: string;
  otp: string;
}

interface AdminLoginForm {
  username: string;
  password: string;
}

// Main LoginScreen component
const LoginScreen: React.FC = () => {
  const router = useRouter();
  
  // State for user type selection
  const [userType, setUserType] = useState<UserType>('customer');
  
  // State for OTP login form data
  const [formData, setFormData] = useState<LoginForm>({
    phone: '',
    otp: '',
  });
  
  // State for admin login form data
  const [adminFormData, setAdminFormData] = useState<AdminLoginForm>({
    username: '',
    password: '',
  });
  
  // Common state for loading and UI
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [errors, setErrors] = useState({ 
    phone: '', 
    otp: '',
    username: '',
    password: ''
  });
  const [generatedOtp, setGeneratedOtp] = useState('');
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Initialize animation on component mount
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  // Countdown timer effect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Validate phone number format
  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  // Generate random 6-digit OTP
  const generateOtp = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // Reset forms when user type changes
  useEffect(() => {
    setFormData({ phone: '', otp: '' });
    setAdminFormData({ username: '', password: '' });
    setOtpSent(false);
    setErrors({ phone: '', otp: '', username: '', password: '' });
  }, [userType]);

  // Handle sending OTP (for customer and shopkeeper)
  const handleSendOtp = async () => {
    setErrors({ ...errors, phone: '', otp: '' });

    if (!formData.phone) {
      setErrors(prev => ({ ...prev, phone: 'Phone number is required' }));
      return;
    }

    if (!validatePhone(formData.phone)) {
      setErrors(prev => ({ ...prev, phone: 'Please enter valid phone number' }));
      return;
    }

    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const otp = generateOtp();
      setGeneratedOtp(otp);

      console.log('Generated OTP for testing:', otp);
      
      setOtpSent(true);
      setCountdown(60);
      
      Alert.alert(
        'OTP Generated Successfully', 
        `Your OTP: ${otp}\n\nThis OTP would be sent via SMS in production.\n\nEnter this OTP to login.`
      );
      
    } catch (error: any) {
      console.error('OTP Error:', error);
      Alert.alert('Error', 'Failed to generate OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP login (for customer and shopkeeper)
  const handleOtpLogin = async () => {
    setErrors({ ...errors, otp: '' });

    if (!formData.otp) {
      setErrors(prev => ({ ...prev, otp: 'OTP is required' }));
      return;
    }

    if (formData.otp.length !== 6) {
      setErrors(prev => ({ ...prev, otp: 'OTP must be 6 digits' }));
      return;
    }

    if (formData.otp !== generatedOtp) {
      Alert.alert('Invalid OTP', 'Please enter the correct OTP.');
      return;
    }

    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const userData = {
        phone: formData.phone,
        userType: userType,
        loginTime: new Date().toISOString(),
      };
      
      if (userType === 'customer') {
        await AsyncStorage.setItem('userData', JSON.stringify({
          ...userData,
          name: `Customer ${formData.phone}`,
          joinDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        }));
        router.replace('/productlist');
        
      } else if (userType === 'shopkeeper') {
        await AsyncStorage.setItem('shopkeeperData', JSON.stringify({
          ...userData,
          shopId: `SHOP${formData.phone.slice(-4)}`,
          shopName: `FreshMart ${formData.phone.slice(-4)}`,
          phone: formData.phone,
          radius: '5 km',
          deliveryCharges: '₹30',
          minOrderAmount: '₹200',
        }));
        router.replace('/shopkeeper/shopkeeper-dashboard');
      }
      
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle admin login
  const handleAdminLogin = async () => {
    setErrors({ ...errors, username: '', password: '' });

    if (!adminFormData.username.trim()) {
      setErrors(prev => ({ ...prev, username: 'Username is required' }));
      return;
    }

    if (!adminFormData.password) {
      setErrors(prev => ({ ...prev, password: 'Password is required' }));
      return;
    }

    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (adminFormData.username === 'admin' && adminFormData.password === 'admin123') {
        await AsyncStorage.setItem('adminData', JSON.stringify({
          username: adminFormData.username,
          userType: 'admin',
          loginTime: new Date().toISOString(),
        }));

        Alert.alert('Success', 'Admin login successful!');
        router.replace('/admin/admin-dashboard');
      } else {
        Alert.alert('Error', 'Invalid admin credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle skip login (only for customers)
  const handleSkipLogin = async () => {
    const dummyData = {
      phone: '9999999999',
      userType: 'customer',
      loginTime: new Date().toISOString(),
      name: 'Guest User',
      joinDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      isGuest: true,
    };
    
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(dummyData));
      router.replace('/productlist');
    } catch (error) {
      console.error('Skip login error:', error);
      router.replace('/productlist');
    }
  };

  // Handle input field changes for OTP form
  const handleInputChange = (field: keyof LoginForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Handle input field changes for admin form
  const handleAdminInputChange = (field: keyof AdminLoginForm, value: string) => {
    setAdminFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2', '#667eea']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
            
            {/* App Logo/Title */}
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <Ionicons name="storefront-outline" size={40} color="#fff" />
              </View>
              <Text style={styles.title}>QuickShop</Text>
              <Text style={styles.subtitle}>Fast Delivery & Fresh Products</Text>
            </View>

            {/* User Type Selector */}
            <View style={styles.userTypeContainer}>
              <TouchableOpacity
                style={[styles.userTypeCard, userType === 'customer' && styles.userTypeCardActive]}
                onPress={() => setUserType('customer')}
              >
                <View style={styles.userTypeIcon}>
                  <Ionicons name="person-outline" size={24} color={userType === 'customer' ? '#fff' : '#667eea'} />
                </View>
                <Text style={[styles.userTypeText, userType === 'customer' && styles.userTypeTextActive]}>
                  Customer
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.userTypeCard, userType === 'shopkeeper' && styles.userTypeCardActive]}
                onPress={() => setUserType('shopkeeper')}
              >
                <View style={styles.userTypeIcon}>
                  <Ionicons name="cart-outline" size={24} color={userType === 'shopkeeper' ? '#fff' : '#667eea'} />
                </View>
                <Text style={[styles.userTypeText, userType === 'shopkeeper' && styles.userTypeTextActive]}>
                  Shopkeeper
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.userTypeCard, userType === 'admin' && styles.userTypeCardActive]}
                onPress={() => setUserType('admin')}
              >
                <View style={styles.userTypeIcon}>
                  <Ionicons name="shield-outline" size={24} color={userType === 'admin' ? '#fff' : '#667eea'} />
                </View>
                <Text style={[styles.userTypeText, userType === 'admin' && styles.userTypeTextActive]}>
                  Admin
                </Text>
              </TouchableOpacity>
            </View>

            {/* Login Forms */}
            <View style={styles.formContainer}>
              <View style={styles.formCard}>
                
                {/* Customer & Shopkeeper Login (OTP based) */}
                {(userType === 'customer' || userType === 'shopkeeper') && (
                  <>
                    {/* Phone Input */}
                    <View style={styles.inputWrapper}>
                      <View style={styles.inputLabel}>
                        <Ionicons name="call-outline" size={20} color="#667eea" />
                        <Text style={styles.label}>Phone Number</Text>
                      </View>
                      <TextInput
                        style={[styles.input, errors.phone ? styles.inputError : null]}
                        placeholder="Enter 10-digit phone number"
                        placeholderTextColor="#999"
                        value={formData.phone}
                        onChangeText={(value) => handleInputChange('phone', value)}
                        keyboardType="phone-pad"
                        maxLength={10}
                        editable={!otpSent && !loading}
                        autoComplete="tel"
                      />
                      {errors.phone && (
                        <Text style={styles.errorText}>{errors.phone}</Text>
                      )}
                    </View>

                    {/* OTP Input */}
                    {otpSent && (
                      <View style={styles.inputWrapper}>
                        <View style={styles.inputLabel}>
                          <Ionicons name="lock-closed-outline" size={20} color="#667eea" />
                          <Text style={styles.label}>Enter OTP</Text>
                        </View>
                        <TextInput
                          style={[styles.input, errors.otp ? styles.inputError : null]}
                          placeholder="6-digit OTP"
                          placeholderTextColor="#999"
                          value={formData.otp}
                          onChangeText={(value) => handleInputChange('otp', value)}
                          keyboardType="number-pad"
                          maxLength={6}
                          editable={!loading}
                        />
                        {errors.otp && <Text style={styles.errorText}>{errors.otp}</Text>}
                        {countdown > 0 && (
                          <Text style={styles.countdownText}>Resend OTP in {countdown}s</Text>
                        )}
                      </View>
                    )}

                    {/* Action Buttons */}
                    {!otpSent ? (
                      <TouchableOpacity
                        style={[styles.sendOtpButton, (loading || !formData.phone) && styles.buttonDisabled]}
                        onPress={handleSendOtp}
                        disabled={loading || !formData.phone}
                      >
                        {loading ? (
                          <ActivityIndicator color="#fff" size="small" />
                        ) : (
                          <>
                            <Ionicons name="send-outline" size={20} color="#fff" />
                            <Text style={styles.sendOtpText}>Send OTP</Text>
                          </>
                        )}
                      </TouchableOpacity>
                    ) : (
                      <>
                        <TouchableOpacity
                          style={[styles.loginButton, (loading || !formData.otp) && styles.buttonDisabled]}
                          onPress={handleOtpLogin}
                          disabled={loading || !formData.otp}
                        >
                          {loading ? (
                            <ActivityIndicator color="#fff" size="small" />
                          ) : (
                            <>
                              <Ionicons name="log-in-outline" size={20} color="#fff" />
                              <Text style={styles.loginText}>
                                {userType === 'customer' ? 'Login as Customer' : 'Login as Shopkeeper'}
                              </Text>
                            </>
                          )}
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                          style={styles.resendButton}
                          onPress={handleSendOtp}
                          disabled={countdown > 0 || loading}
                        >
                          <Ionicons name="refresh-outline" size={16} color="#667eea" />
                          <Text style={styles.resendText}>Resend OTP</Text>
                        </TouchableOpacity>
                      </>
                    )}
                  </>
                )}

                {/* Admin Login (Username/Password based) */}
                {userType === 'admin' && (
                  <>
                    {/* Username Input */}
                    <View style={styles.inputWrapper}>
                      <View style={styles.inputLabel}>
                        <Ionicons name="person-outline" size={20} color="#667eea" />
                        <Text style={styles.label}>Username</Text>
                      </View>
                      <TextInput
                        style={[styles.input, errors.username ? styles.inputError : null]}
                        placeholder="Enter admin username"
                        placeholderTextColor="#999"
                        value={adminFormData.username}
                        onChangeText={(value) => handleAdminInputChange('username', value)}
                        autoCapitalize="none"
                        editable={!loading}
                      />
                      {errors.username && (
                        <Text style={styles.errorText}>{errors.username}</Text>
                      )}
                    </View>

                    {/* Password Input */}
                    <View style={styles.inputWrapper}>
                      <View style={styles.inputLabel}>
                        <Ionicons name="lock-closed-outline" size={20} color="#667eea" />
                        <Text style={styles.label}>Password</Text>
                      </View>
                      <TextInput
                        style={[styles.input, errors.password ? styles.inputError : null]}
                        placeholder="Enter password"
                        placeholderTextColor="#999"
                        value={adminFormData.password}
                        onChangeText={(value) => handleAdminInputChange('password', value)}
                        secureTextEntry
                        editable={!loading}
                      />
                      {errors.password && (
                        <Text style={styles.errorText}>{errors.password}</Text>
                      )}
                    </View>

                    {/* Admin Login Button */}
                    <TouchableOpacity
                      style={[styles.loginButton, loading && styles.buttonDisabled]}
                      onPress={handleAdminLogin}
                      disabled={loading || !adminFormData.username || !adminFormData.password}
                    >
                      {loading ? (
                        <ActivityIndicator color="#fff" size="small" />
                      ) : (
                        <>
                          <Ionicons name="shield-outline" size={20} color="#fff" />
                          <Text style={styles.loginText}>Admin Login</Text>
                        </>
                      )}
                    </TouchableOpacity>

                    {/* Demo Credentials */}
                    <View style={styles.demoContainer}>
                      <Text style={styles.demoTitle}>Demo Credentials</Text>
                      <Text style={styles.demoText}>Username: admin</Text>
                      <Text style={styles.demoText}>Password: admin123</Text>
                    </View>
                  </>
                )}
              </View>
            </View>

            {/* Skip Login - Only show for customer */}
            {userType === 'customer' && (
              <TouchableOpacity 
                style={styles.skipContainer}
                onPress={handleSkipLogin}
              >
                <Text style={styles.skipText}>Continue as Guest</Text>
                <Ionicons name="arrow-forward" size={16} color="#fff" />
              </TouchableOpacity>
            )}

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>By continuing, you agree to our</Text>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Terms & Conditions</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 30,
  },
  content: {
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  logoContainer: {
    width: 100,
    height: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  userTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    gap: 10,
  },
  userTypeCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    paddingVertical: 15,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  userTypeCardActive: {
    backgroundColor: '#667eea',
    borderColor: '#fff',
    transform: [{ scale: 1.05 }],
  },
  userTypeIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  userTypeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#667eea',
  },
  userTypeTextActive: {
    color: '#fff',
  },
  formContainer: {
    marginBottom: 30,
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  inputWrapper: {
    marginBottom: 20,
  },
  inputLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#333',
  },
  inputError: {
    borderColor: '#ff4757',
  },
  errorText: {
    color: '#ff4757',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 4,
  },
  countdownText: {
    color: '#667eea',
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
  sendOtpButton: {
    backgroundColor: '#667eea',
    borderRadius: 12,
    paddingVertical: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  sendOtpText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  loginButton: {
    backgroundColor: '#667eea',
    borderRadius: 12,
    paddingVertical: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  loginText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  resendButton: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 2,
    borderColor: '#667eea',
  },
  resendText: {
    color: '#667eea',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  demoContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#e8f4fd',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3498db',
    marginBottom: 8,
  },
  demoText: {
    fontSize: 12,
    color: '#2c3e50',
    marginBottom: 4,
  },
  skipContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  skipText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginRight: 8,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    marginBottom: 4,
  },
  footerLink: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;