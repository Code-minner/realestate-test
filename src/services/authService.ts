// src/services/auth/authService.ts - Fixed Version
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginCredentials, RegisterData, User, Agent } from '../types/auth';

// For now, we'll use local storage simulation
// Later, replace with real API calls

interface AuthResponse {
  success: boolean;
  user?: User | Agent;
  error?: string;
  token?: string;
}

class AuthService {
  private readonly USERS_KEY = 'realestate_users';
  private readonly AGENTS_KEY = 'realestate_agents';

  // Simulate API delay
  private delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Get stored users
  private async getStoredUsers(): Promise<User[]> {
    try {
      const users = await AsyncStorage.getItem(this.USERS_KEY);
      return users ? JSON.parse(users) : [];
    } catch {
      return [];
    }
  }

  // Get stored agents
  private async getStoredAgents(): Promise<Agent[]> {
    try {
      const agents = await AsyncStorage.getItem(this.AGENTS_KEY);
      return agents ? JSON.parse(agents) : [];
    } catch {
      return [];
    }
  }

  // Save users
  private async saveUsers(users: User[]): Promise<void> {
    await AsyncStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  // Save agents
  private async saveAgents(agents: Agent[]): Promise<void> {
    await AsyncStorage.setItem(this.AGENTS_KEY, JSON.stringify(agents));
  }

  // Login
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    await this.delay(1000); // Simulate network delay

    try {
      const { email, password, userType } = credentials;

      if (userType === 'user') {
        const users = await this.getStoredUsers();
        const user = users.find(u => u.email === email);

        if (!user) {
          return { success: false, error: 'User not found' };
        }

        // In real app, you'd verify password hash
        // For demo, we'll just check if password is not empty
        if (!password) {
          return { success: false, error: 'Invalid password' };
        }

        return { 
          success: true, 
          user,
          token: `user_token_${user.id}`
        };
      } else {
        const agents = await this.getStoredAgents();
        const agent = agents.find(a => a.email === email);

        if (!agent) {
          return { success: false, error: 'Agent not found' };
        }

        if (!password) {
          return { success: false, error: 'Invalid password' };
        }

        return { 
          success: true, 
          user: agent,
          token: `agent_token_${agent.id}`
        };
      }
    } catch (error) {
      return { success: false, error: 'Login failed' };
    }
  }

  // Register
  async register(data: RegisterData): Promise<AuthResponse> {
    await this.delay(1000); // Simulate network delay

    try {
      const { email, userType, firstName, lastName, phone } = data;

      // Check if email already exists
      const users = await this.getStoredUsers();
      const agents = await this.getStoredAgents();
      
      const emailExists = [...users, ...agents].some(u => u.email === email);
      
      if (emailExists) {
        return { success: false, error: 'Email already registered' };
      }

      const now = new Date();
      const id = `${userType}_${Date.now()}`;

      if (userType === 'user') {
        const newUser: User = {
          id,
          email,
          firstName,
          lastName,
          phone,
          userType: 'user',
          preferences: {
            budget: { min: 0, max: 100000000 },
            locations: [],
            propertyTypes: [],
            bedrooms: 1,
            bathrooms: 1,
          },
          savedProperties: [],
          searchHistory: [],
          createdAt: now,
          updatedAt: now,
        };

        const updatedUsers = [...users, newUser];
        await this.saveUsers(updatedUsers);

        return { 
          success: true, 
          user: newUser,
          token: `user_token_${newUser.id}`
        };
      } else {
        const newAgent: Agent = {
          id,
          email,
          firstName,
          lastName,
          phone,
          userType: 'agent',
          companyName: data.companyName || '',
          licenseNumber: data.licenseNumber || '',
          experience: data.experience || 0,
          specialization: [],
          rating: 0,
          reviewsCount: 0,
          verificationStatus: 'pending',
          properties: [],
          bio: data.bio || '',
          createdAt: now,
          updatedAt: now,
        };

        const updatedAgents = [...agents, newAgent];
        await this.saveAgents(updatedAgents);

        return { 
          success: true, 
          user: newAgent,
          token: `agent_token_${newAgent.id}`
        };
      }
    } catch (error) {
      return { success: false, error: 'Registration failed' };
    }
  }

  // Update Profile - Fixed to handle proper types
  async updateProfile(userId: string, data: Partial<User | Agent>): Promise<AuthResponse> {
    await this.delay(500);

    try {
      const users = await this.getStoredUsers();
      const agents = await this.getStoredAgents();

      const userIndex = users.findIndex(u => u.id === userId);
      const agentIndex = agents.findIndex(a => a.id === userId);

      if (userIndex !== -1) {
        // Update user
        const updatedUser: User = {
          ...users[userIndex],
          ...data,
          userType: 'user', // Ensure userType stays consistent
          updatedAt: new Date()
        } as User;
        
        const updatedUsers = [...users];
        updatedUsers[userIndex] = updatedUser;
        await this.saveUsers(updatedUsers);
        
        return { success: true, user: updatedUser };
      } else if (agentIndex !== -1) {
        // Update agent
        const updatedAgent: Agent = {
          ...agents[agentIndex],
          ...data,
          userType: 'agent', // Ensure userType stays consistent
          updatedAt: new Date()
        } as Agent;
        
        const updatedAgents = [...agents];
        updatedAgents[agentIndex] = updatedAgent;
        await this.saveAgents(updatedAgents);
        
        return { success: true, user: updatedAgent };
      }

      return { success: false, error: 'User not found' };
    } catch (error) {
      return { success: false, error: 'Update failed' };
    }
  }

  // Logout
  async logout(): Promise<void> {
    // Clear any tokens or session data
    await AsyncStorage.removeItem('auth_token');
  }

  // Validate email
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate phone
  validatePhone(phone: string): boolean {
    const phoneRegex = /^[0-9+\-\s()]{10,}$/;
    return phoneRegex.test(phone);
  }

  // Helper method to check if user exists
  async checkUserExists(email: string): Promise<boolean> {
    const users = await this.getStoredUsers();
    const agents = await this.getStoredAgents();
    return [...users, ...agents].some(u => u.email === email);
  }

  // Helper method to get user by ID
  async getUserById(userId: string): Promise<User | Agent | null> {
    const users = await this.getStoredUsers();
    const agents = await this.getStoredAgents();
    
    const user = users.find(u => u.id === userId);
    if (user) return user;
    
    const agent = agents.find(a => a.id === userId);
    if (agent) return agent;
    
    return null;
  }
}

export const authService = new AuthService();