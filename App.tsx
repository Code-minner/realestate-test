// Updated App.tsx - Wrap your app with SessionManager
import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet } from 'react-native';
import SplashScreen from './src/screens/Splash/SplashScreen';
import OnboardingScreen from './src/screens/Onboarding/OnboardingScreen';
import { 
  AuthChoiceScreen, 
  UserAuthScreen, 
  AgentAuthScreen 
} from './src/screens/Auth';
import HomeScreen from './src/screens/Home/HomeScreen';
import { useAuthStore } from './src/stores/authStore';
import SessionManager from './src/components/SessionManager.tsx'; // Import SessionManager

type AppState = 'splash' | 'onboarding' | 'authChoice' | 'userAuth' | 'agentAuth' | 'main';

export default function App() {
  const [appState, setAppState] = useState<AppState>('splash');
  const { isAuthenticated, user } = useAuthStore();

  // Check if user is already authenticated on app start
  useEffect(() => {
    if (isAuthenticated && user) {
      setAppState('main');
    }
  }, [isAuthenticated, user]);

  // Listen for auth state changes
  useEffect(() => {
    if (!isAuthenticated && appState === 'main') {
      // User was logged out (including by session timeout)
      setAppState('authChoice');
    }
  }, [isAuthenticated, appState]);

  const handleSplashFinish = () => {
    if (isAuthenticated) {
      setAppState('main');
    } else {
      setAppState('onboarding');
    }
  };

  const handleOnboardingFinish = () => {
    if (isAuthenticated) {
      setAppState('main');
    } else {
      setAppState('authChoice');
    }
  };

  const handleUserChoice = () => {
    setAppState('userAuth');
  };

  const handleAgentChoice = () => {
    setAppState('agentAuth');
  };

  const handleAuthSuccess = () => {
    setAppState('main');
  };

  const handleBackToChoice = () => {
    setAppState('authChoice');
  };

  const renderCurrentScreen = () => {
    switch (appState) {
      case 'splash':
        return <SplashScreen onFinish={handleSplashFinish} />;
        
      case 'onboarding':
        return <OnboardingScreen onFinish={handleOnboardingFinish} />;
        
      case 'authChoice':
        return (
          <AuthChoiceScreen 
            onUserChoice={handleUserChoice}
            onAgentChoice={handleAgentChoice}
          />
        );
        
      case 'userAuth':
        return (
          <UserAuthScreen 
            onSuccess={handleAuthSuccess}
            onBack={handleBackToChoice}
          />
        );
        
      case 'agentAuth':
        return (
          <AgentAuthScreen 
            onSuccess={handleAuthSuccess}
            onBack={handleBackToChoice}
          />
        );
        
      case 'main':
        return (
          <View style={styles.mainContainer}>
            <HomeScreen />
            
            {/* Debug Info - Shows current user (remove in production) */}
            {user && (
              <View style={styles.debugInfo}>
                <Text style={styles.debugText}>
                  Logged in as: {user.userType} - {user.firstName} {user.lastName}
                </Text>
                <Text style={styles.debugText}>
                  Email: {user.email}
                </Text>
                {user.userType === 'agent' && (
                  <Text style={styles.debugText}>
                    Company: {(user as any).companyName}
                  </Text>
                )}
              </View>
            )}
          </View>
        );
        
      default:
        return <SplashScreen onFinish={handleSplashFinish} />;
    }
  };

  return (
    <SessionManager>
      <StatusBar style="auto" />
      {renderCurrentScreen()}
    </SessionManager>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  debugInfo: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 10,
    borderRadius: 8,
    zIndex: 1000,
    maxWidth: 300,
  },
  debugText: {
    color: 'white',
    fontSize: 11,
    marginBottom: 2,
  },
});