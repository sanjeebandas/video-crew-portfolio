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

export const upload = multer({ storage });
