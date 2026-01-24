import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '../layout/Navigation';
import { useToast } from '../../context/ToastContext';
import { Search, Loader2, Package, ArrowRight } from 'lucide-react';
import api from '../../config/api';

interface SearchResult {
  id: string;
  name: string;
  price: number;
  brand: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
}

export function AnalyzeProduct() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { success, error: showErrorToast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchResults([]);
    setError('');
    
    try {
      const params = new URLSearchParams({
        query: searchQuery
      });
      
      const response = await api.get(`/products/search?${params}`);
      console.log('✅ Search API Response:', response.data);
      setSearchResults(response.data);
      
      if (response.data.length === 0) {
        setError('No products found. Try a different search term.');
      } else {
        success(`Found ${response.data.length} products!`);
      }
    } catch (err: any) {
      console.error('Search failed:', err);
      setError(err.response?.data?.message || 'Failed to search products. Please try again.');
      showErrorToast('Search failed. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleAnalyze = async (product: SearchResult) => {
    setIsAnalyzing(true);
    setLoadingStatus('Initializing analysis...');
    
    try {
      // Call backend to start analysis
      const response = await api.post('/products/analyze', {
        productId: product.id,
        productName: product.name,
        brand: product.brand
      });

      // Simulate progress updates (you can implement WebSocket or polling for real-time updates)
      const statuses = [
        'Fetching product details...',
        'Analyzing reviews and ratings...',
        'Processing sentiment analysis...',
        'Comparing with similar products...',
        'Generating AI insights...',
        'Finalizing report...'
      ];

      for (const status of statuses) {
        setLoadingStatus(status);
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      // Navigate to results page with analysis data
      navigate('/result', { 
        state: { 
          analysisId: response.data.id,
          product 
        } 
      });
    } catch (err: any) {
      console.error('Analysis failed:', err);
      setError(err.response?.data?.message || 'Failed to analyze product. Please try again.');
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <Navigation />
      
      <div className="px-8 lg:px-16 py-10">
        {/* Header */}
        <div className="mb-12 pb-8 border-b border-slate-200/50 dark:border-slate-800/50">
          <h1 className="text-5xl font-extralight tracking-tight text-slate-900 dark:text-white mb-3">
            Analyze Products
          </h1>
          <p className="text-slate-400 dark:text-slate-500 text-lg">
            Get AI-powered insights in seconds
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Search Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              {error && (
                <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 text-sm">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSearch} className="space-y-6">
                <div>
                  <label htmlFor="searchQuery" className="block text-sm font-medium text-slate-400 dark:text-slate-500 mb-3 uppercase tracking-wider">
                    Search Product
                  </label>
                  <div className="relative">
                    <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      id="searchQuery"
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="e.g., Sony headphones..."
                      disabled={isSearching || isAnalyzing}
                      className="w-full pl-14 pr-6 py-4 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-300 dark:focus:ring-slate-700 focus:border-transparent disabled:bg-slate-50 dark:disabled:bg-slate-900 disabled:text-slate-400 bg-white dark:bg-slate-900 text-slate-900 dark:text-white transition-all text-base"
                      required
                    />
                  </div>
                  <p className="mt-3 text-xs text-slate-400 dark:text-slate-600">
                    Search across multiple retailers
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSearching || isAnalyzing}
                  className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-4 rounded-lg font-medium hover:scale-[1.02] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 text-base"
                >
                  {isSearching ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      Search
                    </>
                  )}
                </button>
              </form>

              {/* Examples */}
              {!isSearching && !isAnalyzing && searchResults.length === 0 && (
                <div className="mt-8 rounded-xl border border-slate-200 dark:border-slate-800 p-6 bg-white dark:bg-slate-900">
                  <h3 className="font-medium text-slate-900 dark:text-white mb-3 text-sm">Popular Searches</h3>
                  <div className="space-y-1">
                    {[
                      'Sony WH-1000XM5',
                      'MacBook Pro 16',
                      'Samsung Galaxy S24',
                      'iPhone 15 Pro',
                      'Dell XPS 15'
                    ].map((example) => (
                      <button
                        key={example}
                        onClick={() => {
                          setSearchQuery(example);
                          const form = document.querySelector('form');
                          if (form) {
                            form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
                          }
                        }}
                        className="block w-full text-left px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-all"
                      >
                        {example}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Product Results */}
          <div className="lg:col-span-2">
            {/* Loading State */}
            {isAnalyzing && (
              <div className="text-center py-16">
                <div className="inline-flex p-6 rounded-full bg-slate-100 dark:bg-slate-800 mb-6">
                  <Loader2 className="w-12 h-12 text-slate-400 dark:text-slate-600 animate-spin" />
                </div>
                <h3 className="text-2xl font-extralight text-slate-900 dark:text-white mb-2">
                  Analyzing Product
                </h3>
                <p className="text-slate-400 dark:text-slate-600 mb-12">{loadingStatus}</p>
                
                {/* Progress Steps */}
                <div className="max-w-md mx-auto space-y-3">
                  {[
                    'Fetching product details',
                    'Analyzing reviews',
                    'Processing sentiment',
                    'Comparing products',
                    'Generating insights'
                  ].map((step, index) => (
                    <div key={step} className="flex items-center gap-4">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                          loadingStatus.toLowerCase().includes(step.toLowerCase().split(' ')[0])
                            ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600'
                        }`}
                      >
                        {index + 1}
                      </div>
                      <span
                        className={`text-sm ${
                          loadingStatus.toLowerCase().includes(step.toLowerCase().split(' ')[0])
                            ? 'text-slate-900 dark:text-white font-medium'
                            : 'text-slate-400 dark:text-slate-600'
                        }`}
                      >
                        {step}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Search Results Grid */}
            {searchResults.length > 0 && !isAnalyzing && (
              <div>
                <h2 className="text-xl font-extralight text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-slate-400" />
                  Found {searchResults.length} Products
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {searchResults.map((product) => (
                    <div
                      key={product.id}
                      className="group relative border border-slate-200 dark:border-slate-800 rounded-lg hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-lg transition-all bg-white dark:bg-slate-900 overflow-hidden"
                    >
                      {/* Product Image */}
                      <div className="aspect-square bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center p-4">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      
                      {/* Product Info */}
                      <div className="p-3">
                        <h3 className="font-medium text-sm text-slate-900 dark:text-white mb-1 line-clamp-2 min-h-[2.5rem]">
                          {product.name}
                        </h3>
                        <p className="text-xs text-slate-400 dark:text-slate-600 mb-2">{product.brand}</p>
                        
                        {/* Price and Rating */}
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-lg font-extralight text-slate-900 dark:text-white">
                            ₹{typeof product.price === 'number' ? product.price.toFixed(2) : parseFloat(String(product.price) || '0').toFixed(2)}
                          </span>
                          <div className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-600">
                            <span className="text-yellow-500 dark:text-yellow-400">★</span>
                            <span>{typeof product.rating === 'number' && product.rating > 0 ? product.rating.toFixed(1) : 'N/A'}</span>
                          </div>
                        </div>
                        
                        {/* Reviews Count */}
                        <div className="text-xs text-slate-400 dark:text-slate-600 mb-3">
                          {typeof product.reviewCount === 'number' ? product.reviewCount.toLocaleString() : '0'} reviews
                        </div>
                        
                        {/* Analyze Button */}
                        <button
                          onClick={() => handleAnalyze(product)}
                          className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-2 rounded-lg text-sm font-medium hover:scale-[1.02] transition-all flex items-center justify-center gap-1.5"
                        >
                          Analyze
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {!isSearching && !isAnalyzing && searchResults.length === 0 && (
              <div className="text-center py-20">
                <div className="inline-flex p-8 rounded-full bg-slate-100 dark:bg-slate-800 mb-6">
                  <Search className="w-12 h-12 text-slate-300 dark:text-slate-700" />
                </div>
                <h3 className="text-2xl font-extralight text-slate-900 dark:text-white mb-2">
                  Start Your Search
                </h3>
                <p className="text-slate-400 dark:text-slate-600">
                  Enter a product name to find and analyze products
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
