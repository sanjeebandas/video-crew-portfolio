import { useState } from "react";
import toast from "react-hot-toast";
import { uploadImage, uploadVideo } from "../../services/upload";
import api from "../../services/api";

type Props = {
  onCreated?: () => void;
  onClose: () => void;
};

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

const CreatePortfolioForm = ({ onCreated, onClose }: Props) => {
  const [formData, setFormData] = useState<PortfolioFormData>(initialState);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [thumbnailError, setThumbnailError] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);

  // File size constants
  const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
  const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB

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

  // File validation functions
  const validateImageFile = (file: File): boolean => {
    setThumbnailError(null);

    if (file.size > MAX_IMAGE_SIZE) {
      setThumbnailError(
        `Image size must be less than 10MB. Current size: ${(
          file.size /
          (1024 * 1024)
        ).toFixed(1)}MB`
      );
      return false;
    }

    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!validTypes.includes(file.type)) {
      setThumbnailError(
        "Please upload a valid image file (JPG, PNG, GIF, WebP)"
      );
      return false;
    }

    return true;
  };

  const validateVideoFile = (file: File): boolean => {
    setVideoError(null);

    if (file.size > MAX_VIDEO_SIZE) {
      setVideoError(
        `Video size must be less than 100MB. Current size: ${(
          file.size /
          (1024 * 1024)
        ).toFixed(1)}MB`
      );
      return false;
    }

    const validTypes = [
      "video/mp4",
      "video/mov",
      "video/avi",
      "video/webm",
      "video/quicktime",
    ];
    if (!validTypes.includes(file.type)) {
      setVideoError("Please upload a valid video file (MP4, MOV, AVI, WebM)");
      return false;
    }

    return true;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const uploadMedia = async () => {
    const uploaded: Partial<PortfolioFormData> = {};
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not authenticated. Please log in again.");

    // Validate files before upload
    if (thumbnailFile && !validateImageFile(thumbnailFile)) {
      throw new Error(thumbnailError || "Invalid thumbnail file");
    }
    if (videoFile && !validateVideoFile(videoFile)) {
      throw new Error(videoError || "Invalid video file");
    }

    try {
      if (thumbnailFile) {
        uploaded.thumbnailUrl = await uploadImage(thumbnailFile);
      }
      if (videoFile) {
        uploaded.videoUrl = await uploadVideo(videoFile);
      }
      return uploaded;
    } catch (uploadErr: any) {
      throw uploadErr;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const media = await uploadMedia();
      const payload = { ...formData, ...media };

      await api.post("/portfolio", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Portfolio created!");
      onCreated?.();
      setFormData(initialState);
      setThumbnailFile(null);
      setVideoFile(null);
      onClose();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to create portfolio."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white w-full max-w-3xl max-h-[90vh] rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden">
      {/* Scrollable Content */}
      <div className="overflow-y-auto max-h-[90vh] scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-br from-slate-800 to-slate-900 backdrop-blur-sm z-10 px-6 py-4 border-b border-slate-700/50">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                Create Portfolio Item
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                Add a new project to your portfolio
              </p>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
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
                      onChange={handleChange}
                      className="w-full bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200 hover:border-slate-500/50"
                    >
                      <option value="" disabled>
                        Select a category
                      </option>
                      <option value="advertisement/promotional">
                        광고 · 홍보 영상
                      </option>
                      <option value="e-learning">이러닝 영상</option>
                      <option value="corporate-event">기업 행사 영상</option>
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

            {/* Media Upload Section */}
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
                <div
                  className={`border-2 border-dashed rounded-xl p-6 transition-colors duration-200 bg-slate-800/20 ${
                    thumbnailError
                      ? "border-red-500/50 hover:border-red-400/50 bg-red-500/5"
                      : "border-slate-600/50 hover:border-slate-500/50"
                  }`}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      if (file) {
                        if (validateImageFile(file)) {
                          setThumbnailFile(file);
                        }
                      } else {
                        setThumbnailFile(null);
                        setThumbnailError(null);
                      }
                    }}
                    className="hidden"
                    id="thumbnail-upload"
                  />
                  <label
                    htmlFor="thumbnail-upload"
                    className="cursor-pointer flex flex-col items-center justify-center space-y-3"
                  >
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center ${
                        thumbnailError
                          ? "bg-red-500/20 border-2 border-red-500/30"
                          : "bg-slate-700/50"
                      }`}
                    >
                      <span className="text-2xl">
                        {thumbnailError ? "⚠️" : "🖼️"}
                      </span>
                    </div>
                    <div className="text-center">
                      <p
                        className={`font-medium ${
                          thumbnailError ? "text-red-400" : "text-slate-300"
                        }`}
                      >
                        Upload Thumbnail
                      </p>
                      <p className="text-slate-400 text-sm">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </label>
                </div>

                {/* Error message for thumbnail */}
                {thumbnailError && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 animate-in slide-in-from-top-2 fade-in duration-300">
                    <div className="flex items-start gap-3">
                      <span className="text-red-400 text-lg">⚠️</span>
                      <div className="flex-1">
                        <p className="text-red-400 font-medium text-sm">
                          File Validation Error
                        </p>
                        <p className="text-red-300 text-sm mt-1">
                          {thumbnailError}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {thumbnailFile && !thumbnailError && (
                  <div className="relative group animate-in slide-in-from-bottom-4 fade-in duration-300">
                    <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/50">
                      <img
                        src={URL.createObjectURL(thumbnailFile)}
                        alt="Thumbnail Preview"
                        className="w-full max-w-xs rounded-lg border border-slate-600/50"
                      />
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex-1">
                          <span className="text-slate-300 text-sm font-medium">
                            {thumbnailFile.name}
                          </span>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-slate-400 text-xs">
                              {formatFileSize(thumbnailFile.size)}
                            </span>
                            <span className="text-emerald-400 text-xs font-medium">
                              ✓ Valid
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setThumbnailFile(null);
                            setThumbnailError(null);
                          }}
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
                <div
                  className={`border-2 border-dashed rounded-xl p-6 transition-colors duration-200 bg-slate-800/20 ${
                    videoError
                      ? "border-red-500/50 hover:border-red-400/50 bg-red-500/5"
                      : "border-slate-600/50 hover:border-slate-500/50"
                  }`}
                >
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      if (file) {
                        if (validateVideoFile(file)) {
                          setVideoFile(file);
                        }
                      } else {
                        setVideoFile(null);
                        setVideoError(null);
                      }
                    }}
                    className="hidden"
                    id="video-upload"
                  />
                  <label
                    htmlFor="video-upload"
                    className="cursor-pointer flex flex-col items-center justify-center space-y-3"
                  >
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center ${
                        videoError
                          ? "bg-red-500/20 border-2 border-red-500/30"
                          : "bg-slate-700/50"
                      }`}
                    >
                      <span className="text-2xl">
                        {videoError ? "⚠️" : "🎥"}
                      </span>
                    </div>
                    <div className="text-center">
                      <p
                        className={`font-medium ${
                          videoError ? "text-red-400" : "text-slate-300"
                        }`}
                      >
                        Upload Video
                      </p>
                      <p className="text-slate-400 text-sm">
                        MP4, MOV, AVI up to 100MB
                      </p>
                    </div>
                  </label>
                </div>

                {/* Error message for video */}
                {videoError && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 animate-in slide-in-from-top-2 fade-in duration-300">
                    <div className="flex items-start gap-3">
                      <span className="text-red-400 text-lg">⚠️</span>
                      <div className="flex-1">
                        <p className="text-red-400 font-medium text-sm">
                          File Validation Error
                        </p>
                        <p className="text-red-300 text-sm mt-1">
                          {videoError}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {videoFile && !videoError && (
                  <div className="relative group animate-in slide-in-from-bottom-4 fade-in duration-300">
                    <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/50">
                      <video
                        src={URL.createObjectURL(videoFile)}
                        controls
                        className="w-full max-w-xs rounded-lg border border-slate-600/50"
                      />
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex-1">
                          <span className="text-slate-300 text-sm font-medium">
                            {videoFile.name}
                          </span>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-slate-400 text-xs">
                              {formatFileSize(videoFile.size)}
                            </span>
                            <span className="text-emerald-400 text-xs font-medium">
                              ✓ Valid
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setVideoFile(null);
                            setVideoError(null);
                          }}
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

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 border border-slate-600/50 hover:border-slate-500/50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !!thumbnailError || !!videoError}
                className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg ${
                  loading || !!thumbnailError || !!videoError
                    ? "bg-slate-600/50 text-slate-400 cursor-not-allowed border border-slate-600/50"
                    : "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-105"
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                    Creating Portfolio...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <span className="text-lg">🚀</span>
                    Create Portfolio
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

export default CreatePortfolioForm;
