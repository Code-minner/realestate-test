import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { COLORS } from '../../constants/colors';
import { DIMENSIONS } from '../../constants/dimensions';

interface AuthChoiceScreenProps {
  onUserChoice: () => void;
  onAgentChoice: () => void;
}

const AuthChoiceScreen: React.FC<AuthChoiceScreenProps> = ({
  onUserChoice,
  onAgentChoice,
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>🏠</Text>
          <Text style={styles.title}>PropertyFinder</Text>
          <Text style={styles.subtitle}>Choose how you'd like to continue</Text>
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {/* User Option */}
          <TouchableOpacity 
            style={styles.optionCard}
            onPress={onUserChoice}
            activeOpacity={0.8}
          >
            <View style={styles.optionIcon}>
              <Text style={styles.optionEmoji}>🔍</Text>
            </View>
            <Text style={styles.optionTitle}>I'm looking for a property</Text>
            <Text style={styles.optionDescription}>
              Browse and discover your dream home from thousands of verified listings
            </Text>
            <View style={styles.optionBadge}>
              <Text style={styles.badgeText}>Property Seeker</Text>
            </View>
          </TouchableOpacity>

          {/* Agent Option */}
          <TouchableOpacity 
            style={styles.optionCard}
            onPress={onAgentChoice}
            activeOpacity={0.8}
          >
            <View style={styles.optionIcon}>
              <Text style={styles.optionEmoji}>🏢</Text>
            </View>
            <Text style={styles.optionTitle}>I'm a Real Estate Agent</Text>
            <Text style={styles.optionDescription}>
              List properties, manage clients, and grow your real estate business
            </Text>
            <View style={[styles.optionBadge, { backgroundColor: COLORS.secondary }]}>
              <Text style={styles.badgeText}>Professional</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: DIMENSIONS.spacing.xl,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: DIMENSIONS.spacing.xxl * 2,
  },
  logo: {
    fontSize: 80,
    marginBottom: DIMENSIONS.spacing.md,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.gray[900],
    marginBottom: DIMENSIONS.spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.gray[600],
    textAlign: 'center',
  },
  optionsContainer: {
    gap: DIMENSIONS.spacing.lg,
  },
  optionCard: {
    backgroundColor: COLORS.white,
    padding: DIMENSIONS.spacing.xl,
    borderRadius: DIMENSIONS.borderRadius.xl,
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionIcon: {
    width: 80,
    height: 80,
    backgroundColor: COLORS.gray[100],
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: DIMENSIONS.spacing.lg,
  },
  optionEmoji: {
    fontSize: 40,
  },
  optionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.gray[900],
    marginBottom: DIMENSIONS.spacing.sm,
    textAlign: 'center',
  },
  optionDescription: {
    fontSize: 14,
    color: COLORS.gray[600],
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: DIMENSIONS.spacing.md,
  },
  optionBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: DIMENSIONS.spacing.md,
    paddingVertical: DIMENSIONS.spacing.xs,
    borderRadius: DIMENSIONS.borderRadius.lg,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  footer: {
    paddingBottom: DIMENSIONS.spacing.xl,
  },
  footerText: {
    fontSize: 12,
    color: COLORS.gray[500],
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default AuthChoiceScreen;