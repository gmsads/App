// Import necessary React and React Native components
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image,
  Alert,
  FlatList,
  Modal,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

// Get screen dimensions for responsive design
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Define the ShopProfile type structure
type ShopProfile = {
  shopId: string;
  shopName: string;
  ownerName: string;
  phoneNumber: string;
  email: string;
  gpsCoordinates?: {
    latitude: number;
    longitude: number;
  };
  address: string;
  zipcode: string;
  uploadedImages?: string[];
};

// Main ProfileInfo component
const ProfileInfo: React.FC = () => {
  // Initialize router for navigation
  const router = useRouter();
  
  // State for shop profile data
  const [profile, setProfile] = useState<ShopProfile | null>(null);
  
  // State for pull-to-refresh functionality
  const [refreshing, setRefreshing] = useState(false);
  
  // State for storing uploaded images
  const [images, setImages] = useState<string[]>([]);
  
  // State for managing full-screen image modal
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  
  // State for currently selected image URL
  const [selectedImage, setSelectedImage] = useState<string>('');

  // Load profile and images when component mounts
  useEffect(() => {
    loadProfile();
    loadImages();
  }, []);

  // Function to load shop profile from AsyncStorage
  const loadProfile = async () => {
    try {
      // Try to get profile from AsyncStorage
      const storedProfile = await AsyncStorage.getItem('shopProfile');
      if (storedProfile) {
        // If found, parse and set to state
        setProfile(JSON.parse(storedProfile));
      } else {
        // If not found, create a demo profile
        const demoProfile: ShopProfile = {
          shopId: 'SHOP12345',
          shopName: 'FreshMart Supermarket',
          ownerName: 'Rajesh Kumar',
          phoneNumber: '+91 9876543210',
          email: 'rajesh@freshmart.com',
          gpsCoordinates: {
            latitude: 28.6139,
            longitude: 77.2090,
          },
          address: '123 Main Street, Market Area, New Delhi',
          zipcode: '110001',
        };
        // Set demo profile to state
        setProfile(demoProfile);
        // Save demo profile to AsyncStorage
        await AsyncStorage.setItem('shopProfile', JSON.stringify(demoProfile));
      }
    } catch (error) {
      // Handle any errors that occur during loading
      console.error('Error loading profile:', error);
      Alert.alert('Error', 'Failed to load profile data');
    }
  };

  // Function to load images (demo images in this case)
  const loadImages = async () => {
    try {
      // Create an array of demo image URLs
      const demoImages = [
        'https://picsum.photos/300/200?random=1',
        'https://picsum.photos/300/200?random=2',
        'https://picsum.photos/300/200?random=3',
        'https://picsum.photos/300/200?random=4',
        'https://picsum.photos/300/200?random=5',
        'https://picsum.photos/300/200?random=6',
      ];
      // Set demo images to state
      setImages(demoImages);
      
      // You can also load from AsyncStorage if saved in real app
      const storedImages = await AsyncStorage.getItem('shopImages');
      if (storedImages) {
        setImages(JSON.parse(storedImages));
      }
    } catch (error) {
      // Handle any errors that occur during image loading
      console.error('Error loading images:', error);
    }
  };

  // Function to handle pull-to-refresh
  const onRefresh = () => {
    // Set refreshing to true to show loading indicator
    setRefreshing(true);
    // Reload profile and images
    loadProfile();
    loadImages();
    // Stop refreshing after 1 second
    setTimeout(() => setRefreshing(false), 1000);
  };

  // Function to handle location view on map
  const handleViewOnMap = () => {
    // Check if profile has GPS coordinates
    if (profile?.gpsCoordinates) {
      // Show coordinates in an alert (in real app would open map)
      Alert.alert(
        'Location Coordinates',
        `Latitude: ${profile.gpsCoordinates.latitude}\nLongitude: ${profile.gpsCoordinates.longitude}`,
        [{ text: 'OK' }]
      );
    }
  };

  // Function to show confirmation before opening full-screen image
  const handleViewImage = (imageUrl: string) => {
    // Show confirmation alert before opening full screen
    Alert.alert(
      'View Image', // Alert title
      'Do you want to view this image in full screen?', // Alert message
      [
        // Cancel button - does nothing
        {
          text: 'Cancel', // Button text
          style: 'cancel', // Button style
        },
        // OK button - opens full screen image
        {
          text: 'OK', // Button text
          onPress: () => {
            // Set the selected image URL
            setSelectedImage(imageUrl);
            // Show the modal
            setIsImageModalVisible(true);
          },
        },
      ]
    );
  };

  // Function to close the full-screen image modal
  const handleCloseImageModal = () => {
    // Hide the modal
    setIsImageModalVisible(false);
    // Clear the selected image
    setSelectedImage('');
  };

  // Array of profile fields with icons and labels
  const profileFields = [
    { icon: 'store' as const, label: 'Shop ID', value: profile?.shopId },
    { icon: 'store' as const, label: 'Shop Name', value: profile?.shopName },
    { icon: 'person' as const, label: 'Owner Name', value: profile?.ownerName },
    { icon: 'phone' as const, label: 'Phone Number', value: profile?.phoneNumber },
    { icon: 'email' as const, label: 'Email', value: profile?.email },
    { icon: 'location-on' as const, label: 'Address', value: profile?.address },
    { icon: 'location-city' as const, label: 'Zipcode', value: profile?.zipcode },
  ];

  // Function to render each image item in the FlatList
  const renderImageItem = ({ item }: { item: string }) => (
    <TouchableOpacity 
      style={styles.imageItem} // Apply image item styles
      onPress={() => handleViewImage(item)} // Show confirmation alert on press
      activeOpacity={0.7} // Set touch opacity
    >
      {/* Thumbnail image */}
      <Image 
        source={{ uri: item }} // Image URL from item
        style={styles.image} // Apply image styles
        resizeMode="cover" // Cover the entire container
      />
      {/* Overlay with zoom icon */}
      <View style={styles.imageOverlay}>
        <MaterialIcons name="zoom-in" size={24} color="#fff" />
      </View>
    </TouchableOpacity>
  );

  // Main component render
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.container} // Apply container styles
        refreshControl={
          // Add pull-to-refresh functionality
          <RefreshControl 
            refreshing={refreshing} // Show refreshing indicator
            onRefresh={onRefresh} // Function to call on refresh
            colors={['#4CAF50']} // Customize loading color
          />
        }
      >
        {/* Header Section */}
        <View style={styles.header}>
          {/* Back Button */}
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()} // Navigate back
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          
          {/* Header Content */}
          <View style={styles.headerContent}>
            {/* Avatar/Logo Container */}
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                {/* Show first letter of shop name */}
                <Text style={styles.avatarText}>
                  {profile?.shopName?.charAt(0) || 'S'}
                </Text>
              </View>
            </View>
            
            {/* Shop Info */}
            <View style={styles.headerInfo}>
              <Text style={styles.shopName}>
                {profile?.shopName || 'Loading...'}
              </Text>
              <Text style={styles.shopId}>
                ID: {profile?.shopId || 'SHOP12345'}
              </Text>
            </View>
          </View>
        </View>

        {/* Profile Details Section */}
        <View style={styles.detailsSection}>
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Shop Information</Text>
            
            {/* Map through profile fields and render each */}
            {profileFields.map((field, index) => (
              <View key={index} style={styles.detailRow}>
                {/* Field label with icon */}
                <View style={styles.detailLabelContainer}>
                  <MaterialIcons 
                    name={field.icon} 
                    size={20} 
                    color="#666" 
                    style={styles.detailIcon} 
                  />
                  <Text style={styles.detailLabel}>{field.label}</Text>
                </View>
                {/* Field value */}
                <Text style={styles.detailValue}>
                  {field.value || 'Not Available'}
                </Text>
              </View>
            ))}

            {/* GPS Coordinates Row (Clickable) */}
            {profile?.gpsCoordinates && (
              <TouchableOpacity 
                style={[styles.detailRow, styles.gpsRow]}
                onPress={handleViewOnMap} // Show coordinates on press
                activeOpacity={0.7} // Set touch opacity
              >
                <View style={styles.detailLabelContainer}>
                  <MaterialIcons 
                    name="my-location" 
                    size={20} 
                    color="#666" 
                    style={styles.detailIcon} 
                  />
                  <Text style={styles.detailLabel}>Location Coordinates</Text>
                </View>
                <View style={styles.gpsValue}>
                  <Text style={styles.gpsText}>
                    {profile.gpsCoordinates.latitude.toFixed(4)}, 
                    {profile.gpsCoordinates.longitude.toFixed(4)}
                  </Text>
                  <MaterialIcons name="chevron-right" size={20} color="#999" />
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Uploaded Images Section */}
        <View style={styles.imagesSection}>
          <View style={styles.sectionCard}>
            {/* Images header with count */}
            <View style={styles.imagesHeader}>
              <Text style={styles.sectionTitle}>Uploaded Images</Text>
              <Text style={styles.imagesCount}>
                {images.length} images
              </Text>
            </View>
            
            {/* Images List */}
            {images.length > 0 ? (
              <FlatList
                data={images} // Array of image URLs
                renderItem={renderImageItem} // Render function for each item
                keyExtractor={(item, index) => index.toString()} // Unique key
                horizontal // Horizontal scrolling
                showsHorizontalScrollIndicator={false} // Hide scroll indicator
                contentContainerStyle={styles.imagesList} // List container style
              />
            ) : (
              // Show empty state when no images
              <View style={styles.noImagesContainer}>
                <MaterialIcons name="photo-library" size={48} color="#ccc" />
                <Text style={styles.noImagesText}>No images uploaded yet</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Full Screen Image Modal - Only opens when user clicks OK in alert */}
      <Modal
        visible={isImageModalVisible} // Control modal visibility
        transparent={true} // Make background transparent
        animationType="fade" // Fade animation
        onRequestClose={handleCloseImageModal} // Handle Android back button
      >
        {/* Modal Background */}
        <View style={styles.modalContainer}>
          {/* Close Button */}
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={handleCloseImageModal} // Close modal on press
          >
            <Ionicons name="close" size={30} color="#fff" />
          </TouchableOpacity>
          
          {/* Full Screen Image */}
          <Image 
            source={{ uri: selectedImage }} // Selected image URL
            style={styles.fullScreenImage} // Full screen style
            resizeMode="contain" // Fit image within screen
          />
          
          {/* Image Info */}
          <View style={styles.imageInfoContainer}>
            <Text style={styles.imageInfoText}>
              Shop: {profile?.shopName || 'Unknown Shop'}
            </Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// Stylesheet for all components
const styles = StyleSheet.create({
  // Safe area for notch devices
  safeArea: {
    flex: 1,
    backgroundColor: '#4CAF50', // Match header color
  },
  // Main container
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  // Header styles
  header: {
    backgroundColor: '#4CAF50',
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    position: 'relative',
  },
  // Back button in header
  backButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    zIndex: 10,
    padding: 8,
  },
  // Header content container
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  // Avatar container
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  // Avatar circle
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  // Avatar text (first letter)
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  // Header info container
  headerInfo: {
    flex: 1,
  },
  // Shop name text
  shopName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  // Shop ID text
  shopId: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
  },
  // Details section container
  detailsSection: {
    padding: 20,
    paddingTop: 24,
  },
  // Section card (white box)
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  // Section title
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  // Detail row (each field)
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f9f9f9',
  },
  // GPS row special styling
  gpsRow: {
    marginTop: 8,
  },
  // Label container with icon
  detailLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  // Detail icon
  detailIcon: {
    marginRight: 12,
    width: 24,
  },
  // Detail label text
  detailLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  // Detail value text
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'right',
    flex: 1,
  },
  // GPS value container
  gpsValue: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  // GPS text
  gpsText: {
    fontSize: 12,
    color: '#666',
    marginRight: 8,
  },
  // Images section container
  imagesSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  // Images header with count
  imagesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  // Images count text
  imagesCount: {
    fontSize: 14,
    color: '#666',
  },
  // Images list container
  imagesList: {
    paddingVertical: 8,
  },
  // Individual image item
  imageItem: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginRight: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  // Thumbnail image
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  // Image overlay with zoom icon
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // No images container
  noImagesContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  // No images text
  noImagesText: {
    fontSize: 14,
    color: '#999',
    marginTop: 12,
    textAlign: 'center',
  },
  // Modal container (full screen background)
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)', // Dark semi-transparent background
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Close button in modal
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1000,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
  },
  // Full screen image
  fullScreenImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.8, // 80% of screen height
  },
  // Image info container
  imageInfoContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  // Image info text
  imageInfoText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
});

// Export the component
export default ProfileInfo;