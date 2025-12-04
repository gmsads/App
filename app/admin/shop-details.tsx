import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  Image,
  Dimensions,
  Modal,
  Platform,
  StatusBar,
  useWindowDimensions
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useShop } from './shop-context';

const ShopDetailsScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { shops, deleteShop } = useShop();
  const { width, height } = useWindowDimensions();
  
  const shopId = params.id as string;
  const shopParam = params.shop as string;
  
  // Calculate responsive image size
  const IMAGE_SIZE = (width - 48) / 4; // 4 images per row with better spacing
  const GAP_SIZE = 8;
  
  // State for image viewer
  const [selectedImageIndex, setSelectedImageIndex] = React.useState<number | null>(null);
  const [imageViewerVisible, setImageViewerVisible] = React.useState(false);
  
  // Parse the shop data from params or find from context
  let shopData;
  if (shopParam) {
    try {
      shopData = JSON.parse(shopParam);
    } catch (error) {
      console.error('Error parsing shop data:', error);
    }
  } else {
    shopData = shops.find(shop => shop.id === shopId);
  }

  // Handle image viewer
  const openImageViewer = (index: number) => {
    setSelectedImageIndex(index);
    setImageViewerVisible(true);
  };

  const closeImageViewer = () => {
    setImageViewerVisible(false);
    setSelectedImageIndex(null);
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (selectedImageIndex === null || !shopData?.files) return;
    
    const totalImages = shopData.files.length;
    if (direction === 'prev') {
      setSelectedImageIndex(prev => (prev === 0 ? totalImages - 1 : (prev || 0) - 1));
    } else {
      setSelectedImageIndex(prev => ((prev || 0) + 1) % totalImages);
    }
  };

  const handleEdit = () => {
    if (shopData) {
      router.push({
        pathname: '/admin/edit-shop',
        params: { 
          id: shopData.id, 
          shop: JSON.stringify(shopData) 
        }
      });
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Shop',
      `Are you sure you want to delete ${shopData?.name}? This action cannot be undone.`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteShop(shopData.id);
            Alert.alert('Success', 'Shop deleted successfully');
            router.back();
          }
        }
      ]
    );
  };

  const handleBack = () => {
    router.back();
  };

  // Function to render images gallery in responsive grid
  const renderImageGallery = () => {
    if (!shopData?.files || shopData.files.length === 0) {
      return (
        <View style={styles.noImagesContainer}>
          <Text style={styles.noImagesIcon}>🖼️</Text>
          <Text style={styles.noImagesText}>No images available</Text>
          <Text style={styles.noImagesSubText}>Upload images when editing the shop</Text>
        </View>
      );
    }

    return (
      <View style={styles.imagesGridContainer}>
        <View style={[styles.imageRow, { gap: GAP_SIZE }]}>
          {shopData.files.map((fileUri: string, index: number) => (
            <TouchableOpacity 
              key={index} 
              style={[styles.imageItem, { width: IMAGE_SIZE }]}
              onPress={() => openImageViewer(index)}
              activeOpacity={0.8}
            >
              <View style={[styles.imageWrapper, { width: IMAGE_SIZE, height: IMAGE_SIZE }]}>
                <Image 
                  source={{ uri: fileUri }} 
                  style={styles.thumbnail}
                  resizeMode="cover"
                />
                <View style={styles.imageOverlay}>
                  <Text style={styles.eyeIcon}>👁️</Text>
                </View>
                <View style={styles.imageIndexBadge}>
                  <Text style={styles.imageIndexText}>{index + 1}</Text>
                </View>
              </View>
              <Text style={styles.imageLabel} numberOfLines={1}>
                {getImageLabel(index)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  // Helper function to get image labels
  const getImageLabel = (index: number) => {
    const labels = [
      'Shopkeeper Photo',
      'Aadhar Card',
      'PAN Card',
      'Shop Photo',
      'Document 5',
      'Document 6',
      'Document 7',
      'Document 8'
    ];
    return labels[index] || `Document ${index + 1}`;
  };

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not available';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!shopData) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Shop Details</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>Shop not found</Text>
          <TouchableOpacity style={styles.backButtonFull} onPress={handleBack}>
            <Text style={styles.backButtonFullText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shop Details</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerActionButton} onPress={handleEdit}>
            <Text style={styles.headerActionIcon}>✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.headerActionButton, styles.deleteActionButton]} onPress={handleDelete}>
            <Text style={styles.headerActionIcon}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Shop Header Card */}
        <View style={styles.shopHeaderCard}>
          <View style={styles.shopAvatar}>
            {shopData.files?.[0] ? (
              <Image source={{ uri: shopData.files[0] }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.shopAvatarIcon}>🏪</Text>
            )}
          </View>
          <View style={styles.shopInfo}>
            <Text style={styles.shopName}>{shopData.name}</Text>
            <Text style={styles.shopOwner}>{shopData.owner}</Text>
            <View style={styles.shopMeta}>
              <View style={[
                styles.statusBadge, 
                shopData.status === 'Active' ? styles.activeBadge : styles.inactiveBadge
              ]}>
                <Text style={styles.statusIcon}>
                  {shopData.status === 'Active' ? '✅' : '❌'}
                </Text>
                <Text style={styles.statusText}>{shopData.status}</Text>
              </View>
              <Text style={styles.shopId}>ID: {shopData.shopId || shopData.id}</Text>
            </View>
          </View>
        </View>

        {/* Images Section - Responsive 4 per row */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>📸</Text>
            <View>
              <Text style={styles.sectionTitle}>Uploaded Documents & Photos</Text>
              <Text style={styles.imageCountText}>
                {shopData.files?.length || 0} {shopData.files?.length === 1 ? 'image' : 'images'} uploaded
              </Text>
            </View>
          </View>
          {renderImageGallery()}
          {shopData.files && shopData.files.length > 0 && (
            <Text style={styles.imageTip}>
              Tap on any image to view full screen
            </Text>
          )}
        </View>

        {/* Basic Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Shop ID</Text>
                <Text style={styles.infoValue}>{shopData.shopId || shopData.id}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Zone ID</Text>
                <Text style={[styles.infoValue, !shopData.zoneId && styles.emptyValue]}>
                  {shopData.zoneId || 'Not specified'}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Owner Name</Text>
                <Text style={styles.infoValue}>
                  {shopData.firstName} {shopData.lastName}
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Role</Text>
                <Text style={[styles.infoValue, !shopData.role && styles.emptyValue]}>
                  {shopData.role || 'SHOPKEEPER'}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Status</Text>
                <View style={[
                  styles.statusBadgeInline, 
                  shopData.status === 'Active' ? styles.activeBadge : styles.inactiveBadge
                ]}>
                  <Text style={styles.statusText}>{shopData.status}</Text>
                </View>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Radius</Text>
                <Text style={[styles.infoValue, !shopData.radius && styles.emptyValue]}>
                  {shopData.radius ? `${shopData.radius} km` : 'Not specified'}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Created Date</Text>
                <Text style={styles.infoValue}>
                  {shopData.createdAt ? new Date(shopData.createdAt).toLocaleDateString() : 'Not available'}
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Last Updated</Text>
                <Text style={styles.infoValue}>
                  {shopData.updatedAt ? new Date(shopData.updatedAt).toLocaleDateString() : 'Not available'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Contact Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Phone Number</Text>
                <Text style={styles.infoValue}>{shopData.phone}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Email Address</Text>
                <Text style={[styles.infoValue, !shopData.email && styles.emptyValue]}>
                  {shopData.email || 'Not provided'}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={[styles.infoItem, styles.fullWidthItem]}>
                <Text style={styles.infoLabel}>GPS Coordinates</Text>
                <Text style={[styles.infoValue, !shopData.gpsCoordinates && styles.emptyValue]}>
                  {shopData.gpsCoordinates || 'Not provided'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Address Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Address Details</Text>
          
          <View style={styles.addressCard}>
            <View style={styles.addressRow}>
              <Text style={styles.addressIcon}>📍</Text>
              <Text style={styles.addressText}>{shopData.address}</Text>
            </View>
            
            <View style={styles.addressDetails}>
              <View style={styles.addressDetailItem}>
                <Text style={styles.addressDetailLabel}>City</Text>
                <Text style={[styles.addressDetailValue, !shopData.city && styles.emptyValue]}>
                  {shopData.city || 'Not specified'}
                </Text>
              </View>
              <View style={styles.addressDetailItem}>
                <Text style={styles.addressDetailLabel}>State</Text>
                <Text style={[styles.addressDetailValue, !shopData.state && styles.emptyValue]}>
                  {shopData.state || 'Not specified'}
                </Text>
              </View>
              <View style={styles.addressDetailItem}>
                <Text style={styles.addressDetailLabel}>Country</Text>
                <Text style={[styles.addressDetailValue, !shopData.country && styles.emptyValue]}>
                  {shopData.country || 'Not specified'}
                </Text>
              </View>
              <View style={styles.addressDetailItem}>
                <Text style={styles.addressDetailLabel}>Zipcode</Text>
                <Text style={[styles.addressDetailValue, !shopData.zipcode && styles.emptyValue]}>
                  {shopData.zipcode || 'Not specified'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
            <Text style={styles.editButtonText}>✏️ Edit Shop</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteButtonText}>🗑️ Delete Shop</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Image Viewer Modal */}
      <Modal
        visible={imageViewerVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeImageViewer}
      >
        <View style={styles.imageViewerContainer}>
          <StatusBar barStyle="light-content" backgroundColor="#000" />
          
          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={closeImageViewer}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>

          {/* Image Count */}
          {selectedImageIndex !== null && shopData?.files && (
            <View style={styles.imageCounter}>
              <Text style={styles.imageCounterText}>
                {selectedImageIndex + 1} / {shopData.files.length}
              </Text>
              <Text style={styles.imageLabelText}>
                {getImageLabel(selectedImageIndex)}
              </Text>
            </View>
          )}

          {/* Navigation Buttons */}
          {selectedImageIndex !== null && shopData?.files && shopData.files.length > 1 && (
            <>
              <TouchableOpacity 
                style={[styles.navButton, styles.prevButton]}
                onPress={() => navigateImage('prev')}
              >
                <Text style={styles.navButtonText}>←</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.navButton, styles.nextButton]}
                onPress={() => navigateImage('next')}
              >
                <Text style={styles.navButtonText}>→</Text>
              </TouchableOpacity>
            </>
          )}

          {/* Main Image */}
          {selectedImageIndex !== null && shopData?.files && (
            <Image 
              source={{ uri: shopData.files[selectedImageIndex] }} 
              style={[styles.fullImage, { width: width * 0.95, height: height * 0.7 }]}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  backButtonText: {
    color: '#3498db',
    fontSize: 24,
    fontWeight: '400',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 8,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  headerActionIcon: {
    fontSize: 18,
  },
  deleteActionButton: {
    backgroundColor: '#fff5f5',
    borderColor: '#ffebee',
  },
  placeholder: {
    width: 40,
  },
  // Shop Header Card
  shopHeaderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginBottom: 24,
    padding: 20,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  shopAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 3,
    borderColor: '#fff',
    elevation: 2,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  shopAvatarIcon: {
    fontSize: 32,
    color: '#fff',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  shopInfo: {
    flex: 1,
  },
  shopName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  shopOwner: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 12,
  },
  shopMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  statusIcon: {
    fontSize: 12,
  },
  activeBadge: {
    backgroundColor: '#d4f5e2',
  },
  inactiveBadge: {
    backgroundColor: '#fdeaea',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#155724',
  },
  shopId: {
    fontSize: 14,
    color: '#95a5a6',
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  sectionIcon: {
    fontSize: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  imageCountText: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 2,
  },
  // Images Grid - Responsive
  imagesGridContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  imageRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  imageItem: {
    alignItems: 'center',
    marginBottom: 16,
  },
  imageWrapper: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyeIcon: {
    fontSize: 14,
  },
  imageIndexBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(52, 152, 219, 0.9)',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageIndexText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  imageLabel: {
    fontSize: 12,
    color: '#2c3e50',
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 4,
  },
  imageTip: {
    fontSize: 12,
    color: '#7f8c8d',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 12,
  },
  noImagesContainer: {
    backgroundColor: '#fff',
    padding: 40,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#f0f0f0',
    borderStyle: 'dashed',
  },
  noImagesIcon: {
    fontSize: 48,
  },
  noImagesText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7f8c8d',
    marginTop: 12,
    marginBottom: 4,
  },
  noImagesSubText: {
    fontSize: 14,
    color: '#bdc3c7',
    textAlign: 'center',
  },
  // Info Container
  infoContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  infoItem: {
    flex: 1,
    minWidth: '48%',
    marginBottom: 12,
  },
  fullWidthItem: {
    minWidth: '100%',
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7f8c8d',
    marginBottom: 6,
  },
  infoValue: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '500',
  },
  emptyValue: {
    color: '#bdc3c7',
    fontStyle: 'italic',
  },
  statusBadgeInline: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  // Address Card
  addressCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  addressIcon: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },
  addressText: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '500',
    flex: 1,
    lineHeight: 24,
  },
  addressDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  addressDetailItem: {
    flex: 1,
    minWidth: '48%',
  },
  addressDetailLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '600',
    marginBottom: 4,
  },
  addressDetailValue: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '500',
  },
  // Action Buttons
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#3498db',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#e74c3c',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Image Viewer Modal
  imageViewerContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    right: 20,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  imageCounter: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  imageCounterText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  imageLabelText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  navButton: {
    position: 'absolute',
    top: '50%',
    marginTop: -32,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  navButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  prevButton: {
    left: 20,
  },
  nextButton: {
    right: 20,
  },
  fullImage: {
    borderRadius: 8,
    backgroundColor: '#000',
  },
  // Error State
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorIcon: {
    fontSize: 64,
  },
  errorText: {
    fontSize: 18,
    color: '#2c3e50',
    marginTop: 16,
    marginBottom: 24,
  },
  backButtonFull: {
    backgroundColor: '#3498db',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonFullText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ShopDetailsScreen;