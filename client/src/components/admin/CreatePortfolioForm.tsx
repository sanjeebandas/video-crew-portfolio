import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { uploadImage, uploadVideo } from "../../services/upload";
import api from "../../services/api";
import { getToken } from "../../utils/helpers";

type ErrorState = {
  message: string;
  type: 'upload' | 'api' | 'network' | 'validation' | 'unknown';
  retryable: boolean;
  component?: string;
};

type Props = {
  onCreated?: () => void;
  onUpdated?: () => void;
  onClose: () => void;
  editMode?: boolean;
  editData?: any;
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

const CreatePortfolioForm = ({ onCreated, onUpdated, onClose, editMode, editData }: Props) => {
  const [formData, setFormData] = useState<PortfolioFormData>(initialState);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [thumbnailError, setThumbnailError] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  // Robust error handling states
  const [error, setError] = useState<ErrorState | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isOffline, setIsOffline] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{thumbnail: number, video: number}>({thumbnail: 0, video: 0});
  const [isUploading, setIsUploading] = useState(false);

  // File size constants
  const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
  const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB
  const MAX_TITLE_LIMIT = 75; // Character limit for title
  const MAX_DESC_LIMIT = 300; // Character limit for description

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

  // Retry handler (same pattern as Dashboard)
  const handleRetry = useCallback(async () => {
    if (retryCount >= MAX_RETRIES) return;

    try {
      setIsRetrying(true);
      const newRetryCount = retryCount + 1;
      setRetryCount(newRetryCount);

      // Clear errors and retry
      setError(null);
      setThumbnailError(null);
      setVideoError(null);

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

  // Character limit helper functions
  const getCharLimitColor = (currentLength: number, maxLength: number) => {
    const percentage = (currentLength / maxLength) * 100;
    if (percentage >= 90) return "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/50";
    if (percentage >= 75) return "border-yellow-500/50 focus:border-yellow-500/50 focus:ring-yellow-500/50";
    return "border-emerald-500/50 focus:border-emerald-500/50 focus:ring-emerald-500/50";
  };

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
    if (editMode && editData) {
      // Map the edit data to form data structure
      setFormData({
        title: editData.title || "",
        description: editData.description || "",
        category: editData.category || "",
        client: editData.client || "",
        thumbnailUrl: editData.thumbnailUrl || "",
        videoUrl: editData.videoUrl || "",
        featured: editData.featured || false,
        displayOrder: editData.displayOrder || 0,
      });
      // If editing, set thumbnailFile and videoFile to null to allow new uploads
      setThumbnailFile(null);
      setVideoFile(null);
    } else if (!editMode) {
      // Reset form when not in edit mode
      setFormData(initialState);
      setThumbnailFile(null);
      setVideoFile(null);
    }
    // Clear errors when form data changes
    setErrors({});
  }, [editMode, editData]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const target = e.target;
    const { name, value, type } = target;

    // Check character limits for title and description
    if (name === "title" && value.length > MAX_TITLE_LIMIT) {
      return; // Prevent input if title character limit is exceeded
    }
    if (name === "description" && value.length > MAX_DESC_LIMIT) {
      return; // Prevent input if description character limit is exceeded
    }

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
    const token = getToken();
    if (!token) {
      throw new Error("Not authenticated. Please log in again.");
    }

    // Validate files before upload
    if (thumbnailFile && !validateImageFile(thumbnailFile)) {
      throw new Error(thumbnailError || "Invalid thumbnail file");
    }
    if (videoFile && !validateVideoFile(videoFile)) {
      throw new Error(videoError || "Invalid video file");
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

    setLoading(true);
    setError(null);
    const token = getToken();

    try {
      const media = await uploadMedia();
      const payload = { ...formData, ...media };

      if (editMode) {
        // Update existing portfolio item
        await api.put(`/portfolio/${editData._id}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Portfolio updated successfully!");
        onUpdated?.();
      } else {
        // Create new portfolio item
        await api.post("/portfolio", payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Portfolio created successfully!");
        onCreated?.();
      }

      // Backend automatically creates notifications for portfolio operations
      setRetryCount(0); // Reset retry count on success

      setFormData(initialState);
      setThumbnailFile(null);
      setVideoFile(null);
      setErrors({});
      onClose();
    } catch (err: any) {
      console.error("Submit error:", err);
      
      let errorMessage = "Failed to create portfolio.";
      let errorType: ErrorState['type'] = 'api';
      let retryable = true;

      // Determine specific error type and message
      if (err?.response?.status === 401) {
        errorMessage = "Authentication expired. Please log in again.";
        errorType = 'api';
        retryable = false;
      } else if (err?.response?.status === 403) {
        errorMessage = "Access denied. You don't have permission to create/update portfolio items.";
        errorType = 'api';
        retryable = false;
      } else if (err?.response?.status === 404) {
        errorMessage = "Portfolio service not found. Please contact support.";
        errorType = 'api';
        retryable = true;
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
      setLoading(false);
      setIsRetrying(false);
    }
  };

  // Error boundary fallback - prevent form crashes
  if (error && !error.retryable && retryCount >= MAX_RETRIES) {
    return (
      <div className="bg-black text-white w-full max-w-3xl max-h-[90vh] rounded-xl border border-gray-700 overflow-hidden">
        <div className="p-6 text-center">
          <div className="bg-red-900/20 border border-red-600 rounded-xl p-6">
            <div className="text-red-400 mb-4">
              <i className="fas fa-exclamation-triangle text-2xl"></i>
              <p className="mt-2">Portfolio form is temporarily unavailable</p>
            </div>
            <div className="space-y-3">
              <p className="text-gray-300 text-sm">
                {error.message}
              </p>
              <button
                onClick={() => {
                  setRetryCount(0);
                  setError(null);
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <i className="fas fa-redo mr-2"></i>Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white w-full max-w-3xl max-h-[90vh] rounded-xl border border-gray-700 overflow-hidden">
      {/* Scrollable Content */}
      <div className="overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="sticky top-0 bg-black z-10 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-700">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                {editMode ? "Edit Portfolio Item" : "Create Portfolio Item"}
              </h2>
              <p className="text-gray-400 text-xs sm:text-sm mt-1">
                {editMode ? "Modify your project details" : "Add a new project to your portfolio"}
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
          </div>
        </div>

        {/* Form Content */}
        <div className="p-4 sm:p-6">
          {/* Error Display */}
          {error && (
            <div className="mb-6 bg-red-900/20 border border-red-600 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-red-400">
                  <i className="fas fa-exclamation-triangle"></i>
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
          )}

          {/* Upload Progress */}
          {isUploading && (
            <div className="mb-6 bg-blue-900/20 border border-blue-600 rounded-xl p-4">
              <div className="flex items-center gap-2 text-blue-400 mb-2">
                <i className="fas fa-clock"></i>
                <span className="text-sm">Uploading files...</span>
              </div>
              <div className="space-y-2">
                {thumbnailFile && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-300">Thumbnail:</span>
                    <div className="flex-1 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress.thumbnail}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-400">{uploadProgress.thumbnail}%</span>
                  </div>
                )}
                {videoFile && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-300">Video:</span>
                    <div className="flex-1 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress.video}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-400">{uploadProgress.video}%</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Basic Information Section */}
            <div className="bg-black border border-gray-700 rounded-xl p-4 sm:p-6 space-y-4 sm:space-y-5">
              <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                Basic Information
              </h3>

              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                    Project Title *
                  </label>
                  <input
                    name="title"
                    placeholder="E-commerce Redesign"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    maxLength={MAX_TITLE_LIMIT}
                    className={`w-full bg-gray-800 border rounded-xl p-3 sm:p-4 placeholder-gray-400 text-white focus:outline-none focus:ring-2 transition-all duration-200 hover:border-gray-500 text-sm sm:text-base ${
                      errors.title 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : formData.title.length > 0 
                          ? getCharLimitColor(formData.title.length, MAX_TITLE_LIMIT)
                          : "border-gray-600 focus:ring-emerald-500 focus:border-emerald-500"
                    }`}
                  />
                  {errors.title && (
                    <p className="text-red-400 text-sm mt-1">{errors.title}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    placeholder="Describe your project in detail..."
                    required
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    maxLength={MAX_DESC_LIMIT}
                    className={`w-full bg-gray-800 border rounded-xl p-3 sm:p-4 placeholder-gray-400 text-white focus:outline-none focus:ring-2 transition-all duration-200 hover:border-gray-500 resize-none text-sm sm:text-base ${
                      formData.description.length > 0 
                        ? getCharLimitColor(formData.description.length, MAX_DESC_LIMIT)
                        : "border-gray-600 focus:ring-emerald-500 focus:border-emerald-500"
                    }`}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      required
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full bg-gray-800 border border-gray-600 rounded-xl p-3 sm:p-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 hover:border-gray-500 text-sm sm:text-base"
                    >
                      <option value="" disabled>
                        Select a category
                      </option>
                      <option value="e-learning">이러닝 영상</option>
                      <option value="corporate-event">기업 행사 영상</option>
                      <option value="advertisement/promotional">
                        광고 · 홍보 영상
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                      Client Name
                    </label>
                    <input
                      name="client"
                      placeholder="Optional"
                      value={formData.client}
                      onChange={handleChange}
                      className={`w-full bg-gray-800 border rounded-xl p-3 sm:p-4 placeholder-gray-400 text-white focus:outline-none focus:ring-2 transition-all duration-200 hover:border-gray-500 text-sm sm:text-base ${
                        errors.client 
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                          : "border-gray-600 focus:ring-emerald-500 focus:border-emerald-500"
                      }`}
                    />
                    {errors.client && (
                      <p className="text-red-400 text-sm mt-1">{errors.client}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                      Display Order
                    </label>
                    <input
                      type="number"
                      name="displayOrder"
                      min={0}
                      placeholder="1"
                      value={formData.displayOrder}
                      onChange={handleChange}
                      className="w-full bg-gray-800 border border-gray-600 rounded-xl p-3 sm:p-4 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 hover:border-gray-500 text-sm sm:text-base"
                    />
                  </div>

                  <div className="flex items-end">
                    <label className="flex items-center space-x-2 sm:space-x-3 bg-gray-700 p-3 sm:p-4 rounded-xl border border-gray-600 hover:border-gray-500 transition-colors duration-200 cursor-pointer group w-full">
                      <input
                        type="checkbox"
                        name="featured"
                        checked={formData.featured}
                        onChange={handleChange}
                        className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 bg-gray-700 border-gray-600 rounded focus:ring-emerald-500 focus:ring-2"
                      />
                      <span className="text-xs sm:text-sm text-gray-300 group-hover:text-white transition-colors duration-200">
                        <i className="fas fa-star mr-1"></i>Feature this project
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Media Upload Section */}
            <div className="bg-black border border-gray-700 rounded-xl p-4 sm:p-6 space-y-4 sm:space-y-5">
              <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Media Assets
              </h3>

              {/* Thumbnail Upload */}
              <div className="space-y-2 sm:space-y-3">
                <label className="block text-xs sm:text-sm font-medium text-gray-300">
                  Thumbnail Image
                </label>
                <div
                  className={`border-2 border-dashed rounded-xl p-4 sm:p-6 transition-colors duration-200 bg-gray-800 ${
                    thumbnailError
                      ? "border-red-500 hover:border-red-400 bg-red-500/5"
                      : "border-gray-600 hover:border-gray-500"
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
                    className="cursor-pointer flex flex-col items-center justify-center space-y-2 sm:space-y-3"
                  >
                    <div
                      className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center ${
                        thumbnailError
                          ? "bg-red-500/20 border-2 border-red-500"
                          : "bg-gray-700"
                      }`}
                    >
                      <i className={`text-lg sm:text-2xl ${
                        thumbnailError ? "fas fa-exclamation-triangle text-red-400" : "fas fa-image text-gray-300"
                      }`}></i>
                    </div>
                    <div className="text-center">
                      <p
                        className={`font-medium text-xs sm:text-sm ${
                          thumbnailError ? "text-red-400" : "text-gray-300"
                        }`}
                      >
                        Upload Thumbnail
                      </p>
                      <p className="text-gray-400 text-xs sm:text-sm">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </label>
                </div>

                {/* Error message for thumbnail */}
                {thumbnailError && (
                  <div className="bg-red-500/10 border border-red-600 rounded-xl p-3 sm:p-4">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <i className="fas fa-exclamation-triangle text-red-400 text-base sm:text-lg"></i>
                      <div className="flex-1">
                        <p className="text-red-400 font-medium text-xs sm:text-sm">
                          File Validation Error
                        </p>
                        <p className="text-red-300 text-xs sm:text-sm mt-1">
                          {thumbnailError}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {thumbnailFile && !thumbnailError && (
                  <div className="relative group">
                    <div className="bg-gray-700 rounded-xl p-3 sm:p-4 border border-gray-600">
                      <img
                        src={URL.createObjectURL(thumbnailFile)}
                        alt="Thumbnail Preview"
                        className="w-full max-w-xs rounded-lg border border-gray-600"
                      />
                      <div className="mt-2 sm:mt-3 flex items-center justify-between">
                        <div className="flex-1">
                          <span className="text-gray-300 text-xs sm:text-sm font-medium">
                            {thumbnailFile.name}
                          </span>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-gray-400 text-xs">
                              {formatFileSize(thumbnailFile.size)}
                            </span>
                            <span className="text-emerald-400 text-xs font-medium">
                              <i className="fas fa-check mr-1"></i>Valid
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setThumbnailFile(null);
                            setThumbnailError(null);
                          }}
                          className="bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm transition-all duration-200 border border-red-500 hover:border-red-400"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Show existing thumbnail in edit mode */}
                {editMode && formData.thumbnailUrl && !thumbnailFile && (
                  <div className="relative group">
                    <div className="bg-gray-700 rounded-xl p-3 sm:p-4 border border-gray-600">
                      <img
                        src={formData.thumbnailUrl}
                        alt="Current Thumbnail"
                        className="w-full max-w-xs rounded-lg border border-gray-600"
                      />
                      <div className="mt-2 sm:mt-3 flex items-center justify-between">
                        <div className="flex-1">
                          <span className="text-gray-300 text-xs sm:text-sm font-medium">
                            Current Thumbnail
                          </span>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-blue-400 text-xs font-medium">
                              <i className="fas fa-camera mr-1"></i>Existing
                            </span>
                          </div>
                        </div>
                        <span className="text-gray-400 text-xs">
                          Upload new image to replace
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Video Upload */}
              <div className="space-y-2 sm:space-y-3">
                <label className="block text-xs sm:text-sm font-medium text-gray-300">
                  Video Demo
                </label>
                <div
                  className={`border-2 border-dashed rounded-xl p-4 sm:p-6 transition-colors duration-200 bg-gray-800 ${
                    videoError
                      ? "border-red-500 hover:border-red-400 bg-red-500/5"
                      : "border-gray-600 hover:border-gray-500"
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
                    className="cursor-pointer flex flex-col items-center justify-center space-y-2 sm:space-y-3"
                  >
                    <div
                      className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center ${
                        videoError
                          ? "bg-red-500/20 border-2 border-red-500"
                          : "bg-gray-700"
                      }`}
                    >
                      <i className={`text-lg sm:text-2xl ${
                        videoError ? "fas fa-exclamation-triangle text-red-400" : "fas fa-video text-gray-300"
                      }`}></i>
                    </div>
                    <div className="text-center">
                      <p
                        className={`font-medium text-xs sm:text-sm ${
                          videoError ? "text-red-400" : "text-gray-300"
                        }`}
                      >
                        Upload Video
                      </p>
                      <p className="text-gray-400 text-xs sm:text-sm">
                        MP4, MOV, AVI up to 100MB
                      </p>
                    </div>
                  </label>
                </div>

                {/* Error message for video */}
                {videoError && (
                  <div className="bg-red-500/10 border border-red-600 rounded-xl p-3 sm:p-4">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <i className="fas fa-exclamation-triangle text-red-400 text-base sm:text-lg"></i>
                      <div className="flex-1">
                        <p className="text-red-400 font-medium text-xs sm:text-sm">
                          File Validation Error
                        </p>
                        <p className="text-red-300 text-xs sm:text-sm mt-1">
                          {videoError}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {videoFile && !videoError && (
                  <div className="relative group">
                    <div className="bg-gray-700 rounded-xl p-3 sm:p-4 border border-gray-600">
                      <video
                        src={URL.createObjectURL(videoFile)}
                        controls
                        className="w-full max-w-xs rounded-lg border border-gray-600"
                      />
                      <div className="mt-2 sm:mt-3 flex items-center justify-between">
                        <div className="flex-1">
                          <span className="text-gray-300 text-xs sm:text-sm font-medium">
                            {videoFile.name}
                          </span>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-gray-400 text-xs">
                              {formatFileSize(videoFile.size)}
                            </span>
                            <span className="text-emerald-400 text-xs font-medium">
                              <i className="fas fa-check mr-1"></i>Valid
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setVideoFile(null);
                            setVideoError(null);
                          }}
                          className="bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm transition-all duration-200 border border-red-500 hover:border-red-400"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Show existing video in edit mode */}
                {editMode && formData.videoUrl && !videoFile && (
                  <div className="relative group">
                    <div className="bg-gray-700 rounded-xl p-3 sm:p-4 border border-gray-600">
                      <video
                        src={formData.videoUrl}
                        controls
                        className="w-full max-w-xs rounded-lg border border-gray-600"
                      />
                      <div className="mt-2 sm:mt-3 flex items-center justify-between">
                        <div className="flex-1">
                          <span className="text-gray-300 text-xs sm:text-sm font-medium">
                            Current Video
                          </span>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-blue-400 text-xs font-medium">
                              <i className="fas fa-video mr-1"></i>Existing
                            </span>
                          </div>
                        </div>
                        <span className="text-gray-400 text-xs">
                          Upload new video to replace
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 sm:gap-4 pt-3 sm:pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium transition-all duration-200 border border-gray-600 hover:border-gray-500 text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !!thumbnailError || !!videoError || isOffline || isRetrying}
                className={`flex-1 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base ${
                  loading || !!thumbnailError || !!videoError || isOffline || isRetrying
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed border border-gray-600"
                    : "bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-600 hover:border-emerald-500 hover:scale-105"
                }`}
              >
                {loading || isRetrying ? (
                  <span className="flex items-center justify-center gap-2 sm:gap-3">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xs sm:text-sm">
                      {isRetrying ? "Retrying..." : (editMode ? "Updating Portfolio..." : "Creating Portfolio...")}
                    </span>
                  </span>
                ) : isOffline ? (
                  <span className="flex items-center justify-center gap-1 sm:gap-2">
                    <i className="fas fa-wifi text-base sm:text-lg"></i>
                    <span className="text-xs sm:text-sm">Offline - Cannot Submit</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-1 sm:gap-2">
                    <i className={`fas ${editMode ? "fa-save" : "fa-rocket"} text-base sm:text-lg`}></i>
                    <span className="text-xs sm:text-sm">{editMode ? "Update Portfolio" : "Create Portfolio"}</span>
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
