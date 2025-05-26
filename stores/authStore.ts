import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User, LoginCredentials, RegisterData } from "@/types/api";
import { login, register } from "@/api/client";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  continueAsGuest: () => void;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isGuest: false,
      isLoading: false,
      error: null,
      
      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });
        try {
          const user = await login(credentials);
          set({ 
            user, 
            isAuthenticated: true, 
            isGuest: false, 
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : "Login failed", 
            isLoading: false 
          });
        }
      },
      
      register: async (userData: RegisterData) => {
        set({ isLoading: true, error: null });
        try {
          const user = await register(userData);
          set({ 
            user, 
            isAuthenticated: true, 
            isGuest: false, 
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : "Registration failed", 
            isLoading: false 
          });
        }
      },
      
      continueAsGuest: () => {
        set({ 
          user: null, 
          isAuthenticated: false, 
          isGuest: true 
        });
      },
      
      logout: () => {
        set({ 
          user: null, 
          isAuthenticated: false, 
          isGuest: false 
        });
      },
      
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);