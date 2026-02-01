import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../config/api';
import { supabase } from '../supabaseClient';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      // Check if user is logged in on mount
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      const googleAuthProcessed = sessionStorage.getItem('googleAuthProcessed');
      
      if (token && savedUser) {
        setUser(JSON.parse(savedUser));
        setIsLoading(false);
        return;
      }

      // Check for active Supabase session (Google OAuth)
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user && !googleAuthProcessed) {
        // Mark as processing to prevent loops
        sessionStorage.setItem('googleAuthProcessed', 'true');
        
        const googleUser = session.user;
        
        try {
          // Register/login user in our backend
          const response = await api.post('/auth/google', {
            email: googleUser.email,
            name: googleUser.user_metadata?.full_name || googleUser.email?.split('@')[0] || 'User',
            googleId: googleUser.id
          });
          
          const { token: jwtToken, user: userData } = response.data;
          
          // Store token and user data
          localStorage.setItem('token', jwtToken);
          localStorage.setItem('user', JSON.stringify(userData));
          setUser(userData);
          
          // Sign out from Supabase after syncing with backend
          await supabase.auth.signOut();
          sessionStorage.removeItem('googleAuthProcessed');
          
          // Redirect to dashboard
          window.location.href = '/dashboard';
        } catch (error) {
          console.error('Failed to register Google user:', error);
          sessionStorage.removeItem('googleAuthProcessed');
          await supabase.auth.signOut();
        }
      }
      
      setIsLoading(false);
    };

    initAuth();

    // Listen for Supabase auth changes (Google OAuth)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const googleAuthProcessed = sessionStorage.getItem('googleAuthProcessed');
        
        if (event === 'SIGNED_IN' && session?.user && !googleAuthProcessed) {
          // Mark as processing
          sessionStorage.setItem('googleAuthProcessed', 'true');
          
          const googleUser = session.user;
          
          try {
            // Register/login user in our backend
            const response = await api.post('/auth/google', {
              email: googleUser.email,
              name: googleUser.user_metadata?.full_name || googleUser.email?.split('@')[0] || 'User',
              googleId: googleUser.id
            });
            
            const { token: jwtToken, user: userData } = response.data;
            
            // Store token and user data
            localStorage.setItem('token', jwtToken);
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            
            // Sign out from Supabase after syncing
            await supabase.auth.signOut();
            sessionStorage.removeItem('googleAuthProcessed');
            
            // Redirect to dashboard
            window.location.href = '/dashboard';
          } catch (error) {
            console.error('Failed to register Google user:', error);
            sessionStorage.removeItem('googleAuthProcessed');
            await supabase.auth.signOut();
          }
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user: userData } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } catch (error: any) {
      console.error('Login failed:', error);
      throw new Error(error.response?.data?.message || 'Invalid credentials');
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await api.post('/auth/register', { name, email, password });
      const { token, user: userData } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } catch (error: any) {
      console.error('Registration failed:', error);
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  const loginWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      
      if (error) throw error;
    } catch (error: any) {
      console.error('Google login failed:', error);
      throw new Error(error.message || 'Failed to login with Google');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('googleAuthProcessed');
    setUser(null);
    // Also sign out from Supabase
    supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      loginWithGoogle,
      logout,
      isAuthenticated: !!user,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
