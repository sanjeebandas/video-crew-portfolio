import { Router } from "express";
import { uploadImage, uploadVideo } from "../controllers/upload.controller";
import { upload } from "../middlewares/multer";
import { authenticateToken } from "../middlewares/auth.middleware";

const router = Router();

router.post("/image", authenticateToken, upload.single("file"), uploadImage);
router.post("/video", authenticateToken, upload.single("file"), uploadVideo);

export default router;
