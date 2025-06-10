
// src/screens/Home/HomeScreen.tsx - With Logout Button Added
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  FlatList,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Alert, // ADD THIS IMPORT
} from 'react-native';
import { COLORS } from '../../constants/colors';
import { DIMENSIONS } from '../../constants/dimensions';
import { useAuthStore } from '../../stores/authStore'; // ADD THIS IMPORT

const { width } = Dimensions.get('window');

type Property = {
  id: string;
  price: string;
  address: string;
  beds: number;
  baths: number;
  sqft: string;
  type: string;
  image: string;
  featured?: boolean;
  saved?: boolean;
};

type PropertyType = {
  id: string;
  name: string;
  icon: string;
  color: string;
};

type QuickStat = {
  label: string;
  value: string;
  color: string;
  icon: string;
};

// Enhanced sample data with more realistic content
const featuredProperties: Property[] = [
  {
    id: '1',
    price: '₦75,000,000',
    address: '123 Ozumba Mbadiwe, Victoria Island',
    beds: 3,
    baths: 2,
    sqft: '2,100',
    type: 'Apartment',
    image: '🏢',
    featured: true,
    saved: false,
  },
  {
    id: '2',
    price: '₦45,000,000',
    address: '456 Admiralty Way, Lekki Phase 1',
    beds: 2,
    baths: 1,
    sqft: '1,200',
    type: 'Flat',
    image: '🏠',
    featured: true,
    saved: true,
  },
  {
    id: '3',
    price: '₦120,000,000',
    address: '789 Banana Island Road, Ikoyi',
    beds: 4,
    baths: 3,
    sqft: '2,800',
    type: 'Villa',
    image: '🏡',
    featured: true,
    saved: false,
  },
  {
    id: '4',
    price: '₦85,000,000',
    address: '321 Eko Atlantic City, Lagos',
    beds: 3,
    baths: 2,
    sqft: '2,200',
    type: 'Penthouse',
    image: '🏙️',
    featured: true,
    saved: true,
  },
];

const propertyTypes: PropertyType[] = [
  { id: '1', name: 'Buy', icon: '🏠', color: COLORS.success },
  { id: '2', name: 'Rent', icon: '🔑', color: COLORS.primary },
  { id: '3', name: 'Sell', icon: '💰', color: COLORS.secondary },
  { id: '4', name: 'Invest', icon: '📈', color: COLORS.luxury },
];

const quickStats: QuickStat[] = [
  { label: 'Available Properties', value: '2,450', color: COLORS.success, icon: '🏘️' },
  { label: 'Average Price', value: '₦65M', color: COLORS.primary, icon: '💰' },
  { label: 'New This Week', value: '127', color: COLORS.secondary, icon: '🆕' },
];

const quickActions = [
  { id: '1', title: 'Market Analysis', icon: '📊', color: COLORS.primary },
  { id: '2', title: 'Mortgage Calculator', icon: '🏦', color: COLORS.success },
  { id: '3', title: 'Contact Agent', icon: '📞', color: COLORS.secondary },
  { id: '4', title: 'Saved Properties', icon: '⭐', color: COLORS.luxury },
];

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('Buy');
  
  // ADD THESE LINES FOR LOGOUT FUNCTIONALITY
  const { logout, user } = useAuthStore();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            logout();
            // The app will automatically navigate back to auth screens
          },
        },
      ]
    );
  };

  const formatPrice = (price: string): string => {
    return price;
  };

  const toggleSaveProperty = (propertyId: string) => {
    // Implementation for saving/unsaving properties
    console.log('Toggle save for property:', propertyId);
  };

  const handleSearch = () => {
    console.log('Searching for:', searchQuery);
  };

  const handleFilterPress = () => {
    console.log('Open filters');
  };

  const handlePropertyPress = (property: Property) => {
    console.log('Navigate to property details:', property.id);
  };

  const handleQuickAction = (action: string) => {
    console.log('Quick action pressed:', action);
  };

  const renderPropertyCard = ({ item }: { item: Property }) => (
    <Pressable 
      style={styles.propertyCard}
      onPress={() => handlePropertyPress(item)}
      android_ripple={{ color: COLORS.gray[100] }}
    >
      <View style={styles.propertyImageContainer}>
        <Text style={styles.propertyEmoji}>{item.image}</Text>
        <View style={styles.priceTag}>
          <Text style={styles.priceText}>{formatPrice(item.price)}</Text>
        </View>
        
        {/* Save Button */}
        <Pressable 
          style={styles.saveButton}
          onPress={() => toggleSaveProperty(item.id)}
        >
          <Text style={styles.saveIcon}>
            {item.saved ? '❤️' : '🤍'}
          </Text>
        </Pressable>
        
        {/* Featured Badge */}
        {item.featured && (
          <View style={styles.featuredBadge}>
            <Text style={styles.featuredText}>Featured</Text>
          </View>
        )}
      </View>
      
      <View style={styles.propertyInfo}>
        <Text style={styles.propertyAddress} numberOfLines={2}>
          {item.address}
        </Text>
        <View style={styles.propertyDetails}>
          <Text style={styles.detailText}>🛏️ {item.beds}</Text>
          <Text style={styles.detailSeparator}>•</Text>
          <Text style={styles.detailText}>🚿 {item.baths}</Text>
          <Text style={styles.detailSeparator}>•</Text>
          <Text style={styles.detailText}>📐 {item.sqft} sqft</Text>
        </View>
        <View style={styles.propertyFooter}>
          <Text style={styles.propertyType}>{item.type}</Text>
          <Text style={styles.viewDetailsText}>View Details →</Text>
        </View>
      </View>
    </Pressable>
  );

  const renderPropertyType = ({ item }: { item: PropertyType }) => (
    <Pressable 
      style={[
        styles.typeCard,
        selectedType === item.name && { 
          backgroundColor: item.color,
          transform: [{ scale: 1.05 }],
        }
      ]}
      onPress={() => setSelectedType(item.name)}
      android_ripple={{ color: COLORS.gray[100] }}
    >
      <Text style={styles.typeEmoji}>{item.icon}</Text>
      <Text style={[
        styles.typeName,
        selectedType === item.name && { color: COLORS.white }
      ]}>
        {item.name}
      </Text>
    </Pressable>
  );

  const renderQuickAction = ({ item }: { item: typeof quickActions[0] }) => (
    <Pressable 
      style={[styles.actionCard, { borderLeftColor: item.color }]}
      onPress={() => handleQuickAction(item.title)}
      android_ripple={{ color: COLORS.gray[100] }}
    >
      <Text style={styles.actionEmoji}>{item.icon}</Text>
      <Text style={styles.actionText}>{item.title}</Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      
      <ScrollView 
        style={styles.scrollContainer} 
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Header - MODIFIED TO INCLUDE LOGOUT BUTTON */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>Good Morning! 👋</Text>
            <Text style={styles.location}>📍 Lagos, Nigeria</Text>
          </View>
          
          {/* REPLACED PROFILE BUTTON WITH LOGOUT BUTTON */}
          <Pressable 
            style={styles.logoutButton}
            onPress={handleLogout}
            android_ripple={{ color: COLORS.gray[200] }}
          >
            <Text style={styles.logoutIcon}>🚪</Text>
            <Text style={styles.logoutText}>Logout</Text>
          </Pressable>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search properties, locations..."
              placeholderTextColor={COLORS.gray[500]}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
            <Pressable 
              style={styles.filterButton}
              onPress={handleFilterPress}
            >
              <Text style={styles.filterIcon}>⚙️</Text>
            </Pressable>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Market Overview</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.statsScrollContainer}
          >
            {quickStats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <Text style={styles.statIcon}>{stat.icon}</Text>
                <Text style={[styles.statValue, { color: stat.color }]}>
                  {stat.value}
                </Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Property Types */}
        <View style={styles.typesContainer}>
          <Text style={styles.sectionTitle}>What are you looking for?</Text>
          <FlatList
            data={propertyTypes}
            renderItem={renderPropertyType}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.typesList}
          />
        </View>

        {/* Featured Properties */}
        <View style={styles.featuredContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Properties</Text>
            <Pressable onPress={() => console.log('See all properties')}>
              <Text style={styles.seeAllText}>See All</Text>
            </Pressable>
          </View>
          
          <FlatList
            data={featuredProperties}
            renderItem={renderPropertyCard}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.propertiesList}
            snapToInterval={width * 0.75 + DIMENSIONS.spacing.md}
            decelerationRate="fast"
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <FlatList
            data={quickActions}
            renderItem={renderQuickAction}
            keyExtractor={(item) => item.id}
            numColumns={2}
            scrollEnabled={false}
            contentContainerStyle={styles.actionsGrid}
          />
        </View>

        {/* Recent Activity */}
        <View style={styles.recentContainer}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityCard}>
            <View style={styles.activityHeader}>
              <Text style={styles.activityIcon}>🔍</Text>
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>
                  You searched for properties in "Victoria Island"
                </Text>
                <Text style={styles.activityTime}>2 hours ago</Text>
              </View>
            </View>
          </View>
          <View style={styles.activityCard}>
            <View style={styles.activityHeader}>
              <Text style={styles.activityIcon}>❤️</Text>
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>
                  You saved "Luxury Apartment in Ikoyi"
                </Text>
                <Text style={styles.activityTime}>1 day ago</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ADD USER INFO SECTION FOR TESTING */}
        <View style={styles.userInfoSection}>
          <Text style={styles.sectionTitle}>Account Info</Text>
          <View style={styles.userInfoCard}>
            <Text style={styles.userInfoText}>
              👤 {user?.firstName} {user?.lastName}
            </Text>
            <Text style={styles.userInfoText}>
              📧 {user?.email}
            </Text>
            <Text style={styles.userInfoText}>
              🏷️ {user?.userType === 'user' ? 'Property Seeker' : 'Real Estate Agent'}
            </Text>
            {user?.userType === 'agent' && (user as any).companyName && (
              <Text style={styles.userInfoText}>
                🏢 {(user as any).companyName}
              </Text>
            )}
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: DIMENSIONS.spacing.lg,
    paddingVertical: DIMENSIONS.spacing.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.gray[900],
    marginBottom: 4,
  },
  location: {
    fontSize: 16,
    color: COLORS.gray[600],
  },
  
  // NEW LOGOUT BUTTON STYLES
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.error,
    paddingHorizontal: DIMENSIONS.spacing.md,
    paddingVertical: DIMENSIONS.spacing.sm,
    borderRadius: DIMENSIONS.borderRadius.lg,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutIcon: {
    fontSize: 16,
    marginRight: DIMENSIONS.spacing.xs,
  },
  logoutText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  
  // REMOVED profileButton and profileEmoji styles - no longer needed
  
  searchContainer: {
    paddingHorizontal: DIMENSIONS.spacing.lg,
    paddingVertical: DIMENSIONS.spacing.md,
    backgroundColor: COLORS.white,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray[100],
    borderRadius: DIMENSIONS.borderRadius.lg,
    paddingHorizontal: DIMENSIONS.spacing.md,
    height: 50,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: DIMENSIONS.spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.gray[900],
  },
  filterButton: {
    padding: DIMENSIONS.spacing.sm,
  },
  filterIcon: {
    fontSize: 18,
  },
  statsContainer: {
    paddingHorizontal: DIMENSIONS.spacing.lg,
    paddingVertical: DIMENSIONS.spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.gray[900],
    marginBottom: DIMENSIONS.spacing.md,
  },
  statsScrollContainer: {
    paddingRight: DIMENSIONS.spacing.lg,
  },
  statCard: {
    backgroundColor: COLORS.white,
    padding: DIMENSIONS.spacing.md,
    borderRadius: DIMENSIONS.borderRadius.lg,
    alignItems: 'center',
    marginRight: DIMENSIONS.spacing.md,
    minWidth: 120,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    fontSize: 20,
    marginBottom: DIMENSIONS.spacing.xs,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: DIMENSIONS.spacing.xs,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.gray[600],
    textAlign: 'center',
  },
  typesContainer: {
    paddingLeft: DIMENSIONS.spacing.lg,
    paddingVertical: DIMENSIONS.spacing.md,
  },
  typesList: {
    paddingRight: DIMENSIONS.spacing.lg,
  },
  typeCard: {
    backgroundColor: COLORS.white,
    padding: DIMENSIONS.spacing.md,
    borderRadius: DIMENSIONS.borderRadius.lg,
    alignItems: 'center',
    marginRight: DIMENSIONS.spacing.md,
    minWidth: 80,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  typeEmoji: {
    fontSize: 24,
    marginBottom: DIMENSIONS.spacing.sm,
  },
  typeName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gray[900],
  },
  featuredContainer: {
    paddingLeft: DIMENSIONS.spacing.lg,
    paddingVertical: DIMENSIONS.spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: DIMENSIONS.spacing.lg,
    marginBottom: DIMENSIONS.spacing.md,
  },
  seeAllText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '600',
  },
  propertiesList: {
    paddingRight: DIMENSIONS.spacing.lg,
  },
  propertyCard: {
    backgroundColor: COLORS.white,
    borderRadius: DIMENSIONS.borderRadius.xl,
    marginRight: DIMENSIONS.spacing.md,
    width: width * 0.75,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
  propertyImageContainer: {
    height: 160,
    backgroundColor: COLORS.gray[100],
    borderTopLeftRadius: DIMENSIONS.borderRadius.xl,
    borderTopRightRadius: DIMENSIONS.borderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  propertyEmoji: {
    fontSize: 48,
  },
  priceTag: {
    position: 'absolute',
    top: DIMENSIONS.spacing.sm,
    right: DIMENSIONS.spacing.sm,
    backgroundColor: COLORS.success,
    paddingHorizontal: DIMENSIONS.spacing.sm,
    paddingVertical: DIMENSIONS.spacing.xs,
    borderRadius: DIMENSIONS.borderRadius.md,
  },
  priceText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
  saveButton: {
    position: 'absolute',
    top: DIMENSIONS.spacing.sm,
    left: DIMENSIONS.spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    padding: DIMENSIONS.spacing.xs,
  },
  saveIcon: {
    fontSize: 16,
  },
  featuredBadge: {
    position: 'absolute',
    bottom: DIMENSIONS.spacing.sm,
    left: DIMENSIONS.spacing.sm,
    backgroundColor: COLORS.secondary,
    paddingHorizontal: DIMENSIONS.spacing.sm,
    paddingVertical: DIMENSIONS.spacing.xs,
    borderRadius: DIMENSIONS.borderRadius.sm,
  },
  featuredText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  propertyInfo: {
    padding: DIMENSIONS.spacing.md,
  },
  propertyAddress: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray[900],
    marginBottom: DIMENSIONS.spacing.sm,
    lineHeight: 22,
  },
  propertyDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: DIMENSIONS.spacing.sm,
  },
  detailText: {
    fontSize: 14,
    color: COLORS.gray[600],
    marginHorizontal: 2,
  },
  detailSeparator: {
    fontSize: 14,
    color: COLORS.gray[400],
    marginHorizontal: DIMENSIONS.spacing.xs,
  },
  propertyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  propertyType: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  viewDetailsText: {
    fontSize: 12,
    color: COLORS.gray[500],
    fontWeight: '500',
  },
  actionsContainer: {
    paddingHorizontal: DIMENSIONS.spacing.lg,
    paddingVertical: DIMENSIONS.spacing.md,
  },
  actionsGrid: {
    justifyContent: 'space-between',
  },
  actionCard: {
    backgroundColor: COLORS.white,
    padding: DIMENSIONS.spacing.md,
    borderRadius: DIMENSIONS.borderRadius.lg,
    alignItems: 'center',
    width: '48%',
    marginBottom: DIMENSIONS.spacing.sm,
    borderLeftWidth: 4,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionEmoji: {
    fontSize: 24,
    marginBottom: DIMENSIONS.spacing.sm,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gray[900],
    textAlign: 'center',
  },
  recentContainer: {
    paddingHorizontal: DIMENSIONS.spacing.lg,
    paddingVertical: DIMENSIONS.spacing.md,
  },
  activityCard: {
    backgroundColor: COLORS.white,
    padding: DIMENSIONS.spacing.md,
    borderRadius: DIMENSIONS.borderRadius.lg,
    marginBottom: DIMENSIONS.spacing.sm,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  activityIcon: {
    fontSize: 20,
    marginRight: DIMENSIONS.spacing.sm,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    color: COLORS.gray[900],
    marginBottom: DIMENSIONS.spacing.xs,
    lineHeight: 20,
  },
  activityTime: {
    fontSize: 12,
    color: COLORS.gray[500],
  },
  
  // NEW USER INFO SECTION STYLES
  userInfoSection: {
    paddingHorizontal: DIMENSIONS.spacing.lg,
    paddingVertical: DIMENSIONS.spacing.md,
  },
  userInfoCard: {
    backgroundColor: COLORS.white,
    padding: DIMENSIONS.spacing.lg,
    borderRadius: DIMENSIONS.borderRadius.xl,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userInfoText: {
    fontSize: 16,
    color: COLORS.gray[800],
    marginBottom: DIMENSIONS.spacing.sm,
    lineHeight: 22,
  },
  
  bottomSpacing: {
    height: 100,
  },
});