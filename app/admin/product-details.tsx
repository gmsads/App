// ProductDetail.tsx
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProductContext } from './product-context';

const ProductDetail: React.FC = () => {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { products } = useProductContext();
  
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    // Get product from context using ID
    const productId = params.id as string;
    if (productId && products.length > 0) {
      const foundProduct = products.find(p => p.id === productId);
      if (foundProduct) {
        setProduct(foundProduct);
      } else {
        // If product not found, show error
        setProduct({
          id: '1',
          name: 'Product Not Found',
          price: '0',
          image: 'https://via.placeholder.com/150/FF6B6B/FFFFFF?text=Error',
          description: 'Product information could not be loaded',
          category: 'error',
          units: ['N/A']
        });
      }
    }
  }, [params.id, products]);

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading product...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleAddToCart = () => {
    // You can integrate with your cartStore here
    Alert.alert(
      'Added to Cart',
      `${quantity} ${product.units?.[0] || 'item'} of ${product.name} added to cart!`,
      [
        { 
          text: 'Continue Shopping', 
          onPress: () => router.back()
        },
        { 
          text: 'View Cart', 
          onPress: () => router.push('/cart')
        }
      ]
    );
  };

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

  const price = parseFloat(product.price) || 0;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image 
          source={{ uri: product.image || 'https://via.placeholder.com/300/CCCCCC/FFFFFF?text=No+Image' }} 
          style={styles.productImage} 
          defaultSource={{ uri: 'https://via.placeholder.com/300/CCCCCC/FFFFFF?text=Loading...' }}
        />
        
        <View style={styles.productInfo}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>
              {product.category?.charAt(0).toUpperCase() + product.category?.slice(1) || 'Unknown'}
            </Text>
          </View>
          
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productPrice}>₹{price.toFixed(2)}</Text>
          <Text style={styles.productUnit}>
            {product.units && product.units.length > 0 ? product.units.join(', ') : 'N/A'}
          </Text>
          
          <Text style={styles.descriptionTitle}>Description</Text>
          <Text style={styles.productDescription}>
            {product.description || 'No description available'}
          </Text>
          
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Category:</Text>
              <Text style={styles.detailValue}>{product.category || 'N/A'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Sub Category:</Text>
              <Text style={styles.detailValue}>{product.subCategory || 'N/A'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Available Quantity:</Text>
              <Text style={styles.detailValue}>{product.quantity || 0}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Same Day Delivery:</Text>
              <Text style={styles.detailValue}>
                {product.sameDayAvailable ? 'Yes' : 'No'}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Next Day Delivery:</Text>
              <Text style={styles.detailValue}>
                {product.nextDayAvailable ? 'Yes' : 'No'}
              </Text>
            </View>
          </View>
          
          <View style={styles.quantityContainer}>
            <Text style={styles.quantityLabel}>Quantity:</Text>
            <View style={styles.quantitySelector}>
              <TouchableOpacity 
                style={styles.quantityButton} 
                onPress={decreaseQuantity}
              >
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantityValue}>{quantity}</Text>
              <TouchableOpacity 
                style={styles.quantityButton} 
                onPress={increaseQuantity}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalPrice}>
              ₹{(price * quantity).toFixed(2)}
            </Text>
          </View>
          
          <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
            <Text style={styles.addToCartText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#7f8c8d',
  },
  productImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  productInfo: {
    padding: 20,
  },
  categoryBadge: {
    backgroundColor: '#2ecc71',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  categoryText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  productName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: 4,
  },
  productUnit: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 20,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  productDescription: {
    fontSize: 16,
    color: '#5d6d7e',
    lineHeight: 24,
    marginBottom: 30,
  },
  detailsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  detailLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: '600',
  },
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#ecf0f1',
  },
  quantityLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
    borderRadius: 25,
    padding: 4,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2ecc71',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  quantityValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 20,
    color: '#2c3e50',
    minWidth: 30,
    textAlign: 'center',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    paddingVertical: 16,
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2c3e50',
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  addToCartButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addToCartText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProductDetail;