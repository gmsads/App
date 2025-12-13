import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Switch,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Ionicons,
  MaterialIcons,
  FontAwesome5,
} from '@expo/vector-icons';

interface QuantityOption {
  type: string;
  value: number;
  unit: 'pcs' | 'g' | 'kg' | 'bunch' | 'dozen';
  sameDayPrice: number;
  nextDayPrice: number;
<<<<<<< HEAD
=======
  sameDayActualPrice: number; // Added: Actual price for same day
  nextDayActualPrice: number; // Added: Actual price for next day
>>>>>>> 59b5a119e90d67880c7e91df3ad1810d608fbaad
  sameDayAvailable: boolean;
  nextDayAvailable: boolean;
  sameAsNextDay: boolean;
}

interface MyListItem {
  id: string;
  name: string;
  category: string;
  quantityOptions: QuantityOption[];
  sameDayDelivery: boolean;
  nextDayDelivery: boolean;
  categoryId: string;
}

const MyList: React.FC = () => {
  const router = useRouter();
  const [items, setItems] = useState<MyListItem[]>([
    {
      id: '1',
      name: 'Fresh Tomatoes',
      category: 'Vegetables',
      categoryId: 'veg1',
      sameDayDelivery: true,
      nextDayDelivery: true,
      quantityOptions: [
        {
          type: 'Small Pack',
          value: 250,
          unit: 'g',
<<<<<<< HEAD
          sameDayPrice: 15,
          nextDayPrice: 14,
=======
          sameDayPrice: 15, // Sale price
          nextDayPrice: 14, // Sale price
          sameDayActualPrice: 20, // Actual price
          nextDayActualPrice: 18, // Actual price
>>>>>>> 59b5a119e90d67880c7e91df3ad1810d608fbaad
          sameDayAvailable: true,
          nextDayAvailable: true,
          sameAsNextDay: false,
        },
        {
          type: 'Medium Pack',
          value: 500,
          unit: 'g',
<<<<<<< HEAD
          sameDayPrice: 25,
          nextDayPrice: 20,
=======
          sameDayPrice: 25, // Sale price
          nextDayPrice: 20, // Sale price
          sameDayActualPrice: 30, // Actual price
          nextDayActualPrice: 25, // Actual price
>>>>>>> 59b5a119e90d67880c7e91df3ad1810d608fbaad
          sameDayAvailable: true,
          nextDayAvailable: true,
          sameAsNextDay: false,
        },
        {
          type: 'Large Pack',
          value: 1,
          unit: 'kg',
<<<<<<< HEAD
          sameDayPrice: 40,
          nextDayPrice: 35,
=======
          sameDayPrice: 40, // Sale price
          nextDayPrice: 35, // Sale price
          sameDayActualPrice: 50, // Actual price
          nextDayActualPrice: 45, // Actual price
>>>>>>> 59b5a119e90d67880c7e91df3ad1810d608fbaad
          sameDayAvailable: true,
          nextDayAvailable: false,
          sameAsNextDay: false,
        },
      ],
    },
    {
      id: '2',
      name: 'Apples',
      category: 'Fruits',
      categoryId: 'fruit1',
      sameDayDelivery: true,
      nextDayDelivery: true,
      quantityOptions: [
        {
          type: 'Half Kg',
          value: 0.5,
          unit: 'kg',
<<<<<<< HEAD
          sameDayPrice: 60,
          nextDayPrice: 55,
=======
          sameDayPrice: 60, // Sale price
          nextDayPrice: 55, // Sale price
          sameDayActualPrice: 75, // Actual price
          nextDayActualPrice: 70, // Actual price
>>>>>>> 59b5a119e90d67880c7e91df3ad1810d608fbaad
          sameDayAvailable: true,
          nextDayAvailable: true,
          sameAsNextDay: true,
        },
        {
          type: 'One Kg',
          value: 1,
          unit: 'kg',
<<<<<<< HEAD
          sameDayPrice: 120,
          nextDayPrice: 120,
=======
          sameDayPrice: 120, // Sale price
          nextDayPrice: 120, // Sale price
          sameDayActualPrice: 150, // Actual price
          nextDayActualPrice: 150, // Actual price
>>>>>>> 59b5a119e90d67880c7e91df3ad1810d608fbaad
          sameDayAvailable: true,
          nextDayAvailable: true,
          sameAsNextDay: true,
        },
      ],
    },
  ]);

  const [editingItem, setEditingItem] = useState<MyListItem | null>(null);
  const [editingOption, setEditingOption] = useState<QuantityOption | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', name: 'All Categories', count: 15 },
    { id: 'Vegetables', name: 'Vegetables', count: 8 },
    { id: 'Fruits', name: 'Fruits', count: 4 },
    { id: 'Dairy', name: 'Dairy', count: 2 },
    { id: 'Groceries', name: 'Groceries', count: 1 },
  ];

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

<<<<<<< HEAD
=======
  // Calculate discount percentage
  const calculateDiscount = (actualPrice: number, salePrice: number): number => {
    if (salePrice >= actualPrice) return 0;
    return Math.round(((actualPrice - salePrice) / actualPrice) * 100);
  };

>>>>>>> 59b5a119e90d67880c7e91df3ad1810d608fbaad
  const handleEditPrice = (item: MyListItem, optionIndex: number) => {
    setEditingItem(item);
    setEditingOption({ ...item.quantityOptions[optionIndex] });
    setModalVisible(true);
  };

  const handleSavePrice = () => {
    if (editingItem && editingOption) {
      setItems(prev => prev.map(item => {
        if (item.id === editingItem.id) {
          return {
            ...item,
            quantityOptions: item.quantityOptions.map((opt, idx) => 
              idx === item.quantityOptions.findIndex(o => 
                o.type === editingOption.type
              ) ? editingOption : opt
            ),
          };
        }
        return item;
      }));
      
      Alert.alert('Success', 'Price updated successfully');
      setModalVisible(false);
    }
  };

  const handleSameAsNextDayToggle = () => {
    if (editingOption) {
      const updatedOption = { ...editingOption };
      if (updatedOption.sameAsNextDay) {
<<<<<<< HEAD
        // If turning off same as next day, keep the current same day values
        // But mark them as different
        updatedOption.sameAsNextDay = false;
      } else {
        // If turning on same as next day, copy next day values to same day
        updatedOption.sameDayPrice = updatedOption.nextDayPrice;
=======
        updatedOption.sameAsNextDay = false;
      } else {
        updatedOption.sameDayPrice = updatedOption.nextDayPrice;
        updatedOption.sameDayActualPrice = updatedOption.nextDayActualPrice;
>>>>>>> 59b5a119e90d67880c7e91df3ad1810d608fbaad
        updatedOption.sameDayAvailable = updatedOption.nextDayAvailable;
        updatedOption.sameAsNextDay = true;
      }
      setEditingOption(updatedOption);
    }
  };

  const handleDeleteOption = (itemId: string, optionIndex: number) => {
    Alert.alert(
      'Delete Option',
      'Are you sure you want to delete this quantity option?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setItems(prev => prev.map(item => {
              if (item.id === itemId) {
                const newOptions = [...item.quantityOptions];
                newOptions.splice(optionIndex, 1);
                return {
                  ...item,
                  quantityOptions: newOptions,
                };
              }
              return item;
            }));
          },
        },
      ]
    );
  };

  const handleAddQuantityOption = (itemId: string) => {
    const newOption: QuantityOption = {
      type: 'Custom Pack',
      value: 1,
      unit: 'kg',
      sameDayPrice: 0,
      nextDayPrice: 0,
<<<<<<< HEAD
=======
      sameDayActualPrice: 0,
      nextDayActualPrice: 0,
>>>>>>> 59b5a119e90d67880c7e91df3ad1810d608fbaad
      sameDayAvailable: true,
      nextDayAvailable: true,
      sameAsNextDay: true,
    };

    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          quantityOptions: [...item.quantityOptions, newOption],
        };
      }
      return item;
    }));

<<<<<<< HEAD
    // Find the item and set editing state
=======
>>>>>>> 59b5a119e90d67880c7e91df3ad1810d608fbaad
    const item = items.find(i => i.id === itemId);
    if (item) {
      setEditingItem(item);
      setEditingOption(newOption);
      setModalVisible(true);
    }
  };

  const renderItemCard = (item: MyListItem) => (
    <View key={item.id} style={styles.itemCard}>
      <View style={styles.itemHeader}>
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemCategory}>{item.category}</Text>
        </View>
        <View style={styles.deliveryTypes}>
          {item.sameDayDelivery && (
            <View style={styles.deliveryBadge}>
              <Text style={styles.deliveryText}>Same Day</Text>
            </View>
          )}
          {item.nextDayDelivery && (
            <View style={[styles.deliveryBadge, styles.nextDayBadge]}>
              <Text style={styles.deliveryText}>Next Day</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.quantityOptions}>
        <Text style={styles.optionsTitle}>Quantity Options</Text>
<<<<<<< HEAD
        {item.quantityOptions.map((option, index) => (
          <View key={index} style={styles.optionRow}>
            <View style={styles.optionDetails}>
              <Text style={styles.optionType}>
                {option.type} ({option.value}
                {option.unit === 'g' ? 'g' : 
                 option.unit === 'kg' ? 'kg' : 
                 option.unit === 'bunch' ? 'bunch' : 
                 option.unit === 'dozen' ? 'dozen' : 'pcs'})
              </Text>
              
              <View style={styles.prices}>
                <View style={styles.priceSection}>
                  <Text style={styles.priceLabel}>Same Day:</Text>
                  <View style={styles.priceRow}>
                    <Text style={styles.priceValue}>₹{option.sameDayPrice}</Text>
                    <Text style={[
                      styles.availability,
                      { color: option.sameDayAvailable ? '#4CAF50' : '#f44336' }
                    ]}>
                      {option.sameDayAvailable ? '✓ Available' : '✗ Unavailable'}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.priceSection}>
                  <Text style={styles.priceLabel}>Next Day:</Text>
                  <View style={styles.priceRow}>
                    <Text style={styles.priceValue}>₹{option.nextDayPrice}</Text>
                    <Text style={[
                      styles.availability,
                      { color: option.nextDayAvailable ? '#4CAF50' : '#f44336' }
                    ]}>
                      {option.nextDayAvailable ? '✓ Available' : '✗ Unavailable'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            
            <View style={styles.optionActions}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleEditPrice(item, index)}
              >
                <MaterialIcons name="edit" size={20} color="#2196F3" />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteOption(item.id, index)}
              >
                <MaterialIcons name="delete" size={20} color="#f44336" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
=======
        {item.quantityOptions.map((option, index) => {
          const sameDayDiscount = calculateDiscount(option.sameDayActualPrice, option.sameDayPrice);
          const nextDayDiscount = calculateDiscount(option.nextDayActualPrice, option.nextDayPrice);
          
          return (
            <View key={index} style={styles.optionRow}>
              <View style={styles.optionDetails}>
                <Text style={styles.optionType}>
                  {option.type} ({option.value}
                  {option.unit === 'g' ? 'g' : 
                   option.unit === 'kg' ? 'kg' : 
                   option.unit === 'bunch' ? 'bunch' : 
                   option.unit === 'dozen' ? 'dozen' : 'pcs'})
                </Text>
                
                <View style={styles.prices}>
                  <View style={styles.priceSection}>
                    <Text style={styles.priceLabel}>Same Day:</Text>
                    <View style={styles.priceRow}>
                      <View style={styles.priceContainer}>
                        <Text style={styles.actualPrice}>₹{option.sameDayActualPrice}</Text>
                        <Text style={styles.salePrice}>₹{option.sameDayPrice}</Text>
                        {sameDayDiscount > 0 && (
                          <Text style={styles.discountBadge}>
                            {sameDayDiscount}% OFF
                          </Text>
                        )}
                      </View>
                      <Text style={[
                        styles.availability,
                        { color: option.sameDayAvailable ? '#4CAF50' : '#f44336' }
                      ]}>
                        {option.sameDayAvailable ? '✓ Available' : '✗ Unavailable'}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.priceSection}>
                    <Text style={styles.priceLabel}>Next Day:</Text>
                    <View style={styles.priceRow}>
                      <View style={styles.priceContainer}>
                        <Text style={styles.actualPrice}>₹{option.nextDayActualPrice}</Text>
                        <Text style={styles.salePrice}>₹{option.nextDayPrice}</Text>
                        {nextDayDiscount > 0 && (
                          <Text style={styles.discountBadge}>
                            {nextDayDiscount}% OFF
                          </Text>
                        )}
                      </View>
                      <Text style={[
                        styles.availability,
                        { color: option.nextDayAvailable ? '#4CAF50' : '#f44336' }
                      ]}>
                        {option.nextDayAvailable ? '✓ Available' : '✗ Unavailable'}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              
              <View style={styles.optionActions}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleEditPrice(item, index)}
                >
                  <MaterialIcons name="edit" size={20} color="#2196F3" />
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteOption(item.id, index)}
                >
                  <MaterialIcons name="delete" size={20} color="#f44336" />
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
>>>>>>> 59b5a119e90d67880c7e91df3ad1810d608fbaad
        
        <TouchableOpacity
          style={styles.addOptionButton}
          onPress={() => handleAddQuantityOption(item.id)}
        >
          <Ionicons name="add" size={20} color="#4CAF50" />
          <Text style={styles.addOptionText}>Add Quantity Option</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search in My List..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Category Filter */}
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
                styles.categoryText,
                selectedCategory === category.id && styles.categoryTextActive,
              ]}
            >
              {category.name}
            </Text>
            <View style={styles.categoryCount}>
              <Text style={[
                styles.countText,
                selectedCategory === category.id && styles.countTextActive
              ]}>
                {category.count}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Items List */}
      <ScrollView style={styles.itemsContainer}>
        <View style={styles.itemsHeader}>
          <Text style={styles.itemsTitle}>My List</Text>
          <Text style={styles.itemsCount}>
            {filteredItems.length} items
          </Text>
        </View>

        {filteredItems.length > 0 ? (
          filteredItems.map(renderItemCard)
        ) : (
          <View style={styles.emptyState}>
            <MaterialIcons name="inventory" size={64} color="#ddd" />
            <Text style={styles.emptyStateText}>No items in your list</Text>
            <TouchableOpacity
              style={styles.browseButton}
              onPress={() => router.push('/shopkeeper/products/product-list')}
            >
              <Text style={styles.browseButtonText}>Browse Products</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Price Edit Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {editingItem && editingOption && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>
                    Edit Price - {editingItem.name}
                  </Text>
                  <Text style={styles.modalSubtitle}>
                    {editingOption.type} ({editingOption.value}
                    {editingOption.unit === 'g' ? 'g' : 
                     editingOption.unit === 'kg' ? 'kg' : 
                     editingOption.unit === 'bunch' ? 'bunch' : 
                     editingOption.unit === 'dozen' ? 'dozen' : 'pcs'})
                  </Text>
                </View>

                <View style={styles.modalBody}>
                  {/* Same as Next Day Toggle */}
                  <View style={styles.toggleContainer}>
                    <Text style={styles.toggleLabel}>Same as Next Day</Text>
                    <Switch
                      value={editingOption.sameAsNextDay}
                      onValueChange={handleSameAsNextDayToggle}
                      trackColor={{ false: '#ddd', true: '#4CAF50' }}
                    />
                  </View>

<<<<<<< HEAD
                  {/* Same Day Price */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Same Day Price (₹)</Text>
=======
                  {/* Same Day Prices */}
                  <Text style={styles.sectionTitle}>Same Day Pricing</Text>
                  
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Actual Price (₹)</Text>
                    <TextInput
                      style={[styles.input, editingOption.sameAsNextDay && styles.inputDisabled]}
                      value={editingOption.sameDayActualPrice.toString()}
                      onChangeText={(value) => {
                        const numValue = parseInt(value) || 0;
                        setEditingOption({
                          ...editingOption,
                          sameDayActualPrice: numValue,
                        });
                      }}
                      keyboardType="numeric"
                      editable={!editingOption.sameAsNextDay}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Sale Price (₹)</Text>
>>>>>>> 59b5a119e90d67880c7e91df3ad1810d608fbaad
                    <TextInput
                      style={[styles.input, editingOption.sameAsNextDay && styles.inputDisabled]}
                      value={editingOption.sameDayPrice.toString()}
                      onChangeText={(value) => {
                        const numValue = parseInt(value) || 0;
                        setEditingOption({
                          ...editingOption,
                          sameDayPrice: numValue,
                        });
                      }}
                      keyboardType="numeric"
                      editable={!editingOption.sameAsNextDay}
                    />
                  </View>

<<<<<<< HEAD
                  {/* Next Day Price */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Next Day Price (₹)</Text>
=======
                  {/* Next Day Prices */}
                  <Text style={styles.sectionTitle}>Next Day Pricing</Text>
                  
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Actual Price (₹)</Text>
                    <TextInput
                      style={styles.input}
                      value={editingOption.nextDayActualPrice.toString()}
                      onChangeText={(value) => {
                        const numValue = parseInt(value) || 0;
                        const updatedOption = { ...editingOption, nextDayActualPrice: numValue };
                        if (editingOption.sameAsNextDay) {
                          updatedOption.sameDayActualPrice = numValue;
                        }
                        setEditingOption(updatedOption);
                      }}
                      keyboardType="numeric"
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Sale Price (₹)</Text>
>>>>>>> 59b5a119e90d67880c7e91df3ad1810d608fbaad
                    <TextInput
                      style={styles.input}
                      value={editingOption.nextDayPrice.toString()}
                      onChangeText={(value) => {
                        const numValue = parseInt(value) || 0;
                        const updatedOption = { ...editingOption, nextDayPrice: numValue };
                        if (editingOption.sameAsNextDay) {
                          updatedOption.sameDayPrice = numValue;
                        }
                        setEditingOption(updatedOption);
                      }}
                      keyboardType="numeric"
                    />
                  </View>

                  {/* Availability Toggles */}
                  <View style={styles.availabilityContainer}>
<<<<<<< HEAD
=======
                    <Text style={styles.sectionTitle}>Availability</Text>
>>>>>>> 59b5a119e90d67880c7e91df3ad1810d608fbaad
                    <View style={styles.availabilityToggle}>
                      <Text style={styles.availabilityLabel}>Same Day Available</Text>
                      <Switch
                        value={editingOption.sameDayAvailable}
                        onValueChange={(value) => {
                          const updatedOption = { ...editingOption, sameDayAvailable: value };
                          if (editingOption.sameAsNextDay) {
                            updatedOption.nextDayAvailable = value;
                          }
                          setEditingOption(updatedOption);
                        }}
                        trackColor={{ false: '#ddd', true: '#4CAF50' }}
                      />
                    </View>

                    <View style={styles.availabilityToggle}>
                      <Text style={styles.availabilityLabel}>Next Day Available</Text>
                      <Switch
                        value={editingOption.nextDayAvailable}
                        onValueChange={(value) => {
                          const updatedOption = { ...editingOption, nextDayAvailable: value };
                          if (editingOption.sameAsNextDay) {
                            updatedOption.sameDayAvailable = value;
                          }
                          setEditingOption(updatedOption);
                        }}
                        trackColor={{ false: '#ddd', true: '#4CAF50' }}
                      />
                    </View>
                  </View>
                </View>

                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.modalButton, styles.saveButton]}
                    onPress={handleSavePrice}
                  >
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
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
  },
  categoryButtonActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  categoryText: {
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
  itemsContainer: {
    flex: 1,
    padding: 16,
  },
  itemsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  itemsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  itemsCount: {
    fontSize: 14,
    color: '#666',
  },
  itemCard: {
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
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  itemCategory: {
    fontSize: 14,
    color: '#666',
  },
  deliveryTypes: {
    flexDirection: 'row',
    gap: 8,
  },
  deliveryBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  nextDayBadge: {
    backgroundColor: '#E8F5E9',
  },
  deliveryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2196F3',
  },
  quantityOptions: {
    paddingTop: 8,
  },
  optionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  optionRow: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  optionDetails: {
    flex: 1,
  },
  optionType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  prices: {
    gap: 8,
  },
  priceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 12,
    color: '#666',
    width: 80,
  },
  priceRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
<<<<<<< HEAD
  priceValue: {
=======
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actualPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  salePrice: {
>>>>>>> 59b5a119e90d67880c7e91df3ad1810d608fbaad
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
<<<<<<< HEAD
=======
  discountBadge: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#ff5252',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
>>>>>>> 59b5a119e90d67880c7e91df3ad1810d608fbaad
  availability: {
    fontSize: 12,
    fontWeight: '600',
  },
  optionActions: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 12,
  },
  editButton: {
    padding: 4,
  },
  deleteButton: {
    padding: 4,
  },
  addOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    gap: 8,
  },
  addOptionText: {
    color: '#4CAF50',
    fontSize: 14,
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
  browseButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  browseButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '100%',
    maxWidth: 400,
  },
  modalHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  modalBody: {
    padding: 20,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
<<<<<<< HEAD
  inputGroup: {
    marginBottom: 16,
=======
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 12,
    marginBottom: 8,
  },
  inputGroup: {
    marginBottom: 12,
>>>>>>> 59b5a119e90d67880c7e91df3ad1810d608fbaad
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333',
  },
  inputDisabled: {
    backgroundColor: '#eee',
    color: '#999',
  },
  availabilityContainer: {
<<<<<<< HEAD
    gap: 16,
=======
    gap: 12,
>>>>>>> 59b5a119e90d67880c7e91df3ad1810d608fbaad
  },
  availabilityToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  availabilityLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  modalActions: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    marginRight: 8,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    marginLeft: 8,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MyList;