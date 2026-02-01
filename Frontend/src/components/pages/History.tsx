import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '../layout/Navigation';
import { Eye, Calendar, TrendingUp, TrendingDown, Loader2, Trash2, Sparkles, Award, Search, Filter, CheckCircle, XCircle } from 'lucide-react';
import api from '../../config/api';
import { useToast } from '../../context/ToastContext';

interface AnalysisHistory {
  id: string;
  productName: string;
  brand: string;
  score: number;
  verdict: 'BUY' | 'NOT_BUY';
  date: string;
  imageUrl: string;
}

export function History() {
  const [analyses, setAnalyses] = useState<AnalysisHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVerdict, setFilterVerdict] = useState<'ALL' | 'BUY' | 'NOT_BUY'>('ALL');
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string; name: string }>({ 
    isOpen: false, 
    id: '', 
    name: '' 
  });
  const navigate = useNavigate();
  const { success, error } = useToast();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get('/history');
        setAnalyses(response.data);
      } catch (err) {
        console.error('Failed to fetch history:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleView = (analysisId: string) => {
    navigate('/result', { state: { analysisId } });
  };

  const openDeleteModal = (analysisId: string, productName: string) => {
    setDeleteModal({ isOpen: true, id: analysisId, name: productName });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, id: '', name: '' });
  };

  const confirmDelete = async () => {
    const { id, name } = deleteModal;
    setDeletingId(id);
    closeDeleteModal();
    
    try {
      await api.delete(`/analysis/${id}`);
      setAnalyses(analyses.filter(a => a.id !== id));
      success('Analysis deleted successfully');
    } catch (err) {
      console.error('Failed to delete analysis:', err);
      error('Failed to delete analysis');
    } finally {
      setDeletingId(null);
    }
  };

  // Filter analyses based on search and verdict
  const filteredAnalyses = analyses.filter((analysis) => {
    const matchesSearch = !searchQuery.trim() || 
      analysis.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      analysis.brand.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesVerdict = filterVerdict === 'ALL' || analysis.verdict === filterVerdict;
    
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <Navigation />
        <div className="lg:ml-64 pt-16 lg:pt-0">
        <div className="px-4 md:px-8 lg:px-12 py-6 md:py-10">
          <div className="flex flex-col items-center justify-center h-96 gap-4">
            <Loader2 className="w-12 h-12 text-slate-400 animate-spin" />
            <p className="text-sm text-slate-400 dark:text-slate-600">Loading your history...</p>
          </div>
        </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <Navigation />
      
      <div className="lg:ml-64 pt-16 lg:pt-0">
      <div className="px-4 md:px-8 lg:px-12 py-6 md:py-10">
        {/* Header */}
        <div className="mb-12 pb-8 border-b border-slate-200/50 dark:border-slate-800/50">
          <h1 className="text-5xl font-extralight tracking-tight text-slate-900 dark:text-white mb-3">
            Analysis History
          </h1>
          <p className="text-slate-400 dark:text-slate-500 text-lg">
            {analyses.length > 0 ? (
              <>{analyses.length} {analyses.length === 1 ? 'analysis' : 'analyses'} • Review your past evaluations</>
            ) : (
              'Start analyzing products to build your history'
            )}
          </p>
        </div>

        {/* Search and Filter Bar */}
        {analyses.length > 0 && (
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by product name or brand..."
                  className="w-full pl-14 pr-6 py-4 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-300 dark:focus:ring-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 text-base"
                />
              </div>

              {/* Filter Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterVerdict('ALL')}
                  className={`px-6 py-4 rounded-lg text-sm font-medium transition-all ${
                    filterVerdict === 'ALL'
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterVerdict('BUY')}
                  className={`flex items-center gap-2 px-6 py-4 rounded-lg text-sm font-medium transition-all ${
                    filterVerdict === 'BUY'
                      ? 'bg-green-600 dark:bg-green-500 text-white'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                  Buy
                </button>
                <button
                  onClick={() => setFilterVerdict('NOT_BUY')}
                  className={`flex items-center gap-2 px-6 py-4 rounded-lg text-sm font-medium transition-all ${
                    filterVerdict === 'NOT_BUY'
                      ? 'bg-red-600 dark:bg-red-500 text-white'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <XCircle className="w-4 h-4" />
                  Not Buy
                </button>
              </div>
            </div>

            {/* Results Count */}
            {(searchQuery || filterVerdict !== 'ALL') && (
              <div className="mt-4">
                <p className="text-sm text-slate-400 dark:text-slate-600">
                  Showing {filteredAnalyses.length} of {analyses.length} {analyses.length === 1 ? 'analysis' : 'analyses'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* History Grid */}
        {analyses.length === 0 ? (
          <div className="text-center py-32">
            <div className="inline-flex p-8 rounded-full bg-slate-100 dark:bg-slate-800 mb-6">
              <Calendar className="w-12 h-12 text-slate-300 dark:text-slate-700" />
            </div>
            <h2 className="text-2xl font-extralight text-slate-900 dark:text-white mb-2">
              No Analyses Yet
            </h2>
            <p className="text-slate-400 dark:text-slate-600 mb-8">
              Start analyzing products to build your history
            </p>
            <button
              onClick={() => navigate('/analyze')}
              className="inline-flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-lg font-medium hover:scale-105 transition-all"
            >
              <Award className="w-5 h-5" />
              Analyze Your First Product
            </button>
          </div>
        ) : filteredAnalyses.length === 0 ? (
          <div className="text-center py-32">
            <div className="inline-flex p-8 rounded-full bg-slate-100 dark:bg-slate-800 mb-6">
              <Search className="w-12 h-12 text-slate-300 dark:text-slate-700" />
            </div>
            <h2 className="text-2xl font-extralight text-slate-900 dark:text-white mb-2">
              No Results Found
            </h2>
            <p className="text-slate-400 dark:text-slate-600 mb-8">
              Try adjusting your search terms or filters
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterVerdict('ALL');
              }}
              className="inline-flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-lg font-medium hover:scale-105 transition-all"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredAnalyses.map((analysis) => (
              <div
                key={analysis.id}
                className="group border border-slate-200 dark:border-slate-800 rounded-xl hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-xl transition-all bg-white dark:bg-slate-900 overflow-hidden"
              >
                {/* Image Container */}
                <div className="relative aspect-square bg-slate-50 dark:bg-slate-800/50 overflow-hidden flex items-center justify-center p-6">
                  <img
                    src={analysis.imageUrl}
                    alt={analysis.productName}
                    className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Content */}
                <div className="p-4">
                  {/* Brand */}
                  <p className="text-xs text-slate-400 dark:text-slate-500 mb-1.5 font-medium uppercase tracking-wide">
                    {analysis.brand}
                  </p>

                  {/* Product Name */}
                  <h3 className="text-sm font-medium text-slate-900 dark:text-white mb-3 line-clamp-2 leading-snug min-h-[2.5rem]">
                    {analysis.productName}
                  </h3>

                  {/* Score and Date Row */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>
                        {new Date(analysis.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className={`text-base font-bold ${getScoreColor(analysis.score)}`}>
                      {analysis.score}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => handleView(analysis.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-3 py-2 rounded-lg text-xs font-medium transition-all hover:scale-[1.02]"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View
                    </button>
                    <button
                      onClick={() => openDeleteModal(analysis.id, analysis.productName)}
                      disabled={deletingId === analysis.id}
                      className="p-2 rounded-lg bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Delete"
                    >
                      {deletingId === analysis.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 max-w-md w-full animate-scale-in">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30">
                  <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Delete Analysis
                  </h3>
                </div>
              </div>
              
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Are you sure you want to delete the analysis for <span className="font-medium text-slate-900 dark:text-white">"{deleteModal.name}"</span>? This action cannot be undone.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={closeDeleteModal}
                  className="flex-1 px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-all font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
      </div>
    
  );
}
