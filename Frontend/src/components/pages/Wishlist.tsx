import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '../layout/Navigation';
import { Heart, Trash2, Eye, Sparkles, Loader2, Award, CheckCircle, XCircle, Search, X } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import api from '../../config/api';

interface WishlistItem {
  id: string;
  productName: string;
  brand: string;
  currentPrice: number;
  originalPrice: number;
  imageUrl: string;
  rating: number;
  score?: number;
  verdict?: 'BUY' | 'NOT_BUY';
  addedDate: string;
  analysisId?: string;
}

export function Wishlist() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVerdict, setFilterVerdict] = useState<'ALL' | 'BUY' | 'NOT_BUY'>('ALL');
  const [deleteModal, setDeleteModal] = useState<{ id: string; name: string } | null>(null);
  const navigate = useNavigate();
  const { success, error: showError } = useToast();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      console.log('=== FETCHING WISHLIST ===');
      console.log('Token:', localStorage.getItem('token'));
      console.log('User:', localStorage.getItem('user'));
      
      const response = await api.get('/wishlist');
      console.log('Wishlist API response status:', response.status);
      console.log('Wishlist response data:', response.data);
      console.log('Wishlist response type:', Array.isArray(response.data) ? 'Array' : typeof response.data);
      console.log('Wishlist items count:', response.data?.length || 0);
      
      setWishlist(response.data);
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
      }
      showError('Failed to load wishlist');
    } finally {
      setIsLoading(false);
    }
  };

  const openDeleteModal = (itemId: string, productName: string) => {
    setDeleteModal({ id: itemId, name: productName });
  };

  const closeDeleteModal = () => {
    setDeleteModal(null);
  };

  const removeFromWishlist = async () => {
    if (!deleteModal) return;

    const { id, name } = deleteModal;
    setDeletingId(id);
    closeDeleteModal();

    try {
      await api.delete(`/wishlist/${id}`);
      setWishlist(wishlist.filter((item) => item.id !== id));
      success('Removed from wishlist');
    } catch (error) {
      console.error('Failed to remove item:', error);
      showError('Failed to remove item');
    } finally {
      setDeletingId(null);
    }
  };

  const viewAnalysis = (item: WishlistItem) => {
    if (item.analysisId) {
      navigate('/result', { state: { analysisId: item.analysisId } });
    } else {
      navigate('/analyze', { state: { productUrl: item.productName } });
    }
  };

  // Filter wishlist based on search and verdict
  const filteredWishlist = wishlist.filter((item) => {
    const matchesSearch = !searchQuery.trim() || 
      item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesVerdict = filterVerdict === 'ALL' || item.verdict === filterVerdict;
    
    return matchesSearch && matchesVerdict;
  });

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <Navigation />
        <div className="lg:ml-64 pt-16 lg:pt-0">
        <div className="px-4 md:px-8 lg:px-12 py-6 md:py-8">
          <div className="flex flex-col items-center justify-center h-96 gap-4">
            <Loader2 className="w-12 h-12 text-slate-600 animate-spin" />
            <p className="text-sm text-slate-500 dark:text-slate-400">Loading your wishlist...</p>
          </div>
        </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Navigation />

      <div className="lg:ml-64 pt-16 lg:pt-0">
      <div className="px-4 md:px-8 lg:px-12 py-6 md:py-8">
        {/* Header */}
        <div className="mb-12 pb-8 border-b border-slate-200/50 dark:border-slate-700/50">
          <h1 className="text-5xl font-extralight text-slate-900 dark:text-white mb-3 flex items-center gap-4">
            <Heart className="w-10 h-10 text-red-500" />
            My Wishlist
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            {wishlist.length > 0 ? (
              <>{wishlist.length} {wishlist.length === 1 ? 'product' : 'products'} saved • Track your favorite products</>
            ) : (
              'Save products to track and compare later'
            )}
          </p>
        </div>

        {/* Search and Filter Bar */}
        {wishlist.length > 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search wishlist..."
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm"
                />
              </div>

              {/* Filter Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterVerdict('ALL')}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    filterVerdict === 'ALL'
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterVerdict('BUY')}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    filterVerdict === 'BUY'
                      ? 'bg-green-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                  Recommended
                </button>
                <button
                  onClick={() => setFilterVerdict('NOT_BUY')}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    filterVerdict === 'NOT_BUY'
                      ? 'bg-red-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  <XCircle className="w-4 h-4" />
                  Not Recommended
                </button>
              </div>
            </div>

            {/* Results Count */}
            {(searchQuery || filterVerdict !== 'ALL') && (
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Showing {filteredWishlist.length} of {wishlist.length} {wishlist.length === 1 ? 'product' : 'products'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Wishlist Grid */}
        {wishlist.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-16 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-red-50 dark:from-red-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Heart className="w-12 h-12 text-red-500 fill-current" />
              </div>
              <h2 className="text-2xl font-light text-slate-900 dark:text-white mb-3">
                Your Wishlist is Empty
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Start analyzing products and save your favorites to track and compare later
              </p>
              <button
                onClick={() => navigate('/analyze')}
                className="inline-flex items-center gap-2 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 px-6 py-3 rounded-lg font-medium transition-all hover:scale-[1.02]"
              >
                <Sparkles className="w-5 h-5" />
                Analyze Products
              </button>
            </div>
          </div>
        ) : filteredWishlist.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-16 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-slate-400" />
              </div>
              <h2 className="text-2xl font-light text-slate-900 dark:text-white mb-3">
                No Results Found
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Try adjusting your search terms or filters
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilterVerdict('ALL');
                }}
                className="inline-flex items-center gap-2 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 px-6 py-3 rounded-lg font-medium transition-all hover:scale-[1.02]"
              >
                Clear Filters
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredWishlist.map((item) => {
              const priceDropPercent = item.originalPrice && item.originalPrice > item.currentPrice
                ? Math.round(((item.originalPrice - item.currentPrice) / item.originalPrice) * 100)
                : 0;

              return (
                <div
                  key={item.id}
                  className="group bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-xl transition-all"
                >
                  {/* Image Container */}
                  <div className="relative aspect-square bg-slate-50 dark:bg-slate-800/50 overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.productName}
                      className="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    {/* Remove Button */}
                    <button
                      onClick={() => openDeleteModal(item.id, item.productName)}
                      disabled={deletingId === item.id}
                      className="absolute top-3 right-3 p-2 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 transition-all group/btn disabled:opacity-50 shadow-sm"
                    >
                      {deletingId === item.id ? (
                        <Loader2 className="w-4 h-4 text-red-500 animate-spin" />
                      ) : (
                        <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                      )}
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-3">
                    {/* Brand */}
                    <p className="text-xs text-slate-400 dark:text-slate-500 mb-1.5 font-medium uppercase tracking-wide">
                      {item.brand}
                    </p>

                    {/* Product Name */}
                    <h3 className="text-sm font-medium text-slate-900 dark:text-white mb-3 line-clamp-2 leading-snug min-h-[2.5rem]">
                      {item.productName}
                    </h3>

                    {/* Price and Score Row */}
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="text-lg font-bold text-slate-900 dark:text-white">
                          ₹{item.currentPrice.toLocaleString()}
                        </div>
                        {item.originalPrice && item.originalPrice > item.currentPrice && (
                          <div className="text-xs text-slate-400 dark:text-slate-500 line-through">
                            ₹{item.originalPrice.toLocaleString()}
                          </div>
                        )}
                      </div>
                      {item.score && (
                        <div className={`text-base font-bold ${getScoreColor(item.score)}`}>
                          {item.score}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                      <button
                        onClick={() => viewAnalysis(item)}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 px-3 py-2 rounded-lg text-xs font-medium transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View
                      </button>
                      <button
                        onClick={() => openDeleteModal(item.id, item.productName)}
                        disabled={deletingId === item.id}
                        className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Remove from wishlist"
                      >
                        {deletingId === item.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeDeleteModal}
          />
          <div className="relative bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 max-w-md w-full animate-scale-in">
            <button
              onClick={closeDeleteModal}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center flex-shrink-0">
                <Heart className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  Remove from Wishlist?
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  Are you sure you want to remove <span className="font-medium text-slate-900 dark:text-white">{deleteModal.name}</span> from your wishlist?
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={closeDeleteModal}
                    className="flex-1 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={removeFromWishlist}
                    className="flex-1 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-all font-medium"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
      </div>
    
  );
}
