// Line 1: Import React and useState hook for state management
import React, { useState } from 'react';

// Line 2-8: Import React Native components
import {
  View, // Container component
  Button, // Button component
  Image, // Image display component
  StyleSheet, // Styling utility
  Alert, // Alert dialog component
  ActivityIndicator, // Loading spinner
  Text, // Text display component
  TouchableOpacity, // Customizable button component
} from 'react-native';

// Line 9: Import image picker library for selecting images from device
import { launchImageLibrary, Asset } from 'react-native-image-picker';

// Line 10: Import Cloudinary functions from our service file
import { uploadImageToCloudinary, sendToBackend } from './CloudinaryService';

// Line 12: Define backend URL (replace with your actual backend)
const BACKEND_URL = 'YOUR_BACKEND_URL_HERE'; // Replace with your actual backend URL

// Line 14: Main App component
const App = () => {
  // Line 16: State for storing selected image URI
  const [imageUri, setImageUri] = useState<string | null>(null);
  
  // Line 17: State for storing uploaded Cloudinary URL
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  
  // Line 18: State for tracking loading status
  const [loading, setLoading] = useState<boolean>(false);
  
  // Line 19: State for tracking upload progress (0-100%)
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  // Line 22-58: Function to handle image selection
  const handleImagePick = async () => {
    // Line 23: Reset progress to 0
    setUploadProgress(0);
    
    // Line 26-31: Open image picker with configuration
    const result = await launchImageLibrary({
      mediaType: 'photo', // Only allow photos (not videos)
      quality: 0.8, // Image quality (0.0 to 1.0)
      maxWidth: 1024, // Maximum width
      maxHeight: 1024, // Maximum height
    });

    // Line 33-36: Check if user cancelled the picker
    if (result.didCancel) {
      console.log('User cancelled image picker');
      return;
    }

    // Line 38-41: Check for image picker errors
    if (result.errorCode) {
      Alert.alert('Error', `Image picker error: ${result.errorMessage}`);
      return;
    }

    // Line 43-47: Check if we got a valid asset
    const asset = result.assets?.[0];
    if (!asset || !asset.uri || !asset.type) {
      Alert.alert('Error', 'Could not get image information');
      return;
    }

    // Line 49-52: Extract asset properties
    const { uri, fileName, type } = asset;
    setImageUri(uri); // Store the local URI for display
    
    // Line 54: Call upload function with image data
    await uploadToCloudinary(uri, fileName || 'image.jpg', type);
  };

  // Line 57-105: Function to upload image to Cloudinary
  const uploadToCloudinary = async (uri: string, name: string, type: string) => {
    // Line 58-59: Set loading state and initial progress
    setLoading(true);
    setUploadProgress(10); // Start progress at 10%

    // Line 62-102: Try-catch block for error handling
    try {
      // Line 63: Update progress to 30%
      setUploadProgress(30);
      
      // Line 66-70: Upload image to Cloudinary
      const cloudinaryResult = await uploadImageToCloudinary({
        uri, // Local file URI
        name, // File name
        type, // MIME type
      });
      
      // Line 72-73: Update progress and store uploaded URL
      setUploadProgress(70);
      setUploadedUrl(cloudinaryResult.secure_url);
      
      // Line 76-83: Send to backend if URL is configured
      if (BACKEND_URL && BACKEND_URL !== 'YOUR_BACKEND_URL_HERE') {
        await sendToBackend(cloudinaryResult.secure_url, BACKEND_URL, {
          publicId: cloudinaryResult.public_id,
          dimensions: `${cloudinaryResult.width}x${cloudinaryResult.height}`,
        });
      }
      
      // Line 85-86: Set progress to 100% and show success alert
      setUploadProgress(100);
      
      Alert.alert(
        'Success! 🎉',
        `Image uploaded successfully.\n\nURL: ${cloudinaryResult.secure_url.substring(0, 60)}...`,
        [{ text: 'OK' }] // Button configuration
      );

    } catch (error: any) {
      // Line 94-100: Handle upload errors
      console.error('Upload process failed:', error);
      Alert.alert(
        'Upload Failed',
        error.message || 'Please check your Cloudinary credentials in CloudinaryService.tsx'
      );
    } finally {
      // Line 102-104: Always run - reset loading state and progress
      setLoading(false);
      setTimeout(() => setUploadProgress(0), 1000); // Reset progress after 1 second
    }
  };

  // Line 108-163: Component render method
  return (
    <View style={styles.container}>
      {/* Line 110-111: Title text */}
      <Text style={styles.title}>Image Upload to Cloudinary</Text>
      
      {/* Line 113-120: Upload button */}
      <TouchableOpacity
        style={styles.uploadButton}
        onPress={handleImagePick} // Trigger image selection
        disabled={loading} // Disable when uploading
      >
        <Text style={styles.buttonText}>
          {loading ? 'Uploading...' : '📷 Pick & Upload Image'}
        </Text>
      </TouchableOpacity>

      {/* Line 122-134: Progress indicator when loading */}
      {loading && (
        <View style={styles.progressContainer}>
          <ActivityIndicator size="large" color="#4A90E2" />
          <Text style={styles.progressText}>Uploading... {uploadProgress}%</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${uploadProgress}%` }]} />
          </View>
        </View>
      )}

      {/* Line 136-142: Display selected image */}
      {imageUri && !loading && (
        <View style={styles.imageContainer}>
          <Text style={styles.sectionTitle}>Selected Image:</Text>
          <Image source={{ uri: imageUri }} style={styles.image} />
        </View>
      )}

      {/* Line 144-159: Display uploaded URL */}
      {uploadedUrl && !loading && (
        <View style={styles.urlContainer}>
          <Text style={styles.sectionTitle}>Uploaded URL:</Text>
          <Text style={styles.urlText} numberOfLines={2}>
            {uploadedUrl}
          </Text>
          <Button
            title="Copy URL"
            onPress={() => {
              // Placeholder for clipboard functionality
              Alert.alert('Copied!', 'URL copied to clipboard');
            }}
          />
        </View>
      )}

      {/* Line 161-167: Setup instructions */}
      <View style={styles.instructions}>
        <Text style={styles.instructionsTitle}>Setup Instructions:</Text>
        <Text style={styles.instruction}>1. Replace CLOUD_NAME in CloudinaryService.tsx</Text>
        <Text style={styles.instruction}>2. Replace UPLOAD_PRESET in CloudinaryService.tsx</Text>
        <Text style={styles.instruction}>3. Create unsigned preset in Cloudinary Dashboard</Text>
      </View>
    </View>
  );
};

// Line 170-240: StyleSheet definitions
const styles = StyleSheet.create({
  // Line 171-175: Main container styles
  container: {
    flex: 1, // Take up all available space
    backgroundColor: '#f5f5f5', // Light gray background
    padding: 20, // Padding on all sides
    justifyContent: 'center', // Center content vertically
  },
  
  // Line 177-181: Title text styles
  title: {
    fontSize: 24, // Large font size
    fontWeight: 'bold', // Bold text
    textAlign: 'center', // Center align
    marginBottom: 30, // Space below
    color: '#333', // Dark gray color
  },
  
  // Line 183-188: Upload button styles
  uploadButton: {
    backgroundColor: '#4A90E2', // Blue color
    padding: 15, // Inner padding
    borderRadius: 8, // Rounded corners
    alignItems: 'center', // Center content horizontally
    marginBottom: 20, // Space below
  },
  
  // Line 190-194: Button text styles
  buttonText: {
    color: 'white', // White text
    fontSize: 18, // Medium font size
    fontWeight: '600', // Semi-bold
  },
  
  // Line 196-200: Progress container styles
  progressContainer: {
    alignItems: 'center', // Center content
    marginVertical: 20, // Vertical margin
  },
  
  // Line 202-206: Progress text styles
  progressText: {
    marginTop: 10, // Space above
    marginBottom: 5, // Space below
    color: '#666', // Medium gray color
  },
  
  // Line 208-213: Progress bar container
  progressBar: {
    width: '80%', // 80% of parent width
    height: 8, // 8 pixels height
    backgroundColor: '#e0e0e0', // Light gray background
    borderRadius: 4, // Slightly rounded corners
    overflow: 'hidden', // Clip child elements
  },
  
  // Line 215-218: Progress fill (the moving part)
  progressFill: {
    height: '100%', // Full height of parent
    backgroundColor: '#4A90E2', // Blue color
  },
  
  // Line 220-223: Image container styles
  imageContainer: {
    alignItems: 'center', // Center image
    marginTop: 20, // Space above
  },
  
  // Line 225-229: Section title styles
  sectionTitle: {
    fontSize: 16, // Medium font size
    fontWeight: '600', // Semi-bold
    marginBottom: 10, // Space below
    color: '#444', // Darker gray
  },
  
  // Line 231-237: Image styles
  image: {
    width: 250, // Fixed width
    height: 250, // Fixed height (square)
    borderRadius: 12, // Rounded corners
    borderWidth: 2, // Border thickness
    borderColor: '#ddd', // Light gray border
  },
  
  // Line 239-244: URL container styles
  urlContainer: {
    backgroundColor: 'white', // White background
    padding: 15, // Inner padding
    borderRadius: 8, // Rounded corners
    marginTop: 20, // Space above
    borderWidth: 1, // Border thickness
    borderColor: '#ddd', // Light gray border
  },
  
  // Line 246-252: URL text styles
  urlText: {
    backgroundColor: '#f9f9f9', // Very light gray background
    padding: 10, // Inner padding
    borderRadius: 4, // Slightly rounded corners
    marginBottom: 10, // Space below
    fontFamily: 'monospace', // Monospace font for URLs
    fontSize: 12, // Small font size
  },
  
  // Line 254-259: Instructions container
  instructions: {
    marginTop: 30, // Space above
    padding: 15, // Inner padding
    backgroundColor: '#fff8e1', // Light yellow background
    borderRadius: 8, // Rounded corners
    borderLeftWidth: 4, // Left border thickness
    borderLeftColor: '#ffc107', // Yellow border color
  },
  
  // Line 261-265: Instructions title
  instructionsTitle: {
    fontWeight: 'bold', // Bold text
    marginBottom: 8, // Space below
    color: '#333', // Dark gray color
  },
  
  // Line 267-271: Individual instruction lines
  instruction: {
    color: '#666', // Medium gray color
    marginVertical: 2, // Small vertical margin
    fontSize: 13, // Small font size
  },
});

// Line 274: Export the component as default
export default App;