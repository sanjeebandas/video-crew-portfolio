import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";
import { uploadImage, uploadVideo } from "../services/upload";
import { getToken } from "../utils/helpers";

type ErrorState = {
  message: string;
  type: 'fetch' | 'upload' | 'api' | 'network' | 'validation' | 'unknown';
  retryable: boolean;
  component?: string;
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
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  // Robust error handling states
  const [error, setError] = useState<ErrorState | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isOffline, setIsOffline] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{thumbnail: number, video: number}>({thumbnail: 0, video: 0});
  const [isUploading, setIsUploading] = useState(false);

  // Retry configuration
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 2000; // 2 seconds

  // Network status detection
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      if (error?.type === 'network') {
        setError(null);
        // Auto-retry when coming back online
        if (retryCount < MAX_RETRIES) {
          handleRetry();
        }
      }
    };

    const handleOffline = () => {
      setIsOffline(true);
      if (!error) {
        setError({
          message: "You're currently offline. File uploads and form submission are unavailable.",
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
  }, [error, retryCount]);

  // Retry handler
  const handleRetry = useCallback(async () => {
    if (retryCount >= MAX_RETRIES) return;

    try {
      setIsRetrying(true);
      const newRetryCount = retryCount + 1;
      setRetryCount(newRetryCount);

      // Clear errors and retry
      setError(null);

      // Simulate retry delay
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * newRetryCount));

      // Reset retry count on success
      setRetryCount(0);
    } catch (error) {
      console.error("Retry failed:", error);
    } finally {
      setIsRetrying(false);
    }
  }, [retryCount]);

  // Validation functions
  const validateName = (name: string): boolean => {
    if (!name.trim()) return false;
    // Must contain at least one letter, can have numbers, no special characters
    const nameRegex = /^(?=.*[a-zA-Z가-힣])[a-zA-Z가-힣0-9\s]+$/;
    return nameRegex.test(name.trim());
  };

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = "프로젝트 제목을 입력해주세요.";
    } else if (!validateName(formData.title)) {
      newErrors.title = "프로젝트 제목은 한글, 영문, 숫자를 포함할 수 있지만 특수문자는 사용할 수 없습니다.";
    }

    // Client name validation (optional field)
    if (formData.client && formData.client.trim() && !validateName(formData.client)) {
      newErrors.client = "클라이언트명은 한글, 영문, 숫자를 포함할 수 있지만 특수문자는 사용할 수 없습니다.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        setError(null);
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
        setRetryCount(0); // Reset retry count on success
      } catch (err: any) {
        console.error("Fetch error:", err);
        
        let errorMessage = "Failed to fetch portfolio item.";
        let errorType: ErrorState['type'] = 'fetch';
        let retryable = true;

        // Determine specific error type and message
        if (err?.response?.status === 401) {
          errorMessage = "Authentication expired. Please log in again.";
          errorType = 'fetch';
          retryable = false;
        } else if (err?.response?.status === 403) {
          errorMessage = "Access denied. You don't have permission to view this portfolio item.";
          errorType = 'fetch';
          retryable = false;
        } else if (err?.response?.status === 404) {
          errorMessage = "Portfolio item not found. It may have been deleted.";
          errorType = 'fetch';
          retryable = false;
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
              fetchItem();
            }, RETRY_DELAY * newRetryCount);
          }
        } else if (!retryable) {
          // Navigate back for non-retryable errors
          setTimeout(() => {
            navigate("/admin/portfolio");
          }, 3000);
        }
      } finally {
        setLoading(false);
        setIsRetrying(false);
      }
    };

    if (id) fetchItem();
  }, [id, navigate, retryCount]);

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

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const uploadMedia = async () => {
    const uploaded: Partial<PortfolioFormData> = {};
    const token = getToken();
    if (!token) {
      throw new Error("Not authenticated. Please log in again.");
    }

    try {
      setIsUploading(true);
      setUploadProgress({thumbnail: 0, video: 0});

      // Upload thumbnail with progress tracking
      if (thumbnailFile) {
        setUploadProgress(prev => ({...prev, thumbnail: 10}));
        uploaded.thumbnailUrl = await uploadImage(thumbnailFile);
        setUploadProgress(prev => ({...prev, thumbnail: 100}));
      }

      // Upload video with progress tracking
      if (videoFile) {
        setUploadProgress(prev => ({...prev, video: 10}));
        uploaded.videoUrl = await uploadVideo(videoFile);
        setUploadProgress(prev => ({...prev, video: 100}));
      }

      return uploaded;
    } catch (uploadErr: any) {
      console.error("Upload error:", uploadErr);
      
      let errorMessage = "Failed to upload media files.";
      let errorType: ErrorState['type'] = 'upload';
      let retryable = true;

      // Determine specific error type and message
      if (uploadErr?.response?.status === 401) {
        errorMessage = "Authentication expired. Please log in again.";
        errorType = 'api';
        retryable = false;
      } else if (uploadErr?.response?.status === 403) {
        errorMessage = "Access denied. You don't have permission to upload files.";
        errorType = 'api';
        retryable = false;
      } else if (uploadErr?.response?.status === 413) {
        errorMessage = "File too large. Please reduce file size and try again.";
        errorType = 'upload';
        retryable = true;
      } else if (uploadErr?.response?.status >= 500) {
        errorMessage = "Server error during upload. Please try again.";
        errorType = 'upload';
        retryable = true;
      } else if (uploadErr?.message?.includes('Network Error') || uploadErr?.code === 'NETWORK_ERROR') {
        errorMessage = "Network connection failed. Please check your internet connection.";
        errorType = 'network';
        retryable = true;
      } else if (uploadErr?.message?.includes('timeout')) {
        errorMessage = "Upload timed out. Please try again.";
        errorType = 'upload';
        retryable = true;
      }

      setError({
        message: errorMessage,
        type: errorType,
        retryable
      });

      throw uploadErr;
    } finally {
      setIsUploading(false);
      setUploadProgress({thumbnail: 0, video: 0});
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("입력 정보를 확인해주세요.");
      return;
    }

    if (isOffline) {
      toast.error("You're currently offline. Please check your connection.");
      return;
    }

    setSaving(true);
    setError(null);
    const token = getToken();

    try {
      const media = await uploadMedia();
      const payload = { ...formData, ...media };

      await api.put(`/portfolio/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Portfolio updated successfully!");
      setRetryCount(0); // Reset retry count on success
      navigate("/admin/portfolio");
    } catch (err: any) {
      console.error("Submit error:", err);
      
      let errorMessage = "Failed to update portfolio.";
      let errorType: ErrorState['type'] = 'api';
      let retryable = true;

      // Determine specific error type and message
      if (err?.response?.status === 401) {
        errorMessage = "Authentication expired. Please log in again.";
        errorType = 'api';
        retryable = false;
      } else if (err?.response?.status === 403) {
        errorMessage = "Access denied. You don't have permission to update this portfolio item.";
        errorType = 'api';
        retryable = false;
      } else if (err?.response?.status === 404) {
        errorMessage = "Portfolio item not found. It may have been deleted.";
        errorType = 'api';
        retryable = false;
      } else if (err?.response?.status >= 500) {
        errorMessage = "Server error. Our team has been notified.";
        errorType = 'api';
        retryable = true;
      } else if (err?.message?.includes('Network Error') || err?.code === 'NETWORK_ERROR') {
        errorMessage = "Network connection failed. Please check your internet connection.";
        errorType = 'network';
        retryable = true;
      } else if (err?.message?.includes('timeout')) {
        errorMessage = "Request timed out. Please try again.";
        errorType = 'api';
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
            handleSubmit(e);
          }, RETRY_DELAY * newRetryCount);
        }
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setSaving(false);
      setIsRetrying(false);
    }
  };

  // Error boundary fallback - prevent page crashes
  if (error && !error.retryable && retryCount >= MAX_RETRIES) {
    return (
      <div className="bg-gradient-to-br from-slate-900 to-black min-h-screen p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6 text-center">
            <div className="text-red-400 mb-4">
              <span className="text-2xl">⚠️</span>
              <p className="mt-2">Edit Portfolio page is temporarily unavailable</p>
            </div>
            <div className="space-y-3">
              <p className="text-slate-300 text-sm">
                {error.message}
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => {
                    setRetryCount(0);
                    setError(null);
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  🔄 Try Again
                </button>
                <button
                  onClick={() => navigate("/admin/portfolio")}
                  className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  ← Back to Portfolio
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            
            {/* Network Status Indicator */}
            {isOffline && (
              <div className="mt-2 flex items-center gap-2 text-yellow-400 text-xs">
                <span>📡</span>
                <span>You're currently offline</span>
              </div>
            )}
            
            {/* Retry Status */}
            {isRetrying && (
              <div className="mt-2 flex items-center gap-2 text-blue-400 text-xs">
                <span>⏳</span>
                <span>Retrying... ({retryCount}/{MAX_RETRIES})</span>
              </div>
            )}
          </div>
        </div>

        {/*Form Container */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden">
          {/* Error Display */}
          {error && (
            <div className="p-6 pb-0">
              <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-red-400">
                    <span>⚠️</span>
                    <span className="text-sm">{error.message}</span>
                  </div>
                  {error.retryable && (
                    <button
                      onClick={handleRetry}
                      disabled={isRetrying}
                      className="text-red-400 hover:text-red-300 text-xs font-medium transition-colors"
                    >
                      {isRetrying ? "Retrying..." : "Retry"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Upload Progress */}
          {isUploading && (
            <div className="p-6 pb-0">
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4">
                <div className="flex items-center gap-2 text-blue-400 mb-2">
                  <span>⏳</span>
                  <span className="text-sm">Uploading files...</span>
                </div>
                <div className="space-y-2">
                  {thumbnailFile && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-300">Thumbnail:</span>
                      <div className="flex-1 bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress.thumbnail}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-slate-400">{uploadProgress.thumbnail}%</span>
                    </div>
                  )}
                  {videoFile && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-300">Video:</span>
                      <div className="flex-1 bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress.video}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-slate-400">{uploadProgress.video}%</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

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
                    className={`w-full bg-slate-800/50 backdrop-blur-sm border rounded-xl p-4 placeholder-slate-400 text-white focus:outline-none focus:ring-2 transition-all duration-200 hover:border-slate-500/50 ${
                      errors.title 
                        ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/50'
                        : 'border-slate-600/50 focus:ring-emerald-500/50 focus:border-emerald-500/50'
                    }`}
                  />
                  {errors.title && (
                    <p className="text-red-400 text-sm mt-1">{errors.title}</p>
                  )}
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
                      className={`w-full bg-slate-800/50 backdrop-blur-sm border rounded-xl p-4 placeholder-slate-400 text-white focus:outline-none focus:ring-2 transition-all duration-200 hover:border-slate-500/50 ${
                        errors.client 
                          ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/50'
                          : 'border-slate-600/50 focus:ring-emerald-500/50 focus:border-emerald-500/50'
                      }`}
                    />
                    {errors.client && (
                      <p className="text-red-400 text-sm mt-1">{errors.client}</p>
                    )}
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
                disabled={saving || isOffline || isRetrying}
                className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg ${
                  saving || isOffline || isRetrying
                    ? "bg-slate-600/50 text-slate-400 cursor-not-allowed border border-slate-600/50"
                    : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105"
                }`}
              >
                {saving || isRetrying ? (
                  <span className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                    {isRetrying ? "Retrying..." : "Updating Portfolio..."}
                  </span>
                ) : isOffline ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="text-lg">📡</span>
                    Offline - Cannot Save
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
