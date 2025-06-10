// src/hooks/useSessionTimeout.ts - Create this new file
import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useAuthStore } from '../stores/authStore';

const SESSION_TIMEOUT = 10 * 60 * 1000; // 10 minutes in milliseconds

export const useSessionTimeout = () => {
  const { logout, isAuthenticated } = useAuthStore();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  const resetTimer = () => {
    // Clear existing timer
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Update last activity time
    lastActivityRef.current = Date.now();

    // Set new timer
    timeoutRef.current = setTimeout(() => {
      if (isAuthenticated) {
        console.log('Session expired - logging out user');
        logout();
      }
    }, SESSION_TIMEOUT);
  };

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (nextAppState === 'active') {
      // App came to foreground
      const timeSinceLastActivity = Date.now() - lastActivityRef.current;
      
      if (timeSinceLastActivity >= SESSION_TIMEOUT && isAuthenticated) {
        // User was away for more than 10 minutes
        console.log('App was inactive too long - logging out user');
        logout();
      } else if (isAuthenticated) {
        // Reset timer when app becomes active
        resetTimer();
      }
    } else if (nextAppState === 'background' || nextAppState === 'inactive') {
      // App went to background - clear timer but remember last activity
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      // Clear timer if user is not authenticated
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      return;
    }

    // Start timer when user is authenticated
    resetTimer();

    // Listen for app state changes
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      subscription?.remove();
    };
  }, [isAuthenticated]);

  // Return function to reset timer on user activity
  return { resetTimer };
};