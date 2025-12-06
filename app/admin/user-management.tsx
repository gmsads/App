import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  TextInput,
  Alert,
  RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Define User interface (removed totalSpent)
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: 'Active' | 'Inactive';
  registrationDate: string;
  lastLogin: string;
  totalOrders: number;
}

// Mock data for demonstration (removed totalSpent from all users)
const mockUsers: User[] = [
  {
    id: 'USR001',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 234-567-8901',
    status: 'Active',
    registrationDate: '2024-01-15',
    lastLogin: '2024-03-15',
    totalOrders: 15,
  },
  {
    id: 'USR002',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phone: '+1 345-678-9012',
    status: 'Active',
    registrationDate: '2024-01-20',
    lastLogin: '2024-03-14',
    totalOrders: 8,
  },
  {
    id: 'USR003',
    firstName: 'Robert',
    lastName: 'Johnson',
    email: 'robert.j@example.com',
    phone: '+1 456-789-0123',
    status: 'Inactive',
    registrationDate: '2024-02-01',
    lastLogin: '2024-02-28',
    totalOrders: 3,
  },
  {
    id: 'USR004',
    firstName: 'Alice',
    lastName: 'Williams',
    email: 'alice.w@example.com',
    phone: '+1 567-890-1234',
    status: 'Active',
    registrationDate: '2024-02-10',
    lastLogin: '2024-03-15',
    totalOrders: 22,
  },
  {
    id: 'USR005',
    firstName: 'Michael',
    lastName: 'Brown',
    email: 'michael.b@example.com',
    phone: '+1 678-901-2345',
    status: 'Inactive',
    registrationDate: '2024-02-15',
    lastLogin: '2024-03-01',
    totalOrders: 5,
  },
  {
    id: 'USR006',
    firstName: 'Sarah',
    lastName: 'Davis',
    email: 'sarah.d@example.com',
    phone: '+1 789-012-3456',
    status: 'Active',
    registrationDate: '2024-02-20',
    lastLogin: '2024-03-15',
    totalOrders: 12,
  },
  {
    id: 'USR007',
    firstName: 'David',
    lastName: 'Miller',
    email: 'david.m@example.com',
    phone: '+1 890-123-4567',
    status: 'Active',
    registrationDate: '2024-03-01',
    lastLogin: '2024-03-14',
    totalOrders: 7,
  },
  {
    id: 'USR008',
    firstName: 'Emily',
    lastName: 'Wilson',
    email: 'emily.w@example.com',
    phone: '+1 901-234-5678',
    status: 'Inactive',
    registrationDate: '2024-03-05',
    lastLogin: '2024-03-10',
    totalOrders: 2,
  },
];

const UserManagement: React.FC = () => {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Active' | 'Inactive'>('all');
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [filteredUsers, setFilteredUsers] = useState<User[]>(mockUsers);

  // Filter users when search query or status filter changes
  useEffect(() => {
    let result = users;

    // Apply status filter if not 'all'
    if (statusFilter !== 'all') {
      result = result.filter(user => user.status === statusFilter);
    }

    // Apply search filter if search query exists
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(user =>
        user.firstName.toLowerCase().includes(query) ||
        user.lastName.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.phone.toLowerCase().includes(query) ||
        user.id.toLowerCase().includes(query)
      );
    }

    setFilteredUsers(result);
  }, [users, searchQuery, statusFilter]);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleToggleStatus = (userId: string) => {
    Alert.alert(
      'Change User Status',
      'Are you sure you want to change this user\'s status?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            setUsers(prevUsers => 
              prevUsers.map(user => 
                user.id === userId 
                  ? { ...user, status: user.status === 'Active' ? 'Inactive' : 'Active' }
                  : user
              )
            );
          }
        }
      ]
    );
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    Alert.alert(
      'Delete User',
      `Are you sure you want to delete ${userName}? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
            Alert.alert('Success', 'User deleted successfully.');
          }
        }
      ]
    );
  };

  const handleViewUserDetails = (user: User) => {
    router.push({
      pathname: '/admin/user-details',
      params: { user: JSON.stringify(user) }
    });
  };

  // Calculate statistics (removed totalRevenue calculation)
  const totalUsers = users.length;
  const activeUsers = users.filter(user => user.status === 'Active').length;
  const inactiveUsers = users.filter(user => user.status === 'Inactive').length;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>User Management</Text>
        
        <View style={styles.headerPlaceholder} />
      </View>

      {/* Main Content ScrollView */}
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Stats Section */}
        <Text style={styles.sectionTitle}>User Overview</Text>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.statsScroll}
          contentContainerStyle={styles.statsScrollContent}
        >
          {/* Total Users Card */}
          <View style={[styles.statCard, styles.totalCard]}>
            <Text style={styles.statNumber}>{totalUsers}</Text>
            <Text style={styles.statLabel}>Total Users</Text>
          </View>
          
          {/* Active Users Card */}
          <View style={[styles.statCard, styles.activeCard]}>
            <Text style={styles.statNumber}>{activeUsers}</Text>
            <Text style={styles.statLabel}>Active Users</Text>
          </View>
          
          {/* Inactive Users Card */}
          <View style={[styles.statCard, styles.inactiveCard]}>
            <Text style={styles.statNumber}>{inactiveUsers}</Text>
            <Text style={styles.statLabel}>Inactive Users</Text>
          </View>
        </ScrollView>

        {/* Search and Filter Section */}
        <View style={styles.searchFilterSection}>
          <Text style={styles.sectionTitle}>All Users ({filteredUsers.length})</Text>
          
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Search users by name, email, or phone..."
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

        {/* Table Container */}
        <View style={styles.tableContainer}>
          {filteredUsers.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateIcon}>👥</Text>
              <Text style={styles.emptyStateTitle}>No users found</Text>
              <Text style={styles.emptyStateText}>
                {searchQuery || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'No users have registered yet'}
              </Text>
            </View>
          ) : (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={true}
              style={styles.tableScroll}
            >
              <View>
                {/* Table Header */}
                <View style={styles.tableHeader}>
                  <View style={[styles.tableHeaderCell, styles.columnUserId]}>
                    <Text style={styles.tableHeaderText}>User ID</Text>
                  </View>
                  <View style={[styles.tableHeaderCell, styles.columnName]}>
                    <Text style={styles.tableHeaderText}>Name</Text>
                  </View>
                  <View style={[styles.tableHeaderCell, styles.columnEmail]}>
                    <Text style={styles.tableHeaderText}>Email</Text>
                  </View>
                  <View style={[styles.tableHeaderCell, styles.columnPhone]}>
                    <Text style={styles.tableHeaderText}>Phone</Text>
                  </View>
                  <View style={[styles.tableHeaderCell, styles.columnOrders]}>
                    <Text style={styles.tableHeaderText}>Orders</Text>
                  </View>
                  <View style={[styles.tableHeaderCell, styles.columnLastLogin]}>
                    <Text style={styles.tableHeaderText}>Last Login</Text>
                  </View>
                  <View style={[styles.tableHeaderCell, styles.columnStatus]}>
                    <Text style={styles.tableHeaderText}>Status</Text>
                  </View>
                  <View style={[styles.tableHeaderCell, styles.columnActions]}>
                    <Text style={styles.tableHeaderText}>Actions</Text>
                  </View>
                </View>

                {/* Table Rows */}
                {filteredUsers.map((user, index) => (
                  <View 
                    key={user.id} 
                    style={[
                      styles.tableRow,
                      index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd
                    ]}
                  >
                    {/* User ID */}
                    <View style={[styles.tableCell, styles.columnUserId]}>
                      <Text style={styles.cellText} numberOfLines={1}>{user.id}</Text>
                    </View>
                    
                    {/* Name */}
                    <View style={[styles.tableCell, styles.columnName]}>
                      <Text style={[styles.cellText, styles.nameText]} numberOfLines={1}>
                        {user.firstName} {user.lastName}
                      </Text>
                    </View>
                    
                    {/* Email */}
                    <View style={[styles.tableCell, styles.columnEmail]}>
                      <Text style={[styles.cellText, styles.emailText]} numberOfLines={1}>
                        {user.email}
                      </Text>
                    </View>
                    
                    {/* Phone */}
                    <View style={[styles.tableCell, styles.columnPhone]}>
                      <Text style={styles.cellText} numberOfLines={1}>{user.phone}</Text>
                    </View>
                    
                    {/* Total Orders */}
                    <View style={[styles.tableCell, styles.columnOrders]}>
                      <Text style={styles.cellText}>{user.totalOrders}</Text>
                    </View>
                    
                    {/* Last Login */}
                    <View style={[styles.tableCell, styles.columnLastLogin]}>
                      <Text style={styles.cellText}>{formatDate(user.lastLogin)}</Text>
                    </View>
                    
                    {/* Status */}
                    <View style={[styles.tableCell, styles.columnStatus]}>
                      <View style={[
                        styles.statusBadge, 
                        user.status === 'Active' ? styles.activeBadge : styles.inactiveBadge
                      ]}>
                        <Text style={styles.statusText}>{user.status}</Text>
                      </View>
                    </View>
                    
                    {/* Actions */}
                    <View style={[styles.tableCell, styles.columnActions]}>
                      <View style={styles.actionButtons}>
                        <TouchableOpacity 
                          style={styles.viewButton}
                          onPress={() => handleViewUserDetails(user)}
                        >
                          <Text style={styles.viewButtonText}>View</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                          style={[
                            styles.statusButton,
                            user.status === 'Active' ? styles.inactiveButton : styles.activeButton
                          ]}
                          onPress={() => handleToggleStatus(user.id)}
                        >
                          <Text style={styles.statusButtonText}>
                            {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                          </Text>
                        </TouchableOpacity>
                        
                        {/* Delete Button */}
                        <TouchableOpacity 
                          style={styles.deleteButton}
                          onPress={() => handleDeleteUser(user.id, `${user.firstName} ${user.lastName}`)}
                        >
                          <Text style={styles.deleteButtonText}>Delete</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>
          )}
        </View>
        
        {/* Bottom Padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

// Updated Styles (removed revenueCard style)
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
  
  headerPlaceholder: {
    width: 70,
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
    minWidth: 1000, // Reduced from 1300
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
  
  // Column widths (removed columnSpent)
  columnUserId: { width: 80 },
  columnName: { width: 120 },
  columnEmail: { width: 180 },
  columnPhone: { width: 120 },
  columnOrders: { width: 80 },
  columnLastLogin: { width: 100 },
  columnStatus: { width: 100 },
  columnActions: { width: 280, borderRightWidth: 0 },

  tableRow: {
    flexDirection: 'row',
    minHeight: 60,
    minWidth: 1000, // Reduced from 1300
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
  
  nameText: {
    fontWeight: '600',
  },
  
  emailText: {
    fontSize: 11,
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
    gap: 6,
  },
  
  viewButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    minWidth: 50,
  },
  
  viewButtonText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  
  statusButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 4,
    minWidth: 70,
  },
  
  activeButton: {
    backgroundColor: '#27ae60',
  },
  
  inactiveButton: {
    backgroundColor: '#e74c3c',
  },
  
  statusButtonText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  
  deleteButton: {
    backgroundColor: '#dc3545',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    minWidth: 50,
  },
  
  deleteButtonText: {
    color: '#fff',
    fontSize: 11,
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
  
  bottomPadding: {
    height: 20,
  },
});

export default UserManagement;