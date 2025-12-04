import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: string;
  status: 'approved' | 'pending' | 'rejected';
  inStock: boolean;
  quantityTypes: string[];
  sameDayPrice?: number;
  nextDayPrice?: number;
};

const ProductList: React.FC = () => {
  const router = useRouter();
  
  const [products] = useState<Product[]>([
    {
      id: '1',
      name: 'Fresh Tomatoes',
      category: 'vegetables',
      price: 40,
      quantity: '1 kg',
      status: 'approved',
      inStock: true,
      quantityTypes: ['250g', '500g', '1kg'],
      sameDayPrice: 45,
      nextDayPrice: 40,
    },
    {
      id: '2',
      name: 'Apples',
      category: 'fruits',
      price: 120,
      quantity: '1 kg',
      status: 'approved',
      inStock: true,
      quantityTypes: ['500g', '1kg', '2kg'],
      sameDayPrice: 125,
      nextDayPrice: 120,
    },
  ]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  
  const categories = [
    { id: 'all', name: 'All Products', icon: 'grid-outline' as const, count: 28 },
    { id: 'vegetables', name: 'Vegetables', icon: 'leaf-outline' as const, count: 15 },
    { id: 'fruits', name: 'Fruits', icon: 'nutrition-outline' as const, count: 8 },
    { id: 'dairy', name: 'Dairy', icon: 'egg-outline' as const, count: 3 },
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleAddToMyList = (product: Product) => {
    Alert.alert('Add to My List', `Add "${product.name}" to your list?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Add', onPress: () => Alert.alert('Success', 'Product added to My List') },
    ]);
  };

  const handleEditProduct = (product: Product) => {
    // Since edit-product route doesn't exist, show alert instead
    Alert.alert('Edit Product', `Edit "${product.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Edit', 
        onPress: () => {
          // Navigate to available product page
          router.push('/shopkeeper/products/add-product');
        }
      },
    ]);
  };

  const handleUpdatePrice = (product: Product) => {
    // Navigate to available route
    router.push('/shopkeeper/my-list/my-list');
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Category Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
        {categories.map(category => (
          <TouchableOpacity
            key={category.id}
            style={[styles.categoryButton, selectedCategory === category.id && styles.categoryButtonActive]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Ionicons
              name={category.icon}
              size={16}
              color={selectedCategory === category.id ? '#fff' : '#666'}
            />
            <Text style={[styles.categoryText, selectedCategory === category.id && styles.categoryTextActive]}>
              {category.name}
            </Text>
            <View style={styles.categoryCount}>
              <Text style={[styles.countText, selectedCategory === category.id && styles.countTextActive]}>
                {category.count}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Products List */}
      <ScrollView
        style={styles.productsContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.productsHeader}>
          <Text style={styles.productsTitle}>
            {selectedCategory === 'all' ? 'All Products' : categories.find(c => c.id === selectedCategory)?.name || 'Products'}
          </Text>
          <Text style={styles.productsCount}>{filteredProducts.length} products</Text>
        </View>

        {filteredProducts.map(product => (
          <View key={product.id} style={styles.productCard}>
            <View style={styles.productHeader}>
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{product.name}</Text>
                <View style={styles.productMeta}>
                  <Text style={styles.productCategory}>{product.category}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: product.status === 'approved' ? '#4CAF50' : product.status === 'pending' ? '#FF9800' : '#f44336' }]}>
                    <Text style={styles.statusText}>{product.status}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.priceContainer}>
                <Text style={styles.price}>₹{product.price}</Text>
                <Text style={styles.quantity}>{product.quantity}</Text>
              </View>
            </View>

            <View style={styles.productDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Quantity Types:</Text>
                <View style={styles.quantityTypes}>
                  {product.quantityTypes.map((type, index) => (
                    <Text key={index} style={styles.quantityType}>{type}</Text>
                  ))}
                </View>
              </View>
              
              {product.sameDayPrice && product.nextDayPrice && (
                <View style={styles.detailRow}>
                  <View style={styles.dayPrices}>
                    <View style={styles.dayPrice}>
                      <Text style={styles.dayLabel}>Same Day:</Text>
                      <Text style={styles.dayPriceValue}>₹{product.sameDayPrice}</Text>
                    </View>
                    <View style={styles.dayPrice}>
                      <Text style={styles.dayLabel}>Next Day:</Text>
                      <Text style={styles.dayPriceValue}>₹{product.nextDayPrice}</Text>
                    </View>
                  </View>
                </View>
              )}

              <View style={styles.stockStatus}>
                <View style={[styles.stockIndicator, { backgroundColor: product.inStock ? '#4CAF50' : '#f44336' }]}>
                  <Text style={styles.stockText}>{product.inStock ? 'In Stock' : 'Out of Stock'}</Text>
                </View>
              </View>
            </View>

            <View style={styles.productActions}>
              <TouchableOpacity style={[styles.actionButton, styles.editButton]} onPress={() => handleEditProduct(product)}>
                <MaterialIcons name="edit" size={16} color="#2196F3" />
                <Text style={[styles.actionText, { color: '#2196F3' }]}>Edit</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.actionButton, styles.priceButton]} onPress={() => handleUpdatePrice(product)}>
                <FontAwesome5 name="rupee-sign" size={14} color="#FF9800" />
                <Text style={[styles.actionText, { color: '#FF9800' }]}>Update Price</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.actionButton, styles.listButton]} onPress={() => handleAddToMyList(product)}>
                <MaterialIcons name="add" size={16} color="#4CAF50" />
                <Text style={[styles.actionText, { color: '#4CAF50' }]}>Add to List</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {filteredProducts.length === 0 && (
          <View style={styles.emptyState}>
            <MaterialIcons name="inventory" size={64} color="#ddd" />
            <Text style={styles.emptyStateText}>No products found</Text>
            <Text style={styles.emptyStateSubtext}>Try changing your search or filters</Text>
          </View>
        )}

        <TouchableOpacity style={styles.addProductButton} onPress={() => router.push('/shopkeeper/products/add-product')}>
          <Ionicons name="add-circle" size={24} color="#fff" />
          <Text style={styles.addProductText}>Add New Product</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333',
  },
  categoryContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    minWidth: 120,
    justifyContent: 'center',
  },
  categoryButtonActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  categoryText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  categoryTextActive: {
    color: '#fff',
  },
  categoryCount: {
    marginLeft: 8,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
  },
  countText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  countTextActive: {
    color: '#4CAF50',
    backgroundColor: '#fff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
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
    fontSize: 20,
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
  productActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  priceButton: {
    backgroundColor: '#fff3e0',
  },
  listButton: {
    backgroundColor: '#e8f5e9',
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
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
  addProductButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    gap: 8,
  },
  addProductText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProductList;