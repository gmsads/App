import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useShop } from './shop-context';

const ShopManagement: React.FC = () => {
  const router = useRouter();
  
  const { shops, toggleShopStatus } = useShop();
  
  const [searchQuery, setSearchQuery] = useState('');
  
  const [filteredShops, setFilteredShops] = useState(shops);
  
  const [statusFilter, setStatusFilter] = useState<'all' | 'Active' | 'Inactive'>('all');

  useEffect(() => {
    let result = shops;

    if (statusFilter !== 'all') {
      result = result.filter(shop => shop.status === statusFilter);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(shop =>
        shop.name.toLowerCase().includes(query) ||
        shop.owner.toLowerCase().includes(query) ||
        shop.phone.toLowerCase().includes(query) ||
        shop.id.toLowerCase().includes(query) ||
        shop.shopId.toString().includes(query)
      );
    }

    setFilteredShops(result);
  }, [shops, searchQuery, statusFilter]);

  const handleAddShop = () => {
    router.push('/admin/add-shop');
  };

  const handleEditShop = (shopId: string) => {
    const shopToEdit = shops.find(shop => shop.id === shopId);
    if (shopToEdit) {
      router.push({
        pathname: '/admin/edit-shop',
        params: { 
          id: shopId, 
          shop: JSON.stringify(shopToEdit) 
        }
      });
    }
  };

  const handleViewShopDetails = (shopId: string) => {
    const shopToView = shops.find(shop => shop.id === shopId);
    if (shopToView) {
      router.push({
        pathname: '/admin/shop-details',
        params: { 
          id: shopId, 
          shop: JSON.stringify(shopToView) 
        }
      });
    }
  };

  const handleToggleStatus = (shopId: string) => {
    toggleShopStatus(shopId);
  };

  const totalShops = shops.length;
  const activeShops = shops.filter(shop => shop.status === 'Active').length;
  const inactiveShops = shops.filter(shop => shop.status === 'Inactive').length;

  const splitOwnerName = (owner: string) => {
    const parts = owner.split(' ');
    return {
      firstName: parts[0] || '',
      lastName: parts.slice(1).join(' ') || ''
    };
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Shop Management</Text>
        
        <TouchableOpacity style={styles.addButton} onPress={handleAddShop}>
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Shop Overview</Text>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.statsScroll}
          contentContainerStyle={styles.statsScrollContent}
        >
          <View style={[styles.statCard, styles.totalCard]}>
            <Text style={styles.statNumber}>{totalShops}</Text>
            <Text style={styles.statLabel}>Total Shops</Text>
          </View>
          
          <View style={[styles.statCard, styles.activeCard]}>
            <Text style={styles.statNumber}>{activeShops}</Text>
            <Text style={styles.statLabel}>Active Shops</Text>
          </View>
          
          <View style={[styles.statCard, styles.inactiveCard]}>
            <Text style={styles.statNumber}>{inactiveShops}</Text>
            <Text style={styles.statLabel}>Inactive Shops</Text>
          </View>
        </ScrollView>

        <View style={styles.searchFilterSection}>
          <Text style={styles.sectionTitle}>All Shops ({filteredShops.length})</Text>
          
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Search shops..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#95a5a6"
              />
            </View>
          </View>

          <View style={styles.filterButtons}>
            <TouchableOpacity 
              style={[styles.filterButton, statusFilter === 'all' && styles.filterButtonActive]}
              onPress={() => setStatusFilter('all')}
            >
              <Text style={[styles.filterButtonText, statusFilter === 'all' && styles.filterButtonTextActive]}>
                All
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.filterButton, statusFilter === 'Active' && styles.filterButtonActive]}
              onPress={() => setStatusFilter('Active')}
            >
              <Text style={[styles.filterButtonText, statusFilter === 'Active' && styles.filterButtonTextActive]}>
                Active
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.filterButton, statusFilter === 'Inactive' && styles.filterButtonActive]}
              onPress={() => setStatusFilter('Inactive')}
            >
              <Text style={[styles.filterButtonText, statusFilter === 'Inactive' && styles.filterButtonTextActive]}>
                Inactive
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.tableContainer}>
          {filteredShops.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateIcon}>🏪</Text>
              <Text style={styles.emptyStateTitle}>No shops found</Text>
              <Text style={styles.emptyStateText}>
                {searchQuery || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Add your first shop to get started'}
              </Text>
              {!searchQuery && statusFilter === 'all' && (
                <TouchableOpacity style={styles.emptyStateButton} onPress={handleAddShop}>
                  <Text style={styles.emptyStateButtonText}>Add New Shop</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={true}
              style={styles.tableScroll}
            >
              <View>
                <View style={styles.tableHeader}>
                  <View style={[styles.tableHeaderCell, styles.columnShopId]}>
                    <Text style={styles.tableHeaderText}>Shop ID</Text>
                  </View>
                  <View style={[styles.tableHeaderCell, styles.columnFirstName]}>
                    <Text style={styles.tableHeaderText}>First Name</Text>
                  </View>
                  <View style={[styles.tableHeaderCell, styles.columnLastName]}>
                    <Text style={styles.tableHeaderText}>Last Name</Text>
                  </View>
                  <View style={[styles.tableHeaderCell, styles.columnPhone]}>
                    <Text style={styles.tableHeaderText}>Phone Number</Text>
                  </View>
                  <View style={[styles.tableHeaderCell, styles.columnShopName]}>
                    <Text style={styles.tableHeaderText}>Shop Name</Text>
                  </View>
                  <View style={[styles.tableHeaderCell, styles.columnZoneId]}>
                    <Text style={styles.tableHeaderText}>Zone ID</Text>
                  </View>
                  <View style={[styles.tableHeaderCell, styles.columnRadius]}>
                    <Text style={styles.tableHeaderText}>Radius</Text>
                  </View>
                  <View style={[styles.tableHeaderCell, styles.columnStatus]}>
                    <Text style={styles.tableHeaderText}>Status</Text>
                  </View>
                  <View style={[styles.tableHeaderCell, styles.columnActions]}>
                    <Text style={styles.tableHeaderText}>Actions</Text>
                  </View>
                </View>

                {filteredShops.map((shop, index) => {
                  const { firstName, lastName } = splitOwnerName(shop.owner);
                  
                  return (
                    <View 
                      key={shop.id} 
                      style={[
                        styles.tableRow,
                        index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd
                      ]}
                    >
                      <View style={[styles.tableCell, styles.columnShopId]}>
                        <Text style={styles.cellText} numberOfLines={1}>{shop.shopId}</Text>
                      </View>
                      
                      <View style={[styles.tableCell, styles.columnFirstName]}>
                        <Text style={styles.cellText} numberOfLines={1}>{firstName}</Text>
                      </View>
                      
                      <View style={[styles.tableCell, styles.columnLastName]}>
                        <Text style={styles.cellText} numberOfLines={1}>{lastName}</Text>
                      </View>
                      
                      <View style={[styles.tableCell, styles.columnPhone]}>
                        <Text style={styles.cellText} numberOfLines={1}>{shop.phone}</Text>
                      </View>
                      
                      <View style={[styles.tableCell, styles.columnShopName]}>
                        <Text style={[styles.cellText, styles.shopNameText]} numberOfLines={1}>
                          {shop.name}
                        </Text>
                      </View>
                      
                      <View style={[styles.tableCell, styles.columnZoneId]}>
                        <Text style={[styles.cellText, styles.placeholderText]}>
                          {shop.zoneId || 'Z001'}
                        </Text>
                      </View>
                      
                      <View style={[styles.tableCell, styles.columnRadius]}>
                        <Text style={[styles.cellText, styles.placeholderText]}>
                          {shop.radius ? `${shop.radius}km` : '5km'}
                        </Text>
                      </View>
                      
                      <View style={[styles.tableCell, styles.columnStatus]}>
                        <View style={[
                          styles.statusBadge, 
                          shop.status === 'Active' ? styles.activeBadge : styles.inactiveBadge
                        ]}>
                          <Text style={styles.statusText}>{shop.status}</Text>
                        </View>
                      </View>
                      
                      <View style={[styles.tableCell, styles.columnActions]}>
                        <View style={styles.actionButtons}>
                          <TouchableOpacity 
                            style={styles.viewButton}
                            onPress={() => handleViewShopDetails(shop.id)}
                          >
                            <Text style={styles.viewButtonText}>View</Text>
                          </TouchableOpacity>
                          
                          <TouchableOpacity 
                            style={styles.editButton}
                            onPress={() => handleEditShop(shop.id)}
                          >
                            <Text style={styles.editButtonText}>Edit</Text>
                          </TouchableOpacity>

                          <TouchableOpacity 
                            style={[
                              styles.statusButton,
                              shop.status === 'Active' ? styles.inactiveButton : styles.activeButton
                            ]}
                            onPress={() => handleToggleStatus(shop.id)}
                          >
                            <Text style={styles.statusButtonText}>
                              {shop.status === 'Active' ? 'Deactivate' : 'Activate'}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            </ScrollView>
          )}
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
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 8,
  },
  
  addButton: {
    backgroundColor: '#27ae60',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 70,
  },
  
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
    marginTop: 20,
  },
  
  statsScroll: {
    marginHorizontal: -16,
  },
  
  statsScrollContent: {
    paddingHorizontal: 16,
  },
  
  statCard: {
    width: 140,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  
  totalCard: {
    borderTopWidth: 4,
    borderTopColor: '#3498db',
  },
  
  activeCard: {
    borderTopWidth: 4,
    borderTopColor: '#27ae60',
  },
  
  inactiveCard: {
    borderTopWidth: 4,
    borderTopColor: '#e74c3c',
  },
  
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  
  statLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  
  searchFilterSection: {
    marginBottom: 20,
  },
  
  searchContainer: {
    marginBottom: 12,
  },
  
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  
  searchIcon: {
    marginRight: 8,
    fontSize: 16,
  },
  
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2c3e50',
  },
  
  filterButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#ecf0f1',
    alignItems: 'center',
  },
  
  filterButtonActive: {
    backgroundColor: '#3498db',
  },
  
  filterButtonText: {
    color: '#7f8c8d',
    fontWeight: '600',
    fontSize: 14,
  },
  
  filterButtonTextActive: {
    color: '#fff',
  },
  
  tableContainer: {
    flex: 1,
    marginBottom: 30,
  },
  
  tableScroll: {
    flex: 1,
  },
  
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#2c3e50',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    paddingVertical: 12,
    minWidth: 1200,
  },
  
  tableHeaderCell: {
    paddingHorizontal: 8,
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#34495e',
  },
  
  tableHeaderText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  
  columnShopId: { width: 80 },
  columnFirstName: { width: 100 },
  columnLastName: { width: 100 },
  columnPhone: { width: 120 },
  columnShopName: { width: 150 },
  columnZoneId: { width: 80 },
  columnRadius: { width: 80 },
  columnStatus: { width: 100 },
  columnActions: { width: 250, borderRightWidth: 0 },

  tableRow: {
    flexDirection: 'row',
    minHeight: 60,
    minWidth: 1200,
  },
  
  tableRowEven: {
    backgroundColor: '#fff',
  },
  
  tableRowOdd: {
    backgroundColor: '#f8f9fa',
  },
  
  tableCell: {
    paddingHorizontal: 8,
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#f0f0f0',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  
  cellText: {
    fontSize: 12,
    color: '#2c3e50',
    textAlign: 'center',
  },
  
  shopNameText: {
    fontWeight: '600',
  },
  
  placeholderText: {
    color: '#95a5a6',
    fontStyle: 'italic',
  },
  
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'center',
  },
  
  activeBadge: {
    backgroundColor: '#d4edda',
  },
  
  inactiveBadge: {
    backgroundColor: '#f8d7da',
  },
  
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#155724',
  },
  
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
    flexWrap: 'wrap',
  },
  
  viewButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 4,
    minWidth: 50,
  },
  
  viewButtonText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
  
  editButton: {
    backgroundColor: '#f39c12',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 4,
    minWidth: 50,
  },
  
  editButtonText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
  
  statusButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 4,
    minWidth: 80,
  },
  
  activeButton: {
    backgroundColor: '#27ae60',
  },
  
  inactiveButton: {
    backgroundColor: '#e74c3c',
  },
  
  statusButtonText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
  
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
    textAlign: 'center',
  },
  
  emptyStateText: {
    fontSize: 14,
    color: '#95a5a6',
    textAlign: 'center',
    marginBottom: 20,
  },
  
  emptyStateButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  
  emptyStateButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ShopManagement;