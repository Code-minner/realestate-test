// src/stores/authStore.ts - Update to handle session expiration
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  AuthState, 
  User, 
  Agent, 
  LoginCredentials, 
  RegisterData,
  UpdateUserData,
  UpdateAgentData
} from '../types/auth';
import { authService } from '../services/authService';
import { Alert } from 'react-native';

interface AuthStore extends AuthState {
  // Actions
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: (showMessage?: boolean) => void; // Added optional parameter
  clearError: () => void;
  updateProfile: (data: UpdateUserData | UpdateAgentData) => Promise<boolean>;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial State
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Set Loading
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      // Login Action
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await authService.login(credentials);
          
          if (response.success && response.user) {
            set({
              user: response.user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
            return true;
          } else {
            set({
              isLoading: false,
              error: response.error || 'Login failed',
            });
            return false;
          }
        } catch (error) {
          set({
            isLoading: false,
            error: 'Network error. Please try again.',
          });
          return false;
        }
      },

      // Register Action
      register: async (data) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await authService.register(data);
          
          if (response.success && response.user) {
            set({
              user: response.user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
            return true;
          } else {
            set({
              isLoading: false,
              error: response.error || 'Registration failed',
            });
            return false;
          }
        } catch (error) {
          set({
            isLoading: false,
            error: 'Network error. Please try again.',
          });
          return false;
        }
      },

      // Logout Action - Updated with session timeout support
      logout: (showMessage = false) => {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
        authService.logout();
        
        // Show alert for session timeout
        if (showMessage) {
          Alert.alert(
            'Session Expired',
            'You have been logged out due to inactivity. Please log in again.',
            [{ text: 'OK' }]
          );
        }
      },

      // Clear Error
      clearError: () => {
        set({ error: null });
      },

      // Update Profile
      updateProfile: async (data) => {
        set({ isLoading: true, error: null });
        
        try {
          const currentUser = get().user;
          if (!currentUser) {
            set({ isLoading: false, error: 'No user logged in' });
            return false;
          }

          const response = await authService.updateProfile(currentUser.id, data);
          
          if (response.success && response.user) {
            set({
              user: response.user,
              isLoading: false,
              error: null,
            });
            return true;
          } else {
            set({
              isLoading: false,
              error: response.error || 'Update failed',
            });
            return false;
          }
        } catch (error) {
          set({
            isLoading: false,
            error: 'Network error. Please try again.',
          });
          return false;
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: {
        getItem: async (name) => {
          try {
            const value = await AsyncStorage.getItem(name);
            return value ? JSON.parse(value) : null;
          } catch {
            return null;
          }
        },
        setItem: async (name, value) => {
          try {
            await AsyncStorage.setItem(name, JSON.stringify(value));
          } catch (error) {
            console.error('Error saving to storage:', error);
          }
        },
        removeItem: async (name) => {
          try {
            await AsyncStorage.removeItem(name);
          } catch (error) {
            console.error('Error removing from storage:', error);
          }
        },
      },
    }
  )
);