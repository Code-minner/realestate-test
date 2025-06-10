// src/components/SessionManager.tsx - Create this new file
import React, { useEffect } from 'react';
import { PanResponder, View } from 'react-native';
import { useSessionTimeout } from '../hooks/useSessionTimeout';

interface SessionManagerProps {
  children: React.ReactNode;
}

const SessionManager: React.FC<SessionManagerProps> = ({ children }) => {
  const { resetTimer } = useSessionTimeout();

  // Create PanResponder to detect user interactions
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => {
      resetTimer(); // Reset timer on any touch
      return false; // Don't consume the touch event
    },
    onMoveShouldSetPanResponder: () => {
      resetTimer(); // Reset timer on any movement
      return false; // Don't consume the touch event
    },
  });

  return (
    <View style={{ flex: 1 }} {...panResponder.panHandlers}>
      {children}
    </View>
  );
};

export default SessionManager;