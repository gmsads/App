import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getCartItemCount } from './cartStore';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  unit: string;
}

type Category = 'all' | 'fruit' | 'vegetable';

const ProductList: React.FC = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);
  const [hasActiveOrder, setHasActiveOrder] = useState(true); // Set to true to simulate active order
  const [deliveryTime, setDeliveryTime] = useState(5); // Starting with 5 minutes
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  const offers = [
    {
      id: '1',
      badge: '30% OFF',
      text: 'On all fruits above ₹100',
    },
    {
      id: '2',
      badge: 'BUY 1 GET 1',
      text: 'On selected vegetables',
    },
    {
      id: '3',
      badge: 'FREE DELIVERY',
      text: 'On orders above ₹200',
    },
  ];

  // Animation for offers carousel
  useEffect(() => {
    const interval = setInterval(() => {
      // Fade out animation
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setCurrentOfferIndex((prevIndex) => 
          prevIndex === offers.length - 1 ? 0 : prevIndex + 1
        );
        // Reset position and fade in
        slideAnim.setValue(50);
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      });
    }, 4000); // Change offer every 4 seconds

    return () => clearInterval(interval);
  }, [fadeAnim, slideAnim, offers.length]);

  // Animation for delivery tracking banner
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  // Countdown timer for delivery
  useEffect(() => {
    if (hasActiveOrder && deliveryTime > 0) {
      const timer = setInterval(() => {
        setDeliveryTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prevTime - 1;
        });
      }, 60000); // Update every minute

      return () => clearInterval(timer);
    }
  }, [hasActiveOrder, deliveryTime]);

  const [products] = useState<Product[]>([
    {
      id: '1',
      name: 'Fresh Red Apples',
      price: 249,
      image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400&h=300&fit=crop',
      description: 'Sweet and crunchy red apples, perfect for snacking and baking',
      category: 'fruit',
      unit: 'per kg'
    },
    {
      id: '2',
      name: 'Organic Carrots',
      price: 89,
      image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&h=300&fit=crop',
      description: 'Fresh organic carrots, rich in vitamins and perfect for cooking',
      category: 'vegetable',
      unit: 'per kg'
    },
    {
      id: '3',
      name: 'Ripe Bananas',
      price: 59,
      image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=300&fit=crop',
      description: 'Perfectly ripe bananas, great for smoothies and healthy snacks',
      category: 'fruit',
      unit: 'per kg'
    },
    {
      id: '4',
      name: 'Fresh Spinach',
      price: 39,
      image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=300&fit=crop',
      description: 'Nutrient-packed fresh spinach leaves for salads and cooking',
      category: 'vegetable',
      unit: 'per bunch'
    },
    {
      id: '5',
      name: 'Sweet Strawberries',
      price: 349,
      image: 'https://images.unsplash.com/photo-1464454709131-ffd692591ee5?w=400&h=300&fit=crop',
      description: 'Juicy sweet strawberries, perfect for desserts and snacks',
      category: 'fruit',
      unit: 'per kg'
    },
    {
      id: '6',
      name: 'Broccoli',
      price: 99,
      image: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400&h=300&fit=crop',
      description: 'Fresh green broccoli, packed with nutrients and vitamins',
      category: 'vegetable',
      unit: 'per kg'
    },
    {
      id: '7',
      name: 'Oranges',
      price: 129,
      image: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=400&h=300&fit=crop',
      description: 'Sweet and juicy oranges, great for juice and snacking',
      category: 'fruit',
      unit: 'per kg'
    },
    {
      id: '8',
      name: 'Bell Peppers',
      price: 179,
      image: 'https://images.unsplash.com/photo-1525607551107-68e20c75b1a8?w=400&h=300&fit=crop',
      description: 'Colorful bell peppers, perfect for salads and cooking',
      category: 'vegetable',
      unit: 'per kg'
    },
    {
      id: '9',
      name: 'Grapes',
      price: 199,
      image: 'https://images.unsplash.com/photo-1593505736021-0d3d8edec366?w=400&h=300&fit=crop',
      description: 'Sweet seedless grapes, perfect for snacking and fruit salads',
      category: 'fruit',
      unit: 'per kg'
    },
    {
      id: '10',
      name: 'Tomatoes',
      price: 49,
      image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=300&fit=crop',
      description: 'Fresh ripe tomatoes, ideal for salads and cooking',
      category: 'vegetable',
      unit: 'per kg'
    },
    {
      id: '11',
      name: 'Avocado',
      price: 149,
      image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&h=300&fit=crop',
      description: 'Creamy ripe avocados, perfect for guacamole and toast',
      category: 'fruit',
      unit: 'each'
    },
    {
      id: '12',
      name: 'Cucumber',
      price: 25,
      image: 'https://images.unsplash.com/photo-1565193564509-8d1e5d80d1e5?w=400&h=300&fit=crop',
      description: 'Fresh crispy cucumbers, great for salads and snacks',
      category: 'vegetable',
      unit: 'each'
    },
    {
      id: '13',
      name: 'Pineapple',
      price: 99,
      image: 'https://images.unsplash.com/photo-1589820296152-9dbb6d8cee06?w=400&h=300&fit=crop',
      description: 'Sweet tropical pineapple, perfect for desserts and smoothies',
      category: 'fruit',
      unit: 'each'
    },
    {
      id: '14',
      name: 'Potatoes',
      price: 35,
      image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=300&fit=crop',
      description: 'Versatile potatoes, ideal for baking, boiling, and frying',
      category: 'vegetable',
      unit: 'per kg'
    },
    {
      id: '15',
      name: 'Watermelon',
      price: 79,
      image: 'https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?w=400&h=300&fit=crop',
      description: 'Refreshing sweet watermelon, perfect for summer',
      category: 'fruit',
      unit: 'each'
    },
    {
      id: '16',
      name: 'Onions',
      price: 45,
      image: 'https://images.unsplash.com/photo-1508002366005-75a695ee2d17?w=400&h=300&fit=crop',
      description: 'Fresh onions, essential for cooking and flavoring',
      category: 'vegetable',
      unit: 'per kg'
    },
    {
      id: '17',
      name: 'Mango',
      price: 129,
      image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&h=300&fit=crop',
      description: 'Sweet tropical mangoes, perfect for smoothies and desserts',
      category: 'fruit',
      unit: 'each'
    },
    {
      id: '18',
      name: 'Lettuce',
      price: 45,
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop',
      description: 'Crisp fresh lettuce, perfect for salads and sandwiches',
      category: 'vegetable',
      unit: 'per head'
    },
    {
      id: '19',
      name: 'Blueberries',
      price: 449,
      image: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=400&h=300&fit=crop',
      description: 'Sweet antioxidant-rich blueberries, great for breakfast',
      category: 'fruit',
      unit: 'per kg'
    },
    {
      id: '20',
      name: 'Zucchini',
      price: 89,
      image: 'https://images.unsplash.com/photo-1570194065650-2f276eef1a61?w=400&h=300&fit=crop',
      description: 'Fresh zucchini, versatile for grilling and cooking',
      category: 'vegetable',
      unit: 'per kg'
    }
  ]);

  // Filter products based on selected category
  const filteredProducts = products.filter(product => {
    if (selectedCategory === 'all') return true;
    return product.category === selectedCategory;
  });

  const handleProductPress = (product: Product) => {
    router.push({
      pathname: '/productdetail',
      params: { product: JSON.stringify(product) }
    });
  };

  const handleProfilePress = () => {
    router.push('/profile');
  };

  const handleTrackOrderPress = () => {
    router.push('/cart');
  };

  const renderDeliveryTrackingBanner = () => {
    if (!hasActiveOrder) return null;

    return (
      <Animated.View 
        style={[
          styles.deliveryBanner,
          {
            transform: [{ scale: pulseAnim }]
          }
        ]}
      >
        <View style={styles.deliveryBannerContent}>
          <View style={styles.deliveryIconContainer}>
            <Text style={styles.deliveryIcon}>🚚</Text>
          </View>
          <View style={styles.deliveryTextContainer}>
            <Text style={styles.deliveryTitle}>Your order is on the way!</Text>
            <Text style={styles.deliverySubtitle}>
              {deliveryTime > 0 
                ? `Estimated delivery in ${deliveryTime} minute${deliveryTime > 1 ? 's' : ''}`
                : 'Your order has been delivered!'
              }
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.trackButton}
            onPress={handleTrackOrderPress}
          >
            <Text style={styles.trackButtonText}>Track</Text>
          </TouchableOpacity>
        </View>
        
        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill,
                { 
                  width: `${((5 - deliveryTime) / 5) * 100}%`,
                  backgroundColor: deliveryTime === 0 ? '#2ecc71' : '#3498db'
                }
              ]} 
            />
          </View>
          <View style={styles.progressLabels}>
            <Text style={styles.progressLabel}>Ordered</Text>
            <Text style={styles.progressLabel}>On the way</Text>
            <Text style={styles.progressLabel}>Delivered</Text>
          </View>
        </View>
      </Animated.View>
    );
  };

  const renderProductItem = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => handleProductPress(item)}
    >
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productCategory}>
          {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
        </Text>
        <Text style={styles.productPrice}>₹{item.price}</Text>
        <Text style={styles.productUnit}>{item.unit}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderCategoryTabs = () => (
    <View style={styles.categoryTabs}>
      <TouchableOpacity
        style={[
          styles.categoryTab,
          selectedCategory === 'all' && styles.categoryTabActive
        ]}
        onPress={() => setSelectedCategory('all')}
      >
        <Text style={[
          styles.categoryTabText,
          selectedCategory === 'all' && styles.categoryTabTextActive
        ]}>
          All
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.categoryTab,
          selectedCategory === 'fruit' && styles.categoryTabActive
        ]}
        onPress={() => setSelectedCategory('fruit')}
      >
        <Text style={[
          styles.categoryTabText,
          selectedCategory === 'fruit' && styles.categoryTabTextActive
        ]}>
          Fruits
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.categoryTab,
          selectedCategory === 'vegetable' && styles.categoryTabActive
        ]}
        onPress={() => setSelectedCategory('vegetable')}
      >
        <Text style={[
          styles.categoryTabText,
          selectedCategory === 'vegetable' && styles.categoryTabTextActive
        ]}>
          Vegetables
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderOffersSection = () => (
    <View style={styles.offersContainer}>
      <Text style={styles.offersTitle}>🔥 Today's Special Offers</Text>
      
      <View style={styles.offersScroll}>
        <Animated.View 
          style={[
            styles.offerCard,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={styles.offerBadge}>{offers[currentOfferIndex].badge}</Text>
          <Text style={styles.offerText}>{offers[currentOfferIndex].text}</Text>
        </Animated.View>
        
        {/* Indicators */}
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
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      
      {/* Delivery Tracking Banner */}
      {renderDeliveryTrackingBanner()}
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Fresh Market</Text>
        <Text style={styles.headerSubtitle}>Quality Fruits & Vegetables</Text>
        
        {/* Profile Icon */}
        <TouchableOpacity 
          style={styles.profileIcon}
          onPress={handleProfilePress}
        >
          <Text style={styles.profileIconText}>👤</Text>
        </TouchableOpacity>
        
        {/* Cart Icon */}
        <TouchableOpacity 
          style={styles.cartIcon}
          onPress={() => router.push('/cart')}
        >
          <Text style={styles.cartIconText}>🛒</Text>
          {getCartItemCount() > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{getCartItemCount()}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      
      {/* Offers Section */}
      {renderOffersSection()}
      
      {/* Category Tabs */}
      {renderCategoryTabs()}
      
      <FlatList
        data={filteredProducts}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        numColumns={2}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  // Delivery Tracking Banner Styles
  deliveryBanner: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  deliveryBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  deliveryIconContainer: {
    marginRight: 12,
  },
  deliveryIcon: {
    fontSize: 24,
  },
  deliveryTextContainer: {
    flex: 1,
  },
  deliveryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 2,
  },
  deliverySubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  trackButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  trackButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  progressBarContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#ecf0f1',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: 10,
    color: '#95a5a6',
    fontWeight: '500',
  },
  header: {
    backgroundColor: '#2ecc71',
    padding: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginTop: 5,
    opacity: 0.9,
  },
  profileIcon: {
    position: 'absolute',
    right: 70,
    top: 15,
    padding: 8,
  },
  profileIconText: {
    fontSize: 24,
  },
  cartIcon: {
    position: 'absolute',
    right: 20,
    top: 15,
    padding: 8,
  },
  cartIconText: {
    fontSize: 24,
  },
  cartBadge: {
    position: 'absolute',
    right: -5,
    top: -5,
    backgroundColor: '#e74c3c',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  offersContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  offersTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
  },
  offersScroll: {
    alignItems: 'center',
  },
  offerCard: {
    backgroundColor: '#fff9e6',
    padding: 16,
    borderRadius: 12,
    minWidth: '90%',
    borderWidth: 1,
    borderColor: '#ffeaa7',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  offerBadge: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: 6,
  },
  offerText: {
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: '600',
    textAlign: 'center',
  },
  indicators: {
    flexDirection: 'row',
    marginTop: 12,
    justifyContent: 'center',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#bdc3c7',
    marginHorizontal: 4,
  },
  indicatorActive: {
    backgroundColor: '#2ecc71',
    width: 20,
  },
  categoryTabs: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  categoryTab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginHorizontal: 4,
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  categoryTabActive: {
    backgroundColor: '#2ecc71',
  },
  categoryTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7f8c8d',
  },
  categoryTabTextActive: {
    color: 'white',
  },
  listContent: {
    padding: 8,
    paddingBottom: 20,
  },
  productCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    margin: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    flex: 1,
    maxWidth: '47%',
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 6,
    textTransform: 'capitalize',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: 2,
  },
  productUnit: {
    fontSize: 10,
    color: '#95a5a6',
  },
});

export default ProductList;