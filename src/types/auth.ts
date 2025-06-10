// src/types/auth.ts - Fixed Version
export type UserType = 'user' | 'agent';

export interface BaseUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  budget: { min: number; max: number };
  locations: string[];
  propertyTypes: string[];
  bedrooms: number;
  bathrooms: number;
}

export interface User extends BaseUser {
  userType: 'user';
  preferences: UserPreferences;
  savedProperties: string[];
  searchHistory: string[];
}

export interface Agent extends BaseUser {
  userType: 'agent';
  companyName: string;
  licenseNumber: string;
  experience: number;
  specialization: string[];
  rating: number;
  reviewsCount: number;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  properties: string[];
  bio: string;
}

export interface AuthState {
  user: User | Agent | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
  userType: UserType;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  userType: UserType;
  // Additional fields for agents
  companyName?: string;
  licenseNumber?: string;
  experience?: number;
  bio?: string;
}

// Update profile data types
export interface UpdateUserData extends Partial<Omit<User, 'id' | 'userType' | 'createdAt'>> {}
export interface UpdateAgentData extends Partial<Omit<Agent, 'id' | 'userType' | 'createdAt'>> {}

// API Response types
export interface AuthResponse {
  success: boolean;
  user?: User | Agent;
  error?: string;
  token?: string;
}