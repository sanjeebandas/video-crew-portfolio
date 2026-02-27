import multer from "multer";
import path from "path";
import fs from "fs";

// Environment-aware upload directory configuration
const getUploadDir = (): string => {
  const isDev = process.env.NODE_ENV !== "production";
  const localPath = path.join(__dirname, "../../uploads");

  // In development, always use a local path to avoid permission issues (e.g. /var/data on Render)
  if (isDev) {
    console.log(`📁 Using local upload directory (development): ${localPath}`);
    return localPath;
  }

  // Production: use platform paths if set
  const renderPath = process.env.RENDER_PERSISTENT_DISK_PATH || "";
  const volumePath = process.env.VOLUME_MOUNT_PATH || "";

  if (renderPath) {
    console.log(`Using upload directory for RENDER_PERSISTENT_DISK_PATH: ${renderPath}`);
    return renderPath;
  }
  if (volumePath) {
    console.log(`Using upload directory for VOLUME_MOUNT_PATH: ${volumePath}`);
    return volumePath;
  }

  console.log(`📁 Using fallback upload directory: ${localPath}`);
  return localPath;
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
