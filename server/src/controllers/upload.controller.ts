import { Request, Response } from "express";

export const uploadImage = async (req: Request, res: Response) => {
  try {
    // Validate file presence
    if (!req.file) {
      console.log("❌ Image upload failed: No file provided");
      return res.status(400).json({ 
        success: false, 
        message: "No file uploaded" 
      });
    }

    // Log file details for debugging
    console.log(`📸 Image upload started: ${req.file.originalname} (${req.file.size} bytes, ${req.file.mimetype})`);

    const imageUrl = `/uploads/${req.file.filename}`;
    
    // Log successful upload
    console.log(`✅ Image uploaded successfully: ${req.file.filename} -> ${imageUrl}`);
    
    res.status(200).json({ 
      success: true, 
      url: imageUrl,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype
    });
  } catch (error) {
    console.error('❌ Image upload error:', error);
    
    // Determine error type and message
    let errorMessage = "Image upload failed";
    let statusCode = 500;
    
    if (error instanceof Error) {
      if (error.message.includes('ENOSPC')) {
        errorMessage = "Insufficient disk space";
        statusCode = 507; // Insufficient Storage
      } else if (error.message.includes('EACCES')) {
        errorMessage = "Permission denied";
        statusCode = 403;
      } else if (error.message.includes('ENOENT')) {
        errorMessage = "Upload directory not found";
        statusCode = 500;
      }
    }
    
    res.status(statusCode).json({ 
      success: false, 
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

export const uploadVideo = async (req: Request, res: Response) => {
  try {
    // Validate file presence
    if (!req.file) {
      console.log("❌ Video upload failed: No file provided");
      return res.status(400).json({ 
        success: false, 
        message: "No file uploaded" 
      });
    }

    // Log file details for debugging
    console.log(`🎥 Video upload started: ${req.file.originalname} (${req.file.size} bytes, ${req.file.mimetype})`);

    const videoUrl = `/uploads/${req.file.filename}`;
    
    // Log successful upload
    console.log(`✅ Video uploaded successfully: ${req.file.filename} -> ${videoUrl}`);
    
    res.status(200).json({ 
      success: true, 
      url: videoUrl,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype
    });
  } catch (error) {
    console.error('❌ Video upload error:', error);
    
    // Determine error type and message
    let errorMessage = "Video upload failed";
    let statusCode = 500;
    
    if (error instanceof Error) {
      if (error.message.includes('ENOSPC')) {
        errorMessage = "Insufficient disk space";
        statusCode = 507; // Insufficient Storage
      } else if (error.message.includes('EACCES')) {
        errorMessage = "Permission denied";
        statusCode = 403;
      } else if (error.message.includes('ENOENT')) {
        errorMessage = "Upload directory not found";
        statusCode = 500;
      }
    }
    
    res.status(statusCode).json({ 
      success: false, 
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};
