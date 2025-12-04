// Import necessary components from React and React Native
import { useRouter } from 'expo-router'; // Navigation
import React, { useState } from 'react';
import {
  ActivityIndicator, // Loading spinner
  Alert, // Popup alerts
  KeyboardAvoidingView, // Handles keyboard overlapping
  Platform, // Detect iOS/Android
  ScrollView, // Scrollable container
  StyleSheet, // CSS-like styles
  Text, // Display text
  TextInput, // Input fields
  TouchableOpacity, // Pressable buttons
  View, // Container like div
} from 'react-native';

// Define the shape of our login form data
interface LoginForm {
  email: string;      // Email field
  password: string;   // Password field
}

// Main LoginScreen component
const LoginScreen: React.FC = () => {
  // Initialize router for navigation
  const router = useRouter();
  
  // State for form data with initial empty values
  const [formData, setFormData] = useState<LoginForm>({
    email: '',        // Start with empty email
    password: '',     // Start with empty password
  });
  
  // State for loading indicator
  const [loading, setLoading] = useState<boolean>(false);
  
  // State for validation errors
  const [errors, setErrors] = useState<Partial<LoginForm>>({});

  // Function to validate form inputs
  const validateForm = (): boolean => {
    // Create empty errors object
    const newErrors: Partial<LoginForm> = {};

    // Check if email is empty
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } 
    // Check if email format is valid using regex
    else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    // Check if password is empty
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } 
    // Check if password is at least 6 characters
    else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Update errors state
    setErrors(newErrors);
    
    // Return true if no errors (form is valid)
    return Object.keys(newErrors).length === 0;
  };

  // Handle input field changes
  const handleInputChange = (field: keyof LoginForm, value: string) => {
    // Update form data with new value
    setFormData(prev => ({
      ...prev,          // Keep existing fields
      [field]: value,   // Update specific field
    }));
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined, // Remove error for this field
      }));
    }
  };

  // Handle login button press
  const handleLogin = async () => {
    // Validate form first
    if (!validateForm()) {
      return; // Stop if form is invalid
    }

    // Show loading spinner
    setLoading(true);

    try {
      // Simulate API call with 2 second delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo - accept any valid credentials
      if (formData.email && formData.password) {
        // Show success message
        Alert.alert('Success', 'Login successful!');
        
        // Navigate to product list screen
router.replace('/productlist');
        
      } else {
        // Show error for invalid credentials
        Alert.alert('Error', 'Invalid credentials');
      }
    } catch (error) {
      // Show generic error message
      Alert.alert('Error', 'Login failed. Please try again.');
    } finally {
      // Hide loading spinner whether success or error
      setLoading(false);
    }
  };

  // Render the component UI
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          {/* Header Title */}
          <Text style={styles.title}>Welcome Back</Text>
          
          {/* Subtitle */}
          <Text style={styles.subtitle}>Sign in to your account</Text>

          {/* Form Container */}
          <View style={styles.form}>
            
            {/* Email Input Section */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[
                  styles.input,
                  errors.email && styles.inputError, // Red border if error
                ]}
                placeholder="Enter your email"
                placeholderTextColor="#999"
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
              {/* Show error message if exists */}
              {errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}
            </View>

            {/* Password Input Section */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={[
                  styles.input,
                  errors.password && styles.inputError, // Red border if error
                ]}
                placeholder="Enter your password"
                placeholderTextColor="#999"
                value={formData.password}
                onChangeText={(value) => handleInputChange('password', value)}
                secureTextEntry // Hide password characters
                autoCapitalize="none"
              />
              {/* Show error message if exists */}
              {errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}
            </View>

            {/* Login Button */}
            <TouchableOpacity
              style={[
                styles.loginButton, 
                loading && styles.loginButtonDisabled // Gray out when loading
              ]}
              onPress={handleLogin}
              disabled={loading} // Disable when loading
            >
              {loading ? (
                // Show spinner when loading
                <ActivityIndicator color="#fff" />
              ) : (
                // Show text when not loading
                <Text style={styles.loginButtonText}>Sign In</Text>
              )}
            </TouchableOpacity>

            {/* Forgot Password Link */}
            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>
                Forgot your password?
              </Text>
            </TouchableOpacity>
          </View>

          {/* Demo Credentials Info */}
          <View style={styles.demoContainer}>
            <Text style={styles.demoTitle}>Demo Credentials:</Text>
            <Text style={styles.demoText}>Email: any valid email format</Text>
            <Text style={styles.demoText}>Password: any 6+ characters</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// Styles for all components
const styles = StyleSheet.create({
  // Main container
  container: {
    flex: 1,                    // Take full screen
    backgroundColor: '#f5f5f5', // Light gray background
  },
  // Scrollable content
  scrollContainer: {
    flexGrow: 1, // Allow scrolling when content is large
  },
  // Main content area
  content: {
    flex: 1,                    // Take available space
    justifyContent: 'center',   // Center vertically
    paddingHorizontal: 24,      // Left/right padding
    paddingVertical: 40,        // Top/bottom padding
  },
  // Main title
  title: {
    fontSize: 32,              // Large text
    fontWeight: 'bold',        // Bold text
    color: '#333',             // Dark gray color
    textAlign: 'center',       // Center aligned
    marginBottom: 8,           // Space below
  },
  // Subtitle
  subtitle: {
    fontSize: 16,              // Medium text
    color: '#666',             // Medium gray color
    textAlign: 'center',       // Center aligned
    marginBottom: 40,          // Space below
  },
  // Form container
  form: {
    width: '100%',             // Full width
  },
  // Each input container
  inputContainer: {
    marginBottom: 20,          // Space between inputs
  },
  // Input label
  label: {
    fontSize: 16,              // Medium text
    fontWeight: '600',         // Semi-bold
    color: '#333',             // Dark gray
    marginBottom: 8,           // Space below label
  },
  // Text input style
  input: {
    backgroundColor: '#fff',   // White background
    borderWidth: 1,            // 1px border
    borderColor: '#ddd',       // Light gray border
    borderRadius: 8,           // Rounded corners
    paddingHorizontal: 16,     // Left/right padding
    paddingVertical: 12,       // Top/bottom padding
    fontSize: 16,              // Medium text
    color: '#333',             // Dark text
  },
  // Error state for input
  inputError: {
    borderColor: '#ff3b30',    // Red border for errors
  },
  // Error message text
  errorText: {
    color: '#ff3b30',          // Red color
    fontSize: 14,              // Small text
    marginTop: 4,              // Space above
  },
  // Login button
  loginButton: {
    backgroundColor: '#007AFF', // Blue background
    borderRadius: 8,            // Rounded corners
    paddingVertical: 16,        // Top/bottom padding
    alignItems: 'center',       // Center content
    marginTop: 20,              // Space above
  },
  // Disabled login button
  loginButtonDisabled: {
    backgroundColor: '#ccc',    // Gray when disabled
  },
  // Login button text
  loginButtonText: {
    color: '#fff',              // White text
    fontSize: 18,               // Large text
    fontWeight: '600',          // Semi-bold
  },
  // Forgot password container
  forgotPassword: {
    alignItems: 'center',       // Center content
    marginTop: 20,              // Space above
  },
  // Forgot password text
  forgotPasswordText: {
    color: '#007AFF',           // Blue color
    fontSize: 16,               // Medium text
  },
  // Demo credentials container
  demoContainer: {
    marginTop: 40,              // Space above
    padding: 16,                // Internal padding
    backgroundColor: '#e9f5ff', // Light blue background
    borderRadius: 8,            // Rounded corners
    borderLeftWidth: 4,         // Left border
    borderLeftColor: '#007AFF', // Blue left border
  },
  // Demo title
  demoTitle: {
    fontSize: 14,               // Small text
    fontWeight: 'bold',         // Bold
    color: '#007AFF',           // Blue color
    marginBottom: 8,            // Space below
  },
  // Demo text
  demoText: {
    fontSize: 12,               // Very small text
    color: '#666',              // Medium gray
    marginBottom: 4,            // Space below each line
  },
});

// Export the component
export default LoginScreen;