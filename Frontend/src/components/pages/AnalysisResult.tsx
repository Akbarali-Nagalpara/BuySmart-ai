import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Navigation } from '../layout/Navigation';
import { ArrowLeft, CheckCircle, XCircle, TrendingUp, Award, Shield, Star, ThumbsUp, ThumbsDown, Loader2, Heart } from 'lucide-react';
import api from '../../config/api';
import { useToast } from '../../context/ToastContext';

interface AnalysisData {
  product: {
    id: string;
    name: string;
    brand: string;
    price: number;
    imageUrl: string;
    category: string;
  };
  overallScore: number;
  verdict: 'BUY' | 'NOT_BUY';
  scores: {
    sentiment: number;
    featureQuality: number;
    brandReliability: number;
    ratingReview: number;
    consistency: number;
  };
  insights: {
    positive: string[];
    negative: string[];
  };
  aiSummary: string;
}

export function AnalysisResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const { success, error: showError } = useToast();

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const { analysisId } = location.state || {};
        
        if (!analysisId) {
          setError('No analysis data found');
          setIsLoading(false);
          return;
        }

        const response = await api.get(`/analysis/${analysisId}`);
        setAnalysis(response.data);
        
        // Check if product is in wishlist
        checkWishlistStatus(response.data);
      } catch (err: any) {
        console.error('Failed to fetch analysis:', err);
        setError(err.response?.data?.message || 'Failed to load analysis results');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalysis();
  }, [location.state]);

  const checkWishlistStatus = async (analysisData: AnalysisData) => {
    try {
      const response = await api.get('/wishlist');
      const wishlist = response.data;
      const inWishlist = wishlist.some((item: any) => 
        item.productName === analysisData.product.name
      );
      setIsInWishlist(inWishlist);
    } catch (err) {
      console.error('Failed to check wishlist status:', err);
    }
  };

  const toggleWishlist = async () => {
    if (!analysis) return;

    if (isInWishlist) {
      // Remove from wishlist
      try {
        const response = await api.get('/wishlist');
        const wishlist = response.data;
        const item = wishlist.find((item: any) => 
          item.productName === analysis.product.name
        );
        
        if (item) {
          await api.delete(`/wishlist/${item.id}`);
          setIsInWishlist(false);
          success('Removed from wishlist');
        }
      } catch (err) {
        console.error('Failed to remove from wishlist:', err);
        showError('Failed to remove from wishlist');
      }
    } else {
      // Add to wishlist
      setIsAddingToWishlist(true);
      try {
        const wishlistItem = {
          productId: analysis.product.id ||'',
          productName: analysis.product.name,
          brand: analysis.product.brand,
          currentPrice: analysis.product.price || 0,
          imageUrl: analysis.product.imageUrl,
          analysisId: location.state?.analysisId || '',
          score: analysis.overallScore,
          verdict: analysis.verdict
        };

        console.log('=== ADDING TO WISHLIST ===');
        console.log('Wishlist item:', wishlistItem);
        console.log('Product ID:', wishlistItem.productId);
        console.log('Product Name:', wishlistItem.productName);
        
        const response = await api.post('/wishlist', wishlistItem);
        console.log('Wishlist add response:', response.data);
        
        setIsInWishlist(true);
        success('Added to wishlist');
      } catch (err: any) {
        console.error('Failed to add to wishlist:', err);
        console.error('Error response:', err.response?.data);
        console.error('Error status:', err.response?.status);
        showError(err.response?.data?.message || 'Failed to add to wishlist');
      } finally {
        setIsAddingToWishlist(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <Navigation />
        <div className="px-8 lg:px-16 py-8">
          <div className="flex flex-col items-center justify-center h-96">
            <Loader2 className="w-12 h-12 text-slate-600 animate-spin mb-4" />
            <p className="text-slate-600 dark:text-slate-400">Loading analysis results...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <Navigation />
        <div className="px-8 lg:px-16 py-8">
          <div className="bg-white dark:bg-slate-800 border border-red-200 dark:border-red-800 rounded-lg p-8 text-center">
            <XCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Error Loading Results</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">{error || 'Analysis data not found'}</p>
            <button
              onClick={() => navigate('/analyze')}
              className="bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 px-6 py-2.5 rounded-lg font-medium transition-all hover:scale-[1.02]"
            >
              Start New Analysis
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Navigation />
      
      <div className="px-8 lg:px-16 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/analyze')}
          className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Analyze Another Product
        </button>

        {/* Product Header */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-8 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Product Image */}
            <div className="lg:col-span-4">
              <div className="relative">
                <img
                  src={analysis.product.imageUrl}
                  alt={analysis.product.name}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/400x400?text=No+Image';
                  }}
                  className="w-full aspect-square object-contain bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-8"
                />
                {/* Wishlist Button */}
                <button
                  onClick={toggleWishlist}
                  disabled={isAddingToWishlist}
                  className={`absolute top-4 right-4 p-3 rounded-full transition-all ${
                    isInWishlist
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-white dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/30 text-slate-400 hover:text-red-500 border border-slate-200 dark:border-slate-700'
                  } disabled:opacity-50`}
                  title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  {isAddingToWishlist ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <Heart className={`w-6 h-6 ${isInWishlist ? 'fill-current' : ''}`} />
                  )}
                </button>
              </div>
              <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-700">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{analysis.product.category || 'Electronics'}</p>
                <p className="text-lg font-semibold text-slate-900 dark:text-white">{analysis.product.brand || 'N/A'}</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                  {analysis.product.price && analysis.product.price > 0 
                    ? `₹${typeof analysis.product.price === 'number' 
                        ? analysis.product.price.toLocaleString('en-IN', {maximumFractionDigits: 0}) 
                        : analysis.product.price}` 
                    : 'Price N/A'}
                </p>
              </div>
            </div>

            {/* Product Info */}
            <div className="lg:col-span-8">
              <h1 className="text-4xl font-extralight text-slate-900 dark:text-white mb-8">
                {analysis.product.name}
              </h1>

              {/* Overall Score */}
              <div className="bg-slate-50 dark:bg-slate-700/30 rounded-lg p-8 mb-6 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-6">
                  {analysis.verdict === 'BUY' ? (
                    <CheckCircle className="w-16 h-16 text-green-600" />
                  ) : (
                    <XCircle className="w-16 h-16 text-red-600" />
                  )}
                  <div>
                    <div className="text-6xl font-extralight text-slate-900 dark:text-white mb-2">
                      {analysis.overallScore || 0}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 font-medium">
                      Overall Score
                    </div>
                    <span
                      className={`px-6 py-2 rounded-lg text-lg font-medium ${
                        analysis.verdict === 'BUY'
                          ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
                          : 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
                      }`}
                    >
                      {analysis.verdict || 'N/A'}
                    </span>
                  </div>
                </div>
                <p className="mt-6 text-slate-600 dark:text-slate-400 leading-relaxed">
                  {analysis.aiSummary || 'No summary available'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-8 mb-8">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-8 flex items-center gap-3">
            <Award className="w-7 h-7 text-slate-600" />
            Detailed Analysis
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Sentiment Score */}
            <div className="p-6 bg-slate-50 dark:bg-slate-700/30 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ThumbsUp className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  <span className="font-medium text-slate-900 dark:text-white">Sentiment</span>
                </div>
                <span className="text-2xl font-bold text-slate-900 dark:text-white">{analysis.scores?.sentiment || 0}</span>
              </div>
              <div className="bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-slate-900 dark:bg-white h-full transition-all duration-1000"
                  style={{ width: `${analysis.scores?.sentiment || 0}%` }}
                />
              </div>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                Customer satisfaction based on review sentiment
              </p>
            </div>

            {/* Feature Quality */}
            <div className="p-6 bg-slate-50 dark:bg-slate-700/30 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  <span className="font-medium text-slate-900 dark:text-white">Features</span>
                </div>
                <span className="text-2xl font-bold text-slate-900 dark:text-white">{analysis.scores?.featureQuality || 0}</span>
              </div>
              <div className="bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-slate-900 dark:bg-white h-full transition-all duration-1000"
                  style={{ width: `${analysis.scores?.featureQuality || 0}%` }}
                />
              </div>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                Quality and performance of product features
              </p>
            </div>

            {/* Brand Reliability */}
            <div className="p-6 bg-slate-50 dark:bg-slate-700/30 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  <span className="font-medium text-slate-900 dark:text-white">Reliability</span>
                </div>
                <span className="text-2xl font-bold text-slate-900 dark:text-white">{analysis.scores?.brandReliability || 0}</span>
              </div>
              <div className="bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-slate-900 dark:bg-white h-full transition-all duration-1000"
                  style={{ width: `${analysis.scores?.brandReliability || 0}%` }}
                />
              </div>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                Brand reputation and product reliability
              </p>
            </div>

            {/* Rating & Reviews */}
            <div className="p-6 bg-slate-50 dark:bg-slate-700/30 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  <span className="font-medium text-slate-900 dark:text-white">Ratings</span>
                </div>
                <span className="text-2xl font-bold text-slate-900 dark:text-white">{analysis.scores?.ratingReview || 0}</span>
              </div>
              <div className="bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-yellow-600 dark:bg-yellow-500 h-full transition-all duration-1000"
                  style={{ width: `${analysis.scores?.ratingReview || 0}%` }}
                />
              </div>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                Aggregate score from ratings and reviews
              </p>
            </div>

            {/* Consistency */}
            <div className="p-6 bg-slate-50 dark:bg-slate-700/30 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  <span className="font-medium text-slate-900 dark:text-white">Consistency</span>
                </div>
                <span className="text-2xl font-bold text-slate-900 dark:text-white">{analysis.scores?.consistency || 0}</span>
              </div>
              <div className="bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-slate-900 dark:bg-white h-full transition-all duration-1000"
                  style={{ width: `${analysis.scores?.consistency || 0}%` }}
                />
              </div>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                Product quality consistency across batches
              </p>
            </div>
          </div>
        </div>

        {/* Review Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Positive Insights */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <ThumbsUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">What Users Like</h3>
            </div>
            {analysis.insights?.positive && analysis.insights.positive.length > 0 ? (
              <ul className="space-y-3">
                {analysis.insights.positive.map((point, index) => (
                  <li key={index} className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-100 dark:border-green-900/20">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300">{point}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-500 dark:text-slate-400 text-center py-4">No positive insights available</p>
            )}
          </div>

          {/* Negative Insights */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                <ThumbsDown className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Common Complaints</h3>
            </div>
            {analysis.insights?.negative && analysis.insights.negative.length > 0 ? (
              <ul className="space-y-3">
                {analysis.insights.negative.map((point, index) => (
                  <li key={index} className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-100 dark:border-red-900/20">
                    <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300">{point}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-500 dark:text-slate-400 text-center py-4">No complaints reported</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
