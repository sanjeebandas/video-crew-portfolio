# 📤 Complete File Upload System Guide

## 📋 Table of Contents
1. [System Overview](#system-overview)
2. [Architecture & Flow](#architecture--flow)
3. [Frontend Implementation](#frontend-implementation)
4. [Backend Implementation](#backend-implementation)
5. [Storage Configuration (Render)](#storage-configuration-render)
6. [File Serving](#file-serving)
7. [Error Handling](#error-handling)
8. [Step-by-Step Implementation](#step-by-step-implementation)
9. [Code Examples](#code-examples)
10. [Troubleshooting](#troubleshooting)

---

## 🎯 System Overview

This file upload system handles **images** and **videos** with the following features:

- ✅ **Authentication-protected uploads** (JWT token required)
- ✅ **File type validation** (images: JPEG, PNG, GIF, WebP | videos: MP4, MOV, AVI, WebM)
- ✅ **File size limits** (images: 10MB, videos: 100MB)
- ✅ **Persistent storage** on Render Premium disk
- ✅ **Static file serving** via Express
- ✅ **Unique filename generation** (timestamp + random number)
- ✅ **Progress tracking** and error handling
- ✅ **Retry mechanism** for failed uploads

---

## 🏗️ Architecture & Flow

### **Complete Upload Flow:**

```
┌─────────────────┐
│   User Browser  │
└────────┬────────┘
         │
         │ 1. User selects file
         ▼
┌─────────────────────────┐
│  Frontend Form Component │
│  - File validation       │
│  - Progress tracking     │
└────────┬────────────────┘
         │
         │ 2. FormData + JWT token
         ▼
┌─────────────────────────┐
│  Upload Service (API)   │
│  - uploadImage()        │
│  - uploadVideo()        │
└────────┬────────────────┘
         │
         │ 3. POST /api/upload/image or /video
         ▼
┌─────────────────────────┐
│  Express Backend        │
│  - Auth middleware      │
│  - Multer middleware    │
│  - Upload controller    │
└────────┬────────────────┘
         │
         │ 4. Save to disk
         ▼
┌─────────────────────────┐
│  Persistent Storage      │
│  (Render Premium Disk)  │
│  /var/data/uploads/     │
└────────┬────────────────┘
         │
         │ 5. Return URL
         ▼
┌─────────────────────────┐
│  Response: {             │
│    url: "https://...",   │
│    filename: "...",      │
│    size: 12345          │
│  }                      │
└─────────────────────────┘
         │
         │ 6. Store URL in database
         ▼
┌─────────────────────────┐
│  MongoDB Portfolio Item │
└─────────────────────────┘
```

### **File Serving Flow:**

```
┌─────────────────┐
│   User Browser  │
└────────┬────────┘
         │
         │ Request: GET /uploads/filename.jpg
         ▼
┌─────────────────────────┐
│  Express Static Middleware│
│  app.use("/uploads",    │
│    express.static(...)) │
└────────┬────────────────┘
         │
         │ Serve from disk
         ▼
┌─────────────────────────┐
│  Persistent Storage     │
│  /var/data/uploads/     │
└─────────────────────────┘
```

---

## 💻 Frontend Implementation

### **1. Upload Service (`client/src/services/upload.ts`)**

This service handles the HTTP requests to upload files:

```typescript
// src/services/upload.ts
import api from "./api";
import { getToken } from "../utils/helpers";

export const uploadImage = async (file: File): Promise<string> => {
  try {
    const token = getToken();
    if (!token) throw new Error("Unauthorized: No token found");

    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/upload/image", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        // Note: Don't set Content-Type header!
        // Browser will set it automatically with boundary for multipart/form-data
      },
    });

    return response.data.url; // Returns the full URL
  } catch (error) {
    console.error("Image upload failed:", error);
    throw error;
  }
};

export const uploadVideo = async (file: File): Promise<string> => {
  try {
    const token = getToken();
    if (!token) throw new Error("Unauthorized: No token found");

    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/upload/video", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.url;
  } catch (error) {
    console.error("Video upload failed:", error);
    throw error;
  }
};
```

**Key Points:**
- Uses `FormData` to send files
- Includes JWT token in Authorization header
- Returns the full URL from the server
- **Important:** Don't manually set `Content-Type` header - browser handles it automatically

### **2. Form Component Usage**

In your form component (e.g., `CreatePortfolioForm.tsx`):

```typescript
import { uploadImage, uploadVideo } from "../../services/upload";
import { getToken } from "../../utils/helpers";

// File state
const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
const [videoFile, setVideoFile] = useState<File | null>(null);
const [uploadProgress, setUploadProgress] = useState<{
  thumbnail: number;
  video: number;
}>({ thumbnail: 0, video: 0 });
const [isUploading, setIsUploading] = useState(false);

// File validation
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB

const validateImageFile = (file: File): boolean => {
  if (file.size > MAX_IMAGE_SIZE) {
    setThumbnailError(`Image size must be less than 10MB`);
    return false;
  }

  const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
  if (!validTypes.includes(file.type)) {
    setThumbnailError("Please upload a valid image file (JPG, PNG, GIF, WebP)");
    return false;
  }

  return true;
};

const validateVideoFile = (file: File): boolean => {
  if (file.size > MAX_VIDEO_SIZE) {
    setVideoError(`Video size must be less than 100MB`);
    return false;
  }

  const validTypes = ["video/mp4", "video/mov", "video/avi", "video/webm", "video/quicktime"];
  if (!validTypes.includes(file.type)) {
    setVideoError("Please upload a valid video file (MP4, MOV, AVI, WebM)");
    return false;
  }

  return true;
};

// Upload function
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
    setUploadProgress({ thumbnail: 0, video: 0 });

    // Upload thumbnail
    if (thumbnailFile) {
      setUploadProgress((prev) => ({ ...prev, thumbnail: 10 }));
      uploaded.thumbnailUrl = await uploadImage(thumbnailFile);
      setUploadProgress((prev) => ({ ...prev, thumbnail: 100 }));
    }

    // Upload video
    if (videoFile) {
      setUploadProgress((prev) => ({ ...prev, video: 10 }));
      uploaded.videoUrl = await uploadVideo(videoFile);
      setUploadProgress((prev) => ({ ...prev, video: 100 }));
    }

    return uploaded;
  } catch (uploadErr: any) {
    console.error("Upload error:", uploadErr);
    // Handle errors (see Error Handling section)
    throw uploadErr;
  } finally {
    setIsUploading(false);
    setUploadProgress({ thumbnail: 0, video: 0 });
  }
};

// Form submission
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!validateForm()) {
    toast.error("Please check your input");
    return;
  }

  setLoading(true);

  try {
    // Step 1: Upload media files first
    const media = await uploadMedia();

    // Step 2: Create/update portfolio with URLs
    const payload = { ...formData, ...media };

    if (editMode) {
      await api.put(`/portfolio/${editData._id}`, payload, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      toast.success("Portfolio updated successfully!");
    } else {
      await api.post("/portfolio", payload, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      toast.success("Portfolio created successfully!");
    }

    // Reset form
    setFormData(initialState);
    setThumbnailFile(null);
    setVideoFile(null);
    onClose();
  } catch (err: any) {
    console.error("Submit error:", err);
    toast.error(err?.response?.data?.message || "Failed to save portfolio");
  } finally {
    setLoading(false);
  }
};
```

### **3. File Input Component**

```typescript
// Thumbnail upload
<input
  type="file"
  accept="image/*"
  onChange={(e) => {
    const file = e.target.files?.[0];
    if (file && validateImageFile(file)) {
      setThumbnailFile(file);
      setThumbnailError(null);
    }
  }}
  className="hidden"
  id="thumbnail-upload"
/>

<label htmlFor="thumbnail-upload" className="cursor-pointer">
  Upload Thumbnail
</label>

{thumbnailFile && (
  <div>
    <img
      src={URL.createObjectURL(thumbnailFile)}
      alt="Preview"
      className="w-full max-w-xs rounded-lg"
    />
    <button onClick={() => setThumbnailFile(null)}>Remove</button>
  </div>
)}
```

---

## 🔧 Backend Implementation

### **1. Multer Configuration (`server/src/middlewares/multer.ts`)**

Multer handles multipart/form-data and saves files to disk:

```typescript
import multer from "multer";
import path from "path";
import fs from "fs";

// Environment-aware upload directory configuration
const getUploadDir = (): string => {
  const platformPaths = {
    // Render Premium persistent disk
    RENDER_PERSISTENT_DISK_PATH: process.env.RENDER_PERSISTENT_DISK_PATH || "",
    // Generic volume mount
    VOLUME_MOUNT_PATH: process.env.VOLUME_MOUNT_PATH || "",
    // Local development fallback
    LOCAL_UPLOAD_PATH: path.join(__dirname, "../../uploads"),
  };

  // Find first available platform path
  for (const [key, value] of Object.entries(platformPaths)) {
    if (value) {
      console.log(`📁 Using upload directory for ${key}: ${value}`);
      return value;
    }
  }

  // Final fallback
  const fallbackPath = path.join(__dirname, "../../uploads");
  console.log(`📁 Using fallback upload directory: ${fallbackPath}`);
  return fallbackPath;
};

const uploadDir = getUploadDir();

// Create uploads directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  try {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log(`✅ Created upload directory: ${uploadDir}`);
  } catch (error) {
    console.error("❌ Failed to create upload directory:", error);
    throw new Error(`Cannot create upload directory: ${uploadDir}`);
  }
} else {
  console.log(`✅ Upload directory already exists: ${uploadDir}`);
}

// File type validation
const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  const allowedImageTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];

  const allowedVideoTypes = [
    "video/mp4",
    "video/mov",
    "video/avi",
    "video/webm",
    "video/quicktime",
  ];

  const isImage = allowedImageTypes.includes(file.mimetype);
  const isVideo = allowedVideoTypes.includes(file.mimetype);

  if (isImage || isVideo) {
    console.log(`✅ File type accepted: ${file.mimetype} for ${file.originalname}`);
    cb(null, true);
  } else {
    console.log(`❌ File type rejected: ${file.mimetype} for ${file.originalname}`);
    cb(
      new Error(
        `Invalid file type: ${file.mimetype}. Only images (JPEG, PNG, GIF, WebP) and videos (MP4, MOV, AVI, WebM) are allowed.`
      ),
      false
    );
  }
};

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    // Generate unique filename: timestamp-randomNumber.extension
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

// Multer configuration
export const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit (covers both images and videos)
    files: 1, // Only one file per request
    fieldSize: 10 * 1024 * 1024, // 10MB for other form fields
  },
  fileFilter,
});
```

**Key Points:**
- Uses `diskStorage` to save files to disk
- Generates unique filenames to prevent conflicts
- Validates file types before saving
- Creates upload directory if it doesn't exist
- Environment-aware path selection (Render vs local)

### **2. Upload Routes (`server/src/routes/upload.ts`)**

```typescript
import { Router } from "express";
import { uploadImage, uploadVideo } from "../controllers/upload.controller";
import { upload } from "../middlewares/multer";
import { authenticateToken } from "../middlewares/auth.middleware";

const router = Router();

// POST /api/upload/image
router.post("/image", authenticateToken, upload.single("file"), uploadImage);

// POST /api/upload/video
router.post("/video", authenticateToken, upload.single("file"), uploadVideo);

export default router;
```

**Route Flow:**
1. `authenticateToken` - Validates JWT token
2. `upload.single("file")` - Processes multipart/form-data, saves file, attaches to `req.file`
3. `uploadImage` or `uploadVideo` - Controller handles the response

### **3. Upload Controllers (`server/src/controllers/upload.controller.ts`)**

```typescript
import { Request, Response } from "express";

export const uploadImage = async (req: Request, res: Response) => {
  try {
    // Validate file presence
    if (!req.file) {
      console.log("❌ Image upload failed: No file provided");
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // Log file details
    console.log(
      `📸 Image upload started: ${req.file.originalname} (${req.file.size} bytes, ${req.file.mimetype})`
    );

    // Generate secure URL
    const protocol = process.env.NODE_ENV === "production" ? "https" : req.protocol;
    const host = req.get("host");

    if (!host) {
      console.error("❌ Image upload failed: No host header found");
      return res.status(500).json({
        success: false,
        message: "Server configuration error",
      });
    }

    // Construct the full URL
    const imageUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

    // Log successful upload
    console.log(`✅ Image uploaded successfully: ${req.file.filename} -> ${imageUrl}`);

    // Return response
    res.status(200).json({
      success: true,
      url: imageUrl,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype,
    });
  } catch (error) {
    console.error("❌ Image upload error:", error);

    let errorMessage = "Image upload failed";
    let statusCode = 500;

    if (error instanceof Error) {
      if (error.message.includes("ENOSPC")) {
        errorMessage = "Insufficient disk space";
        statusCode = 507; // Insufficient Storage
      } else if (error.message.includes("EACCES")) {
        errorMessage = "Permission denied";
        statusCode = 403;
      } else if (error.message.includes("ENOENT")) {
        errorMessage = "Upload directory not found";
        statusCode = 500;
      }
    }

    res.status(statusCode).json({
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
};

export const uploadVideo = async (req: Request, res: Response) => {
  // Same structure as uploadImage, but for videos
  // ... (see code above for full implementation)
};
```

**Key Points:**
- Validates `req.file` exists (set by Multer)
- Generates full URL using protocol and host
- Returns URL, filename, size, and mimetype
- Handles various error types with appropriate status codes

### **4. Main Server Setup (`server/src/index.ts`)**

```typescript
import express from "express";
import path from "path";
import uploadRoutes from "./routes/upload";

const app = express();

// ... other middleware ...

// Register upload routes
app.use("/api/upload", uploadRoutes);

// Serve static uploads with environment-aware path
const getStaticUploadsPath = (): string => {
  const platformPaths = {
    RENDER_PERSISTENT_DISK_PATH: process.env.RENDER_PERSISTENT_DISK_PATH,
    VOLUME_MOUNT_PATH: process.env.VOLUME_MOUNT_PATH,
    LOCAL_UPLOAD_PATH: path.join(__dirname, "../uploads"),
  };

  for (const [key, value] of Object.entries(platformPaths)) {
    if (value) {
      console.log(`🌐 Using static uploads path for ${key}: ${value}`);
      return value;
    }
  }

  const fallbackPath = path.join(__dirname, "../uploads");
  console.log(`🌐 Using fallback static uploads path: ${fallbackPath}`);
  return fallbackPath;
};

const staticUploadsPath = getStaticUploadsPath();

// Serve uploaded files as static assets
app.use("/uploads", express.static(staticUploadsPath));

// ... rest of server setup ...
```

**Key Points:**
- Registers upload routes at `/api/upload`
- Serves uploaded files at `/uploads` endpoint
- Uses same environment-aware path logic as Multer

---

## 💾 Storage Configuration (Render)

### **Render Premium Persistent Disk Setup**

#### **Step 1: Create Persistent Disk**

1. Go to Render dashboard → Your backend service
2. Navigate to **"Disks"** tab
3. Click **"Create Disk"**
4. Configure:
   - **Name**: `uploads-storage`
   - **Size**: Start with 10GB (can increase later)
   - **Mount Path**: `/var/data`
   - **File System**: `ext4`

#### **Step 2: Set Environment Variable**

In Render dashboard → Environment Variables, add:

```env
RENDER_PERSISTENT_DISK_PATH=/var/data/uploads
```

**Important:** The path should be `/var/data/uploads` (not just `/var/data`), as the code will create the `uploads` subdirectory.

#### **Step 3: Verify Setup**

After deployment, check logs for:

```
📁 Using upload directory for RENDER_PERSISTENT_DISK_PATH: /var/data/uploads
✅ Upload directory already exists: /var/data/uploads
🌐 Using static uploads path for RENDER_PERSISTENT_DISK_PATH: /var/data/uploads
```

### **Local Development Setup**

For local development, files are stored in:

```
server/uploads/
```

No environment variable needed - the code falls back to this path automatically.

### **Environment Variable Priority**

The system checks environment variables in this order:

1. `RENDER_PERSISTENT_DISK_PATH` (Render Premium)
2. `VOLUME_MOUNT_PATH` (Generic volume mount)
3. `LOCAL_UPLOAD_PATH` (Local development - auto-set)

---

## 🌐 File Serving

### **How Files Are Served**

1. **Upload Process:**
   - File saved to: `/var/data/uploads/1703123456789-123456789.jpg`
   - Server returns URL: `https://your-domain.com/uploads/1703123456789-123456789.jpg`

2. **Serving Process:**
   - Request: `GET https://your-domain.com/uploads/1703123456789-123456789.jpg`
   - Express static middleware matches `/uploads` route
   - Serves file from: `/var/data/uploads/1703123456789-123456789.jpg`

### **URL Structure**

```
https://your-backend-domain.onrender.com/uploads/filename.jpg
```

The `/uploads` path is handled by:
```typescript
app.use("/uploads", express.static(staticUploadsPath));
```

### **CORS Configuration**

Make sure your CORS settings allow file access:

```typescript
const corsOptions = {
  origin: function (origin: string | undefined, callback: Function) {
    // Allow your frontend domain
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: false,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
```

---

## ⚠️ Error Handling

### **Frontend Error Handling**

```typescript
try {
  const media = await uploadMedia();
  // ... continue with form submission
} catch (uploadErr: any) {
  let errorMessage = "Failed to upload media files.";
  let errorType = "upload";
  let retryable = true;

  // Determine error type
  if (uploadErr?.response?.status === 401) {
    errorMessage = "Authentication expired. Please log in again.";
    errorType = "api";
    retryable = false;
  } else if (uploadErr?.response?.status === 403) {
    errorMessage = "Access denied. You don't have permission to upload files.";
    errorType = "api";
    retryable = false;
  } else if (uploadErr?.response?.status === 413) {
    errorMessage = "File too large. Please reduce file size and try again.";
    errorType = "upload";
    retryable = true;
  } else if (uploadErr?.response?.status >= 500) {
    errorMessage = "Server error during upload. Please try again.";
    errorType = "upload";
    retryable = true;
  } else if (uploadErr?.message?.includes("Network Error")) {
    errorMessage = "Network connection failed. Please check your internet connection.";
    errorType = "network";
    retryable = true;
  }

  setError({
    message: errorMessage,
    type: errorType,
    retryable,
  });

  throw uploadErr;
}
```

### **Backend Error Handling**

```typescript
// Multer errors
if (error instanceof multer.MulterError) {
  if (error.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({
      success: false,
      message: "File too large",
    });
  }
  if (error.code === "LIMIT_FILE_COUNT") {
    return res.status(400).json({
      success: false,
      message: "Too many files",
    });
  }
}

// File system errors
if (error instanceof Error) {
  if (error.message.includes("ENOSPC")) {
    return res.status(507).json({
      success: false,
      message: "Insufficient disk space",
    });
  }
  if (error.message.includes("EACCES")) {
    return res.status(403).json({
      success: false,
      message: "Permission denied",
    });
  }
}
```

### **Common Error Codes**

| Status Code | Meaning | Solution |
|------------|---------|----------|
| 400 | No file provided | Check frontend file input |
| 401 | Unauthorized | Check JWT token |
| 403 | Permission denied | Check disk permissions |
| 413 | File too large | Reduce file size |
| 500 | Server error | Check server logs |
| 507 | Insufficient storage | Increase disk size |

---

## 🚀 Step-by-Step Implementation

### **For a New Project:**

#### **1. Install Dependencies**

```bash
# Backend
npm install multer express
npm install --save-dev @types/multer

# Frontend (if using axios)
npm install axios
```

#### **2. Backend Setup**

**a. Create `server/src/middlewares/multer.ts`** (copy from guide above)

**b. Create `server/src/controllers/upload.controller.ts`** (copy from guide above)

**c. Create `server/src/routes/upload.ts`** (copy from guide above)

**d. Update `server/src/index.ts`:**

```typescript
import uploadRoutes from "./routes/upload";

// ... other code ...

app.use("/api/upload", uploadRoutes);

// Static file serving
const getStaticUploadsPath = (): string => {
  // ... (copy from guide above)
};

app.use("/uploads", express.static(getStaticUploadsPath()));
```

#### **3. Frontend Setup**

**a. Create `client/src/services/upload.ts`** (copy from guide above)

**b. Create `client/src/services/api.ts`:**

```typescript
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  withCredentials: false,
});

export default api;
```

**c. Use in your form component** (see Frontend Implementation section)

#### **4. Environment Variables**

**Local Development (.env):**
```env
# No RENDER_PERSISTENT_DISK_PATH needed - uses local fallback
```

**Render Production:**
```env
RENDER_PERSISTENT_DISK_PATH=/var/data/uploads
```

#### **5. Test Upload**

1. Start backend: `npm run dev` (or `npm start`)
2. Start frontend: `npm run dev`
3. Upload a test image
4. Check `server/uploads/` directory (local) or Render logs (production)
5. Verify file is accessible via URL

---

## 📝 Code Examples

### **Complete Upload Flow Example**

```typescript
// 1. User selects file
const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    // Validate
    if (file.size > MAX_SIZE) {
      toast.error("File too large");
      return;
    }
    // Store in state
    setSelectedFile(file);
  }
};

// 2. Upload on form submit
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    // Upload file
    const fileUrl = await uploadImage(selectedFile);
    
    // Save URL to database
    await api.post("/portfolio", {
      title: formData.title,
      thumbnailUrl: fileUrl, // Use the returned URL
    });
    
    toast.success("Uploaded successfully!");
  } catch (error) {
    toast.error("Upload failed");
  }
};
```

### **Multiple File Upload Example**

```typescript
const uploadMultipleFiles = async (files: File[]) => {
  const uploadedUrls: string[] = [];
  
  for (const file of files) {
    try {
      const url = await uploadImage(file);
      uploadedUrls.push(url);
    } catch (error) {
      console.error(`Failed to upload ${file.name}:`, error);
    }
  }
  
  return uploadedUrls;
};
```

### **Progress Tracking Example**

```typescript
const uploadWithProgress = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  
  const response = await api.post("/upload/image", formData, {
    headers: { Authorization: `Bearer ${getToken()}` },
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / (progressEvent.total || 1)
      );
      setUploadProgress(percentCompleted);
    },
  });
  
  return response.data.url;
};
```

---

## 🔍 Troubleshooting

### **Problem: Files Not Uploading**

**Symptoms:**
- Request fails with 400/500 error
- No file in upload directory

**Solutions:**
1. Check file size (must be < 100MB)
2. Check file type (must be allowed MIME type)
3. Check JWT token is valid
4. Check server logs for errors
5. Verify upload directory exists and is writable

### **Problem: Files Not Persisting (Render)**

**Symptoms:**
- Files disappear after restart
- Files not found after deployment

**Solutions:**
1. Verify `RENDER_PERSISTENT_DISK_PATH` is set
2. Check persistent disk is mounted correctly
3. Verify path in logs matches environment variable
4. Check disk size (may be full)

### **Problem: Files Not Accessible via URL**

**Symptoms:**
- 404 error when accessing `/uploads/filename.jpg`
- Image/video doesn't load in browser

**Solutions:**
1. Verify static file serving is configured:
   ```typescript
   app.use("/uploads", express.static(staticUploadsPath));
   ```
2. Check file actually exists in directory
3. Verify URL matches filename exactly
4. Check CORS settings allow file access
5. Verify protocol (http vs https) matches environment

### **Problem: CORS Errors**

**Symptoms:**
- Browser console shows CORS error
- Request blocked by browser

**Solutions:**
1. Add frontend domain to CORS allowed origins
2. Verify `withCredentials` setting matches
3. Check preflight OPTIONS request is handled
4. Ensure Authorization header is allowed

### **Problem: "No file uploaded" Error**

**Symptoms:**
- Backend returns 400 with "No file uploaded"

**Solutions:**
1. Verify FormData is being sent correctly
2. Check field name matches: `formData.append("file", file)`
3. Don't manually set Content-Type header
4. Verify file is not null/undefined

### **Problem: Permission Denied**

**Symptoms:**
- Error: `EACCES: permission denied`

**Solutions:**
1. Check disk permissions (should be writable)
2. Verify service user has write access
3. Check directory exists and is accessible
4. Contact Render support if needed

### **Problem: Disk Space Full**

**Symptoms:**
- Error: `ENOSPC: no space left on device`

**Solutions:**
1. Increase disk size in Render dashboard
2. Delete old/unused files
3. Implement file cleanup routine
4. Monitor disk usage

---

## ✅ Checklist for Implementation

### **Backend:**
- [ ] Multer middleware configured
- [ ] Upload routes created
- [ ] Upload controllers implemented
- [ ] Static file serving configured
- [ ] Authentication middleware applied
- [ ] Error handling implemented
- [ ] Environment variables set (Render)

### **Frontend:**
- [ ] Upload service created
- [ ] API client configured
- [ ] File validation implemented
- [ ] Progress tracking added
- [ ] Error handling implemented
- [ ] Form integration complete

### **Deployment:**
- [ ] Persistent disk created (Render)
- [ ] Environment variable set
- [ ] Upload directory exists
- [ ] File serving working
- [ ] CORS configured correctly
- [ ] Tested file upload
- [ ] Tested file access

---

## 📚 Additional Resources

- [Multer Documentation](https://github.com/expressjs/multer)
- [Express Static Files](https://expressjs.com/en/starter/static-files.html)
- [FormData API](https://developer.mozilla.org/en-US/docs/Web/API/FormData)
- [Render Persistent Disks](https://render.com/docs/disks)

---

## 🎉 Summary

This file upload system provides:

1. **Secure uploads** with JWT authentication
2. **File validation** for type and size
3. **Persistent storage** on Render Premium disk
4. **Static file serving** via Express
5. **Error handling** with retry mechanisms
6. **Progress tracking** for better UX

The system is production-ready and handles edge cases gracefully. Follow the step-by-step guide to implement it in your project!

---

**Last Updated:** 2024
**Version:** 1.0.0

