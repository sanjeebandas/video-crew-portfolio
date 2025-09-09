// src/admin/PortfolioManager.tsx
import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import CreatePortfolioForm from "../components/admin/CreatePortfolioForm";
import PortfolioItemCard from "../components/admin/PortfolioItemCard";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { getPortfolioItems, deletePortfolioItem} from "../services/api";
import AdminNavbar from "../components/admin/AdminNavbar";

type PortfolioItem = {
  _id: string;
  title: string;
  description: string;
  category: string;
  client?: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  createdAt: string;
};

type ModalState = {
  type: 'form' | 'video' | 'details' | null;
  data?: any;
  editMode?: boolean;
};

type ErrorState = {
  message: string;
  type: 'fetch' | 'delete' | 'network' | 'unknown';
  retryable: boolean;
};

const PortfolioManager = () => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ErrorState | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [modalState, setModalState] = useState<ModalState>({ type: null });
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isOffline, setIsOffline] = useState(false);

  const navigate = useNavigate();
  const { logout } = useAuth();

  // Retry configuration
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 2000; // 2 seconds

  // Network status detection
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      if (error?.type === 'network') {
        setError(null);
        fetchItems(); // Auto-retry when coming back online
      }
    };

    const handleOffline = () => {
      setIsOffline(true);
      if (!error) {
        setError({
          message: "You're currently offline. Some features may be unavailable.",
          type: 'network',
          retryable: true
        });
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check initial network status
    setIsOffline(!navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [error]);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
    navigate("/admin/login");
  };

  const fetchItems = useCallback(async (isRetry: boolean = false) => {
    try {
      if (!isRetry) {
        setLoading(true);
        setError(null);
      }

      const data = await getPortfolioItems();

      // Ensure data is an array
      if (Array.isArray(data)) {
        const sorted = data.sort(
          (a: PortfolioItem, b: PortfolioItem) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setItems(sorted);
        setRetryCount(0); // Reset retry count on success
      } else {
        console.error("Portfolio data is not an array:", data);
        setItems([]);
        setError({
          message: "Invalid data format received from server. Please contact support.",
          type: 'fetch',
          retryable: true
        });
      }

      // Trigger notification refresh to check for new items
      if (
        typeof window !== "undefined" &&
        (window as any).refreshNotifications
      ) {
        (window as any).refreshNotifications();
      }
    } catch (err: any) {
      console.error("Error fetching portfolio items:", err);
      
      let errorMessage = "Failed to load portfolio items.";
      let errorType: ErrorState['type'] = 'fetch';
      let retryable = true;

      // Determine specific error type and message
      if (err?.response?.status === 401) {
        errorMessage = "Authentication expired. Please log in again.";
        errorType = 'fetch';
        retryable = false;
      } else if (err?.response?.status === 403) {
        errorMessage = "Access denied. You don't have permission to view portfolio items.";
        errorType = 'fetch';
        retryable = false;
      } else if (err?.response?.status === 404) {
        errorMessage = "Portfolio service not found. Please contact support.";
        errorType = 'fetch';
        retryable = true;
      } else if (err?.response?.status >= 500) {
        errorMessage = "Server error. Our team has been notified.";
        errorType = 'fetch';
        retryable = true;
      } else if (err?.message?.includes('Network Error') || err?.code === 'NETWORK_ERROR') {
        errorMessage = "Network connection failed. Please check your internet connection.";
        errorType = 'network';
        retryable = true;
      } else if (err?.message?.includes('timeout')) {
        errorMessage = "Request timed out. Please try again.";
        errorType = 'fetch';
        retryable = true;
      }

      setError({
        message: errorMessage,
        type: errorType,
        retryable
      });

      // Auto-retry for retryable errors
      if (retryable && retryCount < MAX_RETRIES) {
        const newRetryCount = retryCount + 1;
        setRetryCount(newRetryCount);
        
        if (newRetryCount <= MAX_RETRIES) {
          setIsRetrying(true);
          toast.error(`Retrying... (${newRetryCount}/${MAX_RETRIES})`);
          
          setTimeout(() => {
            fetchItems(true);
          }, RETRY_DELAY * newRetryCount);
        }
      }
    } finally {
      setLoading(false);
      setIsRetrying(false);
    }
  }, [retryCount]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const deleteItem = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this portfolio item? This action cannot be undone."
    );
    if (!confirmed) return;

    try {
      setDeletingId(id);
      await deletePortfolioItem(id);
      setItems((prev) => prev.filter((item) => item._id !== id));
      toast.success("Portfolio item deleted successfully!");
    } catch (error: any) {
      console.error("Delete error:", error);
      
      let errorMessage = "Failed to delete portfolio item.";
      
      if (error?.response?.status === 401) {
        errorMessage = "Authentication expired. Please log in again.";
      } else if (error?.response?.status === 403) {
        errorMessage = "Access denied. You don't have permission to delete this item.";
      } else if (error?.response?.status === 404) {
        errorMessage = "Portfolio item not found. It may have been already deleted.";
      } else if (error?.response?.status >= 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (error?.message?.includes('Network Error')) {
        errorMessage = "Network connection failed. Please check your internet connection.";
      }
      
      toast.error(errorMessage);
    } finally {
      setDeletingId(null);
    }
  };

  // Memoized pagination logic
  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(items.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = items.slice(startIndex, endIndex);
    
    return {
      totalPages,
      startIndex,
      endIndex,
      currentItems
    };
  }, [items, currentPage, itemsPerPage]);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(page);
    setModalState({ type: null, editMode: false }); // Close any open modals when changing pages
  }, []);

  const openModal = useCallback((type: ModalState['type'], data?: any, editMode?: boolean) => {
    setModalState({ type, data, editMode });
  }, []);

  const closeModal = useCallback(() => {
    setModalState({ type: null, editMode: false });
  }, []);

  // Error boundary fallback - prevent dashboard crashes
  if (error && !error.retryable && retryCount >= MAX_RETRIES) {
    return (
      <div className="bg-black min-h-screen font-montserrat">
        <AdminNavbar />
        <div className="md:ml-64 p-3 sm:p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6 sm:mb-8">
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-black font-bold text-xs sm:text-sm">
                    VC
                  </span>
                </div>
                <span className="text-gray-300 text-xs sm:text-sm font-medium">
                  Video Crew
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
                Portfolio Manager
              </h1>
            </div>

            <div className="bg-red-900/20 border border-red-600 rounded-xl p-6 text-center">
              <div className="text-red-400 mb-4">
                <i className="fas fa-exclamation-triangle text-2xl"></i>
                <p className="mt-2">Portfolio Manager is temporarily unavailable</p>
              </div>
              <div className="space-y-3">
                <p className="text-gray-300 text-sm">
                  {error.message}
                </p>
                <button
                  onClick={() => {
                    setRetryCount(0);
                    setError(null);
                    fetchItems();
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <i className="fas fa-redo mr-2"></i>Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Loading state with skeleton animation
  if (loading) {
    return (
      <div className="bg-black min-h-screen font-montserrat">
        <AdminNavbar />
        <div className="md:ml-64 p-3 sm:p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6 sm:mb-8">
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-black font-bold text-xs sm:text-sm">
                    VC
                  </span>
                </div>
                <span className="text-gray-300 text-xs sm:text-sm font-medium">
                  Video Crew
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
                Portfolio Manager
              </h1>
              <p className="text-gray-400 text-sm sm:text-base">
                Loading portfolio items...
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-black border border-gray-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 animate-pulse"
                >
                  <div className="w-full h-48 bg-gray-700 rounded-lg mb-4"></div>
                  <div className="w-3/4 h-6 bg-gray-700 rounded mb-2"></div>
                  <div className="w-full h-4 bg-gray-700 rounded mb-2"></div>
                  <div className="w-1/2 h-4 bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen font-montserrat">
      {/* AdminNavbar */}
      <AdminNavbar />

      {/* Main Content */}
      <div className="md:ml-64 p-3 sm:p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
                  Portfolio Manager
                </h1>
                <p className="text-gray-400 text-sm sm:text-base">
                  Create and manage your portfolio projects
                </p>
                {/* Network Status Indicator */}
                {isOffline && (
                  <div className="mt-2 flex items-center gap-2 text-yellow-400 text-xs">
                    <i className="fas fa-wifi"></i>
                    <span>You're currently offline</span>
                  </div>
                )}
                {/* Retry Status */}
                {isRetrying && (
                  <div className="mt-2 flex items-center gap-2 text-blue-400 text-xs">
                    <i className="fas fa-clock"></i>
                    <span>Retrying... ({retryCount}/{MAX_RETRIES})</span>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => openModal('form', undefined, false)}
                  className="group bg-emerald-600/50 hover:bg-emerald-500/50 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 border border-emerald-600/50 hover:border-emerald-500/50 flex items-center gap-1 sm:gap-2"
                  aria-label="Add new portfolio project"
                  disabled={isOffline}
                >
                  <i className="fas fa-plus"></i>
                  <span className="hidden sm:inline">Add New Project</span>
                  <span className="sm:hidden">Add Project</span>
                </button>

                <button
                  onClick={() => {
                    toast.loading("Refreshing portfolio...", { id: 'refresh-portfolio' });
                    fetchItems().finally(() => {
                      toast.success("Portfolio refreshed!", { id: 'refresh-portfolio' });
                    });
                  }}
                  disabled={loading || isRetrying}
                  className="group bg-blue-600/50 hover:bg-blue-500/50 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 border border-blue-600/50 hover:border-blue-500/50 flex items-center gap-1 sm:gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Refresh portfolio items"
                >
                  <i className={loading || isRetrying ? "fas fa-clock" : "fas fa-sync-alt"}></i>
                  <span className="hidden sm:inline">
                    {loading || isRetrying ? "Refreshing..." : "Refresh"}
                  </span>
                  <span className="sm:hidden">
                    {loading || isRetrying ? "Refreshing..." : "Refresh"}
                  </span>
                </button>

                <button
                  onClick={() => navigate("/admin/dashboard")}
                  className="group bg-slate-700/50 hover:bg-slate-600/50 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 border border-slate-600/50 hover:border-slate-500/50 flex items-center gap-1 sm:gap-2"
                  aria-label="Navigate back to dashboard"
                >
                  <i className="fas fa-arrow-left group-hover:-translate-x-1 transition-transform duration-200"></i>
                  <span className="hidden sm:inline">Back to Dashboard</span>
                  <span className="sm:hidden">Back</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="group bg-red-600/50 hover:bg-red-500/50 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 border border-red-600/50 hover:border-red-500/50 flex items-center gap-1 sm:gap-2"
                  aria-label="Logout from admin panel"
                >
                  <i className="fas fa-sign-out-alt"></i>
                  <span className="hidden sm:inline">Logout</span>
                  <span className="sm:hidden">Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          {error ? (
            <div className="bg-red-900/20 border border-red-600 rounded-xl sm:rounded-2xl p-6">
              <div className="text-center">
                <div className="text-red-400 mb-4">
                  <i className="fas fa-exclamation-triangle text-2xl"></i>
                  <p className="mt-2">{error.message}</p>
                </div>
                {error.retryable && (
                  <button
                    onClick={() => {
                      setRetryCount(0); // Reset retry count for new retry
                      fetchItems();
                    }}
                    className="mt-4 px-4 py-2 rounded-lg bg-red-600/50 hover:bg-red-500/50 text-white transition-all duration-200 border border-red-600/50 hover:border-red-500/50"
                    aria-label="Retry fetching portfolio items"
                  >
                    <i className="fas fa-redo mr-2"></i>Retry
                  </button>
                )}
                {isOffline && (
                  <p className="mt-4 text-gray-400 text-sm">
                    You are currently offline. Please check your connection.
                  </p>
                )}
              </div>
            </div>
          ) : items.length === 0 ? (
            <div className="bg-black border border-gray-700 rounded-xl sm:rounded-2xl p-6">
              <div className="text-center py-8">
                <i className="fas fa-briefcase text-4xl mb-4 block text-gray-400"></i>
                <p className="text-gray-300 text-sm sm:text-base mb-4">
                  No portfolio items found.
                </p>
                <button
                  onClick={() => openModal('form', undefined, false)}
                  className="bg-emerald-600/50 hover:bg-emerald-500/50 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border border-emerald-600/50 hover:border-emerald-500/50"
                  aria-label="Create your first portfolio project"
                >
                  Create Your First Project
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Portfolio Items Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
                {paginationData.currentItems.map((item) => (
                  <PortfolioItemCard
                    key={item._id}
                    item={item}
                    onEdit={(item) => openModal('form', item, true)}
                    onDelete={deleteItem}
                    onViewDetails={(item) => openModal('details', item)}
                    onPreviewVideo={(videoUrl) => openModal('video', videoUrl)}
                    isDeleting={deletingId === item._id}
                    isOffline={isOffline}
                  />
                ))}
              </div>

              {/* Pagination */}
              {paginationData.totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mb-6">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-all duration-200 border border-gray-600 hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Go to previous page"
                  >
                    <i className="fas fa-arrow-left mr-1"></i>Previous
                  </button>

                  <div className="flex gap-1">
                    {Array.from({ length: paginationData.totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          className={`px-3 py-2 text-sm rounded-lg transition-all duration-200 border ${
                            currentPage === page
                              ? "bg-emerald-600 text-white border-emerald-500"
                              : "bg-gray-800 hover:bg-gray-700 text-white border-gray-600 hover:border-gray-500"
                          }`}
                          aria-label={`Go to page ${page}`}
                          aria-current={currentPage === page ? "page" : undefined}
                        >
                          {page}
                        </button>
                      )
                    )}
                  </div>

                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === paginationData.totalPages}
                    className="px-3 py-2 text-sm rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-all duration-200 border border-gray-600 hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Go to next page"
                  >
                    Next<i className="fas fa-arrow-right ml-1"></i>
                  </button>
                </div>
              )}

              {/* Summary */}
              <div className="text-center text-gray-400 text-sm mb-6">
                Showing {paginationData.startIndex + 1} to {Math.min(paginationData.endIndex, items.length)}{" "}
                of {items.length} portfolio items
              </div>
            </>
          )}

          {/* Create/Edit Portfolio Form Modal */}
          {modalState.type === 'form' && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-black border border-gray-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 w-full max-w-2xl max-h-[85vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg sm:text-2xl font-bold text-white">
                    {modalState.editMode ? "Edit Portfolio Item" : "Create New Portfolio Item"}
                  </h2>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                    aria-label="Close modal"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
                <CreatePortfolioForm
                  editMode={modalState.editMode}
                  editData={modalState.data}
                  onCreated={() => {
                    closeModal();
                    fetchItems();
                  }}
                  onUpdated={() => {
                    closeModal();
                    fetchItems();
                  }}
                  onClose={closeModal}
                />
              </div>
            </div>
          )}

          {/* Video Preview Modal */}
          {modalState.type === 'video' && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="relative w-full max-w-4xl">
                <button
                  onClick={closeModal}
                  className="absolute -top-10 right-0 text-white hover:text-slate-300 transition-colors duration-200 z-10"
                  aria-label="Close video preview"
                >
                  <i className="fas fa-times mr-1"></i>Close
                </button>
                <video
                  src={modalState.data}
                  controls
                  className="w-full rounded-lg"
                  autoPlay
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          )}

          {/* Item Details Modal */}
          {modalState.type === 'details' && modalState.data && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-black border border-gray-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    Project Details
                  </h2>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                    aria-label="Close details modal"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {modalState.data.title}
                    </h3>
                    <p className="text-gray-300 text-sm">
                      {modalState.data.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong className="text-gray-300">Category:</strong>
                      <p className="text-gray-400 mt-1">
                        {modalState.data.category}
                      </p>
                    </div>
                    {modalState.data.client && (
                      <div>
                        <strong className="text-gray-300">Client:</strong>
                        <p className="text-gray-400 mt-1">
                          {modalState.data.client}
                        </p>
                      </div>
                    )}
                    <div>
                      <strong className="text-gray-300">Created:</strong>
                      <p className="text-gray-400 mt-1">
                        {new Date(
                          modalState.data.createdAt
                        ).toLocaleDateString()}{" "}
                        at{" "}
                        {new Date(
                          modalState.data.createdAt
                        ).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>

                  {modalState.data.videoUrl && (
                    <div>
                      <strong className="text-gray-300 block mb-2">
                        Video:
                      </strong>
                      <video
                        src={modalState.data.videoUrl}
                        controls
                        className="w-full rounded-lg"
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortfolioManager;
