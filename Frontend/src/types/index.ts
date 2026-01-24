export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  imageUrl: string;
  price: number;
}

export interface ScoreData {
  overall: number;
  sentiment: number;
  featureQuality: number;
  brandReliability: number;
  ratingReview: number;
  consistency: number;
}

export interface ReviewInsights {
  positive: string[];
  negative: string[];
}

export interface ProductAnalysis {
  product: Product;
  scores: ScoreData;
  verdict: 'BUY' | 'NOT_BUY';
  confidence: 'Low' | 'Medium' | 'High';
  reviewInsights: ReviewInsights;
  aiSummary: string;
}

export type Screen = 'home' | 'loading' | 'dashboard' | 'comparison';
