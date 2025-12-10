// Import React and necessary hooks
import React, { useState } from 'react';

// Import React Native components
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  RefreshControl,
  Switch,
} from 'react-native';

// Import navigation
import { useRouter } from 'expo-router';

// Import icon libraries
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

// ==============================================
// TYPE DEFINITIONS
// ==============================================

// Define the Product type
type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: string;
  inStock: boolean;
  isActive: boolean;
  sameDayPrice?: number;
  nextDayPrice?: number;
  quantityTypes?: string[];
  status?: 'approved' | 'pending' | 'rejected';
};

// ==============================================
// PRODUCT LIST COMPONENT
// ==============================================
const ProductList: React.FC = () => {
  // Initialize router for navigation
  const router = useRouter();
  
  // State for products data
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Fresh Tomatoes',
      category: 'vegetables',
      price: 40,
      quantity: '1 kg',
      inStock: true,
      isActive: true,
      sameDayPrice: 45,
      nextDayPrice: 40,
      quantityTypes: ['250g', '500g', '1kg'],
      status: 'approved',
    },
    {
      id: '2',
      name: 'Organic Apples',
      category: 'fruits',
      price: 120,
      quantity: '1 kg',
      inStock: true,
      isActive: true,
      sameDayPrice: 125,
      nextDayPrice: 120,
      quantityTypes: ['500g', '1kg', '2kg'],
      status: 'approved',
    },
    {
      id: '3',
      name: 'Fresh Potatoes',
      category: 'vegetables',
      price: 35,
      quantity: '1 kg',
      inStock: false,
      isActive: true,
      sameDayPrice: 40,
      nextDayPrice: 35,
      quantityTypes: ['1kg', '2kg', '5kg'],
      status: 'approved',
    },
    {
      id: '4',
      name: 'Milk',
      category: 'dairy',
      price: 60,
      quantity: '1 litre',
      inStock: true,
      isActive: false,
      sameDayPrice: 65,
      nextDayPrice: 60,
      quantityTypes: ['500ml', '1l', '2l'],
      status: 'approved',
    },
    {
      id: '5',
      name: 'Rice',
      category: 'grains',
      price: 90,
      quantity: '1 kg',
      inStock: true,
      isActive: true,
      sameDayPrice: 95,
      nextDayPrice: 90,
      quantityTypes: ['1kg', '2kg', '5kg'],
      status: 'approved',
    },
    {
      id: '6',
      name: 'Bread',
      category: 'bakery',
      price: 35,
      quantity: '1 pack',
      inStock: false,
      isActive: true,
      sameDayPrice: 40,
      nextDayPrice: 35,
      quantityTypes: ['1 pack', '2 packs'],
      status: 'approved',
    },
    {
      id: '7',
      name: 'Eggs',
      category: 'dairy',
      price: 80,
      quantity: '1 dozen',
      inStock: true,
      isActive: true,
      sameDayPrice: 85,
      nextDayPrice: 80,
      quantityTypes: ['6 pcs', '12 pcs'],
      status: 'approved',
    },
    {
      id: '8',
      name: 'Onions',
      category: 'vegetables',
      price: 30,
      quantity: '1 kg',
      inStock: true,
      isActive: false,
      sameDayPrice: 35,
      nextDayPrice: 30,
      quantityTypes: ['250g', '500g', '1kg'],
      status: 'approved',
    },
  ]);
  
  // State for search functionality
  const [searchQuery, setSearchQuery] = useState('');
  
  // State for category filtering
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // State for pull-to-refresh
  const [refreshing, setRefreshing] = useState(false);
  
  // Define categories with icons and counts
  const categories = [
    { id: 'all', name: 'All Products', icon: 'grid-outline' as const, count: products.length },
    { id: 'vegetables', name: 'Vegetables', icon: 'leaf-outline' as const, count: 3 },
    { id: 'fruits', name: 'Fruits', icon: 'nutrition-outline' as const, count: 1 },
    { id: 'dairy', name: 'Dairy', icon: 'egg-outline' as const, count: 2 },
    { id: 'grains', name: 'Grains', icon: 'fast-food-outline' as const, count: 1 },
    { id: 'bakery', name: 'Bakery', icon: 'restaurant-outline' as const, count: 1 },
  ];

  // Filter products based on search query and selected category
  const filteredProducts = products.filter(product => {
    // Check if product name matches search query (case insensitive)
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Check if product category matches selected category
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    
    // Return products that match both conditions
    return matchesSearch && matchesCategory;
  });

  // Update category counts based on filtered data
  const getCategoryCounts = () => {
    const counts: { [key: string]: number } = { all: products.length };
    categories.forEach(cat => {
      if (cat.id !== 'all') {
        counts[cat.id] = products.filter(p => p.category === cat.id).length;
      }
    });
    return counts;
  };

  const categoryCounts = getCategoryCounts();

  // Handle pull-to-refresh action
  const onRefresh = () => {
    setRefreshing(true);
    // Simulate API call with timeout
    setTimeout(() => setRefreshing(false), 1000);
  };

  // Toggle product active status
  const handleToggleActive = (productId: string) => {
    setProducts(prev => prev.map(product => {
      if (product.id === productId) {
        const newStatus = !product.isActive;
        Alert.alert(
          newStatus ? 'Product Activated' : 'Product Deactivated',
          `"${product.name}" has been ${newStatus ? 'activated' : 'deactivated'}`,
          [{ text: 'OK' }]
        );
        return { ...product, isActive: newStatus };
      }
      return product;
    }));
  };

  // Navigate to edit product
  const handleEditProduct = (product: Product) => {
    router.push({
      pathname: '/shopkeeper/products/add-product',
      params: {
        productId: product.id,
        productName: product.name,
        category: product.category,
      }
    });
  };

  // Render the product list
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>My Products</Text>
          <Text style={styles.headerSubtitle}>Manage your product listings</Text>
        </View>
        <View style={styles.headerStats}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{filteredProducts.length}</Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        {/* Search icon */}
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        
        {/* Search input field */}
        <TextInput
          style={styles.searchInput}
          placeholder="Search products by name..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        
        {/* Clear search button (shown only when there's text) */}
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Category Filter Horizontal Scroll */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.categoryContainer}
        contentContainerStyle={styles.categoryContent}
      >
        {categories.map(category => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton, 
              selectedCategory === category.id && styles.categoryButtonActive
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            {/* Category icon */}
            <Ionicons
              name={category.icon}
              size={16}
              color={selectedCategory === category.id ? '#fff' : '#666'}
            />
            
            {/* Category name */}
            <Text style={[
              styles.categoryText, 
              selectedCategory === category.id && styles.categoryTextActive
            ]}>
              {category.name}
            </Text>
            
            {/* Product count in category */}
            <View style={[
              styles.categoryCount,
              selectedCategory === category.id && styles.categoryCountActive
            ]}>
              <Text style={[
                styles.countText, 
                selectedCategory === category.id && styles.countTextActive
              ]}>
                {categoryCounts[category.id] || 0}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Products List with Pull-to-Refresh */}
      <ScrollView
        style={styles.productsContainer}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            colors={['#4CAF50']}
            tintColor="#4CAF50"
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Products Header */}
        <View style={styles.productsHeader}>
          <Text style={styles.productsTitle}>
            {selectedCategory === 'all' 
              ? 'All Products' 
              : categories.find(c => c.id === selectedCategory)?.name || 'Products'
            }
          </Text>
          <Text style={styles.productsCount}>
            {filteredProducts.length} products
          </Text>
        </View>

        {/* Product Cards - DETAILED VERSION */}
        {filteredProducts.map(product => (
          <View key={product.id} style={styles.productCard}>
            {/* Product Header Section */}
            <View style={styles.productHeader}>
              {/* Product Info (Left side) */}
              <View style={styles.productInfo}>
                <Text style={styles.productName}>
                  {product.name}
                </Text>
                <View style={styles.productMeta}>
                  <Text style={styles.productCategory}>
                    {product.category}
                  </Text>
                  {/* Status Badge */}
                  {product.status && (
                    <View style={[
                      styles.statusBadge, 
                      { 
                        backgroundColor: product.status === 'approved' 
                          ? '#4CAF50' 
                          : product.status === 'pending' 
                          ? '#FF9800' 
                          : '#f44336' 
                      }
                    ]}>
                      <Text style={styles.statusText}>
                        {product.status}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
              
              {/* Price Info (Right side) */}
              <View style={styles.priceContainer}>
                <Text style={styles.price}>
                  ₹{product.price}
                </Text>
                <Text style={styles.quantity}>
                  {product.quantity}
                </Text>
              </View>
            </View>

            {/* Product Details Section */}
            <View style={styles.productDetails}>
              {/* Quantity Types */}
              {product.quantityTypes && product.quantityTypes.length > 0 && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>
                    Quantity Types:
                  </Text>
                  <View style={styles.quantityTypes}>
                    {product.quantityTypes.map((type, index) => (
                      <Text key={index} style={styles.quantityType}>
                        {type}
                      </Text>
                    ))}
                  </View>
                </View>
              )}
              
              {/* Same Day/Next Day Prices */}
              {product.sameDayPrice && product.nextDayPrice && (
                <View style={styles.detailRow}>
                  <View style={styles.dayPrices}>
                    {/* Same Day Price */}
                    <View style={styles.dayPrice}>
                      <Text style={styles.dayLabel}>
                        Same Day:
                      </Text>
                      <Text style={styles.dayPriceValue}>
                        ₹{product.sameDayPrice}
                      </Text>
                    </View>
                    
                    {/* Next Day Price */}
                    <View style={styles.dayPrice}>
                      <Text style={styles.dayLabel}>
                        Next Day:
                      </Text>
                      <Text style={styles.dayPriceValue}>
                        ₹{product.nextDayPrice}
                      </Text>
                    </View>
                  </View>
                </View>
              )}

              {/* Stock Status */}
              <View style={styles.stockStatus}>
                <View style={[
                  styles.stockIndicator, 
                  { 
                    backgroundColor: product.inStock ? '#4CAF50' : '#f44336' 
                  }
                ]}>
                  <Text style={styles.stockText}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Product Action Buttons */}
            <View style={styles.productActions}>
              {/* Edit Button */}
              <TouchableOpacity 
                style={[styles.actionButton, styles.editButton]} 
                onPress={() => handleEditProduct(product)}
              >
                <MaterialIcons name="edit" size={16} color="#2196F3" />
                <Text style={[styles.actionText, { color: '#2196F3' }]}>
                  Edit
                </Text>
              </TouchableOpacity>
              
              {/* Active Status Toggle */}
              <View style={styles.toggleContainer}>
                <Text style={styles.toggleLabel}>
                  {product.isActive ? 'Active' : 'Inactive'}
                </Text>
                <Switch
                  value={product.isActive}
                  onValueChange={() => handleToggleActive(product.id)}
                  trackColor={{ false: '#e0e0e0', true: '#4CAF50' }}
                  thumbColor="#fff"
                  ios_backgroundColor="#e0e0e0"
                />
              </View>
            </View>
          </View>
        ))}

        {/* Empty State (No products found) */}
        {filteredProducts.length === 0 && (
          <View style={styles.emptyState}>
            <MaterialIcons name="inventory" size={64} color="#ddd" />
            <Text style={styles.emptyStateText}>
              No products found
            </Text>
            <Text style={styles.emptyStateSubtext}>
              Try changing your search or filters
            </Text>
          </View>
        )}

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
};

// ==============================================
// STYLES
// ==============================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  headerStats: {
    marginLeft: 20,
  },
  statBox: {
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    height: 48,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 0,
  },
  categoryContainer: {
    paddingLeft: 16,
  },
  categoryContent: {
    paddingRight: 16,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  categoryButtonActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginLeft: 6,
    marginRight: 6,
  },
  categoryTextActive: {
    color: '#fff',
  },
  categoryCount: {
    backgroundColor: '#fff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 24,
    alignItems: 'center',
  },
  categoryCountActive: {
    backgroundColor: '#fff',
  },
  countText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  countTextActive: {
    color: '#4CAF50',
  },
  productsContainer: {
    flex: 1,
    padding: 16,
  },
  productsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  productsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  productsCount: {
    fontSize: 14,
    color: '#666',
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  // Product Header Styles
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  productMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  productCategory: {
    fontSize: 12,
    color: '#666',
    textTransform: 'capitalize',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  quantity: {
    fontSize: 12,
    color: '#666',
  },
  // Product Details Styles
  productDetails: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
    marginBottom: 12,
  },
  detailRow: {
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  quantityTypes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quantityType: {
    fontSize: 12,
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  dayPrices: {
    flexDirection: 'row',
    gap: 16,
  },
  dayPrice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dayLabel: {
    fontSize: 12,
    color: '#666',
  },
  dayPriceValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  stockStatus: {
    marginTop: 8,
  },
  stockIndicator: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  stockText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
  },
  // Product Actions Styles
  productActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#f5f5f5',
    gap: 4,
  },
  editButton: {
    backgroundColor: '#e3f2fd',
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  toggleLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  // Empty State Styles
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#999',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 4,
  },
  bottomSpacing: {
    height: 20,
  },
});

export default ProductList;