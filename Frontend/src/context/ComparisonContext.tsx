import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import api from '../config/api';

interface ComparisonProduct {
  analysisId: string;
  id: string;
  name: string;
  brand: string;
  price: number;
  imageUrl: string;
  score: number;
  verdict: string;
}

interface ComparisonContextType {
  comparisonList: ComparisonProduct[];
  addToComparison: (product: ComparisonProduct) => void;
  removeFromComparison: (analysisId: string) => void;
  clearComparison: () => void;
  isInComparison: (analysisId: string) => boolean;
  comparisonCount: number;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export function ComparisonProvider({ children }: { children: React.ReactNode }) {
  const [comparisonList, setComparisonList] = useState<ComparisonProduct[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('comparison_list');
    if (saved) {
      try {
        setComparisonList(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load comparison list:', error);
      }
    }
  }, []);

  // Save to localStorage whenever list changes
  useEffect(() => {
    localStorage.setItem('comparison_list', JSON.stringify(comparisonList));
  }, [comparisonList]);

  const addToComparison = useCallback((product: ComparisonProduct) => {
    setComparisonList((prev) => {
      // Check if already in list
      if (prev.some((p) => p.analysisId === product.analysisId)) {
        return prev;
      }
      // Max 4 products
      if (prev.length >= 4) {
        return prev;
      }
      return [...prev, product];
    });
  }, []);

  const removeFromComparison = useCallback((analysisId: string) => {
    setComparisonList((prev) => prev.filter((p) => p.analysisId !== analysisId));
  }, []);

  const clearComparison = useCallback(() => {
    setComparisonList([]);
  }, []);

  const isInComparison = useCallback(
    (analysisId: string) => {
      return comparisonList.some((p) => p.analysisId === analysisId);
    },
    [comparisonList]
  );

  const value: ComparisonContextType = {
    comparisonList,
    addToComparison,
    removeFromComparison,
    clearComparison,
    isInComparison,
    comparisonCount: comparisonList.length,
  };

  return <ComparisonContext.Provider value={value}>{children}</ComparisonContext.Provider>;
}

export function useComparison() {
  const context = useContext(ComparisonContext);
  if (context === undefined) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
}
