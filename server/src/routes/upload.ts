import { Router } from "express";
import { uploadImage, uploadVideo } from "../controllers/upload.controller";
import { upload } from "../middlewares/multer";
import { authenticateAdmin } from "../middlewares/auth.middleware";

const router = Router();

router.post("/image", authenticateAdmin, upload.single("file"), uploadImage);
router.post("/video", authenticateAdmin, upload.single("file"), uploadVideo);

export default router;
