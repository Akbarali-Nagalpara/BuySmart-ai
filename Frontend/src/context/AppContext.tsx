import { createContext, useContext, useState, ReactNode } from 'react';
import { Screen, ProductAnalysis } from '../types';

interface AppContextType {
  currentScreen: Screen;
  setCurrentScreen: (screen: Screen) => void;
  currentAnalysis: ProductAnalysis | null;
  setCurrentAnalysis: (analysis: ProductAnalysis | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  recentSearches: string[];
  addRecentSearch: (query: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [currentAnalysis, setCurrentAnalysis] = useState<ProductAnalysis | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'iPhone 15 Pro',
    'Sony WH-1000XM5',
    'MacBook Pro M3',
  ]);

  const addRecentSearch = (query: string) => {
    setRecentSearches(prev => {
      const filtered = prev.filter(q => q !== query);
      return [query, ...filtered].slice(0, 5);
    });
  };

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        currentAnalysis,
        setCurrentAnalysis,
        searchQuery,
        setSearchQuery,
        recentSearches,
        addRecentSearch,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
