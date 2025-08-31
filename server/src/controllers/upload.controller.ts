import { Request, Response } from "express";

export const uploadImage = (req: Request, res: Response) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: "No file uploaded" });
  }

  // Force HTTPS in production, use protocol detection in development
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : req.protocol;
  const imageUrl = `${protocol}://${req.get("host")}/uploads/${
    req.file.filename
  }`;
  res.status(200).json({ success: true, url: imageUrl });
};

export const uploadVideo = (req: Request, res: Response) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: "No file uploaded" });
  }

  // Force HTTPS in production, use protocol detection in development
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : req.protocol;
  const videoUrl = `${protocol}://${req.get("host")}/uploads/${
    req.file.filename
  }`;
  res.status(200).json({ success: true, url: videoUrl });
};
