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
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

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

const ProfileInfo: React.FC = () => {
  const router = useRouter();
  const [profile, setProfile] = useState<ShopProfile | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    loadProfile();
    loadImages();
  }, []);

  const loadProfile = async () => {
    try {
      const storedProfile = await AsyncStorage.getItem('shopProfile');
      if (storedProfile) {
        setProfile(JSON.parse(storedProfile));
      } else {
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
        setProfile(demoProfile);
        await AsyncStorage.setItem('shopProfile', JSON.stringify(demoProfile));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      Alert.alert('Error', 'Failed to load profile data');
    }
  };

  const loadImages = async () => {
    try {
      // Demo images - in real app, fetch from API/storage
      const demoImages = [
        'https://picsum.photos/300/200?random=1',
        'https://picsum.photos/300/200?random=2',
        'https://picsum.photos/300/200?random=3',
        'https://picsum.photos/300/200?random=4',
      ];
      setImages(demoImages);
      
      // You can also load from AsyncStorage if saved
      const storedImages = await AsyncStorage.getItem('shopImages');
      if (storedImages) {
        setImages(JSON.parse(storedImages));
      }
    } catch (error) {
      console.error('Error loading images:', error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadProfile();
    loadImages();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleViewOnMap = () => {
    if (profile?.gpsCoordinates) {
      Alert.alert(
        'Location',
        `Latitude: ${profile.gpsCoordinates.latitude}\nLongitude: ${profile.gpsCoordinates.longitude}`,
        [{ text: 'OK' }]
      );
    }
  };

  const handleViewImage = (imageUrl: string) => {
    Alert.alert(
      'View Image',
      'Full screen image view would open here',
      [{ text: 'OK' }]
    );
  };

  const profileFields = [
    { icon: 'store' as const, label: 'Shop ID', value: profile?.shopId },
    { icon: 'store' as const, label: 'Shop Name', value: profile?.shopName },
    { icon: 'person' as const, label: 'Owner Name', value: profile?.ownerName },
    { icon: 'phone' as const, label: 'Phone Number', value: profile?.phoneNumber },
    { icon: 'email' as const, label: 'Email', value: profile?.email },
    { icon: 'location-on' as const, label: 'Address', value: profile?.address },
    { icon: 'location-city' as const, label: 'Zipcode', value: profile?.zipcode },
  ];

  const renderImageItem = ({ item }: { item: string }) => (
    <TouchableOpacity 
      style={styles.imageItem}
      onPress={() => handleViewImage(item)}
      activeOpacity={0.7}
    >
      <Image source={{ uri: item }} style={styles.image} />
      <View style={styles.imageOverlay}>
        <MaterialIcons name="zoom-in" size={24} color="#fff" />
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView 
      style={styles.container} 
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {profile?.shopName?.charAt(0) || 'S'}
              </Text>
            </View>
          </View>
          
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

      {/* Profile Details */}
      <View style={styles.detailsSection}>
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Shop Information</Text>
          
          {profileFields.map((field, index) => (
            <View key={index} style={styles.detailRow}>
              <View style={styles.detailLabelContainer}>
                <MaterialIcons 
                  name={field.icon} 
                  size={20} 
                  color="#666" 
                  style={styles.detailIcon} 
                />
                <Text style={styles.detailLabel}>{field.label}</Text>
              </View>
              <Text style={styles.detailValue}>
                {field.value || 'Not Available'}
              </Text>
            </View>
          ))}

          {/* GPS Coordinates */}
          {profile?.gpsCoordinates && (
            <TouchableOpacity 
              style={[styles.detailRow, styles.gpsRow]}
              onPress={handleViewOnMap}
              activeOpacity={0.7}
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

      {/* Uploaded Images */}
      <View style={styles.imagesSection}>
        <View style={styles.sectionCard}>
          <View style={styles.imagesHeader}>
            <Text style={styles.sectionTitle}>Uploaded Images</Text>
            <Text style={styles.imagesCount}>
              {images.length} images
            </Text>
          </View>
          
          {images.length > 0 ? (
            <FlatList
              data={images}
              renderItem={renderImageItem}
              keyExtractor={(item, index) => index.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.imagesList}
              ListEmptyComponent={
                <Text style={styles.noImagesText}>No images uploaded</Text>
              }
            />
          ) : (
            <View style={styles.noImagesContainer}>
              <MaterialIcons name="photo-library" size={48} color="#ccc" />
              <Text style={styles.noImagesText}>No images uploaded yet</Text>
            </View>
          )}
          
          <TouchableOpacity 
            style={styles.uploadButton}
            onPress={() => {
              Alert.alert(
                'Upload Images',
                'Image upload feature coming soon',
                [{ text: 'OK' }]
              );
            }}
            activeOpacity={0.7}
          >
            <MaterialIcons name="add-a-photo" size={20} color="#2196F3" />
            <Text style={styles.uploadButtonText}>Upload New Images</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => {
            Alert.alert(
              'Edit Profile',
              'Profile editing feature coming soon',
              [{ text: 'OK' }]
            );
          }}
        >
          <MaterialIcons name="edit" size={20} color="#2196F3" />
          <Text style={styles.editButtonText}>Edit Profile</Text>
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
    backgroundColor: '#4CAF50',
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    zIndex: 10,
    padding: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
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
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  headerInfo: {
    flex: 1,
  },
  shopName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  shopId: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
  },
  detailsSection: {
    padding: 20,
    paddingTop: 24,
  },
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f9f9f9',
  },
  gpsRow: {
    marginTop: 8,
  },
  detailLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailIcon: {
    marginRight: 12,
    width: 24,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'right',
    flex: 1,
  },
  gpsValue: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  gpsText: {
    fontSize: 12,
    color: '#666',
    marginRight: 8,
  },
  imagesSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  imagesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  imagesCount: {
    fontSize: 14,
    color: '#666',
  },
  imagesList: {
    paddingVertical: 8,
  },
  imageItem: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginRight: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
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
  noImagesContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  noImagesText: {
    fontSize: 14,
    color: '#999',
    marginTop: 12,
    textAlign: 'center',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    marginTop: 16,
    gap: 8,
  },
  uploadButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2196F3',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 8,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2196F3',
    gap: 8,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2196F3',
  },
});

export default ProfileInfo;