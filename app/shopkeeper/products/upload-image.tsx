import React, { useState, useEffect } from 'react';
import {
  View,
  Button,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  Linking,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, router } from 'expo-router';
import axios from 'axios';

// Cloudinary Configuration
const CLOUD_NAME = 'dxbuvrl6q';
const UPLOAD_PRESET = 'shop_product_uploads';
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

// Interface for upload details
interface UploadDetails {
  url: string;
  publicId: string;
  dimensions: string;
  size: string;
  format: string;
  createdAt?: string;
}

const UploadImageScreen = () => {
  const { productId, productName } = useLocalSearchParams();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [uploadDetails, setUploadDetails] = useState<UploadDetails | null>(null);
  const [lastUploadTime, setLastUploadTime] = useState<string>('');

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  // Function to open Cloudinary Media Library in browser
  const openCloudinaryConsole = () => {
    const url = `https://cloudinary.com/console/media_library/folders/shop_uploads`;
    Linking.openURL(url).catch(err => {
      console.error('Failed to open URL:', err);
      Alert.alert('Error', 'Could not open Cloudinary Console');
    });
  };

  // Function to verify image exists in Cloudinary
  const verifyImageInCloudinary = async (publicId: string) => {
    try {
      const verifyUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/image/upload/${publicId}`;
      console.log('🔍 Verifying image at:', verifyUrl);
      
      const response = await axios.get(verifyUrl);
      console.log('✅ Image verified in Cloudinary:', response.data);
      return { exists: true, data: response.data };
    } catch (error) {
      console.log('❌ Image not found or verification failed:', error);
      return { exists: false, error };
    }
  };

  const handleImagePick = async () => {
    if (!hasPermission) {
      Alert.alert('Permission Required', 'Please grant photo library access.');
      return;
    }

    setUploadProgress(0);
    setUploadDetails(null);
    
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result.canceled) return;

      if (result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        if (asset.uri) {
          const uriParts = asset.uri.split('.');
          const fileExtension = uriParts[uriParts.length - 1];
          const mimeType = `image/${fileExtension === 'png' ? 'png' : 'jpeg'}`;
          
          setImageUri(asset.uri);
          
          // Get file size for logging
          const fileSize = await getFileSize(asset.uri);
          console.log(`📄 Selected file: ${fileExtension.toUpperCase()}, Size: ${fileSize}`);
          
          await uploadToCloudinary(
            asset.uri, 
            `product_${productId || Date.now()}.${fileExtension}`,
            mimeType
          );
        }
      }
    } catch (error: any) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to select image');
    }
  };

  // Helper to get file size (approximate)
  const getFileSize = async (uri: string): Promise<string> => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const sizeInKB = (blob.size / 1024).toFixed(2);
      return `${sizeInKB} KB`;
    } catch {
      return 'Unknown size';
    }
  };

  const uploadToCloudinary = async (uri: string, name: string, type: string) => {
    const startTime = new Date();
    setLoading(true);
    setUploadProgress(10);

    try {
      setUploadProgress(30);
      
      console.log('🚀 Upload started at:', startTime.toISOString());
      console.log('📊 Upload Details:');
      console.log('  Cloud Name:', CLOUD_NAME);
      console.log('  Upload Preset:', UPLOAD_PRESET);
      console.log('  File:', name);
      console.log('  Type:', type);

      const formData = new FormData();
      
      formData.append('file', {
        uri: uri,
        name: name,
        type: type,
      } as any);
      
      formData.append('upload_preset', UPLOAD_PRESET);
      formData.append('folder', 'shop_uploads');

      setUploadProgress(50);
      
      console.log('📤 Sending POST request to:', UPLOAD_URL);
      const response = await axios.post(UPLOAD_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000,
      });

      const cloudinaryResult = response.data;
      const endTime = new Date();
      const uploadTime = endTime.getTime() - startTime.getTime();
      
      console.log('✅ UPLOAD COMPLETE!');
      console.log('⏱️  Upload duration:', uploadTime, 'ms');
      console.log('📦 Cloudinary Response:', cloudinaryResult);

      // Create upload details object
      const details: UploadDetails = {
        url: cloudinaryResult.secure_url,
        publicId: cloudinaryResult.public_id,
        dimensions: `${cloudinaryResult.width}x${cloudinaryResult.height}`,
        size: `${(cloudinaryResult.bytes / 1024).toFixed(2)} KB`,
        format: cloudinaryResult.format.toUpperCase(),
        createdAt: cloudinaryResult.created_at
      };
      
      setUploadDetails(details);
      setUploadProgress(70);
      setUploadedUrl(cloudinaryResult.secure_url);
      
      // Verify the image was saved
      console.log('🔍 Verifying upload...');
      const verification = await verifyImageInCloudinary(cloudinaryResult.public_id);
      
      setUploadProgress(100);
      setLastUploadTime(new Date().toLocaleTimeString());
      
      // Show success alert with details
      Alert.alert(
        '✅ Upload Successful!',
        `Image saved to Cloudinary\n\n` +
        `📏 Dimensions: ${details.dimensions}\n` +
        `📦 File Size: ${details.size}\n` +
        `🎨 Format: ${details.format}\n` +
        `⏱️  Upload Time: ${uploadTime}ms\n` +
        `🔍 Verification: ${verification.exists ? 'PASSED' : 'FAILED'}`,
        [
          {
            text: 'Use This Image',
            onPress: () => {
              router.back();
              router.setParams({ 
                imageUrl: cloudinaryResult.secure_url,
                publicId: cloudinaryResult.public_id 
              });
            }
          },
          {
            text: 'View in Console',
            onPress: openCloudinaryConsole
          },
          {
            text: 'Test URL',
            onPress: () => {
              // Test if image URL is accessible
              fetch(cloudinaryResult.secure_url)
                .then(res => {
                  if (res.ok) {
                    Alert.alert('URL Test', '✅ Image URL is accessible!');
                  } else {
                    Alert.alert('URL Test', '❌ Image URL is not accessible');
                  }
                })
                .catch(() => {
                  Alert.alert('URL Test', '❌ Failed to test URL');
                });
            }
          }
        ]
      );

    } catch (error: any) {
      console.error('❌ UPLOAD FAILED:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      
      let errorMessage = 'Failed to upload image';
      if (error.response?.data?.error?.message) {
        errorMessage = error.response.data.error.message;
      }
      
      Alert.alert('❌ Upload Failed', errorMessage);
    } finally {
      setLoading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Upload Product Image</Text>
      
      {productName && (
        <Text style={styles.productName}>Product: {productName}</Text>
      )}
      
      {/* Upload Status Card */}
      <View style={styles.statusCard}>
        <Text style={styles.statusTitle}>Upload Status</Text>
        <Text style={styles.statusText}>Cloud Name: <Text style={styles.code}>{CLOUD_NAME}</Text></Text>
        <Text style={styles.statusText}>Preset: <Text style={styles.code}>{UPLOAD_PRESET}</Text></Text>
        <Text style={styles.statusText}>Last Upload: <Text style={styles.highlight}>{lastUploadTime || 'None yet'}</Text></Text>
      </View>
      
      {/* Upload Button */}
      <TouchableOpacity
        style={[styles.uploadButton, (loading || !hasPermission) && styles.uploadButtonDisabled]}
        onPress={handleImagePick}
        disabled={loading || !hasPermission}
      >
        <Text style={styles.buttonText}>
          {loading ? '📤 Uploading...' : '📷 Select & Upload Image'}
        </Text>
      </TouchableOpacity>
      
      {/* Progress Bar */}
      {loading && (
        <View style={styles.progressContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.progressText}>Uploading... {uploadProgress}%</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${uploadProgress}%` }]} />
          </View>
        </View>
      )}
      
      {/* Image Preview */}
      {imageUri && !loading && (
        <View style={styles.imageContainer}>
          <Text style={styles.sectionTitle}>Selected Image:</Text>
          <Image source={{ uri: imageUri }} style={styles.image} />
        </View>
      )}
      
      {/* Upload Details */}
      {uploadDetails && !loading && (
        <View style={styles.detailsCard}>
          <Text style={styles.detailsTitle}>✅ Upload Details</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>URL:</Text>
            <Text style={styles.detailValue} numberOfLines={2}>{uploadDetails.url}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Public ID:</Text>
            <Text style={styles.detailValue}>{uploadDetails.publicId}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Dimensions:</Text>
            <Text style={styles.detailValue}>{uploadDetails.dimensions}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Size:</Text>
            <Text style={styles.detailValue}>{uploadDetails.size}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Format:</Text>
            <Text style={styles.detailValue}>{uploadDetails.format}</Text>
          </View>
          
          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => {
                router.back();
                router.setParams({ 
                  imageUrl: uploadDetails.url,
                  publicId: uploadDetails.publicId 
                });
              }}
            >
              <Text style={styles.actionButtonText}>Use This Image</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.secondaryButton]}
              onPress={openCloudinaryConsole}
            >
              <Text style={styles.secondaryButtonText}>View in Cloudinary</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      
      {/* Instructions */}
      <View style={styles.instructions}>
        <Text style={styles.instructionsTitle}>How to Verify Upload:</Text>
        <Text style={styles.instruction}>1. Check Console logs for "✅ UPLOAD COMPLETE"</Text>
        <Text style={styles.instruction}>2. Look for image in "shop_uploads" folder in Cloudinary</Text>
        <Text style={styles.instruction}>3. Click "View in Cloudinary" to open Media Library</Text>
        <Text style={styles.instruction}>4. Test the image URL in your browser</Text>
      </View>
      
      {/* Quick Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={styles.quickAction}
          onPress={openCloudinaryConsole}
        >
          <Text style={styles.quickActionText}>🌐 Open Cloudinary Console</Text>
        </TouchableOpacity>
        
        {uploadedUrl && (
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => Linking.openURL(uploadedUrl)}
          >
            <Text style={styles.quickActionText}>🔗 Open Image URL</Text>
          </TouchableOpacity>
        )}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#333',
  },
  productName: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
    fontStyle: 'italic',
  },
  statusCard: {
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2196f3',
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1976d2',
  },
  statusText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  code: {
    fontFamily: 'monospace',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 4,
    borderRadius: 3,
    color: '#d32f2f',
  },
  highlight: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  uploadButton: {
    backgroundColor: '#2196f3',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  uploadButtonDisabled: {
    backgroundColor: '#9e9e9e',
    opacity: 0.7,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  progressContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  progressText: {
    marginTop: 12,
    marginBottom: 8,
    color: '#666',
    fontSize: 14,
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 3,
  },
  imageContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
    alignSelf: 'flex-start',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  detailsCard: {
    backgroundColor: '#e8f5e9',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#2e7d32',
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    width: 80,
  },
  detailValue: {
    fontSize: 14,
    color: '#555',
    flex: 1,
    fontFamily: 'monospace',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 10,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#2196f3',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#2196f3',
  },
  secondaryButtonText: {
    color: '#2196f3',
    fontWeight: '600',
  },
  instructions: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  instruction: {
    color: '#666',
    marginVertical: 4,
    fontSize: 14,
    lineHeight: 20,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 10,
  },
  quickAction: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  quickActionText: {
    color: '#333',
    fontWeight: '500',
  },
});

export default UploadImageScreen;