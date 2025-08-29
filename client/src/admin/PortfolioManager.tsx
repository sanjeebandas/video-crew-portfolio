// src/admin/PortfolioManager.tsx
import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import CreatePortfolioForm from "../components/admin/CreatePortfolioForm";
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

const PortfolioManager = () => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [modalState, setModalState] = useState<ModalState>({ type: null });

  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
  };

  const fetchItems = useCallback(async () => {
    try {
      const data = await getPortfolioItems();

      // Ensure data is an array
      if (Array.isArray(data)) {
        const sorted = data.sort(
          (a: PortfolioItem, b: PortfolioItem) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setItems(sorted);
      } else {
        console.error("Portfolio data is not an array:", data);
        setItems([]);
        setError("Invalid data format received from server.");
      }

      // Trigger notification refresh to check for new items
      if (
        typeof window !== "undefined" &&
        (window as any).refreshNotifications
      ) {
        (window as any).refreshNotifications();
      }
    } catch (err) {
      setError("Failed to load portfolio items.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const deleteItem = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this portfolio item?"
    );
    if (!confirmed) return;

    try {
      setDeletingId(id);
      await deletePortfolioItem(id);
      setItems((prev) => prev.filter((item) => item._id !== id));
      toast.success("🗑️ Portfolio item deleted.");
    } catch (error) {
      console.error(error);
      toast.error("❌ Failed to delete portfolio item.");
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

  // Loading state with skeleton animation
  if (loading) {
    return (
      <div className="bg-gradient-to-br from-slate-900 to-black min-h-screen">
        <AdminNavbar />
        <div className="md:ml-64 p-3 sm:p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6 sm:mb-8">
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs sm:text-sm">
                    VC
                  </span>
                </div>
                <span className="text-slate-400 text-xs sm:text-sm font-medium">
                  Video Crew
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-2">
                Portfolio Manager
              </h1>
              <p className="text-slate-400 text-sm sm:text-base">
                Loading portfolio items...
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-sm border border-slate-700/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 animate-pulse"
                >
                  <div className="w-full h-48 bg-slate-700 rounded-lg mb-4"></div>
                  <div className="w-3/4 h-6 bg-slate-700 rounded mb-2"></div>
                  <div className="w-full h-4 bg-slate-700 rounded mb-2"></div>
                  <div className="w-1/2 h-4 bg-slate-700 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-900 to-black min-h-screen">
      {/* AdminNavbar */}
      <AdminNavbar />

      {/* Main Content */}
      <div className="md:ml-64 p-3 sm:p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs sm:text-sm">
                  VC
                </span>
              </div>
              <span className="text-slate-400 text-xs sm:text-sm font-medium">
                Video Crew
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-2">
                  Portfolio Manager
                </h1>
                <p className="text-slate-400 text-sm sm:text-base">
                  Create and manage your portfolio projects
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => openModal('form', undefined, false)}
                  className="group bg-emerald-600/50 hover:bg-emerald-500/50 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 border border-emerald-600/50 hover:border-emerald-500/50 flex items-center gap-1 sm:gap-2"
                  aria-label="Add new portfolio project"
                >
                  <span>➕</span>
                  <span className="hidden sm:inline">Add New Project</span>
                  <span className="sm:hidden">Add Project</span>
                </button>

                <button
                  onClick={() => navigate("/admin/dashboard")}
                  className="group bg-slate-700/50 hover:bg-slate-600/50 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 border border-slate-600/50 hover:border-slate-500/50 flex items-center gap-1 sm:gap-2"
                  aria-label="Navigate back to dashboard"
                >
                  <span className="group-hover:-translate-x-1 transition-transform duration-200">
                    ←
                  </span>
                  <span className="hidden sm:inline">Back to Dashboard</span>
                  <span className="sm:hidden">Back</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="group bg-red-600/50 hover:bg-red-500/50 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 border border-red-600/50 hover:border-red-500/50 flex items-center gap-1 sm:gap-2"
                  aria-label="Logout from admin panel"
                >
                  <span>🚪</span>
                  <span className="hidden sm:inline">Logout</span>
                  <span className="sm:hidden">Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          {error ? (
            <div className="bg-gradient-to-br from-red-900/30 to-red-800/30 backdrop-blur-sm border border-red-700/50 rounded-xl sm:rounded-2xl p-6">
              <p className="text-red-400 text-center">{error}</p>
            </div>
          ) : items.length === 0 ? (
            <div className="bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-sm border border-slate-700/50 rounded-xl sm:rounded-2xl p-6">
              <div className="text-center py-8">
                <span className="text-4xl mb-4 block">🎯</span>
                <p className="text-slate-400 text-sm sm:text-base mb-4">
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
                  <div
                    key={item._id}
                    className="bg-gradient-to-br from-slate-700/80 via-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-slate-600/30 rounded-xl sm:rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-slate-500/20 overflow-hidden"
                  >
                    {/* Thumbnail */}
                    <div className="relative h-48 bg-slate-800">
                      {item.thumbnailUrl ? (
                        <img
                          src={item.thumbnailUrl}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800">
                          <span className="text-4xl text-slate-500">🎬</span>
                        </div>
                      )}

                      {/* Video Preview Button */}
                      {item.videoUrl && (
                        <button
                          onClick={() => openModal('video', item.videoUrl)}
                          className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-lg transition-all duration-200"
                          title="Preview Video"
                          aria-label={`Preview video for ${item.title}`}
                        >
                          ▶️
                        </button>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4 sm:p-6">
                      <div className="mb-3">
                        <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-slate-300 text-sm mb-2 line-clamp-3">
                          {item.description}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <span className="bg-slate-600/50 px-2 py-1 rounded-full">
                            {item.category}
                          </span>
                          {item.client && (
                            <span className="bg-blue-600/50 px-2 py-1 rounded-full">
                              {item.client}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>

                        <div className="flex gap-2">
                          <button
                            onClick={() => openModal('details', item)}
                            className="px-3 py-1 text-xs rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-white transition-all duration-200 border border-slate-600/50 hover:border-slate-500/50"
                            aria-label={`View details for ${item.title}`}
                          >
                            Details
                          </button>

                          <button
                            onClick={() => openModal('form', item, true)}
                            className="px-3 py-1 text-xs rounded-lg bg-blue-600/50 hover:bg-blue-500/50 text-white transition-all duration-200 border border-blue-600/50 hover:border-blue-500/50"
                            aria-label={`Edit ${item.title}`}
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => deleteItem(item._id)}
                            className={`px-3 py-1 text-xs rounded-lg bg-red-600/50 hover:bg-red-500/50 text-white transition-all duration-200 border border-red-600/50 hover:border-red-500/50 ${
                              deletingId === item._id
                                ? "opacity-50 pointer-events-none"
                                : ""
                            }`}
                            aria-label={`Delete ${item.title}`}
                          >
                            {deletingId === item._id ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {paginationData.totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mb-6">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-white transition-all duration-200 border border-slate-600/50 hover:border-slate-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Go to previous page"
                  >
                    ← Previous
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
                              : "bg-slate-700/50 hover:bg-slate-600/50 text-white border-slate-600/50 hover:border-slate-500/50"
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
                    className="px-3 py-2 text-sm rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-white transition-all duration-200 border border-slate-600/50 hover:border-slate-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Go to next page"
                  >
                    Next →
                  </button>
                </div>
              )}

              {/* Summary */}
              <div className="text-center text-slate-400 text-sm mb-6">
                Showing {paginationData.startIndex + 1} to {Math.min(paginationData.endIndex, items.length)}{" "}
                of {items.length} portfolio items
              </div>
            </>
          )}

          {/* Create/Edit Portfolio Form Modal */}
          {modalState.type === 'form' && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-sm border border-slate-700/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 w-full max-w-2xl max-h-[85vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg sm:text-2xl font-bold text-white">
                    {modalState.editMode ? "Edit Portfolio Item" : "Create New Portfolio Item"}
                  </h2>
                  <button
                    onClick={closeModal}
                    className="text-slate-400 hover:text-white transition-colors duration-200"
                    aria-label="Close modal"
                  >
                    ✕
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
                  ✕ Close
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
              <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-sm border border-slate-700/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    Project Details
                  </h2>
                  <button
                    onClick={closeModal}
                    className="text-slate-400 hover:text-white transition-colors duration-200"
                    aria-label="Close details modal"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {modalState.data.title}
                    </h3>
                    <p className="text-slate-300 text-sm">
                      {modalState.data.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong className="text-slate-300">Category:</strong>
                      <p className="text-slate-400 mt-1">
                        {modalState.data.category}
                      </p>
                    </div>
                    {modalState.data.client && (
                      <div>
                        <strong className="text-slate-300">Client:</strong>
                        <p className="text-slate-400 mt-1">
                          {modalState.data.client}
                        </p>
                      </div>
                    )}
                    <div>
                      <strong className="text-slate-300">Created:</strong>
                      <p className="text-slate-400 mt-1">
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
                      <strong className="text-slate-300 block mb-2">
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
