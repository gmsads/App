// app/shopkeeper/products/select-product.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface AdminProduct {
  id: string;
  productId: string;
  name: string;
  category: string;
  image: string;
  unit: string;
  basePrice: number;
}

const SelectProduct: React.FC = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<AdminProduct | null>(null);
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'vegetables', label: 'Vegetables' },
    { id: 'fruits', label: 'Fruits' },
    { id: 'dairy', label: 'Dairy' },
    { id: 'groceries', label: 'Groceries' },
    { id: 'beverages', label: 'Beverages' },
  ];

  // Mock data - replace with API call
  const [products, setProducts] = useState<AdminProduct[]>([
    { id: '1', productId: 'P12345', name: 'Fresh Spinach', category: 'vegetables', image: 'https://via.placeholder.com/60', unit: 'kg', basePrice: 120 },
    { id: '2', productId: 'P12346', name: 'Tomatoes', category: 'vegetables', image: 'https://via.placeholder.com/60', unit: 'kg', basePrice: 80 },
    { id: '3', productId: 'P12347', name: 'Apples', category: 'fruits', image: 'https://via.placeholder.com/60', unit: 'kg', basePrice: 150 },
    { id: '4', productId: 'P12348', name: 'Milk', category: 'dairy', image: 'https://via.placeholder.com/60', unit: 'liter', basePrice: 60 },
    { id: '5', productId: 'P12349', name: 'Rice', category: 'groceries', image: 'https://via.placeholder.com/60', unit: 'kg', basePrice: 90 },
    { id: '6', productId: 'P12350', name: 'Orange Juice', category: 'beverages', image: 'https://via.placeholder.com/60', unit: 'ml', basePrice: 200 },
    { id: '7', productId: 'P12351', name: 'Potatoes', category: 'vegetables', image: 'https://via.placeholder.com/60', unit: 'kg', basePrice: 40 },
    { id: '8', productId: 'P12352', name: 'Bananas', category: 'fruits', image: 'https://via.placeholder.com/60', unit: 'dozen', basePrice: 50 },
  ]);

  useEffect(() => {
    // Simulate API loading
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.productId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSelectProduct = (product: AdminProduct) => {
    setSelectedProduct(product);
  };

  const handleProceed = () => {
    if (selectedProduct) {
      router.push({
        pathname: '/shopkeeper/products/add-product',
        params: {
          productId: selectedProduct.productId,
          productName: selectedProduct.name,
          category: selectedProduct.category,
          baseUnit: selectedProduct.unit,
        }
      });
    }
  };

  const renderProductItem = ({ item }: { item: AdminProduct }) => (
    <TouchableOpacity
      style={[
        styles.productItem,
        selectedProduct?.id === item.id && styles.productItemSelected
      ]}
      onPress={() => handleSelectProduct(item)}
    >
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productId}>ID: {item.productId}</Text>
        <Text style={styles.productDetails}>
          {item.category} • ₹{item.basePrice}/{item.unit}
        </Text>
      </View>
      {selectedProduct?.id === item.id && (
        <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading products...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Product</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by product name or ID"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryContainer}
      >
        {categories.map(category => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              selectedCategory === category.id && styles.categoryButtonActive,
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Text
              style={[
                styles.categoryButtonText,
                selectedCategory === category.id && styles.categoryButtonTextActive,
              ]}
            >
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Products List */}
      <FlatList
        data={filteredProducts}
        renderItem={renderProductItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.productList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No products found</Text>
          </View>
        }
      />

      {/* Action Button */}
      <View style={styles.actionContainer}>
        <Text style={styles.selectionText}>
          {selectedProduct ? `Selected: ${selectedProduct.name}` : 'No product selected'}
        </Text>
        <TouchableOpacity
          style={[
            styles.proceedButton,
            !selectedProduct && styles.proceedButtonDisabled,
          ]}
          onPress={handleProceed}
          disabled={!selectedProduct}
        >
          <Text style={styles.proceedButtonText}>Proceed to Add Details</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  categoryContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  categoryButton: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  categoryButtonActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#666',
  },
  categoryButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  productList: {
    padding: 16,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  productItemSelected: {
    borderColor: '#4CAF50',
    backgroundColor: '#e8f5e9',
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  productId: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  productDetails: {
    fontSize: 12,
    color: '#888',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
  },
  actionContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  selectionText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  proceedButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  proceedButtonDisabled: {
    backgroundColor: '#81c784',
    opacity: 0.5,
  },
  proceedButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SelectProduct;