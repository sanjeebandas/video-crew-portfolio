// src/admin/PortfolioManager.tsx
import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import CreatePortfolioForm from "../components/admin/CreatePortfolioForm";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

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

const PortfolioManager = () => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [previewVideo, setPreviewVideo] = useState<string | null>(null);
  const [selectedItemForDetails, setSelectedItemForDetails] =
    useState<PortfolioItem | null>(null);

  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
  };

  const fetchItems = async () => {
    try {
      const res = await api.get("/portfolio");
      const sorted = res.data.sort(
        (a: PortfolioItem, b: PortfolioItem) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setItems(sorted);
    } catch (err) {
      setError("Failed to load portfolio items.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const deleteItem = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) return toast.error("❌ No token found. Please login again.");

    const confirmed = window.confirm(
      "Are you sure you want to delete this portfolio item?"
    );
    if (!confirmed) return;

    try {
      setDeletingId(id);
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/portfolio/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setItems((prev) => prev.filter((item) => item._id !== id));
      toast.success("🗑️ Portfolio item deleted.");
    } catch (error) {
      console.error(error);
      toast.error("❌ Failed to delete portfolio item.");
    } finally {
      setDeletingId(null);
    }
  };

  // Loading state with skeleton animation
  if (loading)
    return (
      <div className="bg-gradient-to-br from-slate-900 to-black min-h-screen p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            {/* Header skeleton */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
              <div className="h-10 bg-slate-800 rounded-lg w-40"></div>
              <div className="h-8 bg-slate-800 rounded-lg w-60"></div>
              <div className="h-10 bg-slate-800 rounded-lg w-48"></div>
            </div>
            {/* Grid skeleton */}
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-slate-800/50 rounded-2xl p-6">
                  <div className="h-6 bg-slate-700 rounded mb-4"></div>
                  <div className="h-44 bg-slate-700 rounded-lg mb-4"></div>
                  <div className="h-4 bg-slate-700 rounded mb-2"></div>
                  <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="bg-gradient-to-br from-slate-900 to-black min-h-screen flex items-center justify-center p-6">
        <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-400 text-2xl">⚠️</span>
          </div>
          <h3 className="text-red-400 text-lg font-semibold mb-2">
            Error Loading Portfolio
          </h3>
          <p className="text-red-300">{error}</p>
          <button
            onClick={fetchItems}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-all duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );

  return (
    <div className="bg-gradient-to-br from-slate-900 to-black min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/*  Header with glassmorphism */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="group bg-slate-800/80 backdrop-blur-sm hover:bg-slate-700/80 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 shadow-lg border border-slate-700/50 hover:border-slate-600/50 flex items-center gap-2 w-fit"
          >
            <span className="group-hover:-translate-x-1 transition-transform duration-200">
              ←
            </span>
            Back to Dashboard
          </button>

          <div className="text-center">
            <h2 className="text-3xl md:text-4xl text-white font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Portfolio Manager
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              {items.length} items total
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowForm(true)}
              className="group bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white px-6 py-2.5 rounded-xl text-sm font-medium shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:shadow-emerald-500/40 hover:scale-105 flex items-center gap-2 w-fit md:w-auto justify-center"
            >
              <span className="text-lg group-hover:rotate-90 transition-transform duration-200">
                +
              </span>
              Create Portfolio Item
            </button>

                         <button
               onClick={handleLogout}
               className="group bg-gradient-to-r from-red-600/90 to-pink-600/90 hover:from-red-500 hover:to-pink-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transition-all duration-300 hover:scale-105 border border-red-500/20 hover:border-red-400/30 flex items-center gap-2"
             >
               <span className="text-sm group-hover:scale-110 transition-transform duration-200">
                 🚪
               </span>
               <span>Logout</span>
             </button>
          </div>
        </div>

        {/*  Create Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-2xl relative shadow-2xl transform animate-in zoom-in-95 duration-200">
              <button
                onClick={() => setShowForm(false)}
                className="absolute -top-4 -right-4 w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-lg font-bold shadow-lg hover:scale-110 transition-all duration-200 z-10"
              >
                ×
              </button>
              <CreatePortfolioForm
                onCreated={() => {
                  fetchItems();
                  setShowForm(false);
                }}
                onClose={() => setShowForm(false)}
              />
            </div>
          </div>
        )}

        {/*  Video Preview Modal */}
        {previewVideo && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900/95 backdrop-blur-sm p-6 rounded-2xl w-full max-w-4xl relative shadow-2xl border border-slate-700/50">
              <button
                className="absolute -top-4 -right-4 w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-lg font-bold shadow-lg hover:scale-110 transition-all duration-200 z-10"
                onClick={() => setPreviewVideo(null)}
              >
                ×
              </button>
              <video
                src={previewVideo}
                controls
                className="w-full h-[400px] md:h-[500px] rounded-xl shadow-lg"
              />
            </div>
          </div>
        )}

        {/*  Details Modal */}
        {selectedItemForDetails && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white p-6 rounded-2xl w-full max-w-lg relative shadow-2xl border border-slate-700/50">
              <button
                onClick={() => setSelectedItemForDetails(null)}
                className="absolute -top-4 -right-4 w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-lg font-bold shadow-lg hover:scale-110 transition-all duration-200 z-10"
              >
                ×
              </button>

              <div className="space-y-4">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  {selectedItemForDetails.title}
                </h3>

                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div className="flex justify-between items-center p-3 bg-slate-700/30 rounded-lg">
                    <span className="text-slate-400 font-medium">Created:</span>
                    <span className="text-white">
                      {new Date(
                        selectedItemForDetails.createdAt
                      ).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-slate-700/30 rounded-lg">
                    <span className="text-slate-400 font-medium">
                      Category:
                    </span>
                    <span className="text-white bg-slate-600 px-2 py-1 rounded-full text-xs">
                      {selectedItemForDetails.category}
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-slate-700/30 rounded-lg">
                    <span className="text-slate-400 font-medium">Client:</span>
                    <span className="text-white">
                      {selectedItemForDetails.client || "N/A"}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-slate-700/20 rounded-lg border border-slate-600/30">
                  <h4 className="text-slate-400 font-medium mb-2">
                    Description:
                  </h4>
                  <p className="text-white text-sm leading-relaxed">
                    {selectedItemForDetails.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/*  Portfolio Cards */}
        {items.length === 0 ? (
          <div className="text-center mt-20">
            <div className="w-24 h-24 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-slate-500 text-4xl">📁</span>
            </div>
            <h3 className="text-xl text-slate-300 font-semibold mb-2">
              No Portfolio Items
            </h3>
            <p className="text-slate-400 mb-6">
              Get started by creating your first portfolio item
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:shadow-emerald-500/40 hover:scale-105"
            >
              Create First Item
            </button>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {items.map((item) => (
              <div
                key={item._id}
                className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-slate-500/10 transition-all duration-300 p-6 flex flex-col justify-between hover:scale-[1.02] hover:border-slate-600/50 animate-in slide-in-from-bottom-4 fade-in duration-500"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg text-white font-semibold line-clamp-2 group-hover:text-emerald-300 transition-colors duration-200">
                      {item.title}
                    </h3>
                    <div className="text-xs text-slate-400 bg-slate-700/50 px-2 py-1 rounded-full whitespace-nowrap ml-2">
                      {new Date(item.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                  </div>

                  <div className="relative overflow-hidden rounded-xl">
                    {item.thumbnailUrl ? (
                      <img
                        src={item.thumbnailUrl}
                        alt={item.title}
                        className="w-full h-44 object-cover border border-slate-700/50 group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-44 flex items-center justify-center bg-gradient-to-br from-slate-700/30 to-slate-800/30 text-slate-500 text-sm border border-slate-700/30 group-hover:from-slate-600/30 group-hover:to-slate-700/30 transition-all duration-200">
                        <div className="text-center">
                          <span className="block text-2xl mb-2">🖼️</span>
                          No Image
                        </div>
                      </div>
                    )}
                    {item.videoUrl && (
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                        <button
                          onClick={() => setPreviewVideo(item.videoUrl!)}
                          className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-200 hover:scale-110"
                        >
                          <span className="text-xl">▶️</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    {item.videoUrl ? (
                      <button
                        onClick={() => setPreviewVideo(item.videoUrl!)}
                        className="flex items-center gap-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-sm px-3 py-1.5 rounded-lg transition-all duration-200 border border-blue-500/30 hover:border-blue-500/50"
                      >
                        <span>▶️</span> Preview
                      </button>
                    ) : (
                      <span className="text-slate-500 text-sm">No video</span>
                    )}

                    <button
                      onClick={() => setSelectedItemForDetails(item)}
                      className="text-sm text-slate-300 hover:text-white bg-slate-700/50 hover:bg-slate-600/50 px-3 py-1.5 rounded-lg transition-all duration-200 border border-slate-600/30 hover:border-slate-500/50"
                    >
                      Details
                    </button>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() =>
                      navigate(`/admin/portfolio/edit/${item._id}`)
                    }
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white px-4 py-2.5 rounded-lg transition-all duration-200 font-medium text-sm hover:scale-105 shadow-lg shadow-blue-500/20"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => deleteItem(item._id)}
                    disabled={deletingId === item._id}
                    className={`flex-1 px-4 py-2.5 rounded-lg transition-all duration-200 font-medium text-sm shadow-lg ${
                      deletingId === item._id
                        ? "bg-slate-600 text-slate-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white hover:scale-105 shadow-red-500/20"
                    }`}
                  >
                    {deletingId === item._id ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                        Deleting...
                      </span>
                    ) : (
                      "🗑️ Delete"
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioManager;
