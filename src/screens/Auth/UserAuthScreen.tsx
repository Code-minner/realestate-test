import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { COLORS } from '../../constants/colors';
import { DIMENSIONS } from '../../constants/dimensions';
import { useAuthStore } from '../../stores/authStore';
import { authService } from '../../services/authService';

interface UserAuthScreenProps {
  onSuccess: () => void;
  onBack: () => void;
}

const UserAuthScreen: React.FC<UserAuthScreenProps> = ({ onSuccess, onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { login, register, error, clearError } = useAuthStore();

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
  });

  // Form validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!authService.validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Registration specific validations
    if (!isLogin) {
      if (!formData.firstName) {
        newErrors.firstName = 'First name is required';
      }
      if (!formData.lastName) {
        newErrors.lastName = 'Last name is required';
      }
      if (!formData.phone) {
        newErrors.phone = 'Phone number is required';
      } else if (!authService.validatePhone(formData.phone)) {
        newErrors.phone = 'Please enter a valid phone number';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    clearError();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      let success = false;

      if (isLogin) {
        success = await login({
          email: formData.email,
          password: formData.password,
          userType: 'user',
        });
      } else {
        success = await register({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          userType: 'user',
        });
      }

      if (success) {
        onSuccess();
      }
    } catch (err) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const renderInput = (
    field: keyof typeof formData,
    placeholder: string,
    options: {
      secureTextEntry?: boolean;
      keyboardType?: 'default' | 'email-address' | 'phone-pad';
      autoCapitalize?: 'none' | 'sentences' | 'words';
    } = {}
  ) => (
    <View style={styles.inputContainer}>
      <TextInput
        style={[styles.input, errors[field] && styles.inputError]}
        placeholder={placeholder}
        placeholderTextColor={COLORS.gray[500]}
        value={formData[field]}
        onChangeText={(value) => updateFormData(field, value)}
        secureTextEntry={options.secureTextEntry}
        keyboardType={options.keyboardType || 'default'}
        autoCapitalize={options.autoCapitalize || 'sentences'}
        autoCorrect={false}
      />
      {errors[field] && (
        <Text style={styles.errorText}>{errors[field]}</Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
            
            <View style={styles.logoContainer}>
              <Text style={styles.logo}>🔍</Text>
              <Text style={styles.title}>
                {isLogin ? 'Welcome Back!' : 'Find Your Dream Home'}
              </Text>
              <Text style={styles.subtitle}>
                {isLogin 
                  ? 'Sign in to continue your property search'
                  : 'Create your account to start browsing properties'
                }
              </Text>
            </View>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {/* Toggle Login/Register */}
            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={[styles.toggleButton, isLogin && styles.toggleButtonActive]}
                onPress={() => setIsLogin(true)}
              >
                <Text style={[styles.toggleText, isLogin && styles.toggleTextActive]}>
                  Sign In
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleButton, !isLogin && styles.toggleButtonActive]}
                onPress={() => setIsLogin(false)}
              >
                <Text style={[styles.toggleText, !isLogin && styles.toggleTextActive]}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>

            {/* Registration Fields */}
            {!isLogin && (
              <View style={styles.nameRow}>
                <View style={styles.nameInput}>
                  {renderInput('firstName', 'First Name', { autoCapitalize: 'words' })}
                </View>
                <View style={styles.nameInput}>
                  {renderInput('lastName', 'Last Name', { autoCapitalize: 'words' })}
                </View>
              </View>
            )}

            {/* Email */}
            {renderInput('email', 'Email Address', { 
              keyboardType: 'email-address', 
              autoCapitalize: 'none' 
            })}

            {/* Phone (Registration only) */}
            {!isLogin && renderInput('phone', 'Phone Number', { 
              keyboardType: 'phone-pad' 
            })}

            {/* Password */}
            {renderInput('password', 'Password', { secureTextEntry: true })}

            {/* Confirm Password (Registration only) */}
            {!isLogin && renderInput('confirmPassword', 'Confirm Password', { 
              secureTextEntry: true 
            })}

            {/* Error Message */}
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorMessage}>{error}</Text>
              </View>
            )}

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              <Text style={styles.submitButtonText}>
                {isLoading 
                  ? (isLogin ? 'Signing In...' : 'Creating Account...') 
                  : (isLogin ? 'Sign In' : 'Create Account')
                }
              </Text>
            </TouchableOpacity>

            {/* Additional Options */}
            <View style={styles.additionalOptions}>
              {isLogin && (
                <TouchableOpacity style={styles.forgotPassword}>
                  <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>
              )}
              
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>

              <TouchableOpacity style={styles.guestButton}>
                <Text style={styles.guestButtonText}>Continue as Guest</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: DIMENSIONS.spacing.lg,
    paddingTop: DIMENSIONS.spacing.md,
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: DIMENSIONS.spacing.sm,
  },
  backButtonText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '500',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: DIMENSIONS.spacing.lg,
    marginBottom: DIMENSIONS.spacing.xl,
  },
  logo: {
    fontSize: 60,
    marginBottom: DIMENSIONS.spacing.md,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.gray[900],
    marginBottom: DIMENSIONS.spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.gray[600],
    textAlign: 'center',
    lineHeight: 22,
  },
  formContainer: {
    paddingHorizontal: DIMENSIONS.spacing.lg,
    paddingBottom: DIMENSIONS.spacing.xxl,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.gray[100],
    borderRadius: DIMENSIONS.borderRadius.lg,
    padding: 4,
    marginBottom: DIMENSIONS.spacing.xl,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: DIMENSIONS.spacing.sm,
    alignItems: 'center',
    borderRadius: DIMENSIONS.borderRadius.md,
  },
  toggleButtonActive: {
    backgroundColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.gray[600],
  },
  toggleTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  nameRow: {
    flexDirection: 'row',
    gap: DIMENSIONS.spacing.md,
  },
  nameInput: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: DIMENSIONS.spacing.md,
  },
  input: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.gray[300],
    borderRadius: DIMENSIONS.borderRadius.lg,
    paddingHorizontal: DIMENSIONS.spacing.md,
    paddingVertical: DIMENSIONS.spacing.md,
    fontSize: 16,
    color: COLORS.gray[900],
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.error,
    marginTop: DIMENSIONS.spacing.xs,
    marginLeft: DIMENSIONS.spacing.sm,
  },
  errorContainer: {
    backgroundColor: COLORS.error + '10',
    padding: DIMENSIONS.spacing.md,
    borderRadius: DIMENSIONS.borderRadius.md,
    marginBottom: DIMENSIONS.spacing.md,
  },
  errorMessage: {
    fontSize: 14,
    color: COLORS.error,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: DIMENSIONS.spacing.md,
    borderRadius: DIMENSIONS.borderRadius.lg,
    alignItems: 'center',
    marginTop: DIMENSIONS.spacing.md,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '600',
  },
  additionalOptions: {
    marginTop: DIMENSIONS.spacing.xl,
    alignItems: 'center',
  },
  forgotPassword: {
    marginBottom: DIMENSIONS.spacing.lg,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: DIMENSIONS.spacing.lg,
    width: '100%',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.gray[300],
  },
  dividerText: {
    fontSize: 14,
    color: COLORS.gray[500],
    marginHorizontal: DIMENSIONS.spacing.md,
  },
  guestButton: {
    paddingVertical: DIMENSIONS.spacing.sm,
    paddingHorizontal: DIMENSIONS.spacing.lg,
  },
  guestButtonText: {
    fontSize: 16,
    color: COLORS.gray[600],
    fontWeight: '500',
  },
});

export default UserAuthScreen;