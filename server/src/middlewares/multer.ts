import multer from "multer";
import path from "path";
import fs from "fs";

// Environment-aware upload directory configuration
const getUploadDir = (): string => {
  // Platform-specific environment variables
  const platformPaths = {
    // Render Premium persistent disk
    RENDER_PERSISTENT_DISK_PATH: process.env.RENDER_PERSISTENT_DISK_PATH, //make sure to add this in the .env file once RENDER subscription is activated
    // Generic volume mount
    VOLUME_MOUNT_PATH: process.env.VOLUME_MOUNT_PATH,
    // Local development fallback
    LOCAL_UPLOAD_PATH: path.join(__dirname, "../../uploads")
  };

  // Find first available platform path
  for (const [key, value] of Object.entries(platformPaths)) {
    if (value) {
      console.log(`📁 Using upload directory for ${key}: ${value}`);
      return value;
    }
  }

  // Final fallback (should never reach here)
  const fallbackPath = path.join(__dirname, "../../uploads");
  console.log(`📁 Using fallback upload directory: ${fallbackPath}`);
  return fallbackPath;
};

const uploadDir = getUploadDir();

// Create uploads directory with proper error handling
if (!fs.existsSync(uploadDir)) {
  try {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log(`✅ Created upload directory: ${uploadDir}`);
  } catch (error) {
    console.error('❌ Failed to create upload directory:', error);
    throw new Error(`Cannot create upload directory: ${uploadDir}. Error: ${error}`);
  }
} else {
  console.log(`✅ Upload directory already exists: ${uploadDir}`);
}

// File type validation function
const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  // Allowed file types
  const allowedImageTypes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp'
  ];
  
  const allowedVideoTypes = [
    'video/mp4',
    'video/mov',
    'video/avi',
    'video/webm',
    'video/quicktime'
  ];
  
  const isImage = allowedImageTypes.includes(file.mimetype);
  const isVideo = allowedVideoTypes.includes(file.mimetype);
  
  if (isImage || isVideo) {
    console.log(`✅ File type accepted: ${file.mimetype} for ${file.originalname}`);
    cb(null, true);
  } else {
    console.log(`❌ File type rejected: ${file.mimetype} for ${file.originalname}`);
    cb(new Error(`Invalid file type: ${file.mimetype}. Only images (JPEG, PNG, GIF, WebP) and videos (MP4, MOV, AVI, WebM) are allowed.`), false);
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

// Enhanced multer configuration with validation and limits
export const upload = multer({ 
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit (covers both images and videos)
    files: 1, // Only one file per request
    fieldSize: 10 * 1024 * 1024, // 10MB for other form fields
  },
  fileFilter
});
