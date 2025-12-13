import { useRouter } from 'expo-router';
import React, { useState, useRef, useEffect } from 'react';
import {
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ScrollView,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getCartItemCount, getRecentOrders, reorderItems, hasOrders, addToCart } from './cartStore';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  unit: string;
  discount?: number;
  originalPrice?: number;
  availableUnits?: {
    id: string;
    unit: string;
    price: number;
    originalPrice?: number;
    discount?: number;
  }[];
}

type Category = 'all' | 'vegetables' | 'fruits' | 'herbs' | 'cuts' | 'exotic' | 'flowers' | 'organic';
<<<<<<< HEAD
type DeliveryType = 'SAME_DAY' | 'NEXT_DAY';

interface ShopInfo {
  name: string;
  vendor: string;
  address: string;
}

interface Banner {
  id: string;
  image: string;
  title?: string;
}

interface TopSeller {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  unit: string;
  discount?: number;
  originalPrice?: number;
}
=======
>>>>>>> 59b5a119e90d67880c7e91df3ad1810d608fbaad

const { width: screenWidth } = Dimensions.get('window');

const ProductItem = ({ 
  item, 
  onPress,
  onAddToCart
}: { 
  item: Product; 
  onPress: (product: Product) => void;
  onAddToCart: () => void;
}) => {
  const [showUnitModal, setShowUnitModal] = useState(false);
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);

  const getCurrentUnit = () => {
    if (item.availableUnits && item.availableUnits.length > 0) {
      if (selectedUnitId) {
        const unit = item.availableUnits.find(u => u.id === selectedUnitId);
        if (unit) return unit;
      }
      return item.availableUnits[0];
    }
    return {
      unit: item.unit,
      price: item.price,
      originalPrice: item.originalPrice,
      discount: item.discount
    };
  };

  const currentUnit = getCurrentUnit();

  const handleAddButtonPress = () => {
    if (item.availableUnits && item.availableUnits.length > 1) {
      setShowUnitModal(true);
    } else {
      addToCart({
        id: item.id,
        name: item.name,
        price: currentUnit.price,
        image: item.image,
        unit: currentUnit.unit
      }, 1);
      onAddToCart();
      
      Alert.alert(
        'Added to Cart',
        `${item.name} added to cart!`,
        [
          { 
            text: 'OK', 
            style: 'default',
            onPress: () => {}
          }
        ]
      );
    }
  };

  const handleUnitSelect = (unit: any) => {
    setSelectedUnitId(unit.id);
    addToCart({
      id: item.id,
      name: item.name,
      price: unit.price,
      image: item.image,
      unit: unit.unit
    }, 1);
    onAddToCart();
    setShowUnitModal(false);
    
    Alert.alert(
      'Added to Cart',
      `${item.name} (${unit.unit}) added to cart!`,
      [
        { 
          text: 'OK', 
          style: 'default',
          onPress: () => {}
        }
      ]
    );
  };

  return (
    <>
      <TouchableOpacity
        style={styles.productCard}
        onPress={() => onPress(item)}
      >
        <View style={styles.productImageContainer}>
          <Image source={{ uri: item.image }} style={styles.productImage} />
<<<<<<< HEAD
          {/* Offer Cross Badge on top of image */}
          {currentUnit.originalPrice && (
            <View style={styles.offerCrossBadge}>
              <View style={styles.offerCrossLine}></View>
              <Text style={styles.offerCrossText}>
                ₹{Math.round(currentUnit.originalPrice - currentUnit.price)} OFF
              </Text>
            </View>
          )}
=======
>>>>>>> 59b5a119e90d67880c7e91df3ad1810d608fbaad
          {currentUnit.discount && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{currentUnit.discount}% OFF</Text>
            </View>
          )}
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{item.name}</Text>
          
          {item.availableUnits && item.availableUnits.length > 1 && (
            <TouchableOpacity 
              style={styles.unitSelector}
              onPress={() => setShowUnitModal(true)}
            >
              <Text style={styles.unitSelectorText} numberOfLines={1}>
                {currentUnit.unit}
              </Text>
              <Text style={styles.unitSelectorIcon}>▼</Text>
            </TouchableOpacity>
          )}

          <View style={styles.priceContainer}>
            {currentUnit.originalPrice ? (
              <>
                <View style={styles.priceRow}>
                  <Text style={styles.productPrice}>₹{currentUnit.price}</Text>
                  <Text style={styles.productOriginalPrice}>₹{currentUnit.originalPrice}</Text>
                </View>
                <View style={styles.offBadge}>
                  <Text style={styles.offText}>
                    ₹{(currentUnit.originalPrice - currentUnit.price)} OFF
                  </Text>
                </View>
              </>
            ) : (
              <Text style={styles.productPrice}>₹{currentUnit.price}</Text>
            )}
          </View>
          
          <Text style={styles.productUnit}>{currentUnit.unit}</Text>
          
          <TouchableOpacity 
            style={styles.addButton} 
            onPress={handleAddButtonPress}
          >
            <Text style={styles.addButtonText}>ADD</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      <Modal
        visible={showUnitModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowUnitModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.unitModalContent}>
            <View style={styles.unitModalHeader}>
              <Text style={styles.unitModalTitle}>Select Unit</Text>
              <TouchableOpacity 
                style={styles.unitModalCloseBtn}
                onPress={() => setShowUnitModal(false)}
              >
                <Text style={styles.unitModalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <Text style={styles.productNameInModal}>{item.name}</Text>
            
            <View style={styles.unitOptionsContainer}>
              {item.availableUnits?.map((unit) => (
                <TouchableOpacity
                  key={unit.id}
                  style={[
                    styles.unitOption,
                    selectedUnitId === unit.id && styles.selectedUnitOption
                  ]}
                  onPress={() => handleUnitSelect(unit)}
                >
                  <View style={styles.unitLeftSection}>
<<<<<<< HEAD
                    <Text style={[
                      styles.unitText,
                      selectedUnitId === unit.id && styles.selectedUnitText
                    ]}>
                      {unit.unit}
                    </Text>
=======
                    <View style={styles.unitTextContainer}>
                      <Text style={[
                        styles.unitText,
                        selectedUnitId === unit.id && styles.selectedUnitText
                      ]}>
                        {unit.unit}
                      </Text>
                      {unit.discount && unit.discount > 0 && (
                        <View style={styles.unitDiscountBadge}>
                          <Text style={styles.unitDiscountText}>
                            {unit.discount}% OFF
                          </Text>
                        </View>
                      )}
                    </View>
>>>>>>> 59b5a119e90d67880c7e91df3ad1810d608fbaad
                  </View>
                  
                  <View style={styles.unitRightSection}>
                    <View style={styles.unitPriceContainer}>
                      <Text style={[
                        styles.unitPrice,
                        selectedUnitId === unit.id && styles.selectedUnitPrice
                      ]}>
                        ₹{unit.price}
                      </Text>
                      {unit.originalPrice && (
                        <Text style={styles.unitOriginalPrice}>
                          ₹{unit.originalPrice}
                        </Text>
                      )}
                    </View>
<<<<<<< HEAD
                    {unit.discount && unit.discount > 0 && (
                      <View style={styles.unitDiscountBadge}>
                        <Text style={styles.unitDiscountText}>
                          Save ₹{Math.round(unit.originalPrice! - unit.price)}
                        </Text>
                      </View>
                    )}
=======
                    <Text style={styles.unitSelectButton}>
                      {selectedUnitId === unit.id ? 'SELECTED' : 'SELECT'}
                    </Text>
>>>>>>> 59b5a119e90d67880c7e91df3ad1810d608fbaad
                  </View>
                </TouchableOpacity>
              ))}
            </View>
            
<<<<<<< HEAD
            <View style={styles.modalFooter}>
              <View style={styles.totalContainer}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalPrice}>₹{currentUnit.price}</Text>
              </View>
              <TouchableOpacity 
                style={styles.confirmButton}
                onPress={() => {
                  const unit = item.availableUnits?.find(u => u.id === selectedUnitId) || currentUnit;
                  handleUnitSelect(unit);
                }}
              >
                <Text style={styles.confirmButtonText}>CONFIRM</Text>
              </TouchableOpacity>
            </View>
=======
            <TouchableOpacity 
              style={styles.closeModalButton}
              onPress={() => setShowUnitModal(false)}
            >
              <Text style={styles.closeModalButtonText}>Cancel</Text>
            </TouchableOpacity>
>>>>>>> 59b5a119e90d67880c7e91df3ad1810d608fbaad
          </View>
        </View>
      </Modal>
    </>
  );
};

const ProductList: React.FC = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'home' | 'categories' | 'reorder'>('home');
  const [reorderModalVisible, setReorderModalVisible] = useState(false);
  const [showCategorySidebar, setShowCategorySidebar] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(getCartItemCount());
<<<<<<< HEAD
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('NEXT_DAY');
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const flatListRef = useRef<FlatList>(null);
  const bannerScrollRef = useRef<ScrollView>(null);
=======
  const scrollViewRef = useRef<ScrollView>(null);
  const flatListRef = useRef<FlatList>(null);
>>>>>>> 59b5a119e90d67880c7e91df3ad1810d608fbaad

  const updateCartCount = () => {
    setCartItemCount(getCartItemCount());
  };

  useEffect(() => {
    updateCartCount();
  }, []);

<<<<<<< HEAD
  const [shopInfo] = useState<ShopInfo>({
    name: 'Location - 1',
    vendor: 'your Local vendor\nvenkat packy',
    address: 'Address -'
  });

  const [banners] = useState<Banner[]>([
    {
      id: '1',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=200&fit=crop',
      title: 'Fresh Vegetables'
    },
    {
      id: '2',
      image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=400&h=200&fit=crop',
      title: 'Organic Fruits'
    },
    {
      id: '3',
      image: 'https://images.unsplash.com/photo-1566385101042-1a0f0c126a96?w=400&h=200&fit=crop',
      title: 'Special Offers'
    }
  ]);

  const [topSellersSameDay] = useState<TopSeller[]>([
    {
      id: 'ts1',
      name: 'Tomatoes',
      price: 30.40,
      image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=300&fit=crop',
      rating: 4.0,
      unit: '1kg',
      discount: 20,
      originalPrice: 38
    },
    {
      id: 'ts2',
      name: 'Sleeping Caps',
      price: 149,
      image: 'https://images.unsplash.com/photo-1585231176112-4d54b7f70378?w=400&h=300&fit=crop',
      rating: 4.5,
      unit: 'pack of 2'
    },
    {
      id: 'ts3',
      name: 'Mama Soogmy',
      price: 249,
      image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=300&fit=crop',
      rating: 4.0,
      unit: '500g'
    },
    {
      id: 'ts4',
      name: 'Bananas',
      price: 45,
      image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=300&fit=crop',
      rating: 4.2,
      unit: '1 dozen',
      discount: 15,
      originalPrice: 53
    }
  ]);

  const [topSellersNextDay] = useState<TopSeller[]>([
    {
      id: 'ts5',
      name: 'Apples',
      price: 89,
      image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400&h=300&fit=crop',
      rating: 4.3,
      unit: '1kg',
      discount: 25,
      originalPrice: 119
    },
    {
      id: 'ts6',
      name: 'Mushrooms',
      price: 61,
      image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&h=300&fit=crop',
      rating: 4.1,
      unit: '200g'
    },
    {
      id: 'ts7',
      name: 'Coriander',
      price: 25,
      image: 'https://media.assettype.com/thequint%2F2024-02%2F51cc762c-ae50-417d-a52a-2121cf56f2ff%2Ffresh_coriander_cilantro_leaves_on_basket_jpg_s_1024x1024_w_is_k_20_c_96og9_8azXuHXbeWpj2eJUufrZ1nDG.jpg?auto=format%2Ccompress&fmt=webp&width=720&w=1200',
      rating: 4.0,
      unit: 'bunch'
    },
    {
      id: 'ts8',
      name: 'Avocado',
      price: 149,
      image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&h=300&fit=crop',
      rating: 4.4,
      unit: 'each',
      discount: 20,
      originalPrice: 186
    }
  ]);

  const currentTopSellers = deliveryType === 'SAME_DAY' ? topSellersSameDay : topSellersNextDay;

=======
>>>>>>> 59b5a119e90d67880c7e91df3ad1810d608fbaad
  const mainCategories = [
    { id: '1', name: 'View all', value: 'all' },
    { id: '2', name: 'Fresh vegetables', value: 'vegetables' },
    { id: '3', name: 'Fresh fruits', value: 'fruits' },
    { id: '4', name: 'Herbs & seasonings', value: 'herbs' },
  ];

  const categoryTabItems = [
    { id: '1', name: '9 Zone', value: 'all', icon: '9️⃣' },
    { id: '2', name: 'Veggies', value: 'vegetables', icon: '🥬' },
    { id: '3', name: 'Fruits', value: 'fruits', icon: '🍎' },
    { id: '4', name: 'Exotics', value: 'exotic', icon: '🥑' },
    { id: '5', name: 'Cuts & Sprouts', value: 'cuts', icon: '🥗' },
    { id: '6', name: 'Herbs & Seasonings', value: 'herbs', icon: '🌿' },
    { id: '7', name: 'Flowers', value: 'flowers', icon: '💐' },
    { id: '8', name: 'Organic', value: 'organic', icon: '🌱' },
  ];

  const categoryOffers = [
    {
      id: '1',
      title: 'UP TO 30% OFF',
      subtitle: 'Freshly Launched',
      backgroundColor: '#e8f6f3',
      textColor: '#27ae60',
    },
    {
      id: '2',
      title: 'BUY 1 GET 1 FREE',
      subtitle: 'On Selected Fruits',
      backgroundColor: '#ffeaa7',
      textColor: '#e74c3c',
    },
    {
      id: '3',
      title: 'FREE DELIVERY',
      subtitle: 'On orders above ₹499',
      backgroundColor: '#e3f2fd',
      textColor: '#3498db',
    },
  ];

  const offers = [
    {
      id: '1',
      title: 'GET 10% + Instant discount*',
      subtitle: 'EXTRA 10% NewCard Savings*',
      buttonText: 'APPLY NOW',
    },
  ];

  const [products] = useState<Product[]>([
    {
      id: '1',
      name: 'Desi Tomato',
      price: 36,
      originalPrice: 50,
      discount: 28,
      image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=300&fit=crop',
      description: 'Fresh organic desi tomatoes',
      category: 'vegetables',
      unit: '500 g',
      availableUnits: [
        { id: 'unit_1_1', unit: '500 g', price: 36, originalPrice: 50, discount: 28 },
        { id: 'unit_1_2', unit: '2 x 500 g', price: 72, originalPrice: 100, discount: 28 },
        { id: 'unit_1_3', unit: '1 kg', price: 68, originalPrice: 95, discount: 28 }
      ]
    },
    {
      id: '2',
      name: 'Banana Robusta',
      price: 22,
      originalPrice: 32,
      discount: 31,
      image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=300&fit=crop',
      description: 'Fresh robusta bananas',
      category: 'fruits',
      unit: '3 Pc',
      availableUnits: [
        { id: 'unit_2_1', unit: '3 Pc', price: 22, originalPrice: 32, discount: 31 },
        { id: 'unit_2_2', unit: '6 Pc', price: 40, originalPrice: 64, discount: 38 },
        { id: 'unit_2_3', unit: '12 Pc', price: 75, originalPrice: 128, discount: 41 }
      ]
    },
    {
      id: '3',
      name: 'Coconut',
      price: 30,
      originalPrice: 49,
      discount: 39,
      image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&h=300&fit=crop',
      description: 'Fresh green coconut',
      category: 'fruits',
      unit: '1 pc',
      availableUnits: [
        { id: 'unit_3_1', unit: '1 pc', price: 30, originalPrice: 49, discount: 39 },
        { id: 'unit_3_2', unit: '2 pcs', price: 55, originalPrice: 98, discount: 44 },
        { id: 'unit_3_3', unit: '4 pcs', price: 100, originalPrice: 196, discount: 49 }
      ]
    },
    {
      id: '4',
      name: 'Apple Royal Gala Imported',
      price: 93,
      originalPrice: 138,
      discount: 32,
      image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400&h=300&fit=crop',
      description: 'Sweet and crunchy imported apples',
      category: 'fruits',
      unit: '2 pcs',
      availableUnits: [
        { id: 'unit_4_1', unit: '2 pcs', price: 93, originalPrice: 138, discount: 32 },
        { id: 'unit_4_2', unit: '4 pcs', price: 175, originalPrice: 276, discount: 36 },
        { id: 'unit_4_3', unit: '1 kg', price: 210, originalPrice: 350, discount: 40 }
      ]
    },
    {
      id: '5',
      name: 'Mushroom Button',
      price: 61,
      originalPrice: 91,
      discount: 33,
      image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&h=300&fit=crop',
      description: 'Fresh button mushrooms',
      category: 'vegetables',
      unit: '200 g',
      availableUnits: [
        { id: 'unit_5_1', unit: '200 g', price: 61, originalPrice: 91, discount: 33 },
        { id: 'unit_5_2', unit: '500 g', price: 140, originalPrice: 228, discount: 39 },
        { id: 'unit_5_3', unit: '1 kg', price: 260, originalPrice: 455, discount: 43 }
      ]
    },
    {
      id: '6',
      name: 'Guava Thai',
      price: 31,
      originalPrice: 59,
      discount: 47,
      image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=300&fit=crop',
      description: 'Fresh Thai guava',
      category: 'fruits',
      unit: '1 pc',
      availableUnits: [
        { id: 'unit_6_1', unit: '1 pc', price: 31, originalPrice: 59, discount: 47 },
        { id: 'unit_6_2', unit: '4 pcs', price: 110, originalPrice: 236, discount: 53 },
        { id: 'unit_6_3', unit: '1 kg', price: 85, originalPrice: 180, discount: 53 }
      ]
    },
    {
      id: '7',
      name: 'Coriander Leaves',
      price: 25,
      originalPrice: 30,
      discount: 17,
      image: 'https://media.assettype.com/thequint%2F2024-02%2F51cc762c-ae50-417d-a52a-2121cf56f2ff%2Ffresh_coriander_cilantro_leaves_on_basket_jpg_s_1024x1024_w_is_k_20_c_96og9_8azXuHXbeWpj2eJUufrZ1nDG.jpg?auto=format%2Ccompress&fmt=webp&width=720&w=1200',
      description: 'Fresh coriander leaves',
      category: 'herbs',
      unit: 'per bunch',
      availableUnits: [
        { id: 'unit_7_1', unit: 'per bunch', price: 25, originalPrice: 30, discount: 17 },
        { id: 'unit_7_2', unit: '2 bunches', price: 45, originalPrice: 60, discount: 25 },
        { id: 'unit_7_3', unit: '4 bunches', price: 80, originalPrice: 120, discount: 33 }
      ]
    },
    {
      id: '8',
      name: 'Tomato Pickle',
      price: 280,
      originalPrice: 350,
      discount: 20,
      image: 'https://via.placeholder.com/400x300/FF6B6B/FFFFFF?text=Tomato+Pickle',
      description: 'Cool South Style Tomato Pickle',
      category: 'herbs',
      unit: '250 g',
      availableUnits: [
        { id: 'unit_8_1', unit: '250 g', price: 280, originalPrice: 350, discount: 20 },
        { id: 'unit_8_2', unit: '500 g', price: 520, originalPrice: 700, discount: 26 },
        { id: 'unit_8_3', unit: '1 kg', price: 980, originalPrice: 1400, discount: 30 }
      ]
    },
    {
      id: '9',
      name: 'Organically Grown Tomato (Desi)',
      price: 75,
      originalPrice: 39,
      discount: 24,
      image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=300&fit=crop',
      description: 'Fresh organic desi tomatoes',
      category: 'organic',
      unit: '500 g',
      availableUnits: [
        { id: 'unit_9_1', unit: '500 g', price: 75, originalPrice: 39, discount: 24 },
        { id: 'unit_9_2', unit: '1 kg', price: 140, originalPrice: 78, discount: 28 },
        { id: 'unit_9_3', unit: '2 kg', price: 260, originalPrice: 156, discount: 33 }
      ]
    },
    {
      id: '10',
      name: 'Avocado',
      price: 149,
      originalPrice: 199,
      discount: 25,
      image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&h=300&fit=crop',
      description: 'Creamy ripe avocados',
      category: 'exotic',
      unit: 'each',
      availableUnits: [
        { id: 'unit_10_1', unit: '1 pc', price: 149, originalPrice: 199, discount: 25 },
        { id: 'unit_10_2', unit: '2 pcs', price: 280, originalPrice: 398, discount: 30 },
        { id: 'unit_10_3', unit: '4 pcs', price: 520, originalPrice: 796, discount: 35 }
      ]
    },
    {
      id: '11',
      name: 'Rose Flowers',
      price: 199,
      originalPrice: 250,
      discount: 20,
      image: 'https://www.bbassets.com/media/uploads/p/xl/40196767_2-hoovu-fresh-assorted-roses-puja-flowers.jpg',
      description: 'Fresh red rose flowers',
      category: 'flowers',
      unit: 'per dozen',
      availableUnits: [
        { id: 'unit_11_1', unit: 'per dozen', price: 199, originalPrice: 250, discount: 20 },
        { id: 'unit_11_2', unit: '2 dozens', price: 375, originalPrice: 500, discount: 25 },
        { id: 'unit_11_3', unit: '4 dozens', price: 700, originalPrice: 1000, discount: 30 }
      ]
    },
    {
      id: '12',
      name: 'Organic Tomatoes',
      price: 79,
      originalPrice: 99,
      discount: 20,
      image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=300&fit=crop',
      description: 'Fresh organic tomatoes',
      category: 'organic',
      unit: 'per kg',
      availableUnits: [
        { id: 'unit_12_1', unit: 'per kg', price: 79, originalPrice: 99, discount: 20 },
        { id: 'unit_12_2', unit: '2 kg', price: 150, originalPrice: 198, discount: 24 },
        { id: 'unit_12_3', unit: '5 kg', price: 350, originalPrice: 495, discount: 29 }
      ]
    },
    {
      id: '13',
      name: 'Broccoli',
      price: 99,
      originalPrice: 129,
      discount: 23,
      image: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400&h=300&fit=crop',
      description: 'Fresh green broccoli',
      category: 'vegetables',
      unit: 'per kg',
      availableUnits: [
        { id: 'unit_13_1', unit: 'per kg', price: 99, originalPrice: 129, discount: 23 },
        { id: 'unit_13_2', unit: '500 g', price: 55, originalPrice: 65, discount: 15 },
        { id: 'unit_13_3', unit: '2 kg', price: 185, originalPrice: 258, discount: 28 }
      ]
    },
    {
      id: '14',
      name: 'Mint Leaves',
      price: 20,
      originalPrice: 25,
      discount: 20,
      image: 'https://www.kenshodaily.com/cdn/shop/products/MintLeaves.png?v=1672742949',
      description: 'Fresh mint leaves',
      category: 'herbs',
      unit: 'per bunch',
      availableUnits: [
        { id: 'unit_14_1', unit: 'per bunch', price: 20, originalPrice: 25, discount: 20 },
        { id: 'unit_14_2', unit: '3 bunches', price: 55, originalPrice: 75, discount: 27 },
        { id: 'unit_14_3', unit: '6 bunches', price: 100, originalPrice: 150, discount: 33 }
      ]
    },
    {
      id: '15',
      name: 'Kiwi',
      price: 129,
      originalPrice: 169,
      discount: 24,
      image: 'https://www.sakraworldhospital.com/assets/spl_splimgs/benefits-kiwi-of-fruit.webp',
      description: 'Fresh kiwi fruits',
      category: 'exotic',
      unit: 'per kg',
      availableUnits: [
        { id: 'unit_15_1', unit: 'per kg', price: 129, originalPrice: 169, discount: 24 },
        { id: 'unit_15_2', unit: '500 g', price: 70, originalPrice: 85, discount: 18 },
        { id: 'unit_15_3', unit: '2 kg', price: 240, originalPrice: 338, discount: 29 }
      ]
    },
    {
      id: '16',
      name: 'Chrysanthemum',
      price: 299,
      originalPrice: 399,
      discount: 25,
      image: 'https://getflowersdaily.com/wp-content/uploads/2025/03/Pooja20Flowers20__8211_20Chrysanthemum20White20Flower20%E2%80%9320250gm.png',
      description: 'Beautiful chrysanthemum bouquet',
      category: 'flowers',
      unit: 'each',
      availableUnits: [
        { id: 'unit_16_1', unit: '1 bouquet', price: 299, originalPrice: 399, discount: 25 },
        { id: 'unit_16_2', unit: '2 bouquets', price: 550, originalPrice: 798, discount: 31 },
        { id: 'unit_16_3', unit: '4 bouquets', price: 1000, originalPrice: 1596, discount: 37 }
      ]
    },
    {
      id: '17',
      name: 'Fresh Oranges',
      price: 129,
      originalPrice: 159,
      discount: 19,
      image: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=400&h=300&fit=crop',
      description: 'Juicy sweet oranges',
      category: 'fruits',
      unit: 'per kg',
      availableUnits: [
        { id: 'unit_17_1', unit: 'per kg', price: 129, originalPrice: 159, discount: 19 },
        { id: 'unit_17_2', unit: '2 kg', price: 240, originalPrice: 318, discount: 25 },
        { id: 'unit_17_3', unit: '5 kg', price: 550, originalPrice: 795, discount: 31 }
      ]
    },
    {
      id: '18',
      name: 'Green Grapes',
      price: 189,
      originalPrice: 239,
      discount: 21,
      image: 'https://www.bbassets.com/media/uploads/p/l/40218332_6-fresho-grapes-green.jpg',
      description: 'Fresh green seedless grapes',
      category: 'fruits',
      unit: 'per kg',
      availableUnits: [
        { id: 'unit_18_1', unit: 'per kg', price: 189, originalPrice: 239, discount: 21 },
        { id: 'unit_18_2', unit: '500 g', price: 100, originalPrice: 120, discount: 17 },
        { id: 'unit_18_3', unit: '2 kg', price: 350, originalPrice: 478, discount: 27 }
      ]
    },
    {
      id: '19',
      name: 'Pomegranate',
      price: 179,
      originalPrice: 229,
      discount: 22,
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvos2JPAkMavZxm5bEEeiWYrRjRqv7TQMTyw&s',
      description: 'Fresh pomegranate',
      category: 'fruits',
      unit: 'per kg',
      availableUnits: [
        { id: 'unit_19_1', unit: 'per kg', price: 179, originalPrice: 229, discount: 22 },
        { id: 'unit_19_2', unit: '2 kg', price: 330, originalPrice: 458, discount: 28 },
        { id: 'unit_19_3', unit: '5 kg', price: 750, originalPrice: 1145, discount: 34 }
      ]
    },
    {
      id: '20',
      name: 'Fresh Mangoes',
      price: 299,
      originalPrice: 399,
      discount: 25,
      image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&h=300&fit=crop',
      description: 'Sweet alphonso mangoes',
      category: 'fruits',
      unit: 'per kg',
      availableUnits: [
        { id: 'unit_20_1', unit: 'per kg', price: 299, originalPrice: 399, discount: 25 },
        { id: 'unit_20_2', unit: '2 kg', price: 550, originalPrice: 798, discount: 31 },
        { id: 'unit_20_3', unit: '5 kg', price: 1250, originalPrice: 1995, discount: 37 }
      ]
    },
    {
      id: '21',
      name: 'Fresh Potatoes',
      price: 45,
      originalPrice: 60,
      discount: 25,
      image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=300&fit=crop',
      description: 'Fresh farm potatoes',
      category: 'vegetables',
      unit: 'per kg',
      availableUnits: [
        { id: 'unit_21_1', unit: 'per kg', price: 45, originalPrice: 60, discount: 25 },
        { id: 'unit_21_2', unit: '2 kg', price: 80, originalPrice: 120, discount: 33 },
        { id: 'unit_21_3', unit: '5 kg', price: 180, originalPrice: 300, discount: 40 }
      ]
    },
    {
      id: '22',
      name: 'Fresh Onions',
      price: 35,
      originalPrice: 50,
      discount: 30,
      image: 'https://images.unsplash.com/photo-1580201092675-a0a6a6cafbb1?w=400&h=300&fit=crop',
      description: 'Fresh red onions',
      category: 'vegetables',
      unit: 'per kg',
      availableUnits: [
        { id: 'unit_22_1', unit: 'per kg', price: 35, originalPrice: 50, discount: 30 },
        { id: 'unit_22_2', unit: '2 kg', price: 60, originalPrice: 100, discount: 40 },
        { id: 'unit_22_3', unit: '5 kg', price: 140, originalPrice: 250, discount: 44 }
      ]
    },
    {
      id: '23',
      name: 'Cucumber',
      price: 25,
      originalPrice: 35,
      discount: 29,
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiZEk16LGB_gKTEHNjbWWOT608eIwKwhIlug&s',
      description: 'Fresh green cucumber',
      category: 'vegetables',
      unit: 'per kg',
      availableUnits: [
        { id: 'unit_23_1', unit: 'per kg', price: 25, originalPrice: 35, discount: 29 },
        { id: 'unit_23_2', unit: '500 g', price: 15, originalPrice: 18, discount: 17 },
        { id: 'unit_23_3', unit: '2 kg', price: 45, originalPrice: 70, discount: 36 }
      ]
    },
    {
      id: '24',
      name: 'Bell Peppers',
      price: 129,
      originalPrice: 179,
      discount: 28,
      image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&h=300&fit=crop',
      description: 'Mixed color bell peppers',
      category: 'vegetables',
      unit: 'per kg',
      availableUnits: [
        { id: 'unit_24_1', unit: 'per kg', price: 129, originalPrice: 179, discount: 28 },
        { id: 'unit_24_2', unit: '500 g', price: 70, originalPrice: 90, discount: 22 },
        { id: 'unit_24_3', unit: '2 kg', price: 240, originalPrice: 358, discount: 33 }
      ]
    },
    {
      id: '25',
      name: 'Basil Leaves',
      price: 30,
      originalPrice: 40,
      discount: 25,
      image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=1080/da/cms-assets/cms-product/a8e3395a-19df-4cec-8de1-8b754a8d3206.png',
      description: 'Fresh basil leaves',
      category: 'herbs',
      unit: 'per bunch',
      availableUnits: [
        { id: 'unit_25_1', unit: 'per bunch', price: 30, originalPrice: 40, discount: 25 },
        { id: 'unit_25_2', unit: '3 bunches', price: 80, originalPrice: 120, discount: 33 },
        { id: 'unit_25_3', unit: '6 bunches', price: 150, originalPrice: 240, discount: 38 }
      ]
    },
    {
      id: '26',
      name: 'Curry Leaves',
      price: 15,
      originalPrice: 20,
      discount: 25,
      image: 'https://mangaalharvest.com/cdn/shop/products/Curryleaves.jpg?v=1595610614',
      description: 'Fresh curry leaves',
      category: 'herbs',
      unit: 'per bunch',
      availableUnits: [
        { id: 'unit_26_1', unit: 'per bunch', price: 15, originalPrice: 20, discount: 25 },
        { id: 'unit_26_2', unit: '5 bunches', price: 65, originalPrice: 100, discount: 35 },
        { id: 'unit_26_3', unit: '10 bunches', price: 120, originalPrice: 200, discount: 40 }
      ]
    },
    {
      id: '27',
      name: 'Dragon Fruit',
      price: 199,
      originalPrice: 269,
      discount: 26,
      image: 'https://images.everydayhealth.com/images/diet-nutrition/dragon-fruit-101-1440x810.jpg?sfvrsn=3bd52a80_3',
      description: 'Fresh dragon fruit',
      category: 'exotic',
      unit: 'each',
      availableUnits: [
        { id: 'unit_27_1', unit: '1 pc', price: 199, originalPrice: 269, discount: 26 },
        { id: 'unit_27_2', unit: '2 pcs', price: 375, originalPrice: 538, discount: 30 },
        { id: 'unit_27_3', unit: '4 pcs', price: 700, originalPrice: 1076, discount: 35 }
      ]
    },
    {
      id: '28',
      name: 'Passion Fruit',
      price: 149,
      originalPrice: 199,
      discount: 25,
      image: 'https://res.cloudinary.com/hz3gmuqw6/image/upload/c_fill,q_30,w=750/f_auto/passion-fruit-php68hp08',
      description: 'Fresh passion fruit',
      category: 'exotic',
      unit: 'per kg',
      availableUnits: [
        { id: 'unit_28_1', unit: 'per kg', price: 149, originalPrice: 199, discount: 25 },
        { id: 'unit_28_2', unit: '500 g', price: 80, originalPrice: 100, discount: 20 },
        { id: 'unit_28_3', unit: '2 kg', price: 280, originalPrice: 398, discount: 30 }
      ]
    },
    {
      id: '29',
      name: 'Cauliflower',
      price: 49,
      originalPrice: 69,
      discount: 29,
      image: 'https://images.unsplash.com/photo-1613743983303-b3e89f8a2b80?w=400&h=300&fit=crop',
      description: 'Fresh white cauliflower',
      category: 'vegetables',
      unit: 'each',
      availableUnits: [
        { id: 'unit_29_1', unit: '1 piece', price: 49, originalPrice: 69, discount: 29 },
        { id: 'unit_29_2', unit: '2 pieces', price: 90, originalPrice: 138, discount: 35 },
        { id: 'unit_29_3', unit: '4 pieces', price: 170, originalPrice: 276, discount: 38 }
      ]
    },
    {
      id: '30',
      name: 'Strawberries',
      price: 299,
      originalPrice: 399,
      discount: 25,
      image: 'https://images.unsplash.com/photo-1464454709131-ffd692591ee5?w=400&h=300&fit=crop',
      description: 'Fresh red strawberries',
      category: 'fruits',
      unit: 'per box',
      availableUnits: [
        { id: 'unit_30_1', unit: 'per box', price: 299, originalPrice: 399, discount: 25 },
        { id: 'unit_30_2', unit: '2 boxes', price: 550, originalPrice: 798, discount: 31 },
        { id: 'unit_30_3', unit: '4 boxes', price: 1000, originalPrice: 1596, discount: 37 }
      ]
    },
    {
      id: '31',
      name: 'Lettuce',
      price: 35,
      originalPrice: 50,
      discount: 30,
      image: 'https://cdn.britannica.com/77/170677-050-F7333D51/lettuce.jpg',
      description: 'Fresh green lettuce',
      category: 'vegetables',
      unit: 'each',
      availableUnits: [
        { id: 'unit_31_1', unit: '1 piece', price: 35, originalPrice: 50, discount: 30 },
        { id: 'unit_31_2', unit: '2 pieces', price: 60, originalPrice: 100, discount: 40 },
        { id: 'unit_31_3', unit: '4 pieces', price: 110, originalPrice: 200, discount: 45 }
      ]
    },
    {
      id: '32',
      name: 'Pineapple',
      price: 89,
      originalPrice: 119,
      discount: 25,
      image: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400&h=300&fit=crop',
      description: 'Sweet and juicy pineapple',
      category: 'fruits',
      unit: 'each',
      availableUnits: [
        { id: 'unit_32_1', unit: '1 piece', price: 89, originalPrice: 119, discount: 25 },
        { id: 'unit_32_2', unit: '2 pieces', price: 165, originalPrice: 238, discount: 31 },
        { id: 'unit_32_3', unit: '4 pieces', price: 300, originalPrice: 476, discount: 37 }
      ]
    }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = currentOfferIndex === offers.length - 1 ? 0 : currentOfferIndex + 1;
      setCurrentOfferIndex(nextIndex);
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({
          x: nextIndex * (screenWidth - 32),
          animated: true,
        });
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [currentOfferIndex, offers.length]);

<<<<<<< HEAD
  useEffect(() => {
    const bannerInterval = setInterval(() => {
      const nextIndex = currentBannerIndex === banners.length - 1 ? 0 : currentBannerIndex + 1;
      setCurrentBannerIndex(nextIndex);
      if (bannerScrollRef.current) {
        bannerScrollRef.current.scrollTo({
          x: nextIndex * (screenWidth - 32),
          animated: true,
        });
      }
    }, 3000);
    return () => clearInterval(bannerInterval);
  }, [currentBannerIndex, banners.length]);

=======
>>>>>>> 59b5a119e90d67880c7e91df3ad1810d608fbaad
  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setShowCategorySidebar(true);
  };

  const handleBackToCategories = () => {
    setShowCategorySidebar(false);
    setSelectedCategory('all');
  };

  const filteredProducts = products.filter(product => {
    const query = searchQuery.toLowerCase().trim();
    if (query === '') {
      if (activeTab === 'home' || activeTab === 'categories' || activeTab === 'reorder') {
        return selectedCategory === 'all' || product.category === selectedCategory;
      }
      return true;
    }
    const matchesSearch = 
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query);
    if (activeTab === 'home' || activeTab === 'categories' || activeTab === 'reorder') {
      const matchesMainCategory = selectedCategory === 'all' || product.category === selectedCategory;
      return matchesSearch && matchesMainCategory;
    }
    return matchesSearch;
  });

  const handleProductPress = (product: Product) => {
    router.push({
      pathname: '/productdetail',
      params: { product: JSON.stringify(product) }
    });
  };

  const handleCarouselScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / (screenWidth - 32));
    setCurrentOfferIndex(index);
  };

<<<<<<< HEAD
  const handleBannerScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / (screenWidth - 32));
    setCurrentBannerIndex(index);
  };

=======
>>>>>>> 59b5a119e90d67880c7e91df3ad1810d608fbaad
  const handleProfilePress = () => {
    router.push('/profile');
  };

  const handleHomePress = () => {
    setActiveTab('home');
    setSelectedCategory('all');
    setShowCategorySidebar(false);
    setSearchQuery('');
  };

  const handleCategoriesPress = () => {
    setActiveTab('categories');
    setSelectedCategory('all');
    setShowCategorySidebar(false);
    setSearchQuery('');
  };

  const handleReorderPress = () => {
    if (hasOrders()) {
      setReorderModalVisible(true);
    } else {
      Alert.alert('No Orders', 'You have no previous orders to reorder from.');
    }
  };

  const handleReorderModalClose = () => {
    setReorderModalVisible(false);
  };

  const handleSelectOrderForReorder = (orderId: string) => {
    const success = reorderItems(orderId);
    if (success) {
      updateCartCount();
      setReorderModalVisible(false);
      
      Alert.alert(
        'Success', 
        'Items have been added to your cart!',
        [
          { 
            text: 'View Cart', 
            onPress: () => router.push('/cart') 
          },
          { 
            text: 'Continue Shopping', 
            style: 'cancel',
            onPress: () => {}
          }
        ]
      );
    } else {
      Alert.alert('Error', 'Failed to reorder items. Please try again.');
    }
  };

  const handleSearchClear = () => {
    setSearchQuery('');
  };

  const renderProductItem = ({ item }: { item: Product }) => (
    <ProductItem 
      item={item} 
      onPress={handleProductPress} 
      onAddToCart={updateCartCount}
    />
  );

<<<<<<< HEAD
  const renderTopSellerItem = ({ item }: { item: TopSeller }) => (
    <TouchableOpacity style={styles.topSellerCard}>
      <View style={styles.topSellerImageContainer}>
        <Image source={{ uri: item.image }} style={styles.topSellerImage} />
        {item.discount && (
          <View style={styles.topSellerDiscountBadge}>
            <Text style={styles.topSellerDiscountText}>{item.discount}% OFF</Text>
          </View>
        )}
      </View>
      <View style={styles.topSellerInfo}>
        <Text style={styles.topSellerName} numberOfLines={1}>{item.name}</Text>
        <View style={styles.topSellerRating}>
          <Text style={styles.topSellerRatingIcon}>★</Text>
          <Text style={styles.topSellerRatingText}>{item.rating}</Text>
        </View>
        <View style={styles.topSellerPriceRow}>
          <Text style={styles.topSellerPrice}>₹{item.price}</Text>
          {item.originalPrice && (
            <Text style={styles.topSellerOriginalPrice}>₹{item.originalPrice}</Text>
          )}
        </View>
        <Text style={styles.topSellerUnit}>{item.unit}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderNewUIStructure = () => (
    <View style={styles.newUIStructure}>
      {/* Shop Info - Fixed Alignment */}
      <View style={styles.shopInfoContainer}>
        <View style={styles.shopInfoHeader}>
          <View style={styles.shopInfoLeft}>
            <View style={styles.locationBadge}>
              <Text style={styles.locationIcon}>📍</Text>
              <Text style={styles.shopName}>{shopInfo.name}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.profileButtonNew} onPress={handleProfilePress}>
            <Text style={styles.profileIconNew}>👤</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.vendorInfo}>
          <Text style={styles.vendorLabel}>Your Local Vendor</Text>
          <Text style={styles.vendorName}>venkat packy</Text>
        </View>
        <Text style={styles.shopAddress}>{shopInfo.address}</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBarNew}>
        <View style={styles.searchIconContainer}>
          <Text style={styles.searchIconNew}>🔍</Text>
        </View>
        <TextInput
          style={styles.searchInputNew}
          placeholder="Search your product"
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
        />
        {searchQuery ? (
          <TouchableOpacity onPress={handleSearchClear} style={styles.clearSearchIcon}>
            <Text style={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Delivery Type Toggle - Moved to top */}
      <View style={styles.deliveryTypeContainer}>
        <View style={styles.deliveryButtons}>
          <TouchableOpacity
            style={[
              styles.deliveryButton,
              deliveryType === 'SAME_DAY' && styles.deliveryButtonActive
            ]}
            onPress={() => setDeliveryType('SAME_DAY')}
          >
            <Text style={[
              styles.deliveryButtonText,
              deliveryType === 'SAME_DAY' && styles.deliveryButtonTextActive
            ]}>
              Same Day
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.deliveryButton,
              deliveryType === 'NEXT_DAY' && styles.deliveryButtonActive
            ]}
            onPress={() => setDeliveryType('NEXT_DAY')}
          >
            <Text style={[
              styles.deliveryButtonText,
              deliveryType === 'NEXT_DAY' && styles.deliveryButtonTextActive
            ]}>
              Next Day
            </Text>
            <View style={styles.nextDayBadge}>
              <Text style={styles.nextDayBadgeText}>Sunday</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Categories Horizontal Scroll */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesScroll}
        contentContainerStyle={styles.categoriesContainer}
      >
        {categoryTabItems.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={styles.categoryChip}
            onPress={() => handleCategorySelect(category.value as Category)}
          >
            <Text style={styles.categoryChipIcon}>{category.icon}</Text>
            <Text style={styles.categoryChipText}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Banners Slider */}
      <View style={styles.bannerContainer}>
        <ScrollView
          ref={bannerScrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleBannerScroll}
          scrollEventThrottle={16}
          style={styles.bannerScroll}
        >
          {banners.map((banner) => (
            <View key={banner.id} style={styles.bannerItem}>
              <Image source={{ uri: banner.image }} style={styles.bannerImage} />
              {banner.title && (
                <View style={styles.bannerOverlay}>
                  <Text style={styles.bannerTitle}>{banner.title}</Text>
                </View>
              )}
            </View>
          ))}
        </ScrollView>
        <View style={styles.bannerIndicators}>
          {banners.map((_, index) => (
            <View
              key={index}
              style={[
                styles.bannerIndicator,
                index === currentBannerIndex && styles.bannerIndicatorActive
              ]}
            />
          ))}
        </View>
      </View>

      {/* Top Sellers Section */}
      <View style={styles.topSellersSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top Sellers</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={currentTopSellers}
          renderItem={renderTopSellerItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.topSellersList}
        />
      </View>
    </View>
  );

=======
>>>>>>> 59b5a119e90d67880c7e91df3ad1810d608fbaad
  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>🍎 Fruits & Vegetables</Text>
        <Text style={styles.subtitle}>Fresh from farm to your home</Text>
      </View>
      <TouchableOpacity style={styles.profileButton} onPress={handleProfilePress}>
        <Text style={styles.profileIcon}>👤</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search for fruits & vegetables"
        placeholderTextColor="#666"
        value={searchQuery}
        onChangeText={setSearchQuery}
        returnKeyType="search"
      />
      {searchQuery ? (
        <TouchableOpacity onPress={handleSearchClear} style={styles.searchIcon}>
          <Text style={styles.searchIconText}>✕</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.searchIcon}>
          <Text style={styles.searchIconText}>🔍</Text>
        </View>
      )}
    </View>
  );

  const renderMainCategories = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.mainCategories}
    >
      {mainCategories.map((category) => (
        <TouchableOpacity
          key={category.id}
          style={[
            styles.mainCategory,
            selectedCategory === category.value && styles.mainCategoryActive
          ]}
          onPress={() => {
            setSelectedCategory(category.value as Category);
          }}
        >
          <Text style={[
            styles.mainCategoryText,
            selectedCategory === category.value && styles.mainCategoryTextActive
          ]}>
            {category.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderHorizontalCategories = () => (
    <View style={styles.categoriesTabMain}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesTabScroll}
      >
        {categoryTabItems.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryTabItemHorizontal,
              selectedCategory === category.value && styles.categoryTabItemHorizontalActive
            ]}
            onPress={() => handleCategorySelect(category.value as Category)}
          >
            <View style={[
              styles.categoryTabIconHorizontal,
              selectedCategory === category.value && styles.categoryTabIconHorizontalActive
            ]}>
              <Text style={styles.categoryTabIconText}>{category.icon}</Text>
            </View>
            <Text style={[
              styles.categoryTabNameHorizontal,
              selectedCategory === category.value && styles.categoryTabNameHorizontalActive
            ]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderVerticalCategorySidebar = () => (
    <View style={styles.verticalCategorySidebar}>
      <View style={styles.sidebarHeader}>
        <TouchableOpacity onPress={handleBackToCategories} style={styles.backButtonSidebar}>
          <Text style={styles.backIcon}>←</Text>
          <Text style={styles.backText}>Categories</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.verticalCategoriesContainer}>
        {categoryTabItems.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.verticalCategoryItem,
              selectedCategory === category.value && styles.verticalCategoryItemActive
            ]}
            onPress={() => setSelectedCategory(category.value as Category)}
          >
            <View style={[
              styles.verticalCategoryIcon,
              selectedCategory === category.value && styles.verticalCategoryIconActive
            ]}>
              <Text style={styles.verticalCategoryIconText}>{category.icon}</Text>
            </View>
            <Text style={[
              styles.verticalCategoryName,
              selectedCategory === category.value && styles.verticalCategoryNameActive
            ]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderCategoriesTabBanners = () => (
    <View style={styles.categoriesBannersContainer}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesBannersScrollView}
        contentContainerStyle={{ width: (screenWidth - 32) * categoryOffers.length }}
      >
        {categoryOffers.map((offer, index) => (
          <View 
            key={offer.id} 
            style={[
              styles.categoryBannerCard, 
              { 
                width: screenWidth - 32,
                backgroundColor: offer.backgroundColor
              }
            ]}
          >
            <View style={styles.categoryBannerContent}>
              <View style={styles.categoryBannerTextContainer}>
                <Text style={[styles.categoryBannerTitle, { color: offer.textColor }]}>
                  {offer.title}
                </Text>
                <Text style={[styles.categoryBannerSubtitle, { color: offer.textColor }]}>
                  {offer.subtitle}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  const renderOffersCarousel = () => (
    <View style={styles.offersContainer}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleCarouselScroll}
        scrollEventThrottle={16}
        style={styles.offersScrollView}
        contentContainerStyle={{ width: (screenWidth - 32) * offers.length }}
      >
        {offers.map((offer) => (
          <View key={offer.id} style={[styles.offerCard, { width: screenWidth - 32 }]}>
            <View style={styles.offerContent}>
              <View style={styles.offerTextContainer}>
                <Text style={styles.offerTitle}>{offer.title}</Text>
                <Text style={styles.offerSubtitle}>{offer.subtitle}</Text>
                <TouchableOpacity style={styles.applyButton}>
                  <Text style={styles.applyButtonText}>{offer.buttonText}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.membershipBadge}>
                <Text style={styles.membershipText}>ZERO JOINING FEE</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={styles.indicators}>
        {offers.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              index === currentOfferIndex && styles.indicatorActive
            ]}
          />
        ))}
      </View>
    </View>
  );

  const renderReorderModal = () => (
    <Modal
      visible={reorderModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleReorderModalClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Order to Re-order</Text>
            <TouchableOpacity onPress={handleReorderModalClose}>
              <Text style={styles.modalClose}>✕</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.ordersList}>
            {getRecentOrders().map((order) => (
              <TouchableOpacity
                key={order.id}
                style={styles.orderItem}
                onPress={() => handleSelectOrderForReorder(order.id)}
              >
                <View style={styles.orderInfo}>
                  <Text style={styles.orderNumber}>{order.orderNumber}</Text>
                  <Text style={styles.orderDate}>{order.date}</Text>
                  <Text style={styles.orderTotal}>₹{order.total}</Text>
                </View>
                <View style={styles.orderItemsPreview}>
                  <Text style={styles.orderItemsText}>
                    {order.items.length} items • {order.status}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  const renderBottomNavigation = () => (
    <View style={styles.bottomNav}>
      <TouchableOpacity 
        style={[
          styles.navItem,
          activeTab === 'home' && styles.navItemActive
        ]} 
        onPress={handleHomePress}
      >
        <Text style={[
          styles.navIcon,
          activeTab === 'home' && styles.navIconActive
        ]}>🏠</Text>
        <Text style={[
          styles.navText,
          activeTab === 'home' && styles.navTextActive
        ]}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[
          styles.navItem,
          activeTab === 'categories' && styles.navItemActive
        ]} 
        onPress={handleCategoriesPress}
      >
        <Text style={[
          styles.navIcon,
          activeTab === 'categories' && styles.navIconActive
        ]}>📦</Text>
        <Text style={[
          styles.navText,
          activeTab === 'categories' && styles.navTextActive
        ]}>Categories</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[
          styles.navItem,
          activeTab === 'reorder' && styles.navItemActive
        ]} 
        onPress={handleReorderPress}
      >
        <Text style={[
          styles.navIcon,
          activeTab === 'reorder' && styles.navIconActive
        ]}>🔄</Text>
        <Text style={[
          styles.navText,
          activeTab === 'reorder' && styles.navTextActive
        ]}>Re-Order</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.navItem}
        onPress={() => router.push('/cart')}
      >
        <Text style={styles.navIcon}>🛒</Text>
        <Text style={styles.navText}>Cart</Text>
        {cartItemCount > 0 && (
          <View style={styles.navBadge}>
            <Text style={styles.navBadgeText}>{cartItemCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );

  const renderHomeTabHeader = () => (
    <View style={styles.listHeader}>
      {renderHeader()}
      {renderSearchBar()}
      {renderMainCategories()}
      {renderOffersCarousel()}
    </View>
  );

  const renderCategoriesTabLayout = () => {
    if (showCategorySidebar) {
      return (
        <View style={styles.categoriesTabLayout}>
          <View style={styles.listHeader}>
            {renderHeader()}
            {renderSearchBar()}
          </View>
          <View style={styles.mainContentContainer}>
            {renderVerticalCategorySidebar()}
            <View style={styles.productsGridContainer}>
              <View style={styles.productsHeader}>
                <Text style={styles.productsTitle}>
                  {filteredProducts.length} Products
                  {searchQuery ? ` for "${searchQuery}"` : ''}
                  {selectedCategory !== 'all' ? ` in ${selectedCategory}` : ''}
                </Text>
              </View>
              {filteredProducts.length > 0 ? (
                <FlatList
                  data={filteredProducts}
                  renderItem={renderProductItem}
                  keyExtractor={(item) => item.id}
                  numColumns={2}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.productsGrid}
                />
              ) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>
                    {searchQuery ? `No products found for "${searchQuery}"` : 'No products available'}
                  </Text>
                  {searchQuery && (
                    <TouchableOpacity style={styles.clearSearchButton} onPress={handleSearchClear}>
                      <Text style={styles.clearSearchText}>Clear Search</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          </View>
        </View>
      );
    }
    return (
      <View style={styles.categoriesTabLayout}>
        <FlatList
          ref={flatListRef}
          data={filteredProducts}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          numColumns={2}
          ListHeaderComponent={() => (
            <View style={styles.listHeader}>
              {renderHeader()}
              {renderSearchBar()}
              {renderHorizontalCategories()}
              {renderCategoriesTabBanners()}
            </View>
          )}
          ListEmptyComponent={renderEmptyState}
        />
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>
        {searchQuery ? `No products found for "${searchQuery}"` : 'No products available'}
      </Text>
      {searchQuery && (
        <TouchableOpacity style={styles.clearSearchButton} onPress={handleSearchClear}>
          <Text style={styles.clearSearchText}>Clear Search</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#27ae60" />
      {activeTab === 'home' && (
        <FlatList
          ref={flatListRef}
          data={filteredProducts}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          numColumns={2}
<<<<<<< HEAD
          ListHeaderComponent={() => (
            <View>
              {renderNewUIStructure()}
              {renderOffersCarousel()}
              <View style={styles.productsHeader}>
                <Text style={styles.productsTitle}>
                  {filteredProducts.length} Products
                  {searchQuery ? ` for "${searchQuery}"` : ''}
                  {selectedCategory !== 'all' ? ` in ${selectedCategory}` : ''}
                </Text>
              </View>
            </View>
          )}
=======
          ListHeaderComponent={renderHomeTabHeader}
>>>>>>> 59b5a119e90d67880c7e91df3ad1810d608fbaad
          ListEmptyComponent={renderEmptyState}
        />
      )}
      {activeTab === 'categories' && renderCategoriesTabLayout()}
      {activeTab === 'reorder' && (
        <FlatList
          ref={flatListRef}
          data={filteredProducts}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          numColumns={2}
          ListHeaderComponent={() => (
            <View style={styles.listHeader}>
              {renderHeader()}
              {renderSearchBar()}
            </View>
          )}
          ListEmptyComponent={renderEmptyState}
        />
      )}
      {renderReorderModal()}
      {renderBottomNavigation()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  categoriesTabLayout: {
    flex: 1,
  },
  mainContentContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  verticalCategorySidebar: {
    width: 130,
    backgroundColor: '#f8f9fa',
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
  },
  sidebarHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButtonSidebar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 18,
    marginRight: 8,
    color: '#27ae60',
  },
  backText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#27ae60',
  },
  verticalCategoriesContainer: {
    flex: 1,
  },
  verticalCategoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  verticalCategoryItemActive: {
    backgroundColor: '#e8f6f3',
    borderLeftWidth: 3,
    borderLeftColor: '#27ae60',
  },
  verticalCategoryIcon: {
    width: 25,
    height: 35,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 3,
  },
  verticalCategoryIconActive: {
    backgroundColor: '#27ae60',
  },
  verticalCategoryIconText: {
    fontSize: 16,
  },
  verticalCategoryName: {
    fontSize: 14,
    color: '#2c3e50',
    flex: 1,
  },
  verticalCategoryNameActive: {
    color: '#27ae60',
    fontWeight: '600',
  },
  productsGridContainer: {
    flex: 1,
  },
  productsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0,
    borderBottomColor: '#e0e0e0',
  },
  productsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  productsGrid: {
    padding: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#27ae60',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    color: '#e8f6f3',
    textAlign: 'center',
    marginTop: 2,
    fontStyle: 'italic',
  },
  profileButton: {
    padding: 8,
  },
  profileIcon: {
    fontSize: 24,
    color: '#ffffff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  searchIcon: {
    padding: 4,
  },
  searchIconText: {
    fontSize: 16,
    color: '#666',
  },
  mainCategories: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  mainCategory: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    marginRight: 8,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  mainCategoryActive: {
    backgroundColor: '#27ae60',
    borderColor: '#27ae60',
  },
  mainCategoryText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
  },
  mainCategoryTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  categoriesTabMain: {
    marginVertical: 8,
  },
  categoriesTabScroll: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  categoryTabItemHorizontal: {
    alignItems: 'center',
    marginRight: 16,
    paddingVertical: 8,
    minWidth: 70,
  },
  categoryTabItemHorizontalActive: {
    backgroundColor: '#e8f6f3',
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  categoryTabIconHorizontal: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  categoryTabIconHorizontalActive: {
    backgroundColor: '#27ae60',
    borderColor: '#27ae60',
  },
  categoryTabIconText: {
    fontSize: 20,
  },
  categoryTabNameHorizontal: {
    fontSize: 12,
    fontWeight: '500',
    color: '#2c3e50',
    textAlign: 'center',
  },
  categoryTabNameHorizontalActive: {
    color: '#27ae60',
    fontWeight: 'bold',
  },
  categoriesBannersContainer: {
    marginHorizontal: 16,
    marginVertical: 8,
    height: 80,
  },
  categoriesBannersScrollView: {
    width: screenWidth - 32,
  },
  categoryBannerCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  categoryBannerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryBannerTextContainer: {
    flex: 1,
  },
  categoryBannerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  categoryBannerSubtitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  offersContainer: {
    marginHorizontal: 16,
    marginVertical: 8,
    height: 120,
  },
  offersScrollView: {
    width: screenWidth - 32,
  },
  offerCard: {
    backgroundColor: '#e8f6f3',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#27ae60',
  },
  offerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  offerTextContainer: {
    flex: 1,
  },
  offerTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  offerSubtitle: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 8,
  },
  applyButton: {
    backgroundColor: '#27ae60',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 15,
    alignSelf: 'flex-start',
  },
  applyButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  membershipBadge: {
    backgroundColor: '#27ae60',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  membershipText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#bdc3c7',
    marginHorizontal: 3,
  },
  indicatorActive: {
    backgroundColor: '#27ae60',
    width: 12,
  },
  listHeader: {
    paddingBottom: 16,
  },
  listContent: {
    paddingBottom: 80,
  },
  productCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    margin: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f0f0f0',
    padding: 8,
  },
  productImageContainer: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 8,
  },
  productImage: {
    width: 120,
    height: 120,
    resizeMode: 'cover',
    borderRadius: 8,
  },
<<<<<<< HEAD
  // Offer Cross Badge Styles
  offerCrossBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    zIndex: 2,
  },
  offerCrossLine: {
    position: 'absolute',
    width: 60,
    height: 20,
    backgroundColor: 'transparent',
    borderTopWidth: 20,
    borderTopColor: '#e74c3c',
    borderRightWidth: 10,
    borderRightColor: 'transparent',
  },
  offerCrossText: {
    position: 'absolute',
    top: 2,
    left: 4,
    fontSize: 9,
    fontWeight: 'bold',
    color: '#ffffff',
    width: 50,
    textAlign: 'center',
  },
=======
>>>>>>> 59b5a119e90d67880c7e91df3ad1810d608fbaad
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#e74c3c',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
<<<<<<< HEAD
    zIndex: 1,
=======
>>>>>>> 59b5a119e90d67880c7e91df3ad1810d608fbaad
  },
  discountText: {
    fontSize: 10,
    color: 'white',
    fontWeight: 'bold',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
    height: 36,
  },
  unitSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignSelf: 'flex-start',
  },
  unitSelectorText: {
    fontSize: 12,
    color: '#2c3e50',
    marginRight: 4,
    maxWidth: 80,
  },
  unitSelectorIcon: {
    fontSize: 10,
    color: '#7f8c8d',
  },
  priceContainer: {
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginRight: 8,
  },
  productOriginalPrice: {
    fontSize: 12,
    color: '#95a5a6',
    textDecorationLine: 'line-through',
  },
  offBadge: {
    backgroundColor: '#e8f6f3',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  offText: {
    fontSize: 10,
    color: '#27ae60',
    fontWeight: 'bold',
  },
  productUnit: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 8,
  },
  addButton: {
    backgroundColor: '#27ae60',
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: 'center',
    marginTop: 'auto',
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
<<<<<<< HEAD
  // Updated Unit Modal Styles
=======
>>>>>>> 59b5a119e90d67880c7e91df3ad1810d608fbaad
  unitModalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
<<<<<<< HEAD
    maxHeight: '70%',
=======
    maxHeight: '60%',
>>>>>>> 59b5a119e90d67880c7e91df3ad1810d608fbaad
  },
  unitModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
<<<<<<< HEAD
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  modalProductInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  modalProductImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  modalProductDetails: {
    flex: 1,
  },
  modalProductName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  modalProductPrice: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalCurrentPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginRight: 8,
  },
  modalOriginalPrice: {
    fontSize: 14,
    color: '#95a5a6',
    textDecorationLine: 'line-through',
=======
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  unitModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
>>>>>>> 59b5a119e90d67880c7e91df3ad1810d608fbaad
  },
  unitModalCloseBtn: {
    padding: 4,
  },
  unitModalClose: {
    fontSize: 24,
    color: '#7f8c8d',
  },
<<<<<<< HEAD
  modalDivider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 16,
  },
  modalSectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
=======
  productNameInModal: {
    fontSize: 16,
    fontWeight: '600',
>>>>>>> 59b5a119e90d67880c7e91df3ad1810d608fbaad
    color: '#2c3e50',
    marginBottom: 16,
    textAlign: 'center',
  },
  unitOptionsContainer: {
    marginBottom: 20,
  },
  unitOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedUnitOption: {
    backgroundColor: '#e8f6f3',
    borderColor: '#27ae60',
    borderWidth: 2,
  },
  unitLeftSection: {
    flex: 1,
  },
<<<<<<< HEAD
=======
  unitTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
>>>>>>> 59b5a119e90d67880c7e91df3ad1810d608fbaad
  unitText: {
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: '500',
<<<<<<< HEAD
=======
    marginRight: 8,
>>>>>>> 59b5a119e90d67880c7e91df3ad1810d608fbaad
  },
  selectedUnitText: {
    color: '#27ae60',
    fontWeight: '600',
  },
<<<<<<< HEAD
=======
  unitDiscountBadge: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  unitDiscountText: {
    fontSize: 10,
    color: 'white',
    fontWeight: 'bold',
  },
>>>>>>> 59b5a119e90d67880c7e91df3ad1810d608fbaad
  unitRightSection: {
    alignItems: 'flex-end',
  },
  unitPriceContainer: {
    alignItems: 'flex-end',
    marginBottom: 4,
  },
  unitPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  selectedUnitPrice: {
    color: '#27ae60',
  },
  unitOriginalPrice: {
    fontSize: 12,
    color: '#95a5a6',
    textDecorationLine: 'line-through',
    marginTop: 2,
  },
<<<<<<< HEAD
  unitDiscountBadge: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  unitDiscountText: {
    fontSize: 10,
    color: 'white',
    fontWeight: 'bold',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  totalContainer: {
    flex: 1,
  },
  totalLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  confirmButton: {
    backgroundColor: '#27ae60',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 16,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
=======
  unitSelectButton: {
    fontSize: 12,
    color: '#27ae60',
    fontWeight: 'bold',
  },
  closeModalButton: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeModalButtonText: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '600',
>>>>>>> 59b5a119e90d67880c7e91df3ad1810d608fbaad
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingVertical: 8,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    position: 'relative',
  },
  navItemActive: {
    backgroundColor: '#f8f9fa',
  },
  navIcon: {
    fontSize: 18,
    marginBottom: 2,
  },
  navIconActive: {
    color: '#27ae60',
  },
  navText: {
    fontSize: 10,
    color: '#7f8c8d',
  },
  navTextActive: {
    color: '#27ae60',
    fontWeight: 'bold',
  },
  navBadge: {
    position: 'absolute',
    top: 4,
    right: 20,
    backgroundColor: '#e74c3c',
    borderRadius: 8,
    minWidth: 14,
    height: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navBadgeText: {
    color: 'white',
    fontSize: 8,
    fontWeight: 'bold',
  },
  emptyState: {
    flex: 1,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 16,
  },
  clearSearchButton: {
    backgroundColor: '#27ae60',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  clearSearchText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  modalClose: {
    fontSize: 20,
    color: '#7f8c8d',
    padding: 4,
  },
  ordersList: {
    padding: 16,
  },
  orderItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  orderInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  orderDate: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  orderTotal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  orderItemsPreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderItemsText: {
    fontSize: 12,
    color: '#7f8c8d',
  },
<<<<<<< HEAD
  newUIStructure: {
    backgroundColor: '#ffffff',
    paddingBottom: 16,
  },
  // Updated Shop Info Container
  shopInfoContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#27ae60',
  },
  shopInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  shopInfoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  locationIcon: {
    fontSize: 14,
    color: '#ffffff',
    marginRight: 6,
  },
  shopName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  vendorInfo: {
    marginBottom: 4,
  },
  vendorLabel: {
    fontSize: 12,
    color: '#e8f6f3',
    marginBottom: 2,
  },
  vendorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  profileButtonNew: {
    padding: 8,
  },
  profileIconNew: {
    fontSize: 24,
    color: '#ffffff',
  },
  shopAddress: {
    fontSize: 12,
    color: '#c8e6c9',
  },
  searchBarNew: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchIconContainer: {
    marginRight: 8,
  },
  searchIconNew: {
    fontSize: 18,
    color: '#666',
  },
  searchInputNew: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    padding: 0,
  },
  clearSearchIcon: {
    padding: 4,
  },
  clearIcon: {
    fontSize: 18,
    color: '#666',
  },
  // Moved Delivery Type to top
  deliveryTypeContainer: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  deliveryButtons: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 4,
  },
  deliveryButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  deliveryButtonActive: {
    backgroundColor: '#27ae60',
    shadowColor: '#27ae60',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  deliveryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  deliveryButtonTextActive: {
    color: '#ffffff',
  },
  nextDayBadge: {
    backgroundColor: '#ff6b6b',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 6,
  },
  nextDayBadgeText: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  categoriesScroll: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  categoriesContainer: {
    paddingRight: 16,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f7ff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#d1e7ff',
  },
  categoryChipIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0066cc',
  },
  bannerContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    height: 140,
    borderRadius: 12,
    overflow: 'hidden',
  },
  bannerScroll: {
    height: '100%',
  },
  bannerItem: {
    width: screenWidth - 32,
    height: '100%',
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 12,
  },
  bannerTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bannerIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
  },
  bannerIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  bannerIndicatorActive: {
    backgroundColor: '#ffffff',
    width: 16,
  },
  topSellersSection: {
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllText: {
    fontSize: 14,
    color: '#27ae60',
    fontWeight: '500',
  },
  topSellersList: {
    paddingRight: 16,
  },
  topSellerCard: {
    width: 140,
    marginRight: 12,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  topSellerImageContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  topSellerImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  topSellerDiscountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#e74c3c',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  topSellerDiscountText: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  topSellerInfo: {
    flex: 1,
  },
  topSellerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  topSellerRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  topSellerRatingIcon: {
    fontSize: 12,
    color: '#ffc107',
    marginRight: 2,
  },
  topSellerRatingText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  topSellerPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  topSellerPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginRight: 6,
  },
  topSellerOriginalPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  topSellerUnit: {
    fontSize: 12,
    color: '#888',
  },
=======
>>>>>>> 59b5a119e90d67880c7e91df3ad1810d608fbaad
});

export default ProductList;