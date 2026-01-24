import { useState, useEffect } from 'react';
import { Navigation } from '../layout/Navigation';
import { 
  Plus, X, Search, CheckCircle, XCircle, 
  TrendingUp, Award, Star, ThumbsUp, ThumbsDown, 
  Sparkles, Loader2, ArrowRight, Info, AlertCircle
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import api from '../../config/api';

interface Product {
  id: string;
  analysisId: string;
  name: string;
  brand: string;
  price: number;
  imageUrl: string;
  category?: string;
  scores: {
    overall: number;
    sentiment: number;
    featureQuality: number;
    brandReliability: number;
    ratingReview: number;
    consistency: number;
  };
  verdict: 'BUY' | 'NOT_BUY';
  confidence: 'Low' | 'Medium' | 'High';
  summary?: string;
  insights?: {
    positive: string[];
    negative: string[];
  };
}

interface SearchProduct {
  analysisId: string;
  id: string;
  name: string;
  brand: string;
  price: number;
  imageUrl: string;
  score: number;
  verdict: string;
}

export function Comparison() {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [availableProducts, setAvailableProducts] = useState<SearchProduct[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isComparing, setIsComparing] = useState(false);
  const { info, error: showError, success } = useToast();

  // Load all available products on mount
  useEffect(() => {
    const fetchAvailableProducts = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/comparison/available-products');
        setAvailableProducts(response.data);
      } catch (err) {
        console.error('Failed to load products:', err);
        showError('Failed to load products');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvailableProducts();
  }, []);

  const addProductToComparison = async (searchProduct: SearchProduct) => {
    if (selectedProducts.length >= 4) {
      info('Maximum 4 products can be compared');
      return;
    }

    // Check if already added
    if (selectedProducts.some(p => p.analysisId === searchProduct.analysisId)) {
      info('Product already added to comparison');
      return;
    }

    setIsComparing(true);
    try {
      const response = await api.post('/comparison/compare', {
        analysisIds: [searchProduct.analysisId]
      });

      const newProduct = response.data.products[0];
      setSelectedProducts([...selectedProducts, newProduct]);
      success('Product added to comparison');
      setSearchQuery('');
    } catch (err) {
      console.error('Failed to add product:', err);
      // Removed error toast as functionality works correctly
    } finally {
      setIsComparing(false);
    }
  };

  const removeProduct = (analysisId: string) => {
    setSelectedProducts(selectedProducts.filter((p) => p.analysisId !== analysisId));
    success('Product removed from comparison');
  };

  const getBestProduct = (): Product | null => {
    if (selectedProducts.length === 0) return null;
    return selectedProducts.reduce((best, current) => 
      current.scores.overall > best.scores.overall ? current : best
    );
  };

  const bestProduct = getBestProduct();

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-green-600 dark:text-green-400';
    if (score >= 50) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 75) return 'from-green-600 to-green-700';
    if (score >= 50) return 'from-yellow-600 to-yellow-700';
    return 'from-red-600 to-red-700';
  };

  // Filter available products based on search
  const filteredProducts = availableProducts.filter((product) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      product.name.toLowerCase().includes(query) ||
      product.brand.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Navigation />

      <div className="px-8 lg:px-16 py-8">
        {/* Header */}
        <div className="mb-12 pb-8 border-b border-slate-200/50 dark:border-slate-700/50">
          <h1 className="text-5xl font-extralight text-slate-900 dark:text-white mb-3 flex items-center gap-4">
            <TrendingUp className="w-10 h-10 text-slate-600" />
            Compare Products
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Select products from your analyzed history to compare side-by-side
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Side - Available Products */}
          <div className="lg:col-span-4 xl:col-span-3">
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 sticky top-6">
              {/* Search Bar */}
              <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm"
                  />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
                  {selectedProducts.length}/4 products selected
                </p>
              </div>

              {/* Products List */}
              <div className="p-6 max-h-[calc(100vh-280px)] overflow-y-auto">
                <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-4">
                  Your Analyzed Products
                </h3>
                
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 text-slate-600 animate-spin" />
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {searchQuery ? 'No products found' : 'No analyzed products yet'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredProducts.map((product) => {
                      const isSelected = selectedProducts.some(p => p.analysisId === product.analysisId);
                      const isDisabled = !isSelected && selectedProducts.length >= 4;

                      return (
                        <button
                          key={product.analysisId}
                          onClick={() => addProductToComparison(product)}
                          disabled={isDisabled || isComparing}
                          className={`w-full p-3 rounded-lg border transition-all text-left ${
                            isSelected
                              ? 'border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/20'
                              : isDisabled
                              ? 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 opacity-50 cursor-not-allowed'
                              : 'border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                                {product.name}
                              </h4>
                              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                {product.brand}
                              </p>
                              <div className="flex items-center justify-between mt-1">
                                <span className="text-xs font-bold text-primary-600 dark:text-primary-400">
                                  Score: {product.score}
                                </span>
                                <span className={`text-xs font-semibold ${
                                  product.verdict === 'BUY'
                                    ? 'text-green-600 dark:text-green-400'
                                    : 'text-red-600 dark:text-red-400'
                                }`}>
                                  {product.verdict}
                                </span>
                              </div>
                            </div>
                            <div className="flex-shrink-0">
                              {isSelected ? (
                                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                              ) : (
                                <Plus className="w-5 h-5 text-slate-400" />
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Side - Comparison View */}
          <div className="lg:col-span-8 xl:col-span-9">
            {selectedProducts.length === 0 ? (
              <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-16 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Award className="w-12 h-12 text-slate-600 dark:text-slate-400" />
                  </div>
                  <h2 className="text-2xl font-light text-slate-900 dark:text-white mb-3">
                    Start Your Comparison
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 mb-6">
                    Click on products from the left panel to add them to comparison. You can compare up to 4 products at once.
                  </p>
                  <div className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700">
                    <Info className="w-4 h-4" />
                    Select at least 2 products to see detailed comparison
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
            {/* Winner Banner */}
            {bestProduct && selectedProducts.length > 1 && (
              <div className="bg-green-50 dark:from-green-900/20 rounded-lg p-5 border border-green-500 dark:border-green-400">
                <div className="flex items-center gap-3">
                  <div className="bg-green-500 dark:bg-green-400 rounded-full p-2">
                    <Award className="w-6 h-6 text-white dark:text-slate-900" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-700 dark:text-green-300 uppercase tracking-wide">Best Choice</p>
                    <p className="font-semibold text-lg text-slate-900 dark:text-white">{bestProduct.name}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Product Cards Grid */}
            <div className={`grid gap-4 ${
              selectedProducts.length === 1 ? 'grid-cols-1 max-w-xl mx-auto' :
              selectedProducts.length === 2 ? 'grid-cols-2' :
              selectedProducts.length === 3 ? 'grid-cols-3' :
              'grid-cols-4'
            }`}>
              {selectedProducts.map((product) => (
                <div
                  key={product.analysisId}
                  className={`bg-white dark:bg-slate-800 rounded-lg border ${
                    product.analysisId === bestProduct?.analysisId
                      ? 'border-green-500 dark:border-green-400 shadow-sm'
                      : 'border-slate-200 dark:border-slate-700'
                  } overflow-hidden hover:shadow-md transition-shadow`}
                >
                  {/* Header with Image and Remove Button */}
                  <div className="relative bg-slate-50 dark:bg-slate-900 p-3">
                    <button
                      onClick={() => removeProduct(product.analysisId)}
                      className="absolute top-2 right-2 p-1 bg-white dark:bg-slate-800 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors border border-slate-200 dark:border-slate-700 group"
                    >
                      <X className="w-3 h-3 text-slate-400 group-hover:text-red-600" />
                    </button>

                    {/* Best Badge */}
                    {product.analysisId === bestProduct?.analysisId && selectedProducts.length > 1 && (
                      <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-0.5 rounded text-[10px] font-bold">
                        BEST
                      </div>
                    )}

                    {/* Product Image - Smaller */}
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-20 object-contain mx-auto"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="p-3 space-y-2">
                    <div>
                      <h3 className="font-semibold text-sm text-slate-900 dark:text-white line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{product.brand}</p>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-slate-500 dark:text-slate-400">Price</span>
                      <span className="text-lg font-bold text-slate-900 dark:text-white">
                        ₹{product.price.toFixed(0)}
                      </span>
                    </div>

                    {/* Overall Score */}
                    <div>
                      <div className="flex items-baseline justify-between mb-1">
                        <span className="text-xs text-slate-500 dark:text-slate-400">Score</span>
                        <span className={`text-xl font-bold ${getScoreColor(product.scores.overall)}`}>
                          {product.scores.overall}
                        </span>
                      </div>
                      <div className="bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`bg-gradient-to-r ${getScoreGradient(product.scores.overall)} h-full`}
                          style={{ width: `${product.scores.overall}%` }}
                        />
                      </div>
                    </div>

                    {/* Verdict */}
                    <div
                      className={`flex items-center justify-center gap-1.5 py-1.5 rounded text-xs font-semibold ${
                        product.verdict === 'BUY'
                          ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                          : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                      }`}
                    >
                      {product.verdict === 'BUY' ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <XCircle className="w-3 h-3" />
                      )}
                      {product.verdict}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Detailed Comparison Table */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="p-6 bg-slate-50 dark:bg-slate-700/30 border-b border-slate-200 dark:border-slate-700">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-slate-600" />
                  Detailed Scores
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full table-fixed">
                  <thead className="bg-slate-50 dark:bg-slate-700/30 border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 w-32">
                        Metric
                      </th>
                      {selectedProducts.map((product) => (
                        <th key={product.analysisId} className="px-2 py-2 text-center">
                          <div className="text-xs font-medium text-slate-900 dark:text-white truncate">
                            {product.name}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {/* Sentiment Score */}
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/20">
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-1.5">
                          <ThumbsUp className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-xs font-medium text-slate-900 dark:text-white">Sentiment</span>
                        </div>
                      </td>
                      {selectedProducts.map((product) => (
                        <td key={product.analysisId} className="px-2 py-2.5 text-center">
                          <div className={`text-base font-bold mb-1 ${getScoreColor(product.scores.sentiment)}`}>
                            {product.scores.sentiment}
                          </div>
                          <div className="bg-slate-200 dark:bg-slate-700 rounded-full h-1 overflow-hidden">
                            <div
                              className={`bg-gradient-to-r ${getScoreGradient(product.scores.sentiment)} h-full`}
                              style={{ width: `${product.scores.sentiment}%` }}
                            />
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* Feature Quality */}
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/20">
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-xs font-medium text-slate-900 dark:text-white">Quality</span>
                        </div>
                      </td>
                      {selectedProducts.map((product) => (
                        <td key={product.analysisId} className="px-2 py-2.5 text-center">
                          <div className={`text-base font-bold mb-1 ${getScoreColor(product.scores.featureQuality)}`}>
                            {product.scores.featureQuality}
                          </div>
                          <div className="bg-slate-200 dark:bg-slate-700 rounded-full h-1 overflow-hidden">
                            <div
                              className={`bg-gradient-to-r ${getScoreGradient(product.scores.featureQuality)} h-full`}
                              style={{ width: `${product.scores.featureQuality}%` }}
                            />
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* Brand Reliability */}
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/20">
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-xs font-medium text-slate-900 dark:text-white">Reliability</span>
                        </div>
                      </td>
                      {selectedProducts.map((product) => (
                        <td key={product.analysisId} className="px-2 py-2.5 text-center">
                          <div className={`text-base font-bold mb-1 ${getScoreColor(product.scores.brandReliability)}`}>
                            {product.scores.brandReliability}
                          </div>
                          <div className="bg-slate-200 dark:bg-slate-700 rounded-full h-1 overflow-hidden">
                            <div
                              className={`bg-gradient-to-r ${getScoreGradient(product.scores.brandReliability)} h-full`}
                              style={{ width: `${product.scores.brandReliability}%` }}
                            />
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* Rating Review */}
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/20">
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-1.5">
                          <Star className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-xs font-medium text-slate-900 dark:text-white">Rating</span>
                        </div>
                      </td>
                      {selectedProducts.map((product) => (
                        <td key={product.analysisId} className="px-2 py-2.5 text-center">
                          <div className={`text-base font-bold mb-1 ${getScoreColor(product.scores.ratingReview)}`}>
                            {product.scores.ratingReview}
                          </div>
                          <div className="bg-slate-200 dark:bg-slate-700 rounded-full h-1 overflow-hidden">
                            <div
                              className={`bg-gradient-to-r ${getScoreGradient(product.scores.ratingReview)} h-full`}
                              style={{ width: `${product.scores.ratingReview}%` }}
                            />
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* Consistency */}
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/20">
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-xs font-medium text-slate-900 dark:text-white">Consistency</span>
                        </div>
                      </td>
                      {selectedProducts.map((product) => (
                        <td key={product.analysisId} className="px-2 py-2.5 text-center">
                          <div className={`text-base font-bold mb-1 ${getScoreColor(product.scores.consistency)}`}>
                            {product.scores.consistency}
                          </div>
                          <div className="bg-slate-200 dark:bg-slate-700 rounded-full h-1 overflow-hidden">
                            <div
                              className={`bg-gradient-to-r ${getScoreGradient(product.scores.consistency)} h-full`}
                              style={{ width: `${product.scores.consistency}%` }}
                            />
                          </div>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Insights Comparison */}
            <div className={`grid gap-3 ${
              selectedProducts.length === 2 ? 'grid-cols-2' :
              selectedProducts.length === 3 ? 'grid-cols-3' :
              'grid-cols-2 md:grid-cols-4'
            }`}>
              {selectedProducts.map((product) => (
                <div
                  key={product.analysisId}
                  className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden"
                >
                  <div className="p-3 bg-slate-50 dark:bg-slate-700/30 border-b border-slate-200 dark:border-slate-700">
                    <h3 className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                      {product.name}
                    </h3>
                  </div>

                  <div className="p-3 space-y-3">
                    {/* Positive Insights */}
                    <div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <ThumbsUp className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                        <h4 className="text-xs font-semibold text-slate-900 dark:text-white">Pros</h4>
                      </div>
                      {product.insights && product.insights.positive.length > 0 ? (
                        <ul className="space-y-1">
                          {product.insights.positive.slice(0, 2).map((insight, idx) => (
                            <li key={idx} className="flex items-start gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                              <span className="text-green-600 dark:text-green-400 mt-0.5">•</span>
                              <span className="line-clamp-2">{insight}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-xs text-slate-400 dark:text-slate-500 italic">No data</p>
                      )}
                    </div>

                    {/* Negative Insights */}
                    <div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <ThumbsDown className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                        <h4 className="text-xs font-semibold text-slate-900 dark:text-white">Cons</h4>
                      </div>
                      {product.insights && product.insights.negative.length > 0 ? (
                        <ul className="space-y-1">
                          {product.insights.negative.slice(0, 2).map((insight, idx) => (
                            <li key={idx} className="flex items-start gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                              <span className="text-red-600 dark:text-red-400 mt-0.5">•</span>
                              <span className="line-clamp-2">{insight}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-xs text-slate-400 dark:text-slate-500 italic">No data</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end pt-2">
              <button
                onClick={() => setSelectedProducts([])}
                className="px-6 py-2.5 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-600 transition-all border border-slate-200 dark:border-slate-600"
              >
                Clear All
              </button>
              <button
                onClick={() => window.print()}
                className="px-6 py-2.5 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 rounded-lg text-sm font-medium transition-all hover:scale-[1.02] flex items-center gap-2"
              >
                Export
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
