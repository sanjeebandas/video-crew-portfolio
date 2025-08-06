import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";
import { uploadImage, uploadVideo } from "../services/upload";

type PortfolioFormData = {
  title: string;
  description: string;
  category: string;
  client?: string;
  thumbnailUrl: string;
  videoUrl: string;
  featured: boolean;
  displayOrder: number;
};

const initialState: PortfolioFormData = {
  title: "",
  description: "",
  category: "",
  client: "",
  thumbnailUrl: "",
  videoUrl: "",
  featured: false,
  displayOrder: 0,
};

const CATEGORY_OPTIONS = [
  { value: "advertisement/promotional", label: "광고 · 홍보 영상" },
  { value: "e-learning", label: "이러닝 영상" },
  { value: "corporate-event", label: "기업 행사 영상" },
];

const EditPortfolioPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<PortfolioFormData>(initialState);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await api.get(`/portfolio/${id}`);
        const data = res.data;

        setFormData({
          title: data.title || "",
          description: data.description || "",
          category: data.category || "",
          client: data.client || "",
          thumbnailUrl: data.thumbnailUrl || data.thumbnail || "",
          videoUrl: data.videoUrl || data.video || "",
          featured: data.featured || false,
          displayOrder: data.displayOrder || 0,
        });
      } catch (err) {
        toast.error("Failed to fetch portfolio item.");
        navigate("/admin/portfolio");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchItem();
  }, [id, navigate]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const target = e.target;
    const { name, value, type } = target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (target as HTMLInputElement).checked
          : name === "displayOrder"
          ? Math.max(0, Number(value))
          : value,
    }));
  };

  const uploadMedia = async () => {
    const uploaded: Partial<PortfolioFormData> = {};
    if (thumbnailFile) {
      uploaded.thumbnailUrl = await uploadImage(thumbnailFile);
    }
    if (videoFile) {
      uploaded.videoUrl = await uploadVideo(videoFile);
    }
    return uploaded;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const token = localStorage.getItem("token");

    try {
      const media = await uploadMedia();
      const payload = { ...formData, ...media };

      await api.put(`/portfolio/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Portfolio updated!");
      navigate("/admin/portfolio");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Update failed.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-slate-900 to-black min-h-screen p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            {/* Header skeleton */}
            <div className="flex items-center gap-4 mb-8">
              <div className="h-10 bg-slate-800 rounded-lg w-32"></div>
              <div className="h-8 bg-slate-800 rounded-lg w-80"></div>
            </div>
            {/* Form skeleton */}
            <div className="bg-slate-800/50 rounded-2xl p-6 space-y-6">
              <div className="h-6 bg-slate-700 rounded w-48"></div>
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-12 bg-slate-700 rounded-xl"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-900 to-black min-h-screen p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/*Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/admin/portfolio")}
            className="group bg-slate-800/80 backdrop-blur-sm hover:bg-slate-700/80 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 shadow-lg border border-slate-700/50 hover:border-slate-600/50 flex items-center gap-2"
          >
            <span className="group-hover:-translate-x-1 transition-transform duration-200">
              ←
            </span>
            Back to Portfolio
          </button>

          <div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Edit Portfolio Item
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Update your project details
            </p>
          </div>
        </div>

        {/*Form Container */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Information Section */}
            <div className="bg-slate-700/20 backdrop-blur-sm border border-slate-600/30 rounded-2xl p-6 space-y-5">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                Basic Information
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Project Title *
                  </label>
                  <input
                    name="title"
                    placeholder="E-commerce Redesign"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-xl p-4 placeholder-slate-400 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200 hover:border-slate-500/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    placeholder="Describe your project in detail..."
                    required
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-xl p-4 placeholder-slate-400 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200 hover:border-slate-500/50 resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      required
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200 hover:border-slate-500/50"
                    >
                      <option value="">Select Category</option>
                      {CATEGORY_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Client Name
                    </label>
                    <input
                      name="client"
                      placeholder="Optional"
                      value={formData.client}
                      onChange={handleChange}
                      className="w-full bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-xl p-4 placeholder-slate-400 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200 hover:border-slate-500/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Display Order
                    </label>
                    <input
                      type="number"
                      name="displayOrder"
                      min={0}
                      placeholder="1"
                      value={formData.displayOrder}
                      onChange={handleChange}
                      className="w-full bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-xl p-4 placeholder-slate-400 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200 hover:border-slate-500/50"
                    />
                  </div>

                  <div className="flex items-end">
                    <label className="flex items-center space-x-3 bg-slate-700/30 p-4 rounded-xl border border-slate-600/30 hover:border-slate-500/50 transition-colors duration-200 cursor-pointer group w-full">
                      <input
                        type="checkbox"
                        name="featured"
                        checked={formData.featured}
                        onChange={handleChange}
                        className="w-5 h-5 text-emerald-600 bg-slate-700 border-slate-600 rounded focus:ring-emerald-500/50 focus:ring-2"
                      />
                      <span className="text-sm text-slate-300 group-hover:text-white transition-colors duration-200">
                        ⭐ Feature this project
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Media Assets Section */}
            <div className="bg-slate-700/20 backdrop-blur-sm border border-slate-600/30 rounded-2xl p-6 space-y-5">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Media Assets
              </h3>

              {/* Thumbnail Upload */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-300">
                  Thumbnail Image
                </label>

                {/* Current Thumbnail Display */}
                {formData.thumbnailUrl && !thumbnailFile && (
                  <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/50">
                    <p className="text-slate-400 text-sm mb-3">
                      Current thumbnail:
                    </p>
                    <img
                      src={formData.thumbnailUrl}
                      alt="Current Thumbnail"
                      className="w-full max-w-xs rounded-lg border border-slate-600/50"
                    />
                  </div>
                )}

                <div className="border-2 border-dashed border-slate-600/50 hover:border-slate-500/50 rounded-xl p-6 transition-colors duration-200 bg-slate-800/20">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setThumbnailFile(e.target.files?.[0] || null)
                    }
                    className="hidden"
                    id="thumbnail-upload"
                  />
                  <label
                    htmlFor="thumbnail-upload"
                    className="cursor-pointer flex flex-col items-center justify-center space-y-3"
                  >
                    <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center">
                      <span className="text-2xl">🖼️</span>
                    </div>
                    <div className="text-center">
                      <p className="text-slate-300 font-medium">
                        {formData.thumbnailUrl
                          ? "Replace Thumbnail"
                          : "Upload Thumbnail"}
                      </p>
                      <p className="text-slate-400 text-sm">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </label>
                </div>

                {thumbnailFile && (
                  <div className="relative group animate-in slide-in-from-bottom-4 fade-in duration-300">
                    <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/50">
                      <p className="text-slate-400 text-sm mb-3">
                        New thumbnail:
                      </p>
                      <img
                        src={URL.createObjectURL(thumbnailFile)}
                        alt="New Thumbnail Preview"
                        className="w-full max-w-xs rounded-lg border border-slate-600/50"
                      />
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-slate-300 text-sm font-medium">
                          {thumbnailFile.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => setThumbnailFile(null)}
                          className="bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg px-3 py-1.5 text-sm transition-all duration-200 border border-red-500/30 hover:border-red-500/50"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Video Upload */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-300">
                  Video Demo
                </label>

                {/* Current Video Display */}
                {formData.videoUrl && !videoFile && (
                  <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/50">
                    <p className="text-slate-400 text-sm mb-3">
                      Current video:
                    </p>
                    <video
                      src={formData.videoUrl}
                      controls
                      className="w-full max-w-xs rounded-lg border border-slate-600/50"
                    />
                  </div>
                )}

                <div className="border-2 border-dashed border-slate-600/50 hover:border-slate-500/50 rounded-xl p-6 transition-colors duration-200 bg-slate-800/20">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                    className="hidden"
                    id="video-upload"
                  />
                  <label
                    htmlFor="video-upload"
                    className="cursor-pointer flex flex-col items-center justify-center space-y-3"
                  >
                    <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center">
                      <span className="text-2xl">🎥</span>
                    </div>
                    <div className="text-center">
                      <p className="text-slate-300 font-medium">
                        {formData.videoUrl ? "Replace Video" : "Upload Video"}
                      </p>
                      <p className="text-slate-400 text-sm">
                        MP4, MOV, AVI up to 100MB
                      </p>
                    </div>
                  </label>
                </div>

                {videoFile && (
                  <div className="relative group animate-in slide-in-from-bottom-4 fade-in duration-300">
                    <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/50">
                      <p className="text-slate-400 text-sm mb-3">New video:</p>
                      <video
                        src={URL.createObjectURL(videoFile)}
                        controls
                        className="w-full max-w-xs rounded-lg border border-slate-600/50"
                      />
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-slate-300 text-sm font-medium">
                          {videoFile.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => setVideoFile(null)}
                          className="bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg px-3 py-1.5 text-sm transition-all duration-200 border border-red-500/30 hover:border-red-500/50"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/*Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate("/admin/portfolio")}
                className="flex-1 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 border border-slate-600/50 hover:border-slate-500/50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg ${
                  saving
                    ? "bg-slate-600/50 text-slate-400 cursor-not-allowed border border-slate-600/50"
                    : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105"
                }`}
              >
                {saving ? (
                  <span className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                    Updating Portfolio...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <span className="text-lg">💾</span>
                    Save Changes
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPortfolioPage;
