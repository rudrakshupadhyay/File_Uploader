import { Router } from "express";
import {
  uploadFile,
  uploadFileController,
  openFolderController,
  deleteFileController,
  downloadFileController,
  viewFileController,
} from "../controllers/fileControllers.js";

const router = Router();

router.get("/:id", openFolderController);
router.post("/:id/upload", uploadFile, uploadFileController);
router.delete("/:id/delete/:fileId", deleteFileController);
router.get("/:id/download/:fileId", downloadFileController);
router.get("/:id/view/:fileId", viewFileController);
export default router;
